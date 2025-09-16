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
