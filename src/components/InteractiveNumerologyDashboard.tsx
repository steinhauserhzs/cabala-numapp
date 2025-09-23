import React, { useState } from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Download, Search, Bookmark, Filter, Grid, List, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NumerologyCircle } from './dashboard/NumerologyCircle';
import { NavigationSidebar } from './dashboard/NavigationSidebar';
import { OverviewDashboard } from './dashboard/OverviewDashboard';
import { KarmicAspectsTab } from './dashboard/KarmicAspectsTab';
import { TemporalCyclesTab } from './dashboard/TemporalCyclesTab';
import { ChallengesMomentsTab } from './dashboard/ChallengesMomentsTab';
import { AdditionalInfoTab } from './dashboard/AdditionalInfoTab';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdf';

interface InteractiveNumerologyDashboardProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  onBack: () => void;
}

export function InteractiveNumerologyDashboard({ 
  mapa, 
  name, 
  birthDate, 
  onBack 
}: InteractiveNumerologyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(name, birthDate, (progress) => {
        if (progress === 100) {
          toast({
            title: "PDF Gerado!",
            description: "Seu mapa numerológico foi baixado com sucesso.",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const toggleBookmark = (section: string) => {
    setBookmarkedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Navigation Sidebar */}
        <NavigationSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bookmarkedSections={bookmarkedSections}
          onSectionSelect={setSelectedSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b border-border p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onBack}
                  className="flex items-center space-x-1 sm:space-x-2 shrink-0"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                    {name}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(birthDate)}
                  </p>
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-48 lg:w-64"
                  />
                </div>

                <div className="hidden sm:flex items-center space-x-1 bg-muted rounded-md p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center space-x-1 sm:space-x-2 shrink-0"
                  size="sm"
                >
                  {isGeneratingPDF ? (
                    <Loader2 size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="hidden sm:inline">{isGeneratingPDF ? 'Gerando...' : 'PDF'}</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 overflow-x-auto">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shrink-0 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Visão Geral</span>
                  <span className="sm:hidden">Geral</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="karmic" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shrink-0 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Aspectos Cármicos</span>
                  <span className="sm:hidden">Cármico</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="temporal" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shrink-0 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Ciclos Temporais</span>
                  <span className="sm:hidden">Ciclos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="challenges" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shrink-0 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Desafios & Momentos</span>
                  <span className="sm:hidden">Desafios</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shrink-0 text-xs sm:text-sm"
                >
                  Informações Complementares
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0">
                      <OverviewDashboard 
                        mapa={mapa}
                        name={name}
                        birthDate={birthDate}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        onBookmark={toggleBookmark}
                        bookmarkedSections={bookmarkedSections}
                      />
                    </TabsContent>

                    <TabsContent value="karmic" className="mt-0">
                      <KarmicAspectsTab 
                        mapa={mapa}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        onBookmark={toggleBookmark}
                        bookmarkedSections={bookmarkedSections}
                      />
                    </TabsContent>

                    <TabsContent value="temporal" className="mt-0">
                      <TemporalCyclesTab 
                        mapa={mapa}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        onBookmark={toggleBookmark}
                        bookmarkedSections={bookmarkedSections}
                      />
                    </TabsContent>

                    <TabsContent value="challenges" className="mt-0">
                      <ChallengesMomentsTab 
                        mapa={mapa}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        onBookmark={toggleBookmark}
                        bookmarkedSections={bookmarkedSections}
                      />
                    </TabsContent>

                    <TabsContent value="additional" className="mt-0">
                      <AdditionalInfoTab 
                        mapa={mapa}
                        name={name}
                        birthDate={birthDate}
                        viewMode={viewMode}
                        searchQuery={searchQuery}
                        onBookmark={toggleBookmark}
                        bookmarkedSections={bookmarkedSections}
                      />
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}