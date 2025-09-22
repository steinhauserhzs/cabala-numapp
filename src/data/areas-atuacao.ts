export interface AreaAtuacao {
  nome: string;
  numeros: number[];
}

export interface Profissao {
  nome: string;
  numeros: number[];
}

export const areasAtuacao: AreaAtuacao[] = [
  { nome: "Academias de ginástica", numeros: [1, 3] },
  { nome: "Agricultura", numeros: [6] },
  { nome: "Arte em geral", numeros: [3] },
  { nome: "Automobilismo", numeros: [1, 5] },
  { nome: "Animais em geral", numeros: [6, 7] },
  { nome: "Aeronáutica", numeros: [3, 5] },
  { nome: "Construção civil", numeros: [1, 4] },
  { nome: "Contabilidade", numeros: [2, 4] },
  { nome: "Couro (todos os artigos)", numeros: [3, 11] },
  { nome: "Crianças (trabalhar com)", numeros: [6, 7, 9] },
  { nome: "Comunicação (geral)", numeros: [3] },
  { nome: "Chefia em geral", numeros: [1, 8] },
  { nome: "Decoração", numeros: [2, 3, 6] },
  { nome: "Direito (todos)", numeros: [7, 8, 9] },
  { nome: "Diversão", numeros: [3, 5] },
  { nome: "Ecologia", numeros: [2, 6] },
  { nome: "Enfermagem", numeros: [2, 6] },
  { nome: "Erotismo", numeros: [3, 8] },
  { nome: "Escolas (geral)", numeros: [2, 6, 9] },
  { nome: "Esoterismo (todos)", numeros: [7, 9, 11] },
  { nome: "Esporte (todos)", numeros: [1, 3] },
  { nome: "Estética e beleza", numeros: [3] },
  { nome: "Eletrônica", numeros: [7] },
  { nome: "Finanças (todas)", numeros: [1, 4, 8] },
  { nome: "Forças Armadas (Exército)", numeros: [4] },
  { nome: "Forças Armadas (Aeronáutica)", numeros: [3, 11, 22] },
  { nome: "Forças Armadas (Marinha)", numeros: [5, 9] },
  { nome: "Gráficas (geral)", numeros: [1, 4, 7] },
  { nome: "Hotelaria", numeros: [5, 6] },
  { nome: "Idosos (trabalho com)", numeros: [6, 7] },
  { nome: "Indústrias mecânicas", numeros: [1, 4, 7] },
  { nome: "Indústrias metalúrgicas", numeros: [1, 4, 7] },
  { nome: "Indústrias químicas", numeros: [1, 4, 7] },
  { nome: "Informática (geral)", numeros: [7] },
  { nome: "Jardinagem", numeros: [6] },
  { nome: "Literatura", numeros: [3, 7] },
  { nome: "Marketing", numeros: [3, 5] },
  { nome: "Medicina (geral)", numeros: [6, 9] },
  { nome: "Medicina Alternativa (geral)", numeros: [6, 9, 11] },
  { nome: "Meio ambiente", numeros: [2, 6, 9] },
  { nome: "Mercado de capitais", numeros: [4, 8] },
  { nome: "Nutrição (geral)", numeros: [6] },
  { nome: "Odontologia (geral)", numeros: [4, 6, 9] },
  { nome: "Polícia (segurança)", numeros: [2, 4, 5, 9] },
  { nome: "Política", numeros: [1, 5, 7, 8, 11] },
  { nome: "Shoppings e lojas", numeros: [2, 4, 8] },
  { nome: "Serviços domésticos", numeros: [2] },
  { nome: "Serviços sociais (todos)", numeros: [2, 7, 9] },
  { nome: "Telemarketing", numeros: [3, 5] },
  { nome: "Terapias alternativas (todas)", numeros: [2, 6, 9] },
  { nome: "Transporte", numeros: [4, 5, 7] },
  { nome: "Turismo", numeros: [2, 5] }
];

export const profissoes: Profissao[] = [
  { nome: "Administrador de empresas", numeros: [3, 9] },
  { nome: "Administrador hospitalar", numeros: [6, 22] },
  { nome: "Advogado", numeros: [7, 8, 9] },
  { nome: "Agente teatral", numeros: [8] },
  { nome: "Aeronauta", numeros: [22] },
  { nome: "Agente de viagens", numeros: [5] },
  { nome: "Agrimensor", numeros: [2, 6] },
  { nome: "Analista de sistemas", numeros: [7, 9] },
  { nome: "Arqueólogo", numeros: [2, 4] },
  { nome: "Arquiteto", numeros: [1, 4] },
  { nome: "Arquivista", numeros: [2, 4, 7, 9] },
  { nome: "Artista (pintor, cantor, ator)", numeros: [3, 5, 6] },
  { nome: "Assistente social", numeros: [9, 11, 22] },
  { nome: "Astrólogo", numeros: [4, 7] },
  { nome: "Autor teatral", numeros: [9] },
  { nome: "Aviador", numeros: [3, 5, 22] },
  { nome: "Bancário", numeros: [2, 4] },
  { nome: "Banqueiro", numeros: [8] },
  { nome: "Bibliotecário", numeros: [2, 6, 7, 9] },
  { nome: "Biólogo", numeros: [7] },
  { nome: "Bolsa de valores (operador)", numeros: [7, 8] },
  { nome: "Bombeiro", numeros: [4, 9] },
  { nome: "Cabeleireiro/a", numeros: [3] },
  { nome: "Caixa de banco", numeros: [2, 4] },
  { nome: "Camareiro", numeros: [6] },
  { nome: "Cientista", numeros: [7, 9, 22] },
  { nome: "Cineasta", numeros: [5, 7] },
  { nome: "Comerciante", numeros: [1, 8] },
  { nome: "Compositor", numeros: [3, 5, 6] },
  { nome: "Comprador", numeros: [2, 7, 8] },
  { nome: "Consultor", numeros: [1, 8, 11] },
  { nome: "Corretor de imóveis", numeros: [4, 6, 7, 8] },
  { nome: "Cozinheiro", numeros: [6] },
  { nome: "Crítico literário", numeros: [3] },
  { nome: "Diplomata", numeros: [1, 2, 11] },
  { nome: "Diretor (todos)", numeros: [1] },
  { nome: "Diretor social", numeros: [2, 7] },
  { nome: "Dentista", numeros: [4] },
  { nome: "Desenhista técnico", numeros: [5, 6] },
  { nome: "Designer", numeros: [1, 3, 11] },
  { nome: "Economista", numeros: [4, 8] },
  { nome: "Editor", numeros: [7, 9] },
  { nome: "Eletricidade", numeros: [4] },
  { nome: "Embaixador", numeros: [2, 11, 22] },
  { nome: "Empreiteiro", numeros: [1, 4] },
  { nome: "Engenheiro (todos)", numeros: [4, 11] },
  { nome: "Escritor", numeros: [1, 4, 5, 7, 11] },
  { nome: "Escultor", numeros: [3, 7, 9, 22] },
  { nome: "Esotérico", numeros: [2, 5, 6, 7, 9] },
  { nome: "Esportista (todos)", numeros: [1, 3] },
  { nome: "Estatístico", numeros: [2, 6] },
  { nome: "Estilista", numeros: [3] },
  { nome: "Executivo", numeros: [1, 8] },
  { nome: "Explorador", numeros: [1] },
  { nome: "Farmacêutico", numeros: [5, 7] },
  { nome: "Filantropo", numeros: [8, 9, 22] },
  { nome: "Filósofo", numeros: [7, 11, 22] },
  { nome: "Financista", numeros: [1, 4, 8] },
  { nome: "Físico", numeros: [7, 11] },
  { nome: "Floricultor", numeros: [6] },
  { nome: "Fonoaudiólogo", numeros: [2, 6, 11] },
  { nome: "Fotógrafo", numeros: [3, 6] },
  { nome: "Gerente de loja", numeros: [8] },
  { nome: "Gerente de restaurante", numeros: [1, 6] },
  { nome: "Gestão ambiental", numeros: [2, 6, 9] },
  { nome: "Historiador", numeros: [2, 4, 6, 7, 11] },
  { nome: "Inventor", numeros: [1, 11, 22] },
  { nome: "Investidor", numeros: [4, 8] },
  { nome: "Investigador", numeros: [2, 6, 7, 11] },
  { nome: "Jornalista", numeros: [3, 5] },
  { nome: "Jogador (xadrez, damas, videogames, sinuca, etc.)", numeros: [1, 3, 8] },
  { nome: "Juiz de direito", numeros: [7, 9, 11] },
  { nome: "Jurista", numeros: [3, 7, 9] },
  { nome: "Líder religioso", numeros: [7, 9, 22] },
  { nome: "Marinheiro", numeros: [5, 7, 9] },
  { nome: "Matemático", numeros: [4, 6, 7] },
  { nome: "Médico", numeros: [4, 6, 9, 11] },
  { nome: "Mecânico", numeros: [4, 9] },
  { nome: "Metalúrgico", numeros: [4, 9] },
  { nome: "Militar", numeros: [4, 9] },
  { nome: "Minerador", numeros: [2, 6, 8] },
  { nome: "Modelo", numeros: [3] },
  { nome: "Mordomo", numeros: [2, 6] },
  { nome: "Músico", numeros: [2, 3, 6, 9] },
  { nome: "Negociante de antiguidades", numeros: [4, 11, 22] },
  { nome: "Numerólogo", numeros: [4, 5, 7, 11, 22] },
  { nome: "Oceanógrafo", numeros: [7, 9] },
  { nome: "Operador de telemarketing", numeros: [3, 5] },
  { nome: "Operador da bolsa de valores", numeros: [4] },
  { nome: "Orador", numeros: [5] },
  { nome: "Padre", numeros: [9, 11] },
  { nome: "Pastor", numeros: [9, 11] },
  { nome: "Pecuarista", numeros: [6, 8] },
  { nome: "Pesquisador", numeros: [2, 7, 11] },
  { nome: "Presidência de empresa", numeros: [1, 8] },
  { nome: "Processamento de dados", numeros: [7] },
  { nome: "Professor", numeros: [2, 6, 7, 9, 11] },
  { nome: "Projetista industrial", numeros: [4, 8] },
  { nome: "Psicanalista", numeros: [7, 9, 11] },
  { nome: "Psicólogo", numeros: [2, 6, 11] },
  { nome: "Publicitário", numeros: [1, 5] },
  { nome: "Químico", numeros: [4, 7] },
  { nome: "Radialista", numeros: [1, 3, 5, 7] },
  { nome: "Radiologista", numeros: [4, 6, 7] },
  { nome: "Redator", numeros: [1, 6] },
  { nome: "Relações públicas", numeros: [5] },
  { nome: "Repórter", numeros: [5, 11] },
  { nome: "Secretário/a", numeros: [2, 4, 7] },
  { nome: "Serralheiro", numeros: [5] },
  { nome: "Servidor público", numeros: [4, 5, 6] },
  { nome: "Técnico em comunicação", numeros: [4, 7, 9] },
  { nome: "Técnico em geral", numeros: [4] },
  { nome: "Terapeuta holístico", numeros: [2, 6, 7, 9] },
  { nome: "Topógrafo", numeros: [2, 6] },
  { nome: "Tradutor", numeros: [2, 6, 9] },
  { nome: "Vendedor", numeros: [1, 3, 5] },
  { nome: "Veterinário", numeros: [6, 7] }
];

// Função para buscar por texto
export const buscarPorTexto = (texto: string, tipo: 'areas' | 'profissoes' | 'ambos' = 'ambos') => {
  const termoBusca = texto.toLowerCase();
  const resultados: { areas: AreaAtuacao[], profissoes: Profissao[] } = {
    areas: [],
    profissoes: []
  };

  if (tipo === 'areas' || tipo === 'ambos') {
    resultados.areas = areasAtuacao.filter(area => 
      area.nome.toLowerCase().includes(termoBusca)
    );
  }

  if (tipo === 'profissoes' || tipo === 'ambos') {
    resultados.profissoes = profissoes.filter(profissao => 
      profissao.nome.toLowerCase().includes(termoBusca)
    );
  }

  return resultados;
};

// Função para filtrar por números
export const filtrarPorNumeros = (numeros: number[], tipo: 'areas' | 'profissoes' | 'ambos' = 'ambos') => {
  const resultados: { areas: AreaAtuacao[], profissoes: Profissao[] } = {
    areas: [],
    profissoes: []
  };

  if (tipo === 'areas' || tipo === 'ambos') {
    resultados.areas = areasAtuacao.filter(area => 
      numeros.some(num => area.numeros.includes(num))
    );
  }

  if (tipo === 'profissoes' || tipo === 'ambos') {
    resultados.profissoes = profissoes.filter(profissao => 
      numeros.some(num => profissao.numeros.includes(num))
    );
  }

  return resultados;
};

// Função para obter estatísticas
export const obterEstatisticas = () => {
  return {
    totalAreas: areasAtuacao.length,
    totalProfissoes: profissoes.length,
    numerosDisponiveis: Array.from(new Set([
      ...areasAtuacao.flatMap(a => a.numeros),
      ...profissoes.flatMap(p => p.numeros)
    ])).sort((a, b) => a - b)
  };
};