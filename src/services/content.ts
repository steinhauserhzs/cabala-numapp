import { supabase } from '@/integrations/supabase/client';

export async function fetchConteudo(topico: string): Promise<string> {
  const { data, error } = await supabase
    .from('conteudos_numerologia')
    .select('conteudo')
    .eq('topico', topico)
    .maybeSingle();

  if (error) {
    console.error(`Erro ao buscar conteúdo para ${topico}:`, error);
    return '';
  }

  if (!data?.conteudo) {
    console.warn(`Nenhum conteúdo encontrado para tópico: ${topico}`);
    return '';
  }

  // Handle both string and object content formats
  let content = '';
  if (typeof data.conteudo === 'string') {
    content = data.conteudo;
  } else if (data.conteudo && typeof data.conteudo === 'object') {
    // Try to get content from nested object
    content = (data.conteudo as any)?.conteudo || '';
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
    const rawContent = await fetchConteudo(topico);
    if (!rawContent) return null;
    
    const pattern = headingPatterns[topico];
    if (!pattern) return rawContent; // Return full content if no pattern
    
    const blocks = splitByHeading(rawContent, pattern);
    // Debug: log parsed keys once per topic
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[parse] ${topico} -> blocos:`, Object.keys(blocks));
    }
    contentCache.set(cacheKey, blocks);
  }
  
  const blocks = contentCache.get(cacheKey);
  return blocks?.[String(numero)] || null;
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