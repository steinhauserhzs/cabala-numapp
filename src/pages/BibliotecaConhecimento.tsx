import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Search, Edit, Save, X, Eye, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNumerologyContent } from '@/hooks/useNumerologyContent';
import { supabase } from '@/integrations/supabase/client';

interface ContentCategory {
  name: string;
  topics: string[];
  description: string;
}

const categories: ContentCategory[] = [
  {
    name: 'Números Pessoais',
    topics: ['motivacao', 'expressao', 'impressao', 'destino', 'missao', 'psiquico', 'resposta-subconsciente'],
    description: 'Números fundamentais da personalidade'
  },
  {
    name: 'Aspectos Cármicos',
    topics: ['licoes-carmicas', 'dividas-carmicas', 'tendencias-ocultas'],
    description: 'Lições e padrões espirituais'
  },
  {
    name: 'Elementos Místicos',
    topics: ['anjo', 'cores-favoraveis', 'pedras', 'incensos', 'metais', 'perfumes'],
    description: 'Anjos, cores, pedras e elementos de apoio'
  },
  {
    name: 'Ciclos Temporais',
    topics: ['ano-pessoal', 'mes-pessoal', 'dia-pessoal', 'ciclo-vida'],
    description: 'Períodos e fases da vida'
  },
  {
    name: 'Desafios',
    topics: ['desafios', 'momentos-decisivos'],
    description: 'Obstáculos e pontos de transformação'
  },
  {
    name: 'Análises Especiais',
    topics: ['harmonia-conjugal', 'correcao-assinatura', 'endereco', 'placa', 'telefone', 'areas-atuacao'],
    description: 'Análises específicas para diferentes aspectos da vida'
  }
];

export default function BibliotecaConhecimento() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: allContent, isLoading, refetch } = useNumerologyContent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Filtrar conteúdo por categoria e busca
  const filteredContent = allContent?.filter(item => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.name === selectedCategory);
      if (category && !category.topics.some(topic => item.topico.includes(topic))) {
        return false;
      }
    }
    
    if (searchTerm) {
      return item.topico.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  }) || [];

  // Agrupar por tópicos
  const groupedTopics = filteredContent.reduce((acc, item) => {
    const topicBase = item.topico.replace(/_\d+$/, '');
    if (!acc[topicBase]) {
      acc[topicBase] = [];
    }
    acc[topicBase].push(item);
    return acc;
  }, {} as Record<string, typeof filteredContent>);

  // Selecionar conteúdo atual
  const currentContent = selectedTopic && selectedNumber 
    ? allContent?.find(item => item.topico === `${selectedTopic}_${selectedNumber}`)
    : null;

  const handleEdit = () => {
    if (currentContent) {
      setEditingContent(typeof currentContent.conteudo === 'string' 
        ? currentContent.conteudo 
        : JSON.stringify(currentContent.conteudo, null, 2)
      );
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!currentContent || !user) return;

    try {
      const { error } = await supabase
        .from('conteudos_numerologia')
        .update({ 
          conteudo: editingContent 
        })
        .eq('id', currentContent.id);

      if (error) throw error;

      toast({
        title: "Conteúdo salvo com sucesso!",
        description: "As alterações foram aplicadas permanentemente.",
      });

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  const getTopicNumbers = (topicBase: string) => {
    return groupedTopics[topicBase]?.map(item => {
      const match = item.topico.match(/_(\d+)$/);
      return match ? match[1] : '01';
    }).sort() || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mystical flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mystical">
      {/* Header */}
      <div className="bg-background/95 border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Biblioteca de Conhecimento
              </h1>
              <p className="text-muted-foreground">
                Gerencie e edite o conteúdo das interpretações numerológicas
              </p>
            </div>
          </div>
          
          <Badge variant="secondary">
            {allContent?.length || 0} conteúdos
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Navegação */}
          <div className="space-y-4">
            {/* Busca */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Buscar Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Todas as Categorias
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Tópicos */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Tópicos {selectedCategory && `- ${selectedCategory}`}
                </CardTitle>
                <CardDescription>
                  {Object.keys(groupedTopics).length} tópicos encontrados
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {Object.keys(groupedTopics).map((topicBase) => (
                      <div key={topicBase} className="space-y-1">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          onClick={() => {
                            if (selectedTopic === topicBase) {
                              setSelectedTopic(null);
                              setSelectedNumber(null);
                            } else {
                              setSelectedTopic(topicBase);
                              setSelectedNumber(getTopicNumbers(topicBase)[0]);
                            }
                          }}
                        >
                          <span className="capitalize">
                            {topicBase.replace(/-/g, ' ')}
                          </span>
                          <Badge variant="secondary">
                            {groupedTopics[topicBase].length}
                          </Badge>
                        </Button>
                        
                        {selectedTopic === topicBase && (
                          <div className="ml-4 space-y-1">
                            {getTopicNumbers(topicBase).map((number) => (
                              <Button
                                key={number}
                                variant={selectedNumber === number ? "default" : "ghost"}
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => setSelectedNumber(number)}
                              >
                                Número {number}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Editor de Conteúdo */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">
                      {currentContent ? `${selectedTopic}_${selectedNumber}` : 'Selecione um conteúdo'}
                    </CardTitle>
                    <CardDescription>
                      {currentContent ? 'Edite o conteúdo abaixo' : 'Escolha um tópico na lista ao lado'}
                    </CardDescription>
                  </div>
                  
                  {currentContent && (
                    <div className="flex space-x-2">
                      {!isEditing && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {isPreview ? 'Fonte' : 'Preview'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleEdit}
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
                            onClick={handleCancel}
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
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {currentContent ? (
                  <div className="h-[500px]">
                    {isEditing ? (
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="h-full resize-none font-mono text-sm"
                        placeholder="Digite o conteúdo aqui..."
                      />
                    ) : (
                      <ScrollArea className="h-full">
                        <div className="prose max-w-none">
                          {isPreview ? (
                            <div className="whitespace-pre-wrap">
                              {typeof currentContent.conteudo === 'string' 
                                ? currentContent.conteudo 
                                : JSON.stringify(currentContent.conteudo, null, 2)
                              }
                            </div>
                          ) : (
                            <pre className="text-sm bg-muted/50 p-4 rounded-lg overflow-auto">
                              {typeof currentContent.conteudo === 'string' 
                                ? currentContent.conteudo 
                                : JSON.stringify(currentContent.conteudo, null, 2)
                              }
                            </pre>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Selecione um conteúdo para visualizar e editar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}