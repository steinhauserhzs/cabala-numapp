import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { useNumerologyContent } from "@/hooks/useNumerologyContent";

interface ContentCategory {
  name: string;
  topics: string[];
  description: string;
  icon: any;
  color: string;
}

interface UncategorizedTopicsPanelProps {
  categories: ContentCategory[];
}

export const UncategorizedTopicsPanel = ({ categories }: UncategorizedTopicsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: content } = useNumerologyContent();

  // Get all categorized topics
  const categorizedTopics = new Set<string>();
  categories.forEach(category => {
    category.topics.forEach(topic => {
      categorizedTopics.add(topic);
      categorizedTopics.add(topic.replace(/-/g, '_'));
      categorizedTopics.add(topic.replace(/_/g, '-'));
      categorizedTopics.add(topic.replace(/numero_/g, 'numero-'));
      categorizedTopics.add(topic.replace(/numero-/g, 'numero_'));
    });
  });

  // Find uncategorized topics
  const uncategorizedTopics = new Set<string>();
  content?.forEach(item => {
    const topicBase = item.topico.replace(/_\d+$/, '').replace(/-\d+$/, '');
    if (!categorizedTopics.has(topicBase)) {
      uncategorizedTopics.add(topicBase);
    }
  });

  const uncategorizedArray = Array.from(uncategorizedTopics);

  if (uncategorizedArray.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-800/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base text-orange-800 dark:text-orange-200">
                  Tópicos Não Categorizados
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                  {uncategorizedArray.length}
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              Estes tópicos existem no banco de dados mas não estão mapeados em nenhuma categoria:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {uncategorizedArray.map((topic) => (
                <div 
                  key={topic}
                  className="p-2 bg-white dark:bg-background rounded border border-orange-200 dark:border-orange-800"
                >
                  <span className="text-sm font-medium">{topic.replace(/_/g, ' ').replace(/-/g, ' ')}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {content?.filter(item => item.topico.startsWith(topic)).length}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-700 dark:text-orange-300">
              💡 <strong>Sugestão:</strong> Considere adicionar estes tópicos às categorias existentes ou criar novas categorias para melhor organização.
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};