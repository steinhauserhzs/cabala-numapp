import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Eye, 
  Edit3, 
  Save, 
  X, 
  FileText, 
  ChevronDown, 
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
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

interface SimplifiedMobileEditorProps {
  currentContent: any;
  onSave: () => void;
}

export function SimplifiedMobileEditor({ currentContent, onSave }: SimplifiedMobileEditorProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [parsedContent, setParsedContent] = useState<ContentData>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);

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

    setSaving(true);
    try {
      const { error } = await supabase
        .from('conteudos_numerologia')
        .update({ 
          conteudo: parsedContent 
        })
        .eq('id', currentContent.id);

      if (error) throw error;

      toast({
        title: "✅ Salvo com sucesso!",
        description: "As alterações foram aplicadas.",
      });

      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "❌ Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um conteúdo para editar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {currentContent.topico.replace(/_/g, ' #')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing ? '✏️ Editando' : '👁️ Visualizando'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setParsedContent(parseContent(currentContent.conteudo));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Content Area */}
      {isMobile ? (
        // Mobile: Tabs Layout
        <Tabs defaultValue={isEditing ? "edit" : "preview"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" disabled={isEditing}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={!isEditing}>
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 p-1">
                {parsedContent.title && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{parsedContent.title}</h4>
                  </div>
                )}
                
                {parsedContent.content && (
                  <div>
                    <p className="whitespace-pre-wrap leading-relaxed">{parsedContent.content}</p>
                  </div>
                )}
                
                {parsedContent.description && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">📝 Descrição:</h5>
                    <p className="text-sm">{parsedContent.description}</p>
                  </div>
                )}
                
                {parsedContent.characteristics && parsedContent.characteristics.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">✨ Características:</h5>
                    <ul className="space-y-1">
                      {parsedContent.characteristics.map((char, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parsedContent.positive_aspects && parsedContent.positive_aspects.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">➕ Aspectos Positivos:</h5>
                    <ul className="space-y-1">
                      {parsedContent.positive_aspects.map((aspect, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{aspect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parsedContent.challenges && parsedContent.challenges.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">⚠️ Desafios:</h5>
                    <ul className="space-y-1">
                      {parsedContent.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parsedContent.advice && (
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                    <h5 className="font-medium mb-2 text-sm">💡 Conselho:</h5>
                    <p className="text-sm italic">{parsedContent.advice}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {/* Essential Fields */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      📝 Título
                    </Label>
                    <Input
                      id="title"
                      value={parsedContent.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Digite o título..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-sm font-medium">
                      📄 Conteúdo Principal
                    </Label>
                    <Textarea
                      id="content"
                      value={parsedContent.content || ''}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="Digite o conteúdo principal..."
                      className="mt-1 min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                {/* Advanced Section */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>⚙️ Campos Avançados</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        📋 Descrição
                      </Label>
                      <Textarea
                        id="description"
                        value={parsedContent.description || ''}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Digite uma descrição..."
                        className="mt-1 min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Array Fields with simpler interface */}
                    {['characteristics', 'positive_aspects', 'challenges'].map((field) => (
                      <ArrayFieldEditor
                        key={field}
                        label={
                          field === 'characteristics' ? '✨ Características' :
                          field === 'positive_aspects' ? '➕ Aspectos Positivos' :
                          '⚠️ Desafios'
                        }
                        items={parsedContent[field] || []}
                        onAdd={(value) => addToArrayField(field, value)}
                        onRemove={(index) => removeFromArrayField(field, index)}
                        placeholder={`Nova ${field === 'characteristics' ? 'característica' : 
                                   field === 'positive_aspects' ? 'aspecto positivo' : 'desafio'}...`}
                      />
                    ))}

                    <div>
                      <Label htmlFor="advice" className="text-sm font-medium">
                        💡 Conselho
                      </Label>
                      <Textarea
                        id="advice"
                        value={parsedContent.advice || ''}
                        onChange={(e) => updateField('advice', e.target.value)}
                        placeholder="Digite um conselho..."
                        className="mt-1 min-h-[80px] resize-none"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        // Desktop: Side by side layout
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✏️ Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  <div>
                    <Label htmlFor="title-desktop" className="text-sm font-medium">
                      📝 Título
                    </Label>
                    <Input
                      id="title-desktop"
                      value={parsedContent.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Digite o título..."
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content-desktop" className="text-sm font-medium">
                      📄 Conteúdo Principal
                    </Label>
                    <Textarea
                      id="content-desktop"
                      value={parsedContent.content || ''}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="Digite o conteúdo principal..."
                      className="mt-1 min-h-[120px]"
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span>⚙️ Campos Avançados</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="description-desktop" className="text-sm font-medium">
                            📋 Descrição
                          </Label>
                          <Textarea
                            id="description-desktop"
                            value={parsedContent.description || ''}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Digite uma descrição..."
                            className="mt-1 min-h-[80px]"
                          />
                        </div>

                        {['characteristics', 'positive_aspects', 'challenges'].map((field) => (
                          <ArrayFieldEditor
                            key={field}
                            label={
                              field === 'characteristics' ? '✨ Características' :
                              field === 'positive_aspects' ? '➕ Aspectos Positivos' :
                              '⚠️ Desafios'
                            }
                            items={parsedContent[field] || []}
                            onAdd={(value) => addToArrayField(field, value)}
                            onRemove={(index) => removeFromArrayField(field, index)}
                            placeholder={`Nova ${field === 'characteristics' ? 'característica' : 
                                       field === 'positive_aspects' ? 'aspecto positivo' : 'desafio'}...`}
                          />
                        ))}

                        <div>
                          <Label htmlFor="advice-desktop" className="text-sm font-medium">
                            💡 Conselho
                          </Label>
                          <Textarea
                            id="advice-desktop"
                            value={parsedContent.advice || ''}
                            onChange={(e) => updateField('advice', e.target.value)}
                            placeholder="Digite um conselho..."
                            className="mt-1 min-h-[80px]"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">👁️ Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {parsedContent.title && (
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{parsedContent.title}</h4>
                    </div>
                  )}
                  
                  {parsedContent.content && (
                    <div>
                      <p className="whitespace-pre-wrap leading-relaxed">{parsedContent.content}</p>
                    </div>
                  )}
                  
                  {parsedContent.description && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">📝 Descrição:</h5>
                      <p className="text-sm">{parsedContent.description}</p>
                    </div>
                  )}
                  
                  {parsedContent.characteristics && parsedContent.characteristics.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">✨ Características:</h5>
                      <ul className="space-y-1">
                        {parsedContent.characteristics.map((char, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {parsedContent.positive_aspects && parsedContent.positive_aspects.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">➕ Aspectos Positivos:</h5>
                      <ul className="space-y-1">
                        {parsedContent.positive_aspects.map((aspect, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{aspect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {parsedContent.challenges && parsedContent.challenges.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">⚠️ Desafios:</h5>
                      <ul className="space-y-1">
                        {parsedContent.challenges.map((challenge, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {parsedContent.advice && (
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 text-sm">💡 Conselho:</h5>
                      <p className="text-sm italic">{parsedContent.advice}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper component for array field editing
interface ArrayFieldEditorProps {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}

function ArrayFieldEditor({ label, items, onAdd, onRemove, placeholder }: ArrayFieldEditorProps) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd(newValue);
      setNewValue('');
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input value={item} disabled className="text-sm" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input 
            placeholder={placeholder} 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="text-sm"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAdd}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}