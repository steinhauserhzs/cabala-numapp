// Content fetching and interpretation service
import { supabase } from '@/integrations/supabase/client';
import { canonicalizeTopic, getLocalInterpretacao } from './content-helpers';

// Cache for content and interpretations
const contentCache = new Map<string, string>();
const interpretationCache = new Map<string, string | null>();

// Helper: extract readable text from various JSON shapes
export function extractText(input: any): string {
  if (input == null) return '';
  if (typeof input === 'string') return input;
  if (Array.isArray(input)) return input.map(extractText).filter(Boolean).join('\n\n');
  if (typeof input === 'object') {
    // Special handling for angel content structure
    if ((input as any).attributes && (input as any).attributes.nome) {
      const attrs = (input as any).attributes;
      const nome = attrs.nome || '';
      const descricao = attrs.hierarquia_descricao || '';
      const incenso = attrs.incenso || '';
      
      let result = nome;
      if (descricao) result += `\n${descricao}`;
      if (incenso) result += `\nIncenso: ${incenso}`;
      return result;
    }

    // Direct text fields - check all possible text field names
    if (typeof (input as any).text === 'string') return (input as any).text;
    if (typeof (input as any).content === 'string') return (input as any).content;
    if (typeof (input as any).conteudo === 'string') return (input as any).conteudo;
    if (typeof (input as any).texto_integral === 'string') return (input as any).texto_integral;
    if (typeof (input as any).descricao === 'string') return (input as any).descricao;
    if (typeof (input as any).titulo === 'string') return (input as any).titulo;
    if (typeof (input as any).nome === 'string') return (input as any).nome;

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
          return `${titulo}: ${desc}`;
        }
        return `${k}: ${extractText(item)}`;
      });
      return parts.join('\n\n');
    }
    
    // Handle structured content with title/description pattern
    if ((input as any).title && ((input as any).description || (input as any).content)) {
      const title = (input as any).title;
      const content = (input as any).description || (input as any).content;
      return `${title}\n${extractText(content)}`;
    }
    
    // Non-numeric object - try to extract meaningful content
    const meaningfulKeys = Object.keys(input as any).filter(k => 
      !['id', 'topico', 'created_at', 'updated_at', 'number', 'source', 'topic'].includes(k)
    );
    if (meaningfulKeys.length > 0) {
      const parts = meaningfulKeys.map(k => {
        const value = extractText((input as any)[k]);
        return value && value.trim() ? value : null;
      }).filter(Boolean);
      return parts.join('\n\n');
    }
  }
  return '';
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

// Helper para normalizar strings para busca
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s-]+/g, '_') // Troca espaços e hífens por underscore
    .trim();
}

export async function getInterpretacao(topico: string, numero: number | string): Promise<string | null> {
  const numeroStr = numero.toString().padStart(2, '0');
  const topicoNormalizado = slugify(topico);
  const chaveCompleta = `${topicoNormalizado}_${numeroStr}`;
  
  // Verificar cache primeiro
  if (interpretationCache.has(chaveCompleta)) {
    return interpretationCache.get(chaveCompleta)!;
  }

  // Lista de variações para tentar
  const variacoes = [
    `${topico}_${numeroStr}`,
    `${topicoNormalizado}_${numeroStr}`,
    `${topico.replace(/_/g, '-')}_${numeroStr}`,
    `${topico.replace(/-/g, '_')}_${numeroStr}`
  ];

  // Adicionar aliases se existirem
  const aliases = topicAliases[topico] || topicAliases[topicoNormalizado] || [];
  for (const alias of aliases) {
    variacoes.push(`${alias}_${numeroStr}`);
    variacoes.push(`${slugify(alias)}_${numeroStr}`);
  }

  // Buscar por cada variação
  let interpretacao: string | null = null;
  for (const variacao of variacoes) {
    try {
      const { data, error } = await supabase
        .from('conteudos_numerologia')
        .select('conteudo')
        .eq('topico', variacao)
        .maybeSingle();

      if (!error && data?.conteudo) {
        interpretacao = extractText(data.conteudo);
        if (interpretacao && interpretacao.trim()) {
          console.log(`Encontrou interpretação com chave: ${variacao}`);
          break;
        }
      }
    } catch (error) {
      console.warn(`Erro ao buscar ${variacao}:`, error);
    }
  }
  
  // Fallback: busca flexível no banco
  if (!interpretacao) {
    try {
      const { data, error } = await supabase
        .from('conteudos_numerologia')
        .select('topico, conteudo')
        .ilike('topico', `%${topicoNormalizado}%${numeroStr}%`)
        .limit(5);

      if (!error && data && data.length > 0) {
        // Procurar a melhor correspondência
        for (const item of data) {
          const itemSlug = slugify(item.topico);
          if (itemSlug.includes(topicoNormalizado) && itemSlug.includes(numeroStr)) {
            interpretacao = extractText(item.conteudo);
            console.log(`Encontrou via busca flexível: ${item.topico}`);
            break;
          }
        }
      }
    } catch (error) {
      console.warn('Erro na busca flexível:', error);
    }
  }
  
  if (!interpretacao) {
    // Fallback para busca local se não encontrar no banco
    const localInterpretacao = getLocalInterpretacao(topico, Number(numero));
    if (localInterpretacao) {
      interpretacao = localInterpretacao;
    }
  }

  if (!interpretacao) {
    console.warn(`Interpretação não encontrada para: ${topico} ${numero}. Chaves tentadas:`, variacoes);
  }
  
  // Armazenar no cache
  if (interpretacao) {
    interpretationCache.set(chaveCompleta, interpretacao);
  }
  
  return interpretacao || null;
};

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
  'motivacao': ['motivação', 'desejo_coracao', 'desejo_do_coracao'],
  'expressao': ['expressão', 'talento_natural', 'personalidade'],
  'impressao': ['impressão', 'primeira_impressao', 'aparencia'],
  'destino': ['missao', 'missão', 'caminho_vida', 'caminho_da_vida'],
  'licoes_carmicas': ['lições_cármicas', 'licoes_karmicas', 'karmic_lessons'],
  'dividas_carmicas': ['dívidas_cármicas', 'dividas_karmicas', 'karmic_debts'],
  'tendencias_ocultas': ['tendências_ocultas', 'subconsciente'],
  'resposta_subconsciente': ['resposta_subconsciente', 'reacao_subconsciente'],
  'periodo_1': ['primeiro_periodo', 'ciclo_1', 'ciclo_juventude'],
  'periodo_2': ['segundo_periodo', 'ciclo_2', 'ciclo_maturidade'],
  'periodo_3': ['terceiro_periodo', 'ciclo_3', 'ciclo_sabedoria'],
  'anjo_guarda': ['anjo_da_guarda', 'guardian_angel'],
  
  // Ciclos pessoais específicos
  'ano_pessoal': ['ano-pessoal', 'ano pessoal'],
  'mes_pessoal': ['mes-pessoal', 'mês pessoal', 'mês-pessoal'],
  'dia_pessoal': ['dia-pessoal', 'dia pessoal'],
  
  // Desafios específicos
  'desafio_1': ['primeiro_desafio', '1º_desafio', 'desafio-1', 'desafio_juventude'],
  'desafio_2': ['segundo_desafio', '2º_desafio', 'desafio-2', 'desafio_principal'],
  'desafio_3': ['desafio_principal', 'principal', 'desafio-3', 'terceiro_desafio', 'desafio_maturidade'],
  'desafio_4': ['quarto_desafio', '4º_desafio', 'desafio-4', 'desafio_sabedoria'],
  
  // Momentos decisivos
  'momento_decisivo_1': ['primeiro_momento', '1º_momento', 'realizacao_1', 'momento-decisivo-1'],
  'momento_decisivo_2': ['segundo_momento', '2º_momento', 'realizacao_2', 'momento-decisivo-2'],
  'momento_decisivo_3': ['terceiro_momento', '3º_momento', 'realizacao_3', 'momento-decisivo-3'],
  'momento_decisivo_4': ['quarto_momento', '4º_momento', 'realizacao_4', 'momento-decisivo-4'],
  
  // Elementos especiais
  'cores_favoraveis': ['cores_pessoais', 'cores_numerologicas', 'personal_colors', 'cores-favoraveis', 'cores favoráveis'],
  'pedras': ['pedras_pessoais', 'pedras_numerologicas', 'cristais_pessoais', 'personal_stones', 'pedras-pessoais']
};