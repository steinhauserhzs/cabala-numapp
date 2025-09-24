// Calculadora de cores pessoais baseada nos números numerológicos
export interface CoresPessoais {
  principal: string;
  harmoniosas: string[];
  significado: string;
}

// Mapeamento de números para cores
const CORES_NUMEROLOGICAS: Record<number, CoresPessoais> = {
  1: {
    principal: "Vermelho",
    harmoniosas: ["Laranja", "Dourado", "Amarelo"],
    significado: "Cor da liderança, energia e pioneirismo. Estimula a ação e a coragem."
  },
  2: {
    principal: "Azul",
    harmoniosas: ["Prateado", "Branco", "Rosa"],
    significado: "Cor da cooperação, paz e intuição. Promove harmonia e diplomacia."
  },
  3: {
    principal: "Amarelo",
    harmoniosas: ["Laranja", "Verde-claro", "Dourado"],
    significado: "Cor da criatividade, comunicação e alegria. Estimula a expressão artística."
  },
  4: {
    principal: "Verde",
    harmoniosas: ["Marrom", "Azul-escuro", "Cinza"],
    significado: "Cor da estabilidade, trabalho e construção. Promove organização e disciplina."
  },
  5: {
    principal: "Turquesa",
    harmoniosas: ["Azul-claro", "Prata", "Lilás"],
    significado: "Cor da liberdade, aventura e comunicação. Estimula mudanças e viagens."
  },
  6: {
    principal: "Rosa",
    harmoniosas: ["Verde-claro", "Azul-pastel", "Dourado"],
    significado: "Cor do amor, família e responsabilidade. Promove cuidado e harmonia doméstica."
  },
  7: {
    principal: "Violeta",
    harmoniosas: ["Púrpura", "Prateado", "Branco"],
    significado: "Cor da espiritualidade, mistério e análise. Estimula a introspecção e sabedoria."
  },
  8: {
    principal: "Marrom",
    harmoniosas: ["Dourado", "Preto", "Vermelho-escuro"],
    significado: "Cor do sucesso material, autoridade e ambição. Promove realização e poder."
  },
  9: {
    principal: "Dourado",
    harmoniosas: ["Laranja", "Vermelho", "Amarelo"],
    significado: "Cor da sabedoria universal, compaixão e liderança espiritual."
  },
  11: {
    principal: "Prateado",
    harmoniosas: ["Branco", "Azul-claro", "Violeta"],
    significado: "Cor da intuição superior, inspiração e iluminação espiritual."
  },
  22: {
    principal: "Coral",
    harmoniosas: ["Dourado", "Verde", "Azul"],
    significado: "Cor do construtor de sonhos, realizações grandiosas e visão global."
  },
  33: {
    principal: "Cristal",
    harmoniosas: ["Todas as cores", "Branco puro", "Dourado"],
    significado: "Cor da mestria espiritual, cura universal e amor incondicional."
  }
};

export function calcularCoresPessoais(numero: number): CoresPessoais {
  return CORES_NUMEROLOGICAS[numero] || CORES_NUMEROLOGICAS[1];
}

export function calcularCoresParaNumeros(numeros: Record<string, number>): Record<string, CoresPessoais> {
  const result: Record<string, CoresPessoais> = {};
  
  Object.entries(numeros).forEach(([chave, numero]) => {
    if (numero && numero > 0) {
      result[chave] = calcularCoresPessoais(numero);
    }
  });
  
  return result;
}