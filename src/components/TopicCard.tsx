import { Badge } from '@/components/ui/badge';
import type { NumerologyContent } from '@/hooks/useNumerologyContent';

interface TopicCardProps {
  content: NumerologyContent;
  onClick: () => void;
}

// Helper function to get display name for topics
function getDisplayName(topico: string): string {
  const displayNames: Record<string, string> = {
    'anjo_01': 'Anjo 1 - Vehuiah',
    'anjo_02': 'Anjo 2 - Jeliel', 
    'anjo_03': 'Anjo 3 - Sitael',
    'anjo_04': 'Anjo 4 - Elemiah',
    'anjo_05': 'Anjo 5 - Mahasiah',
    'motivacao_01': 'Motivação 1',
    'motivacao_02': 'Motivação 2',
    'motivacao_03': 'Motivação 3',
    'motivacao_04': 'Motivação 4',
    'motivacao_05': 'Motivação 5',
    'motivacao_06': 'Motivação 6',
    'motivacao_07': 'Motivação 7',
    'motivacao_08': 'Motivação 8',
    'motivacao_09': 'Motivação 9',
    'motivacao_11': 'Motivação 11',
    'motivacao_22': 'Motivação 22',
    'destino_01': 'Destino 1',
    'destino_02': 'Destino 2',
    'destino_03': 'Destino 3',
    'destino_04': 'Destino 4',
    'destino_05': 'Destino 5',
    'destino_06': 'Destino 6',
    'destino_07': 'Destino 7',
    'destino_08': 'Destino 8',
    'destino_09': 'Destino 9',
    'destino_11': 'Destino 11',
    'destino_22': 'Destino 22',
  };
  
  // If we have a specific display name, use it
  if (displayNames[topico]) {
    return displayNames[topico];
  }
  
  // Handle anjo patterns (anjo_XX)
  if (topico.startsWith('anjo_') && topico.length > 5) {
    const number = topico.substring(5);
    return `Anjo ${parseInt(number, 10)}`;
  }
  
  // Handle other patterns (topic_XX)
  const match = topico.match(/^([a-z_]+)_(\d+)$/);
  if (match) {
    const [, topic, number] = match;
    const topicName = topic.replace(/_/g, ' ');
    return `${topicName.charAt(0).toUpperCase() + topicName.slice(1)} ${parseInt(number, 10)}`;
  }
  
  // Default: replace underscores with spaces and capitalize
  return topico.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function TopicCard({ content, onClick }: TopicCardProps) {
  return (
    <div
      className="p-3 rounded-md bg-background border cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">
          {getDisplayName(content.topico)}
        </span>
        <Badge variant="outline" className="text-xs">
          {content.categoria || 'Sem categoria'}
        </Badge>
      </div>
    </div>
  );
}