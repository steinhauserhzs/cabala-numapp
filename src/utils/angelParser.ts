// Guardian Angel parser for Supabase content
import { getTextoTopico } from '@/services/content';

interface Angel {
  nome: string;
  inicioMes: number;
  inicioDia: number;
  fimMes: number;
  fimDia: number;
  texto: string;
}

let angelsCache: Angel[] | null = null;

async function parseAngelsFromSupabase(): Promise<Angel[]> {
  if (angelsCache) return angelsCache;
  
  const content = await getTextoTopico('seu_anjo');
  if (!content) {
    console.warn('[parseAngelsFromSupabase] No content found for seu_anjo');
    return [];
  }
  
  const angels: Angel[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Pattern: Anjo Nome (DD/MM a DD/MM): description
    const match = line.match(/(\w+)\s*\((\d{1,2})\/(\d{1,2})\s*a\s*(\d{1,2})\/(\d{1,2})\):\s*(.*)/i);
    
    if (match) {
      const [, nome, inicioDiaStr, inicioMesStr, fimDiaStr, fimMesStr, texto] = match;
      
      angels.push({
        nome: nome.trim(),
        inicioMes: parseInt(inicioMesStr),
        inicioDia: parseInt(inicioDiaStr),
        fimMes: parseInt(fimMesStr),
        fimDia: parseInt(fimDiaStr),
        texto: texto.trim()
      });
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[parseAngelsFromSupabase] Parsed ${angels.length} angels`);
  }
  
  angelsCache = angels;
  return angels;
}

export async function calcAnjoGuardaFromSupabase(dob: Date): Promise<string> {
  const angels = await parseAngelsFromSupabase();
  
  if (angels.length === 0) {
    console.warn('[calcAnjoGuardaFromSupabase] No angels found, using fallback');
    return 'Lauviah'; // Fallback
  }
  
  const mes = dob.getMonth() + 1; // 1-based month
  const dia = dob.getDate();
  
  // Find angel whose date range contains the birth date
  for (const angel of angels) {
    const isInRange = isDateInRange(mes, dia, angel.inicioMes, angel.inicioDia, angel.fimMes, angel.fimDia);
    
    if (isInRange) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[calcAnjoGuardaFromSupabase] ${dia}/${mes} -> ${angel.nome}`);
      }
      return angel.nome;
    }
  }
  
  console.warn(`[calcAnjoGuardaFromSupabase] No angel found for ${dia}/${mes}`);
  return angels[0]?.nome || 'Anjo Desconhecido';
}

function isDateInRange(
  mes: number, dia: number,
  inicioMes: number, inicioDia: number,
  fimMes: number, fimDia: number
): boolean {
  // Convert to day of year for easier comparison
  const targetDay = dateToDay(mes, dia);
  const startDay = dateToDay(inicioMes, inicioDia);
  const endDay = dateToDay(fimMes, fimDia);
  
  // Handle year-crossing ranges (e.g., Dec 25 to Jan 5)
  if (startDay <= endDay) {
    return targetDay >= startDay && targetDay <= endDay;
  } else {
    return targetDay >= startDay || targetDay <= endDay;
  }
}

function dateToDay(mes: number, dia: number): number {
  // Simple approximation: convert month/day to day of year
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = dia;
  
  for (let i = 0; i < mes - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  
  return dayOfYear;
}