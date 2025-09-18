import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NumerologyForm } from '@/components/NumerologyForm';
import { NumerologyResult } from '@/components/NumerologyResult';
import { gerarMapaNumerologico, type MapaNumerologico } from '@/utils/numerology';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

const MapaPessoal = () => {
  const { user } = useAuth();
  const [showResult, setShowResult] = useState(false);
  const [numerologyMap, setNumerologyMap] = useState<MapaNumerologico | null>(null);
  const [userName, setUserName] = useState('');
  const [userBirthDate, setUserBirthDate] = useState<Date | null>(null);

  // No profile override - use single source of truth from main.tsx

  const handleFormSubmit = async (name: string, birthDate: Date) => {
    try {
      console.log('[MapaPessoal] Submitting form with:', { name, birthDate });
      
      const mapa = gerarMapaNumerologico(name, birthDate);
      setNumerologyMap(mapa);
      setUserName(name);
      setUserBirthDate(birthDate);
      setShowResult(true);
    } catch (err) {
      console.error('Erro ao gerar mapa numerológico:', err);
      alert('Ocorreu um erro ao gerar o mapa. Tente novamente.');
    }
  };
  const handleBack = () => {
    setShowResult(false);
    setNumerologyMap(null);
    setUserName('');
    setUserBirthDate(null);
  };

  if (showResult && numerologyMap && userBirthDate) {
    return (
      <div>
        <div className="fixed top-4 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-2">
              <Link to={user ? "/dashboard" : "/"}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              
              {user && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <NumerologyResult 
          mapa={numerologyMap}
          name={userName}
          birthDate={userBirthDate}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <Link to={user ? "/dashboard" : "/"}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            {user && (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
            
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Entrar / Cadastrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <NumerologyForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default MapaPessoal;