import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, User, Loader2 } from 'lucide-react';

interface NumerologyFormProps {
  onSubmit: (name: string, birthDate: Date) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
}

const NumerologyForm = ({ 
  onSubmit, 
  isLoading = false, 
  title = "Análise Numerológica",
  description = "Descubra os mistérios dos números em sua vida",
  submitButtonText = "Gerar Mapa Numerológico"
}: NumerologyFormProps) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && birthDate) {
      // Fix timezone issue by parsing date parts manually
      const [year, month, day] = birthDate.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      onSubmit(name.trim(), date);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-sm font-medium">
                <User className="h-4 w-4 mr-2" />
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center text-sm font-medium">
                <CalendarDays className="h-4 w-4 mr-2" />
                Data de nascimento
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!name.trim() || !birthDate || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Gerando análise...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { NumerologyForm };
export default NumerologyForm;