// Validation utilities for numerology calculations
import { gerarMapaNumerologico } from './numerology';
import { calcAnjoGuardaFromSupabase } from './angelParser';

export interface ValidationTest {
  name: string;
  birthDate: Date;
  expected: {
    motivacao: number;
    impressao: number;
    expressao: number;
    destino: number;
    missao: number;
    anjo: string;
    licoesCarmicas: number[];
    tendenciasOcultas: number[];
    respostaSubconsciente: number;
    dividasCarmicas: number[];
    ciclosVida: [number, number, number];
    desafios: [number, number, number];
    momentosDecisivos: [number, number, number, number];
  };
}

export const TEST_CASE: ValidationTest = {
  name: "Hairã Zupanc steinhauser",
  birthDate: new Date(2000, 4, 11), // 11/05/2000
  expected: {
    motivacao: 22,
    impressao: 7,
    expressao: 11,
    destino: 9,
    missao: 2,
    anjo: "Nanael",
    licoesCarmicas: [9],
    tendenciasOcultas: [1, 5],
    respostaSubconsciente: 8,
    dividasCarmicas: [13],
    ciclosVida: [5, 11, 2],
    desafios: [3, 0, 3],
    momentosDecisivos: [7, 4, 11, 7]
  }
};

export async function validateNumerologyCalculations(): Promise<{
  passed: boolean;
  results: any;
  errors: string[];
}> {
  const errors: string[] = [];
  const test = TEST_CASE;
  
  console.log('🧮 Validando cálculos numerológicos...');
  console.log(`📋 Caso de teste: "${test.name}" (${test.birthDate.toLocaleDateString('pt-BR')})`);
  
  try {
    const mapa = gerarMapaNumerologico(test.name, test.birthDate);
    const anjo = await calcAnjoGuardaFromSupabase(test.birthDate);
    
    const results = {
      motivacao: mapa.motivacao,
      impressao: mapa.impressao,
      expressao: mapa.expressao,
      destino: mapa.destino,
      missao: mapa.missao,
      anjo,
      licoesCarmicas: mapa.licoesCarmicas,
      tendenciasOcultas: mapa.tendenciasOcultas,
      respostaSubconsciente: mapa.respostaSubconsciente,
      dividasCarmicas: mapa.dividasCarmicas,
      ciclosVida: [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro],
      desafios: [mapa.desafios.primeiro, mapa.desafios.segundo, mapa.desafios.principal],
      momentosDecisivos: [
        mapa.momentosDecisivos.primeiro,
        mapa.momentosDecisivos.segundo,
        mapa.momentosDecisivos.terceiro,
        mapa.momentosDecisivos.quarto
      ]
    };
    
    // Validation checks
    const checks = [
      { key: 'motivacao', actual: results.motivacao, expected: test.expected.motivacao },
      { key: 'impressao', actual: results.impressao, expected: test.expected.impressao },
      { key: 'expressao', actual: results.expressao, expected: test.expected.expressao },
      { key: 'destino', actual: results.destino, expected: test.expected.destino },
      { key: 'missao', actual: results.missao, expected: test.expected.missao },
      { key: 'anjo', actual: results.anjo, expected: test.expected.anjo },
      { key: 'respostaSubconsciente', actual: results.respostaSubconsciente, expected: test.expected.respostaSubconsciente },
    ];
    
    for (const check of checks) {
      if (check.actual !== check.expected) {
        errors.push(`❌ ${check.key}: esperado ${check.expected}, obtido ${check.actual}`);
      } else {
        console.log(`✅ ${check.key}: ${check.actual}`);
      }
    }
    
    // Array checks
    const arrayChecks = [
      { key: 'licoesCarmicas', actual: results.licoesCarmicas, expected: test.expected.licoesCarmicas },
      { key: 'tendenciasOcultas', actual: results.tendenciasOcultas, expected: test.expected.tendenciasOcultas },
      { key: 'dividasCarmicas', actual: results.dividasCarmicas, expected: test.expected.dividasCarmicas },
      { key: 'ciclosVida', actual: results.ciclosVida, expected: test.expected.ciclosVida },
      { key: 'desafios', actual: results.desafios, expected: test.expected.desafios },
      { key: 'momentosDecisivos', actual: results.momentosDecisivos, expected: test.expected.momentosDecisivos }
    ];
    
    for (const check of arrayChecks) {
      const actualStr = JSON.stringify(check.actual);
      const expectedStr = JSON.stringify(check.expected);
      
      if (actualStr !== expectedStr) {
        errors.push(`❌ ${check.key}: esperado [${check.expected.join(', ')}], obtido [${check.actual.join(', ')}]`);
      } else {
        console.log(`✅ ${check.key}: [${check.actual.join(', ')}]`);
      }
    }
    
    const passed = errors.length === 0;
    
    if (passed) {
      console.log('🎉 Todos os testes passaram!');
    } else {
      console.error('💥 Erros encontrados:', errors);
    }
    
    return { passed, results, errors };
    
  } catch (error) {
    const errorMsg = `Erro durante validação: ${error}`;
    console.error(errorMsg);
    return { passed: false, results: null, errors: [errorMsg] };
  }
}