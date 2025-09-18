import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuditLog } from '@/utils/numerology-core';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, auditLogs }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Auditoria dos Cálculos Numerológicos</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum log de auditoria disponível. Execute um cálculo para ver os detalhes.
              </p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {auditLogs.map((log, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{log.operation}</Badge>
                        <span className="font-mono text-sm">{log.input}</span>
                        <Badge variant="secondary">{log.finalResult}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>Perfil:</strong> {log.profile}
                          </div>
                          <div>
                            <strong>Resultado Final:</strong> {log.finalResult}
                          </div>
                          <div>
                            <strong>Vogais Acentuadas:</strong> {log.accentedVowels}
                          </div>
                          <div>
                            <strong>Bônus de Acento:</strong> +{log.accentBonus}
                          </div>
                          <div>
                            <strong>Soma Total:</strong> {log.totalSum}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <strong>Detalhes por Palavra/Etapa:</strong>
                          {log.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="border rounded p-3 bg-muted/50">
                              {step.word && (
                                <div className="font-semibold mb-2">Palavra: "{step.word}"</div>
                              )}
                              <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-wrap gap-1">
                                  {step.letters.map((letter, letterIndex) => (
                                    <Badge 
                                      key={letterIndex} 
                                      variant={letter.isVowel ? "default" : letter.isConsonant ? "secondary" : "outline"}
                                      className="text-xs"
                                    >
                                      {letter.char}→{letter.value}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Soma: {step.wordSum}
                                  {step.wordReduced !== undefined && step.wordReduced !== step.wordSum && (
                                    <span> → Reduzido: {step.wordReduced}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};