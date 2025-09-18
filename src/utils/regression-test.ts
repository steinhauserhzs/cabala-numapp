// Regression test system using reference test cases
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

export function runRegressionTests(): {
  results: TestResult[];
  allPassed: boolean;
  summary: string;
} {
  const results: TestResult[] = [];
  
  for (const testCase of referenceTests.testCases) {
    const birthDate = new Date(testCase.birthDate);
    const mapa = gerarMapaNumerologicoPuro(testCase.name, birthDate, PERFIL_OFICIAL_FINAL);
    
    const errors: string[] = [];
    const expected = testCase.expected;
    
    // Check core values
    if (mapa.motivacao !== expected.motivacao) {
      errors.push(`Motivação: expected ${expected.motivacao}, got ${mapa.motivacao}`);
    }
    if (mapa.expressao !== expected.expressao) {
      errors.push(`Expressão: expected ${expected.expressao}, got ${mapa.expressao}`);
    }
    if (mapa.impressao !== expected.impressao) {
      errors.push(`Impressão: expected ${expected.impressao}, got ${mapa.impressao}`);
    }
    if (mapa.destino !== expected.destino) {
      errors.push(`Destino: expected ${expected.destino}, got ${mapa.destino}`);
    }
    if (mapa.missao !== expected.missao) {
      errors.push(`Missão: expected ${expected.missao}, got ${mapa.missao}`);
    }
    
    // Check arrays
    const expectedCiclos = expected.ciclos;
    const actualCiclos = [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro];
    if (JSON.stringify(expectedCiclos) !== JSON.stringify(actualCiclos)) {
      errors.push(`Ciclos: expected [${expectedCiclos.join(',')}], got [${actualCiclos.join(',')}]`);
    }
    
    const expectedDesafios = expected.desafios;
    const actualDesafios = [mapa.desafios.primeiro, mapa.desafios.segundo, mapa.desafios.principal];
    if (JSON.stringify(expectedDesafios) !== JSON.stringify(actualDesafios)) {
      errors.push(`Desafios: expected [${expectedDesafios.join(',')}], got [${actualDesafios.join(',')}]`);
    }
    
    const expectedMomentos = expected.momentos;
    const actualMomentos = [mapa.momentosDecisivos.primeiro, mapa.momentosDecisivos.segundo, mapa.momentosDecisivos.terceiro, mapa.momentosDecisivos.quarto];
    if (JSON.stringify(expectedMomentos) !== JSON.stringify(actualMomentos)) {
      errors.push(`Momentos: expected [${expectedMomentos.join(',')}], got [${actualMomentos.join(',')}]`);
    }
    
    if (mapa.respostaSubconsciente !== expected.resposta) {
      errors.push(`Resposta: expected ${expected.resposta}, got ${mapa.respostaSubconsciente}`);
    }
    
    if (JSON.stringify(mapa.licoesCarmicas.sort()) !== JSON.stringify(expected.licoes.sort())) {
      errors.push(`Lições: expected [${expected.licoes.join(',')}], got [${mapa.licoesCarmicas.join(',')}]`);
    }
    
    if (JSON.stringify(mapa.dividasCarmicas.sort()) !== JSON.stringify(expected.dividas.sort())) {
      errors.push(`Dívidas: expected [${expected.dividas.join(',')}], got [${mapa.dividasCarmicas.join(',')}]`);
    }
    
    if (JSON.stringify(mapa.tendenciasOcultas.sort()) !== JSON.stringify(expected.tendencias.sort())) {
      errors.push(`Tendências: expected [${expected.tendencias.join(',')}], got [${mapa.tendenciasOcultas.join(',')}]`);
    }
    
    results.push({
      name: testCase.name,
      passed: errors.length === 0,
      errors,
      expected,
      actual: {
        motivacao: mapa.motivacao,
        expressao: mapa.expressao,
        impressao: mapa.impressao,
        destino: mapa.destino,
        missao: mapa.missao,
        ciclos: actualCiclos,
        desafios: actualDesafios,
        momentos: actualMomentos,
        licoes: mapa.licoesCarmicas,
        resposta: mapa.respostaSubconsciente,
        dividas: mapa.dividasCarmicas,
        tendencias: mapa.tendenciasOcultas
      }
    });
  }
  
  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === results.length;
  const summary = `${passedCount}/${results.length} tests passed`;
  
  return { results, allPassed, summary };
}

// Console test runner
export function runRegressionTestsConsole() {
  console.log('\n🧪 RUNNING REGRESSION TESTS...');
  const { results, allPassed, summary } = runRegressionTests();
  
  console.log(`\n📊 Summary: ${summary}`);
  
  results.forEach(result => {
    if (result.passed) {
      console.log(`✅ ${result.name} - PASSED`);
    } else {
      console.log(`❌ ${result.name} - FAILED`);
      result.errors.forEach(error => console.log(`   • ${error}`));
    }
  });
  
  return { results, allPassed, summary };
}