import { supabase } from '@/integrations/supabase/client';

interface AngelInfo {
  nome: string;
  periodo: string;
  descricao: string;
}

// Cache para evitar múltiplas consultas
let angelCache: string | null = null;

export async function calcularAnjoGuarda(birthDate: Date): Promise<AngelInfo | null> {
  try {
    if (!angelCache) {
      const { data, error } = await supabase
        .from('conteudos_numerologia')
        .select('conteudo')
        .eq('topico', 'anjos')
        .maybeSingle();

      if (error || !data?.conteudo) {
        console.warn('Não foi possível buscar dados dos anjos:', error);
        return null;
      }

      angelCache = typeof data.conteudo === 'string' 
        ? data.conteudo 
        : JSON.stringify(data.conteudo);
    }

    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;

    // Parse angel content to find the right angel
    const angelData = parseAngelContent(angelCache);
    
    for (const angel of angelData) {
      if (isDateInAngelRange(day, month, angel.startDay, angel.startMonth, angel.endDay, angel.endMonth)) {
        return {
          nome: angel.nome,
          periodo: `${angel.startDay.toString().padStart(2, '0')}/${angel.startMonth.toString().padStart(2, '0')} a ${angel.endDay.toString().padStart(2, '0')}/${angel.endMonth.toString().padStart(2, '0')}`,
          descricao: angel.descricao
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao calcular anjo da guarda:', error);
    return null;
  }
}

interface ParsedAngel {
  nome: string;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
  descricao: string;
}

function parseAngelContent(content: string): ParsedAngel[] {
  const angels: ParsedAngel[] = [];
  
  // Pattern to match angel entries like "Achaiah:**Anjo Achaiah (21/04 a 25/04)**: description"
  const angelPattern = /([^:*]+):\*\*Anjo\s+([^(]+)\((\d{1,2})\/(\d{1,2})\s+a\s+(\d{1,2})\/(\d{1,2})\)\*\*:\s*([^.]*\.[^A-Z]*)/g;
  
  let match;
  while ((match = angelPattern.exec(content)) !== null) {
    const [, , nome, startDay, startMonth, endDay, endMonth, descricao] = match;
    
    angels.push({
      nome: nome.trim(),
      startDay: parseInt(startDay),
      startMonth: parseInt(startMonth),
      endDay: parseInt(endDay),
      endMonth: parseInt(endMonth),
      descricao: descricao.trim()
    });
  }
  
  return angels;
}

function isDateInAngelRange(
  day: number, 
  month: number, 
  startDay: number, 
  startMonth: number, 
  endDay: number, 
  endMonth: number
): boolean {
  const dateNum = month * 100 + day;
  const startNum = startMonth * 100 + startDay;
  const endNum = endMonth * 100 + endDay;
  
  // Handle ranges that cross year boundaries
  if (startNum <= endNum) {
    return dateNum >= startNum && dateNum <= endNum;
  } else {
    return dateNum >= startNum || dateNum <= endNum;
  }
}