import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Star, Target, Compass, Brain } from 'lucide-react';

interface NumerologyCircleProps {
  mapa: MapaNumerologico;
  onNumberClick?: (number: number, category: string) => void;
}

export function NumerologyCircle({ mapa, onNumberClick }: NumerologyCircleProps) {
  const coreNumbers = [
    {
      label: "Motivação",
      value: mapa.motivacao,
      category: "motivacao",
      icon: Heart,
      position: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      color: 'bg-red-500/20 text-red-700 border-red-500/30',
    },
    {
      label: "Impressão",
      value: mapa.impressao,
      category: "impressao", 
      icon: Eye,
      position: { top: '30%', right: '15%' },
      color: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    },
    {
      label: "Expressão",
      value: mapa.expressao,
      category: "expressao",
      icon: Star,
      position: { top: '70%', right: '15%' },
      color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    },
    {
      label: "Destino",
      value: mapa.destino,
      category: "destino",
      icon: Target,
      position: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
      color: 'bg-green-500/20 text-green-700 border-green-500/30',
    },
    {
      label: "Missão",
      value: mapa.missao,
      category: "missao",
      icon: Compass,
      position: { top: '70%', left: '15%' },
      color: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
    },
    {
      label: "Psíquico",
      value: mapa.numeroPsiquico,
      category: "numero_psiquico",
      icon: Brain,
      position: { top: '30%', left: '15%' },
      color: 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
    },
  ];

  const isMasterNumber = (num: number) => num === 11 || num === 22 || num === 33;

  return (
    <div className="relative w-full h-96 max-w-lg mx-auto">
      {/* Central Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-cosmic border-4 border-primary/30 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-xs font-medium text-white mb-1">Núcleo</div>
          <div className="text-lg font-bold text-white">Principal</div>
        </div>
      </div>

      {/* Orbit Numbers */}
      {coreNumbers.map((number, index) => {
        const Icon = number.icon;
        return (
          <div
            key={number.label}
            className="absolute"
            style={number.position}
          >
            <div
              className={`
                relative cursor-pointer group transition-all duration-300 hover:scale-110
                bg-background/95 backdrop-blur-sm border-2 rounded-xl p-4 shadow-lg
                ${number.color}
                ${isMasterNumber(number.value) ? 'animate-pulse' : ''}
              `}
              onClick={() => onNumberClick?.(number.value, number.category)}
            >
              {/* Master Number Indicator */}
              {isMasterNumber(number.value) && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-1 py-0"
                >
                  Mestre
                </Badge>
              )}

              <div className="text-center min-w-[80px]">
                <Icon size={20} className="mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-medium mb-1">{number.label}</div>
                <div className={`text-2xl font-bold ${isMasterNumber(number.value) ? 'text-secondary' : ''}`}>
                  {number.value}
                </div>
              </div>

              {/* Connection Lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-px h-8 bg-gradient-to-b from-primary/30 to-transparent transform -translate-x-1/2 -translate-y-full" />
              </div>
            </div>
          </div>
        );
      })}

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="connectionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}