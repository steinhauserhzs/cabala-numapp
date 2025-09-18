import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setActiveProfile, gerarMapaNumerologico } from '@/utils/numerology';
import { PERFIL_CONECTA } from '@/utils/numerology-profile';

const MapaEmpresarial = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [foundingDate, setFoundingDate] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [errors, setErrors] = useState<{ companyName?: string; foundingDate?: string; cnpj?: string }>({});

  // Set consistent numerology profile
  useEffect(() => {
    setActiveProfile(PERFIL_CONECTA);
  }, []);

  const validateForm = () => {
    const newErrors: { companyName?: string; foundingDate?: string; cnpj?: string } = {};
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Nome da empresa é obrigatório';
    }
    
    if (!foundingDate) {
      newErrors.foundingDate = 'Data de fundação é obrigatória';
    }
    
    if (cnpj && cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
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
      
      const date = parseDate(foundingDate);
      const mapa = gerarMapaNumerologico(companyName, date);
      
      console.log('Business numerological analysis:', {
        company: companyName,
        date: foundingDate,
        cnpj,
        numerology: mapa
      });
    }
  };

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
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
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-glow">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                Mapa Empresarial
              </CardTitle>
              <CardDescription className="text-lg text-primary mt-2">
                Numerologia para Negócios
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Descubra as vibrações energéticas da sua empresa e otimize o sucesso nos negócios
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground font-medium">
                  Nome da Empresa
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Digite o nome da empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={errors.companyName ? 'border-destructive' : ''}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundingDate" className="text-foreground font-medium">
                  Data de Fundação
                </Label>
                <Input
                  id="foundingDate"
                  type="date"
                  value={foundingDate}
                  onChange={(e) => setFoundingDate(e.target.value)}
                  className={errors.foundingDate ? 'border-destructive' : ''}
                />
                {errors.foundingDate && (
                  <p className="text-sm text-destructive">{errors.foundingDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-foreground font-medium">
                  CNPJ (Opcional)
                </Label>
                <Input
                  id="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                  maxLength={18}
                  className={errors.cnpj ? 'border-destructive' : ''}
                />
                {errors.cnpj && (
                  <p className="text-sm text-destructive">{errors.cnpj}</p>
                )}
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-8 text-lg font-semibold py-6 bg-gradient-to-r from-blue-400 to-cyan-400 hover:shadow-glow"
              >
                <Building className="mr-2 h-5 w-5" />
                Analisar Empresa
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Otimize o sucesso empresarial através da numerologia
        </div>
      </div>
    </div>
  );
};

export default MapaEmpresarial;