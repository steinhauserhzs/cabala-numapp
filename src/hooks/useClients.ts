import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Client {
  id: string;
  full_name: string;
  slug: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_access?: string;
  professional_id: string;
}

export interface ClientMap {
  id: string;
  client_id: string;
  professional_id: string;
  map_data: any;
  map_type: string;
  birth_date?: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export const useClients = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('professional_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao carregar clientes: ${error.message}`);
      }

      return data as Client[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useClientMaps = (clientId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['client-maps', clientId, user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('client_maps')
        .select('*')
        .eq('professional_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao carregar mapas: ${error.message}`);
      }

      return data as ClientMap[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (clientData: { 
      full_name: string; 
      email?: string; 
      phone?: string; 
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate slug
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_client_slug', { client_name: clientData.full_name });

      if (slugError) {
        throw new Error(`Erro ao gerar slug: ${slugError.message}`);
      }

      // Create client
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          slug: slugData,
          professional_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar cliente: ${error.message}`);
      }

      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useCreateClientMap = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (mapData: {
      client_id: string;
      map_data: any;
      map_type: string;
      birth_date?: Date;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('client_maps')
        .insert({
          ...mapData,
          birth_date: mapData.birth_date?.toISOString().split('T')[0],
          professional_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar mapa: ${error.message}`);
      }

      return data as ClientMap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-maps'] });
    },
  });
};