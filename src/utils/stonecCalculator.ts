import { supabase } from '@/integrations/supabase/client';
import { extractText } from '@/services/content';

// Interface para pedras pessoais
export interface PedrasPessoais {
  principal: string;
  alternativas: string[];
  propriedades: string;
  como_usar: string;
}

// Cache para evitar múltiplas consultas
const pedrasCache = new Map<number, PedrasPessoais>();

export async function calcularPedrasPessoais(numero: number): Promise<PedrasPessoais | null> {
  // Verificar cache primeiro
  if (pedrasCache.has(numero)) {
    return pedrasCache.get(numero)!;
  }

  try {
    // Buscar pedras no Supabase
    const topico = `pedras_${numero.toString().padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .maybeSingle();

    if (error || !data?.conteudo) {
      console.warn(`Não foi possível buscar pedras para o número ${numero}:`, error);
      return null;
    }

    const content = extractText(data.conteudo);
    
    // Parse básico do conteúdo para extrair informações de pedras
    const pedrasPessoais: PedrasPessoais = {
      principal: extractMainStone(content) || "Não disponível",
      alternativas: extractAlternativeStones(content) || [],
      propriedades: extractProperties(content) || content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      como_usar: extractUsage(content) || "Use conforme sua intuição e necessidade."
    };

    // Armazenar no cache
    pedrasCache.set(numero, pedrasPessoais);
    
    return pedrasPessoais;
  } catch (error) {
    console.error(`Erro ao buscar pedras para o número ${numero}:`, error);
    return null;
  }
}

export async function calcularPedrasParaNumeros(numeros: Record<string, number>): Promise<Record<string, PedrasPessoais>> {
  const result: Record<string, PedrasPessoais> = {};
  
  // Buscar pedras para cada número
  const promises = Object.entries(numeros).map(async ([chave, numero]) => {
    if (numero && numero > 0) {
      const pedras = await calcularPedrasPessoais(numero);
      if (pedras) {
        result[chave] = pedras;
      }
    }
  });

  await Promise.all(promises);
  return result;
}

// Função auxiliar para extrair pedra principal do conteúdo
function extractMainStone(content: string): string | null {
  const stonePatterns = [
    /pedra principal[:\s]*([a-záêôõç\s-]+)/i,
    /pedra[:\s]*([a-záêôõç\s-]+)/i,
    /(quartzo|ametista|citrino|rubi|esmeralda|safira|diamante|turquesa|jade|granata|topázio|âmbar|obsidiana|hematita|malaquita|amazonita|sodalita|selenita|apofilita|celestita|cianita|moldavita|lápis\slazúli|olho\sde\stiger|pedra\sda\slua)/i
  ];

  for (const pattern of stonePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// Função auxiliar para extrair pedras alternativas do conteúdo
function extractAlternativeStones(content: string): string[] {
  const stonePattern = /(quartzo|ametista|citrino|rubi|esmeralda|safira|diamante|turquesa|jade|granata|topázio|âmbar|obsidiana|hematita|malaquita|amazonita|sodalita|selenita|apofilita|celestita|cianita|moldavita|lápis\slazúli|olho\sde\stiger|pedra\sda\slua|cornalina|jaspe|aventurina|kunzita|prehnita|rodocrosita|fluorita|lepidolita|charoíta|pirita|calcita|calcedônia|pérola)/gi;
  
  const matches = content.match(stonePattern);
  if (matches) {
    const uniqueStones = [...new Set(matches.map(stone => stone.toLowerCase()))];
    return uniqueStones.slice(0, 4);
  }
  return [];
}

// Função auxiliar para extrair propriedades do conteúdo
function extractProperties(content: string): string | null {
  const propertyPatterns = [
    /propriedades[:\s]*([^.]+\.[^.]*)/i,
    /benefícios[:\s]*([^.]+\.[^.]*)/i,
    /atributos[:\s]*([^.]+\.[^.]*)/i
  ];

  for (const pattern of propertyPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// Função auxiliar para extrair como usar do conteúdo
function extractUsage(content: string): string | null {
  const usagePatterns = [
    /como usar[:\s]*([^.]+\.[^.]*)/i,
    /uso[:\s]*([^.]+\.[^.]*)/i,
    /utilização[:\s]*([^.]+\.[^.]*)/i
  ];

  for (const pattern of usagePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}