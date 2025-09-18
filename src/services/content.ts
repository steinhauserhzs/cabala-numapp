// Content fetching and interpretation service
import { supabase } from '@/integrations/supabase/client';
import { canonicalizeTopic, getLocalInterpretacao } from './content-helpers';

// Cache for content and interpretations
const contentCache = new Map<string, string>();
const interpretationCache = new Map<string, string | null>();

export async function fetchConteudo(topico: string): Promise<string> {
  if (contentCache.has(topico)) {
    return contentCache.get(topico)!;
  }

  try {
    // Try exact match first
    let { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .maybeSingle();

    if (error || !data) {
      // Try case-insensitive match
      const { data: allData, error: allError } = await supabase
        .from('conteudos_numerologia')
        .select('topico, conteudo');

      if (!allError && allData) {
        const found = allData.find(item => 
          item.topico.toLowerCase() === topico.toLowerCase()
        );
        if (found) {
          data = { conteudo: found.conteudo };
        }
      }
    }

    const content = data?.conteudo ? String(data.conteudo) : '';
    contentCache.set(topico, content);
    return content;
  } catch (error) {
    console.error(`[fetchConteudo] Error fetching ${topico}:`, error);
    contentCache.set(topico, '');
    return '';
  }
}

export async function getInterpretacao(topico: string, numero: number | string): Promise<string | null> {
  const numeroStr = String(numero);
  const cacheKey = `${topico}:${numeroStr}`;
  
  if (interpretationCache.has(cacheKey)) {
    return interpretationCache.get(cacheKey)!;
  }

  // Try original topic first
  const raw = await fetchConteudo(topico);
  if (raw.trim()) {
    const result = parseContent(raw, numeroStr);
    if (result) {
      interpretationCache.set(cacheKey, result);
      return result;
    }
  }

  // Try aliases
  const aliases = topicAliases[topico] || [];
  for (const alias of aliases) {
    const aliasRaw = await fetchConteudo(alias);
    if (aliasRaw.trim()) {
      const result = parseContent(aliasRaw, numeroStr);
      if (result) {
        interpretationCache.set(cacheKey, result);
        return result;
      }
    }
  }

  // Local fallback
  const fallback = getLocalInterpretacao(topico, Number(numeroStr));
  if (fallback) {
    interpretationCache.set(cacheKey, fallback);
    return fallback;
  }

  interpretationCache.set(cacheKey, null);
  return null;
}

function parseContent(raw: string, numeroStr: string): string | null {
  if (raw.startsWith('{') || raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      const direct = parsed[numeroStr];
      if (typeof direct === 'string') return direct;
      if (direct?.texto_integral) return direct.texto_integral;
      if (direct?.conteudo) return direct.conteudo;
    } catch (error) {
      console.warn('JSON parse error:', error);
    }
  }
  
  // Text parsing
  const patterns = [
    new RegExp(`^\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=^\\s*(?:\\d+[.:\\s-]|$))`, 'm'),
    new RegExp(`(?:^|\\n)\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=\\n\\s*\\d+[.:\\s-]|$)`, 'g'),
  ];
  
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]?.trim()) {
      const content = match[1].trim();
      if (content.length > 10) return content;
    }
  }
  
  return null;
}

export async function getTextoTopico(topico: string): Promise<string | null> {
  return await fetchConteudo(topico);
}

const topicAliases: Record<string, string[]> = {
  'motivacao': ['numero_motivacao', 'número_motivação'],
  'impressao': ['numero_impressao', 'número_impressão'],
  'expressao': ['numero_expressao', 'número_expressão'],
  'destino': ['numero_destino', 'número_destino'],
  'missao': ['numero_missao', 'número_missão'],
  'anjos': ['anjo_guardiao', 'anjo_da_guarda', 'guardian_angel'],
};