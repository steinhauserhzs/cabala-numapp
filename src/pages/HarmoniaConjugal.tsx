import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AnalysisResult } from '@/components/AnalysisResult';

const HarmoniaConjugal = () => {
  const { user } = useAuth();
  const [partner1Name, setPartner1Name] = useState('');
  const [partner1Date, setPartner1Date] = useState('');
  const [partner2Name, setPartner2Name] = useState('');
  const [partner2Date, setPartner2Date] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Using global profile from main.tsx (no override)

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!partner1Name.trim()) {
      newErrors.partner1Name = 'Nome do primeiro parceiro é obrigatório';
    }
    
    if (!partner1Date) {
      newErrors.partner1Date = 'Data de nascimento é obrigatória';
    }
    
    if (!partner2Name.trim()) {
      newErrors.partner2Name = 'Nome do segundo parceiro é obrigatório';
    }
    
    if (!partner2Date) {
      newErrors.partner2Date = 'Data de nascimento é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsAnalyzing(true);
      try {
        const { calculateCouplCompatibility, saveAnalysis } = await import('@/utils/analysisCalculators');
        
        const parseDate = (dateStr: string) => {
          const [y, m, d] = dateStr.split('-').map(Number);
          return new Date(y, m - 1, d);
        };
        
        const analysis = await calculateCouplCompatibility(
          partner1Name,
          parseDate(partner1Date),
          partner2Name,
          parseDate(partner2Date)
        );
        
        if (user) {
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
          setPartner1Name('');
          setPartner1Date('');
          setPartner2Name('');
          setPartner2Date('');
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
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-glow">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Harmonia Conjugal
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Compatibilidade de Parceiros
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra a compatibilidade numerológica entre você e seu parceiro
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-center text-foreground">Primeiro Parceiro</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="partner1Name" className="text-foreground font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="partner1Name"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={partner1Name}
                    onChange={(e) => setPartner1Name(e.target.value)}
                    className={errors.partner1Name ? 'border-destructive' : ''}
                    disabled={isAnalyzing}
                  />
                  {errors.partner1Name && (
                    <p className="text-sm text-destructive">{errors.partner1Name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner1Date" className="text-foreground font-medium">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="partner1Date"
                    type="date"
                    value={partner1Date}
                    onChange={(e) => setPartner1Date(e.target.value)}
                    className={errors.partner1Date ? 'border-destructive' : ''}
                    disabled={isAnalyzing}
                  />
                  {errors.partner1Date && (
                    <p className="text-sm text-destructive">{errors.partner1Date}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-primary/20 pt-6 space-y-4">
                <h3 className="font-semibold text-center text-foreground">Segundo Parceiro</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="partner2Name" className="text-foreground font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="partner2Name"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={partner2Name}
                    onChange={(e) => setPartner2Name(e.target.value)}
                    className={errors.partner2Name ? 'border-destructive' : ''}
                    disabled={isAnalyzing}
                  />
                  {errors.partner2Name && (
                    <p className="text-sm text-destructive">{errors.partner2Name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner2Date" className="text-foreground font-medium">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="partner2Date"
                    type="date"
                    value={partner2Date}
                    onChange={(e) => setPartner2Date(e.target.value)}
                    className={errors.partner2Date ? 'border-destructive' : ''}
                    disabled={isAnalyzing}
                  />
                  {errors.partner2Date && (
                    <p className="text-sm text-destructive">{errors.partner2Date}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-pink-400 to-rose-400 hover:shadow-glow"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Analisar Compatibilidade
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          O amor verdadeiro está nos números
        </div>
      </div>
    </div>
  );
};

export default HarmoniaConjugal;