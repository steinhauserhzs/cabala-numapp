import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AnalisePlaca = () => {
  const { user } = useAuth();
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!plateNumber.trim()) {
      newErrors.plateNumber = 'Placa do veículo é obrigatória';
    } else {
      const plate = plateNumber.replace(/[^A-Z0-9]/g, '');
      if (plate.length !== 7) {
        newErrors.plateNumber = 'Placa deve ter 7 caracteres (ABC1234 ou ABC1D23)';
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
      // TODO: Implement plate numerology calculation
      console.log('Plate analysis:', { plateNumber, vehicleType, ownerName, purchaseDate });
    }
  };

  const formatPlate = (value: string) => {
    const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Formato antigo: ABC1234
    if (upper.length <= 7 && /^[A-Z]{0,3}[0-9]{0,4}$/.test(upper)) {
      return upper.replace(/^([A-Z]{3})([0-9]{4})$/, '$1-$2');
    }
    
    // Formato Mercosul: ABC1D23
    if (upper.length <= 7 && /^[A-Z]{0,3}[0-9][A-Z][0-9]{0,2}$/.test(upper)) {
      return upper.replace(/^([A-Z]{3})([0-9][A-Z][0-9]{2})$/, '$1-$2');
    }
    
    return upper;
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
              <div className="p-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 shadow-glow">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Análise de Placa
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Compatibilidade Veicular
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra a compatibilidade entre você e seu veículo
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="plateNumber" className="text-foreground font-medium">
                  Placa do Veículo
                </Label>
                <Input
                  id="plateNumber"
                  type="text"
                  placeholder="ABC-1234 ou ABC-1D23"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(formatPlate(e.target.value))}
                  maxLength={8}
                  className={errors.plateNumber ? 'border-destructive' : ''}
                />
                {errors.plateNumber && (
                  <p className="text-sm text-destructive">{errors.plateNumber}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Aceita formato antigo (ABC-1234) e Mercosul (ABC-1D23)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="text-foreground font-medium">
                  Tipo de Veículo
                </Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="caminhao">Caminhão</SelectItem>
                    <SelectItem value="onibus">Ônibus</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="space-y-2">
                <Label htmlFor="purchaseDate" className="text-foreground font-medium">
                  Data de Aquisição (Opcional)
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Análise inclui:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Compatibilidade com o proprietário</li>
                  <li>• Vibração energética da placa</li>
                  <li>• Influência nos negócios e viagens</li>
                  <li>• Proteção e sorte nas estradas</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-red-400 to-pink-400 hover:shadow-glow"
              >
                <Car className="mr-2 h-5 w-5" />
                Analisar Placa
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Seu veículo carrega energias que influenciam sua jornada
        </div>
      </div>
    </div>
  );
};

export default AnalisePlaca;