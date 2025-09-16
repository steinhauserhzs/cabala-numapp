import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  success: boolean;
  message: string;
  processedFiles?: string[];
  errors?: string[];
  totalFiles?: number;
  errorCount?: number;
}

export const AdminUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo ZIP.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      console.log('Uploading file:', file.name);

      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('process-numerology-content', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      console.log('Upload result:', data);
      setUploadResult(data);

      if (data.success) {
        toast({
          title: "Sucesso!",
          description: `${data.totalFiles} arquivos processados com sucesso.`,
        });
      } else {
        toast({
          title: "Erro no processamento",
          description: data.message || "Erro desconhecido",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Falha ao processar o arquivo ZIP.",
        variant: "destructive",
      });
      setUploadResult({
        success: false,
        message: "Falha ao processar o arquivo ZIP."
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Administração - Conteúdos de Numerologia
        </h1>
        <p className="text-muted-foreground">
          Faça upload do arquivo ZIP contendo os JSONs dos conteúdos numerológicos.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Conteúdos
          </CardTitle>
          <CardDescription>
            Selecione o arquivo ZIP contendo os arquivos JSON dos conteúdos numerológicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            
            {isUploading && (
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Processando arquivo ZIP...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Resultado do Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className={uploadResult.success ? "text-green-600" : "text-red-600"}>
                {uploadResult.message}
              </p>

              {uploadResult.totalFiles !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {uploadResult.totalFiles}
                    </div>
                    <div className="text-sm text-green-700">Arquivos Processados</div>
                  </div>
                  
                  {uploadResult.errorCount !== undefined && uploadResult.errorCount > 0 && (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {uploadResult.errorCount}
                      </div>
                      <div className="text-sm text-red-700">Erros</div>
                    </div>
                  )}
                </div>
              )}

              {uploadResult.processedFiles && uploadResult.processedFiles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Arquivos Processados:
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {uploadResult.processedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        ✓ {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Erros:</h4>
                  <div className="bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        ✗ {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};