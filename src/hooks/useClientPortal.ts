import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ClientPortalData {
  client: {
    id: string;
    full_name: string;
    slug: string;
    email?: string;
    phone?: string;
    created_at: string;
    last_access?: string;
  };
  maps: Array<{
    id: string;
    map_data: any;
    map_type: string;
    birth_date?: string;
    created_at: string;
    status: string;
  }>;
}

export const useClientPortal = (clientSlug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['client-portal', clientSlug],
    queryFn: async () => {
      // Get client by slug
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, full_name, slug, email, phone, created_at, last_access')
        .eq('slug', clientSlug)
        .single();

      if (clientError) {
        throw new Error(`Cliente não encontrado: ${clientError.message}`);
      }

      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      // Get client maps
      const { data: maps, error: mapsError } = await supabase
        .from('client_maps')
        .select('id, map_data, map_type, birth_date, created_at, status')
        .eq('client_id', client.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (mapsError) {
        throw new Error(`Erro ao carregar mapas: ${mapsError.message}`);
      }

      return {
        client,
        maps: maps || []
      } as ClientPortalData;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    enabled: !!clientSlug && (options?.enabled !== false),
  });
};

export const useClientMapById = (mapId: string) => {
  return useQuery({
    queryKey: ['client-map', mapId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_maps')
        .select(`
          id,
          map_data,
          map_type,
          birth_date,
          created_at,
          status,
          client_id,
          clients!inner (
            id,
            full_name,
            slug
          )
        `)
        .eq('id', mapId)
        .eq('status', 'active')
        .single();

      if (error) {
        throw new Error(`Mapa não encontrado: ${error.message}`);
      }

      if (!data) {
        throw new Error('Mapa não encontrado');
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    enabled: !!mapId,
  });
};

export const useUpdateClientAccess = () => {
  return useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('clients')
        .update({ last_access: new Date().toISOString() })
        .eq('id', clientId);

      if (error) {
        throw new Error(`Erro ao atualizar acesso: ${error.message}`);
      }
    },
  });
};