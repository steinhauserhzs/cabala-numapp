import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const UploadProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processZipFile = async (file: File) => {
    setProcessing(true);
    
    try {
      console.log(`📁 Processando arquivo: ${file.name} (${file.size} bytes)`);
      
      // Create FormData to send to the edge function
      const formData = new FormData();
      formData.append('file', file);

      // Call the existing edge function
      const { data, error } = await supabase.functions.invoke('process-numerology-content', {
        body: formData,
      });

      if (error) {
        console.error('Error processing file:', error);
        toast.error('Erro ao processar arquivo');
        return;
      }

      console.log('Processing result:', data);
      toast.success(`Processamento concluído: ${data.totalFiles} arquivos processados`);
      
      if (data.errors && data.errors.length > 0) {
        console.warn('Processing errors:', data.errors);
        toast.warning(`${data.errorCount} arquivos com erro`);
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao processar arquivo');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      await processZipFile(file);
    } else {
      toast.error('Por favor, selecione um arquivo ZIP');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          disabled={processing}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        Selecione o arquivo ZIP com os conteúdos de numerologia organizados por tópico e número.
      </div>
      
      {processing && (
        <div className="text-sm text-primary">
          Processando arquivos... Isso pode levar alguns minutos.
        </div>
      )}
    </div>
  );
};