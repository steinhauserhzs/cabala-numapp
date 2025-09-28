import { supabase } from '@/integrations/supabase/client';
import { extractText } from '@/services/content';

// Interface para cores pessoais
export interface CoresPessoais {
  principal: string;
  harmoniosas: string[];
  significado: string;
}

// Cache para evitar múltiplas consultas
const coresCache = new Map<number, CoresPessoais>();

export async function calcularCoresPessoais(numero: number): Promise<CoresPessoais | null> {
  // Verificar cache primeiro
  if (coresCache.has(numero)) {
    return coresCache.get(numero)!;
  }

  try {
    // Buscar cores favoráveis no Supabase
    const topico = `cores-favoraveis_${numero.toString().padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .maybeSingle();

    if (error || !data?.conteudo) {
      console.warn(`Não foi possível buscar cores para o número ${numero}:`, error);
      return null;
    }

    const content = extractText(data.conteudo);
    
    // Parse básico do conteúdo para extrair informações de cores
    const coresPessoais: CoresPessoais = {
      principal: extractMainColor(content) || "Não disponível",
      harmoniosas: extractHarmoniousColors(content) || [],
      significado: content.substring(0, 200) + (content.length > 200 ? "..." : "")
    };

    // Armazenar no cache
    coresCache.set(numero, coresPessoais);
    
    return coresPessoais;
  } catch (error) {
    console.error(`Erro ao buscar cores para o número ${numero}:`, error);
    return null;
  }
}

export async function calcularCoresParaNumeros(numeros: Record<string, number>): Promise<Record<string, CoresPessoais>> {
  const result: Record<string, CoresPessoais> = {};
  
  // Buscar cores para cada número
  const promises = Object.entries(numeros).map(async ([chave, numero]) => {
    if (numero && numero > 0) {
      const cores = await calcularCoresPessoais(numero);
      if (cores) {
        result[chave] = cores;
      }
    }
  });

  await Promise.all(promises);
  return result;
}

// Função auxiliar para extrair cor principal do conteúdo
function extractMainColor(content: string): string | null {
  // Buscar padrões comuns de cores no texto
  const colorPatterns = [
    /cor principal[:\s]*([a-záêôõç\s-]+)/i,
    /cor[:\s]*([a-záêôõç\s-]+)/i,
    /(vermelho|azul|verde|amarelo|laranja|violeta|rosa|marrom|dourado|prateado|turquesa|coral|cristal)/i
  ];

  for (const pattern of colorPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

// Função auxiliar para extrair cores harmoniosas do conteúdo
function extractHarmoniousColors(content: string): string[] {
  const colors: string[] = [];
  const colorPattern = /(vermelho|azul|verde|amarelo|laranja|violeta|rosa|marrom|dourado|prateado|turquesa|coral|cristal|branco|preto|cinza|lilás|púrpura)/gi;
  
  const matches = content.match(colorPattern);
  if (matches) {
    // Remover duplicatas e limitar a 4 cores
    const uniqueColors = [...new Set(matches.map(color => color.toLowerCase()))];
    return uniqueColors.slice(0, 4);
  }

  return [];
}