// Utilities for numerological calculations according to Kabbalah

export function removerAcentos(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c");
}

export function letraParaNumero(letra: string): number {
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
  return mapa[letra.toUpperCase()] || 0;
}

export function reduzirNumero(n: number): number {
  while (![11, 22].includes(n) && n > 9) {
    n = n.toString().split("").reduce((soma, d) => soma + parseInt(d), 0);
  }
  return n;
}

export function calcularNome(nome: string): number {
  const texto = removerAcentos(nome).toUpperCase().replace(/[^A-ZÇ]/g, "");
  const numeros = [...texto].map(letraParaNumero);
  return reduzirNumero(numeros.reduce((a, b) => a + b, 0));
}

export function obterVogais(nome: string): string {
  const vogais = "AEIOU";
  return removerAcentos(nome).toUpperCase().split("").filter(letra => vogais.includes(letra)).join("");
}

export function obterConsoantes(nome: string): string {
  const vogais = "AEIOU";
  return removerAcentos(nome).toUpperCase().replace(/[^A-ZÇ]/g, "").split("").filter(letra => !vogais.includes(letra)).join("");
}

export function calcularMotivacao(nome: string): number {
  const vogais = obterVogais(nome);
  return calcularNome(vogais);
}

export function calcularImpressao(nome: string): number {
  const consoantes = obterConsoantes(nome);
  return calcularNome(consoantes);
}

export function calcularDestino(data: Date): number {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  
  const soma = dia + mes + ano;
  return reduzirNumero(soma);
}

export function calcularMissao(data: Date): number {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  
  const soma = dia + mes;
  return reduzirNumero(soma);
}

export function calcularNumeroPsiquico(data: Date): number {
  const dia = data.getDate();
  return reduzirNumero(dia);
}

export function calcularRespostaSubconsciente(data: Date): number {
  const dataStr = data.toLocaleDateString('pt-BR').replace(/\//g, '');
  const digitosCounts: Record<string, number> = {};
  
  for (const digito of dataStr) {
    digitosCounts[digito] = (digitosCounts[digito] || 0) + 1;
  }
  
  return Object.keys(digitosCounts).length;
}

export function calcularAnoPersonal(data: Date, anoAtual: number): number {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  
  const soma = dia + mes + anoAtual;
  return reduzirNumero(soma);
}

export function calcularMesPersonal(anoPersonal: number, mesAtual: number): number {
  const soma = anoPersonal + mesAtual;
  return reduzirNumero(soma);
}

export function calcularDiaPersonal(mesPersonal: number, diaAtual: number): number {
  const soma = mesPersonal + diaAtual;
  return reduzirNumero(soma);
}

export interface MapaNumerologico {
  motivacao: number;
  impressao: number;
  expressao: number;
  destino: number;
  missao: number;
  numeroPsiquico: number;
  respostaSubconsciente: number;
  anoPersonal: number;
  mesPersonal: number;
  diaPersonal: number;
}

export function gerarMapaNumerologico(nome: string, dataNascimento: Date): MapaNumerologico {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();
  
  const anoPersonal = calcularAnoPersonal(dataNascimento, anoAtual);
  const mesPersonal = calcularMesPersonal(anoPersonal, mesAtual);
  
  return {
    motivacao: calcularMotivacao(nome),
    impressao: calcularImpressao(nome),
    expressao: calcularNome(nome),
    destino: calcularDestino(dataNascimento),
    missao: calcularMissao(dataNascimento),
    numeroPsiquico: calcularNumeroPsiquico(dataNascimento),
    respostaSubconsciente: calcularRespostaSubconsciente(dataNascimento),
    anoPersonal,
    mesPersonal,
    diaPersonal: calcularDiaPersonal(mesPersonal, diaAtual)
  };
}