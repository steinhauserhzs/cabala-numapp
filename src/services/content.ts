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
    return '';
  }

  // Handle both string and object content formats
  const content = typeof data.conteudo === 'string' 
    ? data.conteudo 
    : (data.conteudo as any)?.conteudo;
    
  return content || '';
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
  motivacao: /^(?:Motiva[cç][aã]o)\s+(11|22|[1-9])\b/im,
  impressao: /^(?:Impress[aã]o)\s+([1-9])\b/im,
  expressao: /^(?:Express[aã]o)\s+(11|22|[1-9])\b/im,
  destino: /^(?:Destino)\s+(11|22|[1-9])\b/im,
  missao: /^(?:Miss[aã]o)\s+(11|22|[1-9])\b/im,
  numero_psiquico: /^(?:N[uú]mero\s+Ps[ií]quico)\s+([1-9])\b/im,
  resposta_subconsciente: /^(?:Resposta\s+Subconsciente)\s+([2-9])\b/im,
  ano_pessoal: /^(?:Ano\s+Pessoal)\s+([1-9])\b/im,
  mes_pessoal: /^(?:M[eê]s\s+Pessoal)\s+(11|22|[1-9])\b/im,
  dia_pessoal: /^(?:Dia\s+Pessoal)\s+(11|22|[1-9])\b/im,
  desafios: /^(?:Desafio)\s+([0-9])\b/im,
  primeiro_momento: /^(?:Primeiro\s+Momento\s+Decisivo)\s+(11|22|[1-9])\b/im,
  segundo_momento: /^(?:Segundo\s+Momento\s+Decisivo)\s+(11|22|[1-9])\b/im,
  terceiro_momento: /^(?:Terceiro\s+Momento\s+Decisivo)\s+(11|22|[1-9])\b/im,
  quarto_momento: /^(?:Quarto\s+Momento\s+Decisivo)\s+(11|22|[1-9])\b/im,
  arcanos: /^(?:Arcano)\s+([0-9]{1,2})\b/im,
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