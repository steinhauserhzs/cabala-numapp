import { z } from 'zod';

// Schema para Harmonia Conjugal
export const harmoniaConjugalSchema = z.object({
  partner1Name: z.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  partner1Date: z.date({
    required_error: 'Data de nascimento é obrigatória',
    invalid_type_error: 'Data inválida'
  }).refine(date => {
    const today = new Date();
    const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    return date <= today && date >= maxAge;
  }, 'Data deve estar entre hoje e 120 anos atrás'),
  
  partner2Name: z.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  partner2Date: z.date({
    required_error: 'Data de nascimento é obrigatória',
    invalid_type_error: 'Data inválida'
  }).refine(date => {
    const today = new Date();
    const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    return date <= today && date >= maxAge;
  }, 'Data deve estar entre hoje e 120 anos atrás')
});

// Schema para Correção de Assinatura
export const correcaoAssinaturaSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Nome completo deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  currentSignature: z.string()
    .trim()
    .min(1, 'Assinatura atual é obrigatória')
    .max(100, 'Assinatura deve ter no máximo 100 caracteres'),
  
  birthDate: z.date({
    required_error: 'Data de nascimento é obrigatória',
    invalid_type_error: 'Data inválida'
  }).refine(date => {
    const today = new Date();
    const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    return date <= today && date >= maxAge;
  }, 'Data deve estar entre hoje e 120 anos atrás'),
  
  objective: z.string()
    .trim()
    .min(5, 'Objetivo deve ter pelo menos 5 caracteres')
    .max(500, 'Objetivo deve ter no máximo 500 caracteres')
});

// Schema para Análise de Endereço
export const analiseEnderecoSchema = z.object({
  street: z.string()
    .trim()
    .min(5, 'Rua deve ter pelo menos 5 caracteres')
    .max(200, 'Rua deve ter no máximo 200 caracteres'),
  
  number: z.string()
    .trim()
    .min(1, 'Número é obrigatório')
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .regex(/^[0-9A-Za-z\s\-\/]+$/, 'Número deve conter apenas números, letras, espaços, hífens e barras'),
  
  neighborhood: z.string()
    .trim()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(100, 'Bairro deve ter no máximo 100 caracteres'),
  
  city: z.string()
    .trim()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Cidade deve conter apenas letras, espaços e hífens'),
  
  residentName: z.string()
    .trim()
    .min(2, 'Nome do morador deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
});

// Schema para Análise de Placa
export const analisePlacaSchema = z.object({
  plateNumber: z.string()
    .trim()
    .min(7, 'Placa deve ter pelo menos 7 caracteres')
    .max(8, 'Placa deve ter no máximo 8 caracteres')
    .regex(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/, 'Formato de placa inválido. Use AAA0000 ou AAA0A00'),
  
  ownerName: z.string()
    .trim()
    .min(2, 'Nome do proprietário deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  vehicleType: z.string()
    .trim()
    .max(50, 'Tipo de veículo deve ter no máximo 50 caracteres')
    .optional()
});

// Schema para Análise de Telefone
export const analiseTelefoneSchema = z.object({
  phoneNumber: z.string()
    .trim()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números, espaços, parênteses, hífens e sinal de mais'),
  
  ownerName: z.string()
    .trim()
    .min(2, 'Nome do proprietário deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
});

// Schema para Áreas de Atuação
export const areasAtuacaoSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Nome completo deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  birthDate: z.date({
    required_error: 'Data de nascimento é obrigatória',
    invalid_type_error: 'Data inválida'
  }).refine(date => {
    const today = new Date();
    const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    return date <= today && date >= maxAge;
  }, 'Data deve estar entre hoje e 120 anos atrás'),
  
  currentProfession: z.string()
    .trim()
    .max(100, 'Profissão atual deve ter no máximo 100 caracteres')
    .optional(),
  
  interests: z.string()
    .trim()
    .max(500, 'Interesses devem ter no máximo 500 caracteres')
    .optional()
});

export type HarmoniaConjugalData = z.infer<typeof harmoniaConjugalSchema>;
export type CorrecaoAssinaturaData = z.infer<typeof correcaoAssinaturaSchema>;
export type AnaliseEnderecoData = z.infer<typeof analiseEnderecoSchema>;
export type AnalisePlacaData = z.infer<typeof analisePlacaSchema>;
export type AnaliseTelefoneData = z.infer<typeof analiseTelefoneSchema>;
export type AreasAtuacaoData = z.infer<typeof areasAtuacaoSchema>;