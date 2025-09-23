import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface StatsOverviewProps {
  mapa: MapaNumerologico;
}

export function StatsOverview({ mapa }: StatsOverviewProps) {
  // Calculate stats
  const allNumbers = [
    mapa.motivacao, mapa.impressao, mapa.expressao, 
    mapa.destino, mapa.missao, mapa.numeroPsiquico,
    mapa.anoPersonal, mapa.mesPersonal, mapa.diaPersonal
  ];

  const masterNumbers = allNumbers.filter(n => n === 11 || n === 22 || n === 33);
  const averageNumber = Math.round(allNumbers.reduce((a, b) => a + b, 0) / allNumbers.length);
  const karmicLessons = mapa.licoesCarmicas.length;
  const karmicDebts = mapa.dividasCarmicas.length;
  const hiddenTendencies = mapa.tendenciasOcultas.length;

  // Calculate spiritual strength based on master numbers and karmic aspects
  const spiritualStrength = Math.min(100, 
    (masterNumbers.length * 25) + 
    (karmicLessons > 0 ? 20 : 0) + 
    (karmicDebts === 0 ? 30 : 0) + 
    (hiddenTendencies > 0 ? 25 : 0)
  );

  const stats = [
    {
      title: 'Números Mestres',
      value: masterNumbers.length,
      total: 3,
      description: 'Potencial espiritual elevado',
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      color: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
      title: 'Força Espiritual',
      value: spiritualStrength,
      total: 100,
      description: 'Desenvolvimento espiritual',
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      isPercentage: true
    },
    {
      title: 'Lições Cármicas',
      value: karmicLessons,
      total: 9,
      description: 'Áreas de desenvolvimento',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Dívidas Cármicas',
      value: karmicDebts,
      total: 4,
      description: 'Desafios kármicos',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      color: 'bg-red-500/10 border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.color} hover:shadow-md transition-shadow`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {stat.icon}
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {stat.value}{stat.isPercentage ? '%' : `/${stat.total}`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  {stat.value}
                </span>
                {!stat.isPercentage && (
                  <span className="text-sm text-muted-foreground">
                    de {stat.total}
                  </span>
                )}
              </div>
              
              <Progress 
                value={stat.isPercentage ? stat.value : (stat.value / stat.total) * 100} 
                className="h-2"
              />
              
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}