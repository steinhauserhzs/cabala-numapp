import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { InteractiveNumerologyCard } from './InteractiveNumerologyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mountain, Clock, Target, Zap, Bookmark, BookmarkCheck } from 'lucide-react';

interface ChallengesMomentsTabProps {
  mapa: MapaNumerologico;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onBookmark: (section: string) => void;
  bookmarkedSections: string[];
}

export function ChallengesMomentsTab({ 
  mapa, 
  viewMode, 
  searchQuery,
  onBookmark,
  bookmarkedSections 
}: ChallengesMomentsTabProps) {
  const challenges = [
    {
      id: 'desafio-1',
      title: "1º Desafio",
      value: mapa.desafios.primeiro,
      description: "Desafio da juventude (0-35 anos)",
      categoria: "desafios",
      icon: <Mountain size={20} />,
      priority: 'high' as const,
      timeframe: 'Nascimento até 35 anos',
      phase: 'Formação'
    },
    {
      id: 'desafio-2',
      title: "2º Desafio",
      value: mapa.desafios.segundo,
      description: "Desafio da maturidade (30-50 anos)", 
      categoria: "desafios",
      icon: <Mountain size={20} />,
      priority: 'high' as const,
      timeframe: '30 até 50 anos',
      phase: 'Desenvolvimento'
    },
    {
      id: 'desafio-principal',
      title: "Desafio Principal",
      value: mapa.desafios.principal,
      description: "Desafio central de toda a vida",
      categoria: "desafios", 
      icon: <Target size={20} />,
      priority: 'high' as const,
      timeframe: 'Toda a vida',
      phase: 'Missão Central'
    }
  ];

  const decisiveMoments = [
    {
      id: 'momento-1',
      title: "1º Momento Decisivo",
      value: mapa.momentosDecisivos.primeiro,
      description: "Primeira grande decisão de vida",
      categoria: "momentos_decisivos",
      icon: <Clock size={20} />,
      priority: 'medium' as const,
      timeframe: 'Juventude',
      age: '28-35 anos'
    },
    {
      id: 'momento-2',
      title: "2º Momento Decisivo", 
      value: mapa.momentosDecisivos.segundo,
      description: "Definição da carreira e relacionamentos",
      categoria: "momentos_decisivos",
      icon: <Clock size={20} />,
      priority: 'medium' as const,
      timeframe: 'Início da maturidade',
      age: '36-43 anos'
    },
    {
      id: 'momento-3',
      title: "3º Momento Decisivo",
      value: mapa.momentosDecisivos.terceiro,
      description: "Consolidação e realização pessoal", 
      categoria: "momentos_decisivos",
      icon: <Clock size={20} />,
      priority: 'medium' as const,
      timeframe: 'Maturidade plena',
      age: '44-51 anos'
    },
    {
      id: 'momento-4',
      title: "4º Momento Decisivo",
      value: mapa.momentosDecisivos.quarto,
      description: "Sabedoria e legado",
      categoria: "momentos_decisivos", 
      icon: <Clock size={20} />,
      priority: 'medium' as const,
      timeframe: 'Sabedoria',
      age: '52+ anos'
    }
  ];

  const allItems = [...challenges, ...decisiveMoments];

  const filteredItems = allItems.filter(item => 
    searchQuery === '' || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ('phase' in item && item.phase?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isBookmarked = (id: string) => bookmarkedSections.includes(id);

  // Calculate life progress for demonstration
  const calculateLifeProgress = () => {
    const currentYear = new Date().getFullYear();
    const estimatedAge = currentYear - 1990; // Demo birth year
    
    const phases = [
      { name: '1º Desafio', start: 0, end: 35 },
      { name: '2º Desafio', start: 30, end: 50 },
      { name: 'Momentos Decisivos', start: 28, end: 60 }
    ];
    
    return phases.map(phase => ({
      ...phase,
      progress: Math.min(100, Math.max(0, ((estimatedAge - phase.start) / (phase.end - phase.start)) * 100)),
      isActive: estimatedAge >= phase.start && estimatedAge <= phase.end
    }));
  };

  const lifeProgress = calculateLifeProgress();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
          Desafios & Momentos Decisivos
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore os principais desafios da sua jornada e os momentos decisivos que moldam seu destino. 
          Cada obstáculo é uma oportunidade de crescimento e evolução.
        </p>
      </div>

      {/* Life Journey Progress */}
      <Card className="bg-gradient-mystical border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Jornada de Vida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {lifeProgress.map((phase, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{phase.name}</span>
                  <Badge variant={phase.isActive ? "default" : "secondary"} className="text-xs">
                    {phase.isActive ? "Ativo" : `${phase.start}-${phase.end} anos`}
                  </Badge>
                </div>
                <Progress value={phase.progress} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">
                  {Math.round(phase.progress)}% concluído
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30">
          <CardContent className="pt-6">
            <Mountain className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">3</div>
            <div className="text-sm text-muted-foreground">Desafios Principais</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">4</div>
            <div className="text-sm text-muted-foreground">Momentos Decisivos</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/30">
          <CardContent className="pt-6">
            <Target className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {mapa.desafios.principal}
            </div>
            <div className="text-sm text-muted-foreground">Desafio Central</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">∞</div>
            <div className="text-sm text-muted-foreground">Oportunidades</div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Mountain className="mr-2 h-6 w-6 text-red-600" />
            Desafios de Vida
          </h2>
          <Badge variant="destructive" className="px-3 py-1">
            Crescimento através de obstáculos
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {challenges.filter(challenge => 
            searchQuery === '' || 
            challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(challenge => (
            <div key={challenge.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(challenge.id)}
              >
                {isBookmarked(challenge.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <InteractiveNumerologyCard 
                {...challenge}
                viewMode={viewMode}
              />
              <div className="mt-2 text-center space-y-1">
                <Badge variant="outline" className="text-xs">
                  {challenge.timeframe}
                </Badge>
                {'phase' in challenge && (
                  <div className="text-xs text-muted-foreground">
                    {challenge.phase}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decisive Moments Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Clock className="mr-2 h-6 w-6 text-blue-600" />
            Momentos Decisivos
          </h2>
          <Badge variant="secondary" className="px-3 py-1">
            Pontos de virada da vida
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
            : 'space-y-4'
          }
        `}>
          {decisiveMoments.filter(moment => 
            searchQuery === '' || 
            moment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            moment.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(moment => (
            <div key={moment.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(moment.id)}
              >
                {isBookmarked(moment.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <InteractiveNumerologyCard 
                {...moment}
                viewMode={viewMode}
              />
              <div className="mt-2 text-center space-y-1">
                <Badge variant="outline" className="text-xs">
                  {moment.age}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {moment.timeframe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Guide */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-center">Guia de Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-red-600 flex items-center">
                <Mountain className="mr-2 h-4 w-4" />
                Como Lidar com Desafios
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Aceite o desafio como oportunidade de crescimento</li>
                <li>• Desenvolva paciência e persistência</li>
                <li>• Busque apoio quando necessário</li>
                <li>• Mantenha foco na lição por trás do obstáculo</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-blue-600 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Aproveitando Momentos Decisivos
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Esteja atento às oportunidades que surgem</li>
                <li>• Tome decisões alinhadas com seus valores</li>
                <li>• Confie na sua intuição e sabedoria interna</li>
                <li>• Documente suas escolhas para reflexão futura</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}