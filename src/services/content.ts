// Content fetching and interpretation service
import { supabase } from '@/integrations/supabase/client';
import { canonicalizeTopic, getLocalInterpretacao } from './content-helpers';

// Cache for content and interpretations
const contentCache = new Map<string, string>();
const interpretationCache = new Map<string, string | null>();

// Helper: extract readable text from various JSON shapes
function extractText(input: any): string {
  if (input == null) return '';
  if (typeof input === 'string') return input;
  if (Array.isArray(input)) return input.map(extractText).filter(Boolean).join('\n\n');
  if (typeof input === 'object') {
    // Direct text fields
    if (typeof (input as any).conteudo === 'string') return (input as any).conteudo;
    if (typeof (input as any).texto_integral === 'string') return (input as any).texto_integral;
    if (typeof (input as any).descricao === 'string') return (input as any).descricao;

    // Nested content object
    if ((input as any).conteudo && typeof (input as any).conteudo === 'object') {
      const nested = extractText((input as any).conteudo);
      if (nested) return nested;
    }

    // Numeric-key dictionary (e.g., {"1": "...", "2": {...}})
    const keys = Object.keys(input as any);
    const numericKeys = keys.filter(k => /^\d+$/.test(k)).sort((a, b) => parseInt(a) - parseInt(b));
    if (numericKeys.length > 0) {
      // For topic cards showing overview, combine all entries
      const parts = numericKeys.map(k => {
        const item = (input as any)[k];
        if (typeof item === 'string') return `${k}: ${item}`;
        if (typeof item === 'object') {
          const titulo = item.titulo || `Número ${k}`;
          const desc = item.descricao || item.texto_integral || extractText(item);
          return `${titulo}\n${desc}`;
        }
        return `${k}: ${extractText(item)}`;
      });
      return parts.join('\n\n');
    }
    
    // Non-numeric object - try to extract meaningful content
    const meaningfulKeys = Object.keys(input as any).filter(k => 
      !['id', 'topico', 'created_at', 'updated_at'].includes(k)
    );
    if (meaningfulKeys.length > 0) {
      return meaningfulKeys.map(k => extractText((input as any)[k])).filter(Boolean).join('\n\n');
    }
  }
  // Fallback
  try { return JSON.stringify(input); } catch { return String(input); }
}

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

    // Handle nested JSON content structure from Supabase
    let content = '';
    if (data?.conteudo !== undefined) {
      content = extractText(data.conteudo);
    } else {
      content = '';
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
  // Normalize hidden spaces and line breaks
  const normalized = raw
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width spaces
    .replace(/\u00A0/g, ' ') // non-breaking spaces
    .replace(/\r\n?|\r/g, '\n')
    .trim();
  console.log(`[parseContent] Parsing for number ${numeroStr}, raw content:`, normalized.substring(0, 200) + '...');
  
  const rawToUse = normalized;
  if (rawToUse.startsWith('{') || rawToUse.startsWith('[')) {
    try {
      const parsed = JSON.parse(rawToUse);
      console.log(`[parseContent] Parsed JSON structure:`, Array.isArray(parsed) ? 'array' : Object.keys(parsed));

      const containers: any[] = Array.isArray(parsed) ? parsed : [parsed, (parsed as any).conteudo, (parsed as any).data, (parsed as any).items];
      for (const container of containers) {
        if (!container || typeof container !== 'object') continue;
        const direct = (container as any)[numeroStr];
        if (direct != null) {
          const txt = extractText(direct);
          if (txt && txt.trim()) {
            console.log(`[parseContent] Found JSON content for ${numeroStr} in container`);
            return txt;
          }
        }
      }
    } catch (error) {
      console.warn('[parseContent] JSON parse error:', error);
    }
  }
  
  // Text parsing for non-JSON content
  const patterns = [
    // Simple: lines starting with the number
    new RegExp(`^\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=^\\s*(?:\\d+[.:\\s-]|$))`, 'm'),
    new RegExp(`(?:^|\\n)\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=\\n\\s*\\d+[.:\\s-]|$)`, 'g'),
    // Headings like "Motivação 3" or "Número 3"
    new RegExp(`(?:^|\\n)[^\\n]*?(?:Motiv[aã]?[cç][aã]o|Impress[aã]o|Express[aã]o|N[úu]mero)\\s*${numeroStr}[.:\\s-]*([\\s\\S]*?)(?=\\n[^\\n]*?(?:Motiv|Impress|Express|N[úu]mero)\\s*\\d+|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = rawToUse.match(pattern);
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
  // Try the requested topic, then its aliases
  const primary = await fetchConteudo(topico);
  if (primary && primary.trim()) return primary;

  const aliases = topicAliases[topico] || [];
  for (const alias of aliases) {
    const alt = await fetchConteudo(alias);
    if (alt && alt.trim()) return alt;
  }
  return null;
}

const topicAliases: Record<string, string[]> = {
  'motivacao': ['numero_motivacao', 'número_motivação'],
  'impressao': ['numero_impressao', 'número_impressão'],
  'expressao': ['numero_expressao', 'número_expressão'],
  'destino': ['numero_destino', 'número_destino'],
  'missao': ['numero_missao', 'número_missão'],
  'anjos': ['anjo_guardiao', 'anjo_da_guarda', 'guardian_angel'],
};