import { Badge } from '@/components/ui/badge';
import type { NumerologyContent } from '@/hooks/useNumerologyContent';

interface TopicCardProps {
  content: NumerologyContent;
  onClick: () => void;
}

export function TopicCard({ content, onClick }: TopicCardProps) {
  return (
    <div
      className="p-3 rounded-md bg-background border cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm capitalize">
          {content.topico.replace(/_/g, ' ')}
        </span>
        <Badge variant="outline" className="text-xs">
          {content.categoria || 'Sem categoria'}
        </Badge>
      </div>
    </div>
  );
}