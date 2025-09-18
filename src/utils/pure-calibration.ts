// Pure calibration test (no global state mutations)
import { gerarMapaNumerologicoPuro } from './numerology-pure';
import { PERFIL_OFICIAL_FINAL } from './official-profile-final';

export function testCalibrationPure() {
  const testName = "hairã zupanc steinhauser";
  const testDate = new Date(2000, 4, 11);
  
  const mapa = gerarMapaNumerologicoPuro(testName, testDate, PERFIL_OFICIAL_FINAL);
  
  const expected = {
    motivacao: 22,
    expressao: 11,
    impressao: 7,
    destino: 9,
    missao: 2,
    ciclos: [5, 11, 2]
  };
  
  const actual = {
    motivacao: mapa.motivacao,
    expressao: mapa.expressao,
    impressao: mapa.impressao,
    destino: mapa.destino,
    missao: mapa.missao,
    ciclos: [mapa.ciclosVida.primeiro, mapa.ciclosVida.segundo, mapa.ciclosVida.terceiro]
  };
  
  console.log('🎯 PURE CALIBRATION TEST:');
  console.log('Expected:', expected);
  console.log('Actual:', actual);
  
  const isCalibrated = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(isCalibrated ? '✅ CALIBRATED!' : '❌ NEEDS ADJUSTMENT');
  
  return { expected, actual, isCalibrated };
}