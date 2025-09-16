import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AnaliseEndereco = () => {
  const { user } = useAuth();
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [residentName, setResidentName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!street.trim()) {
      newErrors.street = 'Nome da rua é obrigatório';
    }
    
    if (!number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    
    if (!neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }
    
    if (!city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!residentName.trim()) {
      newErrors.residentName = 'Nome do morador é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement address numerology calculation
      console.log('Address analysis:', { street, number, complement, neighborhood, city, propertyType, residentName });
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
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 shadow-glow">
                <Home className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Análise de Endereço
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Energia da Residência
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra as vibrações energéticas do seu lar
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street" className="text-foreground font-medium">
                    Nome da Rua
                  </Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="Rua das Flores"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={errors.street ? 'border-destructive' : ''}
                  />
                  {errors.street && (
                    <p className="text-sm text-destructive">{errors.street}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number" className="text-foreground font-medium">
                    Número
                  </Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={errors.number ? 'border-destructive' : ''}
                  />
                  {errors.number && (
                    <p className="text-sm text-destructive">{errors.number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement" className="text-foreground font-medium">
                    Complemento
                  </Label>
                  <Input
                    id="complement"
                    type="text"
                    placeholder="Apto 45"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood" className="text-foreground font-medium">
                  Bairro
                </Label>
                <Input
                  id="neighborhood"
                  type="text"
                  placeholder="Centro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className={errors.neighborhood ? 'border-destructive' : ''}
                />
                {errors.neighborhood && (
                  <p className="text-sm text-destructive">{errors.neighborhood}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground font-medium">
                  Cidade
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-foreground font-medium">
                  Tipo do Imóvel
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="residentName" className="text-foreground font-medium">
                  Nome do Morador Principal
                </Label>
                <Input
                  id="residentName"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  className={errors.residentName ? 'border-destructive' : ''}
                />
                {errors.residentName && (
                  <p className="text-sm text-destructive">{errors.residentName}</p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-orange-400 to-amber-400 hover:shadow-glow"
              >
                <Home className="mr-2 h-5 w-5" />
                Analisar Endereço
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Sua casa é um templo de energias
        </div>
      </div>
    </div>
  );
};

export default AnaliseEndereco;