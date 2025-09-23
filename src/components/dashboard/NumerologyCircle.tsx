import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Star, Target, Compass, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NumerologyCircleProps {
  mapa: MapaNumerologico;
  onNumberClick?: (number: number, category: string) => void;
}

export function NumerologyCircle({ mapa, onNumberClick }: NumerologyCircleProps) {
  const isMobile = useIsMobile();
  
  const coreNumbers = [
    {
      label: "Motivação",
      value: mapa.motivacao,
      category: "motivacao",
      icon: Heart,
      color: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-150',
      bgGradient: 'from-rose-50 to-pink-50',
    },
    {
      label: "Impressão",
      value: mapa.impressao,
      category: "impressao", 
      icon: Eye,
      color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-150',
      bgGradient: 'from-blue-50 to-sky-50',
    },
    {
      label: "Expressão",
      value: mapa.expressao,
      category: "expressao",
      icon: Star,
      color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-150',
      bgGradient: 'from-amber-50 to-yellow-50',
    },
    {
      label: "Destino",
      value: mapa.destino,
      category: "destino",
      icon: Target,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-150',
      bgGradient: 'from-emerald-50 to-green-50',
    },
    {
      label: "Missão",
      value: mapa.missao,
      category: "missao",
      icon: Compass,
      color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-150',
      bgGradient: 'from-purple-50 to-violet-50',
    },
    {
      label: "Psíquico",
      value: mapa.numeroPsiquico,
      category: "numero_psiquico",
      icon: Brain,
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-150',
      bgGradient: 'from-indigo-50 to-blue-50',
    },
  ];

  const isMasterNumber = (num: number) => num === 11 || num === 22 || num === 33;

  if (isMobile) {
    // Mobile: Vertical stacked layout
    return (
      <div className="w-full space-y-4">
        {/* Central Header */}
        <div className="bg-gradient-cosmic rounded-2xl p-6 text-center text-white shadow-mystical">
          <h3 className="text-lg font-bold mb-1">Mapa Numerológico</h3>
          <p className="text-sm opacity-90">Números Principais</p>
        </div>

        {/* Numbers Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3">
          {coreNumbers.map((number, index) => {
            const Icon = number.icon;
            return (
              <div
                key={number.label}
                className={`
                  relative cursor-pointer
                  bg-gradient-to-br ${number.bgGradient} backdrop-blur-sm 
                  border-2 ${number.color} rounded-xl p-4 shadow-card
                  active:scale-95 transform transition-transform
                `}
                onClick={() => onNumberClick?.(number.value, number.category)}
              >
                {/* Master Number Indicator */}
                {isMasterNumber(number.value) && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1 py-0"
                  >
                    ★
                  </Badge>
                )}

                <div className="text-center">
                  <Icon size={24} className="mx-auto mb-2 opacity-80" />
                  <div className="text-xs font-medium mb-1 leading-tight">{number.label}</div>
                  <div className={`text-xl font-bold ${isMasterNumber(number.value) ? 'text-primary' : ''}`}>
                    {number.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: Hexagonal flower layout
  return (
    <div className="relative w-full h-96 max-w-2xl mx-auto">
      {/* Central Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-cosmic border-4 border-primary/20 flex items-center justify-center shadow-mystical">
        <div className="text-center text-white">
          <div className="text-sm font-medium mb-1">Mapa</div>
          <div className="text-lg font-bold">Numerológico</div>
        </div>
      </div>

      {/* Hexagonal Number Layout */}
      {coreNumbers.map((number, index) => {
        const Icon = number.icon;
        
        // Calculate hexagonal positions
        const angle = (index * 60) - 90; // Start from top, 60 degrees apart
        const radius = 140;
        const radian = (angle * Math.PI) / 180;
        const x = 50 + (radius * Math.cos(radian)) / 4; // Percentage positioning
        const y = 50 + (radius * Math.sin(radian)) / 4;
        
        return (
          <div
            key={number.label}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <div
              className={`
                relative cursor-pointer group
                bg-gradient-to-br ${number.bgGradient} backdrop-blur-sm 
                border-2 ${number.color} rounded-2xl p-6 shadow-card
                hover:shadow-mystical hover:scale-105 transform transition-all
              `}
              onClick={() => onNumberClick?.(number.value, number.category)}
            >
              {/* Master Number Indicator */}
              {isMasterNumber(number.value) && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0"
                >
                  Mestre
                </Badge>
              )}

              <div className="text-center min-w-[100px]">
                <Icon size={28} className="mx-auto mb-3 opacity-80" />
                <div className="text-sm font-medium mb-2">{number.label}</div>
                <div className={`text-3xl font-bold ${isMasterNumber(number.value) ? 'text-primary' : ''}`}>
                  {number.value}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <radialGradient id="connectionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* Hexagonal connection pattern */}
        {coreNumbers.map((_, index) => {
          const nextIndex = (index + 1) % coreNumbers.length;
          const angle1 = (index * 60) - 90;
          const angle2 = (nextIndex * 60) - 90;
          const radius = 140;
          
          const x1 = 50 + (radius * Math.cos((angle1 * Math.PI) / 180)) / 4;
          const y1 = 50 + (radius * Math.sin((angle1 * Math.PI) / 180)) / 4;
          const x2 = 50 + (radius * Math.cos((angle2 * Math.PI) / 180)) / 4;
          const y2 = 50 + (radius * Math.sin((angle2 * Math.PI) / 180)) / 4;
          
          return (
            <line
              key={index}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              strokeDasharray="8,8"
            />
          );
        })}
      </svg>
    </div>
  );
}