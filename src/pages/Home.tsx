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
    <div className="min-h-screen bg-gradient-mystical">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-gradient-cosmic">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              Numapp
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="border-primary/20">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth">
                  <Button variant="outline" className="border-primary/20">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-cosmic hover:shadow-glow">
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Numerologia Cabalística</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-cosmic bg-clip-text text-transparent">
                Descubra os
              </span>
              <br />
              <span className="text-foreground">
                Segredos dos Números
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Desvende os mistérios da sua personalidade, destino e propósito através da 
              sabedoria milenar da numerologia cabalística.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/mapa-pessoal">
              <Button size="lg" className="bg-gradient-cosmic hover:shadow-glow text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Criar Meu Mapa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="#calculators">
              <Button variant="outline" size="lg" className="border-primary/20 text-lg px-8 py-6">
                Ver Todas as Análises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Portal Section */}
      <ClientPortalSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-card border-primary/10 hover:shadow-mystical transition-all duration-300">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-gradient-celestial w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
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

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {calculators.map((calc, index) => (
            <Link key={index} to={calc.path}>
              <Card className="group cursor-pointer shadow-card hover:shadow-mystical transition-all duration-300 border-primary/10 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${calc.color}`}>
                      <calc.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {calc.title}
                      </CardTitle>
                      <CardDescription>{calc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Calculators */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "Análise de Telefone", icon: Phone, path: "/analise-telefone" },
            { title: "Análise de Endereço", icon: HomeIcon, path: "/analise-endereco" },
            { title: "Análise de Placa", icon: Car, path: "/analise-placa" },
            { title: "Correção de Assinatura", icon: PenTool, path: "/correcao-assinatura" }
          ].map((calc, index) => (
            <Link key={index} to={calc.path}>
              <Card className="group cursor-pointer text-center p-6 shadow-card hover:shadow-mystical transition-all duration-300 border-primary/10 hover:border-primary/20">
                <calc.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {calc.title}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-cosmic text-primary-foreground shadow-glow border-0">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">
              Comece Sua Jornada de Autoconhecimento
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Milhares de pessoas já descobriram seu propósito através dos nossos mapas numerológicos.
              Que tal ser a próxima?
            </p>
            <Link to="/mapa-pessoal">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Criar Meu Mapa Agora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center border-t border-primary/10">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-2 rounded-full bg-gradient-cosmic">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Numapp
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2024 Numapp. Todos os direitos reservados. • Numerologia Cabalística
        </p>
      </footer>
    </div>
  );
};

export default Home;