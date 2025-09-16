// Interpretações numerológicas cabalisticas

export interface InterpretacaoNumerologica {
  titulo: string;
  descricao: string;
  caracteristicas: string[];
  aspectosPositivos: string[];
  desafios: string[];
}

export const interpretacoes: Record<string, Record<number, InterpretacaoNumerologica>> = {
  motivacao: {
    1: {
      titulo: "Motivação 1 - Liderança",
      descricao: "Você é motivado pelo desejo de liderar, inovar e ser pioneiro.",
      caracteristicas: ["Independência", "Originalidade", "Iniciativa"],
      aspectosPositivos: ["Capacidade de liderança natural", "Determinação", "Coragem para novos caminhos"],
      desafios: ["Evitar o egoísmo", "Aprender a trabalhar em equipe", "Controlar a impaciência"]
    },
    2: {
      titulo: "Motivação 2 - Cooperação",
      descricao: "Você é motivado pela harmonia, parceria e trabalho em equipe.",
      caracteristicas: ["Diplomacia", "Sensibilidade", "Colaboração"],
      aspectosPositivos: ["Habilidade para mediar conflitos", "Empatia", "Capacidade de apoiar outros"],
      desafios: ["Evitar a indecisão", "Desenvolver autoconfiança", "Não se sacrificar demais pelos outros"]
    },
    3: {
      titulo: "Motivação 3 - Criatividade",
      descricao: "Você é motivado pela expressão criativa e comunicação.",
      caracteristicas: ["Criatividade", "Comunicação", "Entusiasmo"],
      aspectosPositivos: ["Talento artístico", "Carisma", "Habilidade para inspirar outros"],
      desafios: ["Evitar a dispersão", "Manter o foco", "Não superficializar relacionamentos"]
    },
    4: {
      titulo: "Motivação 4 - Estabilidade",
      descricao: "Você é motivado pela construção sólida e trabalho sistemático.",
      caracteristicas: ["Organização", "Disciplina", "Praticidade"],
      aspectosPositivos: ["Confiabilidade", "Perseverança", "Capacidade de construir bases sólidas"],
      desafios: ["Evitar a rigidez", "Aceitar mudanças", "Não se tornar workaholic"]
    },
    5: {
      titulo: "Motivação 5 - Liberdade",
      descricao: "Você é motivado pela aventura, mudança e novas experiências.",
      caracteristicas: ["Liberdade", "Versatilidade", "Curiosidade"],
      aspectosPositivos: ["Adaptabilidade", "Comunicação", "Espírito aventureiro"],
      desafios: ["Evitar a instabilidade", "Manter compromissos", "Não ser impulsivo demais"]
    },
    6: {
      titulo: "Motivação 6 - Responsabilidade",
      descricao: "Você é motivado pelo cuidado com outros e responsabilidade familiar.",
      caracteristicas: ["Responsabilidade", "Cuidado", "Harmonia"],
      aspectosPositivos: ["Capacidade de nutrir", "Senso de justiça", "Habilidade para curar"],
      desafios: ["Evitar o perfeccionismo", "Não ser controlador", "Cuidar de si mesmo"]
    },
    7: {
      titulo: "Motivação 7 - Sabedoria",
      descricao: "Você é motivado pela busca de conhecimento e verdades profundas.",
      caracteristicas: ["Introspecção", "Análise", "Espiritualidade"],
      aspectosPositivos: ["Sabedoria", "Intuição", "Capacidade de pesquisa"],
      desafios: ["Evitar o isolamento", "Compartilhar conhecimento", "Não ser crítico demais"]
    },
    8: {
      titulo: "Motivação 8 - Autoridade",
      descricao: "Você é motivado pelo sucesso material e reconhecimento.",
      caracteristicas: ["Ambição", "Poder", "Materialismo"],
      aspectosPositivos: ["Capacidade executiva", "Determinação", "Habilidade para organizar"],
      desafios: ["Evitar a ganância", "Equilibrar material e espiritual", "Não ser autoritário"]
    },
    9: {
      titulo: "Motivação 9 - Universalidade",
      descricao: "Você é motivado pelo serviço à humanidade e amor universal.",
      caracteristicas: ["Humanitarismo", "Generosidade", "Compreensão"],
      aspectosPositivos: ["Compaixão", "Visão ampla", "Capacidade de servir"],
      desafios: ["Evitar o martírio", "Manter limites saudáveis", "Não se decepcionar com outros"]
    },
    11: {
      titulo: "Motivação 11 - Iluminação",
      descricao: "Você é motivado pela inspiração espiritual e iluminação dos outros.",
      caracteristicas: ["Intuição", "Inspiração", "Espiritualidade"],
      aspectosPositivos: ["Visão espiritual", "Capacidade de inspirar", "Intuição desenvolvida"],
      desafios: ["Evitar a ansiedade", "Manter os pés no chão", "Não se sentir incompreendido"]
    },
    22: {
      titulo: "Motivação 22 - Construtor Universal",
      descricao: "Você é motivado por grandes realizações que beneficiem a humanidade.",
      caracteristicas: ["Visão", "Poder", "Realização"],
      aspectosPositivos: ["Capacidade de grandes realizações", "Visão prática e espiritual", "Liderança inspiradora"],
      desafios: ["Evitar a megalomania", "Manter humildade", "Não se sobrecarregar"]
    }
  },
  
  // Repetir estrutura similar para outras categorias
  impressao: {
    1: {
      titulo: "Impressão 1 - Líder Natural",
      descricao: "As pessoas te veem como alguém confiante, independente e capaz de liderar.",
      caracteristicas: ["Liderança", "Confiança", "Originalidade"],
      aspectosPositivos: ["Presença marcante", "Capacidade de influenciar", "Aparenta força"],
      desafios: ["Pode parecer arrogante", "Risco de intimidar outros", "Aparentar frieza"]
    },
    2: {
      titulo: "Impressão 2 - Diplomata",
      descricao: "As pessoas te veem como alguém gentil, cooperativo e harmonioso.",
      caracteristicas: ["Gentileza", "Cooperação", "Sensibilidade"],
      aspectosPositivos: ["Aparenta ser confiável", "Facilita relacionamentos", "Parece acolhedor"],
      desafios: ["Pode parecer fraco", "Risco de ser subestimado", "Aparentar indecisão"]
    }
    // ... continuar para todos os números
  },
  
  expressao: {
    1: {
      titulo: "Expressão 1 - O Pioneiro",
      descricao: "Sua personalidade total expressa liderança e independência.",
      caracteristicas: ["Liderança", "Independência", "Inovação"],
      aspectosPositivos: ["Capacidade de abrir caminhos", "Determinação", "Originalidade"],
      desafios: ["Aprender paciência", "Trabalhar em equipe", "Evitar egocentrismo"]
    }
    // ... continuar
  },
  
  destino: {
    1: {
      titulo: "Destino 1 - Liderar",
      descricao: "Seu destino é liderar, inovar e abrir novos caminhos.",
      caracteristicas: ["Liderança", "Pioneirismo", "Independência"],
      aspectosPositivos: ["Oportunidades de liderança", "Capacidade de inovar", "Independência financeira"],
      desafios: ["Aprender humildade", "Desenvolver paciência", "Equilibrar ego"]
    }
    // ... continuar
  }
  
  // Adicionar mais categorias conforme necessário
};

// Função para extrair interpretação específica dos dados do Supabase
export function extrairInterpretacaoDoConteudo(conteudo: any, numero: number): InterpretacaoNumerologica | null {
  if (!conteudo || typeof conteudo !== 'object') return null;
  
  // Procurar pelo número específico no conteúdo
  const numeroStr = numero.toString();
  const numeroData = conteudo[numeroStr] || conteudo[`numero_${numeroStr}`] || conteudo[`n${numeroStr}`];
  
  if (!numeroData) return null;
  
  // Extrair informações do formato do Material Complementar
  const titulo = numeroData.titulo || numeroData.name || `Número ${numero}`;
  const descricao = numeroData.descricao || numeroData.description || numeroData.texto || "";
  
  // Extrair características, aspectos positivos e desafios
  const caracteristicas = numeroData.caracteristicas || numeroData.traits || [];
  const aspectosPositivos = numeroData.aspectos_positivos || numeroData.positivos || numeroData.positive || [];
  const desafios = numeroData.desafios || numeroData.challenges || numeroData.negative || [];
  
  return {
    titulo,
    descricao,
    caracteristicas: Array.isArray(caracteristicas) ? caracteristicas : [caracteristicas].filter(Boolean),
    aspectosPositivos: Array.isArray(aspectosPositivos) ? aspectosPositivos : [aspectosPositivos].filter(Boolean),
    desafios: Array.isArray(desafios) ? desafios : [desafios].filter(Boolean)
  };
}

export function obterInterpretacao(categoria: string, numero: number): InterpretacaoNumerologica | null {
  return interpretacoes[categoria]?.[numero] || null;
}