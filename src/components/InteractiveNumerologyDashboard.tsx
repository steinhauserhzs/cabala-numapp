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
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-background border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              
              <div>
                <h1 className="text-lg font-bold text-foreground truncate max-w-40">
                  {name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {formatDate(birthDate)}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              size="sm"
              className="p-2"
            >
              {isGeneratingPDF ? (
                <Loader2 size={16} />
              ) : (
                <Download size={16} />
              )}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="mt-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <div className="pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-4">
              <TabsContent value="overview" className="mt-0">
                <OverviewDashboard 
                  mapa={mapa}
                  name={name}
                  birthDate={birthDate}
                  viewMode="grid"
                  searchQuery={searchQuery}
                  onBookmark={toggleBookmark}
                  bookmarkedSections={bookmarkedSections}
                />
              </TabsContent>

              <TabsContent value="karmic" className="mt-0">
                <KarmicAspectsTab 
                  mapa={mapa}
                  viewMode="grid"
                  searchQuery={searchQuery}
                  onBookmark={toggleBookmark}
                  bookmarkedSections={bookmarkedSections}
                />
              </TabsContent>

              <TabsContent value="temporal" className="mt-0">
                <TemporalCyclesTab 
                  mapa={mapa}
                  viewMode="grid"
                  searchQuery={searchQuery}
                  onBookmark={toggleBookmark}
                  bookmarkedSections={bookmarkedSections}
                />
              </TabsContent>

              <TabsContent value="challenges" className="mt-0">
                <ChallengesMomentsTab 
                  mapa={mapa}
                  viewMode="grid"
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
                  viewMode="grid"
                  searchQuery={searchQuery}
                  onBookmark={toggleBookmark}
                  bookmarkedSections={bookmarkedSections}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-20">
          <div className="grid grid-cols-5 h-16">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center justify-center space-y-1 text-xs transition-colors ${
                activeTab === 'overview' ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <span>Geral</span>
            </button>
            
            <button
              onClick={() => setActiveTab('karmic')}
              className={`flex flex-col items-center justify-center space-y-1 text-xs transition-colors ${
                activeTab === 'karmic' ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <span>Cármico</span>
            </button>
            
            <button
              onClick={() => setActiveTab('temporal')}
              className={`flex flex-col items-center justify-center space-y-1 text-xs transition-colors ${
                activeTab === 'temporal' ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <span>Ciclos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex flex-col items-center justify-center space-y-1 text-xs transition-colors ${
                activeTab === 'challenges' ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <span>Desafios</span>
            </button>
            
            <button
              onClick={() => setActiveTab('additional')}
              className={`flex flex-col items-center justify-center space-y-1 text-xs transition-colors ${
                activeTab === 'additional' ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
              <span>Mais</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row h-screen">
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
          <header className="bg-background border-b border-border p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4 min-w-0">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onBack}
                  className="flex items-center space-x-2 shrink-0"
                >
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </Button>
                
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(birthDate)}
                  </p>
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
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
                  className="flex items-center space-x-2 shrink-0"
                  size="sm"
                >
                  {isGeneratingPDF ? (
                    <Loader2 size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                  <span>{isGeneratingPDF ? 'Gerando...' : 'PDF'}</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="karmic" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Aspectos Cármicos
                </TabsTrigger>
                <TabsTrigger 
                  value="temporal" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Ciclos Temporais
                </TabsTrigger>
                <TabsTrigger 
                  value="challenges" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Desafios & Momentos
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
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