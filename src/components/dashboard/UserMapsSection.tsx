import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUserMaps } from '@/hooks/useUserMaps';
import { formatShareUrl, copyToClipboard } from '@/utils/sharing';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Share2, 
  Copy, 
  Eye, 
  Trash2, 
  Calendar,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UserMapsSection: React.FC = () => {
  const { data: maps, isLoading, error } = useUserMaps();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mapToDelete, setMapToDelete] = useState<{ id: string; name: string } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (mapId: string) => {
      const { error } = await supabase
        .from('numerology_maps')
        .delete()
        .eq('id', mapId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-maps'] });
      toast({
        title: "Mapa deletado!",
        description: "O mapa foi removido com sucesso.",
      });
      setMapToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao deletar",
        description: error.message,
        variant: "destructive",
      });
      setMapToDelete(null);
    },
  });

  const handleCopyLink = async (slug: string, token: string, visibility: string) => {
    const url = formatShareUrl(slug, visibility === 'shared_link' ? token : undefined);
    const success = await copyToClipboard(url);
    
    if (success) {
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleViewMap = (slug: string, token: string) => {
    const url = formatShareUrl(slug, token);
    window.open(url, '_blank');
  };

  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      'private': { variant: 'secondary' as const, label: 'Privado' },
      'shared_link': { variant: 'default' as const, label: 'Link Compartilhado' },
      'public': { variant: 'outline' as const, label: 'Público' }
    };
    
    const config = variants[visibility as keyof typeof variants] || variants.private;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Mapas Criados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Mapas Criados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Erro ao carregar mapas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="h-5 w-5" />
          <span>Mapas Criados</span>
          {maps && maps.length > 0 && (
            <Badge variant="outline" className="ml-auto">
              {maps.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!maps || maps.length === 0 ? (
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum mapa criado ainda
            </p>
            <p className="text-sm text-muted-foreground">
              Seus mapas numerológicos aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {maps.map((map) => (
              <div
                key={map.id}
                className="border rounded-lg p-3 sm:p-4 bg-card"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{map.name}</h4>
                      {getVisibilityBadge(map.visibility)}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {map.birth_date ? 
                            format(new Date(map.birth_date), 'dd/MM/yyyy', { locale: ptBR }) :
                            'Sem data'
                          }
                        </span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        Criado em {format(new Date(map.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    
                    <div className="text-xs font-mono text-muted-foreground bg-muted rounded px-2 py-1 break-all">
                      {formatShareUrl(map.slug, map.visibility === 'shared_link' ? map.share_token : undefined)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2 sm:ml-4 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMap(map.slug, map.share_token)}
                      className="flex items-center space-x-1 w-full sm:w-auto"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Ver</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(map.slug, map.share_token, map.visibility)}
                      className="flex items-center space-x-1 w-full sm:w-auto"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copiar</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMapToDelete({ id: map.id, name: map.name })}
                      className="flex items-center space-x-1 w-full sm:w-auto text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Deletar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!mapToDelete} onOpenChange={(open) => !open && setMapToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar mapa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o mapa "{mapToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mapToDelete && deleteMutation.mutate(mapToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};