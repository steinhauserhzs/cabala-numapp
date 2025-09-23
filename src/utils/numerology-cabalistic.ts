// ===== Numerologia Cabalística – Engine determinística =====

type HarmonicsTable = {
  // Exemplo: por combinação ou por número-base
  // personalize conforme sua planilha de equivalência
  forExpression?: Record<number, number[]>;
  forDestiny?: Record<number, number[]>;
  // Ou uma tabela geral
  general?: Record<number, number[]>;
};

type ConjugalTable = {
  // Ex.: chave "A-B" = lista/nota; você decide a semântica
  // Ex: {"1-1": {vibra:"8", atrai:[7,9], eOposto:5, passivo:[1,3,4,6]}}
  [pair: string]: any;
};

type ColorsTable = {
  // dia (1..31) -> lista de cores
  [day: number]: string[];
};

type AngelsTable = {
  // "DD/MM" -> {nome, categoria?, horarios?, salmo?, prece?}
  [ddmm: string]: { nome: string; categoria?: string; horarios?: string; salmo?: string; prece?: string };
};

type Options = {
  harmonics?: HarmonicsTable;
  conjugal?: ConjugalTable;
  colors?: ColorsTable;
  angels?: AngelsTable;
  currentDate?: Date; // para Ano/Mês/Dia pessoal; default = hoje
};

// Letras mapeadas para valores 1-8 com Ç=6 e Y como vogal
const LETTER_MAP: Record<string, number> = {
  A:1, I:1, Q:1, J:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5,
  U:6, V:6, W:6, X:6, 'Ç':6,
  O:7, Z:7,
  F:8, P:8
};

// Vogais para cálculo da Motivação (Y é vogal)
const VOWELS = new Set(['A','E','I','O','U','Y']);

// Consoantes (inclui Ç) para cálculo da Impressão
const CONSONANTS = new Set(
  Object.keys(LETTER_MAP).filter(l => l !== 'Ç' && !VOWELS.has(l)).concat('Ç')
);

// Números mestres que não devem ser reduzidos
const MASTERS = new Set([11, 22, 33]);

// ---- util ----
/**
 * Normaliza nome para cálculo:
 * - preserva cedilha (Ç)
 * - remove TODOS os diacríticos
 * - upper-case
 * - mantém apenas [A-Z, Ç] e espaços simples
 */
function normalizeNameKeepingCedilla(input: string): string {
  if (!input) return '';

  // 1) Marca cedilha antes de decompor
  // Usamos dois placeholders distintos para diferenciar maiúscula e minúscula,
  // mas no final vamos para UPPER de qualquer forma.
  let s = input.replace(/ç/g, '§').replace(/Ç/g, '¤');

  // 2) Remove diacríticos (NFD → remove \p{M})
  s = s.normalize('NFD').replace(/\p{M}+/gu, '');

  // 3) Restaura cedilha
  s = s.replace(/§/g, 'ç').replace(/¤/g, 'Ç');

  // 4) Uppercase
  s = s.toUpperCase();

  // 5) Mantém apenas A-Z, Ç e espaços; colapsa espaços
  s = s.replace(/[^A-ZÇ\s]+/g, ' ').replace(/\s+/g, ' ').trim();

  return s;
}

/** Soma valores de letras válidas segundo a tabela */
function sumByTable(s: string): number {
  let sum = 0;
  for (const ch of s) {
    const v = LETTER_MAP[ch as keyof typeof LETTER_MAP];
    if (v) sum += v;
  }
  return sum;
}

/** Divide string em apenas letras (sem espaços) para somas globais */
function onlyLetters(s: string): string {
  return s.replace(/\s+/g, '');
}

/** Vogais para Motivação */
function onlyVowels(s: string): string {
  return [...s].filter(ch => VOWELS.has(ch)).join('');
}

/** Consoantes (inclui Ç) para Impressão */
function onlyConsonants(s: string): string {
  return [...s].filter(ch => CONSONANTS.has(ch)).join('');
}

function letterValue(ch: string): number {
  return LETTER_MAP[ch] ?? 0;
}

function reduceKeepMasters(n: number): number {
  if (MASTERS.has(n)) return n;
  let x = n;
  while (x >= 10) {
    const s = x.toString().split("").reduce((a,b)=>a+Number(b),0);
    if (MASTERS.has(s)) return s;
    x = s;
  }
  return x;
}

function sumByPredicate(name: string, pred: (ch: string)=>boolean) {
  const cleanName = normalizeNameKeepingCedilla(name);
  let total = 0;
  for (const ch of cleanName) {
    if ((ch >= "A" && ch <= "Z") || ch === "Ç") {
      if (pred(ch)) total += letterValue(ch);
    }
  }
  return { bruto: total, numero: reduceKeepMasters(total) };
}

function digitsSumOfDateString(dd: number, mm: number, yyyy: number): number {
  const s = `${dd.toString().padStart(2,"0")}${mm.toString().padStart(2,"0")}${yyyy.toString().padStart(4,"0")}`;
  return s.split("").reduce((a,b)=>a+Number(b),0);
}

function onlyDigits(n: number) {
  return n.toString().split("").reduce((a,b)=>a+Number(b),0);
}

// ---- principais ----
export function computeFullMap(fullName: string, birth: string, options: Options = {}) {
  // birth "DD/MM/AAAA"
  const [DD,MM,YYYY] = birth.split("/").map(Number);
  const normalized = normalizeNameKeepingCedilla(fullName);

  // vogais/consoantes
  const isVowel = (ch: string)=> VOWELS.has(ch);
  const isConsonant = (ch: string)=> ((ch>="A" && ch<="Z") || ch==="Ç") && !VOWELS.has(ch);

  const Motivacao   = sumByPredicate(normalized, isVowel);
  const Impressao   = sumByPredicate(normalized, isConsonant);
  const Expressao   = sumByPredicate(normalized, ()=>true);

  // Psíquico / Destino / Missão
  const psiFinal = reduceKeepMasters(DD);
  const somaData = digitsSumOfDateString(DD,MM,YYYY);
  const destinoFinal = reduceKeepMasters(somaData);
  const missaoSoma = destinoFinal + psiFinal;
  const missaoFinal = reduceKeepMasters(missaoSoma);

  // Frequências 1..8 + lições + tendências ocultas + resposta subconsciente
  const freq: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
  for (const ch of normalized) {
    if ((ch>="A" && ch<="Z") || ch==="Ç") {
      const v = letterValue(ch);
      if (v>=1 && v<=8) freq[v]++;
    }
  }
  const licoes = Object.entries(freq).filter(([k,v])=>v===0).map(([k])=>Number(k));
  const tendenciasOcultas = Object.entries(freq).filter(([k,v])=>v>=3).map(([k])=>Number(k));
  const respostaSubconsciente = Object.values(freq).filter(v=>v>0).length;

  // Dívidas cármicas (brutos de nome)
  const debtsRaw = new Set<number>();
  for (const raw of [Motivacao.bruto, Impressao.bruto, Expressao.bruto]) {
    if ([13,14,16,19].includes(raw)) debtsRaw.add(raw);
  }
  const dividas = Array.from(debtsRaw).sort((a,b)=>a-b);

  // Ciclos de vida
  const ciclo1 = reduceKeepMasters(MM);
  const ciclo2 = reduceKeepMasters(DD);
  const ciclo3 = reduceKeepMasters(onlyDigits(YYYY));

  // Desafios (1º,2º,3º) + Principal
  const desafio1 = reduceKeepMasters(Math.abs(DD - MM));
  const desafio2 = reduceKeepMasters(Math.abs(DD - onlyDigits(YYYY)));
  const desafio3 = reduceKeepMasters(Math.abs(desafio1 - desafio2));
  const desafioPrincipal = desafio3;

  // Momentos decisivos (pinnacles)
  const md1 = reduceKeepMasters(reduceKeepMasters(MM) + reduceKeepMasters(DD));
  const md2 = reduceKeepMasters(reduceKeepMasters(DD) + reduceKeepMasters(onlyDigits(YYYY)));
  const md3 = reduceKeepMasters(md1 + md2);
  const md4 = reduceKeepMasters(reduceKeepMasters(MM) + reduceKeepMasters(onlyDigits(YYYY)));

  // Ano/Mês/Dia pessoal (usar data corrente)
  const now = options.currentDate ?? new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth() + 1; // 1..12
  const currDay = now.getDate();

  const anoPessoal = reduceKeepMasters(reduceKeepMasters(DD) + reduceKeepMasters(MM) + reduceKeepMasters(onlyDigits(currYear)));
  const mesPessoal = reduceKeepMasters(anoPessoal + reduceKeepMasters(currMonth));
  const diaPessoal = reduceKeepMasters(mesPessoal + reduceKeepMasters(currDay));

  // Arcano (Tarô Maior) — mapeie direto pelo Destino
  const arcanoNum = destinoFinal; // 1..9 ou 11/22/33; se 33, você pode mapear para 33→(22 ou 6) conforme sua linha
  const arcanoNome = arcanoNameByNumber(arcanoNum);

  // Anjo (lookup por DD/MM)
  const angels = options.angels ?? {};
  const anjoKey = `${DD.toString().padStart(2,"0")}/${MM.toString().padStart(2,"0")}`;
  const anjoInfo = angels[anjoKey] ?? { nome: "", categoria:"", horarios:"", salmo:"", prece:"" };

  // Números Harmônicos (lookup)
  const harmonics = options.harmonics ?? {};
  const numsHarmonicos = {
    expressao: (harmonics.forExpression?.[Expressao.numero]) ?? [],
    destino:   (harmonics.forDestiny?.[destinoFinal]) ?? [],
    geral:     (harmonics.general?.[Expressao.numero] ?? []).concat(harmonics.general?.[destinoFinal] ?? []),
  };

  // Harmonia Conjugal (lookup — calc do par fica em nível superior, usando esse name/birth + do parceiro)
  // aqui retornamos apenas gancho vazio
  const harmoniaConjugal = {}; // preencha ao cruzar dois mapas com options.conjugal

  // Cores Favoráveis (lookup por dia)
  const colors = options.colors ?? {};
  const coresFavoraveis = colors[DD] ?? [];

  // Frequências 1..8 no nome (objeto com chaves string)
  const freqOut: Record<string, number> = {};
  for (const k of Object.keys(freq)) freqOut[k] = (freq as any)[k];

  return {
    nome_normalizado: normalized,
    data_nascimento: birth,
    numeros: {
      Motivacao: Motivacao,
      Impressao: Impressao,
      Expressao: Expressao,
      NumeroPsiquico: { dia: DD, numero: psiFinal },
      Destino: { soma_data: somaData, numero: destinoFinal },
      Missao: { soma_destino_psiquico: missaoSoma, numero: missaoFinal },
      Arcano: { numero: arcanoNum, nome: arcanoNome },
      Anjo: anjoInfo,
    },
    carmicos: {
      licoes: licoes,
      dividas: dividas,
      tendencias_ocultas: tendenciasOcultas,
      resposta_subconsciente: respostaSubconsciente
    },
    harmonia: {
      numeros_harmonicos: numsHarmonicos,
      harmonia_conjugal: harmoniaConjugal,
    },
    ciclos: {
      vida: [ciclo1, ciclo2, ciclo3],
      desafios: [desafio1, desafio2, desafio3],
      principal: desafioPrincipal,
      momentos_decisivos: [md1, md2, md3, md4],
    },
    pessoais: {
      ano: anoPessoal,
      mes: mesPessoal,
      dia: diaPessoal,
    },
    frequencias_1a8_no_nome: freqOut,
    cores_favoraveis: coresFavoraveis,
    // Campos adicionais opcionais para compatibilidade:
    dias_mes_favoraveis: [], // preencha via tabela se desejar
  };
}

// ---- Arcano helper (padrão simples por número) ----
function arcanoNameByNumber(n: number): string {
  // ajuste os nomes conforme sua convenção/PT-BR
  const map: Record<number,string> = {
    1:"I - O Mago",
    2:"II - A Sacerdotisa",
    3:"III - A Imperatriz",
    4:"IV - O Imperador",
    5:"V - O Hierofante",
    6:"VI - Os Enamorados",
    7:"VII - O Carro",
    8:"VIII - A Justiça",      // (ou Força, conforme linha)
    9:"IX - O Eremita",
    10:"X - A Roda da Fortuna",
    11:"XI - A Força",         // (ou Justiça)
    12:"XII - O Enforcado",
    13:"XIII - A Morte",
    14:"XIV - A Temperança",
    15:"XV - O Diabo",
    16:"XVI - A Torre",
    17:"XVII - A Estrela",
    18:"XVIII - A Lua",
    19:"XIX - O Sol",
    20:"XX - O Julgamento",
    21:"XXI - O Mundo",
    22:"XXII - O Louco",
    33:"(Mestre 33 – trate conforme sua linha)"
  };
  // regra comum: se 10..21 vem de reduções especiais; aqui usamos o próprio número do Destino
  return map[n] ?? `Arcano ${n}`;
}

// Export additional utilities for compatibility
export { 
  normalizeNameKeepingCedilla, 
  letterValue, 
  reduceKeepMasters, 
  sumByTable,
  onlyLetters,
  onlyVowels,
  onlyConsonants,
  VOWELS, 
  CONSONANTS,
  MASTERS 
};

// Export types
export type { Options, HarmonicsTable, ConjugalTable, ColorsTable, AngelsTable };