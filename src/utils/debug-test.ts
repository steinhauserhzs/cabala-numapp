// Debug test for numerology calculations
import { gerarMapaNumerologico } from './numerology';
import { PERFIL_OFICIAL_JF } from './numerology-profile';
import { calcMotivacao, calcExpressao, calcImpressao, enableDebugMode } from './numerology';

export function testCalculations() {
  enableDebugMode(true);
  
  const testName = "hairã zupanc steinhauser";
  const testDate = new Date(1991, 4, 28); // May 28, 1991
  
  console.log('🧮 Testing calculations for:', testName);
  console.log('📅 Birth date:', testDate.toLocaleDateString('pt-BR'));
  console.log('⚙️ Using profile:', PERFIL_OFICIAL_JF.name);
  
  // Test individual calculations
  const motivacao = calcMotivacao(testName);
  const expressao = calcExpressao(testName);
  const impressao = calcImpressao(testName);
  
  console.log('🎯 Motivação:', motivacao);
  console.log('🎯 Expressão:', expressao);
  console.log('🎯 Impressão:', impressao);
  
  // Test full map generation
  const mapa = gerarMapaNumerologico(testName, testDate);
  console.log('📊 Full map:', mapa);
  
  return mapa;
}

export function testJessicaCalculations() {
  enableDebugMode(true);
  
  const testName = "Jéssica Paula de Souza";
  const testDate = new Date(1991, 4, 28); // May 28, 1991
  
  console.log('🧮 Testing JÉSSICA calculations for:', testName);
  console.log('📅 Birth date:', testDate.toLocaleDateString('pt-BR'));
  console.log('⚙️ Using profile:', PERFIL_OFICIAL_JF.name);
  
  // Test individual calculations  
  const motivacao = calcMotivacao(testName);
  const expressao = calcExpressao(testName);
  const impressao = calcImpressao(testName);
  
  console.log('🎯 Motivação (expected 9):', motivacao);
  console.log('🎯 Expressão (expected 8):', expressao);
  console.log('🎯 Impressão (expected 8):', impressao);
  
  // Test full map generation
  const mapa = gerarMapaNumerologico(testName, testDate);
  console.log('📊 Full map:', mapa);
  
  return mapa;
}