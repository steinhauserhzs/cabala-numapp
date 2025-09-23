import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserMap {
  id: string;
  name: string;
  birth_date: string | null;
  map_type: string;
  slug: string;
  share_token: string;
  visibility: 'private' | 'public' | 'shared_link';
  created_at: string;
  updated_at: string;
}

export const useUserMaps = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-maps', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('numerology_maps')
        .select(`
          id,
          name,
          birth_date,
          map_type,
          slug,
          share_token,
          visibility,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao carregar mapas: ${error.message}`);
      }

      return data as UserMap[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};