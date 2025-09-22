// Quick test script for the new deterministic cabalistic engine
import { computeFullMap } from './numerology-cabalistic';
import { gerarMapaNumerologico } from './numerology';

// Test function
export function testNewEngine() {
  console.log("=== TESTING NEW DETERMINISTIC CABALISTIC ENGINE ===\n");
  
  // Test case 1: Hairã
  console.log("Test 1: Hairã Zupanc Steinhauser");
  const haira = computeFullMap("hairã zupanc steinhauser", "11/05/2000");
  
  console.log("Normalized name:", haira.nome_normalizado);
  console.log("Motivação:", haira.numeros.Motivacao.bruto, "->", haira.numeros.Motivacao.numero);
  console.log("Expressão:", haira.numeros.Expressao.bruto, "->", haira.numeros.Expressao.numero);
  console.log("Impressão:", haira.numeros.Impressao.bruto, "->", haira.numeros.Impressao.numero);
  console.log("Destino:", haira.numeros.Destino.soma_data, "->", haira.numeros.Destino.numero);
  console.log("Missão:", haira.numeros.Missao.soma_destino_psiquico, "->", haira.numeros.Missao.numero);
  console.log("Número Psíquico:", haira.numeros.NumeroPsiquico.numero);
  console.log("Ciclos de Vida:", haira.ciclos.vida);
  console.log("Desafios:", haira.ciclos.desafios);
  console.log("Lições Cármicas:", haira.carmicos.licoes);
  console.log("Dívidas Cármicas:", haira.carmicos.dividas);
  console.log("Tendências Ocultas:", haira.carmicos.tendencias_ocultas);
  console.log("Resposta Subconsciente:", haira.carmicos.resposta_subconsciente);
  
  // Test compatibility layer
  console.log("\n--- Testing compatibility layer ---");
  const legacyResult = gerarMapaNumerologico("hairã zupanc steinhauser", new Date(2000, 4, 11));
  console.log("Legacy interface result:", {
    motivacao: legacyResult.motivacao,
    expressao: legacyResult.expressao,
    impressao: legacyResult.impressao,
    destino: legacyResult.destino,
    missao: legacyResult.missao
  });
  
  console.log("\n=== TEST 2: Jéssica ===");
  const jessica = computeFullMap("jéssica paula de souza", "28/05/1991");
  
  console.log("Normalized name:", jessica.nome_normalizado);
  console.log("Motivação:", jessica.numeros.Motivacao.bruto, "->", jessica.numeros.Motivacao.numero);
  console.log("Expressão:", jessica.numeros.Expressao.bruto, "->", jessica.numeros.Expressao.numero);
  console.log("Impressão:", jessica.numeros.Impressao.bruto, "->", jessica.numeros.Impressao.numero);
  console.log("Destino:", jessica.numeros.Destino.soma_data, "->", jessica.numeros.Destino.numero);
  console.log("Missão:", jessica.numeros.Missao.soma_destino_psiquico, "->", jessica.numeros.Missao.numero);
  
  return { haira, jessica };
}

// Auto-run in development
if (typeof window !== 'undefined') {
  // We're in the browser
  setTimeout(() => {
    console.log("Running automatic test...");
    testNewEngine();
  }, 1000);
}