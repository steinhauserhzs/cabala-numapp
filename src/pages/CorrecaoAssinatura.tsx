import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setActiveProfile, gerarMapaNumerologico } from '@/utils/numerology';
import { PERFIL_CONECTA } from '@/utils/numerology-profile';

const CorrecaoAssinatura = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [currentSignature, setCurrentSignature] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profession, setProfession] = useState('');
  const [objective, setObjective] = useState('');
  const [observations, setObservations] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set consistent numerology profile
  useEffect(() => {
    setActiveProfile(PERFIL_CONECTA);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!currentSignature.trim()) {
      newErrors.currentSignature = 'Assinatura atual é obrigatória';
    }
    
    if (!birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (!objective) {
      newErrors.objective = 'Objetivo da correção é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const parseDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      };
      
      const date = parseDate(birthDate);
      const fullNameMap = gerarMapaNumerologico(fullName, date);
      const signatureMap = gerarMapaNumerologico(currentSignature, date);
      
      console.log('Signature analysis:', { 
        fullName, 
        currentSignature, 
        birthDate, 
        profession, 
        objective, 
        observations,
        fullNameNumerology: fullNameMap,
        signatureNumerology: signatureMap
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mystical flex items-center justify-center p-4">
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
      
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <Link to="/dashboard">
            <Button variant="outline">
              Dashboard
            </Button>
          </Link>
        </div>
      )}

      <div className="w-full max-w-md">
        <Card className="bg-card shadow-mystical border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-glow">
                <PenTool className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Correção de Assinatura
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Otimização Energética
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforme sua assinatura em um poderoso instrumento de sucesso
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSignature" className="text-foreground font-medium">
                  Como você assina atualmente?
                </Label>
                <Input
                  id="currentSignature"
                  type="text"
                  placeholder="Ex: João Silva, J. Silva, João S."
                  value={currentSignature}
                  onChange={(e) => setCurrentSignature(e.target.value)}
                  className={errors.currentSignature ? 'border-destructive' : ''}
                />
                {errors.currentSignature && (
                  <p className="text-sm text-destructive">{errors.currentSignature}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Descreva como você escreve sua assinatura
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-foreground font-medium">
                  Data de Nascimento
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={errors.birthDate ? 'border-destructive' : ''}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-foreground font-medium">
                  Profissão (Opcional)
                </Label>
                <Input
                  id="profession"
                  type="text"
                  placeholder="Ex: Advogado, Empresário, Artista"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-foreground font-medium">
                  Objetivo da Correção
                </Label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger className={errors.objective ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sucesso-profissional">Sucesso Profissional</SelectItem>
                    <SelectItem value="prosperidade-financeira">Prosperidade Financeira</SelectItem>
                    <SelectItem value="lideranca">Liderança</SelectItem>
                    <SelectItem value="criatividade">Criatividade</SelectItem>
                    <SelectItem value="comunicacao">Comunicação</SelectItem>
                    <SelectItem value="equilibrio-emocional">Equilíbrio Emocional</SelectItem>
                    <SelectItem value="protecao-energetica">Proteção Energética</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.objective && (
                  <p className="text-sm text-destructive">{errors.objective}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations" className="text-foreground font-medium">
                  Observações Adicionais
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Conte-nos mais sobre seus objetivos ou situações específicas..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">A análise incluirá:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Avaliação numerológica da assinatura atual</li>
                  <li>• Sugestões de melhorias específicas</li>
                  <li>• Técnicas de escrita para potencializar energia</li>
                  <li>• Orientações para implementação gradual</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-indigo-400 to-purple-400 hover:shadow-glow"
              >
                <PenTool className="mr-2 h-5 w-5" />
                Analisar Assinatura
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Sua assinatura é a manifestação gráfica da sua energia
        </div>
      </div>
    </div>
  );
};

export default CorrecaoAssinatura;