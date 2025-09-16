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
      const interpretacaoSupabase = extrairInterpretacaoDoConteudo(conteudoSupabase.conteudo, numero);
      if (interpretacaoSupabase) {
        return interpretacaoSupabase;
      }
    }
    
    // Fallback para dados locais
    return obterInterpretacao(categoria, numero);
  }, [conteudoSupabase, categoria, numero]);
  
  return {
    interpretacao,
    isLoading,
    error
  };
};