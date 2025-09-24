import { supabase } from '@/integrations/supabase/client';
import { gerarMapaNumerologico } from '@/utils/numerology';
import { getInterpretacao } from '@/services/content';

// Interface para resultados de análise
export interface AnalysisResult {
  type: string;
  input: any;
  mainNumber: number;
  interpretation: string;
  recommendations: string[];
  compatibility?: number;
  additionalInfo?: string;
}

// Calculadora de compatibilidade para Harmonia Conjugal
export async function calculateCouplCompatibility(
  partner1Name: string,
  partner1Date: Date,
  partner2Name: string,
  partner2Date: Date
): Promise<AnalysisResult> {
  // Gerar mapas numerológicos para ambos
  const map1 = gerarMapaNumerologico(partner1Name, partner1Date);
  const map2 = gerarMapaNumerologico(partner2Name, partner2Date);

  // Calcular compatibilidade baseada nos números principais
  const compatibility = calculateCompatibilityScore(map1, map2);
  const compatibilityCategory = Math.floor(compatibility / 10) + 1; // 1-10

  // Buscar interpretação específica
  const interpretation = await getInterpretacao('harmonia-conjugal', compatibilityCategory.toString().padStart(2, '0'));

  return {
    type: 'harmonia-conjugal',
    input: { partner1Name, partner1Date, partner2Name, partner2Date },
    mainNumber: compatibilityCategory,
    interpretation: interpretation || `Compatibilidade de ${compatibility}% entre os parceiros.`,
    compatibility,
    recommendations: [
      "Desenvolvam comunicação aberta e honesta",
      "Respeitem as diferenças numerológicas",
      "Busquem atividades que harmonizem suas energias",
      "Pratiquem gratidão e compreensão mútua"
    ],
    additionalInfo: `Mapa 1: Expressão ${map1.expressao}, Destino ${map1.destino} | Mapa 2: Expressão ${map2.expressao}, Destino ${map2.destino}`
  };
}

// Calculadora para Correção de Assinatura
export async function calculateSignatureCorrection(
  fullName: string,
  currentSignature: string,
  birthDate: Date,
  objective: string
): Promise<AnalysisResult> {
  const fullNameMap = gerarMapaNumerologico(fullName, birthDate);
  const signatureMap = gerarMapaNumerologico(currentSignature, birthDate);

  // Diferença entre expressão do nome completo e assinatura
  const difference = Math.abs(fullNameMap.expressao - signatureMap.expressao);
  const analysisNumber = difference === 0 ? fullNameMap.expressao : difference;

  const interpretation = await getInterpretacao('correcao-assinatura', analysisNumber.toString().padStart(2, '0'));

  return {
    type: 'correcao-assinatura',
    input: { fullName, currentSignature, birthDate, objective },
    mainNumber: analysisNumber,
    interpretation: interpretation || `Análise da assinatura baseada na diferença energética de ${difference}.`,
    recommendations: [
      "Considere incluir mais vogais para energia emocional",
      "Balance consoantes para força prática",
      "Mantenha a legibilidade da assinatura",
      "Pratique a nova assinatura por 21 dias"
    ],
    additionalInfo: `Nome: ${fullNameMap.expressao} | Assinatura: ${signatureMap.expressao} | Diferença: ${difference}`
  };
}

// Calculadora para Análise de Endereço
export async function calculateAddressAnalysis(
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  residentName: string
): Promise<AnalysisResult> {
  // Calcular vibração do endereço
  const fullAddress = `${street} ${number} ${neighborhood} ${city}`;
  const addressVibration = calculateStringVibration(fullAddress);
  
  // Calcular mapa do morador
  const residentMap = gerarMapaNumerologico(residentName, new Date());
  
  // Compatibilidade entre endereço e morador
  const compatibility = calculateNumberCompatibility(addressVibration, residentMap.expressao);

  const interpretation = await getInterpretacao('endereco', addressVibration.toString().padStart(2, '0'));

  return {
    type: 'endereco',
    input: { street, number, neighborhood, city, residentName },
    mainNumber: addressVibration,
    interpretation: interpretation || `O endereço vibra no número ${addressVibration}, trazendo energias específicas.`,
    compatibility,
    recommendations: [
      "Mantenha o ambiente sempre limpo e organizado",
      "Use cores que harmonizem com a vibração do local",
      "Coloque plantas para equilibrar as energias",
      "Evite conflitos no ambiente doméstico"
    ],
    additionalInfo: `Vibração do endereço: ${addressVibration} | Expressão do morador: ${residentMap.expressao} | Compatibilidade: ${compatibility}%`
  };
}

// Calculadora para Análise de Placa
export async function calculatePlateAnalysis(
  plateNumber: string,
  ownerName: string,
  vehicleType?: string
): Promise<AnalysisResult> {
  // Limpar e calcular vibração da placa
  const cleanPlate = plateNumber.replace(/[^A-Z0-9]/g, '');
  const plateVibration = calculateStringVibration(cleanPlate);
  
  // Calcular mapa do proprietário
  const ownerMap = gerarMapaNumerologico(ownerName, new Date());
  
  // Compatibilidade
  const compatibility = calculateNumberCompatibility(plateVibration, ownerMap.expressao);

  const interpretation = await getInterpretacao('placa', plateVibration.toString().padStart(2, '0'));

  return {
    type: 'placa',
    input: { plateNumber, ownerName, vehicleType },
    mainNumber: plateVibration,
    interpretation: interpretation || `A placa ${plateNumber} vibra no número ${plateVibration}.`,
    compatibility,
    recommendations: [
      "Mantenha o veículo sempre limpo",
      "Evite dirigir em momentos de raiva",
      "Use amuletos de proteção no veículo",
      "Respeite sempre as leis de trânsito"
    ],
    additionalInfo: `Placa: ${plateVibration} | Proprietário: ${ownerMap.expressao} | Compatibilidade: ${compatibility}%`
  };
}

// Calculadora para Análise de Telefone
export async function calculatePhoneAnalysis(
  phoneNumber: string,
  ownerName: string
): Promise<AnalysisResult> {
  // Extrair apenas dígitos e calcular vibração
  const digits = phoneNumber.replace(/\D/g, '');
  const phoneVibration = calculateStringVibration(digits);
  
  // Calcular mapa do proprietário
  const ownerMap = gerarMapaNumerologico(ownerName, new Date());
  
  // Compatibilidade
  const compatibility = calculateNumberCompatibility(phoneVibration, ownerMap.expressao);

  const interpretation = await getInterpretacao('telefone', phoneVibration.toString().padStart(2, '0'));

  return {
    type: 'telefone',
    input: { phoneNumber, ownerName },
    mainNumber: phoneVibration,
    interpretation: interpretation || `O telefone ${phoneNumber} vibra no número ${phoneVibration}.`,
    compatibility,
    recommendations: [
      "Use o telefone para comunicações positivas",
      "Evite conversas negativas por longos períodos",
      "Mantenha o aparelho sempre carregado",
      "Considere mudar o número se a compatibilidade for baixa"
    ],
    additionalInfo: `Telefone: ${phoneVibration} | Proprietário: ${ownerMap.expressao} | Compatibilidade: ${compatibility}%`
  };
}

// Funções auxiliares
function calculateStringVibration(text: string): number {
  let sum = 0;
  const letterValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  for (const char of text.toUpperCase()) {
    if (letterValues[char]) {
      sum += letterValues[char];
    } else if (/\d/.test(char)) {
      sum += parseInt(char);
    }
  }

  // Reduzir a um dígito
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
}

function calculateCompatibilityScore(map1: any, map2: any): number {
  // Algoritmo de compatibilidade baseado nos números principais
  const expressaoComp = 100 - Math.abs(map1.expressao - map2.expressao) * 10;
  const destinoComp = 100 - Math.abs(map1.destino - map2.destino) * 10;
  const motivacaoComp = 100 - Math.abs(map1.motivacao - map2.motivacao) * 10;
  
  return Math.max(10, Math.round((expressaoComp + destinoComp + motivacaoComp) / 3));
}

function calculateNumberCompatibility(num1: number, num2: number): number {
  const difference = Math.abs(num1 - num2);
  return Math.max(10, 100 - difference * 15);
}

// Salvar análise no banco
export async function saveAnalysis(analysis: AnalysisResult, userId: string) {
  try {
    const { data, error } = await supabase
      .from('numerology_analyses')
      .insert([
        {
          user_id: userId,
          analysis_type: analysis.type,
          input_data: analysis.input,
          result_data: {
            mainNumber: analysis.mainNumber,
            interpretation: analysis.interpretation,
            recommendations: analysis.recommendations,
            compatibility: analysis.compatibility,
            additionalInfo: analysis.additionalInfo
          }
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar análise:', error);
    throw error;
  }
}