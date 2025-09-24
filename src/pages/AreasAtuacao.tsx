import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AnalysisResult } from '@/components/AnalysisResult';
import { gerarMapaNumerologico } from '@/utils/numerology';
import { getInterpretacao } from '@/services/content';

export default function AreasAtuacao() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [currentProfession, setCurrentProfession] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsAnalyzing(true);
      try {
        const parseDate = (dateStr: string) => {
          const [y, m, d] = dateStr.split('-').map(Number);
          return new Date(y, m - 1, d);
        };
        
        const date = parseDate(birthDate);
        const numerologyMap = gerarMapaNumerologico(fullName, date);
        
        // Usar número da expressão para análise de áreas de atuação
        const areaNumber = numerologyMap.expressao;
        const interpretation = await getInterpretacao('areas_de_atuacao', areaNumber.toString().padStart(2, '0'));
        
        const analysis = {
          type: 'areas-atuacao',
          input: { fullName, birthDate, currentProfession },
          mainNumber: areaNumber,
          interpretation: interpretation || `Análise profissional baseada no número ${areaNumber}.`,
          recommendations: [
            "Busque profissões que utilizem seus talentos naturais",
            "Desenvolva as habilidades sugeridas pela numerologia",
            "Considere mudanças de carreira em momentos propícios",
            "Mantenha sempre a ética e integridade profissional"
          ],
          additionalInfo: `Expressão: ${numerologyMap.expressao} | Destino: ${numerologyMap.destino} | Missão: ${numerologyMap.missao}`
        };
        
        // Salvar análise se usuário logado
        if (user) {
          const { saveAnalysis } = await import('@/utils/analysisCalculators');
          await saveAnalysis(analysis, user.id);
        }
        
        setResult(analysis);
      } catch (error) {
        console.error('Erro na análise:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  if (result) {
    return (
      <AnalysisResult 
        result={result} 
        onNewAnalysis={() => {
          setResult(null);
          setFullName('');
          setBirthDate('');
          setCurrentProfession('');
        }}
      />
    );
  }

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
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-glow">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Áreas de Atuação
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Orientação Profissional
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra as melhores áreas profissionais para seu perfil numerológico
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
                  disabled={isAnalyzing}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
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
                  disabled={isAnalyzing}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentProfession" className="text-foreground font-medium">
                  Profissão Atual (Opcional)
                </Label>
                <Input
                  id="currentProfession"
                  type="text"
                  placeholder="Ex: Advogado, Empresário, Estudante"
                  value={currentProfession}
                  onChange={(e) => setCurrentProfession(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">A análise incluirá:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Áreas profissionais mais compatíveis</li>
                  <li>• Talentos naturais e habilidades</li>
                  <li>• Sugestões de desenvolvimento de carreira</li>
                  <li>• Períodos favoráveis para mudanças</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-blue-400 to-cyan-400 hover:shadow-glow"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-5 w-5" />
                    Analisar Áreas de Atuação
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Sua vocação está escrita nos números
        </div>
      </div>
    </div>
  );
}