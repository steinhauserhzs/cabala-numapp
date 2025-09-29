import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, Edit, Save, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractText } from '@/services/content';
import type { NumerologyContent } from '@/hooks/useNumerologyContent';

interface SimpleTextEditorProps {
  currentContent: NumerologyContent;
  onSave: () => void;
}

export function SimpleTextEditor({ currentContent, onSave }: SimpleTextEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [textContent, setTextContent] = useState('');

  // Extract text content for editing
  useEffect(() => {
    if (currentContent?.conteudo) {
      const extracted = extractText(currentContent.conteudo);
      setTextContent(extracted);
    }
  }, [currentContent]);

  const handleSave = async () => {
    if (!currentContent) return;

    try {
      // Save as simple string
      const { error } = await supabase
        .from('conteudos_numerologia')
        .update({ 
          conteudo: textContent 
        })
        .eq('id', currentContent.id);

      if (error) throw error;

      toast({
        title: "Conteúdo salvo!",
        description: "O texto foi atualizado com sucesso.",
      });

      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  if (!currentContent) {
    return (
      <div className="h-[500px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um conteúdo para visualizar e editar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {currentContent.topico.replace(/_/g, ' ')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing ? 'Editando texto' : 'Visualizando conteúdo'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Normal' : 'Preview'}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </>
          )}
          
          {isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  const extracted = extractText(currentContent.conteudo);
                  setTextContent(extracted);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Content display/editing area */}
      <ScrollArea className="h-[500px]">
        {isEditing ? (
          // Edit mode - simple textarea
          <div className="p-4">
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Digite o conteúdo aqui..."
              className="min-h-[450px] resize-none"
            />
          </div>
        ) : isPreview ? (
          // Preview mode - formatted text
          <div className="p-4 prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap leading-relaxed">
              {textContent}
            </div>
          </div>
        ) : (
          // Normal view mode - clean text display
          <div className="p-4">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">
              {textContent}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}