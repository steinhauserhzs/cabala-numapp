// Test current calculations for Hairã to debug discrepancies
import { gerarMapaNumerologico, setActiveProfile, enableDebugMode, getAuditLogs, clearAuditLogs } from './numerology';
import { PERFIL_CONECTA } from './numerology-profile';

export function testHairaCurrentCalculations() {
  // Set profile and enable debugging
  setActiveProfile(PERFIL_CONECTA);
  enableDebugMode(true);
  clearAuditLogs();
  
  const testName = "hairã zupanc steinhauser";
  const testDate = new Date(2000, 4, 11); // May 11, 2000 (month 0-indexed)
  
  console.log('🧮 TESTING HAIRÃ CALCULATIONS');
  console.log('Name:', testName);
  console.log('Birth Date:', testDate.toLocaleDateString('pt-BR'));
  console.log('Profile:', PERFIL_CONECTA.name);
  console.log('Profile Config:', {
    useGlobalVowelSum: PERFIL_CONECTA.useGlobalVowelSum,
    accentBonusPerVowel: PERFIL_CONECTA.accentBonusPerVowel,
    missionFormula: PERFIL_CONECTA.missionFormula,
    masters: Array.from(PERFIL_CONECTA.masters)
  });
  
  // Generate map
  const mapa = gerarMapaNumerologico(testName, testDate);
  
  // Expected values (from user's reference)
  const expected = {
    motivacao: 22,
    expressao: 11,
    impressao: 7,
    destino: 9,
    missao: 2,
    ciclos: [5, 11, 2]
  };
  
  // Actual values
  const actual = {
    motivacao: mapa.motivacao,
    expressao: mapa.expressao,
    impressao: mapa.impressao,
    destino: mapa.destino,
    missao: mapa.missao,
    ciclos: [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro]
  };
  
  console.log('\n📊 COMPARISON:');
  console.log('Expected:', expected);
  console.log('Actual:', actual);
  
  // Check differences
  const errors: string[] = [];
  Object.keys(expected).forEach(key => {
    if (key === 'ciclos') {
      const expCiclos = expected.ciclos;
      const actCiclos = actual.ciclos;
      if (JSON.stringify(expCiclos) !== JSON.stringify(actCiclos)) {
        errors.push(`${key}: expected [${expCiclos.join(',')}], got [${actCiclos.join(',')}]`);
      }
    } else {
      const expVal = expected[key as keyof typeof expected];
      const actVal = actual[key as keyof typeof actual];
      if (expVal !== actVal) {
        errors.push(`${key}: expected ${expVal}, got ${actVal}`);
      }
    }
  });
  
  if (errors.length === 0) {
    console.log('✅ ALL CALCULATIONS MATCH REFERENCE!');
  } else {
    console.log('❌ DISCREPANCIES FOUND:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  // Log audit details
  const auditLogs = getAuditLogs();
  console.log('\n🔍 AUDIT LOGS:');
  auditLogs.forEach(log => {
    console.log(`${log.operation.toUpperCase()}:`, log);
  });
  
  return {
    expected,
    actual,
    errors,
    auditLogs,
    fullMap: mapa
  };
}