import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Baby } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setActiveProfile, gerarMapaNumerologico } from '@/utils/numerology';
import { PERFIL_CONECTA } from '@/utils/numerology-profile';

const MapaInfantil = () => {
  const { user } = useAuth();
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [parentName, setParentName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set consistent numerology profile
  useEffect(() => {
    setActiveProfile(PERFIL_CONECTA);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!childName.trim()) {
      newErrors.childName = 'Nome da criança é obrigatório';
    }
    
    if (!birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else {
      const date = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      if (age > 18) {
        newErrors.birthDate = 'Esta análise é para crianças até 18 anos';
      }
    }
    
    if (!parentName.trim()) {
      newErrors.parentName = 'Nome do responsável é obrigatório';
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
      const mapa = gerarMapaNumerologico(childName, date);
      
      console.log('Child numerological analysis:', {
        child: childName,
        birthDate,
        gender,
        parent: parentName,
        numerology: mapa
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
              <div className="p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-glow">
                <Baby className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Mapa Infantil
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Numerologia para Crianças
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Compreenda o potencial e características únicas da sua criança
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="childName" className="text-foreground font-medium">
                  Nome da Criança
                </Label>
                <Input
                  id="childName"
                  type="text"
                  placeholder="Digite o nome completo da criança"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className={errors.childName ? 'border-destructive' : ''}
                />
                {errors.childName && (
                  <p className="text-sm text-destructive">{errors.childName}</p>
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

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground font-medium">
                  Gênero (Opcional)
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="nao-binario">Não-binário</SelectItem>
                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName" className="text-foreground font-medium">
                  Nome do Responsável
                </Label>
                <Input
                  id="parentName"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className={errors.parentName ? 'border-destructive' : ''}
                />
                {errors.parentName && (
                  <p className="text-sm text-destructive">{errors.parentName}</p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-green-400 to-emerald-400 hover:shadow-glow"
              >
                <Baby className="mr-2 h-5 w-5" />
                Criar Mapa Infantil
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Cada criança tem um destino único nos números
        </div>
      </div>
    </div>
  );
};

export default MapaInfantil;