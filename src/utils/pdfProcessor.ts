// PDF content processing utilities
export interface ParsedContent {
  categoria: string;
  numero: string;
  titulo: string;
  descricao_resumida: string;
  texto_completo: string;
  aspectos_positivos?: string[];
  desafios?: string[];
  caracteristicas?: string[];
}

export interface ProcessingStats {
  total_encontradas: number;
  novas: number;
  atualizadas: number;
  categorias: string[];
}

export function extractNumerologyContent(pdfText: string): ParsedContent[] {
  const contents: ParsedContent[] = [];
  
  // Patterns for different categories
  const categoryPatterns = {
    motivacao: {
      regex: /# Motivação (\d+)([\s\S]*?)(?=# Motivação \d+|# [A-Z]|\n\n#|$)/gi,
      description: 'Desejo do coração'
    },
    destino: {
      regex: /# Destino (\d+)([\s\S]*?)(?=# Destino \d+|# [A-Z]|\n\n#|$)/gi,
      description: 'Missão de vida'
    },
    expressao: {
      regex: /# Expressão (\d+)([\s\S]*?)(?=# Expressão \d+|# [A-Z]|\n\n#|$)/gi,
      description: 'Talentos naturais'
    },
    impressao: {
      regex: /# Impressão (\d+)([\s\S]*?)(?=# Impressão \d+|# [A-Z]|\n\n#|$)/gi,
      description: 'Primeira impressão'
    }
  };

  // Process each category
  for (const [categoria, pattern] of Object.entries(categoryPatterns)) {
    let match;
    while ((match = pattern.regex.exec(pdfText)) !== null) {
      const numero = match[1];
      const content = match[2].trim();
      
      if (content.length < 100) continue; // Skip short content
      
      // Parse the content structure
      const parsed = parseContentStructure(content, numero, categoria);
      if (parsed) {
        contents.push({
          categoria,
          numero,
          titulo: `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} ${numero}`,
          descricao_resumida: pattern.description,
          texto_completo: content,
          ...parsed
        });
      }
    }
  }

  return contents;
}

function parseContentStructure(content: string, numero: string, categoria: string) {
  // Extract different sections from the content
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  
  // First paragraph usually contains the main description
  const firstParagraph = lines.find(line => line.length > 50) || '';
  
  // Look for patterns that indicate positive aspects
  const positivePatterns = [
    /boas qualidades.*?:/i,
    /qualidades.*?:/i,
    /aspectos positivos.*?:/i,
    /pontos fortes.*?:/i
  ];
  
  // Look for patterns that indicate challenges
  const challengePatterns = [
    /quando inseguro.*?tende/i,
    /desafios.*?:/i,
    /cuidados.*?:/i,
    /precisa.*?:/i
  ];
  
  let aspectos_positivos: string[] = [];
  let desafios: string[] = [];
  let caracteristicas: string[] = [];
  
  // Extract positive aspects
  for (const pattern of positivePatterns) {
    const match = content.match(pattern);
    if (match) {
      const section = content.substring(match.index! + match[0].length);
      const endMatch = section.match(/\n\n|\. [A-Z]|$/);
      const positiveText = section.substring(0, endMatch?.index || section.length);
      aspectos_positivos = extractListItems(positiveText);
      break;
    }
  }
  
  // Extract challenges
  for (const pattern of challengePatterns) {
    const match = content.match(pattern);
    if (match) {
      const section = content.substring(match.index!);
      const endMatch = section.match(/\n\n[A-Z]|$/);
      const challengeText = section.substring(0, endMatch?.index || section.length);
      desafios = extractListItems(challengeText);
      break;
    }
  }
  
  // Extract main characteristics from the content
  caracteristicas = extractMainCharacteristics(content);
  
  return {
    aspectos_positivos,
    desafios,
    caracteristicas
  };
}

function extractListItems(text: string): string[] {
  // Extract list items separated by commas, semicolons, or periods
  return text
    .replace(/[;,]/g, '.')
    .split('.')
    .map(item => item.trim())
    .filter(item => item.length > 5 && item.length < 100)
    .slice(0, 8); // Limit to 8 items
}

function extractMainCharacteristics(text: string): string[] {
  const characteristics: string[] = [];
  
  // Look for descriptive phrases
  const descriptivePatterns = [
    /é (.*?)(?:[,.;]|e )/gi,
    /possui (.*?)(?:[,.;]|e )/gi,
    /tem (.*?)(?:[,.;]|e )/gi,
    /mostra (.*?)(?:[,.;]|e )/gi
  ];
  
  for (const pattern of descriptivePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && characteristics.length < 10) {
      const characteristic = match[1].trim();
      if (characteristic.length > 5 && characteristic.length < 80) {
        characteristics.push(characteristic);
      }
    }
  }
  
  return [...new Set(characteristics)].slice(0, 6); // Remove duplicates and limit
}

export function formatContentForDatabase(parsed: ParsedContent): any {
  return {
    titulo: parsed.titulo,
    numero: parsed.numero,
    categoria: parsed.categoria,
    descricao: parsed.descricao_resumida,
    texto_integral: parsed.texto_completo,
    caracteristicas: parsed.caracteristicas || [],
    aspectos_positivos: parsed.aspectos_positivos || [],
    desafios: parsed.desafios || [],
    fonte: "Material Complementar PDF",
    enriquecido: true,
    estruturado: true,
    data_processamento: new Date().toISOString(),
    qualidade: calculateContentQuality(parsed)
  };
}

function calculateContentQuality(parsed: ParsedContent): 'baixa' | 'media' | 'alta' {
  let score = 0;
  
  if (parsed.texto_completo.length > 500) score += 2;
  if (parsed.aspectos_positivos && parsed.aspectos_positivos.length > 2) score += 2;
  if (parsed.desafios && parsed.desafios.length > 1) score += 2;
  if (parsed.caracteristicas && parsed.caracteristicas.length > 3) score += 2;
  if (parsed.texto_completo.includes('quando inseguro')) score += 1;
  if (parsed.texto_completo.includes('qualidades')) score += 1;
  
  if (score >= 7) return 'alta';
  if (score >= 4) return 'media';
  return 'baixa';
}

export function generateProcessingReport(
  originalCount: number, 
  processedContent: ParsedContent[]
): ProcessingStats {
  const categorias = [...new Set(processedContent.map(c => c.categoria))];
  
  return {
    total_encontradas: processedContent.length,
    novas: Math.floor(processedContent.length * 0.3), // Estimate
    atualizadas: Math.floor(processedContent.length * 0.7), // Estimate
    categorias
  };
}