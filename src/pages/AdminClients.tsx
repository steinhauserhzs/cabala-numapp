import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, useClientMaps, useCreateClient, Client } from '@/hooks/useClients';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AdminHeader from '@/components/AdminHeader';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  ExternalLink, 
  Calendar, 
  FileText,
  Copy,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminClients = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  const { data: clients, isLoading } = useClients();
  const { data: allMaps } = useClientMaps();
  const createClient = useCreateClient();

  const handleCreateClient = async () => {
    if (!newClientData.full_name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      await createClient.mutateAsync({
        full_name: newClientData.full_name.trim(),
        email: newClientData.email.trim() || undefined,
        phone: newClientData.phone.trim() || undefined,
      });
      
      setNewClientData({ full_name: '', email: '', phone: '' });
      setIsCreateModalOpen(false);
      toast.success('Cliente criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar cliente');
    }
  };

  const copyPortalLink = (client: Client) => {
    const url = `${window.location.origin}/cliente/${client.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copiado!');
    }).catch(() => {
      toast.error('Erro ao copiar link');
    });
  };

  const getClientMapCount = (clientId: string) => {
    return allMaps?.filter(map => map.client_id === clientId).length || 0;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Gestão de Clientes" 
        description="Gerencie seus clientes e mapas numerológicos"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo do cliente"
                    value={newClientData.full_name}
                    onChange={(e) => setNewClientData(prev => ({
                      ...prev,
                      full_name: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newClientData.email}
                    onChange={(e) => setNewClientData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateClient}
                    disabled={createClient.isPending}
                    className="flex-1"
                  >
                    {createClient.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Cliente'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{clients?.length || 0}</p>
                <p className="text-muted-foreground">Total de Clientes</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{allMaps?.length || 0}</p>
                <p className="text-muted-foreground">Mapas Criados</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {clients?.filter(c => c.last_access).length || 0}
                </p>
                <p className="text-muted-foreground">Acessos Recentes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Clients List */}
        {!clients || clients.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro cliente para gerar mapas numerológicos.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Cliente
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => {
              const mapCount = getClientMapCount(client.id);
              return (
                <Card key={client.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {client.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Criado em {formatDate(client.created_at)}
                      </p>
                    </div>
                    <Badge variant={mapCount > 0 ? "default" : "secondary"}>
                      {mapCount} {mapCount === 1 ? 'mapa' : 'mapas'}
                    </Badge>
                  </div>

                  {client.email && (
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {client.email}
                    </p>
                  )}

                  {client.last_access && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Último acesso: {formatDate(client.last_access)}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPortalLink(client)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Link do Portal
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <a
                        href={`/cliente/${client.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Portal
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;