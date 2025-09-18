// Reference validation system with multiple test cases
export interface ReferenceTestCase {
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
}

// Primary reference case: Hairã
export const HAIRA_REFERENCE: ReferenceTestCase = {
  name: "hairã zupanc steinhauser",
  birthDate: new Date(2000, 4, 11), // May 11, 2000
  expected: {
    motivacao: 22,
    expressao: 11,
    impressao: 7,
    destino: 9,
    missao: 2,
    ciclos: [5, 11, 2]
  }
};

// Additional test cases for validation
export const REFERENCE_TEST_CASES: ReferenceTestCase[] = [
  HAIRA_REFERENCE,
  // Add more test cases here as needed
];

import { gerarMapaNumerologico } from './numerology';
export function validateAllReferences() {
  
  const results = REFERENCE_TEST_CASES.map(testCase => {
    const mapa = gerarMapaNumerologico(testCase.name, testCase.birthDate);
    
    const actual = {
      motivacao: mapa.motivacao,
      expressao: mapa.expressao,
      impressao: mapa.impressao,
      destino: mapa.destino,
      missao: mapa.missao,
      ciclos: [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro] as [number, number, number]
    };
    
    const errors: string[] = [];
    Object.keys(testCase.expected).forEach(key => {
      if (key === 'ciclos') {
        const expected = testCase.expected.ciclos;
        const got = actual.ciclos;
        if (JSON.stringify(expected) !== JSON.stringify(got)) {
          errors.push(`${key}: expected [${expected.join(',')}], got [${got.join(',')}]`);
        }
      } else {
        const expectedVal = testCase.expected[key as keyof typeof testCase.expected];
        const actualVal = actual[key as keyof typeof actual];
        if (expectedVal !== actualVal) {
          errors.push(`${key}: expected ${expectedVal}, got ${actualVal}`);
        }
      }
    });
    
    return {
      testCase,
      actual,
      errors,
      passed: errors.length === 0
    };
  });
  
  const allPassed = results.every(r => r.passed);
  
  console.log('🧪 REFERENCE VALIDATION RESULTS:');
  results.forEach(result => {
    console.log(`\n📋 ${result.testCase.name}:`);
    if (result.passed) {
      console.log('✅ PASSED');
    } else {
      console.log('❌ FAILED:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
  });
  
  console.log(`\n📊 SUMMARY: ${results.filter(r => r.passed).length}/${results.length} tests passed`);
  
  return {
    results,
    allPassed,
    summary: `${results.filter(r => r.passed).length}/${results.length} tests passed`
  };
}