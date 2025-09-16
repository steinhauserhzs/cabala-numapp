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
  const vogais = "AEIOUY"; // Y conta como vogal
  return removerAcentos(nome).toUpperCase().split("").filter(letra => vogais.includes(letra)).join("");
}

export function obterConsoantes(nome: string): string {
  const vogais = "AEIOUY"; // Y conta como vogal
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

export function calcularRespostaSubconsciente(nome: string): number {
  const texto = removerAcentos(nome).toUpperCase().replace(/[^A-ZÇ]/g, "");
  const numerosEncontrados = new Set<number>();
  
  for (const letra of texto) {
    const numero = letraParaNumero(letra);
    if (numero > 0) {
      numerosEncontrados.add(numero);
    }
  }
  
  return numerosEncontrados.size;
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

// Novas funções para cálculos adicionais
export function calcularLicoesCarmicas(nome: string): number[] {
  const texto = removerAcentos(nome).toUpperCase().replace(/[^A-ZÇ]/g, "");
  const numerosPresentes = new Set<number>();
  
  for (const letra of texto) {
    const numero = letraParaNumero(letra);
    if (numero > 0) {
      numerosPresentes.add(numero);
    }
  }
  
  const todosNumeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return todosNumeros.filter(num => !numerosPresentes.has(num));
}

export function calcularDividasCarmicas(nome: string, data: Date): number[] {
  const dividas: number[] = [];
  
  // Verificar valores intermediários durante cálculos
  const motivacao = calcularMotivacao(nome);
  const impressao = calcularImpressao(nome);
  const expressao = calcularNome(nome);
  const destino = calcularDestino(data);
  
  // Verificar se algum cálculo intermediário resulta em 13, 14, 16 ou 19
  const valoresIntermediarios = [
    obterVogais(nome).split('').reduce((sum, letra) => sum + letraParaNumero(letra), 0),
    obterConsoantes(nome).split('').reduce((sum, letra) => sum + letraParaNumero(letra), 0),
    nome.split('').reduce((sum, letra) => sum + letraParaNumero(letra), 0),
    data.getDate() + data.getMonth() + 1 + data.getFullYear()
  ];
  
  for (const valor of valoresIntermediarios) {
    if ([13, 14, 16, 19].includes(valor)) {
      dividas.push(valor);
    }
  }
  
  return [...new Set(dividas)]; // Remove duplicatas
}

export function calcularTendenciasOcultas(nome: string): number[] {
  const texto = removerAcentos(nome).toUpperCase().replace(/[^A-ZÇ]/g, "");
  const contadores: Record<number, number> = {};
  
  for (const letra of texto) {
    const numero = letraParaNumero(letra);
    if (numero > 0) {
      contadores[numero] = (contadores[numero] || 0) + 1;
    }
  }
  
  const media = Object.values(contadores).reduce((a, b) => a + b, 0) / Object.keys(contadores).length;
  return Object.entries(contadores)
    .filter(([_, count]) => count > media * 1.5)
    .map(([numero, _]) => parseInt(numero));
}

export function calcularCiclosDeVida(data: Date): { primeiro: number; segundo: number; terceiro: number } {
  const dia = reduzirNumero(data.getDate());
  const mes = reduzirNumero(data.getMonth() + 1);
  const ano = reduzirNumero(data.getFullYear());
  
  return {
    primeiro: dia,
    segundo: mes,
    terceiro: ano
  };
}

export function calcularDesafios(data: Date): { primeiro: number; segundo: number; terceiro: number; quarto: number } {
  const dia = reduzirNumero(data.getDate());
  const mes = reduzirNumero(data.getMonth() + 1);
  const ano = reduzirNumero(data.getFullYear());
  
  const primeiro = Math.abs(mes - dia);
  const segundo = Math.abs(ano - dia);
  const terceiro = Math.abs(primeiro - segundo);
  const quarto = Math.abs(mes - ano);
  
  return {
    primeiro: Math.min(primeiro, 9),
    segundo: Math.min(segundo, 9),
    terceiro: Math.min(terceiro, 9),
    quarto: Math.min(quarto, 9)
  };
}

export function calcularMomentosDecisivos(data: Date): { primeiro: number; segundo: number; terceiro: number; quarto: number } {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  
  return {
    primeiro: reduzirNumero(dia + mes),
    segundo: reduzirNumero(mes + ano),
    terceiro: reduzirNumero(dia + ano),
    quarto: reduzirNumero(dia + mes + ano)
  };
}

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
  ciclosDeVida: { primeiro: number; segundo: number; terceiro: number };
  desafios: { primeiro: number; segundo: number; terceiro: number; quarto: number };
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
  
  const anoPersonal = calcularAnoPersonal(dataNascimento, anoAtual);
  const mesPersonal = calcularMesPersonal(anoPersonal, mesAtual);
  
  return {
    motivacao: calcularMotivacao(nome),
    impressao: calcularImpressao(nome),
    expressao: calcularNome(nome),
    destino: calcularDestino(dataNascimento),
    missao: calcularMissao(dataNascimento),
    numeroPsiquico: calcularNumeroPsiquico(dataNascimento),
    respostaSubconsciente: calcularRespostaSubconsciente(nome), // Corrigido: baseado no nome
    licoesCarmicas: calcularLicoesCarmicas(nome),
    dividasCarmicas: calcularDividasCarmicas(nome, dataNascimento),
    tendenciasOcultas: calcularTendenciasOcultas(nome),
    ciclosDeVida: calcularCiclosDeVida(dataNascimento),
    desafios: calcularDesafios(dataNascimento),
    momentosDecisivos: calcularMomentosDecisivos(dataNascimento),
    anoPersonal,
    mesPersonal,
    diaPersonal: calcularDiaPersonal(mesPersonal, diaAtual)
  };
}