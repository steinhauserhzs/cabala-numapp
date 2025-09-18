// Numerology calculation utilities using PERFIL_OFICIAL_JF
import { 
  calcNameWithAudit, 
  calcExpressao, 
  calcMotivacao, 
  calcImpressao,
  calcDestino,
  calcPsiquico,
  calcMissao,
  calcRespostaSubconsciente,
  calcLicoesCarmicas,
  calcTendenciasOcultas,
  reduceKeepMasters,
  reduceToDigitAllowZero,
  stripButKeepCedilla,
  countAccentedVowels,
  PERFIL_OFICIAL_JF,
  type AuditLog,
  enableDebugMode,
  getAuditLogs,
  clearAuditLogs,
  getActiveProfile
} from './numerology-core';
import { calcAnjoGuardaFromSupabase } from './angelParser';

// Re-export audit functionality
export { 
  enableDebugMode, 
  getAuditLogs,
  clearAuditLogs,
  type AuditLog 
};

// Profile management re-exports
export { setActiveProfile, getAvailableProfiles, getActiveProfile } from './numerology-core';

// Helper functions
export const clean = stripButKeepCedilla;
export const letterValue = (ch: string): number => {
  const letter = ch.toUpperCase();
  // Use active profile mapping
  const { map } = require('./numerology-core');
  // Fallback to official map if dynamic import fails
  try {
    const { getActiveProfile } = require('./numerology-core');
    return getActiveProfile().map[letter] || 0;
  } catch {
    return PERFIL_OFICIAL_JF.map[letter] || 0;
  }
};
export { reduceKeepMasters };

export const isVowel = (ch: string): boolean => {
  try {
    const { getActiveProfile } = require('./numerology-core');
    return getActiveProfile().vowels.has(ch.toUpperCase());
  } catch {
    return PERFIL_OFICIAL_JF.vowels.has(ch.toUpperCase());
  }
};

export const mapNameToValues = (nome: string): number[] => {
  return clean(nome)
    .split('')
    .filter(ch => ch !== ' ')
    .map(ch => letterValue(ch));
};

// Core numerology calculations (using new profile-based system)
export { calcMotivacao, calcImpressao, calcExpressao, calcDestino, calcMissao };

export const calcNumeroPsiquico = (dob: Date): number => {
  return calcPsiquico(dob.getDate());
};

export { calcRespostaSubconsciente, calcLicoesCarmicas, calcTendenciasOcultas };

// Detect karmic debts in name
export const detectarDividasCarmicas = (nome: string): number[] => {
  const valores = mapNameToValues(nome);
  const karmicDebts = [13, 14, 16, 19];
  const found: number[] = [];
  
  for (const debt of karmicDebts) {
    if (valores.includes(debt)) {
      found.push(debt);
    }
  }
  
  return found;
};

// Life cycle calculations
const getAllReductionSteps = (n: number): number[] => {
  const steps = [n];
  let current = n;
  
  while (current > 9) {
    const sum = current.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    steps.push(sum);
    current = sum;
  }
  
  return steps;
};

export const calcDesafio1 = (dob: Date): number => {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();
  return Math.abs(reduceToDigitAllowZero(month) - reduceToDigitAllowZero(day));
};

export const calcDesafio2 = (dob: Date): number => {
  const day = dob.getDate();
  const year = dob.getFullYear();
  return Math.abs(reduceToDigitAllowZero(day) - reduceToDigitAllowZero(year));
};

export const calcDesafioPrincipal = (d1: number, d2: number): number => {
  return Math.abs(d1 - d2);
};

export const calcMomento1 = (dob: Date): number => {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();
  return reduceKeepMasters(month + day);
};

export const calcMomento2 = (dob: Date): number => {
  const day = dob.getDate();
  const year = dob.getFullYear();
  return reduceKeepMasters(day + year);
};

export const calcMomento3 = (dob: Date): number => {
  const momento1 = calcMomento1(dob);
  const momento2 = calcMomento2(dob);
  return reduceKeepMasters(momento1 + momento2);
};

export const calcMomento4 = (dob: Date): number => {
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();
  return reduceKeepMasters(month + year);
};

// Personal year/month/day calculations
export const calcAnoPersonal = (data: Date, anoAtual: number): number => {
  const day = data.getDate();
  const month = data.getMonth() + 1;
  return reduceKeepMasters(day + month + anoAtual);
};

export const calcMesPersonal = (anoPersonal: number, mesAtual: number): number => {
  return reduceKeepMasters(anoPersonal + mesAtual);
};

export const calcDiaPersonal = (mesPersonal: number, diaAtual: number): number => {
  return reduceKeepMasters(mesPersonal + diaAtual);
};

// Main numerology map interface
export interface MapaNumerologico {
  motivacao: number;
  impressao: number;
  expressao: number;
  destino: number;
  missao: number;
  numeroPsiquico: number;
  respostaSubconsciente: number;
  licoesCarmicas: number[];
  tendenciasOcultas: number[];
  dividasCarmicas: number[];
  desafios: {
    primeiro: number;
    segundo: number;
    principal: number;
  };
  momentosDecisivos: {
    primeiro: number;
    segundo: number;
    terceiro: number;
    quarto: number;
  };
  ciclosVida: {
    primeiro: number;
    segundo: number;
    terceiro: number;
  };
  anoPersonal: number;
  mesPersonal: number;
  diaPersonal: number;
  anjoGuarda: string;
}

// Main function to generate complete numerological map
export function gerarMapaNumerologico(nome: string, dataNascimento: Date): MapaNumerologico {
  // Core numbers
  const motivacao = calcMotivacao(nome);
  const impressao = calcImpressao(nome);
  const expressao = calcExpressao(nome);
  const destino = calcDestino(dataNascimento.getDate(), dataNascimento.getMonth() + 1, dataNascimento.getFullYear());
  const missao = calcMissao(nome, dataNascimento.getDate(), dataNascimento.getMonth() + 1, dataNascimento.getFullYear());
  const numeroPsiquico = calcNumeroPsiquico(dataNascimento);
  
  // Response and lessons
  const respostaSubconsciente = calcRespostaSubconsciente(nome);
  const licoesCarmicas = calcLicoesCarmicas(nome);
  const tendenciasOcultas = calcTendenciasOcultas(nome);
  const dividasCarmicas = detectarDividasCarmicas(nome);
  
  // Challenges
  const desafio1 = calcDesafio1(dataNascimento);
  const desafio2 = calcDesafio2(dataNascimento);
  const desafioPrincipal = calcDesafioPrincipal(desafio1, desafio2);
  
  // Decisive moments
  const momento1 = calcMomento1(dataNascimento);
  const momento2 = calcMomento2(dataNascimento);
  const momento3 = calcMomento3(dataNascimento);
  const momento4 = calcMomento4(dataNascimento);
  
  // Life cycles per Conecta reference: reduced month, day (masters kept), and year
  const month = dataNascimento.getMonth() + 1;
  const day = dataNascimento.getDate();
  const year = dataNascimento.getFullYear();
  const ciclo1 = reduceKeepMasters(month);
  const ciclo2 = reduceKeepMasters(day);
  const ciclo3 = reduceKeepMasters(year);
  
  // Personal timing
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  
  const anoPersonal = calcAnoPersonal(dataNascimento, currentYear);
  const mesPersonal = calcMesPersonal(anoPersonal, currentMonth);
  const diaPersonal = calcDiaPersonal(mesPersonal, currentDay);
  
  // Guardian angel (will be filled by caller from Supabase)
  const anjoGuarda = ""; // Placeholder - filled by external function
  
  return {
    motivacao,
    impressao,
    expressao,
    destino,
    missao,
    numeroPsiquico,
    respostaSubconsciente,
    licoesCarmicas,
    tendenciasOcultas,
    dividasCarmicas,
    desafios: {
      primeiro: desafio1,
      segundo: desafio2,
      principal: desafioPrincipal
    },
    momentosDecisivos: {
      primeiro: momento1,
      segundo: momento2,
      terceiro: momento3,
      quarto: momento4
    },
    ciclosVida: {
      primeiro: ciclo1,
      segundo: ciclo2,
      terceiro: ciclo3
    },
    anoPersonal,
    mesPersonal,
    diaPersonal,
    anjoGuarda
  };
}

// Legacy function for Guardian Angel calculation (now uses Supabase)
export function calcAnjoGuarda(dob: Date): string {
  // This function is deprecated - guardian angel is now calculated from Supabase
  // using calcAnjoGuardaFromSupabase in angelParser.ts
  // Kept for legacy compatibility
  
  // Calculate day of year (1-365/366)
  const start = new Date(dob.getFullYear(), 0, 0);
  const diff = dob.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Each angel governs 5 days, starting from March 21 (day 80 in regular years)
  const adjustedDay = dayOfYear < 80 ? dayOfYear + 365 : dayOfYear;
  const angelIndex = Math.floor((adjustedDay - 80) / 5);
  
  const angels = [
    "Vehuiah", "Jeliel", "Sitael", "Elemiah", "Mahasiah", "Lelahel", "Achaiah", "Cahetel",
    "Haziel", "Aladiah", "Lauviah", "Hahaiah", "Iezalel", "Mebahel", "Hariel", "Hekamiah",
    "Lauviah", "Caliel", "Leuviah", "Pahaliah", "Nelchael", "Yeiayel", "Melahel", "Hahiuiah",
    "Nith-Haiah", "Haaiah", "Yeratel", "Seheiah", "Reiyel", "Omael", "Lecabel", "Vasariah",
    "Iehuiah", "Lehahiah", "Chavakiah", "Menadel", "Aniel", "Haamiah", "Rehael", "Ieiazel",
    "Hahahel", "Mikael", "Veualiah", "Yelahiah", "Sealiah", "Ariel", "Asaliah", "Mihael",
    "Vehuel", "Daniel", "Hahasiah", "Imamiah", "Nanael", "Nithael", "Mebahiah", "Poyel",
    "Nemamiah", "Ieialel", "Harahel", "Mitzrael", "Umabel", "Iah-Hel", "Anauel", "Mehiel",
    "Damabiah", "Manakel", "Eyael", "Habuhiah", "Rochel", "Jabamiah", "Haiaiel", "Mumiah"
  ];
  
  return angels[angelIndex % 72];
}

// Legacy compatibility exports (deprecated - use new calc* functions)
export const removerAcentos = clean;
export const letraParaNumero = letterValue;
export const reduzirNumero = reduceKeepMasters;
export const calcularNome = calcExpressao;
export const calcularMotivacao = calcMotivacao;
export const calcularImpressao = calcImpressao;
export const calcularDestino = calcDestino;
export const calcularMissao = calcMissao;
export const calcularNumeroPsiquico = calcNumeroPsiquico;
export const calcularRespostaSubconsciente = calcRespostaSubconsciente;
export const calcularAnoPersonal = calcAnoPersonal;
export const calcularMesPersonal = calcMesPersonal;
export const calcularDiaPersonal = calcDiaPersonal;