import { supabase } from '@/integrations/supabase/client';

// Cache for improved performance
const contentCache = new Map<string, string>();

type Blocks = Record<string, string>;

export async function fetchConteudo(topico: string): Promise<string> {
  // Check cache first
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
      
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado exato para "${topico}":`, content.substring(0, 100) + '...');
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
      
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado case-insensitive para "${topico}":`, content.substring(0, 100) + '...');
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
      
      contentCache.set(topico, content);
      console.debug(`[fetchConteudo] Encontrado parcial para "${topico}":`, content.substring(0, 100) + '...');
      return content;
    }

    console.warn(`[fetchConteudo] Tópico "${topico}" não encontrado`);
    // Cache empty result to avoid repeated queries
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

export async function getInterpretacao(topico: string, numero: number | string): Promise<string | null> {
  const numeroStr = String(numero);
  console.debug(`[getInterpretacao] Buscando ${topico} número ${numeroStr}`);

  try {
    const raw = await fetchConteudo(topico);
    if (!raw) {
      console.warn(`[getInterpretacao] Conteúdo não encontrado para ${topico}`);
      
      // Try aliases before giving up
      const aliases = topicAliases[topico] || [];
      for (const alias of aliases) {
        const aliasContent = await fetchConteudo(alias);
        if (aliasContent) {
          return await getInterpretacao(alias, numero);
        }
      }
      
      // Try reverse lookup in aliases
      for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
        if (aliasArray.includes(topico)) {
          const mainContent = await fetchConteudo(mainTopic);
          if (mainContent) {
            return await getInterpretacao(mainTopic, numero);
          }
        }
      }
      
      return null;
    }

    // If content is JSON object format, handle it
    if (raw.startsWith('{') || raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        
        // Check if it's a direct object with the number as key
        if (parsed[numeroStr]) {
          const item = parsed[numeroStr];
          if (typeof item === 'object' && item.titulo && item.descricao) {
            return `**${item.titulo}**\n\n${item.descricao}${item.caracteristicas ? '\n\n**Características:**\n' + item.caracteristicas.join(', ') : ''}${item.positivos ? '\n\n**Aspectos Positivos:**\n' + item.positivos.join(', ') : ''}${item.desafios ? '\n\n**Desafios:**\n' + item.desafios.join(', ') : ''}`;
          }
          return String(item);
        }
        
        // Check if it's an array and find by number
        if (Array.isArray(parsed)) {
          const found = parsed.find(item => item.numero === numero || item.numero === numeroStr);
          if (found) {
            if (typeof found === 'object' && found.titulo && found.descricao) {
              return `**${found.titulo}**\n\n${found.descricao}${found.caracteristicas ? '\n\n**Características:**\n' + found.caracteristicas.join(', ') : ''}${found.positivos ? '\n\n**Aspectos Positivos:**\n' + found.positivos.join(', ') : ''}${found.desafios ? '\n\n**Desafios:**\n' + found.desafios.join(', ') : ''}`;
            }
            return String(found);
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
        return title ? `**${title}**\n\n${content}` : content;
      }
    }

    console.warn(`[getInterpretacao] Interpretação específica não encontrada para ${topico} ${numeroStr}`);
    
    // Try aliases
    for (const alias of topicAliases[topico] || []) {
      const result = await getInterpretacao(alias, numero);
      if (result && !result.includes('em preparação')) {
        return result;
      }
    }

    // Try reverse aliases
    for (const [mainTopic, aliasArray] of Object.entries(topicAliases)) {
      if (aliasArray.includes(topico)) {
        const aliasResult = await getInterpretacao(mainTopic, numero);
        if (aliasResult && !aliasResult.includes('em preparação')) {
          return aliasResult;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`[getInterpretacao] Erro:`, error);
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