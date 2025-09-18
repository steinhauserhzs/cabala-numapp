// Direct test for numerology calculations
import { calcNameWithAudit, enableDebugMode } from './numerology-core';
import { PERFIL_OFICIAL_JF } from './numerology-profile';

export function testCurrentCalculation(name: string) {
  console.log(`\n🔍 TESTING CALCULATION FOR: "${name}"`);
  console.log('='.repeat(50));
  
  enableDebugMode(true);
  
  // Test each calculation with full audit
  const motivacao = calcNameWithAudit(name, 'motivacao', PERFIL_OFICIAL_JF);
  const expressao = calcNameWithAudit(name, 'expressao', PERFIL_OFICIAL_JF);
  const impressao = calcNameWithAudit(name, 'impressao', PERFIL_OFICIAL_JF);
  
  console.log('\n📊 RESULTS:');
  console.log(`Motivação: ${motivacao.result} (audit steps: ${motivacao.audit.steps.length})`);
  console.log(`Expressão: ${expressao.result} (audit steps: ${expressao.audit.steps.length})`);
  console.log(`Impressão: ${impressao.result} (audit steps: ${impressao.audit.steps.length})`);
  
  console.log('\n🔍 DETAILED AUDIT FOR MOTIVAÇÃO:');
  console.log('Profile:', motivacao.audit.profile);
  console.log('Input:', motivacao.audit.input);
  console.log('Accented vowels:', motivacao.audit.accentedVowels);
  console.log('Accent bonus:', motivacao.audit.accentBonus);
  console.log('Total sum:', motivacao.audit.totalSum);
  console.log('Final result:', motivacao.audit.finalResult);
  console.log('Steps:', motivacao.audit.steps);
  
  console.log('\n🔍 DETAILED AUDIT FOR EXPRESSÃO:');
  console.log('Profile:', expressao.audit.profile);
  console.log('Input:', expressao.audit.input);
  console.log('Accented vowels:', expressao.audit.accentedVowels);
  console.log('Accent bonus:', expressao.audit.accentBonus);
  console.log('Total sum:', expressao.audit.totalSum);
  console.log('Final result:', expressao.audit.finalResult);
  console.log('Steps:', expressao.audit.steps);
  
  return {
    motivacao: motivacao.result,
    expressao: expressao.result,
    impressao: impressao.result,
    audits: { motivacao: motivacao.audit, expressao: expressao.audit, impressao: impressao.audit }
  };
}

export function validateJessicaCalculation() {
  console.log('\n✅ VALIDATING JÉSSICA CALCULATION');
  console.log('='.repeat(50));
  
  const result = testCurrentCalculation("Jéssica Paula de Souza");
  
  const expected = { motivacao: 9, expressao: 8, impressao: 8 };
  const actual = { motivacao: result.motivacao, expressao: result.expressao, impressao: result.impressao };
  
  console.log('\n📋 COMPARISON:');
  console.log('Expected:', expected);
  console.log('Actual:  ', actual);
  
  const passed = 
    expected.motivacao === actual.motivacao &&
    expected.expressao === actual.expressao &&
    expected.impressao === actual.impressao;
  
  console.log(`\n${passed ? '✅' : '❌'} VALIDATION ${passed ? 'PASSED' : 'FAILED'}`);
  
  if (!passed) {
    console.log('\n❌ MISMATCHES:');
    if (expected.motivacao !== actual.motivacao) console.log(`  Motivação: expected ${expected.motivacao}, got ${actual.motivacao}`);
    if (expected.expressao !== actual.expressao) console.log(`  Expressão: expected ${expected.expressao}, got ${actual.expressao}`);
    if (expected.impressao !== actual.impressao) console.log(`  Impressão: expected ${expected.impressao}, got ${actual.impressao}`);
  }
  
  return { passed, expected, actual, audits: result.audits };
}