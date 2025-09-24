// Calculadora de pedras e cristais pessoais baseada nos números numerológicos
export interface PedrasPessoais {
  principal: string;
  alternativas: string[];
  propriedades: string;
  como_usar: string;
}

// Mapeamento de números para pedras
const PEDRAS_NUMEROLOGICAS: Record<number, PedrasPessoais> = {
  1: {
    principal: "Rubi",
    alternativas: ["Granata", "Hematita", "Jaspe Vermelho"],
    propriedades: "Estimula liderança, coragem e energia vital. Fortalece a autoconfiança.",
    como_usar: "Use como anel ou pingente. Ideal para decisões importantes e momentos de liderança."
  },
  2: {
    principal: "Pedra da Lua",
    alternativas: ["Água-marinha", "Quartzo Rosa", "Pérola"],
    propriedades: "Desenvolve intuição, diplomacia e sensibilidade. Promove cooperação.",
    como_usar: "Use próximo ao coração ou durante meditação. Ideal para relacionamentos."
  },
  3: {
    principal: "Citrino",
    alternativas: ["Âmbar", "Topázio Amarelo", "Quartzo Dourado"],
    propriedades: "Estimula criatividade, comunicação e alegria. Atrai prosperidade.",
    como_usar: "Use como pingente ou na mesa de trabalho. Ideal para atividades criativas."
  },
  4: {
    principal: "Esmeralda",
    alternativas: ["Jade", "Aventurina Verde", "Turmalina Verde"],
    propriedades: "Promove estabilidade, organização e crescimento. Fortalece determinação.",
    como_usar: "Use como anel ou carregue no bolso. Ideal para trabalho e estudos."
  },
  5: {
    principal: "Turquesa",
    alternativas: ["Sodalita", "Lápis-lazúli", "Amazonita"],
    propriedades: "Estimula liberdade, comunicação e aventura. Protege em viagens.",
    como_usar: "Use como colar ou pulseira. Ideal para comunicação e mudanças."
  },
  6: {
    principal: "Quartzo Rosa",
    alternativas: ["Esmeralda", "Prehnita", "Rodonita"],
    propriedades: "Desenvolve amor, compaixão e harmonia familiar. Cura o coração.",
    como_usar: "Use próximo ao coração. Ideal para relacionamentos e cura emocional."
  },
  7: {
    principal: "Ametista",
    alternativas: ["Fluorita Roxa", "Lepidolita", "Charoíta"],
    propriedades: "Estimula espiritualidade, intuição e sabedoria. Protege de energias negativas.",
    como_usar: "Use durante meditação ou como pingente. Ideal para desenvolvimento espiritual."
  },
  8: {
    principal: "Granata",
    alternativas: ["Hematita", "Obsidiana", "Onix"],
    propriedades: "Promove sucesso material, determinação e poder pessoal. Atrai prosperidade.",
    como_usar: "Use como anel ou na carteira. Ideal para negócios e conquistas materiais."
  },
  9: {
    principal: "Opala",
    alternativas: ["Tanzanita", "Safira", "Labradorita"],
    propriedades: "Desenvolve sabedoria universal, compaixão e liderança espiritual.",
    como_usar: "Use como pendente ou durante práticas espirituais. Ideal para serviço aos outros."
  },
  11: {
    principal: "Cristal de Quartzo",
    alternativas: ["Selenita", "Apofilia", "Diamante Herkimer"],
    propriedades: "Amplifica intuição superior e conexão espiritual. Purifica energias.",
    como_usar: "Use durante meditação ou como pingente. Ideal para desenvolvimento psíquico."
  },
  22: {
    principal: "Moldavita",
    alternativas: ["Fenacita", "Danburita", "Petalita"],
    propriedades: "Estimula transformação e realizações grandiosas. Acelera evolução espiritual.",
    como_usar: "Use com cautela, pequenos períodos. Ideal para grandes projetos e transformações."
  },
  33: {
    principal: "Cristal Mestre",
    alternativas: ["Kunzita", "Hiddenita", "Celestita"],
    propriedades: "Promove cura universal, amor incondicional e mestria espiritual.",
    como_usar: "Use durante cura e práticas espirituais avançadas. Ideal para servir a humanidade."
  }
};

export function calcularPedrasPessoais(numero: number): PedrasPessoais {
  return PEDRAS_NUMEROLOGICAS[numero] || PEDRAS_NUMEROLOGICAS[1];
}

export function calcularPedrasParaNumeros(numeros: Record<string, number>): Record<string, PedrasPessoais> {
  const result: Record<string, PedrasPessoais> = {};
  
  Object.entries(numeros).forEach(([chave, numero]) => {
    if (numero && numero > 0) {
      result[chave] = calcularPedrasPessoais(numero);
    }
  });
  
  return result;
}