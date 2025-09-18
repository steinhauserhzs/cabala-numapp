// Core numerology calculation utilities with profile support
import { NumerologyProfile, PERFIL_OFICIAL_JF, PERFIL_PITAGORICO, PERFIL_CONECTA } from './numerology-profile';

// Active profile management
let activeProfile: NumerologyProfile = PERFIL_CONECTA;
export function setActiveProfile(profile: NumerologyProfile) { activeProfile = profile; }
export function getActiveProfile(): NumerologyProfile { return activeProfile; }
export function getAvailableProfiles(): NumerologyProfile[] { return [PERFIL_OFICIAL_JF, PERFIL_PITAGORICO, PERFIL_CONECTA]; }

// Re-export for convenience
export { PERFIL_OFICIAL_JF, type NumerologyProfile };

export interface AuditLog {
  operation: string;
  input: string;
  profile: string;
  steps: Array<{
    word?: string;
    letters: Array<{ char: string; cleanChar: string; value: number; isVowel?: boolean; isConsonant?: boolean }>;
    wordSum?: number;
    wordReduced?: number;
  }>;
  accentedVowels: number;
  accentBonus: number;
  totalSum: number;
  finalResult: number;
}

let debugMode = false;
const auditLogs: AuditLog[] = [];

export function enableDebugMode(enable: boolean = true) {
  debugMode = enable;
}

export function getAuditLogs(): AuditLog[] {
  return [...auditLogs];
}

export function clearAuditLogs() {
  auditLogs.length = 0;
}

function log(message: string, ...args: any[]) {
  if (debugMode) {
    console.debug(`[numerology] ${message}`, ...args);
  }
}

// Clean text while preserving Ç
export function stripButKeepCedilla(raw: string): string {
  if (!raw) return '';
  
  // Preserve Ç by replacing with placeholder
  const withPlaceholder = raw.replace(/[çÇ]/g, '§');
  
  // Remove diacritics but keep base letters
  const noMarks = withPlaceholder
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toUpperCase()
    .replace(/[^A-Z§ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  // Restore Ç
  const result = noMarks.replace(/§/g, 'Ç');
  
  log(`stripButKeepCedilla: \"${raw}\" → \"${result}\"`);
  return result;
}

// Count accented vowels in original text
export function countAccentedVowels(raw: string): number {
  if (!raw) return 0;
  
  // Match accented vowels in original text
  const accentedVowelPattern = /[áéíóúâêôãõàäëïöüýÁÉÍÓÚÂÊÔÃÕÀÄËÏÖÜÝ]/g;
  const matches = raw.match(accentedVowelPattern);
  const count = matches ? matches.length : 0;
  
  log(`countAccentedVowels: \"${raw}\" → ${count} accented vowels found`);
  return count;
}

// Reduce number while keeping master numbers
export function reduceKeepMasters(n: number, masters: Set<number> = new Set([11, 22])): number {
  let current = n;
  while (current > 9 && !masters.has(current)) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, digit) => sum + digit, 0);
  }
  log(`reduceKeepMasters: ${n} → ${current}`);
  return current;
}

// Helper for challenges that allows 0 and doesn't preserve masters
export function reduceToDigitAllowZero(n: number): number {
  let current = n;
  while (current >= 10) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, digit) => sum + digit, 0);
  }
  log(`reduceToDigitAllowZero: ${n} → ${current}`);
  return current;
}

// Core name calculation with audit trail
export function calcNameWithAudit(
  raw: string, 
  type: 'expressao' | 'motivacao' | 'impressao',
  profile: NumerologyProfile = getActiveProfile()
): { result: number; audit: AuditLog } {
  const audit: AuditLog = {
    operation: type,
    input: raw,
    profile: profile.name,
    steps: [],
    accentedVowels: 0,
    accentBonus: 0,
    totalSum: 0,
    finalResult: 0,
  };

  if (!raw) {
    audit.finalResult = 0;
    if (debugMode) auditLogs.push(audit);
    return { result: 0, audit };
  }

  const normalized = stripButKeepCedilla(raw);
  const words = normalized.split(' ').filter(w => w.length > 0);
  const accentedVowelCount = countAccentedVowels(raw);
  
  audit.accentedVowels = accentedVowelCount;
  
  let totalSum = 0;

  if (type === 'motivacao' && profile.useGlobalVowelSum) {
    // Global vowel sum for Motivação in PERFIL_OFICIAL_JF
    const allLetters: Array<{ char: string; cleanChar: string; value: number; isVowel: boolean }> = [];
    
    for (const word of words) {
      // Skip particles if configured
      if (!profile.includeParticlesInNameNumbers && profile.particles.has(word)) {
        log(`Skipping particle: \"${word}\"`);
        continue;
      }
      
      for (const char of word) {
        if (profile.map[char] != null && profile.vowels.has(char)) {
          const value = profile.map[char];
          totalSum += value;
          allLetters.push({ char, cleanChar: char, value, isVowel: true });
        }
      }
    }
    
    audit.steps.push({
      letters: allLetters,
      wordSum: totalSum,
    });
  } else {
    // Word-by-word or regular processing
    for (const word of words) {
      // Skip particles if configured
      if (!profile.includeParticlesInNameNumbers && profile.particles.has(word)) {
        log(`Skipping particle: \"${word}\"`);
        continue;
      }
      
      const letters: Array<{ char: string; cleanChar: string; value: number; isVowel?: boolean; isConsonant?: boolean }> = [];
      let wordSum = 0;
      
      for (const char of word) {
        if (profile.map[char] != null) {
          const value = profile.map[char];
          const isVowel = profile.vowels.has(char);
          const isConsonant = !isVowel;
          
          // Apply filter based on calculation type
          let include = false;
          if (type === 'expressao') include = true;
          else if (type === 'motivacao') include = isVowel;
          else if (type === 'impressao') include = isConsonant;
          
          if (include) {
            wordSum += value;
            letters.push({ char, cleanChar: char, value, isVowel, isConsonant });
          }
        }
      }
      
      if (type === 'motivacao' && !profile.useGlobalVowelSum) {
        // Per-word reduction for legacy Pythagorean
        const wordReduced = reduceKeepMasters(wordSum, profile.masters);
        totalSum += wordReduced;
        audit.steps.push({ word, letters, wordSum, wordReduced });
      } else {
        totalSum += wordSum;
        audit.steps.push({ word, letters, wordSum });
      }
    }
  }

  // Apply accent bonus for Expressão and Motivação
  if ((type === 'expressao' || type === 'motivacao') && profile.accentBonusPerVowel > 0) {
    audit.accentBonus = accentedVowelCount * profile.accentBonusPerVowel;
    totalSum += audit.accentBonus;
    log(`Applied accent bonus: ${accentedVowelCount} × ${profile.accentBonusPerVowel} = +${audit.accentBonus}`);
  }

  audit.totalSum = totalSum;
  audit.finalResult = reduceKeepMasters(totalSum, profile.masters);

  if (debugMode) auditLogs.push(audit);
  
  log(`${type} calculation for \"${raw}\":`, audit);
  return { result: audit.finalResult, audit };
}

// Specific calculation functions
export function calcExpressao(raw: string, profile: NumerologyProfile = getActiveProfile()): number {
  return calcNameWithAudit(raw, 'expressao', profile).result;
}

export function calcMotivacao(raw: string, profile: NumerologyProfile = getActiveProfile()): number {
  return calcNameWithAudit(raw, 'motivacao', profile).result;
}

export function calcImpressao(raw: string, profile: NumerologyProfile = getActiveProfile()): number {
  return calcNameWithAudit(raw, 'impressao', profile).result;
}

export function calcDestino(d: number, m: number, y: number, profile: NumerologyProfile = getActiveProfile()): number {
  // Sum all digits of DD/MM/YYYY
  const dateStr = `${d.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}${y}`;
  const sum = dateStr.split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  const result = reduceKeepMasters(sum, profile.masters);
  
  log(`calcDestino: ${d}/${m}/${y} → ${dateStr} → sum=${sum} → ${result}`);
  return result;
}

export function calcPsiquico(d: number, profile: NumerologyProfile = getActiveProfile()): number {
  const result = reduceKeepMasters(d, profile.masters);
  log(`calcPsiquico: day=${d} → ${result}`);
  return result;
}

export function calcMissao(raw: string, d: number, m: number, y: number, profile: NumerologyProfile = getActiveProfile()): number {
  const expressao = calcExpressao(raw, profile);
  const destino = calcDestino(d, m, y, profile);
  const psiquico = calcPsiquico(d, profile);
  
  const base = profile.missionFormula === "EXP_PLUS_DEST" ? expressao + destino : destino + psiquico;
  const result = reduceKeepMasters(base, profile.masters);
  
  log(`calcMissao: formula=${profile.missionFormula}, expressao=${expressao}, destino=${destino}, psiquico=${psiquico} → base=${base} → ${result}`);
  return result;
}

export function calcRespostaSubconsciente(raw: string, profile: NumerologyProfile = getActiveProfile()): number {
  const normalized = stripButKeepCedilla(raw);
  const values: number[] = [];
  
  for (const char of normalized) {
    if (profile.map[char] != null) {
      values.push(profile.map[char]);
    }
  }
  
  // Count unique values within the profile's number range
  const [minRange, maxRange] = profile.numberRange;
  const uniqueValues = new Set(values.filter(v => v >= minRange && v <= maxRange));
  const count = uniqueValues.size;
  
  // Clamp between profile's subconscious response range
  const [minClamp, maxClamp] = profile.subconscClamp;
  const result = Math.max(minClamp, Math.min(maxClamp, count));
  
  log(`calcRespostaSubconsciente: name=\"${raw}\", values=[${values.join(',')}], unique=[${Array.from(uniqueValues).sort().join(',')}], count=${count}, clamped=${result}`);
  return result;
}

export function calcLicoesCarmicas(raw: string, profile: NumerologyProfile = getActiveProfile()): number[] {
  const normalized = stripButKeepCedilla(raw);
  const values: number[] = [];
  
  for (const char of normalized) {
    if (profile.map[char] != null) {
      values.push(profile.map[char]);
    }
  }
  
  // Find missing numbers in the profile's range
  const [minRange, maxRange] = profile.numberRange;
  const presentNumbers = new Set(values.filter(v => v >= minRange && v <= maxRange));
  const allNumbers = Array.from({length: maxRange - minRange + 1}, (_, i) => i + minRange);
  const result = allNumbers.filter(num => !presentNumbers.has(num));
  
  log(`calcLicoesCarmicas: range=${profile.numberRange}, present=[${Array.from(presentNumbers).sort().join(',')}], missing=[${result.join(',')}]`);
  return result;
}

export function calcTendenciasOcultas(raw: string, profile: NumerologyProfile = getActiveProfile()): number[] {
  const normalized = stripButKeepCedilla(raw);
  const values: number[] = [];
  
  for (const char of normalized) {
    if (profile.map[char] != null) {
      values.push(profile.map[char]);
    }
  }
  
  // Count occurrences within the profile's range
  const [minRange, maxRange] = profile.numberRange;
  const counter: Record<number, number> = {};
  
  values.forEach(v => {
    if (v >= minRange && v <= maxRange) {
      counter[v] = (counter[v] || 0) + 1;
    }
  });
  
  // Return numbers that appear 4+ times
  const result = Object.entries(counter)
    .filter(([_, count]) => count >= 4)
    .map(([num, _]) => parseInt(num))
    .sort();
    
  log(`calcTendenciasOcultas: range=${profile.numberRange}, counter=`, counter, `result=[${result.join(',')}]`);
  return result;
}
