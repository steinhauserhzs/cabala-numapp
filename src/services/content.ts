import { supabase } from '@/integrations/supabase/client';
import { canonicalizeTopic, getLocalInterpretacao } from '@/services/content-helpers';

// Cache for improved performance
const contentCache = new Map<string, string>();
const interpretationCache = new Map<string, string | null>();

type Blocks = Record<string, string>;

export async function fetchConteudo(topico: string): Promise<string> {
  const topicKey = canonicalizeTopic(topico);
  // Check cache first (canonical and raw)
  if (contentCache.has(topicKey)) {
    return contentCache.get(topicKey)!;
  }
  if (contentCache.has(topico)) {
    return contentCache.get(topico)!;
  }

  console.debug(`[fetchConteudo] Buscando tópico: "${topico}"`);

  try {
    // Try exact match first - use limit(1) to avoid PGRST116 errors
    let { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[fetchConteudo] Erro na busca exata:', error);
    }

    if (data && data.length > 0) {
      const content = typeof data[0].conteudo === 'string' 
        ? data[0].conteudo 
        : JSON.stringify(data[0].conteudo, null, 2);
      
      contentCache.set(topicKey, content);
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado exato para "${topico}"`, content.substring(0, 100) + '...');
      return content;
    }

    // Try case-insensitive match
    ({ data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .ilike('topico', topico)
      .order('created_at', { ascending: false })
      .limit(1));

    if (error) {
      console.error('[fetchConteudo] Erro na busca case-insensitive:', error);
    }

    if (data && data.length > 0) {
      const content = typeof data[0].conteudo === 'string' 
        ? data[0].conteudo 
        : JSON.stringify(data[0].conteudo, null, 2);
      
      contentCache.set(topicKey, content);
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado case-insensitive para "${topico}"`, content.substring(0, 100) + '...');
      return content;
    }

    // Try partial match
    ({ data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .ilike('topico', `%${topico}%`)
      .order('created_at', { ascending: false })
      .limit(1));

    if (error) {
      console.error('[fetchConteudo] Erro na busca parcial:', error);
    }

    if (data && data.length > 0) {
      const content = typeof data[0].conteudo === 'string' 
        ? data[0].conteudo 
        : JSON.stringify(data[0].conteudo, null, 2);
      
      contentCache.set(topicKey, content);
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado parcial para "${topico}"`, content.substring(0, 100) + '...');
      return content;
    }

    console.warn(`[fetchConteudo] Tópico "${topico}" não encontrado`);
    // Cache empty result to avoid repeated queries
    contentCache.set(canonicalizeTopic(topico), '');
    contentCache.set(topico, '');
    return '';
  } catch (error) {
    console.error('[fetchConteudo] Erro:', error);
    return '';
  }
}

function splitByHeading(raw: string, heading: RegExp, captureGroup = 1): Blocks {
  if (!raw) return {};
  
  const blocks: Blocks = {};
  const lines = raw.split('\n');
  let currentKey = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const match = line.match(heading);
    
    if (match && match[captureGroup]) {
      // Save previous block
      if (currentKey && currentContent.length > 0) {
        blocks[currentKey] = currentContent.join('\n').trim();
      }
      
      // Start new block
      currentKey = match[captureGroup].trim();
      currentContent = [];
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

export async function getInterpretacao(topico: string, numero: number | string, _visited: Set<string> = new Set(), _depth = 0): Promise<string | null> {
  const numeroStr = String(numero);
  const topicKey = canonicalizeTopic(topico);
  const cacheKey = `${topicKey}:${numeroStr}`;
  console.debug(`[getInterpretacao] Buscando ${topicKey} número ${numeroStr} (depth=${_depth})`);

  // Cache first
  if (interpretationCache.has(cacheKey)) {
    return interpretationCache.get(cacheKey)!;
  }

  // Prevent infinite recursion between aliases (track by original topic string)
  const visitedKey = topico;
  if (_visited.has(visitedKey) || _depth > 8) {
    console.warn(`[getInterpretacao] Ciclo ou profundidade excedida em ${visitedKey}`);
    interpretationCache.set(cacheKey, null);
    return null;
  }
  _visited.add(visitedKey);

  try {
    const raw = await fetchConteudo(topicKey);
    if (!raw) {
      console.warn(`[getInterpretacao] Conteúdo não encontrado para ${topicKey}`);

      // Try aliases before giving up
      const aliases = topicAliases[topicKey] || [];
      for (const alias of aliases) {
        if (_visited.has(alias)) continue;
        const aliasContent = await fetchConteudo(alias);
        if (aliasContent) {
          const res = await getInterpretacao(alias, numero, new Set(_visited), _depth + 1);
          if (res) {
            interpretationCache.set(cacheKey, res);
            return res;
          }
        }
      }

      // Try reverse lookup in aliases
      for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
        if (aliasArray.includes(topicKey) && !_visited.has(mainTopic)) {
          const mainContent = await fetchConteudo(mainTopic);
          if (mainContent) {
            const res = await getInterpretacao(mainTopic, numero, new Set(_visited), _depth + 1);
            if (res) {
              interpretationCache.set(cacheKey, res);
              return res;
            }
          }
        }
      }

      // Local fallback before giving up
      const fallback = getLocalInterpretacao(topicKey, Number(numeroStr));
      if (fallback) {
        interpretationCache.set(cacheKey, fallback);
        return fallback;
      }

      interpretationCache.set(cacheKey, null);
      return null;
    }

    // If content is JSON object format, handle it
    if (raw.startsWith('{') || raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);

        // Helper to convert any value (string/object/array) into full text preserving structure
        const toText = (val: any): string | null => {
          if (val == null) return null;
          if (typeof val === 'string') return val;

          // Prefer well-known keys when it's an object representing a single interpretation
          const preferKeys = [
            'texto_integral', 'textoIntegral', 'texto_completo', 'textoCompleto',
            'integral', 'completo', 'full', 'conteudo_integral', 'conteudoCompleto',
            'conteudo', 'content', 'texto', 'descricao', 'descrição', 'resumo'
          ];

          if (Array.isArray(val)) {
            const parts = val
              .map(item => toText(item))
              .filter((s): s is string => Boolean(s && s.trim().length > 0));
            return parts.length ? parts.join('\n\n') : null;
          }

          if (typeof val === 'object') {
            // First try preferred keys explicitly
            for (const k of preferKeys) {
              if (k in val) {
                const t = toText((val as any)[k]);
                if (t) return t;
              }
            }

            // Otherwise, concatenate all string/array/object text fields recursively, in stable order
            const blacklist = new Set(['numero', 'n', 'id', 'key']);
            const parts: string[] = [];
            for (const [k, v] of Object.entries(val as Record<string, any>)) {
              if (blacklist.has(k)) continue;
              const t = toText(v);
              if (t && t.trim().length > 0) {
                // Include key as a bold section title when it looks like a label
                const isLabel = /titulo|título|title|secao|seção|section|capitulo|capítulo|topico|tópico/i.test(k);
                const label = k.replace(/_/g, ' ');
                parts.push(isLabel ? `**${label}**\n\n${t}` : t);
              }
            }
            return parts.length ? parts.join('\n\n') : null;
          }

          return null;
        };

        // Try direct object map: { "9": "..." } or { "9": { ... } }
        if (!Array.isArray(parsed) && typeof parsed === 'object') {
          const direct = (parsed as any)[numeroStr];
          const directText = toText(direct);
          if (directText != null) {
            interpretationCache.set(cacheKey, String(directText));
            return String(directText);
          }

          // Try common nested containers
          const containers = [
            'conteudos', 'content', 'textos', 'itens', 'items',
            'interpretacoes', 'interpretações', 'dados', 'data', 'sections', 'secoes', 'seções'
          ];
          for (const key of containers) {
            const container = (parsed as any)[key];
            if (container && typeof container === 'object') {
              const nestedText = toText(container?.[numeroStr]);
              if (nestedText != null) {
                interpretationCache.set(cacheKey, String(nestedText));
                return String(nestedText);
              }
            }
          }
        }

        // Check if it's an array and find by number
        if (Array.isArray(parsed)) {
          const found = parsed.find((item: any) => item?.numero === numero || item?.numero === numeroStr || item?.n === numero || item?.n === numeroStr);
          if (found !== undefined) {
            const text = toText(found);
            if (text != null) {
              interpretationCache.set(cacheKey, String(text));
              return String(text);
            }
          }
        }
      } catch (parseError) {
        console.warn(`[getInterpretacao] Erro ao parsear JSON para ${topico}:`, parseError);
      }
    }

    // Parse text content based on common patterns
    const topicName = topico.charAt(0).toUpperCase() + topico.slice(1).replace(/_/g, ' ');

    // Create pattern to match "Topic Number" format
    const sectionPattern = new RegExp(
      `(^|\\n)\\s*${topicName}\\s+${numeroStr}\\s*\\n([\\s\\S]*?)(?=\\n\\s*${topicName}\\s+\\d+|$)`,
      'im'
    );

    let match = raw.match(sectionPattern);
    if (match && match[2]) {
      const content = match[2].trim();
      if (content.length > 10) {
        console.debug(`[getInterpretacao] Encontrado para ${topico} ${numeroStr} (padrão 1)`);
        interpretationCache.set(cacheKey, content);
        return content;
      }
    }

    // Alternative pattern: just "Number" at line start
    const numberPattern = new RegExp(
      `(^|\\n)\\s*${numeroStr}\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\d+\\s*\\n|$)`,
      'm'
    );

    match = raw.match(numberPattern);
    if (match && match[2]) {
      const content = match[2].trim();
      if (content.length > 10) {
        console.debug(`[getInterpretacao] Encontrado para ${topico} ${numeroStr} (padrão 2)`);
        interpretationCache.set(cacheKey, content);
        return content;
      }
    }

    // Pattern for numbered sections with description
    const descPattern = new RegExp(
      `(^|\\n)\\s*${numeroStr}\\s*[-.]?\\s*([^\\n]+)\\n([\\s\\S]*?)(?=\\n\\s*\\d+\\s*[-.]?|$)`,
      'm'
    );

    match = raw.match(descPattern);
    if (match && match[3]) {
      const title = match[2].trim();
      const content = match[3].trim();
      if (content.length > 10) {
        console.debug(`[getInterpretacao] Encontrado para ${topico} ${numeroStr} (padrão 3)`);
        const text = title ? `**${title}**\n\n${content}` : content;
        interpretationCache.set(cacheKey, text);
        return text;
      }
    }

    console.warn(`[getInterpretacao] Interpretação específica não encontrada para ${topico} ${numeroStr}`);

    // Try aliases safely with visited set
    for (const alias of topicAliases[topico] || []) {
      if (_visited.has(alias)) continue;
      const result = await getInterpretacao(alias, numero, new Set(_visited), _depth + 1);
      if (result && !result.includes('em preparação')) {
        interpretationCache.set(cacheKey, result);
        return result;
      }
    }

    // Try reverse aliases safely
    for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
      if (aliasArray.includes(topico) && !_visited.has(mainTopic)) {
        const aliasResult = await getInterpretacao(mainTopic, numero, new Set(_visited), _depth + 1);
        if (aliasResult && !aliasResult.includes('em preparação')) {
          interpretationCache.set(cacheKey, aliasResult);
          return aliasResult;
        }
      }
    }

    // Local fallback
    const fallback = getLocalInterpretacao(topico, Number(numeroStr));
    interpretationCache.set(cacheKey, fallback);
    return fallback;
  } catch (error) {
    console.error(`[getInterpretacao] Erro:`, error);
    interpretationCache.set(cacheKey, null);
    return null;
  }
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
  'anjo_guarda': ['seu_anjo', 'anjo_da_guarda', 'anjo da guarda'],
  'momentos_decisivos': ['momento_decisivo', 'primeiro_momento', 'segundo_momento', 'terceiro_momento', 'quarto_momento'],
  'momento_decisivo': ['momentos_decisivos'],
  'cores_do_dia': ['cores_pessoais', 'cores pessoais'],
  'dias_beneficos': ['dias_favoraveis', 'dias favoráveis'],
  'triangulo_da_vida': ['triangulo_invertido', 'triângulo_invertido', 'triângulo da vida'],
  'arcano': ['arcanos'],
  'sintese_final': ['conclusao', 'conclusão', 'síntese_final', 'síntese final'],
  'desafios': ['desafio'],
  'ciclos_vida': ['ciclo_vida', 'ciclos de vida', 'ciclo de vida'],
  'numero_alma': ['numero_da_alma', 'número_alma', 'número_da_alma'],
  'numero_personalidade': ['numero_da_personalidade', 'número_personalidade', 'número_da_personalidade'],
  'numero_expressao': ['numero_da_expressao', 'número_expressão', 'número_da_expressão', 'expressão', 'expressao'],
  'numero_motivacao': ['numero_da_motivacao', 'número_motivação', 'número_da_motivação', 'motivação', 'motivacao'],
  'numero_impressao': ['numero_da_impressao', 'número_impressão', 'número_da_impressão', 'impressão', 'impressao'],
  'numero_psiquico': ['número_psíquico', 'numero psiquico', 'número psiquico'],
  'ano_pessoal': ['ano pessoal'],
  'mes_pessoal': ['mês_pessoal', 'mes pessoal', 'mês pessoal'],
  'dia_pessoal': ['dia pessoal'],
  'missao': ['missão']
};

export async function getTextoTopico(topico: string, _visited: Set<string> = new Set(), _depth = 0): Promise<string | null> {
  if (_visited.has(topico) || _depth > 5) {
    console.warn(`[getTextoTopico] Ciclo ou profundidade excedida em ${topico}`);
    return null;
  }
  _visited.add(topico);

  // First try the exact topic
  let result = await fetchConteudo(topico);

  if (!result) {
    // Try aliases
    const aliases = topicAliases[topico] || [];
    for (const alias of aliases) {
      if (_visited.has(alias)) continue;
      result = await fetchConteudo(alias);
      if (result) break;
    }

    // Try reverse lookup
    if (!result) {
      for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
        if (aliasArray.includes(topico) && !_visited.has(mainTopic)) {
          result = await fetchConteudo(mainTopic);
          if (result) break;
        }
      }
    }
  }

  return result;
}