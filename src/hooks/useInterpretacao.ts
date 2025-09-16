import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInterpretacao } from '@/services/content';
import { InterpretacaoNumerologica } from '@/data/interpretacoes';

export const useInterpretacao = (categoria: string, numero: number): {
  interpretacao: InterpretacaoNumerologica | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['interpretacao', categoria, numero],
    queryFn: async () => {
      return await getInterpretacao(categoria, numero);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const interpretacao = useMemo(() => {
    if (data) {
      return {
        titulo: `${categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${numero}`,
        descricao: data,
        caracteristicas: [],
        aspectosPositivos: [],
        desafios: []
      } satisfies InterpretacaoNumerologica;
    }

    return {
      titulo: `${categoria.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${numero}`,
      descricao: "Não há interpretação específica para este número neste tópico.",
      caracteristicas: [],
      aspectosPositivos: [],
      desafios: []
    } as InterpretacaoNumerologica;
  }, [data, categoria, numero]);
  
  return {
    interpretacao,
    isLoading,
    error: error as Error | null,
  };
};