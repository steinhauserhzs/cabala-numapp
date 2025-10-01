// Numerology calculation profiles to support different systems
export type NumerologyProfile = {
  name: string;
  map: Record<string, number>;
  vowels: Set<string>;
  includeParticlesInNameNumbers: boolean;
  particles: Set<string>;
  masters: Set<number>;
  useGlobalVowelSum: boolean; // Motivação calculation method
  accentBonusPerVowel: number; // Bonus per accented vowel
  missionFormula: "EXP_PLUS_DEST" | "DEST_PLUS_PSI";
  numberRange: [number, number]; // For karmic lessons/tendencies
  subconscClamp: [number, number]; // For subconscious response
};

// Official profile matching the exact requirements
export const PERFIL_OFICIAL_JF: NumerologyProfile = {
  name: "Perfil Oficial JF",
  // Cabalistic 1-8 table with Ç=6
  map: {
    A: 1, I: 1, Q: 1, J: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5,
    U: 6, V: 6, W: 6, X: 6, "Ç": 6,
    O: 7, Z: 7,
    F: 8, P: 8,
  },
  vowels: new Set(["A", "E", "I", "O", "U", "Y"]),
  includeParticlesInNameNumbers: true,
  particles: new Set(["DE", "DA", "DO", "DOS", "DAS", "E"]),
  masters: new Set([11, 22]),
  useGlobalVowelSum: true, // Global sum for Motivação
  accentBonusPerVowel: 2, // ESSENTIAL for matching test case
  missionFormula: "EXP_PLUS_DEST", // For "Jéssica..." case
  numberRange: [1, 8], // Karmic lessons/tendencies use 1-8 range
  subconscClamp: [2, 8], // Subconscious response clamp for 1-8 system
};

// Legacy Pythagorean profile (for backward compatibility)
export const PERFIL_PITAGORICO: NumerologyProfile = {
  name: "Pitágoras (1-9)",
  map: {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8, "Ç": 3,
  },
  vowels: new Set(["A", "E", "I", "O", "U", "Y"]),
  includeParticlesInNameNumbers: false,
  particles: new Set(["DE", "DA", "DO", "DOS", "DAS", "E"]),
  masters: new Set([11, 22]),
  useGlobalVowelSum: false, // Per-word for Motivação
  accentBonusPerVowel: 0, // No accent bonus
  missionFormula: "EXP_PLUS_DEST",
  numberRange: [1, 9], // Full range for karmic lessons/tendencies
  subconscClamp: [2, 9], // Traditional clamp
};

// New profile: Perfil Conecta (calibrated to match Hairã reference)
export const PERFIL_CONECTA: NumerologyProfile = {
  name: "Perfil Conecta",
  // Cabalistic 1-8 table with Ç=6
  map: {
    A: 1, I: 1, Q: 1, J: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5,
    U: 6, V: 6, W: 6, X: 6, "Ç": 6,
    O: 7, Z: 7,
    F: 8, P: 8,
  },
  vowels: new Set(["A", "E", "I", "O", "U", "Y"]),
  includeParticlesInNameNumbers: true,
  particles: new Set(["DE", "DA", "DO", "DOS", "DAS", "E"]),
  masters: new Set([11, 22]),
  // Calibrated for Hairã: Motivação 22, Expressão 11, Impressão 7, Destino 9, Missão 2
  useGlobalVowelSum: true, // Global sum for Motivação to achieve 22
  accentBonusPerVowel: 2, // Moderate bonus for accented vowels
  missionFormula: "EXP_PLUS_DEST", // 11 + 9 = 20 → 2
  numberRange: [1, 8],
  subconscClamp: [2, 8],
};

// Re-export PERFIL_OFICIAL_FINAL for convenience
export { PERFIL_OFICIAL_FINAL } from './official-profile-final';