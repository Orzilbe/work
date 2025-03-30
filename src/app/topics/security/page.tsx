'use client';

import React, { useState, useEffect } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Flashcard {
  id: number;
  word: string;
  translation: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  englishLevel: string;
}

// All data is defined locally - no API calls
const allFlashcards: {
  beginner: Flashcard[];
  intermediate: Flashcard[];
  advanced: Flashcard[];
} = {
  beginner: [
    { id: 0, word: 'Tank', translation: 'טַנְק', example: 'The tank rolled across the battlefield.', difficulty: 'easy' },
    { id: 1, word: 'Soldier', translation: 'חַיָּל', example: 'The soldier carried his equipment through difficult terrain.', difficulty: 'easy' },
    { id: 2, word: 'Weapon', translation: 'נֶשֶׁק', example: 'Every soldier is trained to use their weapon properly.', difficulty: 'easy' },
    { id: 3, word: 'Border', translation: 'גְּבוּל', example: 'The troops patrolled the border to ensure security.', difficulty: 'easy' },
    { id: 4, word: 'Attack', translation: 'הַתְקָפָה', example: 'The attack began early in the morning.', difficulty: 'easy' },
    { id: 5, word: 'Bomb', translation: 'פְּצָצָה', example: 'The bomb disposal unit safely detonated the explosive device.', difficulty: 'easy' },
  ],
  intermediate: [
    { id: 0, word: 'Combat', translation: 'קְרָב', example: 'The soldiers engaged in combat with the enemy forces.', difficulty: 'medium' },
    { id: 1, word: 'Intelligence', translation: 'מוֹדִיעִין', example: 'Military intelligence gathered information about enemy positions.', difficulty: 'medium' },
    { id: 2, word: 'Defense', translation: 'הֲגָנָה', example: 'The country strengthened its defense systems after the attack.', difficulty: 'medium' },
    { id: 3, word: 'Strategy', translation: 'אִסְטְרָטֶגְיָה', example: 'The military leadership developed a new strategy for the operation.', difficulty: 'medium' },
    { id: 4, word: 'Hostage', translation: 'בֶּן־עֲרֻבָּה', example: 'Rescuing the hostages was a top priority for the operation.', difficulty: 'medium' },
    { id: 5, word: 'Bunker', translation: 'בּוּנְקֶר', example: 'The military discovered an underground bunker network.', difficulty: 'medium' },
  ],
  advanced: [
    { id: 0, word: 'Reconnaissance', translation: 'סִיּוּר', example: 'The reconnaissance unit gathered crucial intelligence behind enemy lines.', difficulty: 'hard' },
    { id: 1, word: 'Fortification', translation: 'בִּיצּוּר', example: 'The fortification protected the troops from incoming artillery fire.', difficulty: 'hard' },
    { id: 2, word: 'Tactical', translation: 'טַקְטִי', example: 'The general made a tactical decision to withdraw from that position.', difficulty: 'hard' },
    { id: 3, word: 'Artillery', translation: 'תּוֹתָחִים', example: 'Heavy artillery bombardment preceded the ground invasion.', difficulty: 'hard' },
    { id: 4, word: 'Deployment', translation: 'פְּרִיסָה', example: 'The rapid deployment of forces to the southern border was crucial.', difficulty: 'hard' },
    { id: 5, word: 'Surveillance', translation: 'מֶעֱקָב', example: 'Drone surveillance provided real-time information on enemy movements.', difficulty: 'hard' },
  ],
};

export default function Page() {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [showKnownWordsModal, setShowKnownWordsModal] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow'>('normal');
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const router = useRouter();

  const userProfile: UserProfile = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    birthDate: "1990-01-01",
    englishLevel: "Intermediate",
  };

  // Function to get flashcards based on difficulty level and known words
  const getFlashcards = () => {
    setLoading(true);
    
    // Get appropriate cards for current difficulty level
    const cardsForLevel = allFlashcards[difficultyLevel];
    
    // Filter out known words
    const filteredCards = cardsForLevel.filter(card => !knownWords.includes(card.word));
    
    // Update the filtered cards
    setFlashcards(filteredCards);
    setLoading(false);
    
    // Reset current card to beginning if needed
    if (currentCard >= filteredCards.length && filteredCards.length > 0) {
      setCurrentCard(0);
    }
  };

  // Load known words from localStorage on component mount
  useEffect(() => {
    const savedKnownWords = localStorage.getItem('knownWords');
    if (savedKnownWords) {
      try {
        setKnownWords(JSON.parse(savedKnownWords));
      } catch (e) {
        console.error('Error parsing known words from localStorage:', e);
        localStorage.removeItem('knownWords');
      }
    }
    
    // Initial load of flashcards
    getFlashcards();
  }, []); // Empty dependency array - only run once on mount
  
  // Save known words to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('knownWords', JSON.stringify(knownWords));
  }, [knownWords]);
  
  // Update flashcards when difficulty level changes or known words change
  useEffect(() => {
    getFlashcards();
  }, [difficultyLevel, knownWords]);

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setShowTranslation(false);
    }
  };

  const markAsKnown = () => {
    const currentWord = flashcards[currentCard]?.word;
    if (currentWord && !knownWords.includes(currentWord)) {
      setKnownWords((prev) => [...prev, currentWord]);
    }
  };

  const unmarkAsKnown = (word: string) => {
    setKnownWords((prev) => prev.filter((w) => w !== word));
  };

  const handlePlayPronunciation = () => {
    const word = flashcards[currentCard]?.word;
    if (!word || typeof window === 'undefined') return;

    // Check if SpeechSynthesisUtterance is available (browser compatibility)
    if ('SpeechSynthesisUtterance' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = playbackSpeed === 'slow' ? 0.7 : 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser');
    }
  };

  const toggleProfile = () => setShowProfile(!showProfile);
  
  const refreshFlashcards = () => {
    getFlashcards();
    setCurrentCard(0);
  };

  const changeDifficultyLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setDifficultyLevel(level);
    setCurrentCard(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 relative">
      {/* Add Google Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* User Profile Icon */}
      <div className="absolute top-4 right-4">
        <div 
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={toggleProfile}
        >
          <span className="text-2xl">👤</span>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="absolute top-20 right-4 bg-white p-6 shadow-2xl rounded-2xl w-80 z-50 border border-gray-100 transform transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
          <div className="space-y-3">
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Name:</strong> {userProfile.fullName}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Email:</strong> {userProfile.email}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Phone:</strong> {userProfile.phoneNumber}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">Birth Date:</strong> {userProfile.birthDate}</p>
            <p className="flex items-center text-gray-700"><strong className="min-w-24">English Level:</strong> 
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm ml-2">
                {userProfile.englishLevel}
              </span>
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <button
              className="w-full py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              onClick={() => alert('Logout Successful!')}
            >
              Logout
            </button>
            <button
              className="w-full py-2.5 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors"
              onClick={toggleProfile}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto mt-16">
        {/* Difficulty selector */}
        <div className="mb-6 flex justify-center gap-3">
          <button 
            onClick={() => changeDifficultyLevel('beginner')}
            className={`px-4 py-2 rounded-xl text-white transition-colors ${difficultyLevel === 'beginner' ? 'bg-green-600' : 'bg-green-400 hover:bg-green-500'}`}
          >
            Beginner
          </button>
          <button 
            onClick={() => changeDifficultyLevel('intermediate')}
            className={`px-4 py-2 rounded-xl text-white transition-colors ${difficultyLevel === 'intermediate' ? 'bg-orange-600' : 'bg-orange-400 hover:bg-orange-500'}`}
          >
            Intermediate
          </button>
          <button 
            onClick={() => changeDifficultyLevel('advanced')}
            className={`px-4 py-2 rounded-xl text-white transition-colors ${difficultyLevel === 'advanced' ? 'bg-red-600' : 'bg-red-400 hover:bg-red-500'}`}
          >
            Advanced
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-700 text-lg">Loading flashcards...</p>
          </div>
        ) : flashcards.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div
              className="relative h-72 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl flex flex-col justify-center items-center mb-8 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-md"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {showTranslation
                  ? flashcards[currentCard]?.translation
                  : flashcards[currentCard]?.word}
              </h2>
              {!showTranslation && (
                <p className="text-gray-600 text-xl italic mt-6 px-12 text-center">
                  {flashcards[currentCard]?.example}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center gap-6 mb-8">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none"
                disabled={currentCard === 0}
              >
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPronunciation}
                  className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-200 transition-colors"
                  title="Play pronunciation"
                >
                  <FaVolumeUp size={24} />
                </button>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(e.target.value as 'normal' | 'slow')}
                  className="border-2 border-orange-200 text-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400"
                >
                  <option value="normal">Normal Speed</option>
                  <option value="slow">Slow Speed</option>
                </select>
              </div>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none"
                disabled={currentCard === flashcards.length - 1}
              >
                Next
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={markAsKnown}
                className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                I Know This Word ✨
              </button>
              <button
                onClick={() => setShowKnownWordsModal(true)}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                View Known Words 📚
              </button>
              <button
                onClick={refreshFlashcards}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Reset Cards 🔄
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Fantastic Job! 🎉</h2>
            <p className="text-gray-700 text-lg mb-8">You've mastered all the flashcards at this level!</p>
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={() => setKnownWords([])}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg text-lg"
              >
                Reset All Progress 🔄
              </button>
              <button
                onClick={() => router.push('/topics/security/quiz')}
                className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg text-lg"
              >
                Start Quiz 🎯
              </button>
            </div>
          </div>
        )}
      </main>

      {showKnownWordsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Known Words 🌟</h2>
            {knownWords.length > 0 ? (
              <ul className="space-y-4">
                {knownWords.map((word, index) => (
                  <li key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                    <span className="font-semibold text-gray-700">{word}</span>
                    <button
                      onClick={() => unmarkAsKnown(word)}
                      className="text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Remove ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No known words yet.</p>
            )}
            <button
              onClick={() => setShowKnownWordsModal(false)}
              className="mt-6 w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute top-4 left-4">
        <Link 
          href="/topics" 
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="text-2xl">🏠</span>
        </Link>
      </div>
    </div>
  );
}