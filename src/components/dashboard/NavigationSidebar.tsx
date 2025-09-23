import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Sparkles, 
  Clock, 
  Mountain, 
  BookOpen, 
  Bookmark,
  Star,
  Calendar,
  AlertTriangle,
  Heart,
  Eye,
  Target,
  Compass,
  Brain
} from 'lucide-react';

interface NavigationSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  bookmarkedSections: string[];
  onSectionSelect: (section: string) => void;
}

export function NavigationSidebar({ 
  activeTab, 
  onTabChange, 
  bookmarkedSections,
  onSectionSelect 
}: NavigationSidebarProps) {
  const mainTabs = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      description: 'Painel principal com todos os números'
    },
    {
      id: 'karmic',
      label: 'Aspectos Cármicos',
      icon: Sparkles,
      description: 'Lições, dívidas e tendências'
    },
    {
      id: 'temporal',
      label: 'Ciclos Temporais',
      icon: Clock,
      description: 'Ano, mês, dia pessoal e ciclos de vida'
    },
    {
      id: 'challenges',
      label: 'Desafios & Momentos',
      icon: Mountain,
      description: 'Desafios e momentos decisivos'
    },
    {
      id: 'additional',
      label: 'Informações Complementares',
      icon: BookOpen,
      description: 'Anjo da guarda e tópicos extras'
    }
  ];

  const quickAccess = [
    { id: 'motivacao', label: 'Motivação', icon: Heart },
    { id: 'impressao', label: 'Impressão', icon: Eye },
    { id: 'expressao', label: 'Expressão', icon: Star },
    { id: 'destino', label: 'Destino', icon: Target },
    { id: 'missao', label: 'Missão', icon: Compass },
    { id: 'psiquico', label: 'Psíquico', icon: Brain },
  ];

  return (
    <div className="w-80 bg-background/95 backdrop-blur-sm border-r border-border shadow-lg">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
              <LayoutDashboard size={16} className="mr-2" />
              Navegação Principal
            </h3>
            <div className="space-y-2">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-left p-3 h-auto"
                    onClick={() => onTabChange(tab.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon size={18} className="mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Quick Access */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
              <Star size={16} className="mr-2" />
              Acesso Rápido
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickAccess.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="outline"
                    size="sm"
                    className="p-2 h-auto"
                    onClick={() => {
                      onTabChange('overview');
                      onSectionSelect(item.id);
                    }}
                  >
                    <div className="text-center">
                      <Icon size={16} className="mx-auto mb-1" />
                      <div className="text-xs">{item.label}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Bookmarks */}
          {bookmarkedSections.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                  <Bookmark size={16} className="mr-2" />
                  Favoritos
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {bookmarkedSections.length}
                  </Badge>
                </h3>
                <div className="space-y-1">
                  {bookmarkedSections.map((section) => (
                    <Button
                      key={section}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => onSectionSelect(section)}
                    >
                      <Bookmark size={14} className="mr-2 text-secondary" />
                      {section}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Status Indicators */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Status do Mapa</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Carregamento</span>
                <Badge variant="outline" className="text-xs">Completo</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Interpretações</span>
                <Badge variant="outline" className="text-xs">Disponíveis</Badge>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}