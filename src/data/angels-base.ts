// Base Angels table structure - 72 Shem HaMephorash Angels
// This is a starter structure - you can populate with complete data later

export const ANGELS_BASE = {
  // Janeiro
  "01/01": { nome: "Vehuiah", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "02/01": { nome: "Jeliel", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "03/01": { nome: "Sitael", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "04/01": { nome: "Elemiah", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "05/01": { nome: "Mahasiah", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "06/01": { nome: "Lelahel", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "07/01": { nome: "Achaiah", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  "08/01": { nome: "Cahetel", categoria: "Serafim", horarios: "", salmo: "", prece: "" },
  
  // Fevereiro  
  "09/02": { nome: "Haziel", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "10/02": { nome: "Aladiah", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "11/02": { nome: "Lauviah", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "12/02": { nome: "Hahaiah", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "13/02": { nome: "Iezalel", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "14/02": { nome: "Mebahel", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "15/02": { nome: "Hariel", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  "16/02": { nome: "Hekamiah", categoria: "Querubim", horarios: "", salmo: "", prece: "" },
  
  // Março
  "17/03": { nome: "Lauviah", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "18/03": { nome: "Caliel", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "19/03": { nome: "Leuviah", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "20/03": { nome: "Pahaliah", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "21/03": { nome: "Nelchael", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "22/03": { nome: "Yeiayel", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "23/03": { nome: "Melahel", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  "24/03": { nome: "Hahiuiah", categoria: "Tronos", horarios: "", salmo: "", prece: "" },
  
  // Continue with remaining months and angels...
  // This is just a sample structure - you'll populate with complete 72 angels data
};

export const HARMONICS_BASE = {
  forExpression: {
    1: [2, 4, 9],
    2: [1, 3, 8],
    3: [2, 5, 6],
    4: [1, 6, 7],
    5: [3, 7, 8],
    6: [3, 4, 9],
    7: [4, 5, 2],
    8: [2, 5, 9],
    9: [1, 6, 8],
    11: [2, 4, 9],
    22: [4, 6, 8],
    33: [3, 6, 9]
  },
  forDestiny: {
    1: [1, 5, 7],
    2: [2, 4, 8], 
    3: [3, 6, 9],
    4: [1, 4, 8],
    5: [1, 5, 9],
    6: [2, 6, 8],
    7: [1, 3, 7],
    8: [2, 4, 8],
    9: [3, 6, 9],
    11: [2, 4, 9],
    22: [4, 6, 8],
    33: [3, 6, 9]
  },
  general: {
    1: [2, 4, 7, 9],
    2: [1, 3, 6, 8],
    3: [2, 5, 6, 9],
    4: [1, 6, 7, 8],
    5: [3, 7, 8, 9],
    6: [2, 3, 4, 9],
    7: [1, 4, 5, 8],
    8: [2, 4, 5, 9],
    9: [1, 3, 6, 8],
    11: [2, 4, 7, 9],
    22: [4, 6, 8, 11],
    33: [3, 6, 9, 22]
  }
};

export const COLORS_BASE = {
  1: ["vermelho", "laranja", "amarelo"],
  2: ["azul", "verde", "prata"],
  3: ["amarelo", "dourado", "laranja"],
  4: ["verde", "marrom", "bege"],
  5: ["azul", "prateado", "branco"],
  6: ["rosa", "azul claro", "verde claro"],
  7: ["roxo", "violeta", "índigo"],
  8: ["marrom", "preto", "cinza"],
  9: ["vermelho", "dourado", "bronze"],
  10: ["todas as cores", "multicolorido"],
  11: ["prateado", "branco", "cristal"],
  12: ["azul", "verde", "turquesa"],
  13: ["preto", "vermelho escuro", "marrom"],
  14: ["azul", "verde", "amarelo"],
  15: ["vermelho", "preto", "marrom escuro"],
  16: ["vermelho", "preto", "cinza"],
  17: ["azul", "violeta", "prata"],
  18: ["amarelo", "verde claro", "branco"],
  19: ["dourado", "amarelo", "laranja"],
  20: ["vermelho", "dourado", "branco"],
  21: ["roxo", "dourado", "branco"],
  22: ["azul", "verde", "prata"],
  23: ["verde", "azul", "branco"],
  24: ["verde", "amarelo", "dourado"],
  25: ["azul", "prata", "branco"],
  26: ["rosa", "verde claro", "branco"],
  27: ["roxo", "violeta", "prata"],
  28: ["verde", "marrom", "dourado"],
  29: ["prateado", "azul", "branco"],
  30: ["dourado", "amarelo", "laranja"],
  31: ["vermelho", "dourado", "branco"]
};

export const CONJUGAL_BASE = {
  "1-1": { vibra: 2, nota: "Harmonia através da iniciativa compartilhada" },
  "1-2": { vibra: 3, nota: "Complementaridade entre liderança e diplomacia" },
  "1-3": { vibra: 4, nota: "Criatividade e expressão conjunta" },
  "2-2": { vibra: 4, nota: "Dupla sensibilidade e cooperação" },
  "2-3": { vibra: 5, nota: "Equilibrio entre razão e emoção" },
  "3-3": { vibra: 6, nota: "Criatividade e expressão em dobro" },
  // Continue with all combinations 1-1 through 9-9, plus master numbers
};