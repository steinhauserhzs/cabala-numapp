// Numerology calculation utilities - NEW DETERMINISTIC CABALISTIC ENGINE
import { 
  computeFullMap,
  normalizeNameKeepingCedilla,
  letterValue as cabalisticLetterValue,
  reduceKeepMasters,
  type Options,
  type HarmonicsTable,
  type ConjugalTable,
  type ColorsTable,
  type AngelsTable
} from './numerology-cabalistic';
import { ANGELS_BASE, HARMONICS_BASE, COLORS_BASE, CONJUGAL_BASE } from '../data/angels-base';

// New deterministic engine - single source of truth
export const clean = normalizeNameKeepingCedilla;
export const letterValue = cabalisticLetterValue;
export { reduceKeepMasters };

// Debug and audit functions (stubs for compatibility)
export const enableDebugMode = (enable: boolean) => {
  console.log(`Debug mode ${enable ? 'enabled' : 'disabled'} - using new deterministic engine`);
};

export const getAuditLogs = () => {
  return []; // New engine doesn't use audit logs
};

export const clearAuditLogs = () => {
  // No-op for new engine
};

// Profile management stubs (new engine doesn't use profiles)
export const setActiveProfile = (profile: any) => {
  console.log('Profile setting ignored - using deterministic cabalistic engine');
};

export const getAvailableProfiles = () => {
  return ['CABALISTIC_DETERMINISTIC'];
};

export const getActiveProfile = () => {
  return { name: 'CABALISTIC_DETERMINISTIC' };
};

// Utility function for legacy compatibility
export const reduceToDigitAllowZero = (n: number): number => {
  let x = n;
  while (x >= 10) {
    x = x.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return x;
};

export const isVowel = (ch: string): boolean => {
  return ['A','E','I','O','U','Y'].includes(ch.toUpperCase());
};

export const mapNameToValues = (nome: string): number[] => {
  return clean(nome)
    .split('')
    .filter(ch => ch !== ' ')
    .map(ch => letterValue(ch));
};

// Core numerology calculations using new deterministic engine
export const calcMotivacao = (nome: string): number => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.numeros.Motivacao.numero;
};

export const calcImpressao = (nome: string): number => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.numeros.Impressao.numero;
};

export const calcExpressao = (nome: string): number => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.numeros.Expressao.numero;
};

export const calcDestino = (d: number, m: number, y: number): number => {
  const dateStr = `${d.toString().padStart(2,'0')}/${m.toString().padStart(2,'0')}/${y}`;
  const result = computeFullMap("TESTE", dateStr);
  return result.numeros.Destino.numero;
};

export const calcMissao = (nome: string, d: number, m: number, y: number): number => {
  const dateStr = `${d.toString().padStart(2,'0')}/${m.toString().padStart(2,'0')}/${y}`;
  const result = computeFullMap(nome, dateStr);
  return result.numeros.Missao.numero;
};

export const calcNumeroPsiquico = (dob: Date): number => {
  const dateStr = `${dob.getDate().toString().padStart(2,'0')}/${(dob.getMonth()+1).toString().padStart(2,'0')}/${dob.getFullYear()}`;
  const result = computeFullMap("TESTE", dateStr);
  return result.numeros.NumeroPsiquico.numero;
};

export const calcRespostaSubconsciente = (nome: string): number => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.carmicos.resposta_subconsciente;
};

export const calcLicoesCarmicas = (nome: string): number[] => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.carmicos.licoes;
};

export const calcTendenciasOcultas = (nome: string): number[] => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.carmicos.tendencias_ocultas;
};

export const detectarDividasCarmicas = (nome: string): number[] => {
  const result = computeFullMap(nome, "01/01/2000");
  return result.carmicos.dividas;
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

// Main function to generate complete numerological map using PERFIL_CONECTA
export function gerarMapaNumerologico(nome: string, dataNascimento: Date): MapaNumerologico {
  // Import the profile-based core functions
  const { 
    calcExpressao, 
    calcMotivacao, 
    calcImpressao, 
    calcDestino, 
    calcMissao, 
    calcPsiquico,
    calcRespostaSubconsciente,
    calcLicoesCarmicas,
    calcTendenciasOcultas,
    setActiveProfile
  } = require('./numerology-core');
  
  const { PERFIL_CONECTA } = require('./numerology-profile');
  
  // Set the correct profile for calculations
  setActiveProfile(PERFIL_CONECTA);
  
  const day = dataNascimento.getDate();
  const month = dataNascimento.getMonth() + 1;
  const year = dataNascimento.getFullYear();
  
  // Calculate core numbers using profile-based engine
  const motivacao = calcMotivacao(nome);
  const expressao = calcExpressao(nome);
  const impressao = calcImpressao(nome);
  const destino = calcDestino(day, month, year);
  const missao = calcMissao(nome, day, month, year); // Expressão + Destino
  const numeroPsiquico = calcPsiquico(day);
  
  // Karmic calculations
  const respostaSubconsciente = calcRespostaSubconsciente(nome);
  const licoesCarmicas = calcLicoesCarmicas(nome);
  const tendenciasOcultas = calcTendenciasOcultas(nome);
  const dividasCarmicas: number[] = []; // Legacy - kept empty
  
  // Life cycles and challenges using legacy functions
  const desafio1 = calcDesafio1(dataNascimento);
  const desafio2 = calcDesafio2(dataNascimento);
  const desafioPrincipal = calcDesafioPrincipal(desafio1, desafio2);
  
  const momento1 = calcMomento1(dataNascimento);
  const momento2 = calcMomento2(dataNascimento);
  const momento3 = calcMomento3(dataNascimento);
  const momento4 = calcMomento4(dataNascimento);
  
  // Life cycles (month, day, year reduced)
  const ciclo1 = reduceKeepMasters(month);
  const ciclo2 = reduceKeepMasters(day);
  const ciclo3 = reduceKeepMasters(year);
  
  // Personal year/month/day
  const currentDate = new Date();
  const anoPersonal = calcAnoPersonal(dataNascimento, currentDate.getFullYear());
  const mesPersonal = calcMesPersonal(anoPersonal, currentDate.getMonth() + 1);
  const diaPersonal = calcDiaPersonal(mesPersonal, currentDate.getDate());
  
  // Guardian Angel
  const anjoGuarda = calcAnjoGuarda(dataNascimento);
  
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
      principal: desafioPrincipal,
    },
    momentosDecisivos: {
      primeiro: momento1,
      segundo: momento2,
      terceiro: momento3,
      quarto: momento4,
    },
    ciclosVida: {
      primeiro: ciclo1,
      segundo: ciclo2,
      terceiro: ciclo3,
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