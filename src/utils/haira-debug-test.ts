// Teste específico para debug da Hairã
import { gerarMapaNumerologico } from './numerology';

export function testHairaDebug() {
  console.log("🧪 INICIANDO TESTE DE DEBUG PARA HAIRÃ");
  console.log("=======================================");
  
  const nome = "hairã zupanc steinhauser";
  const dataNascimento = new Date(2000, 4, 11); // Maio = 4 (0-indexed)
  
  console.log(`Nome original: "${nome}"`);
  console.log(`Data: ${dataNascimento.toLocaleDateString('pt-BR')}`);
  console.log("");
  
  // Executar cálculo completo usando o engine unificado
  const resultado = gerarMapaNumerologico(nome, dataNascimento);
  
  console.log("📊 RESULTADOS FINAIS:");
  
  // Extrair valores numéricos do mapa
  const motivacao = resultado.motivacao;
  const expressao = resultado.expressao;
  const impressao = resultado.impressao;
  const destino = resultado.destino;
  const missao = resultado.missao;
  
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