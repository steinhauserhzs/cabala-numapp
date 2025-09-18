// Pure regression testing without global mutations
import { gerarMapaNumerologicoPuro } from './numerology-pure';
import { PERFIL_OFICIAL_FINAL } from './official-profile-final';
import referenceTests from './reference-tests.json';

interface TestResult {
  name: string;
  passed: boolean;
  errors: string[];
  expected: any;
  actual: any;
}

export function runPureRegressionTests(): {
  results: TestResult[];
  allPassed: boolean;
  summary: string;
} {
  const results: TestResult[] = [];
  
  for (const testCase of referenceTests.testCases) {
    const birthDate = new Date(testCase.birthDate);
    const mapa = gerarMapaNumerologicoPuro(testCase.name, birthDate, PERFIL_OFICIAL_FINAL);
    
    const errors: string[] = [];
    
    // Test each field
    if (mapa.motivacao !== testCase.expected.motivacao) {
      errors.push(`Motivação: esperado ${testCase.expected.motivacao}, obtido ${mapa.motivacao}`);
    }
    
    if (mapa.expressao !== testCase.expected.expressao) {
      errors.push(`Expressão: esperado ${testCase.expected.expressao}, obtido ${mapa.expressao}`);
    }
    
    if (mapa.impressao !== testCase.expected.impressao) {
      errors.push(`Impressão: esperado ${testCase.expected.impressao}, obtido ${mapa.impressao}`);
    }
    
    if (mapa.destino !== testCase.expected.destino) {
      errors.push(`Destino: esperado ${testCase.expected.destino}, obtido ${mapa.destino}`);
    }
    
    if (mapa.missao !== testCase.expected.missao) {
      errors.push(`Missão: esperado ${testCase.expected.missao}, obtido ${mapa.missao}`);
    }
    
    // Test cycles
    const expectedCiclos = testCase.expected.ciclos;
    const actualCiclos = [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro];
    if (JSON.stringify(actualCiclos) !== JSON.stringify(expectedCiclos)) {
      errors.push(`Ciclos: esperado [${expectedCiclos}], obtido [${actualCiclos}]`);
    }
    
    results.push({
      name: testCase.name,
      passed: errors.length === 0,
      errors,
      expected: testCase.expected,
      actual: {
        motivacao: mapa.motivacao,
        expressao: mapa.expressao,
        impressao: mapa.impressao,
        destino: mapa.destino,
        missao: mapa.missao,
        ciclos: actualCiclos
      }
    });
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === results.length;
  const summary = `${passedCount}/${results.length} testes passaram`;
  
  return { results, allPassed, summary };
}