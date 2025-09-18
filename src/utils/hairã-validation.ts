// Validation test for Hairã numerology calculations
import { gerarMapaNumerologico, setActiveProfile, calcMotivacao, calcExpressao, calcImpressao, calcDestino, calcMissao } from './numerology';
import { PERFIL_CONECTA } from './numerology-profile';

export interface HairãValidationResult {
  name: string;
  birthDate: Date;
  expected: {
    motivacao: number;
    expressao: number;
    impressao: number;
    destino: number;
    missao: number;
    ciclos: [number, number, number];
  };
  actual: {
    motivacao: number;
    expressao: number;
    impressao: number;
    destino: number;
    missao: number;
    ciclos: [number, number, number];
  };
  isValid: boolean;
  errors: string[];
}

export function validateHairãCalculation(): HairãValidationResult {
  // Set active profile to PERFIL_CONECTA
  setActiveProfile(PERFIL_CONECTA);
  
  const testName = "hairã zupanc steinhauser";
  const testDate = new Date(2000, 4, 11); // May 11, 2000 (month 0-indexed)
  
  // Expected values based on reference
  const expected = {
    motivacao: 22,
    expressao: 11,
    impressao: 7,
    destino: 9,
    missao: 2,
    ciclos: [5, 11, 2] as [number, number, number]
  };
  
  // Calculate actual values
  const mapa = gerarMapaNumerologico(testName, testDate);
  
  const actual = {
    motivacao: mapa.motivacao,
    expressao: mapa.expressao,
    impressao: mapa.impressao,
    destino: mapa.destino,
    missao: mapa.missao,
    ciclos: [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro] as [number, number, number]
  };
  
  // Check for errors
  const errors: string[] = [];
  
  if (actual.motivacao !== expected.motivacao) {
    errors.push(`Motivação: esperado ${expected.motivacao}, obtido ${actual.motivacao}`);
  }
  
  if (actual.expressao !== expected.expressao) {
    errors.push(`Expressão: esperado ${expected.expressao}, obtido ${actual.expressao}`);
  }
  
  if (actual.impressao !== expected.impressao) {
    errors.push(`Impressão: esperado ${expected.impressao}, obtido ${actual.impressao}`);
  }
  
  if (actual.destino !== expected.destino) {
    errors.push(`Destino: esperado ${expected.destino}, obtido ${actual.destino}`);
  }
  
  if (actual.missao !== expected.missao) {
    errors.push(`Missão: esperado ${expected.missao}, obtido ${actual.missao}`);
  }
  
  if (actual.ciclos[0] !== expected.ciclos[0] || 
      actual.ciclos[1] !== expected.ciclos[1] || 
      actual.ciclos[2] !== expected.ciclos[2]) {
    errors.push(`Ciclos de Vida: esperado [${expected.ciclos.join(', ')}], obtido [${actual.ciclos.join(', ')}]`);
  }
  
  const isValid = errors.length === 0;
  
  if (!isValid) {
    console.error('❌ Hairã validation FAILED:', errors);
  } else {
    console.log('✅ Hairã validation PASSED - all calculations match reference');
  }
  
  return {
    name: testName,
    birthDate: testDate,
    expected,
    actual,
    isValid,
    errors
  };
}