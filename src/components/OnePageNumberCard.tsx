import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInterpretacao } from '@/hooks/useInterpretacao';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface OnePageNumberCardProps {
  id: string;
  title: string;
  value: number | string;
  description: string;
  categoria: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

export function OnePageNumberCard({
  id,
  title,
  value,
  description,
  categoria,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-gradient-to-br from-primary/10 to-primary/5",
  borderColor = "border-primary/30"
}: OnePageNumberCardProps) {
  const { interpretacao, isLoading } = useInterpretacao(categoria, value);
  
  // Debug logging
  console.log(`🃏 OnePageNumberCard: ${title} (${categoria}: ${value})`);
  if (interpretacao) {
    console.log(`✅ Interpretação carregada para ${categoria}_${value}: ${interpretacao.substring(0, 100)}...`);
  } else if (!isLoading) {
    console.log(`❌ Nenhuma interpretação para ${categoria}_${value}`);
  }

  const isMasterNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    return n === 11 || n === 22 || n === 33;
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    return val;
  };

  return (
    <Card className={`${bgColor} ${borderColor} border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-background/50 ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="h-px bg-border" />
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : interpretacao ? (
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-sm text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: interpretacao.replace(/\n/g, '<br>') 
                }}
              />
            </div>
           ) : (
            <p className="text-sm text-muted-foreground italic">
              Interpretação não disponível para este número.
            </p>
           )}
           
           <div className="flex items-center justify-center pt-3 mt-3 border-t border-border">
             <div className="text-center">
               <div className={`text-3xl font-bold ${color} ${
                 isMasterNumber(value) ? 'bg-gradient-cosmic bg-clip-text text-transparent' : ''
               }`}>
                 {formatValue(value)}
               </div>
               {isMasterNumber(value) && (
                 <Badge variant="secondary" className="text-xs mt-1">
                   Mestre
                 </Badge>
               )}
             </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}