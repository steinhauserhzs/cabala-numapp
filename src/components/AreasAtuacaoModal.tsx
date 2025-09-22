import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Briefcase, GraduationCap, X } from 'lucide-react';
import { 
  areasAtuacao, 
  profissoes, 
  buscarPorTexto, 
  filtrarPorNumeros, 
  obterEstatisticas,
  type AreaAtuacao,
  type Profissao 
} from '@/data/areas-atuacao';

interface AreasAtuacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AreasAtuacaoModal: React.FC<AreasAtuacaoModalProps> = ({ isOpen, onClose }) => {
  const [busca, setBusca] = useState('');
  const [numerosSelecionados, setNumerosSelecionados] = useState<number[]>([]);
  const [abaSelecionada, setAbaSelecionada] = useState<'areas' | 'profissoes'>('areas');

  const stats = useMemo(() => obterEstatisticas(), []);

  const resultadosFiltrados = useMemo(() => {
    let resultados = { areas: areasAtuacao, profissoes: profissoes };

    // Aplicar busca por texto
    if (busca.trim()) {
      const resultadosBusca = buscarPorTexto(busca, 'ambos');
      resultados = {
        areas: resultadosBusca.areas,
        profissoes: resultadosBusca.profissoes
      };
    }

    // Aplicar filtro por números
    if (numerosSelecionados.length > 0) {
      const resultadosNumeros = filtrarPorNumeros(numerosSelecionados, 'ambos');
      resultados = {
        areas: resultados.areas.filter(area => 
          resultadosNumeros.areas.some(a => a.nome === area.nome)
        ),
        profissoes: resultados.profissoes.filter(profissao => 
          resultadosNumeros.profissoes.some(p => p.nome === profissao.nome)
        )
      };
    }

    return resultados;
  }, [busca, numerosSelecionados]);

  const toggleNumero = (numero: number) => {
    setNumerosSelecionados(prev => 
      prev.includes(numero) 
        ? prev.filter(n => n !== numero)
        : [...prev, numero]
    );
  };

  const limparFiltros = () => {
    setBusca('');
    setNumerosSelecionados([]);
  };

  const ItemCard: React.FC<{ item: AreaAtuacao | Profissao; tipo: 'area' | 'profissao' }> = ({ item, tipo }) => (
    <Card className="hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{item.nome}</CardTitle>
          <div className="flex gap-1 flex-wrap">
            {item.numeros.map(numero => (
              <Badge 
                key={numero} 
                variant="outline" 
                className="text-xs bg-primary/10 border-primary/30"
              >
                {numero}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-6 w-6" />
            Áreas de Atuação e Profissões
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Filtros */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrar por números:</span>
                {numerosSelecionados.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={limparFiltros}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {stats.numerosDisponiveis.map(numero => (
                  <Button
                    key={numero}
                    variant={numerosSelecionados.includes(numero) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleNumero(numero)}
                    className="h-7 px-2 text-xs"
                  >
                    {numero}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={abaSelecionada} onValueChange={(value) => setAbaSelecionada(value as 'areas' | 'profissoes')} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="areas" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Áreas de Atuação ({resultadosFiltrados.areas.length})
              </TabsTrigger>
              <TabsTrigger value="profissoes" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Profissões ({resultadosFiltrados.profissoes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="areas" className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {resultadosFiltrados.areas.map((area, index) => (
                  <ItemCard key={index} item={area} tipo="area" />
                ))}
              </div>
              {resultadosFiltrados.areas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma área encontrada com os filtros aplicados.
                </div>
              )}
            </TabsContent>

            <TabsContent value="profissoes" className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {resultadosFiltrados.profissoes.map((profissao, index) => (
                  <ItemCard key={index} item={profissao} tipo="profissao" />
                ))}
              </div>
              {resultadosFiltrados.profissoes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma profissão encontrada com os filtros aplicados.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};