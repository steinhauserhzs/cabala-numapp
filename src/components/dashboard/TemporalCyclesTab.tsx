import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { InteractiveNumerologyCard } from './InteractiveNumerologyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Sun, RotateCcw, Bookmark, BookmarkCheck } from 'lucide-react';

interface TemporalCyclesTabProps {
  mapa: MapaNumerologico;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onBookmark: (section: string) => void;
  bookmarkedSections: string[];
}

export function TemporalCyclesTab({ 
  mapa, 
  viewMode, 
  searchQuery,
  onBookmark,
  bookmarkedSections 
}: TemporalCyclesTabProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const personalCycles = [
    {
      id: 'ano-pessoal',
      title: "Ano Pessoal",
      value: mapa.anoPersonal,
      description: `Energia dominante de ${currentYear}`,
      categoria: "ano_pessoal",
      icon: <Calendar size={20} />,
      priority: 'high' as const,
      timeframe: 'Válido durante todo o ano'
    },
    {
      id: 'mes-pessoal',
      title: "Mês Pessoal", 
      value: mapa.mesPersonal,
      description: `Energia do mês atual (${currentMonth}/${currentYear})`,
      categoria: "mes_pessoal",
      icon: <Clock size={20} />,
      priority: 'medium' as const,
      timeframe: 'Válido durante este mês'
    },
    {
      id: 'dia-pessoal',
      title: "Dia Pessoal",
      value: mapa.diaPersonal,
      description: `Energia de hoje (${currentDay}/${currentMonth}/${currentYear})`,
      categoria: "dia_pessoal",
      icon: <Sun size={20} />,
      priority: 'medium' as const,
      timeframe: 'Válido apenas hoje'
    }
  ];

  const lifeCycles = [
    {
      id: 'ciclo-1',
      title: "1º Ciclo de Vida",
      value: mapa.ciclosVida.primeiro,
      description: "Formação e juventude (0-28 anos)",
      categoria: "ciclos_vida",
      icon: <RotateCcw size={20} />,
      priority: 'medium' as const,
      timeframe: 'Nascimento até 28 anos'
    },
    {
      id: 'ciclo-2',
      title: "2º Ciclo de Vida", 
      value: mapa.ciclosVida.segundo,
      description: "Maturidade produtiva (29-56 anos)",
      categoria: "ciclos_vida",
      icon: <RotateCcw size={20} />,
      priority: 'medium' as const,
      timeframe: '29 até 56 anos'
    },
    {
      id: 'ciclo-3',
      title: "3º Ciclo de Vida",
      value: mapa.ciclosVida.terceiro,
      description: "Sabedoria e realização (57+ anos)", 
      categoria: "ciclos_vida",
      icon: <RotateCcw size={20} />,
      priority: 'medium' as const,
      timeframe: '57 anos em diante'
    }
  ];

  const allCycles = [...personalCycles, ...lifeCycles];

  const filteredCycles = allCycles.filter(cycle => 
    searchQuery === '' || 
    cycle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cycle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isBookmarked = (id: string) => bookmarkedSections.includes(id);

  // Calculate current life cycle progress
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getCurrentLifeCycle = (age: number) => {
    if (age <= 28) return { cycle: 1, progress: (age / 28) * 100 };
    if (age <= 56) return { cycle: 2, progress: ((age - 28) / 28) * 100 };
    return { cycle: 3, progress: Math.min(((age - 56) / 28) * 100, 100) };
  };

  // For demo purposes, using a typical birth year
  const estimatedAge = currentYear - 1990; // This would come from actual birth date
  const currentLifeCycle = getCurrentLifeCycle(estimatedAge);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
          Ciclos Temporais
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compreenda as energias que influenciam sua vida em diferentes períodos. 
          Cada ciclo traz oportunidades únicas de crescimento e realização.
        </p>
      </div>

      {/* Current Time Indicator */}
      <Card className="bg-gradient-mystical border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Estado Temporal Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {today.toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-muted-foreground">Data Atual</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {mapa.anoPersonal}
              </div>
              <div className="text-sm text-muted-foreground">Ano Pessoal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {mapa.mesPersonal}
              </div>
              <div className="text-sm text-muted-foreground">Mês Pessoal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {mapa.diaPersonal}
              </div>
              <div className="text-sm text-muted-foreground">Dia Pessoal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Cycles (Current) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Clock className="mr-2 h-6 w-6 text-secondary" />
            Ciclos Pessoais Atuais
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            Energias Ativas
          </Badge>
        </div>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {personalCycles.filter(cycle => 
            searchQuery === '' || 
            cycle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cycle.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(cycle => (
            <div key={cycle.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(cycle.id)}
              >
                {isBookmarked(cycle.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <InteractiveNumerologyCard 
                {...cycle}
                viewMode={viewMode}
              />
              <div className="mt-2 text-center">
                <Badge variant="secondary" className="text-xs">
                  {cycle.timeframe}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Life Cycles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <RotateCcw className="mr-2 h-6 w-6 text-primary" />
            Ciclos de Vida
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            Grandes Períodos
          </Badge>
        </div>

        {/* Life Cycle Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Progresso dos Ciclos de Vida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Você está atualmente no {currentLifeCycle.cycle}º Ciclo de Vida
                </p>
                <Progress value={currentLifeCycle.progress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(currentLifeCycle.progress)}% concluído deste ciclo
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                {lifeCycles.map((cycle, index) => (
                  <div 
                    key={cycle.id}
                    className={`p-3 rounded-lg ${
                      currentLifeCycle.cycle === index + 1 
                        ? 'bg-primary/20 border-2 border-primary' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="text-lg font-bold">{cycle.value}</div>
                    <div className="text-xs text-muted-foreground">{cycle.title}</div>
                    <div className="text-xs">{cycle.timeframe}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
            : 'space-y-4'
          }
        `}>
          {lifeCycles.filter(cycle => 
            searchQuery === '' || 
            cycle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cycle.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((cycle, index) => (
            <div key={cycle.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onBookmark(cycle.id)}
              >
                {isBookmarked(cycle.id) ? 
                  <BookmarkCheck size={16} className="text-secondary" /> : 
                  <Bookmark size={16} />
                }
              </Button>
              <div className={`
                ${currentLifeCycle.cycle === index + 1 ? 'ring-2 ring-primary shadow-lg' : ''}
              `}>
                <InteractiveNumerologyCard 
                  {...cycle}
                  viewMode={viewMode}
                  isHighlighted={currentLifeCycle.cycle === index + 1}
                />
              </div>
              <div className="mt-2 text-center">
                <Badge 
                  variant={currentLifeCycle.cycle === index + 1 ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {currentLifeCycle.cycle === index + 1 ? "Ciclo Atual" : cycle.timeframe}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-center">Linha do Tempo Pessoal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-primary/30"></div>
            
            <div className="space-y-8">
              {/* Year */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="font-semibold">Ano {currentYear}</h3>
                  <p className="text-sm text-muted-foreground">Energia {mapa.anoPersonal}</p>
                </div>
                <div className="w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                <div className="flex-1 pl-8">
                  <p className="text-sm">Tema principal do ano</p>
                </div>
              </div>
              
              {/* Month */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <p className="text-sm">Mês Atual</p>
                </div>
                <div className="w-3 h-3 bg-secondary rounded-full border-2 border-background z-10"></div>
                <div className="flex-1 pl-8">
                  <h3 className="font-semibold">Energia {mapa.mesPersonal}</h3>
                  <p className="text-sm text-muted-foreground">Foco mensal</p>
                </div>
              </div>
              
              {/* Day */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="font-semibold">Hoje</h3>
                  <p className="text-sm text-muted-foreground">Energia {mapa.diaPersonal}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full border border-background z-10"></div>
                <div className="flex-1 pl-8">
                  <p className="text-sm">Oportunidade diária</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}