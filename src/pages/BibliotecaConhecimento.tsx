import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Grid3X3,
  List,
  Eye,
  Edit3,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuth, useUserRole } from '@/hooks/useAuth';
import { useNumerologyContent } from '@/hooks/useNumerologyContent';
import { supabase } from '@/integrations/supabase/client';
import { SimplifiedMobileEditor } from '@/components/SimplifiedMobileEditor';

interface ContentCategory {
  name: string;
  topics: string[];
  description: string;
  icon: React.ReactNode;
  color: string;
}

const categories: ContentCategory[] = [
  {
    name: 'Números Pessoais',
    topics: ['motivacao', 'expressao', 'impressao', 'destino', 'missao', 'psiquico', 'resposta-subconsciente'],
    description: 'Números fundamentais da personalidade',
    icon: <Grid3X3 className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
  },
  {
    name: 'Aspectos Cármicos',
    topics: ['licoes-carmicas', 'dividas-carmicas', 'tendencias-ocultas'],
    description: 'Lições e padrões espirituais',
    icon: <RefreshCw className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
  },
  {
    name: 'Elementos Místicos',
    topics: ['anjo', 'cores-favoraveis', 'pedras', 'incensos', 'metais', 'perfumes'],
    description: 'Anjos, cores, pedras e elementos de apoio',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20'
  },
  {
    name: 'Ciclos Temporais',
    topics: ['ano-pessoal', 'mes-pessoal', 'dia-pessoal', 'ciclo-vida'],
    description: 'Períodos e fases da vida',
    icon: <RefreshCw className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
  },
  {
    name: 'Desafios',
    topics: ['desafios', 'momentos-decisivos'],
    description: 'Obstáculos e pontos de transformação',
    icon: <List className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
  },
  {
    name: 'Análises Especiais',
    topics: ['harmonia-conjugal', 'correcao-assinatura', 'endereco', 'placa', 'telefone', 'areas-atuacao'],
    description: 'Análises específicas para diferentes aspectos da vida',
    icon: <Eye className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20'
  }
];

export default function BibliotecaConhecimento() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { data: allContent, isLoading, refetch } = useNumerologyContent();
  
  // State for 3-step wizard navigation
  const [currentStep, setCurrentStep] = useState<'categories' | 'topics' | 'editor'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [removingDuplicates, setRemovingDuplicates] = useState(false);

  // Remove duplicates function
  const removeDuplicates = async () => {
    setRemovingDuplicates(true);
    try {
      // Get all content
      const { data: content, error } = await supabase
        .from('conteudos_numerologia')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      const seen = new Set();
      const duplicateIds = [];

      content?.forEach(item => {
        if (seen.has(item.topico)) {
          duplicateIds.push(item.id);
        } else {
          seen.add(item.topico);
        }
      });

      if (duplicateIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('conteudos_numerologia')
          .delete()
          .in('id', duplicateIds);

        if (deleteError) throw deleteError;

        toast({
          title: "Duplicatas removidas!",
          description: `${duplicateIds.length} duplicatas foram removidas com sucesso.`,
        });
        
        refetch();
      } else {
        toast({
          title: "Nenhuma duplicata encontrada",
          description: "Todos os conteúdos são únicos.",
        });
      }
    } catch (error) {
      console.error('Erro ao remover duplicatas:', error);
      toast({
        title: "Erro ao remover duplicatas",
        description: "Não foi possível remover as duplicatas.",
        variant: "destructive",
      });
    } finally {
      setRemovingDuplicates(false);
    }
  };

  // Filter content based on selected category and search
  const filteredContent = allContent?.filter(item => {
    if (selectedCategory) {
      if (!selectedCategory.topics.some(topic => item.topico.includes(topic))) {
        return false;
      }
    }
    
    if (searchTerm) {
      return item.topico.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  }) || [];

  // Group content by topic base
  const groupedTopics = filteredContent.reduce((acc, item) => {
    const topicBase = item.topico.replace(/_\d+$/, '');
    if (!acc[topicBase]) {
      acc[topicBase] = [];
    }
    acc[topicBase].push(item);
    return acc;
  }, {} as Record<string, typeof filteredContent>);

  // Get current content
  const currentContent = selectedTopic && selectedNumber 
    ? allContent?.find(item => item.topico === `${selectedTopic}_${selectedNumber}`)
    : null;

  const handleContentSave = () => {
    refetch();
  };

  const getTopicNumbers = (topicBase: string) => {
    return groupedTopics[topicBase]?.map(item => {
      const match = item.topico.match(/_(\d+)$/);
      return match ? match[1] : '01';
    }).sort() || [];
  };

  const toggleTopic = (topicBase: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicBase)) {
      newExpanded.delete(topicBase);
    } else {
      newExpanded.add(topicBase);
    }
    setExpandedTopics(newExpanded);
  };

  const navigateToEditor = (topic: string, number: string) => {
    setSelectedTopic(topic);
    setSelectedNumber(number);
    setCurrentStep('editor');
  };

  const goBack = () => {
    if (currentStep === 'editor') {
      setCurrentStep('topics');
    } else if (currentStep === 'topics') {
      setCurrentStep('categories');
      setSelectedCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mystical flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mystical">
      {/* Mobile-First Header */}
      <div className="bg-background/95 backdrop-blur border-b border-border sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {currentStep !== 'categories' ? (
                <Button variant="ghost" size="sm" onClick={goBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Biblioteca</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {allContent?.length || 0}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={removeDuplicates}
                disabled={removingDuplicates}
              >
                {removingDuplicates ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className={currentStep === 'categories' ? 'text-primary font-medium' : ''}>
              Categorias
            </span>
            {selectedCategory && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className={currentStep === 'topics' ? 'text-primary font-medium' : ''}>
                  {selectedCategory.name}
                </span>
              </>
            )}
            {selectedTopic && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className={currentStep === 'editor' ? 'text-primary font-medium' : ''}>
                  {selectedTopic.replace(/-/g, ' ')} #{selectedNumber}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Step 1: Categories */}
        {currentStep === 'categories' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories
                .filter(category => 
                  !searchTerm || 
                  category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  category.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                <Card 
                  key={category.name} 
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${category.color}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentStep('topics');
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="text-xs">
                      {category.topics.length} tópicos
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Topics List */}
        {currentStep === 'topics' && selectedCategory && (
          <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {Object.keys(groupedTopics).map((topicBase) => (
                  <Card key={topicBase}>
                    <Collapsible
                      open={expandedTopics.has(topicBase)}
                      onOpenChange={() => toggleTopic(topicBase)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base capitalize">
                                {topicBase.replace(/-/g, ' ')}
                              </CardTitle>
                              <CardDescription>
                                {groupedTopics[topicBase].length} números disponíveis
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                {groupedTopics[topicBase].length}
                              </Badge>
                              <ChevronDown className={`h-4 w-4 transition-transform ${
                                expandedTopics.has(topicBase) ? 'rotate-180' : ''
                              }`} />
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {getTopicNumbers(topicBase).map((number) => (
                              <Button
                                key={number}
                                variant="outline"
                                size="sm"
                                className="h-auto py-3 flex flex-col items-center space-y-1"
                                onClick={() => navigateToEditor(topicBase, number)}
                              >
                                <span className="text-lg font-bold">#{number}</span>
                                <span className="text-xs text-muted-foreground">
                                  Editar
                                </span>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Step 3: Editor */}
        {currentStep === 'editor' && (
          <SimplifiedMobileEditor 
            currentContent={currentContent}
            onSave={handleContentSave}
          />
        )}
      </div>
    </div>
  );
}