import { supabase } from '@/integrations/supabase/client';

export async function fetchConteudo(topico: string): Promise<string> {
  const topic = topico.trim();

  const candidates = [
    { op: 'eq' as const, value: topic },
    { op: 'ilike' as const, value: topic },
    { op: 'ilike' as const, value: `%${topic}%` },
    { op: 'ilike' as const, value: topic.toLowerCase() },
    { op: 'ilike' as const, value: `%${topic.toLowerCase()}%` },
  ];

  let row: { conteudo: any } | null = null;

  for (const c of candidates) {
    let query: any = supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .order('created_at', { ascending: false })
      .limit(1);

    query = c.op === 'eq' ? query.eq('topico', c.value) : query.ilike('topico', c.value);

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.warn(`[fetchConteudo] tentativa falhou (${c.op}:${c.value})`, error.message);
      continue;
    }

    if (data?.conteudo) {
      row = data as any;
      break;
    }
  }

  if (!row?.conteudo) {
    console.warn(`Nenhum conteúdo encontrado para tópico: ${topico}`);
    return '';
  }

  // Handle both string and object content formats
  let content = '';
  if (typeof row.conteudo === 'string') {
    content = row.conteudo;
  } else if (row.conteudo && typeof row.conteudo === 'object') {
    // Try to get content from nested object
    content = (row.conteudo as any)?.conteudo || '';
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[fetchConteudo] ${topico} -> ${content.length} chars`);
  }
  
  return content;
}

type Blocks = Record<string, string>;

export function splitByHeading(
  raw: string,
  heading: RegExp,
  captureGroup = 1
): Blocks {
  const blocks: Blocks = {};
  const lines = raw.split('\n');
  let currentKey = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const match = line.match(heading);
    
    if (match && match[captureGroup]) {
      // Save previous block if exists
      if (currentKey && currentContent.length > 0) {
        blocks[currentKey] = currentContent.join('\n').trim();
      }
      
      // Start new block
      currentKey = match[captureGroup];
      currentContent = [line]; // Include the heading line
    } else if (currentKey) {
      currentContent.push(line);
    }
  }

  // Save last block
  if (currentKey && currentContent.length > 0) {
    blocks[currentKey] = currentContent.join('\n').trim();
  }

  return blocks;
}

const headingPatterns: Record<string, RegExp> = {
  motivacao: /^(?:#+\s*)?(?:Motiva[cç][aã]o)\s+(11|22|[1-9]):?\s*$/im,
  impressao: /^(?:#+\s*)?(?:Impress[aã]o)\s+(11|22|[1-9]):?\s*$/im,
  expressao: /^(?:#+\s*)?(?:Express[aã]o)\s+(11|22|[1-9]):?\s*$/im,
  destino: /^(?:#+\s*)?(?:Destino)\s+(11|22|[1-9]):?\s*$/im,
  missao: /^(?:#+\s*)?(?:Miss[aã]o)\s+(11|22|[1-9]):?\s*$/im,
  numero_psiquico: /^(?:#+\s*)?(?:N[uú]mero\s+Ps[ií]quico)\s+(11|22|[1-9]):?\s*$/im,
  resposta_subconsciente: /^(?:#+\s*)?(?:Resposta\s+Subconsciente)\s+([2-9]):?\s*$/im,
  ano_pessoal: /^(?:#+\s*)?(?:Ano\s+Pessoal)\s+([1-9]):?\s*$/im,
  mes_pessoal: /^(?:#+\s*)?(?:M[eê]s\s+Pessoal)\s+(11|22|[1-9]):?\s*$/im,
  dia_pessoal: /^(?:#+\s*)?(?:Dia\s+Pessoal)\s+(11|22|[1-9]):?\s*$/im,
  desafios: /^(?:#+\s*)?(?:Desafios?)\s+([0-9]):?\s*$/im,
  primeiro_momento: /^(?:#+\s*)?(?:Primeiro\s+Momento\s+Decisivo)\s+(11|22|[1-9]):?\s*$/im,
  segundo_momento: /^(?:#+\s*)?(?:Segundo\s+Momento\s+Decisivo)\s+(11|22|[1-9]):?\s*$/im,
  terceiro_momento: /^(?:#+\s*)?(?:Terceiro\s+Momento\s+Decisivo)\s+(11|22|[1-9]):?\s*$/im,
  quarto_momento: /^(?:#+\s*)?(?:Quarto\s+Momento\s+Decisivo)\s+(11|22|[1-9]):?\s*$/im,
  arcanos: /^(?:#+\s*)?(?:Arcanos?)\s+([0-9]{1,2}):?\s*$/im,
};

// Cache for parsed content
const contentCache = new Map<string, Blocks>();

export async function getInterpretacao(topico: string, numero: number | string): Promise<string | null> {
  const cacheKey = topico;
  
  if (!contentCache.has(cacheKey)) {
    // Robust fetch: try multiple matching strategies and pick the latest row
    const topic = topico.trim();
    const candidates = [
      { op: 'eq' as const, value: topic },
      { op: 'ilike' as const, value: topic },
      { op: 'ilike' as const, value: `%${topic}%` },
      { op: 'ilike' as const, value: topic.toLowerCase() },
      { op: 'ilike' as const, value: `%${topic.toLowerCase()}%` },
    ];

    let row: { conteudo: any } | null = null;

    for (const c of candidates) {
      let query: any = supabase
        .from('conteudos_numerologia')
        .select('conteudo')
        .order('created_at', { ascending: false })
        .limit(1);

      query = c.op === 'eq' ? query.eq('topico', c.value) : query.ilike('topico', c.value);

      const { data, error } = await query.maybeSingle();
      if (error) {
        console.warn(`[getInterpretacao] tentativa falhou (${c.op}:${c.value})`, error.message);
        continue;
      }
      if (data?.conteudo) {
        row = data as any;
        break;
      }
    }

    if (!row?.conteudo) {
      console.warn(`Nenhum conteúdo encontrado para tópico: ${topico}`);
      contentCache.set(cacheKey, {});
    } else {
      const raw = row.conteudo as any;
      let blocks: Blocks = {};

      if (typeof raw === 'string') {
        const pattern = headingPatterns[topico];
        if (pattern) {
          blocks = splitByHeading(raw, pattern);
        } else {
          // When we don't have a pattern, store the whole content
          blocks['__all__'] = raw;
        }
      } else if (typeof raw === 'object') {
        // Flatten JSON into blocks: direct key -> value
        for (const [key, value] of Object.entries(raw)) {
          if (value == null) continue;
          blocks[String(key)] = String(value);
        }
        // Also support nested { conteudo: string }
        if (!Object.keys(blocks).length && (raw as any).conteudo) {
          blocks['__all__'] = String((raw as any).conteudo);
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[parse] ${topico} -> blocos:`, Object.keys(blocks));
      }
      contentCache.set(cacheKey, blocks);
    }
  }
  
  const blocks = contentCache.get(cacheKey) || {};
  const key = String(numero);

  if (blocks[key]) return blocks[key];

  // Case-insensitive lookup for string keys (e.g., nomes de anjos)
  const ci = Object.entries(blocks).find(([k]) => k.toLowerCase() === key.toLowerCase());
  if (ci) return ci[1];

  // Fallback to full content when available
  if (blocks['__all__']) return blocks['__all__'];

  return null;
}

export async function getInterpretacaoMomento(
  momento: 'primeiro' | 'segundo' | 'terceiro' | 'quarto',
  numero: number | string
): Promise<string | null> {
  return getInterpretacao(`${momento}_momento`, numero);
}

export async function getTextoTopico(topico: string): Promise<string | null> {
  return fetchConteudo(topico);
}