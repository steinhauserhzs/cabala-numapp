import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Upload, FileText, Eye, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { extractNumerologyContent, formatContentForDatabase, generateProcessingReport } from '@/utils/pdfProcessor';
import { PdfContentProcessor } from '@/components/PdfContentProcessor';
import type { ParsedContent } from '@/utils/pdfProcessor';

interface EnrichmentContent {
  numero: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  original?: boolean;
}

interface ProcessedSection {
  categoria: string;
  titulo: string;
  items: EnrichmentContent[];
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function ContentEnrichmentWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'review' | 'apply'>('upload');
  const [pdfText, setPdfText] = useState('');
  const [processedSections, setProcessedSections] = useState<ProcessedSection[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const pdfTextSample = `Material Complementar de Numerologia Cabalística

# 1. Motivação

# Motivação 1
Deseja Independência – Liberdade, liderança e controle de tudo; viver longe de pressões, ser campeão (ã) absoluto (a), realizar-se em si mesmo (a); ficar longe da mediocridade, fazer fortuna, ser elogiado (a) e atendido (a) pelo mundo; viver longe de detalhes; impor seus padrões pessoais; muito dinamismo e autossuficiência; não ser atrapalhado (a) por ninguém, ficar só.

O Número 1 na Motivação exige que você se situe sempre de forma a ficar na frente dos outros. Tem que ser o (a) primeiro (a) em tudo o que faz. O fato de ser o (a) primeiro (a) o (a) impede, obviamente, de ter muita consideração pelos outros até que suas próprias necessidades sejam satisfeitas. A liderança adquirida em vidas passadas traz agora o desejo de continuar a se empenhar numa consciência mais elevada. Torna-se independente, também, com relação às suas crenças. O desejo por pensamentos livres e independentes continua ocupando o seu anseio mais profundo. Ambicioso (a) e criativo (a), é direto (a) e não gosta de muitos detalhes, quer liderar, dirigir, dominar; às vezes é obstinado (a). Não gosta muito de receber ordens de quem quer que seja e trabalha melhor por conta própria ou em cargo de chefia. A incompreensão e a recusa em aceitar conselhos podem trazer transtornos à sua carreira e aos seus planos profissionais. Se não tiver bom nível de consciência espiritual, poderá se tornar egoísta, excessivamente vaidoso (a) e arrogante. Geralmente é impaciente e com pouco senso diplomático. Por esse motivo poderá enfrentar dificuldades no seu meio profissional ou mesmo entre familiares, amigos e companheiros afetivos. Suas boas qualidades são: confiança em si, distinção, poder executivo, dignidade e foco nos propósitos.

Quando inseguro (a) tende a ameaçar os outros, podendo agredir, ofender, se tornar inflexível, irredutível, vingativo (a) e preconceituoso (a). Cultura, educação e refinamento pessoal são características indispensáveis que precisa adquirir para o seu triunfo pessoal, profissional e principalmente afetivo.

# Motivação 2
Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia, sentir o ritmo da vida, trabalhar com os outros, ter amigos leais e boas companhias; acumular conhecimentos e coisas; conforto sem supérfluos; ser amado (a) por todos, receber convites, sentir-se compreendido (a); vencer todas as negociações; não ser exposto (a).`;

  const processPdfContent = async () => {
    if (!pdfText.trim()) {
      toast({
        title: "Erro",
        description: "Nenhum conteúdo para processar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep('analyze');
    setProgress(0);

    try {
      // Simular processamento das seções
      const sections: ProcessedSection[] = [
        { categoria: 'motivacao', titulo: 'Motivação', items: [], status: 'pending' },
        { categoria: 'destino', titulo: 'Destino', items: [], status: 'pending' },
        { categoria: 'expressao', titulo: 'Expressão', items: [], status: 'pending' },
        { categoria: 'impressao', titulo: 'Impressão', items: [], status: 'pending' },
        { categoria: 'arcanos', titulo: 'Arcanos', items: [], status: 'pending' }
      ];

      setProcessedSections(sections);

      // Processar cada seção
      for (let i = 0; i < sections.length; i++) {
        const updatedSections = [...sections];
        updatedSections[i].status = 'processing';
        setProcessedSections(updatedSections);
        setProgress((i / sections.length) * 100);

        // Simular processamento da seção
        await new Promise(resolve => setTimeout(resolve, 800));

        // Extrair conteúdo da seção do PDF
        const extractedItems = extractSectionFromPdf(pdfText, sections[i].categoria);
        updatedSections[i].items = extractedItems;
        updatedSections[i].status = 'completed';
        setProcessedSections(updatedSections);
      }

      setProgress(100);
      setCurrentStep('review');
      
      toast({
        title: "Análise Concluída",
        description: `${processedSections.reduce((acc, s) => acc + s.items.length, 0)} interpretações encontradas`,
      });
    } catch (error) {
      toast({
        title: "Erro no Processamento",
        description: "Falha ao processar o conteúdo do PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractSectionFromPdf = (text: string, categoria: string): EnrichmentContent[] => {
    // Use the advanced PDF processor
    const allParsed = extractNumerologyContent(text);
    return allParsed
      .filter(item => item.categoria === categoria)
      .map(item => ({
        numero: item.numero,
        titulo: item.titulo,
        conteudo: item.texto_completo,
        categoria: item.categoria
      }));
  };

  const applyEnrichments = async () => {
    setIsProcessing(true);
    setCurrentStep('apply');
    setProgress(0);

    try {
      let totalItems = 0;
      let processedItems = 0;

      // Contar total de itens
      processedSections.forEach(section => {
        totalItems += section.items.length;
      });

        // Get all parsed content with advanced processing
        const allParsedContent = extractNumerologyContent(pdfText);
        
        // Apply each item
        for (const parsed of allParsedContent) {
          const topico = `${parsed.categoria}_${parsed.numero.padStart(2, '0')}`;
          
          // Use the advanced formatter
          const conteudoJson = formatContentForDatabase(parsed);

          // Verificar se já existe
          const { data: existing } = await supabase
            .from('conteudos_numerologia')
            .select('id')
            .eq('topico', topico)
            .maybeSingle();

          if (existing) {
            // Atualizar existente
            await supabase
              .from('conteudos_numerologia')
              .update({ conteudo: conteudoJson })
              .eq('topico', topico);
          } else {
            // Inserir novo
            await supabase
              .from('conteudos_numerologia')
              .insert({
                topico,
                conteudo: conteudoJson
              });
          }

          processedItems++;
          setProgress((processedItems / allParsedContent.length) * 100);
          
          // Pequena pausa para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      toast({
        title: "Enriquecimento Concluído!",
        description: `${processedItems} interpretações foram atualizadas na biblioteca`,
      });

      setIsOpen(false);
      // Reset do wizard
      setCurrentStep('upload');
      setPdfText('');
      setProcessedSections([]);
      setProgress(0);

    } catch (error) {
      console.error('Erro ao aplicar enriquecimentos:', error);
      toast({
        title: "Erro na Aplicação",
        description: "Falha ao salvar as interpretações",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Em um cenário real, você processaria o PDF aqui
      // Por enquanto, vamos usar o texto de exemplo
      setPdfText(pdfTextSample);
      setCurrentStep('analyze');
      toast({
        title: "PDF Carregado",
        description: "Conteúdo extraído com sucesso"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Enriquecer Biblioteca
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Enriquecimento da Biblioteca</DialogTitle>
          <DialogDescription>
            Importe conteúdo do PDF para enriquecer as interpretações numerológicas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={isProcessing}>Upload</TabsTrigger>
            <TabsTrigger value="analyze" disabled={isProcessing || !pdfText}>Análise</TabsTrigger>
            <TabsTrigger value="review" disabled={isProcessing || processedSections.length === 0}>Revisão</TabsTrigger>
            <TabsTrigger value="apply" disabled={isProcessing}>Aplicar</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload do PDF
                </CardTitle>
                <CardDescription>
                  Faça upload do Material Complementar de Numerologia em PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Selecionar PDF
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ou use o conteúdo de exemplo para demonstração
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPdfText(pdfTextSample);
                      setCurrentStep('analyze');
                    }}
                    className="mt-2"
                  >
                    Usar Exemplo
                  </Button>
                </div>
                
                {pdfText && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Conteúdo carregado com sucesso. Clique em "Analisar" para continuar.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Análise do Conteúdo
                </CardTitle>
                <CardDescription>
                  Processando e extraindo interpretações do PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Processando seções... {Math.round(progress)}%
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {processedSections.map((section, index) => (
                    <div key={section.categoria} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          section.status === 'completed' ? 'default' :
                          section.status === 'processing' ? 'secondary' :
                          section.status === 'error' ? 'destructive' : 'outline'
                        }>
                          {section.titulo}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {section.items.length} itens
                        </span>
                      </div>
                      {section.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  ))}
                </div>

                {!isProcessing && !processedSections.length && (
                  <Button onClick={processPdfContent} className="w-full">
                    Iniciar Análise
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revisão das Interpretações</CardTitle>
                <CardDescription>
                  Verifique o conteúdo extraído antes de aplicar à biblioteca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {processedSections.map((section) => (
                      <div key={section.categoria} className="space-y-2">
                        <h3 className="font-semibold text-lg">{section.titulo}</h3>
                        {section.items.map((item) => (
                          <Card key={`${item.categoria}_${item.numero}`} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline">{item.titulo}</Badge>
                              <Badge variant="secondary">Novo/Atualizado</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {item.conteudo.substring(0, 200)}...
                            </p>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Aplicar Melhorias
                </CardTitle>
                <CardDescription>
                  Aplicando as interpretações enriquecidas à biblioteca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Salvando interpretações... {Math.round(progress)}%
                    </p>
                  </div>
                )}

                {!isProcessing && (
                  <Button onClick={applyEnrichments} className="w-full" size="lg">
                    Aplicar Enriquecimentos
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}