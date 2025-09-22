// Validation tests for the new deterministic cabalistic engine
import { computeFullMap } from './numerology-cabalistic';
import { gerarMapaNumerologico } from './numerology';

// Test cases from reference
const TEST_CASES = [
  {
    name: "hairã zupanc steinhauser",
    birthDate: "11/05/2000",
    expected: {
      motivacao: 22,
      expressao: 11,
      impressao: 7,
      destino: 9,
      missao: 2,
      ciclos: [5, 11, 2],
      desafios: [3, 0, 3],
      momentos: [7, 4, 11, 7],
      licoes: [9],
      resposta: 8,
      dividas: [13],
      tendencias: [1, 5]
    }
  },
  {
    name: "jéssica paula de souza",
    birthDate: "28/05/1991", 
    expected: {
      motivacao: 9,
      expressao: 8,
      impressao: 8,
      destino: 8,
      missao: 7,
      ciclos: [5, 1, 2],
      desafios: [4, 1, 3],
      momentos: [6, 3, 9, 7],
      licoes: [2, 9],
      resposta: 7,
      dividas: [],
      tendencias: [1, 3]
    }
  }
];

export function runValidationTests(): { passed: boolean; results: any[] } {
  const results = [];
  let allPassed = true;

  for (const testCase of TEST_CASES) {
    console.log(`\n=== Testing: ${testCase.name} ===`);
    
    // Test with new engine
    const newResult = computeFullMap(testCase.name, testCase.birthDate);
    
    // Test compatibility layer
    const [day, month, year] = testCase.birthDate.split('/').map(Number);
    const legacyDate = new Date(year, month - 1, day);
    const legacyResult = gerarMapaNumerologico(testCase.name, legacyDate);
    
    const testResult = {
      name: testCase.name,
      birthDate: testCase.birthDate,
      newEngine: {
        motivacao: newResult.numeros.Motivacao.numero,
        expressao: newResult.numeros.Expressao.numero,
        impressao: newResult.numeros.Impressao.numero,
        destino: newResult.numeros.Destino.numero,
        missao: newResult.numeros.Missao.numero,
        ciclos: newResult.ciclos.vida,
        desafios: newResult.ciclos.desafios,
        momentos: newResult.ciclos.momentos_decisivos,
        licoes: newResult.carmicos.licoes,
        resposta: newResult.carmicos.resposta_subconsciente,
        dividas: newResult.carmicos.dividas,
        tendencias: newResult.carmicos.tendencias_ocultas
      },
      legacy: {
        motivacao: legacyResult.motivacao,
        expressao: legacyResult.expressao,
        impressao: legacyResult.impressao,
        destino: legacyResult.destino,
        missao: legacyResult.missao,
        ciclos: [legacyResult.ciclosVida.primeiro, legacyResult.ciclosVida.segundo, legacyResult.ciclosVida.terceiro],
        desafios: [legacyResult.desafios.primeiro, legacyResult.desafios.segundo, legacyResult.desafios.principal],
        momentos: [legacyResult.momentosDecisivos.primeiro, legacyResult.momentosDecisivos.segundo, legacyResult.momentosDecisivos.terceiro, legacyResult.momentosDecisivos.quarto],
        licoes: legacyResult.licoesCarmicas,
        resposta: legacyResult.respostaSubconsciente,
        dividas: legacyResult.dividasCarmicas,
        tendencias: legacyResult.tendenciasOcultas
      },
      expected: testCase.expected,
      normalized: newResult.nome_normalizado
    };

    // Check core numbers
    const coreTests = [
      { field: 'motivacao', actual: testResult.newEngine.motivacao, expected: testCase.expected.motivacao },
      { field: 'expressao', actual: testResult.newEngine.expressao, expected: testCase.expected.expressao },
      { field: 'impressao', actual: testResult.newEngine.impressao, expected: testCase.expected.impressao },
      { field: 'destino', actual: testResult.newEngine.destino, expected: testCase.expected.destino },
      { field: 'missao', actual: testResult.newEngine.missao, expected: testCase.expected.missao },
      { field: 'resposta', actual: testResult.newEngine.resposta, expected: testCase.expected.resposta }
    ];

    let passed = true;
    for (const test of coreTests) {
      if (test.actual !== test.expected) {
        console.log(`❌ ${test.field}: got ${test.actual}, expected ${test.expected}`);
        passed = false;
        allPassed = false;
      } else {
        console.log(`✅ ${test.field}: ${test.actual}`);
      }
    }

    const finalResult = { ...testResult, passed };
    results.push(finalResult);
  }

  return { passed: allPassed, results };
}

// Quick test function for development
export function quickTest() {
  console.log("=== QUICK VALIDATION TEST ===");
  const { passed, results } = runValidationTests();
  
  if (passed) {
    console.log("🎉 ALL TESTS PASSED!");
  } else {
    console.log("❌ Some tests failed. Check results above.");
  }
  
  return { passed, results };
}