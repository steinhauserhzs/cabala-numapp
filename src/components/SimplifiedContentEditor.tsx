import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, Edit, Save, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentData {
  title?: string;
  content?: string;
  description?: string;
  characteristics?: string[];
  positive_aspects?: string[];
  challenges?: string[];
  advice?: string;
  source?: string;
  topic?: string;
  number?: string;
  [key: string]: any;
}

interface SimplifiedContentEditorProps {
  currentContent: any;
  onSave: () => void;
}

export function SimplifiedContentEditor({ currentContent, onSave }: SimplifiedContentEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [parsedContent, setParsedContent] = useState<ContentData>({});

  // Parse JSON content into editable fields
  const parseContent = (content: any): ContentData => {
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch {
        return { content: content };
      }
    }
    
    if (typeof content === 'object' && content !== null) {
      return content;
    }
    
    return {};
  };

  useEffect(() => {
    if (currentContent?.conteudo) {
      setParsedContent(parseContent(currentContent.conteudo));
    }
  }, [currentContent]);

  const handleSave = async () => {
    if (!currentContent) return;

    try {
      const { error } = await supabase
        .from('conteudos_numerologia')
        .update({ 
          conteudo: parsedContent 
        })
        .eq('id', currentContent.id);

      if (error) throw error;

      toast({
        title: "Conteúdo salvo com sucesso!",
        description: "As alterações foram aplicadas.",
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

  const updateField = (field: string, value: string | string[]) => {
    setParsedContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArrayField = (field: string, value: string) => {
    if (!value.trim()) return;
    
    setParsedContent(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
  };

  const removeFromArrayField = (field: string, index: number) => {
    setParsedContent(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
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
            {currentContent.topico}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing ? 'Editando conteúdo' : 'Visualizando conteúdo'}
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
                {isPreview ? 'Editar' : 'Preview'}
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
                  setParsedContent(parseContent(currentContent.conteudo));
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
        {isPreview && !isEditing ? (
          // Preview mode - show formatted content
          <div className="space-y-4 p-4">
            {parsedContent.title && (
              <div>
                <h4 className="font-semibold text-lg">{parsedContent.title}</h4>
              </div>
            )}
            
            {parsedContent.content && (
              <div>
                <p className="whitespace-pre-wrap">{parsedContent.content}</p>
              </div>
            )}
            
            {parsedContent.description && (
              <div>
                <h5 className="font-medium mb-2">Descrição:</h5>
                <p className="text-muted-foreground">{parsedContent.description}</p>
              </div>
            )}
            
            {parsedContent.characteristics && parsedContent.characteristics.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Características:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {parsedContent.characteristics.map((char, index) => (
                    <li key={index} className="text-muted-foreground">{char}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {parsedContent.positive_aspects && parsedContent.positive_aspects.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Aspectos Positivos:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {parsedContent.positive_aspects.map((aspect, index) => (
                    <li key={index} className="text-green-600">{aspect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {parsedContent.challenges && parsedContent.challenges.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Desafios:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {parsedContent.challenges.map((challenge, index) => (
                    <li key={index} className="text-orange-600">{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {parsedContent.advice && (
              <div>
                <h5 className="font-medium mb-2">Conselho:</h5>
                <p className="text-blue-600 italic">{parsedContent.advice}</p>
              </div>
            )}
          </div>
        ) : isEditing ? (
          // Edit mode - show form fields
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={parsedContent.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Digite o título do conteúdo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo Principal</Label>
              <Textarea
                id="content"
                value={parsedContent.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Digite o conteúdo principal"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={parsedContent.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Digite uma descrição"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Características</Label>
              <div className="space-y-2">
                {(parsedContent.characteristics || []).map((char, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={char} 
                      onChange={(e) => {
                        const newChars = [...(parsedContent.characteristics || [])];
                        newChars[index] = e.target.value;
                        updateField('characteristics', newChars);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFromArrayField('characteristics', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nova característica" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArrayField('characteristics', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArrayField('characteristics', input.value);
                      input.value = '';
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aspectos Positivos</Label>
              <div className="space-y-2">
                {(parsedContent.positive_aspects || []).map((aspect, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={aspect} 
                      onChange={(e) => {
                        const newAspects = [...(parsedContent.positive_aspects || [])];
                        newAspects[index] = e.target.value;
                        updateField('positive_aspects', newAspects);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFromArrayField('positive_aspects', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Novo aspecto positivo" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArrayField('positive_aspects', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArrayField('positive_aspects', input.value);
                      input.value = '';
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Desafios</Label>
              <div className="space-y-2">
                {(parsedContent.challenges || []).map((challenge, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={challenge} 
                      onChange={(e) => {
                        const newChallenges = [...(parsedContent.challenges || [])];
                        newChallenges[index] = e.target.value;
                        updateField('challenges', newChallenges);
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFromArrayField('challenges', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Novo desafio" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArrayField('challenges', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addToArrayField('challenges', input.value);
                      input.value = '';
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advice">Conselho</Label>
              <Textarea
                id="advice"
                value={parsedContent.advice || ''}
                onChange={(e) => updateField('advice', e.target.value)}
                placeholder="Digite um conselho"
                className="min-h-[80px]"
              />
            </div>
          </div>
        ) : (
          // Default view mode - show raw JSON formatted
          <div className="p-4">
            <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
              {JSON.stringify(parsedContent, null, 2)}
            </pre>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}