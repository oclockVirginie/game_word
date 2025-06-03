import { useState, useEffect } from 'react'
import './App.css'

// List of words for the game, categorized by difficulty
const WORD_CATEGORIES = {
  easy: [
    'chat', 'chien', 'bleu', 'jour', 'main', 
    'nez', 'bon', 'vert', 'lire', 'pain'
  ],
  medium: [
    'pomme', 'maison', 'école', 'jardin', 'lapin',
    'livre', 'soleil', 'fleur', 'table', 'enfant'
  ],
  hard: [
    'éléphant', 'girafe', 'papillon', 'ordinateur', 'parapluie',
    'chocolat', 'dinosaure', 'téléphone', 'crocodile', 'anniversaire'
  ]
};

// Function to split a word into syllables
// This is a more educational approach for children learning to read
const splitIntoSyllables = (word: string): string[] => {
  // Common vowels (including French accented vowels)
  const vowels = ['a', 'e', 'i', 'o', 'u', 'é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ï', 'î', 'ô'];

  // For very short words (3 letters or less), just return the whole word
  if (word.length <= 3) {
    return [word];
  }

  const syllables: string[] = [];
  let currentSyllable = '';
  let hasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    currentSyllable += word[i];

    // Check if current character is a vowel
    if (vowels.includes(char)) {
      hasVowel = true;
    }

    // Rules for syllable breaks:
    // 1. After a vowel followed by a consonant
    // 2. Between two consonants
    // 3. Before the last consonant + 'e' pattern

    const nextChar = i < word.length - 1 ? word[i + 1].toLowerCase() : '';
    const isLastChar = i === word.length - 1;

    if (hasVowel && 
        ((vowels.includes(char) && nextChar && !vowels.includes(nextChar)) || 
         (!vowels.includes(char) && nextChar && !vowels.includes(nextChar) && currentSyllable.length > 1) ||
         isLastChar)) {

      // Don't break before a final 'e'
      if (isLastChar || !(nextChar === 'e' && i === word.length - 2)) {
        syllables.push(currentSyllable);
        currentSyllable = '';
        hasVowel = false;
      }
    }
  }

  // Add any remaining characters
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  // For educational purposes, if we ended up with just one syllable, 
  // create a more explicit break for learning
  if (syllables.length === 1 && word.length > 3) {
    const midpoint = Math.ceil(word.length / 2);
    return [word.substring(0, midpoint), word.substring(midpoint)];
  }

  return syllables;
};

function App() {
  type DifficultyLevel = 'easy' | 'medium' | 'hard';

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [currentWord, setCurrentWord] = useState<string>('');
  const [syllables, setSyllables] = useState<string[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [correctSyllables, setCorrectSyllables] = useState<string[]>([]);
  const [animation, setAnimation] = useState<string>('');

  // Function to read the word aloud using speech synthesis
  const speakWord = () => {
    if (!currentWord) return;

    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(currentWord);

      // Set the language to French
      utterance.lang = 'fr-FR';

      // Set other properties for better speech quality
      utterance.rate = 0.8; // Slightly slower for children
      utterance.pitch = 1;

      // Speak the word
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser');
    }
  };

  // Initialize or reset the game
  const setupGame = () => {
    // Get words for the current difficulty level
    const wordsForLevel = WORD_CATEGORIES[difficulty];

    // Select a random word
    const randomWord = wordsForLevel[Math.floor(Math.random() * wordsForLevel.length)];
    setCurrentWord(randomWord);

    // Split the word into syllables
    const wordSyllables = splitIntoSyllables(randomWord);
    setCorrectSyllables(wordSyllables);

    // Add some extra syllables as distractors
    const allSyllables = [...wordSyllables];

    // Number of distractors based on difficulty
    const numDistractors = difficulty === 'easy' ? 2 : (difficulty === 'medium' ? 3 : 4);

    // Add random syllables from other words as distractors
    for (let i = 0; i < numDistractors; i++) {
      // Get a random word from any category
      const categories = Object.keys(WORD_CATEGORIES) as DifficultyLevel[];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const words = WORD_CATEGORIES[randomCategory];
      const otherWord = words[Math.floor(Math.random() * words.length)];

      if (otherWord !== randomWord) {
        const otherSyllables = splitIntoSyllables(otherWord);
        const randomSyllable = otherSyllables[Math.floor(Math.random() * otherSyllables.length)];
        if (!allSyllables.includes(randomSyllable)) {
          allSyllables.push(randomSyllable);
        }
      }
    }

    // Shuffle the syllables
    const shuffledSyllables = allSyllables.sort(() => Math.random() - 0.5);

    setSyllables(shuffledSyllables);
    setSelectedSyllables([]);
    setIsCorrect(null);
    setShowHint(false);
    setAnimation('');
  };

  // Initialize the game on component mount
  useEffect(() => {
    setupGame();
  }, [difficulty]); // Reset game when difficulty changes

  // Handle syllable selection
  const handleSyllableClick = (syllable: string) => {
    if (selectedSyllables.includes(syllable)) {
      // If already selected, remove it
      setSelectedSyllables(selectedSyllables.filter(s => s !== syllable));
    } else {
      // Add to selected syllables
      const newSelected = [...selectedSyllables, syllable];
      setSelectedSyllables(newSelected);

      // Check if the composed word matches the target word
      const composedWord = newSelected.join('');
      if (composedWord === currentWord) {
        setIsCorrect(true);
        // Award points based on difficulty and hints used
        const difficultyBonus = difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 2 : 3);
        const hintPenalty = hintsUsed > 0 ? Math.max(0, difficultyBonus - hintsUsed) : difficultyBonus;
        setScore(score + hintPenalty);

        // Play success animation
        setAnimation('success');

        // Wait a moment before setting up a new word
        setTimeout(() => {
          setupGame();
          setHintsUsed(0);
        }, 1500);
      } else if (composedWord.length >= currentWord.length) {
        setIsCorrect(false);

        // Play error animation
        setAnimation('error');

        // Wait a moment before allowing another attempt
        setTimeout(() => {
          setSelectedSyllables([]);
          setIsCorrect(null);
          setAnimation('');
        }, 1500);
      }
    }
  };

  // Show a hint by revealing one correct syllable
  const handleShowHint = () => {
    if (correctSyllables.length > 0 && !showHint) {
      setShowHint(true);
      setHintsUsed(hintsUsed + 1);
    }
  };

  // Change difficulty level
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setScore(0); // Reset score when changing difficulty
    setHintsUsed(0);
  };

  return (
    <div className={`word-game ${animation}`}>
      <h1>Jeu de Construction de Mots</h1>

      {/* Difficulty selector */}
      <div className="difficulty-selector">
        <p>Difficulté:</p>
        <div className="difficulty-buttons">
          <button 
            className={`difficulty-button ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
          >
            Facile
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('medium')}
          >
            Moyen
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
          >
            Difficile
          </button>
        </div>
      </div>

      <p className="instructions">Sélectionnez les syllabes pour construire le mot ci-dessous:</p>

      <div className="target-word-container">
        <div className="target-word">
          {currentWord.split('').map((letter, index) => (
            <span key={index} className="target-letter">{letter}</span>
          ))}
        </div>
        <button 
          className="speak-button" 
          onClick={speakWord}
          aria-label="Lire le mot"
        >
          <span role="img" aria-hidden="true">🔊</span> Lire le mot
        </button>
      </div>

      <div className={`composed-word ${animation}`}>
        {selectedSyllables.length > 0 ? (
          selectedSyllables.map((syllable, index) => (
            <span 
              key={index} 
              className={`composed-syllable ${isCorrect !== null ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
            >
              {syllable}
            </span>
          ))
        ) : (
          <span className="placeholder">Sélectionnez les syllabes ci-dessous</span>
        )}
      </div>

      <div className="syllable-options">
        {syllables.map((syllable, index) => {
          // Check if this syllable should be highlighted as a hint
          const isHint = showHint && correctSyllables.includes(syllable) && 
                         !selectedSyllables.includes(syllable);

          return (
            <button
              key={index}
              className={`syllable-button ${selectedSyllables.includes(syllable) ? 'selected' : ''} ${isHint ? 'hint' : ''}`}
              onClick={() => handleSyllableClick(syllable)}
              disabled={isCorrect !== null}
            >
              {syllable}
            </button>
          );
        })}
      </div>

      <div className="game-controls">
        <div className="score-container">
          <p>Score: <span className="score-value">{score}</span></p>
          <p className="difficulty-display">Niveau: {difficulty}</p>
        </div>

        <div className="button-container">
          <button 
            className="hint-button" 
            onClick={handleShowHint} 
            disabled={isCorrect !== null || showHint}
          >
            Indice
          </button>
          <button className="new-word-button" onClick={setupGame}>Nouveau Mot</button>
        </div>
      </div>

      {/* Feedback message */}
      {isCorrect !== null && (
        <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Très bien!' : 'Essayez encore!'}
        </div>
      )}
    </div>
  )
}

export default App
