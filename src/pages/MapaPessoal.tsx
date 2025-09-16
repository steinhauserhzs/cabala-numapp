import React, { useState } from 'react';
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

  const handleFormSubmit = (name: string, birthDate: Date) => {
    const mapa = gerarMapaNumerologico(name, birthDate);
    setNumerologyMap(mapa);
    setUserName(name);
    setUserBirthDate(birthDate);
    setShowResult(true);
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
        <div className="fixed top-4 left-4 z-50">
          <Link to={user ? "/dashboard" : "/"}>
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
                Ir para Dashboard
              </Button>
            </Link>
          </div>
        )}
        
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
      <div className="fixed top-4 left-4 z-50">
        <Link to={user ? "/dashboard" : "/"}>
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
              Ir para Dashboard
            </Button>
          </Link>
        </div>
      )}
      
      {!user && (
        <div className="fixed top-4 right-4 z-50">
          <Link to="/auth">
            <Button variant="outline">
              Entrar / Cadastrar
            </Button>
          </Link>
        </div>
      )}
      
      <NumerologyForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default MapaPessoal;