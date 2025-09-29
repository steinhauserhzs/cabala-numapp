import { supabase } from '@/integrations/supabase/client';

interface ExtractedTopic {
  topico: string;
  titulo: string;
  categoria: string;
  numero: number;
  conteudo_completo: string;
  resumo?: string;
  aspectos_positivos?: string;
  quando_inseguro?: string;
  conselhos?: string;
}

export class PDFContentExtractor {
  private fullPdfContent: string;

  constructor(pdfContent: string) {
    this.fullPdfContent = pdfContent;
  }

  /**
   * Extrai todos os tópicos do PDF organizadamente
   */
  extractAllTopics(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    // Extrair Motivação (1-22)
    topics.push(...this.extractMotivacao());
    
    // Extrair Destino (1-9)
    topics.push(...this.extractDestino());
    
    // Extrair Expressão (1-22)
    topics.push(...this.extractExpressao());
    
    // Extrair Impressão (1-22)
    topics.push(...this.extractImpressao());
    
    // Extrair Ano Pessoal (1-9)
    topics.push(...this.extractAnoPessoal());
    
    // Extrair Arcanos (1-78)
    topics.push(...this.extractArcanos());
    
    return topics;
  }

  /**
   * Extrai tópicos de Motivação (1-22)
   */
  private extractMotivacao(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    // Encontrar seção de Motivação
    const motivacaoMatch = this.fullPdfContent.match(/# Motivação\s*(.*?)(?=# \w+|$)/s);
    if (!motivacaoMatch) return topics;
    
    const motivacaoSection = motivacaoMatch[1];
    
    // Extrair cada número de motivação
    for (let i = 1; i <= 22; i++) {
      const topic = this.extractSingleMotivacao(motivacaoSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai uma única motivação específica
   */
  private extractSingleMotivacao(section: string, numero: number): ExtractedTopic | null {
    // Padrão para encontrar "# Motivação X"
    const pattern = new RegExp(`# Motivação ${numero}\\s*(.*?)(?=# Motivação ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    // Extrair o resumo inicial (primeira linha)
    const lines = content.split('\n').filter(line => line.trim());
    const resumo = lines[0] || '';
    
    // Extrair conteúdo principal
    const mainContentStart = content.indexOf('O Número');
    const mainContent = mainContentStart >= 0 ? content.substring(mainContentStart) : content;
    
    // Extrair "Quando inseguro(a)"
    const inseguroMatch = mainContent.match(/Quando inseguro.*?tende.*?(?=\.|$)/s);
    const quandoInseguro = inseguroMatch ? inseguroMatch[0] : '';
    
    return {
      topico: `motivacao_${numero.toString().padStart(2, '0')}`,
      titulo: `Motivação ${numero}`,
      categoria: 'motivacao',
      numero,
      conteudo_completo: content,
      resumo,
      quando_inseguro: quandoInseguro,
      conselhos: this.extractConselhos(content)
    };
  }

  /**
   * Extrai tópicos de Destino
   */
  private extractDestino(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    // Buscar por seção de Destino no PDF
    const destinoMatch = this.fullPdfContent.match(/# (?:5\.|)Destino\s*(.*?)(?=# \w+|$)/s);
    if (!destinoMatch) return topics;
    
    const destinoSection = destinoMatch[1];
    
    for (let i = 1; i <= 9; i++) {
      const topic = this.extractSingleDestino(destinoSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai um único destino específico
   */
  private extractSingleDestino(section: string, numero: number): ExtractedTopic | null {
    const pattern = new RegExp(`# Destino ${numero}\\s*(.*?)(?=# Destino ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    return {
      topico: `destino_${numero.toString().padStart(2, '0')}`,
      titulo: `Destino ${numero}`,
      categoria: 'destino',
      numero,
      conteudo_completo: content,
      resumo: this.extractFirstSentence(content)
    };
  }

  /**
   * Extrai tópicos de Expressão
   */
  private extractExpressao(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    const expressaoMatch = this.fullPdfContent.match(/# (?:8\.|)Expressão\s*(.*?)(?=# \w+|$)/s);
    if (!expressaoMatch) return topics;
    
    const expressaoSection = expressaoMatch[1];
    
    for (let i = 1; i <= 22; i++) {
      const topic = this.extractSingleExpressao(expressaoSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai uma única expressão específica
   */
  private extractSingleExpressao(section: string, numero: number): ExtractedTopic | null {
    const pattern = new RegExp(`# Expressão ${numero}\\s*(.*?)(?=# Expressão ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    return {
      topico: `expressao_${numero.toString().padStart(2, '0')}`,
      titulo: `Expressão ${numero}`,
      categoria: 'expressao',
      numero,
      conteudo_completo: content
    };
  }

  /**
   * Extrai tópicos de Impressão
   */
  private extractImpressao(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    const impressaoMatch = this.fullPdfContent.match(/# (?:10\.|)Impressão\s*(.*?)(?=# \w+|$)/s);
    if (!impressaoMatch) return topics;
    
    const impressaoSection = impressaoMatch[1];
    
    for (let i = 1; i <= 22; i++) {
      const topic = this.extractSingleImpressao(impressaoSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai uma única impressão específica
   */
  private extractSingleImpressao(section: string, numero: number): ExtractedTopic | null {
    const pattern = new RegExp(`# Impressão ${numero}\\s*(.*?)(?=# Impressão ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    return {
      topico: `impressao_${numero.toString().padStart(2, '0')}`,
      titulo: `Impressão ${numero}`,
      categoria: 'impressao',
      numero,
      conteudo_completo: content
    };
  }

  /**
   * Extrai tópicos de Ano Pessoal
   */
  private extractAnoPessoal(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    const anoMatch = this.fullPdfContent.match(/# (?:2\.|)Ano Pessoal\s*(.*?)(?=# \w+|$)/s);
    if (!anoMatch) return topics;
    
    const anoSection = anoMatch[1];
    
    for (let i = 1; i <= 9; i++) {
      const topic = this.extractSingleAnoPessoal(anoSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai um único ano pessoal específico
   */
  private extractSingleAnoPessoal(section: string, numero: number): ExtractedTopic | null {
    const pattern = new RegExp(`# Ano Pessoal ${numero}\\s*(.*?)(?=# Ano Pessoal ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    return {
      topico: `ano_pessoal_${numero.toString().padStart(2, '0')}`,
      titulo: `Ano Pessoal ${numero}`,
      categoria: 'ano_pessoal',
      numero,
      conteudo_completo: content
    };
  }

  /**
   * Extrai tópicos de Arcanos
   */
  private extractArcanos(): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    
    const arcanosMatch = this.fullPdfContent.match(/# (?:3\.|)Arcanos\s*(.*?)(?=# \w+|$)/s);
    if (!arcanosMatch) return topics;
    
    const arcanosSection = arcanosMatch[1];
    
    for (let i = 1; i <= 78; i++) {
      const topic = this.extractSingleArcano(arcanosSection, i);
      if (topic) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extrai um único arcano específico
   */
  private extractSingleArcano(section: string, numero: number): ExtractedTopic | null {
    const pattern = new RegExp(`# Arcano ${numero}\\s*(.*?)(?=# Arcano ${numero + 1}|# \\w+|$)`, 's');
    const match = section.match(pattern);
    
    if (!match) return null;
    
    const content = match[1].trim();
    
    return {
      topico: `arcano_${numero.toString().padStart(2, '0')}`,
      titulo: `Arcano ${numero}`,
      categoria: 'arcanos',
      numero,
      conteudo_completo: content
    };
  }

  /**
   * Extrai a primeira frase como resumo
   */
  private extractFirstSentence(content: string): string {
    const sentences = content.split(/[.!?]/);
    return sentences[0] ? sentences[0].trim() : '';
  }

  /**
   * Extrai conselhos do conteúdo
   */
  private extractConselhos(content: string): string {
    // Buscar frases que contenham orientações/conselhos
    const conselhoPatterns = [
      /(?:deve|precisa|é importante|é bom que).*?[.!?]/gi,
      /(?:evite|procure|busque|cultive).*?[.!?]/gi
    ];
    
    const conselhos: string[] = [];
    conselhoPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        conselhos.push(...matches);
      }
    });
    
    return conselhos.join(' ');
  }

  /**
   * Atualiza a base de dados com o conteúdo extraído
   */
  async updateDatabase(topics: ExtractedTopic[]): Promise<void> {
    console.log(`Iniciando atualização de ${topics.length} tópicos...`);
    
    for (const topic of topics) {
      try {
        const newContent = {
          title: topic.titulo,
          topic: topic.categoria,
          number: topic.numero,
          source: "Material Complementar de Numerologia Cabalística",
          content: topic.conteudo_completo,
          summary: topic.resumo || topic.conteudo_completo.substring(0, 200) + '...',
          when_insecure: topic.quando_inseguro || '',
          advice: topic.conselhos || '',
          updated_at: new Date().toISOString(),
          version: "3.0.0 - Integral PDF Content"
        };

        const { error } = await supabase
          .from('conteudos_numerologia')
          .upsert({
            topico: topic.topico,
            conteudo: newContent
          });

        if (error) {
          console.error(`Erro ao atualizar tópico ${topic.topico}:`, error);
          throw error;
        } else {
          console.log(`✓ Tópico ${topic.topico} atualizado com conteúdo integral`);
        }
      } catch (error) {
        console.error(`Erro geral ao processar tópico ${topic.topico}:`, error);
      }
    }
    
    console.log('Atualização da base de dados concluída');
  }
}

/**
 * Função principal para restaurar todo o conteúdo do PDF
 */
export async function restoreIntegralPDFContent(pdfContent: string): Promise<void> {
  console.log('🚀 Iniciando restauração do conteúdo integral do PDF...');
  
  try {
    const extractor = new PDFContentExtractor(pdfContent);
    const topics = extractor.extractAllTopics();
    
    console.log(`📝 Extraídos ${topics.length} tópicos do PDF`);
    
    if (topics.length === 0) {
      console.warn('⚠️ Nenhum tópico foi extraído do PDF. Verificando conteúdo...');
      console.log('Primeiros 500 caracteres do PDF:', pdfContent.substring(0, 500));
      return;
    }
    
    await extractor.updateDatabase(topics);
    
    console.log('✅ Restauração do conteúdo integral concluída!');
  } catch (error) {
    console.error('❌ Erro durante a restauração:', error);
    throw error;
  }
}

/**
 * Função alternativa para processar manualmente alguns tópicos principais
 * usando dados hardcoded do PDF original
 */
export async function restoreMainTopicsFromPDF(): Promise<void> {
  console.log('🚀 Restaurando tópicos principais com conteúdo integral...');
  
  const mainTopics = [
    {
      topico: 'motivacao_01',
      conteudo: {
        title: 'Motivação 1',
        topic: 'motivacao',
        number: 1,
        source: 'Material Complementar de Numerologia Cabalística',
        content: `Deseja Independência – Liberdade, liderança e controle de tudo; viver longe de pressões, ser campeão (ã) absoluto (a), realizar-se em si mesmo (a); ficar longe da mediocridade, fazer fortuna, ser elogiado (a) e atendido (a) pelo mundo; viver longe de detalhes; impor seus padrões pessoais; muito dinamismo e autossuficiência; não ser atrapalhado (a) por ninguém, ficar só.

O Número 1 na Motivação exige que você se situe sempre de forma a ficar na frente dos outros. Tem que ser o (a) primeiro (a) em tudo o que faz. O fato de ser o (a) primeiro (a) o (a) impede, obviamente, de ter muita consideração pelos outros até que suas próprias necessidades sejam satisfeitas. A liderança adquirida em vidas passadas traz agora o desejo de continuar a se empenhar numa consciência mais elevada. Torna-se independente, também, com relação às suas crenças. O desejo por pensamentos livres e independentes continua ocupando o seu anseio mais profundo. Ambicioso (a) e criativo (a), é direto (a) e não gosta de muitos detalhes, quer liderar, dirigir, dominar; às vezes é obstinado (a). Não gosta muito de receber ordens de quem quer que seja e trabalha melhor por conta própria ou em cargo de chefia. A incompreensão e a recusa em aceitar conselhos podem trazer transtornos à sua carreira e aos seus planos profissionais. Se não tiver bom nível de consciência espiritual, poderá se tornar egoísta, excessivamente vaidoso (a) e arrogante. Geralmente é impaciente e com pouco senso diplomático. Por esse motivo poderá enfrentar dificuldades no seu meio profissional ou mesmo entre familiares, amigos e companheiros afetivos. Suas boas qualidades são: confiança em si, distinção, poder executivo, dignidade e foco nos propósitos.

Quando inseguro (a) tende a ameaçar os outros, podendo agredir, ofender, se tornar inflexível, irredutível, vingativo (a) e preconceituoso (a). Cultura, educação e refinamento pessoal são características indispensáveis que precisa adquirir para o seu triunfo pessoal, profissional e principalmente afetivo.`,
        summary: 'Deseja Independência – Liberdade, liderança e controle de tudo',
        when_insecure: 'Quando inseguro (a) tende a ameaçar os outros, podendo agredir, ofender, se tornar inflexível, irredutível, vingativo (a) e preconceituoso (a).',
        advice: 'Cultura, educação e refinamento pessoal são características indispensáveis que precisa adquirir para o seu triunfo pessoal, profissional e principalmente afetivo.',
        updated_at: new Date().toISOString(),
        version: '3.0.0 - Integral PDF Content'
      }
    },
    {
      topico: 'motivacao_02',
      conteudo: {
        title: 'Motivação 2',
        topic: 'motivacao',
        number: 2,
        source: 'Material Complementar de Numerologia Cabalística',
        content: `Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia, sentir o ritmo da vida, trabalhar com os outros, ter amigos leais e boas companhias; acumular conhecimentos e coisas; conforto sem supérfluos; ser amado (a) por todos, receber convites, sentir-se compreendido (a); vencer todas as negociações; não ser exposto (a).

O Número 2 na Motivação indica o desejo de ser sempre gentil com todos, conseguindo ou não. Deseja ser compassivo (a), compreensivo (a), atencioso (a), útil e sempre fazendo concessões em favor da harmonia de todos. O seu maior desejo é a paz e a harmonia. O discernimento é um ponto forte do seu caráter; por esse motivo é um (a) bom (a) intermediário (a) ajudando a levar a paz às forças opostas. Anseia por amor e compreensão e prefere ser liderado (a) a liderar. O seu desejo é estar casado (a); desfrutar de companheirismo, paz, harmonia e conforto. Manifesta a sua natureza sensível através da suavidade, cordialidade e prestatividade; a sua principal característica é a cooperação. Pela sua passividade e calma natural, normalmente as pessoas com quem convive tendem a se aproveitar e explorar-lo (a). Normalmente não procura impor suas ideias; prefere escutar os outros antes de expor as suas próprias. Está sempre procurando reunir conhecimentos sobre assuntos diversos e se relaciona com todas as pessoas sem discriminar raça, credo, classe social ou posição econômica; numa só amizade e dedicação. É muito vulnerável em sua sensibilidade e se magoa profundamente com fatos que a outros não afetariam.

Quando inseguro (a) tende a não decidir, escapa, elogia demais os outros, deixa-se influenciar, chora, enfraquece, fica longe das atenções, se deprime, critica e ironiza. É importante para o seu desenvolvimento profissional e pessoal, que aprenda a conviver com as pessoas; ser mais comunicativo (a) e compartilhar os seus conhecimentos com todos, levando sua mensagem de harmonia e paz.`,
        summary: 'Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia',
        when_insecure: 'Quando inseguro (a) tende a não decidir, escapa, elogia demais os outros, deixa-se influenciar, chora, enfraquece, fica longe das atenções, se deprime, critica e ironiza.',
        advice: 'É importante para o seu desenvolvimento profissional e pessoal, que aprenda a conviver com as pessoas; ser mais comunicativo (a) e compartilhar os seus conhecimentos com todos, levando sua mensagem de harmonia e paz.',
        updated_at: new Date().toISOString(),
        version: '3.0.0 - Integral PDF Content'
      }
    }
    // Adicionar mais tópicos conforme necessário
  ];

  try {
    for (const topic of mainTopics) {
      const { error } = await supabase
        .from('conteudos_numerologia')
        .upsert({
          topico: topic.topico,
          conteudo: topic.conteudo
        });

      if (error) {
        console.error(`Erro ao atualizar tópico ${topic.topico}:`, error);
      } else {
        console.log(`✓ Tópico ${topic.topico} restaurado com conteúdo integral`);
      }
    }
    
    console.log('✅ Restauração dos tópicos principais concluída!');
  } catch (error) {
    console.error('❌ Erro durante a restauração:', error);
    throw error;
  }
}