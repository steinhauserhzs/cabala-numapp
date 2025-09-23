import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useInterpretacao } from '@/hooks/useInterpretacao';
import { ChevronDown, ChevronUp, Star, Zap } from 'lucide-react';

interface InteractiveNumerologyCardProps {
  id: string;
  title: string;
  value: number;
  description: string;
  categoria: string;
  icon: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  viewMode?: 'grid' | 'list';
  isHighlighted?: boolean;
}

export function InteractiveNumerologyCard({ 
  id,
  title, 
  value, 
  description, 
  categoria, 
  icon,
  priority = 'medium',
  viewMode = 'grid',
  isHighlighted = false
}: InteractiveNumerologyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { interpretacao, isLoading } = useInterpretacao(categoria, value, { enabled: isExpanded });

  const isMasterNumber = value === 11 || value === 22 || value === 33;

  const getNumberStyle = () => {
    if (isMasterNumber) {
      return "text-3xl font-bold text-secondary animate-glow";
    }
    return "text-3xl font-bold text-primary";
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/5';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'low': return 'border-green-500/30 bg-green-500/5';
      default: return 'border-border';
    }
  };

  const cardClasses = `
    group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
    ${isHighlighted ? 'ring-2 ring-primary shadow-lg scale-105' : ''}
    ${getPriorityColor()}
    ${viewMode === 'list' ? 'flex flex-row' : 'h-full'}
  `;

  if (viewMode === 'list') {
    return (
      <Card className={cardClasses}>
        <div className="flex items-center w-full p-4">
          {/* Icon and Number */}
          <div className="flex items-center space-x-4 min-w-[200px]">
            <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{title}</h3>
                {isMasterNumber && (
                  <Badge variant="secondary" className="text-xs">
                    <Star size={12} className="mr-1" />
                    Mestre
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          {/* Number Display */}
          <div className="mx-8">
            <div className={getNumberStyle()}>
              {value}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2"
            >
              <span>Ver interpretação</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border p-4 bg-muted/30">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : interpretacao ? (
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {interpretacao}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Interpretação não disponível.
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={cardClasses}>
      <CardHeader className="relative">
        {/* Priority Indicator */}
        {priority === 'high' && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs px-2 py-1">
              <Zap size={12} className="mr-1" />
              Principal
            </Badge>
          </div>
        )}

        {/* Master Number Badge */}
        {isMasterNumber && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <Star size={12} className="mr-1" />
              Mestre
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <div className={getNumberStyle()}>
            {value}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded transition-colors"
        >
          <span className="font-medium">Ver interpretação</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>

        {isExpanded && (
          <div className="mt-4 p-4 border-t border-border bg-muted/30 rounded-b">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : interpretacao ? (
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {interpretacao}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Interpretação não disponível.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}