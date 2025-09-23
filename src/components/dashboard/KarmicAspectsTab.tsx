import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, AlertTriangle, Zap, Bookmark, BookmarkCheck } from 'lucide-react';

interface KarmicAspectsTabProps {
  mapa: MapaNumerologico;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onBookmark: (section: string) => void;
  bookmarkedSections: string[];
}

export function KarmicAspectsTab({ 
  mapa, 
  viewMode, 
  searchQuery,
  onBookmark,
  bookmarkedSections 
}: KarmicAspectsTabProps) {
  const karmaAspects = [
    {
      id: 'licoes-carmicas',
      title: "Lições Cármicas",
      values: mapa.licoesCarmicas,
      description: "Números ausentes no seu nome - áreas para desenvolver",
      icon: <BookOpen size={24} />,
      color: 'bg-blue-500/10 border-blue-500/30',
      interpretation: "Estes números representam qualidades ou habilidades que você precisa desenvolver nesta vida. São aspectos que não estavam presentes em vidas passadas e agora precisam ser aprendidos."
    },
    {
      id: 'dividas-carmicas',
      title: "Dívidas Cármicas", 
      values: mapa.dividasCarmicas,
      description: "Desafios de vidas passadas que retornam",
      icon: <AlertTriangle size={24} />,
      color: 'bg-red-500/10 border-red-500/30',
      interpretation: "Representam desafios ou padrões negativos de vidas passadas que retornam para serem resolvidos. São oportunidades de crescimento através da superação."
    },
    {
      id: 'tendencias-ocultas',
      title: "Tendências Ocultas",
      values: mapa.tendenciasOcultas, 
      description: "Números em excesso no seu nome - talentos naturais",
      icon: <Zap size={24} />,
      color: 'bg-yellow-500/10 border-yellow-500/30',
      interpretation: "Indicam talentos naturais e habilidades que você trouxe de vidas passadas. São seus pontos fortes naturais, mas cuidado para não se tornar excessivo nestas áreas."
    }
  ];

  const filteredAspects = karmaAspects.filter(aspect => 
    searchQuery === '' || 
    aspect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aspect.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isBookmarked = (id: string) => bookmarkedSections.includes(id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
          Aspectos Cármicos
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore suas lições kármicas, dívidas de vidas passadas e tendências naturais ocultas. 
          Estes aspectos revelam seu crescimento espiritual e os desafios desta encarnação.
        </p>
      </div>

      {/* Karmic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mapa.licoesCarmicas.length}
            </div>
            <div className="text-sm text-muted-foreground">Lições para Aprender</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {mapa.dividasCarmicas.length}
            </div>
            <div className="text-sm text-muted-foreground">Dívidas para Resolver</div>
          </CardContent>
        </Card>
        
        <Card className="text-center bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mapa.tendenciasOcultas.length}
            </div>
            <div className="text-sm text-muted-foreground">Talentos Naturais</div>
          </CardContent>
        </Card>
      </div>

      {/* Karmic Aspects */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }
      `}>
        {filteredAspects.map((aspect) => (
          <Card key={aspect.id} className={`${aspect.color} relative group hover:shadow-lg transition-all`}>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 z-10"
              onClick={() => onBookmark(aspect.id)}
            >
              {isBookmarked(aspect.id) ? 
                <BookmarkCheck size={16} className="text-secondary" /> : 
                <Bookmark size={16} />
              }
            </Button>

            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-background/50 w-fit mb-4 group-hover:scale-110 transition-transform">
                {aspect.icon}
              </div>
              <CardTitle className="text-xl">{aspect.title}</CardTitle>
              <div className="text-3xl font-bold text-primary mb-2">
                {aspect.values.length > 0 ? aspect.values.join(', ') : 'Nenhum'}
              </div>
              <p className="text-sm text-muted-foreground">{aspect.description}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Numbers Display */}
                {aspect.values.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {aspect.values.map((value, index) => (
                      <Badge key={index} variant="outline" className="text-lg px-3 py-1">
                        {value}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Interpretation */}
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{aspect.interpretation}</p>
                </div>

                {/* Empty State */}
                {aspect.values.length === 0 && (
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <div className="text-muted-foreground mb-2">✨</div>
                    <p className="text-sm text-muted-foreground">
                      Parabéns! Você não possui {aspect.title.toLowerCase()} nesta vida.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Karmic Balance */}
      <Card className="bg-gradient-mystical border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Balanço Cármico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-3 text-green-600">Pontos Fortes</h3>
              <div className="space-y-2">
                <div className="p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm">
                    {mapa.tendenciasOcultas.length > 0 
                      ? `Você possui ${mapa.tendenciasOcultas.length} talento(s) natural(is)`
                      : 'Balanço equilibrado de habilidades'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-3 text-blue-600">Áreas de Crescimento</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm">
                    {mapa.licoesCarmicas.length > 0 
                      ? `${mapa.licoesCarmicas.length} área(s) para desenvolver`
                      : 'Todas as lições principais foram aprendidas'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}