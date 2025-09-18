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
    console.log(`[fetchConteudo] Fetching content for topic: ${topico}`);
    
    // Try exact match first
    let { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .maybeSingle();

    if (error || !data) {
      console.log(`[fetchConteudo] Exact match failed for ${topico}, trying case-insensitive`);
      // Try case-insensitive match
      const { data: allData, error: allError } = await supabase
        .from('conteudos_numerologia')
        .select('topico, conteudo');

      if (!allError && allData) {
        const found = allData.find(item => 
          item.topico.toLowerCase() === topico.toLowerCase()
        );
        if (found) {
          console.log(`[fetchConteudo] Found case-insensitive match: ${found.topico}`);
          data = { conteudo: found.conteudo };
        }
      }
    }

    // Handle JSON content properly
    let content = '';
    if (data?.conteudo) {
      const rawContent = data.conteudo;
      console.log(`[fetchConteudo] Raw content type:`, typeof rawContent, rawContent);
      
      if (typeof rawContent === 'string') {
        content = rawContent;
      } else if (typeof rawContent === 'object') {
        // If it's already a parsed JSON object, stringify it for parsing
        content = JSON.stringify(rawContent);
      } else {
        content = String(rawContent);
      }
    }

    console.log(`[fetchConteudo] Final content for ${topico}:`, content.substring(0, 200) + '...');
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
  console.log(`[parseContent] Parsing for number ${numeroStr}, raw content:`, raw.substring(0, 200) + '...');
  
  if (raw.startsWith('{') || raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      console.log(`[parseContent] Parsed JSON structure:`, Object.keys(parsed));
      
      const direct = parsed[numeroStr];
      console.log(`[parseContent] Direct lookup for ${numeroStr}:`, direct);
      
      if (typeof direct === 'string' && direct.trim()) {
        console.log(`[parseContent] Found direct string for ${numeroStr}`);
        return direct;
      }
      if (direct?.texto_integral) {
        console.log(`[parseContent] Found texto_integral for ${numeroStr}`);
        return direct.texto_integral;
      }
      if (direct?.conteudo) {
        console.log(`[parseContent] Found conteudo for ${numeroStr}`);
        return direct.conteudo;
      }
    } catch (error) {
      console.warn('[parseContent] JSON parse error:', error);
    }
  }
  
  // Text parsing for non-JSON content
  const patterns = [
    new RegExp(`^\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=^\\s*(?:\\d+[.:\\s-]|$))`, 'm'),
    new RegExp(`(?:^|\\n)\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=\\n\\s*\\d+[.:\\s-]|$)`, 'g'),
  ];
  
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]?.trim()) {
      const content = match[1].trim();
      if (content.length > 10) {
        console.log(`[parseContent] Found text content for ${numeroStr}`);
        return content;
      }
    }
  }
  
  console.log(`[parseContent] No content found for ${numeroStr}`);
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