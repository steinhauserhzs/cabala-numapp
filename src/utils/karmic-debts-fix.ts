// Fixed karmic debts detection system
import { NumerologyProfile } from './numerology-profile';
import { stripButKeepCedilla } from './numerology-core';

export function detectKarmicDebts(raw: string, profile: NumerologyProfile): number[] {
  const normalized = stripButKeepCedilla(raw);
  const karmicDebts: number[] = [];
  
  // Calculate all letter values first
  const allValues: number[] = [];
  for (const char of normalized) {
    if (profile.map[char] != null) {
      allValues.push(profile.map[char]);
    }
  }
  
  // Group by words and calculate word sums
  const words = normalized.split(' ').filter(word => word.length > 0);
  
  for (const word of words) {
    let wordSum = 0;
    for (const char of word) {
      if (profile.map[char] != null) {
        wordSum += profile.map[char];
      }
    }
    
    // Check if raw word sum equals karmic debt numbers (before reduction)
    if (wordSum === 13 || wordSum === 14 || wordSum === 16 || wordSum === 19) {
      if (!karmicDebts.includes(wordSum)) {
        karmicDebts.push(wordSum);
      }
    }
  }
  
  // Also check global sum for karmic debts
  const totalSum = allValues.reduce((acc, val) => acc + val, 0);
  if (totalSum === 13 || totalSum === 14 || totalSum === 16 || totalSum === 19) {
    if (!karmicDebts.includes(totalSum)) {
      karmicDebts.push(totalSum);
    }
  }
  
  return karmicDebts.sort();
}

// Test function
export function testKarmicDebts() {
  const { getActiveProfile } = require('./numerology-core');
  const profile = getActiveProfile();
  
  // Test cases
  const testCases = [
    "hairã zupanc steinhauser",
    "maria silva",
    "joão pedro"
  ];
  
  console.log('🔮 TESTING KARMIC DEBTS:');
  testCases.forEach(name => {
    const debts = detectKarmicDebts(name, profile);
    console.log(`${name}: [${debts.join(', ')}]`);
  });
}