import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapaNumerologico } from '@/utils/numerology';
import { useInterpretacao } from '@/hooks/useInterpretacao';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, Sparkles, Heart, Eye, Star, Target, Compass, Brain, Calendar, Clock, Sun } from 'lucide-react';

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
    number, 
    description, 
    icon, 
    category 
  }: {
    title: string;
    number: number;
    description: string;
    icon: React.ReactNode;
    category: string;
  }) => {
    const { interpretacao, isLoading } = useInterpretacao(category, number);
    
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
            <div className={getNumberStyle(number)}>
              {number}
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
                  <>
                    <p className="text-muted-foreground">{interpretacao.descricao}</p>
                    
                    {interpretacao.caracteristicas.length > 0 && (
                      <div>
                        <h5 className="font-medium text-blue-400 mb-1">Características:</h5>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {interpretacao.caracteristicas.map((caracteristica, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                              {caracteristica}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {interpretacao.aspectosPositivos.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-400 mb-1">Aspectos Positivos:</h5>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {interpretacao.aspectosPositivos.map((aspecto, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                              {aspecto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {interpretacao.desafios.length > 0 && (
                      <div>
                        <h5 className="font-medium text-yellow-400 mb-1">Desafios:</h5>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {interpretacao.desafios.map((desafio, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                              {desafio}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Interpretação não disponível para este número.
                  </p>
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
      number: mapa.motivacao,
      description: "O que te motiva internamente",
      icon: <Heart size={20} />,
      category: "motivacao"
    },
    {
      title: "Impressão", 
      number: mapa.impressao,
      description: "Como os outros te veem",
      icon: <Eye size={20} />,
      category: "impressao"
    },
    {
      title: "Expressão",
      number: mapa.expressao, 
      description: "Sua personalidade total",
      icon: <Star size={20} />,
      category: "expressao"
    },
    {
      title: "Destino",
      number: mapa.destino,
      description: "Seu caminho de vida",
      icon: <Target size={20} />,
      category: "destino"
    },
    {
      title: "Missão",
      number: mapa.missao,
      description: "Sua missão nesta vida",
      icon: <Compass size={20} />,
      category: "missao"
    },
    {
      title: "Número Psíquico",
      number: mapa.numeroPsiquico,
      description: "Sua natureza psíquica",
      icon: <Brain size={20} />,
      category: "psiquico"
    }
  ];

  const personalNumbers = [
    {
      title: "Ano Pessoal",
      number: mapa.anoPersonal,
      description: "Energia do ano atual",
      icon: <Calendar size={20} />,
      category: "ano"
    },
    {
      title: "Mês Pessoal", 
      number: mapa.mesPersonal,
      description: "Energia do mês atual",
      icon: <Clock size={20} />,
      category: "mes"
    },
    {
      title: "Dia Pessoal",
      number: mapa.diaPersonal,
      description: "Energia do dia atual", 
      icon: <Sun size={20} />,
      category: "dia"
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
            {coreNumbers.map(num => (
              <NumerologyCard 
                key={num.title}
                title={num.title}
                number={num.number}
                description={num.description}
                icon={num.icon}
                category={num.category}
              />
            ))}
          </div>
        </div>

        {/* Personal Numbers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
            <Calendar className="mr-2 h-6 w-6 text-secondary" />
            Ciclos Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalNumbers.map(num => (
              <NumerologyCard 
                key={num.title}
                title={num.title}
                number={num.number}
                description={num.description}
                icon={num.icon}
                category={num.category}
              />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Resposta Subconsciente
            </CardTitle>
            <CardDescription>
              Baseada na frequência de dígitos na sua data de nascimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={getNumberStyle(mapa.respostaSubconsciente)}>
                {mapa.respostaSubconsciente}
              </div>
              <p className="text-muted-foreground">
                Indica o nível de variedade em suas respostas emocionais e a riqueza de sua natureza subconsciente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-12">
          Mapa gerado pela sabedoria da Numerologia Cabalística
        </div>
      </div>
    </div>
  );
}