import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { AreasAtuacaoModal } from '@/components/AreasAtuacaoModal';
import { UserMapsSection } from '@/components/dashboard/UserMapsSection';
import { 
  Sparkles, 
  Heart, 
  Building, 
  Baby, 
  Phone, 
  MapPin, 
  Car, 
  PenTool,
  History,
  Plus,
  Briefcase
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);

  const calculatorOptions = [
    { title: 'Mapa Pessoal', description: 'Análise numerológica completa', icon: Sparkles, path: '/mapa-pessoal', color: 'bg-gradient-to-br from-primary to-primary/70' },
    { title: 'Harmonia Conjugal', description: 'Compatibilidade entre parceiros', icon: Heart, path: '/harmonia-conjugal', color: 'bg-gradient-to-br from-pink-500 to-pink-600' },
    { title: 'Mapa Empresarial', description: 'Numerologia para negócios', icon: Building, path: '/mapa-empresarial', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Mapa Infantil', description: 'Análise para crianças', icon: Baby, path: '/mapa-infantil', color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { title: 'Análise de Telefone', description: 'Vibração do número de telefone', icon: Phone, path: '/analise-telefone', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { title: 'Análise de Endereço', description: 'Energia da residência', icon: MapPin, path: '/analise-endereco', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    { title: 'Análise de Placa', description: 'Compatibilidade veicular', icon: Car, path: '/analise-placa', color: 'bg-gradient-to-br from-red-500 to-red-600' },
    { title: 'Correção de Assinatura', description: 'Otimização da assinatura', icon: PenTool, path: '/correcao-assinatura', color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
    { title: 'Áreas de Atuação', description: 'Explore profissões compatíveis', icon: Briefcase, path: '#', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600', onClick: () => setIsAreasModalOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Numapp
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Olá,</div>
              <div className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Escolha uma das opções abaixo para realizar suas análises numerológicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {calculatorOptions.map((option) => (
            option.onClick ? (
              <Card 
                key={option.title} 
                className="h-full hover:shadow-mystical transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={option.onClick}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Link key={option.path} to={option.path}>
                <Card className="h-full hover:shadow-mystical transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Mapas Recentes
              </CardTitle>
              <CardDescription>
                Seus últimos mapas numerológicos gerados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center py-8 text-muted-foreground">
                  <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum mapa gerado ainda</p>
                  <p className="text-sm">Comece criando seu primeiro mapa numerológico</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Resumo da sua atividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mapas Gerados:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Análises Realizadas:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Última Atividade:</span>
                  <span className="font-semibold text-sm">Hoje</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapas Criados Section */}
        <div className="mt-8">
          <UserMapsSection />
        </div>
        
        <AreasAtuacaoModal 
          isOpen={isAreasModalOpen} 
          onClose={() => setIsAreasModalOpen(false)} 
        />
      </main>
    </div>
  );
};

export default Dashboard;