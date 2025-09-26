import { useState, useEffect, useMemo } from 'react';
import { useNumerologyContent } from '@/hooks/useNumerologyContent';
import { useContentCreation } from '@/hooks/useContentCreation';
import { TopicCard } from '@/components/TopicCard';
import { UncategorizedTopicsPanel } from '@/components/UncategorizedTopicsPanel';
import { ContentCreationWizard } from '@/components/ContentCreationWizard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Grid3X3, BookOpen, RefreshCw, List, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { NumerologyContent } from '@/hooks/useNumerologyContent';

interface ContentCategory {
  name: string;
  topics: string[];
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function BibliotecaConhecimento() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedContent, setSelectedContent] = useState<NumerologyContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uncategorizedTopics, setUncategorizedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { data: allContent, isLoading, refetch } = useNumerologyContent();
  const { createContent } = useContentCreation();

  // Filter content based on search query
  const filteredContent = useMemo(() => {
    if (!allContent || !searchQuery.trim()) return allContent;
    
    return allContent.filter(content => 
      content.topico.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allContent, searchQuery]);

  // Debounced search
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const categories: ContentCategory[] = [
    {
      name: 'Números Pessoais',
      topics: ['motivacao', 'expressao', 'impressao', 'destino', 'missao', 'psiquico', 'numero_psiquico', 'resposta_subconsciente'],
      description: 'Números fundamentais da personalidade',
      icon: <Grid3X3 className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      name: 'Aspectos Cármicos',
      topics: ['licoes_carmicas', 'dividas_carmicas', 'tendencias_ocultas'],
      description: 'Lições e padrões espirituais',
      icon: <RefreshCw className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    },
    {
      name: 'Elementos Místicos',
      topics: ['anjo', 'seu_anjo', 'anjo_guarda', 'cores_favoraveis', 'pedras_favoraveis', 'incensos', 'metais', 'perfumes'],
      description: 'Anjos, cores, pedras e elementos de apoio',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20'
    },
    {
      name: 'Ciclos Temporais',
      topics: ['ano_pessoal', 'mes_pessoal', 'dia_pessoal', 'ciclo_vida', 'ciclos_de_vida', 'momentos_decisivos'],
      description: 'Períodos e fases da vida',
      icon: <RefreshCw className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
    },
    {
      name: 'Desafios e Obstáculos',
      topics: ['desafio_principal', 'primeiro_desafio', 'segundo_desafio', 'terceiro_desafio', 'quarto_desafio'],
      description: 'Obstáculos e pontos de transformação',
      icon: <List className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
    },
    {
      name: 'Arcanos e Símbolos',
      topics: ['arcano'],
      description: 'Significados dos arcanos e símbolos místicos',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20'
    },
    {
      name: 'Áreas de Atuação',
      topics: ['areas_de_atuacao'],
      description: 'Campos profissionais e vocacionais',
      icon: <Eye className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20'
    },
    {
      name: 'Análises Especiais',
      topics: ['harmonia_conjugal', 'correcao_assinatura', 'analise_endereco', 'analise_placa', 'analise_telefone'],
      description: 'Análises específicas para diferentes aspectos da vida',
      icon: <Eye className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20'
    }
  ];

  useEffect(() => {
    if (allContent) {
      const categorizedTopics = new Set<string>();
      categories.forEach(category => {
        category.topics.forEach(topic => categorizedTopics.add(topic));
      });

      const uncategorized = allContent
        .map(content => content.topico)
        .filter(topic => !categorizedTopics.has(topic))
        .filter((topic, index, self) => self.indexOf(topic) === index);

      setUncategorizedTopics(uncategorized);
    }
  }, [allContent]);

  const handleContentCreated = () => {
    refetch();
    setShowWizard(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Biblioteca de Conhecimento</h1>
            <p className="text-muted-foreground">
              Gerencie todos os conteúdos numerológicos do sistema
            </p>
          </div>
          
          <Button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Conteúdo
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por tópico, número ou categoria..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando conteúdos...</p>
        </div>
      ) : searchQuery ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              Resultados da busca "{searchQuery}"
            </h2>
            <Badge variant="secondary">
              {filteredContent?.length || 0} resultado(s)
            </Badge>
          </div>
          
          {filteredContent && filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContent.map((content) => (
                <TopicCard
                  key={`${content.topico}-${content.id}`}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum conteúdo encontrado para "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryContent = allContent?.filter(content => 
              category.topics.includes(content.topico)
            ) || [];

            if (categoryContent.length === 0) return null;

            return (
              <div key={category.name} className={`rounded-lg p-6 ${category.color} border transition-all duration-200 hover:shadow-md`}>
                <div className="flex items-center gap-3 mb-4">
                  {category.icon}
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {categoryContent.map((content) => (
                    <TopicCard
                      key={`${content.topico}-${content.id}`}
                      content={content}
                      onClick={() => setSelectedContent(content)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Uncategorized Topics Panel */}
      {uncategorizedTopics.length > 0 && !searchQuery && (
        <div className="rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border">
          <h3 className="font-semibold text-foreground mb-4">Tópicos Não Categorizados</h3>
          <div className="space-y-2">
            {uncategorizedTopics.map((topic) => {
              const topicContent = allContent?.filter(content => content.topico === topic) || [];
              return topicContent.map((content) => (
                <TopicCard
                  key={`${content.topico}-${content.id}`}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ));
            })}
          </div>
        </div>
      )}

      {/* Content Creation Wizard */}
      {showWizard && (
        <ContentCreationWizard
          onClose={() => setShowWizard(false)}
          onContentCreated={handleContentCreated}
          categories={categories}
        />
      )}

      {/* Content Details Dialog */}
      {selectedContent && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedContent.topico.replace(/_/g, ' ')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tópico:</span> {selectedContent.topico}
                </div>
                <div>
                  <span className="font-medium">Categoria:</span> {selectedContent.categoria || 'Não categorizado'}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {selectedContent.id}
                </div>
              </div>
              <div>
                <span className="font-medium">Conteúdo:</span>
                <div className="mt-2 p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedContent.conteudo, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}