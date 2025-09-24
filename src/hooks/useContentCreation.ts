import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentCreationData {
  title: string;
  content: string;
  description?: string;
  characteristics?: string[];
  positive_aspects?: string[];
  challenges?: string[];
  advice?: string[];
  source?: string;
  topic: string;
  number?: string;
}

export const useContentCreation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createContent = async (data: ContentCreationData) => {
    setIsLoading(true);
    try {
      const topicBase = data.topic.replace(/-/g, '_');
      const number = data.number || '01';
      const fullTopic = `${topicBase}_${number}`;

      const contentToSave = {
        title: data.title,
        content: data.content,
        description: data.description || '',
        characteristics: data.characteristics?.filter(item => item.trim()) || [],
        positive_aspects: data.positive_aspects?.filter(item => item.trim()) || [],
        challenges: data.challenges?.filter(item => item.trim()) || [],
        advice: data.advice?.filter(item => item.trim()) || [],
        source: data.source || '',
        topic: data.topic,
        number: number
      };

      const { error } = await supabase
        .from('conteudos_numerologia')
        .insert({
          topico: fullTopic,
          conteudo: contentToSave
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Já existe conteúdo para este tópico e número. Tente outro número.');
        }
        throw error;
      }

      toast.success('Conteúdo criado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao criar conteúdo:', error);
      toast.error(error.message || 'Erro ao criar conteúdo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getNextAvailableNumber = (content: any[], topicBase: string) => {
    if (!content) return '01';
    
    const existingNumbers = content
      .filter(item => item.topico.startsWith(topicBase))
      .map(item => {
        const match = item.topico.match(/_(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (const num of existingNumbers) {
      if (num === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }

    return nextNumber.toString().padStart(2, '0');
  };

  return {
    createContent,
    getNextAvailableNumber,
    isLoading
  };
};