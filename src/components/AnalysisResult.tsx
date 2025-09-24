import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Star, Heart, CheckCircle, Share2, Download } from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '@/utils/analysisCalculators';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onSave?: () => void;
  onShare?: () => void;
  onNewAnalysis?: () => void;
}

export function AnalysisResult({ result, onSave, onShare, onNewAnalysis }: AnalysisResultProps) {
  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 80) return 'text-green-600';
    if (compatibility >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityText = (compatibility: number) => {
    if (compatibility >= 80) return 'Excelente';
    if (compatibility >= 60) return 'Boa';
    if (compatibility >= 40) return 'Regular';
    return 'Baixa';
  };

  const typeLabels: { [key: string]: string } = {
    'harmonia-conjugal': 'Harmonia Conjugal',
    'correcao-assinatura': 'Correção de Assinatura',
    'endereco': 'Análise de Endereço',
    'placa': 'Análise de Placa',
    'telefone': 'Análise de Telefone'
  };

  return (
    <div className="min-h-screen bg-gradient-mystical p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card/95 shadow-mystical border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-glow">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              {typeLabels[result.type]}
            </CardTitle>
            <CardDescription className="text-lg">
              Resultado da Análise Numerológica
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Result */}
        <Card className="bg-card/95 shadow-mystical border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Número Principal</span>
              <Badge variant="secondary" className="text-2xl px-4 py-2">
                {result.mainNumber}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {result.interpretation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility */}
        {result.compatibility !== undefined && (
          <Card className="bg-card/95 shadow-mystical border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Compatibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Nível de Compatibilidade:</span>
                <span className={`text-lg font-bold ${getCompatibilityColor(result.compatibility)}`}>
                  {getCompatibilityText(result.compatibility)} ({result.compatibility}%)
                </span>
              </div>
              <Progress value={result.compatibility} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="bg-card/95 shadow-mystical border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Additional Info */}
        {result.additionalInfo && (
          <Card className="bg-card/95 shadow-mystical border-primary/20">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-mono text-sm bg-muted/50 p-4 rounded-lg">
                {result.additionalInfo}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="bg-card/95 shadow-mystical border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onSave && (
                <Button 
                  onClick={onSave} 
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Salvar Análise
                </Button>
              )}
              
              {onShare && (
                <Button 
                  onClick={onShare} 
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              )}
              
              {onNewAnalysis && (
                <Button 
                  onClick={onNewAnalysis} 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-glow"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Nova Análise
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}