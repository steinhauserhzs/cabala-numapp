import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNumerologyContent } from "@/hooks/useNumerologyContent";

const ADMIN_PERMISSION_NEEDED_MESSAGE = "Funcionalidade disponível para administradores em breve!";

interface ContentCategory {
  name: string;
  topics: string[];
  description: string;
  icon: any;
  color: string;
}

interface ContentCreationWizardProps {
  onClose: () => void;
  onContentCreated: () => void;
  categories: ContentCategory[];
}

type CreationStep = 'type' | 'category' | 'topic' | 'content';
type CreationType = 'new_category' | 'new_topic' | 'new_content';

interface ContentData {
  title: string;
  content: string;
  description?: string;
  characteristics?: string[];
  positive_aspects?: string[];
  challenges?: string[];
  advice?: string[];
  source?: string;
  topic?: string;
  number?: string;
}

export const ContentCreationWizard = ({ onClose, onContentCreated, categories }: ContentCreationWizardProps) => {
  const [step, setStep] = useState<CreationStep>('type');
  const [creationType, setCreationType] = useState<CreationType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: existingContent } = useNumerologyContent();

  // Form data
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    color: 'from-blue-500 to-purple-600'
  });

  const [newTopicData, setNewTopicData] = useState({
    name: '',
    category: ''
  });

  const [contentData, setContentData] = useState<ContentData>({
    title: '',
    content: '',
    description: '',
    characteristics: [],
    positive_aspects: [],
    challenges: [],
    advice: [],
    source: '',
    topic: '',
    number: ''
  });

  const [newArrayItem, setNewArrayItem] = useState('');

  const getNextAvailableNumber = (topicBase: string) => {
    if (!existingContent) return '01';
    
    const existingNumbers = existingContent
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

  const handleCreateContent = async () => {
    if (!selectedTopic || !contentData.title) {
      toast.error("Preencha pelo menos o tópico e título");
      return;
    }

    setIsLoading(true);
    try {
      const topicBase = selectedTopic.replace(/-/g, '_');
      const number = contentData.number || getNextAvailableNumber(topicBase);
      const fullTopic = `${topicBase}_${number}`;

      const contentToSave = {
        title: contentData.title,
        content: contentData.content,
        description: contentData.description,
        characteristics: contentData.characteristics.filter(item => item.trim()),
        positive_aspects: contentData.positive_aspects.filter(item => item.trim()),
        challenges: contentData.challenges.filter(item => item.trim()),
        advice: contentData.advice.filter(item => item.trim()),
        source: contentData.source,
        topic: selectedTopic,
        number: number
      };

      const { error } = await supabase
        .from('conteudos_numerologia')
        .insert({
          topico: fullTopic,
          conteudo: contentToSave
        });

      if (error) throw error;

      toast.success("Conteúdo criado com sucesso!");
      onContentCreated();
    } catch (error: any) {
      console.error('Erro ao criar conteúdo:', error);
      toast.error(error.message || "Erro ao criar conteúdo");
    } finally {
      setIsLoading(false);
    }
  };

  const addToArray = (field: keyof ContentData, value: string) => {
    if (!value.trim()) return;
    
    setContentData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
    setNewArrayItem('');
  };

  const removeFromArray = (field: keyof ContentData, index: number) => {
    setContentData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 'type':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">O que você deseja criar?</h3>
            <div className="grid gap-3">
              <Card 
                className={`cursor-pointer transition-all ${creationType === 'new_category' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCreationType('new_category')}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">Nova Categoria</h4>
                  <p className="text-sm text-muted-foreground">Criar uma nova categoria de conhecimento</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${creationType === 'new_topic' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCreationType('new_topic')}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">Novo Tópico</h4>
                  <p className="text-sm text-muted-foreground">Adicionar um novo tópico a uma categoria existente</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${creationType === 'new_content' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCreationType('new_content')}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">Novo Conteúdo</h4>
                  <p className="text-sm text-muted-foreground">Adicionar conteúdo a um tópico existente</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'category':
        if (creationType === 'new_category') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nova Categoria</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryData.name}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Numerologia Avançada"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Descrição</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategoryData.description}
                    onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da categoria..."
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selecionar Categoria</h3>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <Card 
                    key={category.name}
                    className={`cursor-pointer transition-all ${selectedCategory === category.name ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">{category.topics.length}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        }

      case 'topic':
        if (creationType === 'new_topic') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Novo Tópico</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="topicCategory">Categoria</Label>
                  <Select value={newTopicData.category} onValueChange={(value) => setNewTopicData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topicName">Nome do Tópico</Label>
                  <Input
                    id="topicName"
                    value={newTopicData.name}
                    onChange={(e) => setNewTopicData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: numero_pessoal"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          const categoryTopics = categories.find(cat => cat.name === selectedCategory)?.topics || [];
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selecionar Tópico</h3>
              <div className="grid gap-2">
                {categoryTopics.map((topic) => (
                  <Card 
                    key={topic}
                    className={`cursor-pointer transition-all ${selectedTopic === topic ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <CardContent className="p-3">
                      <span className="font-medium">{topic.replace(/_/g, ' ').replace(/-/g, ' ')}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        }

      case 'content':
        return (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold">Criar Conteúdo</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={contentData.title}
                  onChange={(e) => setContentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do conteúdo"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Conteúdo Principal *</Label>
                <Textarea
                  id="content"
                  value={contentData.content}
                  onChange={(e) => setContentData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo principal..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={contentData.description}
                  onChange={(e) => setContentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição breve..."
                />
              </div>

              <div>
                <Label htmlFor="number">Número (opcional)</Label>
                <Input
                  id="number"
                  value={contentData.number}
                  onChange={(e) => setContentData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder={`Sugestão: ${getNextAvailableNumber(selectedTopic.replace(/-/g, '_'))}`}
                />
              </div>

              {/* Array fields */}
              {['characteristics', 'positive_aspects', 'challenges', 'advice'].map((field) => (
                <div key={field}>
                  <Label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newArrayItem}
                        onChange={(e) => setNewArrayItem(e.target.value)}
                        placeholder={`Adicionar ${field.replace(/_/g, ' ')}`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addToArray(field as keyof ContentData, newArrayItem);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addToArray(field as keyof ContentData, newArrayItem)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(contentData[field as keyof ContentData] as string[] || []).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => removeFromArray(field as keyof ContentData, index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    switch (step) {
      case 'type': return 'Continuar';
      case 'category': return creationType === 'new_category' ? 'Criar Categoria' : 'Continuar';
      case 'topic': return creationType === 'new_topic' ? 'Criar Tópico' : 'Continuar';
      case 'content': return 'Criar Conteúdo';
      default: return 'Continuar';
    }
  };

  const handleNext = () => {
    if (step === 'type' && creationType) {
      if (creationType === 'new_content') {
        setStep('category');
      } else {
        setStep(creationType === 'new_category' ? 'category' : 'category');
      }
    } else if (step === 'category') {
      if (creationType === 'new_category') {
        // TODO: Create category logic
        toast.success("Funcionalidade de criar categoria será implementada em breve!");
        onClose();
      } else {
        setStep('topic');
      }
    } else if (step === 'topic') {
      if (creationType === 'new_topic') {
        // TODO: Create topic logic
        toast.success("Funcionalidade de criar tópico será implementada em breve!");
        onClose();
      } else {
        setStep('content');
      }
    } else if (step === 'content') {
      handleCreateContent();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'type': return !!creationType;
      case 'category': 
        return creationType === 'new_category' 
          ? !!newCategoryData.name && !!newCategoryData.description
          : !!selectedCategory;
      case 'topic':
        return creationType === 'new_topic'
          ? !!newTopicData.name && !!newTopicData.category
          : !!selectedTopic;
      case 'content': return !!contentData.title && !!contentData.content;
      default: return false;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Adicionar Conteúdo</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 'type') {
                  onClose();
                } else if (step === 'category') {
                  setStep('type');
                } else if (step === 'topic') {
                  setStep('category');
                } else if (step === 'content') {
                  setStep('topic');
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {step === 'type' ? 'Cancelar' : 'Voltar'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
            >
              {getNextButtonText()}
              {step !== 'content' && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};