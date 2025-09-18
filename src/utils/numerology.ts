// Utilities for numerological calculations according to Kabbalah
// Now uses the new profile-based system for accurate calculations

import { 
  PERFIL_OFICIAL_JF, 
  calcExpressao as calcExpressaoCore,
  calcMotivacao as calcMotivacaoCore,
  calcImpressao as calcImpressaoCore,
  calcDestino as calcDestinoCore,
  calcPsiquico as calcPsiquicoCore,
  calcMissao as calcMissaoCore,
  calcRespostaSubconsciente as calcRespostaSubconscienteCore,
  calcLicoesCarmicas as calcLicoesCarmicasCore,
  calcTendenciasOcultas as calcTendenciasOcultasCore,
  reduceKeepMasters as reduceKeepMastersCore,
  reduceToDigitAllowZero as reduceToDigitAllowZeroCore,
  stripButKeepCedilla,
  countAccentedVowels,
  enableDebugMode,
  getAuditLogs,
  clearAuditLogs,
  type AuditLog
} from './numerology-core';
import { NumerologyProfile } from './numerology-profile';

// Export the audit system for debugging
export { enableDebugMode, getAuditLogs, clearAuditLogs, type AuditLog };

// Legacy interface for diacritic bonuses (deprecated)
interface DiacriticInfo {
  letter: string;
  bonus: number;
}

export function extractDiacriticBonuses(text: string): DiacriticInfo[] {
  // Legacy function - now just counts accented vowels with standard bonus
  const count = countAccentedVowels(text);
  const bonuses: DiacriticInfo[] = [];
  
  // Find accented vowels in original text for backward compatibility
  const accentedPattern = /[áéíóúâêôãõàäëïöüýÁÉÍÓÚÂÊÔÃÕÀÄËÏÖÜÝ]/g;
  let match;
  while ((match = accentedPattern.exec(text)) !== null) {
    const char = match[0];
    const baseLetter = char.normalize('NFD')[0]?.toUpperCase() || char.toUpperCase();
    bonuses.push({
      letter: baseLetter,
      bonus: 2 // Standard bonus in PERFIL_OFICIAL_JF
    });
  }
  
  return bonuses;
}

export function clean(text: string): string {
  return stripButKeepCedilla(text);
}

export function letterValue(ch: string): number {
  // Now uses PERFIL_OFICIAL_JF mapping by default (Cabalistic 1-8 with Ç=6)
  return PERFIL_OFICIAL_JF.map[ch.toUpperCase()] || 0;
}

export function reduceKeepMasters(n: number): number {
  return reduceKeepMastersCore(n, PERFIL_OFICIAL_JF.masters);
}

export function isVowel(ch: string): boolean {
  return PERFIL_OFICIAL_JF.vowels.has(ch.toUpperCase());
}

export function mapNameToValues(nome: string): number[] {
  const cleanName = clean(nome);
  return [...cleanName].map(letterValue);
}

export function calcMotivacao(nome: string): number {
  return calcMotivacaoCore(nome, PERFIL_OFICIAL_JF);
}

export function calcImpressao(nome: string): number {
  return calcImpressaoCore(nome, PERFIL_OFICIAL_JF);
}

export function calcExpressao(nome: string): number {
  return calcExpressaoCore(nome, PERFIL_OFICIAL_JF);
}

export function calcDestino(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  return calcDestinoCore(dia, mes, ano, PERFIL_OFICIAL_JF);
}

export function calcMissao(nome: string, dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  return calcMissaoCore(nome, dia, mes, ano, PERFIL_OFICIAL_JF);
}

export function calcNumeroPsiquico(dob: Date): number {
  const dia = dob.getDate();
  return calcPsiquicoCore(dia, PERFIL_OFICIAL_JF);
}

export function calcRespostaSubconsciente(nome: string): number {
  return calcRespostaSubconscienteCore(nome, PERFIL_OFICIAL_JF);
}

export function calcLicoesCarmicas(nome: string): number[] {
  return calcLicoesCarmicasCore(nome, PERFIL_OFICIAL_JF);
}

export function calcTendenciasOcultas(nome: string): number[] {
  return calcTendenciasOcultasCore(nome, PERFIL_OFICIAL_JF);
}

export function detectarDividasCarmicas(nome: string): number[] {
  // Detect Karmic Debts: 13, 14, 16, 19 using word-by-word analysis with Pythagorean table
  const pythagoreanMap: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8, Ç: 3
  };
  
  const dividasCarmicas: number[] = [];
  const words = nome.trim().split(/\s+/);
  
  for (const word of words) {
    const cleanWord = clean(word);
    let wordSum = 0;
    
    for (const char of cleanWord) {
      wordSum += pythagoreanMap[char] || 0;
    }
    
    // Check reduction steps for this word
    const reductionSteps = getAllReductionSteps(wordSum);
    for (const step of reductionSteps) {
      if ([13, 14, 16, 19].includes(step)) {
        if (!dividasCarmicas.includes(step)) {
          dividasCarmicas.push(step);
        }
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[detectarDividasCarmicas] palavra "${word}": soma=${wordSum}, etapas=[${reductionSteps.join(',')}]`);
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[detectarDividasCarmicas] dívidas encontradas: [${dividasCarmicas.join(',')}]`);
  }
  
  return dividasCarmicas.sort();
}

// Helper function to get all reduction steps for a number
function getAllReductionSteps(n: number): number[] {
  const steps: number[] = [];
  let current = n;
  
  while (current > 9 && current !== 11 && current !== 22) {
    steps.push(current);
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, digit) => sum + digit, 0);
  }
  
  steps.push(current);
  return steps;
}

// Helper for challenges that allows 0 and doesn't preserve masters
export function reduceToDigitAllowZero(n: number): number {
  return reduceToDigitAllowZeroCore(n);
}

export function calcDesafio1(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  // Reduce components to a single digit (allow 0) before difference
  const diaR = reduceToDigitAllowZero(dia);
  const mesR = reduceToDigitAllowZero(mes);
  const diff = Math.abs(diaR - mesR);
  const result = reduceToDigitAllowZero(diff);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcDesafio1] dia=${dia}(${diaR}) mes=${mes}(${mesR}) diff=${diff} result=${result}`);
  }
  
  return result;
}

export function calcDesafio2(dob: Date): number {
  const dia = dob.getDate();
  const ano = dob.getFullYear();
  // Reduce year to a single digit (no masters) before difference
  const anoR = reduceToDigitAllowZero(ano);
  const diaR = reduceToDigitAllowZero(dia);
  const diff = Math.abs(diaR - anoR);
  const result = reduceToDigitAllowZero(diff);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcDesafio2] dia=${dia}(${diaR}) ano=${ano}(${anoR}) diff=${diff} result=${result}`);
  }
  
  return result;
}

export function calcDesafioPrincipal(d1: number, d2: number): number {
  const diff = Math.abs(d1 - d2);
  const result = reduceToDigitAllowZero(diff);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcDesafioPrincipal] d1=${d1} d2=${d2} diff=${diff} result=${result}`);
  }
  
  return result;
}

export function calcMomento1(dob: Date): number {
  // 1º Momento Decisivo: reduce(dia + mês)
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  const soma = dia + mes;
  const result = reduceKeepMasters(soma);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcMomento1] dia=${dia} mes=${mes} soma=${soma} result=${result}`);
  }
  
  return result;
}

export function calcMomento2(dob: Date): number {
  // 2º Momento Decisivo: reduce(dia + ano)
  const dia = dob.getDate();
  const ano = dob.getFullYear();
  const soma = dia + ano;
  const result = reduceKeepMasters(soma);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcMomento2] dia=${dia} ano=${ano} soma=${soma} result=${result}`);
  }
  
  return result;
}

export function calcMomento3(dob: Date): number {
  // 3º Momento Decisivo: reduce(1º + 2º)
  const primeiro = calcMomento1(dob);
  const segundo = calcMomento2(dob);
  const soma = primeiro + segundo;
  const result = reduceKeepMasters(soma);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcMomento3] primeiro=${primeiro} segundo=${segundo} soma=${soma} result=${result}`);
  }
  
  return result;
}

export function calcMomento4(dob: Date): number {
  // 4º Momento Decisivo: reduce(mês + ano)
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  const soma = mes + ano;
  const result = reduceKeepMasters(soma);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcMomento4] mes=${mes} ano=${ano} soma=${soma} result=${result}`);
  }
  
  return result;
}

export function calcAnoPersonal(data: Date, anoAtual: number): number {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  
  const soma = dia + mes + anoAtual;
  return reduceKeepMasters(soma);
}

export function calcMesPersonal(anoPersonal: number, mesAtual: number): number {
  const soma = anoPersonal + mesAtual;
  return reduceKeepMasters(soma);
}

export function calcDiaPersonal(mesPersonal: number, diaAtual: number): number {
  const soma = mesPersonal + diaAtual;
  return reduceKeepMasters(soma);
}

export function calcAnjoGuarda(dob: Date): string {
  // Legacy function kept for compatibility - but should use calcAnjoGuardaFromSupabase for accuracy
  console.warn('[calcAnjoGuarda] Using legacy angel calculation. Consider using calcAnjoGuardaFromSupabase for Supabase content.');
  
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  
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

// Legacy compatibility functions (deprecated - use new calc* functions)
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

export interface MapaNumerologico {
  motivacao: number;
  impressao: number;
  expressao: number;
  destino: number;
  missao: number;
  numeroPsiquico: number;
  respostaSubconsciente: number;
  licoesCarmicas: number[];
  dividasCarmicas: number[];
  tendenciasOcultas: number[];
  anjoGuarda: string;
  ciclosVida: { primeiro: number; segundo: number; terceiro: number };
  desafios: { primeiro: number; segundo: number; principal: number };
  momentosDecisivos: { primeiro: number; segundo: number; terceiro: number; quarto: number };
  anoPersonal: number;
  mesPersonal: number;
  diaPersonal: number;
}

export function gerarMapaNumerologico(nome: string, dataNascimento: Date): MapaNumerologico {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();
  
  const anoPersonal = calcAnoPersonal(dataNascimento, anoAtual);
  const mesPersonal = calcMesPersonal(anoPersonal, mesAtual);
  
  const desafio1 = calcDesafio1(dataNascimento);
  const desafio2 = calcDesafio2(dataNascimento);
  
  // Use new word-based karmic debt detection
  const dividasCarmicas = detectarDividasCarmicas(nome);
  
  if (typeof process !== 'undefined' && (process as any).env?.NODE_ENV !== 'production') {
    console.debug('[numerology] debug', {
      nomeLimpo: clean(nome),
      motivacao: calcMotivacao(nome),
      impressao: calcImpressao(nome),
      expressao: calcExpressao(nome),
      destino: calcDestino(dataNascimento),
      missao: calcMissao(nome, dataNascimento),
      dividasCarmicas
    });
  }
  
  return {
    motivacao: calcMotivacao(nome),
    impressao: calcImpressao(nome),
    expressao: calcExpressao(nome),
    destino: calcDestino(dataNascimento),
    missao: reduceKeepMasters(calcExpressao(nome) + calcDestino(dataNascimento)),
    numeroPsiquico: calcNumeroPsiquico(dataNascimento),
    respostaSubconsciente: calcRespostaSubconsciente(nome),
    licoesCarmicas: calcLicoesCarmicas(nome),
    dividasCarmicas,
    tendenciasOcultas: calcTendenciasOcultas(nome),
    anjoGuarda: 'Calculando...', // Will be updated by GuardianAngelCard component
    ciclosVida: {
      primeiro: reduceKeepMasters(dataNascimento.getMonth() + 1),  // 1º Ciclo: mês
      segundo: reduceKeepMasters(dataNascimento.getDate()),        // 2º Ciclo: dia
      terceiro: reduceKeepMasters(dataNascimento.getFullYear()),   // 3º Ciclo: ano
    },
    desafios: {
      primeiro: desafio1,
      segundo: desafio2,
      principal: calcDesafioPrincipal(desafio1, desafio2)
    },
    momentosDecisivos: {
      primeiro: calcMomento1(dataNascimento),
      segundo: calcMomento2(dataNascimento),
      terceiro: calcMomento3(dataNascimento),
      quarto: calcMomento4(dataNascimento)
    },
    anoPersonal,
    mesPersonal,
    diaPersonal: calcDiaPersonal(mesPersonal, diaAtual)
  };
}