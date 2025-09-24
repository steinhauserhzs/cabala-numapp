// Local helpers for content service
import { obterInterpretacao } from '@/data/interpretacoes';

// Normalize topic names to our local dataset categories when possible
export function canonicalizeTopic(topico: string): string {
  const t = topico.toLowerCase();
  const map: Record<string, string> = {
    motivacao: 'motivacao',
    numero_motivacao: 'motivacao',
    'número_motivação': 'motivacao',
    impressao: 'impressao',
    'impressão': 'impressao',
    numero_impressao: 'impressao',
    expressao: 'expressao',
    'expressão': 'expressao',
    numero_expressao: 'expressao',
    destino: 'destino',
    numero_destino: 'destino',
    missao: 'missao',
    'missão': 'missao',
    ciclos_vida: 'ciclos_vida',
    ciclo_vida: 'ciclos_vida',
    'ciclos_de_vida': 'ciclos_vida',
    desafios: 'desafios',
    'desafio': 'desafios',
    momentos_decisivos: 'momentos_decisivos',
    'momento_decisivo': 'momentos_decisivos',
    tempos_pessoais: 'tempos_pessoais',
    'tempo_pessoal': 'tempos_pessoais',
    cores_pessoais: 'cores_pessoais',
    'cor_pessoal': 'cores_pessoais',
    pedras_pessoais: 'pedras_pessoais',
    'pedra_pessoal': 'pedras_pessoais',
    numeros_harmonicos: 'numeros_harmonicos',
    'numero_harmonico': 'numeros_harmonicos',
    anjos: 'anjos',
    anjo_guardiao: 'anjos',
    'anjo_da_guarda': 'anjos',
  };
  return map[t] || t;
}

export function getLocalInterpretacao(topico: string, numero: number): string | null {
  const cat = canonicalizeTopic(topico);
  const item = obterInterpretacao(cat, numero);
  if (!item) return null;
  const { titulo, descricao, caracteristicas, aspectosPositivos, desafios } = item;
  let texto = `**${titulo}**\n\n${descricao}`;
  if (caracteristicas?.length) texto += `\n\n**Características:**\n${caracteristicas.join(', ')}`;
  if (aspectosPositivos?.length) texto += `\n\n**Aspectos Positivos:**\n${aspectosPositivos.join(', ')}`;
  if (desafios?.length) texto += `\n\n**Desafios:**\n${desafios.join(', ')}`;
  return texto;
}
