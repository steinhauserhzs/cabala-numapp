import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GuardianAngelCard } from '../GuardianAngelCard';
import { TopicCard } from '../TopicCard';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, Sparkles, BookOpen, Users, Palette } from 'lucide-react';

interface AdditionalInfoTabProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onBookmark: (section: string) => void;
  bookmarkedSections: string[];
}

export function AdditionalInfoTab({ 
  mapa, 
  name,
  birthDate,
  viewMode, 
  searchQuery,
  onBookmark,
  bookmarkedSections 
}: AdditionalInfoTabProps) {
  const isBookmarked = (id: string) => bookmarkedSections.includes(id);

  const additionalTopics = [
    'afinidade_cores',
    'compatibilidade_amorosa',
    'pedras_cristais',
    'orientacoes_gerais',
    'profissoes_recomendadas',
    'saude_bem_estar',
    'relacionamentos_familia'
  ];

  const filteredTopics = additionalTopics.filter(topic => 
    searchQuery === '' || 
    topic.toLowerCase().replace('_', ' ').includes(searchQuery.toLowerCase())
  );

  const getTopicInfo = (topic: string) => {
    const topicMap: Record<string, { title: string; description: string; icon: React.ReactNode; color: string }> = {
      'afinidade_cores': {
        title: 'Afinidade com Cores',
        description: 'Cores que harmonizam com sua energia',
        icon: <Palette className="h-5 w-5" />,
        color: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800/30'
      },
      'compatibilidade_amorosa': {
        title: 'Compatibilidade Amorosa',
        description: 'Relacionamentos e parcerias ideais',
        icon: <Users className="h-5 w-5" />,
        color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30'
      },
      'pedras_cristais': {
        title: 'Pedras e Cristais',
        description: 'Gemas que amplificam sua energia',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30'
      },
      'orientacoes_gerais': {
        title: 'Orientações Gerais',
        description: 'Conselhos para seu desenvolvimento',
        icon: <BookOpen className="h-5 w-5" />,
        color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30'
      },
      'profissoes_recomendadas': {
        title: 'Profissões Recomendadas',
        description: 'Carreiras alinhadas com seu propósito',
        icon: <BookOpen className="h-5 w-5" />,
        color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30'
      },
      'saude_bem_estar': {
        title: 'Saúde e Bem-estar',
        description: 'Cuidados com corpo, mente e espírito',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30'
      },
      'relacionamentos_familia': {
        title: 'Relacionamentos e Família',
        description: 'Dinâmicas familiares e sociais',
        icon: <Users className="h-5 w-5" />,
        color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/30'
      }
    };

    return topicMap[topic] || {
      title: topic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: 'Informações complementares',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800/30'
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
          Informações Complementares
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore aspectos adicionais do seu mapa numerológico, incluindo seu anjo da guarda, 
          orientações específicas e tópicos complementares para uma compreensão mais profunda.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center bg-gradient-mystical">
          <CardContent className="pt-6">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{filteredTopics.length}</div>
            <div className="text-sm text-muted-foreground">Tópicos Disponíveis</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-muted/30">
          <CardContent className="pt-6">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-secondary">{bookmarkedSections.length}</div>
            <div className="text-sm text-muted-foreground">Seções Favoritadas</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-muted/30">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">∞</div>
            <div className="text-sm text-muted-foreground">Possibilidades</div>
          </CardContent>
        </Card>
      </div>

      {/* Guardian Angel Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-yellow-500" />
            Anjo da Guarda
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark('anjo-guarda')}
          >
            {isBookmarked('anjo-guarda') ? 
              <BookmarkCheck size={16} className="text-secondary" /> : 
              <Bookmark size={16} />
            }
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <GuardianAngelCard angelName={mapa.anjoGuarda} birthDate={birthDate} />
        </div>
      </div>

      {/* Additional Topics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Tópicos Complementares
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            {filteredTopics.length} tópicos
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {filteredTopics.map((topic, index) => {
            const topicInfo = getTopicInfo(topic);
            return (
              <div key={topic} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => onBookmark(topic)}
                >
                  {isBookmarked(topic) ? 
                    <BookmarkCheck size={16} className="text-secondary" /> : 
                    <Bookmark size={16} />
                  }
                </Button>

                <Card 
                  className={`
                    ${topicInfo.color} 
                    hover:shadow-lg transition-all duration-300 
                    ${viewMode === 'list' ? 'flex flex-row items-center' : 'h-full'}
                  `}
                >
                  {viewMode === 'list' ? (
                    <div className="flex items-center w-full p-4">
                      <div className="flex items-center space-x-4 min-w-[250px]">
                        <div className="p-3 rounded-full bg-background/50">
                          {topicInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{topicInfo.title}</h3>
                          <p className="text-sm text-muted-foreground">{topicInfo.description}</p>
                        </div>
                      </div>
                      <div className="flex-1 px-4">
                        <TopicCard 
                          topico={topic}
                          icon={topicInfo.icon}
                          title={topicInfo.title}
                          description={topicInfo.description}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardHeader className="text-center pb-3">
                        <div className="mx-auto p-3 rounded-full bg-background/50 w-fit mb-3">
                          {topicInfo.icon}
                        </div>
                        <CardTitle className="text-lg">{topicInfo.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{topicInfo.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <TopicCard 
                          topico={topic}
                          icon={topicInfo.icon}
                          title={topicInfo.title}
                          description={topicInfo.description}
                        />
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Summary */}
      <Card className="bg-gradient-mystical border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Resumo Pessoal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold">
              {name}
            </div>
            <div className="text-muted-foreground">
              Nascido em {birthDate.toLocaleDateString('pt-BR')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mapa.motivacao}</div>
                <div className="text-xs text-muted-foreground">Motivação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{mapa.destino}</div>
                <div className="text-xs text-muted-foreground">Destino</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mapa.missao}</div>
                <div className="text-xs text-muted-foreground">Missão</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{mapa.anoPersonal}</div>
                <div className="text-xs text-muted-foreground">Ano Pessoal</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              Anjo da Guarda: <span className="font-medium text-foreground">{mapa.anjoGuarda}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}