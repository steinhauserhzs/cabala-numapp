import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { getTextoTopico } from "@/services/content";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

interface GuardianAngelCardProps {
  angelName: string;
  birthDate: Date;
}

function parseAngelFromContent(content: string, targetDate: Date): { nome: string; interpretacao: string } {
  if (!content) return { nome: "Anjo Protetor", interpretacao: "Interpretação em preparação." };
  
  const mes = targetDate.getMonth() + 1;
  const dia = targetDate.getDate();
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Pattern: Anjo Nome (DD/MM a DD/MM): description
    const match = line.match(/(\w+)\s*\((\d{1,2})\/(\d{1,2})\s*a\s*(\d{1,2})\/(\d{1,2})\):\s*(.*)/i);
    
    if (match) {
      const [, nome, inicioDiaStr, inicioMesStr, fimDiaStr, fimMesStr, texto] = match;
      
      const inicioMes = parseInt(inicioMesStr);
      const inicioDia = parseInt(inicioDiaStr);
      const fimMes = parseInt(fimMesStr);
      const fimDia = parseInt(fimDiaStr);
      
      // Check if date is in range
      const targetDay = dateToDay(mes, dia);
      const startDay = dateToDay(inicioMes, inicioDia);
      const endDay = dateToDay(fimMes, fimDia);
      
      const isInRange = startDay <= endDay 
        ? (targetDay >= startDay && targetDay <= endDay)
        : (targetDay >= startDay || targetDay <= endDay);
      
      if (isInRange) {
        return { nome: nome.trim(), interpretacao: texto.trim() };
      }
    }
  }
  
  // Fallback to legacy calculation with provided name
  return { nome: "Anjo Protetor", interpretacao: "Anjo da guarda que oferece proteção e orientação espiritual." };
}

function dateToDay(mes: number, dia: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = dia;
  
  for (let i = 0; i < mes - 1; i++) {
    dayOfYear += daysInMonth[i];
  }
  
  return dayOfYear;
}

export function GuardianAngelCard({ angelName, birthDate }: GuardianAngelCardProps) {
  const { data: angelContent, isLoading } = useQuery({
    queryKey: ['angel-content', birthDate.toISOString()],
    queryFn: async () => {
      const content = await getTextoTopico('seu_anjo');
      return parseAngelFromContent(content || '', birthDate);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const angel = angelContent || { nome: angelName, interpretacao: "Carregando interpretação..." };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Anjo da Guarda</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{angel.nome}</p>
          <p className="text-sm text-muted-foreground">Seu protetor espiritual</p>
        </div>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="interpretation">
            <AccordionTrigger>Ver Interpretação</AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando interpretação...</div>
              ) : (
                <p className="text-sm leading-relaxed">{angel.interpretacao}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}