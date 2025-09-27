import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, FileText, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { extractNumerologyContent, formatContentForDatabase } from '@/utils/pdfProcessor';

interface PdfContentProcessorProps {
  pdfContent: string;
  onProcessingComplete?: (stats: any) => void;
}

export function PdfContentProcessor({ pdfContent, onProcessingComplete }: PdfContentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const processPdfContent = async () => {
    if (!pdfContent?.trim()) {
      toast({
        title: "Erro",
        description: "Nenhum conteúdo PDF fornecido",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Extract content using advanced processor
      console.log('🔄 Extraindo conteúdo do PDF...');
      const extractedContent = extractNumerologyContent(pdfContent);
      
      console.log(`📊 Encontradas ${extractedContent.length} interpretações`);
      setProgress(20);

      if (extractedContent.length === 0) {
        throw new Error('Nenhuma interpretação numerológica encontrada no PDF');
      }

      let processedCount = 0;
      let newCount = 0;
      let updatedCount = 0;
      const categorias = new Set<string>();

      // Process each extracted content
      for (const [index, parsed] of extractedContent.entries()) {
        const topico = `${parsed.categoria}_${parsed.numero.padStart(2, '0')}`;
        categorias.add(parsed.categoria);

        try {
          // Format content for database
          const dbContent = formatContentForDatabase(parsed);

          // Check if content already exists
          const { data: existing } = await supabase
            .from('conteudos_numerologia')
            .select('id, conteudo')
            .eq('topico', topico)
            .maybeSingle();

          if (existing) {
            // Update existing content
            const { error } = await supabase
              .from('conteudos_numerologia')
              .update({ conteudo: dbContent })
              .eq('topico', topico);

            if (error) throw error;
            updatedCount++;
            console.log(`✅ Atualizado: ${topico}`);
          } else {
            // Insert new content
            const { error } = await supabase
              .from('conteudos_numerologia')
              .insert({
                topico,
                conteudo: dbContent
              });

            if (error) throw error;
            newCount++;
            console.log(`🆕 Criado: ${topico}`);
          }

          processedCount++;
          setProgress(20 + (index / extractedContent.length) * 75);

          // Small delay to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (error) {
          console.error(`❌ Erro ao processar ${topico}:`, error);
        }
      }

      const stats = {
        total_encontradas: extractedContent.length,
        processadas: processedCount,
        novas: newCount,
        atualizadas: updatedCount,
        categorias: Array.from(categorias),
        qualidade_media: calculateAverageQuality(extractedContent)
      };

      setResults(stats);
      setProgress(100);

      toast({
        title: "Processamento Concluído!",
        description: `${processedCount} interpretações processadas com sucesso`,
      });

      onProcessingComplete?.(stats);

    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro no Processamento",
        description: error instanceof Error ? error.message : "Falha ao processar o PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateAverageQuality = (content: any[]): string => {
    const qualities = content.map(c => {
      const formatted = formatContentForDatabase(c);
      return formatted.qualidade === 'alta' ? 3 : formatted.qualidade === 'media' ? 2 : 1;
    });
    
    const average = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    if (average >= 2.5) return 'alta';
    if (average >= 1.5) return 'média';
    return 'baixa';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Processamento do Conteúdo PDF
        </CardTitle>
        <CardDescription>
          Análise e integração automática das interpretações numerológicas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Preview */}
        <div className="space-y-2">
          <h4 className="font-medium">Conteúdo Detectado:</h4>
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">
              {pdfContent?.substring(0, 200)}...
            </p>
            <Badge variant="outline" className="mt-2">
              {Math.round((pdfContent?.length || 0) / 1000)}k caracteres
            </Badge>
          </div>
        </div>

        {/* Processing Controls */}
        {!isProcessing && !results && (
          <Button 
            onClick={processPdfContent} 
            className="w-full"
            size="lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Iniciar Processamento
          </Button>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processando interpretações...</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              {Math.round(progress)}% concluído
            </p>
          </div>
        )}

        {/* Results Summary */}
        {results && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium">Processamento Concluído!</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total encontradas:</span> {results.total_encontradas}
                </div>
                <div>
                  <span className="font-medium">Processadas:</span> {results.processadas}
                </div>
                <div>
                  <span className="font-medium">Novas:</span> {results.novas}
                </div>
                <div>
                  <span className="font-medium">Atualizadas:</span> {results.atualizadas}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Categorias processadas:</div>
                <div className="flex flex-wrap gap-1">
                  {results.categorias.map((cat: string) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Qualidade média do conteúdo: 
                <Badge variant="outline" className="ml-1">
                  {results.qualidade_media}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}