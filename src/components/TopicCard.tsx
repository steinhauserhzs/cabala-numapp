import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  const [open, setOpen] = useState(false);

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
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full text-left text-sm py-2 flex items-center justify-between font-medium hover:underline"
          aria-expanded={open}
        >
          Ver Conteúdo
          <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {open && (
          isLoading ? (
            <div className="text-sm text-foreground">Carregando conteúdo...</div>
          ) : conteudo ? (
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {conteudo}
            </div>
          ) : (
            <div className="text-sm text-foreground leading-relaxed">
              Conteúdo indisponível no momento. Em breve adicionaremos este tópico.
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};