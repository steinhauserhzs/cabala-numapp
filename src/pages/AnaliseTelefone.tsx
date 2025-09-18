import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setActiveProfile, calcExpressao } from '@/utils/numerology';
import { PERFIL_CONECTA } from '@/utils/numerology-profile';

const AnaliseTelefone = () => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set consistent numerology profile
  useEffect(() => {
    setActiveProfile(PERFIL_CONECTA);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Número de telefone é obrigatório';
    } else {
      const digits = phoneNumber.replace(/\D/g, '');
      if (digits.length < 10) {
        newErrors.phoneNumber = 'Número de telefone deve ter pelo menos 10 dígitos';
      }
    }
    
    if (!ownerName.trim()) {
      newErrors.ownerName = 'Nome do proprietário é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement phone numerology calculation
      console.log('Phone analysis:', { phoneNumber, ownerName });
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
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
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 shadow-glow">
                <Phone className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Análise de Telefone
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Vibração do Número
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra a energia vibracional do seu número de telefone
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-foreground font-medium">
                  Número de Telefone
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                  maxLength={15}
                  className={errors.phoneNumber ? 'border-destructive' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Digite apenas números com DDD
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-foreground font-medium">
                  Nome do Proprietário
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className={errors.ownerName ? 'border-destructive' : ''}
                />
                {errors.ownerName && (
                  <p className="text-sm text-destructive">{errors.ownerName}</p>
                )}
              </div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">O que você descobrirá:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Vibração energética do número</li>
                  <li>• Compatibilidade com seu perfil</li>
                  <li>• Influência nos negócios e relacionamentos</li>
                  <li>• Sugestões de melhorias</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-purple-400 to-violet-400 hover:shadow-glow"
              >
                <Phone className="mr-2 h-5 w-5" />
                Analisar Telefone
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Seu telefone vibra em sintonia com o universo
        </div>
      </div>
    </div>
  );
};

export default AnaliseTelefone;