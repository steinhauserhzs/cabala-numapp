import { useMemo } from 'react';
import { useNumerologyContentByTopic } from './useNumerologyContent';
import { obterInterpretacao, extrairInterpretacaoDoConteudo, InterpretacaoNumerologica } from '@/data/interpretacoes';

export const useInterpretacao = (categoria: string, numero: number): {
  interpretacao: InterpretacaoNumerologica | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const { data: conteudoSupabase, isLoading, error } = useNumerologyContentByTopic(categoria);
  
  const interpretacao = useMemo(() => {
    // Primeiro, tentar obter dos dados do Supabase
    if (conteudoSupabase && conteudoSupabase.conteudo) {
      const interpretacaoSupabase = extrairInterpretacaoDoConteudo(conteudoSupabase.conteudo, numero, categoria);
      if (interpretacaoSupabase) {
        return interpretacaoSupabase;
      }
    }
    
    // Fallback: mensagem padrão se não encontrar interpretação
    return {
      titulo: `${categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${numero}`,
      descricao: "Não há interpretação específica para este número neste tópico.",
      caracteristicas: [],
      aspectosPositivos: [],
      desafios: []
    };
  }, [conteudoSupabase, categoria, numero]);
  
  return {
    interpretacao,
    isLoading,
    error
  };
};