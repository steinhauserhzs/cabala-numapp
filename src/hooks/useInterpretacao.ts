import { useQuery } from '@tanstack/react-query';
import { getInterpretacao } from '@/services/content';

export const useInterpretacao = (categoria: string, numero: number | string): {
  interpretacao: string | null;
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

  // Strong fallback - never return null or empty
  const fallback = `Interpretação para ${categoria} ${numero} em desenvolvimento. Esta análise numerológica está sendo preparada especialmente para você.`;

  return {
    interpretacao: data && String(data).trim().length > 0 ? data : fallback,
    isLoading,
    error: error as Error | null,
  };
};