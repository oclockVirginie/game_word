// Simple test script to verify the improved syllable detection algorithm
// Run with: node test-syllables.js

/**
 * Function to split a French word into syllables
 * 
 * This is an improved approach for French syllable detection that follows
 * French phonological rules more accurately. It handles:
 * - Vowel and consonant patterns (CV-CV)
 * - Diphthongs and special vowel combinations
 * - Consonant clusters and digraphs
 * - Special cases like mute 'h'
 */
const splitIntoSyllables = (word) => {
  // Common vowels (including French accented vowels)
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ï', 'î', 'ô'];

  // Common French diphthongs and special vowel combinations
  const diphthongs = ['ai', 'au', 'ei', 'eu', 'oi', 'ou', 'ui', 'œu', 'ie', 'ue', 'oe'];

  // Consonant digraphs that should be kept together
  const digraphs = ['ch', 'ph', 'th', 'gn', 'qu'];

  // For very short words (3 letters or less), just return the whole word
  if (word.length <= 3) {
    return [word];
  }

  // Convert word to lowercase for processing
  const lowerWord = word.toLowerCase();

  const syllables = [];
  let currentSyllable = '';
  let i = 0;

  while (i < word.length) {
    const char = lowerWord[i];
    const nextChar = i < word.length - 1 ? lowerWord[i + 1] : '';

    // Add current character to the syllable
    currentSyllable += word[i];

    // Check for diphthongs and digraphs
    const potentialDiphthong = char + nextChar;
    const isDiphthong = diphthongs.includes(potentialDiphthong);
    const isDigraph = digraphs.includes(potentialDiphthong);

    // Special case: mute 'h' doesn't break syllables
    const isMuteH = nextChar === 'h' && !isDigraph;

    // Check if we should end the current syllable
    if (i < word.length - 1) {
      const charAfterNext = i < word.length - 2 ? lowerWord[i + 2] : '';

      // Rule 1: Vowel + Consonant + Vowel -> Split after the vowel (CV-CV pattern)
      if (vowels.includes(char) && !vowels.includes(nextChar) && vowels.includes(charAfterNext) && !isMuteH) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
      // Rule 2: Two consonants between vowels -> Split between consonants
      // Exception: Don't split certain consonant groups like 'bl', 'pr', etc.
      else if (vowels.includes(char) && !vowels.includes(nextChar) && !vowels.includes(charAfterNext) && 
               !(nextChar === 'l' && ['b', 'c', 'f', 'g', 'p'].includes(charAfterNext)) &&
               !(nextChar === 'r' && ['b', 'c', 'd', 'f', 'g', 'p', 't'].includes(charAfterNext)) &&
               !isDigraph) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
      // Rule 3: Handle diphthongs as a single unit
      else if (isDiphthong) {
        // Include the diphthong in the current syllable and skip the next character
        currentSyllable += word[i + 1];
        i++;

        // If after a diphthong there's a consonant followed by a vowel, end the syllable
        if (i < word.length - 2 && !vowels.includes(lowerWord[i + 1]) && vowels.includes(lowerWord[i + 2])) {
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
      }
      // Rule 4: Handle consonant digraphs (keep them together)
      else if (isDigraph) {
        // Include the digraph in the current syllable and skip the next character
        currentSyllable += word[i + 1];
        i++;

        // If after a digraph there's a vowel, end the syllable
        if (i < word.length - 1 && vowels.includes(lowerWord[i + 1])) {
          // But only if we already have a vowel in the current syllable
          if (currentSyllable.split('').some(c => vowels.includes(c.toLowerCase()))) {
            syllables.push(currentSyllable);
            currentSyllable = '';
          }
        }
      }
      // Rule 5: Vowel followed by another vowel that's not part of a diphthong
      else if (vowels.includes(char) && vowels.includes(nextChar) && !isDiphthong) {
        // Split between the vowels unless they form a diphthong
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    }

    i++;
  }

  // Add any remaining characters as the final syllable
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  // For educational purposes, if we ended up with just one syllable for a longer word,
  // apply additional rules to create a more explicit break
  if (syllables.length === 1 && word.length > 3) {
    // Look for a vowel followed by a consonant in the middle of the word
    for (let j = 1; j < word.length - 1; j++) {
      if (vowels.includes(lowerWord[j]) && !vowels.includes(lowerWord[j + 1])) {
        return [word.substring(0, j + 1), word.substring(j + 1)];
      }
    }

    // If no better pattern found, split at midpoint as a fallback
    const midpoint = Math.ceil(word.length / 2);
    return [word.substring(0, midpoint), word.substring(midpoint)];
  }

  return syllables;
};

// Test words from the game's word list
const testWords = [
  // Easy words
  'chat', 'chien', 'bleu', 'jour', 'main',
  // Medium words
  'pomme', 'maison', 'école', 'jardin', 'lapin',
  // Hard words
  'éléphant', 'girafe', 'papillon', 'ordinateur', 'parapluie',
  'chocolat', 'dinosaure', 'téléphone', 'crocodile', 'anniversaire'
];

// Test the function with each word
console.log("Testing syllable detection for French words:");
console.log("============================================");

testWords.forEach(word => {
  const syllables = splitIntoSyllables(word);
  console.log(`${word}: [${syllables.join('] [')}]`);
});
