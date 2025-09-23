import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  Search, 
  ExternalLink, 
  Loader2,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Client {
  id: string;
  full_name: string;
  slug: string;
  email?: string;
  last_access?: string;
}

interface ClientMap {
  id: string;
  map_type: string;
  birth_date?: string;
  created_at: string;
}

const ClientPortalSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundClients, setFoundClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientMaps, setClientMaps] = useState<ClientMap[]>([]);

  const searchClients = async () => {
    if (!searchName.trim()) {
      toast.error('Digite seu nome para buscar');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, full_name, slug, email, last_access')
        .ilike('full_name', `%${searchName.trim()}%`)
        .limit(5);

      if (error) throw error;

      setFoundClients(data || []);
      
      if (!data || data.length === 0) {
        toast.error('Nenhum cliente encontrado com este nome');
      }
    } catch (error) {
      toast.error('Erro ao buscar clientes');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectClient = async (client: Client) => {
    setSelectedClient(client);
    
    // Buscar mapas do cliente
    try {
      const { data: maps, error } = await supabase
        .from('client_maps')
        .select('id, map_type, birth_date, created_at')
        .eq('client_id', client.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientMaps(maps || []);
    } catch (error) {
      console.error('Erro ao carregar mapas:', error);
      setClientMaps([]);
    }
  };

  const accessClientPortal = (client: Client) => {
    const url = `/cliente/${client.slug}`;
    window.open(url, '_blank');
    setIsModalOpen(false);
    setSearchName('');
    setFoundClients([]);
    setSelectedClient(null);
    setClientMaps([]);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getMapTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'pessoal': 'Mapa Pessoal',
      'empresarial': 'Mapa Empresarial',
      'infantil': 'Mapa Infantil',
      'conjugal': 'Harmonia Conjugal'
    };
    return types[type] || type;
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-cosmic bg-clip-text text-transparent">
              Portal do Cliente
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Já é nosso cliente? Acesse seus mapas numerológicos personalizados
          </p>
        </div>

        <Card className="shadow-mystical border-primary/10">
          <CardHeader>
            <div className="mx-auto p-3 rounded-full bg-gradient-celestial w-fit mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Acesse Seus Mapas</CardTitle>
            <CardDescription>
              Digite seu nome para encontrar e acessar seus mapas numerológicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-cosmic hover:shadow-glow">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Meus Mapas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Encontrar Seus Mapas</DialogTitle>
                </DialogHeader>
                
                {!selectedClient ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Seu nome completo</Label>
                      <Input
                        id="clientName"
                        placeholder="Digite seu nome..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchClients()}
                      />
                    </div>
                    
                    <Button 
                      onClick={searchClients} 
                      disabled={isSearching}
                      className="w-full"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </>
                      )}
                    </Button>

                    {foundClients.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <p className="text-sm text-muted-foreground">
                          Clientes encontrados:
                        </p>
                        {foundClients.map((client) => (
                          <Card 
                            key={client.id} 
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => selectClient(client)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="font-medium">{client.full_name}</p>
                                {client.email && (
                                  <p className="text-xs text-muted-foreground">{client.email}</p>
                                )}
                              </div>
                              <Button size="sm" variant="outline">
                                Selecionar
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{selectedClient.full_name}</h3>
                      {selectedClient.email && (
                        <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                      )}
                    </div>

                    {clientMaps.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Seus mapas disponíveis:</p>
                        {clientMaps.map((map) => (
                          <Card key={map.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="font-medium">{getMapTypeLabel(map.map_type)}</p>
                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Criado em {formatDate(map.created_at)}
                                  </span>
                                  {map.birth_date && (
                                    <span>Nascimento: {formatDate(map.birth_date)}</span>
                                  )}
                                </div>
                              </div>
                              <Badge variant="default">
                                <FileText className="h-3 w-3 mr-1" />
                                Mapa
                              </Badge>
                            </div>
                          </Card>
                        ))}
                        
                        <Button 
                          onClick={() => accessClientPortal(selectedClient)}
                          className="w-full bg-gradient-cosmic hover:shadow-glow"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar Portal
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Nenhum mapa encontrado para este cliente
                        </p>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedClient(null);
                        setClientMaps([]);
                      }}
                      className="w-full"
                    >
                      Voltar à busca
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClientPortalSection;