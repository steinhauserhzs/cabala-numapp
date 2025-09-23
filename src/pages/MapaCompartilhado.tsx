import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSharedMap } from '@/hooks/useSharedMap';
import { SharedMapViewer } from '@/components/SharedMapViewer';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapaCompartilhado = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const token = searchParams.get('token');
  const isOwnerView = searchParams.get('share') === 'true' || !!user;

  const { data: mapData, isLoading, error } = useSharedMap(slug!, token || undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-lg font-semibold mb-2">Carregando mapa...</h2>
          <p className="text-muted-foreground">
            Aguarde enquanto preparamos sua análise numerológica.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Não foi possível acessar este mapa'}
          </p>
          <Link to="/">
            <Button className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Voltar ao Início</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Mapa não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O mapa solicitado não existe ou não está mais disponível.
          </p>
          <Link to="/">
            <Button className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Voltar ao Início</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const birthDate = mapData.birth_date ? new Date(mapData.birth_date) : new Date();

  return (
    <SharedMapViewer
      mapa={mapData.map_data}
      name={mapData.name}
      birthDate={birthDate}
      slug={slug!}
      token={token || undefined}
      visibility={mapData.visibility}
      showShareControls={isOwnerView}
    />
  );
};

export default MapaCompartilhado;