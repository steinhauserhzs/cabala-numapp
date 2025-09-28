import { supabase } from '@/integrations/supabase/client';
import { extractText } from '@/services/content';

interface AngelInfo {
  nome: string;
  periodo: string;
  descricao: string;
}

// Anjos e seus períodos - baseado no sistema tradicional dos 72 anjos
const ANGEL_PERIODS = [
  { number: 1, name: "Vehuiah", startDay: 21, startMonth: 3, endDay: 25, endMonth: 3 },
  { number: 2, name: "Jeliel", startDay: 26, startMonth: 3, endDay: 30, endMonth: 3 },
  { number: 3, name: "Sitael", startDay: 31, startMonth: 3, endDay: 4, endMonth: 4 },
  { number: 4, name: "Elemiah", startDay: 5, startMonth: 4, endDay: 9, endMonth: 4 },
  { number: 5, name: "Mahasiah", startDay: 10, startMonth: 4, endDay: 14, endMonth: 4 },
  { number: 6, name: "Lelahel", startDay: 15, startMonth: 4, endDay: 20, endMonth: 4 },
  { number: 7, name: "Achaiah", startDay: 21, startMonth: 4, endDay: 25, endMonth: 4 },
  { number: 8, name: "Cahethel", startDay: 26, startMonth: 4, endDay: 30, endMonth: 4 },
  { number: 9, name: "Haziel", startDay: 1, startMonth: 5, endDay: 5, endMonth: 5 },
  { number: 10, name: "Aladiah", startDay: 6, startMonth: 5, endDay: 10, endMonth: 5 },
  { number: 11, name: "Lauviah", startDay: 11, startMonth: 5, endDay: 15, endMonth: 5 },
  { number: 12, name: "Hahaiah", startDay: 16, startMonth: 5, endDay: 20, endMonth: 5 },
  { number: 13, name: "Iezalel", startDay: 21, startMonth: 5, endDay: 25, endMonth: 5 },
  { number: 14, name: "Mebahel", startDay: 26, startMonth: 5, endDay: 31, endMonth: 5 },
  { number: 15, name: "Hariel", startDay: 1, startMonth: 6, endDay: 5, endMonth: 6 },
  { number: 16, name: "Hekamiah", startDay: 6, startMonth: 6, endDay: 10, endMonth: 6 },
  { number: 17, name: "Lauviah II", startDay: 11, startMonth: 6, endDay: 15, endMonth: 6 },
  { number: 18, name: "Caliel", startDay: 16, startMonth: 6, endDay: 21, endMonth: 6 },
  { number: 19, name: "Leuviah", startDay: 22, startMonth: 6, endDay: 26, endMonth: 6 },
  { number: 20, name: "Pahaliah", startDay: 27, startMonth: 6, endDay: 1, endMonth: 7 },
  { number: 21, name: "Nelchael", startDay: 2, startMonth: 7, endDay: 6, endMonth: 7 },
  { number: 22, name: "Yeiayel", startDay: 7, startMonth: 7, endDay: 11, endMonth: 7 },
  { number: 23, name: "Melahel", startDay: 12, startMonth: 7, endDay: 16, endMonth: 7 },
  { number: 24, name: "Haheuiah", startDay: 17, startMonth: 7, endDay: 22, endMonth: 7 },
  { number: 25, name: "Nith-Haiah", startDay: 23, startMonth: 7, endDay: 27, endMonth: 7 },
  { number: 26, name: "Haaiah", startDay: 28, startMonth: 7, endDay: 1, endMonth: 8 },
  { number: 27, name: "Yerathel", startDay: 2, startMonth: 8, endDay: 6, endMonth: 8 },
  { number: 28, name: "Seheiah", startDay: 7, startMonth: 8, endDay: 12, endMonth: 8 },
  { number: 29, name: "Reiyel", startDay: 13, startMonth: 8, endDay: 17, endMonth: 8 },
  { number: 30, name: "Omael", startDay: 18, startMonth: 8, endDay: 22, endMonth: 8 },
  { number: 31, name: "Lecabel", startDay: 23, startMonth: 8, endDay: 28, endMonth: 8 },
  { number: 32, name: "Vasariah", startDay: 29, startMonth: 8, endDay: 2, endMonth: 9 },
  { number: 33, name: "Yehuiah", startDay: 3, startMonth: 9, endDay: 7, endMonth: 9 },
  { number: 34, name: "Lehahiah", startDay: 8, startMonth: 9, endDay: 12, endMonth: 9 },
  { number: 35, name: "Chavaquiah", startDay: 13, startMonth: 9, endDay: 17, endMonth: 9 },
  { number: 36, name: "Menadel", startDay: 18, startMonth: 9, endDay: 23, endMonth: 9 },
  { number: 37, name: "Aniel", startDay: 24, startMonth: 9, endDay: 28, endMonth: 9 },
  { number: 38, name: "Haamiah", startDay: 29, startMonth: 9, endDay: 3, endMonth: 10 },
  { number: 39, name: "Rehael", startDay: 4, startMonth: 10, endDay: 8, endMonth: 10 },
  { number: 40, name: "Ieiazel", startDay: 9, startMonth: 10, endDay: 13, endMonth: 10 },
  { number: 41, name: "Hahahel", startDay: 14, startMonth: 10, endDay: 18, endMonth: 10 },
  { number: 42, name: "Mikael", startDay: 19, startMonth: 10, endDay: 23, endMonth: 10 },
  { number: 43, name: "Veualiah", startDay: 24, startMonth: 10, endDay: 28, endMonth: 10 },
  { number: 44, name: "Yelahiah", startDay: 29, startMonth: 10, endDay: 2, endMonth: 11 },
  { number: 45, name: "Sealiah", startDay: 3, startMonth: 11, endDay: 7, endMonth: 11 },
  { number: 46, name: "Ariel", startDay: 8, startMonth: 11, endDay: 12, endMonth: 11 },
  { number: 47, name: "Asaliah", startDay: 13, startMonth: 11, endDay: 17, endMonth: 11 },
  { number: 48, name: "Mihael", startDay: 18, startMonth: 11, endDay: 22, endMonth: 11 },
  { number: 49, name: "Vehuel", startDay: 23, startMonth: 11, endDay: 27, endMonth: 11 },
  { number: 50, name: "Daniel", startDay: 28, startMonth: 11, endDay: 2, endMonth: 12 },
  { number: 51, name: "Hahasiah", startDay: 3, startMonth: 12, endDay: 7, endMonth: 12 },
  { number: 52, name: "Imamiah", startDay: 8, startMonth: 12, endDay: 12, endMonth: 12 },
  { number: 53, name: "Nanael", startDay: 13, startMonth: 12, endDay: 16, endMonth: 12 },
  { number: 54, name: "Nithael", startDay: 17, startMonth: 12, endDay: 21, endMonth: 12 },
  { number: 55, name: "Mebahiah", startDay: 22, startMonth: 12, endDay: 26, endMonth: 12 },
  { number: 56, name: "Poyel", startDay: 27, startMonth: 12, endDay: 31, endMonth: 12 },
  { number: 57, name: "Nemamiah", startDay: 1, startMonth: 1, endDay: 5, endMonth: 1 },
  { number: 58, name: "Yeialel", startDay: 6, startMonth: 1, endDay: 10, endMonth: 1 },
  { number: 59, name: "Harahel", startDay: 11, startMonth: 1, endDay: 15, endMonth: 1 },
  { number: 60, name: "Mitzrael", startDay: 16, startMonth: 1, endDay: 20, endMonth: 1 },
  { number: 61, name: "Umabel", startDay: 21, startMonth: 1, endDay: 25, endMonth: 1 },
  { number: 62, name: "Iah-hel", startDay: 26, startMonth: 1, endDay: 30, endMonth: 1 },
  { number: 63, name: "Anauel", startDay: 31, startMonth: 1, endDay: 4, endMonth: 2 },
  { number: 64, name: "Mehiel", startDay: 5, startMonth: 2, endDay: 9, endMonth: 2 },
  { number: 65, name: "Damabiah", startDay: 10, startMonth: 2, endDay: 14, endMonth: 2 },
  { number: 66, name: "Manakel", startDay: 15, startMonth: 2, endDay: 19, endMonth: 2 },
  { number: 67, name: "Eyael", startDay: 20, startMonth: 2, endDay: 24, endMonth: 2 },
  { number: 68, name: "Habuhiah", startDay: 25, startMonth: 2, endDay: 1, endMonth: 3 },
  { number: 69, name: "Rochel", startDay: 2, startMonth: 3, endDay: 6, endMonth: 3 },
  { number: 70, name: "Jabamiah", startDay: 7, startMonth: 3, endDay: 11, endMonth: 3 },
  { number: 71, name: "Haiaiel", startDay: 12, startMonth: 3, endDay: 16, endMonth: 3 },
  { number: 72, name: "Mumiah", startDay: 17, startMonth: 3, endDay: 20, endMonth: 3 }
];

export async function calcularAnjoGuarda(birthDate: Date): Promise<AngelInfo | null> {
  try {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    // Encontrar o anjo correspondente à data
    let angelNumber = null;
    for (const angel of ANGEL_PERIODS) {
      if (isDateInAngelRange(day, month, angel.startDay, angel.startMonth, angel.endDay, angel.endMonth)) {
        angelNumber = angel.number;
        break;
      }
    }

    if (!angelNumber) {
      return null;
    }

    // Buscar o conteúdo do anjo específico no Supabase
    const topico = `anjo_${angelNumber.toString().padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('conteudos_numerologia')
      .select('conteudo')
      .eq('topico', topico)
      .maybeSingle();

    if (error || !data?.conteudo) {
      console.warn(`Não foi possível buscar dados do anjo ${angelNumber}:`, error);
      return null;
    }

    const angelData = ANGEL_PERIODS.find(a => a.number === angelNumber);
    
    const content = extractText(data.conteudo);

    return {
      nome: angelData?.name || `Anjo ${angelNumber}`,
      periodo: angelData ? `${angelData.startDay.toString().padStart(2, '0')}/${angelData.startMonth.toString().padStart(2, '0')} a ${angelData.endDay.toString().padStart(2, '0')}/${angelData.endMonth.toString().padStart(2, '0')}` : '',
      descricao: content
    };

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