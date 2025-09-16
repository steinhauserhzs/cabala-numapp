import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NumerologyContent {
  id: number;
  topico: string;
  conteudo: any;
  created_at: string;
}

export const useNumerologyContent = () => {
  return useQuery({
    queryKey: ['numerology-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conteudos_numerologia')
        .select('*')
        .order('topico', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as NumerologyContent[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });
};

export const useNumerologyContentByTopic = (topico: string) => {
  return useQuery({
    queryKey: ['numerology-content', topico],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conteudos_numerologia')
        .select('*')
        .eq('topico', topico)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as NumerologyContent;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });
};