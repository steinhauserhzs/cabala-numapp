import React from 'react';
import { MapaNumerologico } from '@/utils/numerology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OnePageNumberCard } from './OnePageNumberCard';
import { 
  Heart, 
  Eye, 
  Star, 
  Target, 
  Compass, 
  Brain,
  Calendar,
  Clock,
  Sun,
  Sparkles,
  Shield,
  TrendingUp,
  AlertTriangle,
  Gem,
  Palette,
  Crown,
  Download,
  Share2
} from 'lucide-react';

interface OnePageNumerologyReportProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  onGeneratePDF?: () => void;
  onShare?: () => void;
  isGeneratingPDF?: boolean;
}

export function OnePageNumerologyReport({ 
  mapa, 
  name, 
  birthDate,
  onGeneratePDF,
  onShare,
  isGeneratingPDF = false
}: OnePageNumerologyReportProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const coreNumbers = [
    {
      id: 'motivacao',
      title: "Motivação",
      value: mapa.motivacao,
      description: "O que te motiva internamente",
      categoria: "motivacao",
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    {
      id: 'impressao',
      title: "Impressão", 
      value: mapa.impressao,
      description: "Como os outros te veem",
      categoria: "impressao",
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 'expressao',
      title: "Expressão",
      value: mapa.expressao, 
      description: "Sua personalidade total",
      categoria: "expressao",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: 'destino',
      title: "Destino",
      value: mapa.destino,
      description: "Seu caminho de vida",
      categoria: "destino",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 'missao',
      title: "Missão",
      value: mapa.missao,
      description: "Sua missão nesta vida",
      categoria: "missao",
      icon: Compass,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 'psiquico',
      title: "Número Psíquico",
      value: mapa.numeroPsiquico,
      description: "Sua natureza psíquica",
      categoria: "numero_psiquico",
      icon: Brain,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  const personalCycles = [
    {
      id: 'ano-pessoal',
      title: "Ano Pessoal",
      value: mapa.anoPersonal,
      description: "Energia do ano atual",
      categoria: "ano_pessoal",
      icon: Calendar,
      color: "text-orange-500"
    },
    {
      id: 'mes-pessoal',
      title: "Mês Pessoal", 
      value: mapa.mesPersonal,
      description: "Energia do mês atual",
      categoria: "mes_pessoal",
      icon: Clock,
      color: "text-teal-500"
    },
    {
      id: 'dia-pessoal',
      title: "Dia Pessoal",
      value: mapa.diaPersonal,
      description: "Energia do dia atual", 
      categoria: "dia_pessoal",
      icon: Sun,
      color: "text-amber-500"
    }
  ];

  const karmicAspects = [
    {
      id: 'licoes-carmicas',
      title: "Lições Cármicas",
      value: mapa.licoesCarmicas?.join(', ') || 'Nenhuma',
      description: "Números ausentes que indicam lições a aprender",
      categoria: "licoes_carmicas",
      icon: Shield,
      color: "text-red-500"
    },
    {
      id: 'tendencias-ocultas',
      title: "Tendências Ocultas",
      value: mapa.tendenciasOcultas?.join(', ') || 'Nenhuma',
      description: "Talentos e habilidades naturais",
      categoria: "tendencias_ocultas", 
      icon: Sparkles,
      color: "text-violet-500"
    },
    {
      id: 'dividas-carmicas',
      title: "Dívidas Cármicas",
      value: mapa.dividasCarmicas?.length ? mapa.dividasCarmicas.join(', ') : 'Nenhuma',
      description: "Desafios cármicos a serem resolvidos",
      categoria: "dividas_carmicas",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      id: 'resposta-subconsciente',
      title: "Resposta Subconsciente",
      value: mapa.respostaSubconsciente,
      description: "Como você reage instintivamente",
      categoria: "resposta_subconsciente",
      icon: Brain,
      color: "text-cyan-500"
    }
  ];

  const lifeCycles = [
    {
      id: 'ciclo1',
      title: "1º Ciclo de Vida",
      value: mapa.ciclosVida?.primeiro || 0,
      description: "Infância e juventude",
      categoria: "ciclo_vida_1",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      id: 'ciclo2',
      title: "2º Ciclo de Vida",
      value: mapa.ciclosVida?.segundo || 0,
      description: "Maturidade e produtividade",
      categoria: "ciclo_vida_2", 
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      id: 'ciclo3',
      title: "3º Ciclo de Vida",
      value: mapa.ciclosVida?.terceiro || 0,
      description: "Sabedoria e realização",
      categoria: "ciclo_vida_3",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const challenges = [
    {
      id: 'desafio1',
      title: "1º Desafio",
      value: mapa.desafios?.primeiro || 0,
      description: "Primeiro terço da vida",
      categoria: "desafio_1",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      id: 'desafio2',
      title: "2º Desafio",
      value: mapa.desafios?.segundo || 0,
      description: "Segundo terço da vida",
      categoria: "desafio_2",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      id: 'desafio-principal',
      title: "Desafio Principal",
      value: mapa.desafios?.principal || 0,
      description: "Desafio central da vida",
      categoria: "desafio_principal",
      icon: AlertTriangle,
      color: "text-red-700"
    }
  ];

  const decisiveMoments = [
    {
      id: 'momento1',
      title: "1º Momento Decisivo",
      value: mapa.momentosDecisivos?.primeiro || 0,
      description: "Primeira realização importante",
      categoria: "momento_decisivo_1",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      id: 'momento2', 
      title: "2º Momento Decisivo",
      value: mapa.momentosDecisivos?.segundo || 0,
      description: "Segunda realização importante",
      categoria: "momento_decisivo_2",
      icon: Star,
      color: "text-yellow-700"
    },
    {
      id: 'momento3',
      title: "3º Momento Decisivo", 
      value: mapa.momentosDecisivos?.terceiro || 0,
      description: "Terceira realização importante",
      categoria: "momento_decisivo_3",
      icon: Star,
      color: "text-amber-600"
    },
    {
      id: 'momento4',
      title: "4º Momento Decisivo",
      value: mapa.momentosDecisivos?.quarto || 0,
      description: "Realização final",
      categoria: "momento_decisivo_4",
      icon: Crown,
      color: "text-amber-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
                {name}
              </h1>
              <p className="text-muted-foreground">
                Nascimento: {formatDate(birthDate)} • Análise Completa
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {onShare && (
                <Button variant="outline" onClick={onShare} className="flex items-center space-x-2">
                  <Share2 size={16} />
                  <span>Compartilhar</span>
                </Button>
              )}
              {onGeneratePDF && (
                <Button 
                  variant="default" 
                  onClick={onGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>{isGeneratingPDF ? 'Gerando...' : 'Baixar PDF'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <Card className="bg-gradient-mystical border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-cosmic bg-clip-text text-transparent">
              Mapa Numerológico Completo
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Descubra os números que guiam sua jornada
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {coreNumbers.filter(n => n.value === 11 || n.value === 22 || n.value === 33).length}
                </div>
                <div className="text-sm text-muted-foreground">Números Mestres</div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {coreNumbers.length}
                </div>
                <div className="text-sm text-muted-foreground">Aspectos Principais</div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {karmicAspects.length}
                </div>
                <div className="text-sm text-muted-foreground">Aspectos Cármicos</div>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {lifeCycles.length + challenges.length + decisiveMoments.length}
                </div>
                <div className="text-sm text-muted-foreground">Ciclos & Momentos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Numbers */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <Star className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Números Principais</h2>
            <Badge variant="outline" className="px-3 py-1">
              Essenciais para sua personalidade
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreNumbers.map(number => (
              <OnePageNumberCard 
                key={number.id}
                {...number}
              />
            ))}
          </div>
        </section>

        {/* Personal Cycles */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <Calendar className="h-8 w-8 text-secondary" />
            <h2 className="text-3xl font-bold">Ciclos Pessoais Atuais</h2>
            <Badge variant="outline" className="px-3 py-1">
              Hoje: {new Date().toLocaleDateString('pt-BR')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalCycles.map(cycle => (
              <OnePageNumberCard 
                key={cycle.id}
                {...cycle}
                icon={cycle.icon}
                bgColor="bg-gradient-to-br from-secondary/10 to-secondary/5"
                borderColor="border-secondary/30"
              />
            ))}
          </div>
        </section>

        {/* Karmic Aspects */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-violet-600" />
            <h2 className="text-3xl font-bold">Aspectos Cármicos</h2>
            <Badge variant="outline" className="px-3 py-1">
              Lições da alma
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {karmicAspects.map(aspect => (
              <OnePageNumberCard 
                key={aspect.id}
                {...aspect}
                icon={aspect.icon}
                bgColor="bg-gradient-to-br from-violet-50 to-purple-50"
                borderColor="border-violet-200"
              />
            ))}
          </div>
        </section>

        {/* Life Cycles */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold">Ciclos de Vida</h2>
            <Badge variant="outline" className="px-3 py-1">
              Fases evolutivas
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifeCycles.map(cycle => (
              <OnePageNumberCard 
                key={cycle.id}
                {...cycle}
                icon={cycle.icon}
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
                borderColor="border-green-200"
              />
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h2 className="text-3xl font-bold">Desafios</h2>
            <Badge variant="outline" className="px-3 py-1">
              Obstáculos a superar
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <OnePageNumberCard 
                key={challenge.id}
                {...challenge}
                icon={challenge.icon}
                bgColor="bg-gradient-to-br from-orange-50 to-red-50"
                borderColor="border-orange-200"
              />
            ))}
          </div>
        </section>

        {/* Decisive Moments */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <Crown className="h-8 w-8 text-yellow-600" />
            <h2 className="text-3xl font-bold">Momentos Decisivos</h2>
            <Badge variant="outline" className="px-3 py-1">
              Realizações importantes
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {decisiveMoments.map(moment => (
              <OnePageNumberCard 
                key={moment.id}
                {...moment}
                icon={moment.icon}
                bgColor="bg-gradient-to-br from-yellow-50 to-amber-50"
                borderColor="border-yellow-200"
              />
            ))}
          </div>
        </section>

        {/* Guardian Angel and Additional Info */}
        {mapa.anjoGuarda && (
          <section>
            <div className="flex items-center space-x-3 mb-8">
              <Gem className="h-8 w-8 text-pink-600" />
              <h2 className="text-3xl font-bold">Informações Espirituais</h2>
              <Badge variant="outline" className="px-3 py-1">
                Conexões divinas
              </Badge>
            </div>
            
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-6 w-6 text-pink-600" />
                  <span>Anjo da Guarda</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-700 mb-2">{mapa.anjoGuarda}</div>
                <p className="text-muted-foreground">
                  Seu protetor espiritual que te acompanha nesta jornada
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}