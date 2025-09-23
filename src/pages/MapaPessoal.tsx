import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NumerologyForm } from '@/components/NumerologyForm';
import { InteractiveNumerologyDashboard } from '@/components/InteractiveNumerologyDashboard';
import { gerarMapaNumerologico, type MapaNumerologico } from '@/utils/numerology';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { testHairaDebug } from '@/utils/haira-debug-test';
import { supabase } from '@/integrations/supabase/client';
import { generateSlug, generateShareToken } from '@/utils/sharing';
import { SharedMapViewer } from '@/components/SharedMapViewer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MapaPessoal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showResult, setShowResult] = useState(false);
  const [numerologyMap, setNumerologyMap] = useState<MapaNumerologico | null>(null);
  const [userName, setUserName] = useState('');
  const [userBirthDate, setUserBirthDate] = useState<Date | null>(null);
  const [mapSlug, setMapSlug] = useState<string>('');
  const [shareToken, setShareToken] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // No profile override - use single source of truth from main.tsx

  const handleFormSubmit = async (name: string, birthDate: Date) => {
    try {
      console.log('[MapaPessoal] Submitting form with:', { name, birthDate });
      setIsSaving(true);
      
      // Execute Hairã debug test if this is Hairã
      if (name.toLowerCase().includes("hairã") || name.toLowerCase().includes("haira")) {
        console.log("🔧 Executando teste de debug para Hairã...");
        testHairaDebug();
      }
      
      const mapa = gerarMapaNumerologico(name, birthDate);
      
      // Generate sharing data
      const slug = generateSlug(name, birthDate);
      const token = generateShareToken();
      
      // Save to database if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('numerology_maps')
          .insert({
            user_id: user.id,
            name: name,
            birth_date: birthDate.toISOString().split('T')[0],
            map_type: 'pessoal',
            map_data: mapa as any,
            slug: slug,
            share_token: token,
            visibility: 'shared_link'
          });

        if (error) {
          console.error('Erro ao salvar mapa:', error);
          toast({
            title: "Aviso",
            description: "Mapa gerado com sucesso, mas não foi possível salvar para compartilhamento.",
            variant: "destructive"
          });
        } else {
          // Redirect to shared page
          navigate(`/mapa/${slug}?token=${token}`);
          return;
        }
      }
      
      // Fallback: show local result
      setNumerologyMap(mapa);
      setUserName(name);
      setUserBirthDate(birthDate);
      setMapSlug(slug);
      setShareToken(token);
      setShowResult(true);
      
    } catch (err) {
      console.error('Erro ao gerar mapa numerológico:', err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o mapa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
      <SharedMapViewer
        mapa={numerologyMap}
        name={userName}
        birthDate={userBirthDate}
        slug={mapSlug}
        token={shareToken}
        visibility="shared_link"
        showShareControls={true}
      />
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
      
      <NumerologyForm onSubmit={handleFormSubmit} isLoading={isSaving} />
    </div>
  );
};

export default MapaPessoal;