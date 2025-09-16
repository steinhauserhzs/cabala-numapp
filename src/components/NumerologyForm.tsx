import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Stars, Moon } from 'lucide-react';

interface NumerologyFormProps {
  onSubmit: (name: string, birthDate: Date) => void;
}

export function NumerologyForm({ onSubmit }: NumerologyFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});

  const parseLocalDate = (isoDate: string) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const validateForm = () => {
    const newErrors: { name?: string; birthDate?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else {
      const date = parseLocalDate(birthDate);
      const today = new Date();
      if (date > today) {
        newErrors.birthDate = 'Data não pode ser no futuro';
      }
      if (date.getFullYear() < 1900) {
        newErrors.birthDate = 'Data muito antiga';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const date = parseLocalDate(birthDate);
      onSubmit(name.trim(), date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mystical flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Floating mystical elements */}
        <div className="absolute -top-10 -left-10 text-primary/40 animate-float">
          <Stars size={24} />
        </div>
        <div className="absolute -top-8 -right-8 text-primary/30 animate-float" style={{ animationDelay: '2s' }}>
          <Moon size={20} />
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-primary/30 animate-float" style={{ animationDelay: '4s' }}>
          <Sparkles size={18} />
        </div>

        <Card className="bg-card shadow-mystical border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-cosmic shadow-glow">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
                Numapp
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Numerologia Cabalística
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra os segredos do seu mapa numerológico através da sabedoria milenar da Cabala
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
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
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="mystical" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Gerar Mapa Numerológico
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Os números revelam os mistérios da alma
        </div>
      </div>
    </div>
  );
}