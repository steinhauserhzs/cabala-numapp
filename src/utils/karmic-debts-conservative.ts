// Conservative karmic debts detection - only raw word/name sums
import { NumerologyProfile } from './numerology-profile';
import { stripButKeepCedilla } from './numerology-core-fixed';
import { getActiveProfile } from './profile-singleton';

export function detectKarmicDebtsConservative(raw: string, profile: NumerologyProfile): number[] {
  const normalized = stripButKeepCedilla(raw);
  const karmicNumbers = [13, 14, 16, 19];
  const detectedDebts: number[] = [];
  
  // Check individual words
  const words = normalized.split(' ').filter(w => w.length > 0);
  for (const word of words) {
    let wordSum = 0;
    for (const char of word) {
      if (profile.map[char] != null) {
        wordSum += profile.map[char];
      }
    }
    
    if (karmicNumbers.includes(wordSum) && !detectedDebts.includes(wordSum)) {
      detectedDebts.push(wordSum);
    }
  }
  
  // Check full name sum (before reduction)
  let totalSum = 0;
  for (const char of normalized) {
    if (profile.map[char] != null) {
      totalSum += profile.map[char];
    }
  }
  
  if (karmicNumbers.includes(totalSum) && !detectedDebts.includes(totalSum)) {
    detectedDebts.push(totalSum);
  }
  
  return detectedDebts.sort();
}

// Test function
export function testKarmicDebtsConservative() {
  const profile = getActiveProfile();

  const testCases = [
    "hairã zupanc steinhauser",
    "jessica paula de souza",
    "maria silva santos",
    "joão pedro oliveira"
  ];
  
  console.log('\n🔍 CONSERVATIVE KARMIC DEBTS TEST:');
  testCases.forEach(name => {
    const debts = detectKarmicDebtsConservative(name, profile);
    console.log(`"${name}": [${debts.join(', ')}]`);
  });
}