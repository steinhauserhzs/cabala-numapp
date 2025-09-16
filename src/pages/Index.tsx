import React, { useState } from 'react';
import { NumerologyForm } from '@/components/NumerologyForm';
import { NumerologyResult } from '@/components/NumerologyResult';
import { gerarMapaNumerologico, type MapaNumerologico } from '@/utils/numerology';

const Index = () => {
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
      <NumerologyResult 
        mapa={numerologyMap}
        name={userName}
        birthDate={userBirthDate}
        onBack={handleBack}
      />
    );
  }

  return <NumerologyForm onSubmit={handleFormSubmit} />;
};

export default Index;
