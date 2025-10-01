// Singleton profile manager to prevent runtime mutations
import { NumerologyProfile, PERFIL_OFICIAL_JF, PERFIL_PITAGORICO, PERFIL_CONECTA } from './numerology-profile';
import { PERFIL_OFICIAL_FINAL } from './official-profile-final';

// Single source of truth for active profile
let activeProfile: NumerologyProfile = PERFIL_OFICIAL_FINAL;

// Prevent external mutations by returning a frozen copy
export function getActiveProfile(): NumerologyProfile {
  return Object.freeze({ ...activeProfile });
}

// Only allow profile changes through this controlled interface
export function setActiveProfile(profile: NumerologyProfile): void {
  activeProfile = Object.freeze({ ...profile });
  console.log(`[profile-singleton] Active profile set to: ${profile.name}`);
}

// Available profiles registry
export function getAvailableProfiles(): NumerologyProfile[] {
  return [PERFIL_OFICIAL_FINAL, PERFIL_OFICIAL_JF, PERFIL_PITAGORICO, PERFIL_CONECTA];
}

// Bootstrap function for main.tsx
export function initializeProfile(profile: NumerologyProfile): void {
  setActiveProfile(profile);
  console.log(`[profile-singleton] Initialized with profile: ${profile.name}`);
}