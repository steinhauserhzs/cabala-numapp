import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import ClientPortalSection from '@/components/ClientPortalSection';
import { 
  Sparkles, 
  Heart, 
  Building, 
  Baby, 
  Phone, 
  Home as HomeIcon, 
  Car, 
  PenTool,
  ArrowRight,
  Shield,
  Star,
  Zap
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Análise Completa",
      description: "Mapas numerológicos detalhados baseados na Cabala"
    },
    {
      icon: Star,
      title: "Precisão Garantida",
      description: "Cálculos exatos seguindo tradições milenares"
    },
    {
      icon: Zap,
      title: "Resultados Instantâneos",
      description: "Interpretações completas em segundos"
    }
  ];

  const calculators = [
    {
      title: "Mapa Pessoal",
      description: "Análise numerológica completa da personalidade",
      icon: Sparkles,
      path: "/mapa-pessoal",
      color: "from-primary to-primary-glow"
    },
    {
      title: "Harmonia Conjugal",
      description: "Compatibilidade entre parceiros",
      icon: Heart,
      path: "/harmonia-conjugal",
      color: "from-pink-400 to-rose-400"
    },
    {
      title: "Mapa Empresarial",
      description: "Numerologia para negócios e empresas",
      icon: Building,
      path: "/mapa-empresarial",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Mapa Infantil",
      description: "Análise especial para crianças",
      icon: Baby,
      path: "/mapa-infantil",
      color: "from-green-400 to-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-mystical">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Numapp
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-3">
                <Link to="/auth">
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow shadow-mystical hover:shadow-glow">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-secondary to-accent px-6 py-3 rounded-full mb-8 shadow-mystical border border-primary/20">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-primary">Numerologia Cabalística Autêntica</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Descubra os
              </span>
              <br />
              <span className="text-foreground drop-shadow-sm">
                Segredos dos Números
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Desvende os mistérios da sua personalidade, destino e propósito através da 
              sabedoria milenar da numerologia cabalística.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link to="/mapa-pessoal">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow shadow-mystical hover:shadow-glow text-xl px-12 py-8 rounded-xl">
                <Sparkles className="mr-3 h-6 w-6" />
                Criar Meu Mapa Agora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link to="#calculators">
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5 text-xl px-12 py-8 rounded-xl">
                Ver Todas as Análises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Portal Section */}
      <ClientPortalSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Por que Escolher o Numapp?</h2>
          <p className="text-xl text-muted-foreground">Tecnologia e tradição em perfeita harmonia</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-mystical border-primary/20 hover:shadow-glow bg-gradient-to-br from-card to-secondary/20">
              <CardHeader className="pb-4">
                <div className="mx-auto p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow w-fit shadow-mystical">
                  <feature.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calculators Section */}
      <section id="calculators" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-cosmic bg-clip-text text-transparent">
              Calculadoras Numerológicas
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore diferentes aspectos da sua vida através da numerologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {calculators.map((calc, index) => (
            <Link key={index} to={calc.path}>
              <Card className="group cursor-pointer shadow-mystical hover:shadow-glow border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card to-secondary/10">
                <CardHeader className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${calc.color} shadow-mystical`}>
                      <calc.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl group-hover:text-primary">
                        {calc.title}
                      </CardTitle>
                      <CardDescription className="text-lg mt-2">{calc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Calculators */}
        <div className="grid md:grid-cols-5 gap-6">
          {[
            { title: "Análise de Telefone", icon: Phone, path: "/analise-telefone", color: "from-purple-400 to-violet-400" },
            { title: "Análise de Endereço", icon: HomeIcon, path: "/analise-endereco", color: "from-orange-400 to-amber-400" },
            { title: "Análise de Placa", icon: Car, path: "/analise-placa", color: "from-indigo-400 to-blue-400" },
            { title: "Correção de Assinatura", icon: PenTool, path: "/correcao-assinatura", color: "from-teal-400 to-cyan-400" },
            { title: "Áreas de Atuação", icon: Building, path: "/areas-atuacao", color: "from-emerald-400 to-green-400" }
          ].map((calc, index) => (
            <Link key={index} to={calc.path}>
              <Card className="group cursor-pointer text-center p-8 shadow-mystical hover:shadow-glow border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card to-secondary/10">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${calc.color} w-fit mx-auto mb-4 shadow-mystical`}>
                  <calc.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary">
                  {calc.title}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-primary via-primary-glow to-primary text-primary-foreground shadow-glow border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          <CardContent className="text-center py-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comece Sua Jornada de Autoconhecimento
            </h2>
            <p className="text-xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Milhares de pessoas já descobriram seu propósito através dos nossos mapas numerológicos.
              Que tal ser a próxima?
            </p>
            <Link to="/mapa-pessoal">
              <Button size="lg" variant="secondary" className="text-xl px-12 py-8 rounded-xl shadow-mystical">
                <Sparkles className="mr-3 h-6 w-6" />
                Criar Meu Mapa Agora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center border-t border-primary/20 bg-gradient-to-r from-secondary/30 to-accent/30">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-mystical">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Numapp
          </span>
        </div>
        <p className="text-base text-muted-foreground">
          © 2024 Numapp. Todos os direitos reservados. • Numerologia Cabalística Autêntica
        </p>
      </footer>
    </div>
  );
};

export default Home;