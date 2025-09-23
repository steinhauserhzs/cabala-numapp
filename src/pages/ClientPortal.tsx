import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientPortal, useUpdateClientAccess } from '@/hooks/useClientPortal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Eye, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ClientPortal = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: portalData, isLoading, error } = useClientPortal(slug!, { enabled: !!slug });
  const updateAccess = useUpdateClientAccess();

  useEffect(() => {
    // Check if already authenticated for this client
    const authKey = `client_auth_${slug}`;
    const savedAuth = sessionStorage.getItem(authKey);
    if (savedAuth && portalData?.client) {
      const authData = JSON.parse(savedAuth);
      if (authData.clientId === portalData.client.id) {
        setIsAuthenticated(true);
      }
    }
  }, [slug, portalData]);

  const handleAuthentication = async () => {
    if (!nameInput.trim() || !portalData?.client) return;

    setIsVerifying(true);
    
    // Simple name verification (case insensitive, ignoring extra spaces)
    const inputName = nameInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const clientName = portalData.client.full_name.toLowerCase().replace(/\s+/g, ' ');
    
    if (inputName === clientName) {
      // Authentication successful
      const authKey = `client_auth_${slug}`;
      sessionStorage.setItem(authKey, JSON.stringify({
        clientId: portalData.client.id,
        timestamp: Date.now()
      }));
      
      // Update last access
      try {
        await updateAccess.mutateAsync(portalData.client.id);
      } catch (error) {
        console.warn('Failed to update access time:', error);
      }
      
      setIsAuthenticated(true);
      toast.success('Acesso autorizado!');
    } else {
      toast.error('Nome não confere. Verifique a digitação.');
    }
    
    setIsVerifying(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md mx-auto w-full">
          <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">Carregando portal...</h2>
          <p className="text-muted-foreground">
            Preparando seus dados numerológicos.
          </p>
        </Card>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md mx-auto w-full">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Portal não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O portal do cliente solicitado não existe ou não está mais disponível.
          </p>
          <Link to="/">
            <Button>Ir para página inicial</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Portal do Cliente</h1>
            <p className="text-muted-foreground">
              Olá <span className="font-semibold">{portalData.client.full_name}</span>!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Digite seu nome completo para acessar seus mapas numerológicos.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthentication()}
                disabled={isVerifying}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleAuthentication}
              disabled={!nameInput.trim() || isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Verificando...
                </>
              ) : (
                'Acessar Meus Mapas'
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {portalData.client.full_name}!
          </h1>
          <p className="text-muted-foreground">
            Aqui estão seus mapas numerológicos personalizados.
          </p>
        </div>

        {/* Maps List */}
        {portalData.maps.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum mapa encontrado</h3>
            <p className="text-muted-foreground">
              Seus mapas numerológicos aparecerão aqui quando estiverem prontos.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {portalData.maps.map((map) => (
              <Card key={map.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      Mapa {map.map_type}
                    </h3>
                    {map.birth_date && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(map.birth_date)}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(map.created_at)}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Sua análise numerológica completa com interpretações personalizadas 
                  e insights sobre sua personalidade e destino.
                </p>

                <Link to={`/cliente/${slug}/mapa/${map.id}`}>
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar Mapa
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Portal seguro para visualização de mapas numerológicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;