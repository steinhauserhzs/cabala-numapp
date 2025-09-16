// Utilities for numerological calculations according to Kabbalah

export function clean(text: string): string {
  // Preserve Ç by temporarily replacing it
  const withPlaceholder = text.replace(/[çÇ]/g, '§');
  
  const normalized = withPlaceholder
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z§]/g, '')
    .replace(/§/g, 'Ç'); // Restore Ç
    
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[clean] "${text}" -> "${normalized}"`);
  }
  
  return normalized;
}

export function letterValue(ch: string): number {
  const mapa: Record<string, number> = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5,
    U: 6, V: 6, W: 6, X: 6, Ç: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };
  return mapa[ch.toUpperCase()] || 0;
}

export function reduceKeepMasters(n: number): number {
  while (![11, 22].includes(n) && n > 9) {
    n = n.toString().split("").reduce((soma, d) => soma + parseInt(d), 0);
  }
  return n;
}

export function isVowel(ch: string): boolean {
  return "AEIOUY".includes(ch.toUpperCase());
}

export function mapNameToValues(nome: string): number[] {
  const cleanName = clean(nome);
  return [...cleanName].map(letterValue);
}

export function calcMotivacao(nome: string): number {
  const cleanName = clean(nome);
  const vowelSum = [...cleanName]
    .filter(isVowel)
    .map(letterValue)
    .reduce((a, b) => a + b, 0);
  return reduceKeepMasters(vowelSum);
}

export function calcImpressao(nome: string): number {
  const cleanName = clean(nome);
  const consonantSum = [...cleanName]
    .filter(ch => !isVowel(ch))
    .map(letterValue)
    .reduce((a, b) => a + b, 0);
  return reduceKeepMasters(consonantSum);
}

export function calcExpressao(nome: string): number {
  const values = mapNameToValues(nome);
  const sum = values.reduce((a, b) => a + b, 0);
  return reduceKeepMasters(sum);
}

export function calcDestino(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  
  // Reduce each component first, then sum them
  const diaReduced = reduceKeepMasters(dia);
  const mesReduced = reduceKeepMasters(mes);
  const anoReduced = reduceKeepMasters(ano);
  
  const soma = diaReduced + mesReduced + anoReduced;
  return reduceKeepMasters(soma);
}

export function calcMissao(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  
  // Reduce each component first, then sum them  
  const diaReduced = reduceKeepMasters(dia);
  const mesReduced = reduceKeepMasters(mes);
  
  const soma = diaReduced + mesReduced;
  return reduceKeepMasters(soma);
}

export function calcNumeroPsiquico(dob: Date): number {
  const dia = dob.getDate();
  return reduceKeepMasters(dia);
}

export function calcRespostaSubconsciente(nome: string): number {
  const cleanedName = clean(nome);
  const valores = mapNameToValues(cleanedName);
  
  // Count unique values from 1-9 present in the name
  const uniqueValues = new Set(valores.filter(v => v >= 1 && v <= 9));
  const count = uniqueValues.size;
  
  // Clamp between 2 and 9
  const result = Math.max(2, Math.min(9, count));
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcRespostaSubconsciente] nome: ${nome}, valores: [${valores.join(',')}], únicos: [${Array.from(uniqueValues).sort().join(',')}], resultado: ${result}`);
  }
  
  return result;
}

export function calcLicoesCarmicas(nome: string): number[] {
  const values = mapNameToValues(nome);
  const presentNumbers = new Set(values.filter(v => v > 0 && v <= 9));
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return allNumbers.filter(num => !presentNumbers.has(num));
}

export function calcTendenciasOcultas(nome: string): number[] {
  const values = mapNameToValues(nome);
  const counter: Record<number, number> = {};
  
  values.forEach(v => {
    if (v > 0 && v <= 9) {
      counter[v] = (counter[v] || 0) + 1;
    }
  });
  
  // Return numbers that appear 4 or more times
  return Object.entries(counter)
    .filter(([_, count]) => count >= 4)
    .map(([num, _]) => parseInt(num));
}

export function detectarDividasCarmicas(valores: number[]): number[] {
  return valores.filter(v => [13, 14, 16, 19].includes(v));
}

// Helper for challenges that allows 0 and doesn't preserve masters
export function reduceToDigitAllowZero(n: number): number {
  while (n >= 10) {
    const digits = n.toString().split('').map(Number);
    n = digits.reduce((sum, digit) => sum + digit, 0);
  }
  return n;
}

export function calcDesafio1(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  // Don't reduce before calculating difference
  const diff = Math.abs(dia - mes);
  const result = reduceToDigitAllowZero(diff);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcDesafio1] dia=${dia} mes=${mes} diff=${diff} result=${result}`);
  }
  
  return result;
}

export function calcDesafio2(dob: Date): number {
  const dia = dob.getDate();
  const ano = dob.getFullYear();
  // Calculate difference between day and year directly
  const diff = Math.abs(dia - reduceKeepMasters(ano));
  const result = reduceToDigitAllowZero(diff);
  
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[calcDesafio2] dia=${dia} ano=${ano}(${reduceKeepMasters(ano)}) diff=${diff} result=${result}`);
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
  // Primeiro momento: Missão (dia + mês reduzidos)
  return calcMissao(dob);
}

export function calcMomento2(dob: Date): number {
  // Segundo momento: dia + ano reduzidos separadamente
  const dia = dob.getDate();
  const ano = dob.getFullYear();
  const diaReduced = reduceKeepMasters(dia);
  const anoReduced = reduceKeepMasters(ano);
  return reduceKeepMasters(diaReduced + anoReduced);
}

export function calcMomento3(dob: Date): number {
  // Terceiro momento: primeiro + segundo momentos
  const momento1 = calcMomento1(dob);
  const momento2 = calcMomento2(dob);
  return reduceKeepMasters(momento1 + momento2);
}

export function calcMomento4(dob: Date): number {
  // Quarto momento: primeiro momento
  return calcMomento1(dob);
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
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Calculate day of year (1-365/366)
  const start = new Date(dob.getFullYear(), 0, 0);
  const diff = dob.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Each angel governs 5 days, starting from March 21 (day 80 in regular years)
  // March 21 = day 80, so we adjust: if dayOfYear < 80, add 365
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
  
  // Calculate intermediate values for karmic debts - check all intermediate sums
  const valores = mapNameToValues(nome);
  const motivacaoSum = [...clean(nome)].filter(isVowel).map(letterValue).reduce((a, b) => a + b, 0);
  const impressaoSum = [...clean(nome)].filter(ch => !isVowel(ch)).map(letterValue).reduce((a, b) => a + b, 0);
  const expressaoSum = valores.reduce((a, b) => a + b, 0);
  const destinoSum = dataNascimento.getDate() + (dataNascimento.getMonth() + 1) + dataNascimento.getFullYear();
  
  // Check for all possible karmic debt combinations
  const allIntermediateSums = [motivacaoSum, impressaoSum, expressaoSum, destinoSum];
  
  // Also check individual name letter sums that could form karmic debts
  const cleanedName = clean(nome);
  for (let i = 0; i < cleanedName.length; i++) {
    for (let j = i + 1; j <= cleanedName.length; j++) {
      const substring = cleanedName.slice(i, j);
      const substringSum = [...substring].map(letterValue).reduce((a, b) => a + b, 0);
      if ([13, 14, 16, 19].includes(substringSum)) {
        allIntermediateSums.push(substringSum);
      }
    }
  }
  
  if (typeof process !== 'undefined' && (process as any).env?.NODE_ENV !== 'production') {
    console.debug('[numerology] debug', {
      nomeLimpo: clean(nome),
      motivacao: { sum: motivacaoSum, reduced: reduceKeepMasters(motivacaoSum) },
      impressao: { sum: impressaoSum, reduced: reduceKeepMasters(impressaoSum) },
      expressao: { sum: expressaoSum, reduced: reduceKeepMasters(expressaoSum) },
      destino: { sum: destinoSum, reduced: reduceKeepMasters(destinoSum) },
    });
  }
  
  return {
    motivacao: calcMotivacao(nome),
    impressao: calcImpressao(nome),
    expressao: calcExpressao(nome),
    destino: calcDestino(dataNascimento),
    missao: calcMissao(dataNascimento),
    numeroPsiquico: calcNumeroPsiquico(dataNascimento),
    respostaSubconsciente: calcRespostaSubconsciente(nome),
    licoesCarmicas: calcLicoesCarmicas(nome),
    dividasCarmicas: detectarDividasCarmicas(allIntermediateSums),
    tendenciasOcultas: calcTendenciasOcultas(nome),
    anjoGuarda: calcAnjoGuarda(dataNascimento),
    ciclosVida: {
      primeiro: reduceKeepMasters(calcMomento1(dataNascimento)),
      segundo: reduceKeepMasters(calcExpressao(nome)),
      terceiro: reduceKeepMasters(calcMomento1(dataNascimento) + calcExpressao(nome))
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