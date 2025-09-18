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
  const [open, setOpen] = useState(false);
  
  const { data: conteudo, isLoading, error } = useQuery({
    queryKey: ['topico', topico, fallbackTopico],
    queryFn: async () => {
      console.log(`[TopicCard] Fetching content for: ${topico}, fallback: ${fallbackTopico}`);
      let content = await getTextoTopico(topico);
      console.log(`[TopicCard] Primary content for ${topico}:`, content ? `${content.substring(0, 100)}...` : 'NULL');
      
      if (!content && fallbackTopico) {
        console.log(`[TopicCard] Trying fallback: ${fallbackTopico}`);
        content = await getTextoTopico(fallbackTopico);
        console.log(`[TopicCard] Fallback content for ${fallbackTopico}:`, content ? `${content.substring(0, 100)}...` : 'NULL');
      }
      return content;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: open,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleToggle = () => {
    console.log(`Toggling TopicCard ${title}: ${open} -> ${!open}`);
    setOpen(!open);
  };

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
          onClick={handleToggle}
          className="w-full text-left text-sm py-2 px-2 flex items-center justify-between font-medium hover:underline hover:bg-muted/50 rounded transition-colors cursor-pointer z-10 relative"
          aria-expanded={open}
        >
          Ver Conteúdo
          <svg 
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        {open && (
          <div className="mt-2 p-3 border-t border-border">
            {isLoading ? (
              <div className="text-sm text-foreground">Carregando conteúdo...</div>
            ) : error ? (
              <div className="text-sm text-destructive">
                Erro ao carregar conteúdo: {error instanceof Error ? error.message : 'Erro desconhecido'}
              </div>
            ) : conteudo ? (
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {conteudo}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground leading-relaxed">
                Conteúdo indisponível no momento. Tópico: "{topico}"
                {fallbackTopico && `, fallback: "${fallbackTopico}"`}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};