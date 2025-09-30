import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnePageNumerologyReport } from '@/components/OnePageNumerologyReport';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Copy, CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { formatShareUrl, copyToClipboard } from '@/utils/sharing';
import { useToast } from '@/hooks/use-toast';
import type { MapaNumerologico } from '@/utils/numerology';

interface SharedMapViewerProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  slug: string;
  token?: string;
  visibility: 'private' | 'public' | 'shared_link';
  showShareControls?: boolean;
}

export const SharedMapViewer: React.FC<SharedMapViewerProps> = ({
  mapa,
  name,
  birthDate,
  slug,
  token,
  visibility,
  showShareControls = false,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const shareUrl = formatShareUrl(slug, visibility === 'shared_link' ? token : undefined);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  if (showShareControls) {
    return (
      <div className="min-h-screen bg-background">
        {/* Share Controls Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                  <Share2 className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Mapa compartilhável gerado!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use os botões abaixo para compartilhar com seu cliente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenInNewTab}
                  >
                    Abrir em Nova Aba
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Gerar PDF</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-muted rounded text-sm font-mono text-muted-foreground break-all">
                {shareUrl}
              </div>
            </Card>
          </div>
        </div>

        {/* Map Content */}
        <OnePageNumerologyReport 
          mapa={mapa}
          name={name}
          birthDate={birthDate}
          onGeneratePDF={() => {}}
          onShare={handleCopyLink}
        />
      </div>
    );
  }

  // Public view (no share controls)
  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Dashboard</span>
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Mapa Numerológico
              </h1>
              <p className="text-muted-foreground">
                Análise personalizada gerada especialmente para você
              </p>
            </div>
            <div className="w-[140px]"></div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <OnePageNumerologyReport 
        mapa={mapa}
        name={name}
        birthDate={birthDate}
      />
    </div>
  );
};