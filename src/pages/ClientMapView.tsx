import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClientMapById } from '@/hooks/useClientPortal';
import { InteractiveNumerologyDashboard } from '@/components/InteractiveNumerologyDashboard';
import { MapaNumerologico } from '@/utils/numerology';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const ClientMapView = () => {
  const { slug, mapId } = useParams<{ slug: string; mapId: string }>();
  const navigate = useNavigate();
  const { data: mapData, isLoading, error } = useClientMapById(mapId!);

  useEffect(() => {
    // Check if user is authenticated for this client
    const authKey = `client_auth_${slug}`;
    const savedAuth = sessionStorage.getItem(authKey);
    
    if (!savedAuth) {
      navigate(`/cliente/${slug}`);
      return;
    }

    try {
      const authData = JSON.parse(savedAuth);
      // Check if auth is still valid (24 hours)
      const authAge = Date.now() - authData.timestamp;
      if (authAge > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(authKey);
        navigate(`/cliente/${slug}`);
        return;
      }

      // Verify this map belongs to the authenticated client
      if (mapData && mapData.client_id !== authData.clientId) {
        navigate(`/cliente/${slug}`);
        return;
      }
    } catch (error) {
      navigate(`/cliente/${slug}`);
    }
  }, [slug, mapId, mapData, navigate]);

  const handleBack = () => {
    navigate(`/cliente/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md mx-auto w-full">
          <Loader2 className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">Carregando mapa...</h2>
          <p className="text-muted-foreground">
            Preparando sua análise numerológica.
          </p>
        </Card>
      </div>
    );
  }

  if (error || !mapData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md mx-auto w-full">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Mapa não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O mapa solicitado não existe ou não está mais disponível.
          </p>
          <Link to={`/cliente/${slug}`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Portal
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const birthDate = mapData.birth_date ? new Date(mapData.birth_date) : new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao Portal</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold">
                  {mapData.clients?.full_name}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  Mapa {mapData.map_type}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <InteractiveNumerologyDashboard
        mapa={mapData.map_data as unknown as MapaNumerologico}
        name={mapData.clients?.full_name || ''}
        birthDate={birthDate}
        onBack={handleBack}
      />
    </div>
  );
};

export default ClientMapView;