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
    // Format JSON object content properly
    const obj = row.conteudo as any;
    if (obj.titulo && obj.descricao) {
      content = `# ${obj.titulo}\n\n${obj.descricao}`;
      if (obj.caracteristicas && Array.isArray(obj.caracteristicas)) {
        content += `\n\n## Características:\n${obj.caracteristicas.map((c: string) => `- ${c}`).join('\n')}`;
      }
      if (obj.conselhos && Array.isArray(obj.conselhos)) {
        content += `\n\n## Conselhos:\n${obj.conselhos.map((c: string) => `- ${c}`).join('\n')}`;
      }
    } else if (obj.conteudo) {
      content = String(obj.conteudo);
    } else {
      // Fallback: join all string values
      content = Object.values(obj).filter(v => typeof v === 'string').join('\n\n');
    }
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
  // Unified moments pattern - use single topic "momentos_decisivos" for all 4 moments
  momentos_decisivos: /^(?:#+\s*)?(?:(?:Primeiro|Segundo|Terceiro|Quarto)\s+Momento\s+Decisivo)\s+(11|22|[1-9]):?\s*$/im,
  // Keep individual patterns for backward compatibility
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
        // Handle complex JSON structures from Supabase
        const processJsonValue = (value: any): string => {
          if (typeof value === 'string') return value;
          if (typeof value === 'object' && value !== null) {
            // If it's an object with properties, build a formatted string
            const parts: string[] = [];
            if (value.titulo) parts.push(`**${value.titulo}**`);
            if (value.descricao) parts.push(value.descricao);
            if (value.caracteristicas && Array.isArray(value.caracteristicas)) {
              parts.push(`\n**Características:** ${value.caracteristicas.join(', ')}`);
            }
            if (value.aspectos_positivos && Array.isArray(value.aspectos_positivos)) {
              parts.push(`\n**Aspectos Positivos:** ${value.aspectos_positivos.join(', ')}`);
            }
            if (value.desafios && Array.isArray(value.desafios)) {
              parts.push(`\n**Desafios:** ${value.desafios.join(', ')}`);
            }
            return parts.length > 0 ? parts.join('\n\n') : JSON.stringify(value);
          }
          return String(value);
        };

        // Flatten JSON into blocks: direct key -> formatted value
        for (const [key, value] of Object.entries(raw)) {
          if (value == null) continue;
          blocks[String(key)] = processJsonValue(value);
        }
        
        // Also support nested { conteudo: string }
        if (!Object.keys(blocks).length && (raw as any).conteudo) {
          blocks['__all__'] = processJsonValue((raw as any).conteudo);
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
  if (blocks['__all__']) {
    // For full content, get first paragraph as fallback
    const firstParagraph = blocks['__all__'].split('\n\n')[0];
    return firstParagraph || blocks['__all__'];
  }

  // Last resort: generic message but never null
  return `Interpretação para ${topico} ${numero} em preparação. Consulte um numerólogo para análise completa.`;
}

export async function getInterpretacaoMomento(
  momento: 'primeiro' | 'segundo' | 'terceiro' | 'quarto',
  numero: number | string
): Promise<string | null> {
  // Try unified topic first, then fall back to individual topics, then aliases
  let result = await getInterpretacao('momentos_decisivos', numero);
  if (!result) {
    result = await getInterpretacao('momento_decisivo', numero);
  }
  if (!result) {
    result = await getInterpretacao(`${momento}_momento`, numero);
  }
  return result;
}

// Topic aliases for compatibility
const topicAliases: Record<string, string[]> = {
  'anjo_guarda': ['seu_anjo'],
  'momento_decisivo': ['momentos_decisivos'],
  'cores_do_dia': ['cores_pessoais'],
  'dias_beneficos': ['dias_favoraveis'],
  'triangulo_da_vida': ['triangulo_invertido'],
  'arcano': ['arcanos'],
  'sintese_final': ['conclusao']
};

export async function getTextoTopico(topico: string): Promise<string | null> {
  // First try the exact topic
  let result = await fetchConteudo(topico);
  
  if (!result) {
    // Try aliases
    const aliases = topicAliases[topico] || [];
    for (const alias of aliases) {
      result = await fetchConteudo(alias);
      if (result) break;
    }
    
    // Try reverse lookup
    if (!result) {
      for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
        if (aliasArray.includes(topico)) {
          result = await fetchConteudo(mainTopic);
          if (result) break;
        }
      }
    }
  }
  
  return result;
}
