// Utilities for numerological calculations according to Kabbalah

export function clean(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[ÁÀÂÃ]/g, "A")
    .replace(/[ÉÊ]/g, "E")
    .replace(/[Í]/g, "I")
    .replace(/[ÓÔÕ]/g, "O")
    .replace(/[ÚÜ]/g, "U")
    .toUpperCase()
    .replace(/[^A-ZÇ]/g, ""); // keep only A-Z and Ç
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
  
  const soma = dia + mes + ano;
  return reduceKeepMasters(soma);
}

export function calcMissao(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  
  const soma = dia + mes;
  return reduceKeepMasters(soma);
}

export function calcNumeroPsiquico(dob: Date): number {
  const dia = dob.getDate();
  return reduceKeepMasters(dia);
}

export function calcRespostaSubconsciente(nome: string): number {
  const values = mapNameToValues(nome);
  const uniqueNumbers = new Set(values.filter(v => v > 0 && v <= 9));
  const count = uniqueNumbers.size;
  
  // Limitar ao intervalo [2..9]
  return Math.max(2, Math.min(9, count));
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
  
  return Object.entries(counter)
    .filter(([_, count]) => count >= 2)
    .map(([num, _]) => parseInt(num));
}

export function detectarDividasCarmicas(valores: number[]): number[] {
  return valores.filter(v => [13, 14, 16, 19].includes(v));
}

export function calcDesafio1(dob: Date): number {
  const dia = reduceKeepMasters(dob.getDate());
  const mes = reduceKeepMasters(dob.getMonth() + 1);
  return Math.min(9, Math.abs(dia - mes));
}

export function calcDesafio2(dob: Date): number {
  const mes = reduceKeepMasters(dob.getMonth() + 1);
  const ano = reduceKeepMasters(dob.getFullYear());
  return Math.min(9, Math.abs(mes - ano));
}

export function calcDesafioPrincipal(d1: number, d2: number): number {
  return Math.min(9, Math.abs(d1 - d2));
}

export function calcMomento1(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  return reduceKeepMasters(dia + mes);
}

export function calcMomento2(dob: Date): number {
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  return reduceKeepMasters(mes + ano);
}

export function calcMomento3(dob: Date): number {
  const dia = dob.getDate();
  const ano = dob.getFullYear();
  return reduceKeepMasters(dia + ano);
}

export function calcMomento4(dob: Date): number {
  const dia = dob.getDate();
  const mes = dob.getMonth() + 1;
  const ano = dob.getFullYear();
  return reduceKeepMasters(dia + mes + ano);
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
  
  // Calculate intermediate values for karmic debts
  const valores = mapNameToValues(nome);
  const motivacaoSum = [...clean(nome)].filter(isVowel).map(letterValue).reduce((a, b) => a + b, 0);
  const impressaoSum = [...clean(nome)].filter(ch => !isVowel(ch)).map(letterValue).reduce((a, b) => a + b, 0);
  const expressaoSum = valores.reduce((a, b) => a + b, 0);
  const destinoSum = dataNascimento.getDate() + dataNascimento.getMonth() + 1 + dataNascimento.getFullYear();
  
  return {
    motivacao: calcMotivacao(nome),
    impressao: calcImpressao(nome),
    expressao: calcExpressao(nome),
    destino: calcDestino(dataNascimento),
    missao: calcMissao(dataNascimento),
    numeroPsiquico: calcNumeroPsiquico(dataNascimento),
    respostaSubconsciente: calcRespostaSubconsciente(nome),
    licoesCarmicas: calcLicoesCarmicas(nome),
    dividasCarmicas: detectarDividasCarmicas([motivacaoSum, impressaoSum, expressaoSum, destinoSum]),
    tendenciasOcultas: calcTendenciasOcultas(nome),
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