// Final official numerology profile with correct calibration
import { NumerologyProfile } from './numerology-profile';

export const PERFIL_OFICIAL_FINAL: NumerologyProfile = {
  name: "Perfil Oficial JF (Final)",
  
  // Cabalistic 1-8 table
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
  
  // Corrected settings based on reference cases
  useGlobalVowelSum: false, // Per-word for Motivação to match Jéssica 9
  accentBonusPerVowel: 3, // Standard +3 for most accents, special handling for tilde
  missionFormula: "EXP_PLUS_DEST", // Expressão + Destino
  numberRange: [1, 9], // 1-9 for Lições/Resposta to match expected results
  subconscClamp: [2, 9], // Standard clamp range
};