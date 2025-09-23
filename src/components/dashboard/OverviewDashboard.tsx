import React, { useState } from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NumerologyCircle } from './NumerologyCircle';
import { InteractiveNumerologyCard } from './InteractiveNumerologyCard';
import { StatsOverview } from './StatsOverview';
import { 
  Heart, 
  Eye, 
  Star, 
  Target, 
  Compass, 
  Brain,
  Calendar,
  Clock,
  Sun,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface OverviewDashboardProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onBookmark: (section: string) => void;
  bookmarkedSections: string[];
}

export function OverviewDashboard({ 
  mapa, 
  name, 
  birthDate, 
  viewMode, 
  searchQuery,
  onBookmark,
  bookmarkedSections 
}: OverviewDashboardProps) {
  const [selectedNumber, setSelectedNumber] = useState<{number: number, category: string} | null>(null);

  const coreNumbers = [
    {
      id: 'motivacao',
      title: "Motivação",
      value: mapa.motivacao,
      description: "O que te motiva internamente",
      categoria: "motivacao",
      icon: <Heart size={20} />,
      priority: 'high' as const
    },
    {
      id: 'impressao',
      title: "Impressão", 
      value: mapa.impressao,
      description: "Como os outros te veem",
      categoria: "impressao",
      icon: <Eye size={20} />,
      priority: 'high' as const
    },
    {
      id: 'expressao',
      title: "Expressão",
      value: mapa.expressao, 
      description: "Sua personalidade total",
      categoria: "expressao",
      icon: <Star size={20} />,
      priority: 'high' as const
    },
    {
      id: 'destino',
      title: "Destino",
      value: mapa.destino,
      description: "Seu caminho de vida",
      categoria: "destino",
      icon: <Target size={20} />,
      priority: 'high' as const
    },
    {
      id: 'missao',
      title: "Missão",
      value: mapa.missao,
      description: "Sua missão nesta vida",
      categoria: "missao",
      icon: <Compass size={20} />,
      priority: 'high' as const
    },
    {
      id: 'psiquico',
      title: "Número Psíquico",
      value: mapa.numeroPsiquico,
      description: "Sua natureza psíquica",
      categoria: "numero_psiquico",
      icon: <Brain size={20} />,
      priority: 'medium' as const
    }
  ];

  const personalNumbers = [
    {
      id: 'ano-pessoal',
      title: "Ano Pessoal",
      value: mapa.anoPersonal,
      description: "Energia do ano atual",
      categoria: "ano_pessoal",
      icon: <Calendar size={20} />,
      priority: 'medium'
    },
    {
      id: 'mes-pessoal',
      title: "Mês Pessoal", 
      value: mapa.mesPersonal,
      description: "Energia do mês atual",
      categoria: "mes_pessoal",
      icon: <Clock size={20} />,
      priority: 'medium'
    },
    {
      id: 'dia-pessoal',
      title: "Dia Pessoal",
      value: mapa.diaPersonal,
      description: "Energia do dia atual", 
      categoria: "dia_pessoal",
      icon: <Sun size={20} />,
      priority: 'low'
    }
  ];

  const allNumbers = [...coreNumbers, ...personalNumbers];

  const filteredNumbers = allNumbers.filter(number => 
    searchQuery === '' || 
    number.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    number.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNumberClick = (number: number, category: string) => {
    setSelectedNumber({ number, category });
  };

  const isBookmarked = (id: string) => bookmarkedSections.includes(id);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <StatsOverview mapa={mapa} />

      {/* Central Numerology Circle */}
      <Card className="bg-gradient-mystical border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-cosmic bg-clip-text text-transparent">
            Círculo Numerológico Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NumerologyCircle 
            mapa={mapa} 
            onNumberClick={handleNumberClick}
          />
        </CardContent>
      </Card>

      {/* Core Numbers Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Star className="mr-2 h-6 w-6 text-primary" />
            Números Principais
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            {coreNumbers.length} números
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {coreNumbers.filter(number => 
            searchQuery === '' || 
            number.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            number.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(number => (
            <div key={number.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(number.id)}
              >
                {isBookmarked(number.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <InteractiveNumerologyCard 
                {...number}
                viewMode={viewMode}
                isHighlighted={selectedNumber?.number === number.value && selectedNumber?.category === number.categoria}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Personal Cycles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-secondary" />
            Ciclos Pessoais Atuais
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            Hoje: {new Date().toLocaleDateString('pt-BR')}
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {personalNumbers.filter(number => 
            searchQuery === '' || 
            number.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            number.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(number => (
            <div key={number.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(number.id)}
              >
                {isBookmarked(number.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <InteractiveNumerologyCard 
                {...number}
                viewMode={viewMode}
                isHighlighted={selectedNumber?.number === number.value && selectedNumber?.category === number.categoria}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Insights Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">
                {allNumbers.filter(n => n.value === 11 || n.value === 22 || n.value === 33).length}
              </div>
              <div className="text-sm text-muted-foreground">Números Mestres</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-secondary mb-2">
                {allNumbers.filter(n => n.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Aspectos Principais</div>
            </div>
            
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {bookmarkedSections.length}
              </div>
              <div className="text-sm text-muted-foreground">Seções Favoritadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}