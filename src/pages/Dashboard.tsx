import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { AreasAtuacaoModal } from '@/components/AreasAtuacaoModal';
import { UserMapsSection } from '@/components/dashboard/UserMapsSection';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  User, 
  Building2, 
  Baby, 
  Heart, 
  PenTool, 
  Home, 
  Car, 
  Phone, 
  BrainCircuit,
  LogOut,
  BarChart3,
  Clock,
  UserPlus,
  Users,
  Menu
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);

  const calculatorOptions = [
    {
      title: "Criar Mapa para Cliente",
      description: "Gere mapas e crie acesso para seus clientes",
      icon: UserPlus,
      path: "/criar-mapa-cliente",
      color: "text-blue-600",
      featured: true
    },
    {
      title: "Gerenciar Clientes",
      description: "Visualize e gerencie todos os seus clientes",
      icon: Users,
      path: "/admin/clientes",
      color: "text-green-600",
      featured: true
    },
    {
      title: "Mapa Pessoal",
      description: "Análise completa da personalidade e destino",
      icon: User,
      path: "/mapa-pessoal",
      color: "text-blue-600"
    },
    {
      title: "Mapa Empresarial", 
      description: "Numerologia aplicada aos negócios",
      icon: Building2,
      path: "/mapa-empresarial",
      color: "text-green-600"
    },
    {
      title: "Mapa Infantil",
      description: "Análise especial para crianças",
      icon: Baby,
      path: "/mapa-infantil", 
      color: "text-pink-600"
    },
    {
      title: "Harmonia Conjugal",
      description: "Compatibilidade entre casais",
      icon: Heart,
      path: "/harmonia-conjugal",
      color: "text-red-600"
    },
    {
      title: "Correção de Assinatura",
      description: "Otimize sua assinatura numerologicamente",
      icon: PenTool,
      path: "/correcao-assinatura",
      color: "text-purple-600"
    },
    {
      title: "Análise de Endereço",
      description: "Energia do seu local de residência",
      icon: Home,
      path: "/analise-endereco",
      color: "text-orange-600"
    },
    {
      title: "Análise de Placa",
      description: "Numerologia da placa do seu veículo",
      icon: Car,
      path: "/analise-placa",
      color: "text-indigo-600"
    },
    {
      title: "Análise de Telefone",
      description: "Energia do seu número de telefone",
      icon: Phone,
      path: "/analise-telefone",
      color: "text-teal-600"
    },
    {
      title: "Áreas de Atuação",
      description: "Descubra suas áreas profissionais ideais",
      icon: BrainCircuit,
      color: "text-amber-600",
      onClick: () => setIsAreasModalOpen(true)
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-4">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <div className="flex items-center gap-3 lg:hidden">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
                <h1 className="text-xl font-bold text-primary">
                  Numapp
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-muted-foreground">Olá,</div>
                <div className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</div>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e realize análises numerológicas completas
          </p>
        </div>

        {/* Ferramentas de Gestão de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {calculatorOptions.filter(option => option.featured).map((option, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg border-2 hover:border-primary/20 cursor-pointer"
              onClick={() => option.onClick ? option.onClick() : navigate(option.path!)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary">
                      {option.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ferramentas de Análise */}
        <h2 className="text-2xl font-bold mb-6">Ferramentas de Análise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {calculatorOptions.filter(option => !option.featured).map((option, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg border-2 hover:border-primary/20 cursor-pointer"
              onClick={() => option.onClick ? option.onClick() : navigate(option.path!)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10">
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary">
                      {option.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas ações realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma atividade recente</p>
                  <p className="text-sm">Comece criando mapas para seus clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas
              </CardTitle>
              <CardDescription>
                Resumo da sua atividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Clientes Cadastrados:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mapas Criados:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Último Acesso:</span>
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
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;