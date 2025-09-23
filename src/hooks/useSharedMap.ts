import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MapaNumerologico } from '@/utils/numerology';

interface SharedMapData {
  id: string;
  name: string;
  birth_date: string | null;
  map_data: MapaNumerologico;
  visibility: 'private' | 'public' | 'shared_link';
  expires_at: string | null;
  created_at: string;
}

export const useSharedMap = (slug: string, token?: string) => {
  return useQuery({
    queryKey: ['shared-map', slug, token],
    queryFn: async () => {
      // Build query based on visibility and token
      let query = supabase
        .from('numerology_maps')
        .select('*')
        .eq('slug', slug);

      const { data, error } = await query.maybeSingle();

      if (error) {
        throw new Error(`Erro ao carregar mapa: ${error.message}`);
      }

      if (!data) {
        throw new Error('Mapa não encontrado');
      }

      // Check access permissions
      if (data.visibility === 'private') {
        throw new Error('Este mapa é privado e não pode ser acessado');
      }

      if (data.visibility === 'shared_link') {
        if (!token || token !== data.share_token) {
          throw new Error('Token de acesso inválido ou ausente');
        }
      }

      // Check if map has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Este link expirou');
      }

      return {
        ...data,
        map_data: data.map_data as unknown as MapaNumerologico
      } as SharedMapData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    enabled: !!slug,
  });
};