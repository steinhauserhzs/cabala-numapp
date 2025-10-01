// Numerology calculation utilities - PROFILE-BASED ENGINE
import { ANGELS_BASE, HARMONICS_BASE, COLORS_BASE, CONJUGAL_BASE } from '../data/angels-base';

// Import core profile-based functions
import {
  calcExpressao as coreCalcExpressao,
  calcMotivacao as coreCalcMotivacao,
  calcImpressao as coreCalcImpressao,
  calcDestino as coreCalcDestino,
  calcMissao as coreCalcMissao,
  calcPsiquico as coreCalcPsiquico,
  calcRespostaSubconsciente as coreCalcRespostaSubconsciente,
  calcLicoesCarmicas as coreCalcLicoesCarmicas,
  calcTendenciasOcultas as coreCalcTendenciasOcultas,
  stripButKeepCedilla,
  enableDebugMode as coreEnableDebugMode,
  getAuditLogs as coreGetAuditLogs,
  clearAuditLogs as coreClearAuditLogs,
  type AuditLog
} from './numerology-core';

// Re-export profile management
export { 
  getActiveProfile, 
  setActiveProfile, 
  getAvailableProfiles 
} from './profile-singleton';

// Re-export for convenience
export { PERFIL_CONECTA, PERFIL_OFICIAL_JF, type NumerologyProfile } from './numerology-profile';
export { PERFIL_OFICIAL_FINAL } from './official-profile-final';

// Use cedilla-preserving clean from core
export const clean = stripButKeepCedilla;
export const letterValue = (ch: string) => {
  const profile = require('./profile-singleton').getActiveProfile();
  return profile.map[ch.toUpperCase()] || 0;
};

// Profile-based reduceKeepMasters using active profile's masters
export const reduceKeepMasters = (n: number): number => {
  const profile = require('./profile-singleton').getActiveProfile();
  const masters = profile.masters || new Set([11, 22]);
  
  if (masters.has(n)) return n;
  
  let result = n;
  while (result > 9 && !masters.has(result)) {
    result = result.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return result;
};

// Debug and audit functions
export const enableDebugMode = coreEnableDebugMode;
export const getAuditLogs = coreGetAuditLogs;
export const clearAuditLogs = coreClearAuditLogs;
export type { AuditLog };

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

// Core numerology calculations using profile-based engine
export const calcMotivacao = (nome: string): number => {
  return coreCalcMotivacao(nome);
};

export const calcImpressao = (nome: string): number => {
  return coreCalcImpressao(nome);
};

export const calcExpressao = (nome: string): number => {
  return coreCalcExpressao(nome);
};

export const calcDestino = (d: number, m: number, y: number): number => {
  return coreCalcDestino(d, m, y);
};

export const calcMissao = (nome: string, d: number, m: number, y: number): number => {
  return coreCalcMissao(nome, d, m, y);
};

export const calcNumeroPsiquico = (dob: Date): number => {
  return coreCalcPsiquico(dob.getDate());
};

export const calcRespostaSubconsciente = (nome: string): number => {
  return coreCalcRespostaSubconsciente(nome);
};

export const calcLicoesCarmicas = (nome: string): number[] => {
  return coreCalcLicoesCarmicas(nome);
};

export const calcTendenciasOcultas = (nome: string): number[] => {
  return coreCalcTendenciasOcultas(nome);
};

export const detectarDividasCarmicas = (nome: string): number[] => {
  // Legacy function - karmic debts detection moved to specialized module
  return [];
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
  const day = dataNascimento.getDate();
  const month = dataNascimento.getMonth() + 1;
  const year = dataNascimento.getFullYear();
  
  // Calculate core numbers using profile-based engine (already uses active profile)
  const motivacao = calcMotivacao(nome);
  const expressao = calcExpressao(nome);
  const impressao = calcImpressao(nome);
  const destino = calcDestino(day, month, year);
  const missao = calcMissao(nome, day, month, year);
  const numeroPsiquico = coreCalcPsiquico(day);
  
  // Karmic calculations
  const respostaSubconsciente = calcRespostaSubconsciente(nome);
  const licoesCarmicas = calcLicoesCarmicas(nome);
  const tendenciasOcultas = calcTendenciasOcultas(nome);
  const dividasCarmicas: number[] = [];
  
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