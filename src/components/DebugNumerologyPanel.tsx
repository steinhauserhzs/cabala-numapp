// Debug panel for numerology calculations with audit trail
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Bug, CheckCircle, XCircle } from 'lucide-react';
import { testCalibrationPure } from '@/utils/pure-calibration';
import { runPureRegressionTests } from '@/utils/regression-test-component';
import { getActiveProfile } from '@/utils/profile-singleton';

interface DebugNumerologyPanelProps {
  mapa?: any;
  name?: string;
  birthDate?: Date;
}

export function DebugNumerologyPanel({ mapa, name, birthDate }: DebugNumerologyPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calibrationResult, setCalibrationResult] = useState<any>(null);
  const [regressionResult, setRegressionResult] = useState<any>(null);
  const profile = getActiveProfile();

  const runCalibrationTest = () => {
    try {
      const result = testCalibrationPure();
      setCalibrationResult(result);
    } catch (error) {
      console.error('Calibration test failed:', error);
      setCalibrationResult({ error: String(error) });
    }
  };

  const runRegressionTests = () => {
    try {
      const result = runPureRegressionTests();
      setRegressionResult(result);
    } catch (error) {
      console.error('Regression tests failed:', error);
      setRegressionResult({ error: String(error) });
    }
  };

  return (
    <Card className="border-2 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800 dark:text-amber-200">
                  Debug Numerologia
                </CardTitle>
              </div>
              <ChevronDown 
                className={`h-4 w-4 text-amber-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Auditoria e validação dos cálculos numerológicos
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Current Calculation Info */}
            {mapa && name && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Cálculo Atual: {name}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>Motivação: <span className="font-mono">{mapa.motivacao}</span></div>
                  <div>Expressão: <span className="font-mono">{mapa.expressao}</span></div>
                  <div>Impressão: <span className="font-mono">{mapa.impressao}</span></div>
                  <div>Destino: <span className="font-mono">{mapa.destino}</span></div>
                  <div>Missão: <span className="font-mono">{mapa.missao}</span></div>
                  <div>Ciclos: <span className="font-mono">
                    [{mapa.ciclosVida.primeiro}, {mapa.ciclosVida.segundo}, {mapa.ciclosVida.terceiro}]
                  </span></div>
                </div>
              </div>
            )}

            {/* Active Profile Info */}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Perfil Ativo: {profile.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div>Vogal Global: <span className="font-mono">{String(profile.useGlobalVowelSum)}</span></div>
                <div>Bônus Acento: <span className="font-mono">{profile.accentBonusPerVowel}</span></div>
                <div>Missão: <span className="font-mono">{profile.missionFormula}</span></div>
                <div>Range: <span className="font-mono">[{profile.numberRange[0]}, {profile.numberRange[1]}]</span></div>
                <div>Clamp Subconsciente: <span className="font-mono">[{profile.subconscClamp[0]}, {profile.subconscClamp[1]}]</span></div>
                <div>Mestres: <span className="font-mono">[{Array.from(profile.masters).join(', ')}]</span></div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runCalibrationTest}
                className="bg-green-50 hover:bg-green-100 border-green-300"
              >
                Testar Calibração Hairã
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runRegressionTests}
                className="bg-purple-50 hover:bg-purple-100 border-purple-300"
              >
                Teste de Regressão
              </Button>
            </div>

            {/* Calibration Results */}
            {calibrationResult && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  {calibrationResult.isCalibrated ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <XCircle className="h-4 w-4" />
                  }
                  Teste de Calibração Hairã
                </h4>
                {calibrationResult.error ? (
                  <p className="text-red-600">{calibrationResult.error}</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Esperado:</span>
                      <pre className="text-xs bg-white/50 p-2 rounded mt-1">
                        {JSON.stringify(calibrationResult.expected, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium">Obtido:</span>
                      <pre className="text-xs bg-white/50 p-2 rounded mt-1">
                        {JSON.stringify(calibrationResult.actual, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Regression Results */}
            {regressionResult && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  {regressionResult.allPassed ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <XCircle className="h-4 w-4" />
                  }
                  Teste de Regressão
                </h4>
                {regressionResult.error ? (
                  <p className="text-red-600">{regressionResult.error}</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{regressionResult.summary}</p>
                    {regressionResult.results?.map((result: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {result.passed ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <XCircle className="h-3 w-3 text-red-600" />
                        }
                        <span>{result.name}</span>
                        {!result.passed && (
                          <span className="text-xs text-red-600">
                            ({result.errors.length} errors)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}