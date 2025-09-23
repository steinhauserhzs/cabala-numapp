// Teste específico para debug da Hairã
import { computeFullMap } from './numerology-cabalistic';

export function testHairaDebug() {
  console.log("🧪 INICIANDO TESTE DE DEBUG PARA HAIRÃ");
  console.log("=======================================");
  
  const nome = "hairã zupanc steinhauser";
  const data = "11/05/2000";
  
  console.log(`Nome original: "${nome}"`);
  console.log(`Data: ${data}`);
  console.log("");
  
  // Executar cálculo completo
  const resultado = computeFullMap(nome, data);
  
  console.log("📊 RESULTADOS FINAIS:");
  
  // Extrair valores numéricos corretamente
  const motivacao = typeof resultado.numeros.Motivacao === 'number' ? resultado.numeros.Motivacao : resultado.numeros.Motivacao.numero;
  const expressao = typeof resultado.numeros.Expressao === 'number' ? resultado.numeros.Expressao : resultado.numeros.Expressao.numero;
  const impressao = typeof resultado.numeros.Impressao === 'number' ? resultado.numeros.Impressao : resultado.numeros.Impressao.numero;
  const destino = typeof resultado.numeros.Destino === 'number' ? resultado.numeros.Destino : resultado.numeros.Destino.numero;
  const missao = typeof resultado.numeros.Missao === 'number' ? resultado.numeros.Missao : resultado.numeros.Missao.numero;
  
  console.log(`   Motivação: ${motivacao} (esperado: 22)`);
  console.log(`   Expressão: ${expressao} (esperado: 11)`);
  console.log(`   Impressão: ${impressao} (esperado: 7)`);
  console.log(`   Destino: ${destino} (esperado: 9)`);
  console.log(`   Missão: ${missao} (esperado: 2)`);
  
  console.log("📋 COMPARAÇÃO:");
  const esperados = { motivacao: 22, expressao: 11, impressao: 7, destino: 9, missao: 2 };
  const atual = {
    motivacao,
    expressao,
    impressao,
    destino,
    missao
  };
  
  let erros = 0;
  Object.keys(esperados).forEach(key => {
    const esperado = esperados[key as keyof typeof esperados];
    const obtido = atual[key as keyof typeof atual];
    if (esperado !== obtido) {
      console.log(`   ❌ ${key}: esperado ${esperado}, obtido ${obtido}`);
      erros++;
    } else {
      console.log(`   ✅ ${key}: ${obtido} (correto)`);
    }
  });
  
  console.log(`\n🎯 RESULTADO: ${erros === 0 ? 'TODOS CORRETOS!' : `${erros} erro(s) encontrado(s)`}`);
  
  return { esperados, atual, erros };
}

// Auto-executar em desenvolvimento
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testHairaDebug();
  }, 1000);
}