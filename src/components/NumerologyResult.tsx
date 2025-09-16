import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapaNumerologico } from '@/utils/numerology';
import { useInterpretacao } from '@/hooks/useInterpretacao';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, Sparkles, Heart, Eye, Star, Target, Compass, Brain, Calendar, Clock, Sun, BookOpen, AlertTriangle, Zap, Mountain, Palette, Users, Triangle } from 'lucide-react';
import { TopicCard } from './TopicCard';

interface NumerologyResultProps {
  mapa: MapaNumerologico;
  name: string;
  birthDate: Date;
  onBack: () => void;
}

export function NumerologyResult({ mapa, name, birthDate, onBack }: NumerologyResultProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getNumberStyle = (number: number) => {
    const isMaster = number === 11 || number === 22;
    return isMaster 
      ? "text-2xl font-bold text-secondary animate-glow" 
      : "text-2xl font-bold text-primary";
  };

  const NumerologyCard = ({ 
    title, 
    value, 
    description, 
    icon, 
    categoria 
  }: {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    categoria: string;
  }) => {
    const { interpretacao, isLoading } = useInterpretacao(categoria, value);
    
    return (
      <Card className="group hover:scale-105 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {icon}
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
              </div>
            </div>
            <div className={getNumberStyle(value)}>
              {value}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="interpretation" className="border-none">
              <AccordionTrigger className="text-sm hover:no-underline py-2">
                Ver interpretação
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : interpretacao ? (
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {interpretacao}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Não há interpretação específica para este número neste tópico.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  const coreNumbers = [
    {
      title: "Motivação",
      value: mapa.motivacao,
      description: "O que te motiva internamente",
      categoria: "motivacao",
      icon: <Heart size={20} />
    },
    {
      title: "Impressão", 
      value: mapa.impressao,
      description: "Como os outros te veem",
      categoria: "impressao",
      icon: <Eye size={20} />
    },
    {
      title: "Expressão",
      value: mapa.expressao, 
      description: "Sua personalidade total",
      categoria: "expressao",
      icon: <Star size={20} />
    },
    {
      title: "Destino",
      value: mapa.destino,
      description: "Seu caminho de vida",
      categoria: "destino",
      icon: <Target size={20} />
    },
    {
      title: "Missão",
      value: mapa.missao,
      description: "Sua missão nesta vida",
      categoria: "missao",
      icon: <Compass size={20} />
    },
    {
      title: "Número Psíquico",
      value: mapa.numeroPsiquico,
      description: "Sua natureza psíquica",
      categoria: "numero_psiquico",
      icon: <Brain size={20} />
    }
  ];

  const karmaNumbers = [
    {
      title: "Lições Cármicas",
      values: mapa.licoesCarmicas,
      description: "Números ausentes no seu nome",
      categoria: "licoes_carmicas",
      icon: <BookOpen size={20} />
    },
    {
      title: "Dívidas Cármicas", 
      values: mapa.dividasCarmicas,
      description: "Desafios de vidas passadas",
      categoria: "dividas_carmicas",
      icon: <AlertTriangle size={20} />
    },
    {
      title: "Tendências Ocultas",
      values: mapa.tendenciasOcultas, 
      description: "Números em excesso no seu nome",
      categoria: "tendencias_ocultas",
      icon: <Zap size={20} />
    }
  ];

  // Ciclos de vida removed from interface - using desafios instead

  const challengeNumbers = [
    {
      title: "1º Desafio",
      value: mapa.desafios.primeiro,
      description: "Primeiro desafio de vida",
      categoria: "desafios",
      icon: <Mountain size={20} />
    },
    {
      title: "2º Desafio",
      value: mapa.desafios.segundo,
      description: "Segundo desafio de vida", 
      categoria: "desafios",
      icon: <Mountain size={20} />
    },
    {
      title: "Desafio Principal",
      value: mapa.desafios.principal,
      description: "Desafio principal de vida",
      categoria: "desafios", 
      icon: <Mountain size={20} />
    }
  ];

  const decisionNumbers = [
    {
      title: "1º Momento Decisivo",
      value: mapa.momentosDecisivos.primeiro,
      description: "Primeiro momento decisivo",
      categoria: "primeiro_momento",
      icon: <Clock size={20} />
    },
    {
      title: "2º Momento Decisivo", 
      value: mapa.momentosDecisivos.segundo,
      description: "Segundo momento decisivo",
      categoria: "segundo_momento",
      icon: <Clock size={20} />
    },
    {
      title: "3º Momento Decisivo",
      value: mapa.momentosDecisivos.terceiro,
      description: "Terceiro momento decisivo", 
      categoria: "terceiro_momento",
      icon: <Clock size={20} />
    },
    {
      title: "4º Momento Decisivo",
      value: mapa.momentosDecisivos.quarto,
      description: "Quarto momento decisivo",
      categoria: "quarto_momento", 
      icon: <Clock size={20} />
    }
  ];

  const personalNumbers = [
    {
      title: "Ano Pessoal",
      value: mapa.anoPersonal,
      description: "Energia do ano atual",
      categoria: "ano_pessoal",
      icon: <Calendar size={20} />
    },
    {
      title: "Mês Pessoal", 
      value: mapa.mesPersonal,
      description: "Energia do mês atual",
      categoria: "mes_pessoal",
      icon: <Clock size={20} />
    },
    {
      title: "Dia Pessoal",
      value: mapa.diaPersonal,
      description: "Energia do dia atual", 
      categoria: "dia_pessoal",
      icon: <Sun size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mystical">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="cosmic" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </Button>
          
          <Button variant="secondary" className="flex items-center space-x-2">
            <Download size={16} />
            <span>Exportar PDF</span>
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-cosmic bg-clip-text text-transparent">
            Mapa Numerológico Cabalístico
          </h1>
          <div className="text-lg text-secondary">
            {name}
          </div>
          <div className="text-sm text-muted-foreground">
            Nascido em {formatDate(birthDate)}
          </div>
        </div>

        {/* Core Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
            <Sparkles className="mr-2 h-6 w-6 text-primary" />
            Núcleos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreNumbers.map(item => (
              <NumerologyCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Karma Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            Aspectos Cármicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {karmaNumbers.map((item) => (
              <div key={item.title} className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {item.icon}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="text-2xl font-bold mb-2 text-primary">
                  {item.values.length > 0 ? item.values.join(', ') : 'Nenhum'}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Removed Cycle Numbers section - not in current interface */}

        {/* Challenge Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            Desafios de Vida
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challengeNumbers.map(item => (
              <NumerologyCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Decision Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary">
            Momentos Decisivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {decisionNumbers.map(item => (
              <NumerologyCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Personal Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
            <Calendar className="mr-2 h-6 w-6 text-secondary" />
            Ciclos Pessoais Atuais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalNumbers.map(item => (
              <NumerologyCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Resposta Subconsciente */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Resposta Subconsciente</h2>
          <div className="max-w-md mx-auto">
            <NumerologyCard
              title="Resposta Subconsciente"
              value={mapa.respostaSubconsciente}
              description="Como você reage instintivamente às situações"
              categoria="resposta_subconsciente"
              icon={<Brain size={20} />}
            />
          </div>
        </div>

        {/* Tópicos Adicionais */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Informações Complementares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopicCard
              icon={<Star className="h-5 w-5 text-yellow-500" />}
              title="Seu Anjo"
              description="Seu anjo protetor e suas características"
              topico="seu_anjo"
            />
            <TopicCard
              icon={<Palette className="h-5 w-5 text-blue-500" />}
              title="Cores Pessoais"
              description="Cores que harmonizam com sua energia"
              topico="cores_do_dia"
            />
            <TopicCard
              icon={<Calendar className="h-5 w-5 text-green-500" />}
              title="Dias Favoráveis"
              description="Os melhores dias para suas atividades"
              topico="dias_favoraveis"
            />
            <TopicCard
              icon={<Zap className="h-5 w-5 text-purple-500" />}
              title="Números Harmônicos"
              description="Números que vibram em sua frequência"
              topico="numeros_harmonicos"
            />
            <TopicCard
              icon={<Users className="h-5 w-5 text-pink-500" />}
              title="Harmonia Conjugal"
              description="Compatibilidade nos relacionamentos"
              topico="harmonia_conjugal"
            />
            <TopicCard
              icon={<Triangle className="h-5 w-5 text-orange-500" />}
              title="Triângulo Invertido da Vida"
              description="Aspectos profundos de sua jornada"
              topico="triangulo_invertido"
            />
          </div>
        </div>

        {/* Conclusão */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Conclusão</h2>
          <div className="max-w-4xl mx-auto">
            <TopicCard
              icon={<BookOpen className="h-5 w-5 text-indigo-500" />}
              title="Síntese do Mapa"
              description="Conclusão e orientações finais"
              topico="conclusao"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-12">
          Mapa gerado pela sabedoria da Numerologia Cabalística
        </div>
      </div>
    </div>
  );
}