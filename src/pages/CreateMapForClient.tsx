import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCreateClient, useCreateClientMap } from '@/hooks/useClients';
import { gerarMapaNumerologico } from '@/utils/numerology';
import NumerologyForm from '@/components/NumerologyForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Copy, ExternalLink, ArrowLeft } from 'lucide-react';

const CreateMapForClient = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clientData, setClientData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [portalUrl, setPortalUrl] = useState('');

  const createClient = useCreateClient();
  const createClientMap = useCreateClientMap();

  const handleFormSubmit = async (name: string, birthDate: Date) => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setIsCreating(true);

    try {
      // Generate numerology map
      const mapa = gerarMapaNumerologico(name, birthDate);

      // Create or find client
      let client;
      try {
        client = await createClient.mutateAsync({
          full_name: clientData.full_name || name,
          email: clientData.email || undefined,
          phone: clientData.phone || undefined,
        });
      } catch (error) {
        // If client already exists with this name, we'll need to handle this
        // For now, just show error
        throw new Error('Cliente já existe ou erro ao criar');
      }

      // Create client map
      await createClientMap.mutateAsync({
        client_id: client.id,
        map_data: mapa,
        map_type: 'pessoal',
        birth_date: birthDate,
      });

      // Generate portal URL
      const url = `${window.location.origin}/cliente/${client.slug}`;
      setPortalUrl(url);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Erro ao criar mapa:', error);
      toast.error('Erro ao criar mapa para o cliente');
    } finally {
      setIsCreating(false);
    }
  };

  const copyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl).then(() => {
      toast.success('Link copiado!');
    }).catch(() => {
      toast.error('Erro ao copiar link');
    });
  };

  const openPortal = () => {
    window.open(portalUrl, '_blank');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Dashboard</span>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold">Criar Mapa para Cliente</h1>
              <p className="text-sm text-muted-foreground">
                Gere um mapa numerológico e crie acesso para seu cliente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info Form */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input
                id="client_name"
                placeholder="Nome completo do cliente"
                value={clientData.full_name}
                onChange={(e) => setClientData(prev => ({
                  ...prev,
                  full_name: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="client_email">Email (opcional)</Label>
              <Input
                id="client_email"
                type="email"
                placeholder="email@exemplo.com"
                value={clientData.email}
                onChange={(e) => setClientData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="client_phone">Telefone (opcional)</Label>
              <Input
                id="client_phone"
                placeholder="(11) 99999-9999"
                value={clientData.phone}
                onChange={(e) => setClientData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </div>
          </div>
        </Card>

        {/* Numerology Form */}
        <NumerologyForm
          onSubmit={handleFormSubmit}
          isLoading={isCreating}
          title="Dados do Mapa Numerológico"
          description="Preencha os dados para gerar o mapa do cliente"
          submitButtonText="Criar Mapa para Cliente"
        />
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mapa Criado com Sucesso!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              O mapa numerológico foi criado e está disponível no portal do cliente.
              Compartilhe o link abaixo para que o cliente possa acessar:
            </p>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-mono break-all">{portalUrl}</p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={copyPortalLink}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                onClick={openPortal}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Portal
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/admin/clientes');
                }}
                className="w-full"
              >
                Ver Todos os Clientes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMapForClient;