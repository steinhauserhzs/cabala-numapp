import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { getTextoTopico } from '@/services/content';

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  topico: string;
  fallbackTopico?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({ icon, title, description, topico, fallbackTopico }) => {
  const { data: conteudo, isLoading } = useQuery({
    queryKey: ['topico', topico, fallbackTopico],
    queryFn: async () => {
      let content = await getTextoTopico(topico);
      if (!content && fallbackTopico) {
        content = await getTextoTopico(fallbackTopico);
      }
      return content;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="content">
            <AccordionTrigger className="text-sm py-2">
              Ver Conteúdo
            </AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Carregando conteúdo...
                </div>
              ) : conteudo ? (
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {conteudo}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Conteúdo não disponível para este tópico.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};