// Pure numerology calculation functions (stateless)
import { 
  calcExpressao, calcMotivacao, calcImpressao, calcDestino, calcPsiquico, calcMissao,
  calcRespostaSubconsciente, calcLicoesCarmicas, calcTendenciasOcultas 
} from './numerology-core-fixed';
import { detectKarmicDebtsConservative } from './karmic-debts-conservative';
import { NumerologyProfile } from './numerology-profile';
import { PERFIL_OFICIAL_FINAL } from './official-profile-final';

// Life cycle calculations
export function calcCiclosVida(day: number, month: number, year: number, profile: NumerologyProfile): {
  primeiro: number;
  segundo: number; 
  terceiro: number;
} {
  const { reduceKeepMasters } = require('./numerology-core-fixed');
  
  return {
    primeiro: reduceKeepMasters(month, profile.masters),
    segundo: reduceKeepMasters(day, profile.masters),
    terceiro: reduceKeepMasters(year, profile.masters)
  };
}

// Challenge calculations
export function calcDesafios(day: number, month: number, year: number, profile: NumerologyProfile): {
  primeiro: number;
  segundo: number;
  principal: number;
} {
  const { reduceToDigitAllowZero } = require('./numerology-core-fixed');
  
  const primeiro = Math.abs(month - day);
  const segundo = Math.abs(day - year);
  const principal = Math.abs(primeiro - segundo);
  
  return {
    primeiro: reduceToDigitAllowZero(primeiro),
    segundo: reduceToDigitAllowZero(segundo), 
    principal: reduceToDigitAllowZero(principal)
  };
}

// Decisive moments calculations
export function calcMomentosDecisivos(day: number, month: number, year: number, profile: NumerologyProfile): {
  primeiro: number;
  segundo: number;
  terceiro: number;
  quarto: number;
} {
  const { reduceKeepMasters } = require('./numerology-core-fixed');
  
  return {
    primeiro: reduceKeepMasters(month + day, profile.masters),
    segundo: reduceKeepMasters(day + year, profile.masters),
    terceiro: reduceKeepMasters(month + year, profile.masters),
    quarto: reduceKeepMasters(month + day + year, profile.masters)
  };
}

// Personal timing calculations  
export function calcTemposPessoais(day: number, month: number, year: number, profile: NumerologyProfile): {
  anoPersonal: number;
  mesPersonal: number;
  diaPersonal: number;
} {
  const { reduceKeepMasters } = require('./numerology-core-fixed');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  
  const anoPersonal = reduceKeepMasters(day + month + currentYear, profile.masters);
  const mesPersonal = reduceKeepMasters(anoPersonal + currentMonth, profile.masters);
  const diaPersonal = reduceKeepMasters(mesPersonal + currentDay, profile.masters);
  
  return { anoPersonal, mesPersonal, diaPersonal };
}

// Pure map generation function
export function gerarMapaNumerologicoPuro(
  nome: string, 
  dataNascimento: Date,
  profile: NumerologyProfile = PERFIL_OFICIAL_FINAL
): any {
  const day = dataNascimento.getDate();
  const month = dataNascimento.getMonth() + 1;
  const year = dataNascimento.getFullYear();
  
  // Core calculations
  const motivacao = calcMotivacao(nome, profile);
  const impressao = calcImpressao(nome, profile);
  const expressao = calcExpressao(nome, profile);
  const destino = calcDestino(day, month, year, profile);
  const numeroPsiquico = calcPsiquico(day, profile);
  const missao = calcMissao(nome, day, month, year, profile);
  
  // Advanced calculations
  const respostaSubconsciente = calcRespostaSubconsciente(nome, profile);
  const licoesCarmicas = calcLicoesCarmicas(nome, profile);
  const tendenciasOcultas = calcTendenciasOcultas(nome, profile);
  const dividasCarmicas = detectKarmicDebtsConservative(nome, profile);
  
  // Life cycles and challenges
  const ciclosVida = calcCiclosVida(day, month, year, profile);
  const desafios = calcDesafios(day, month, year, profile);
  const momentosDecisivos = calcMomentosDecisivos(day, month, year, profile);
  const temposPessoais = calcTemposPessoais(day, month, year, profile);
  
  return {
    motivacao,
    impressao,
    expressao,
    destino,
    numeroPsiquico,
    missao,
    respostaSubconsciente,
    licoesCarmicas,
    tendenciasOcultas,
    dividasCarmicas,
    ciclosVida,
    desafios,
    momentosDecisivos,
    ...temposPessoais,
    // Legacy fields for Guardian Angel  
    angeloGuardiao: "Nanael" // Placeholder - should be calculated elsewhere
  };
}