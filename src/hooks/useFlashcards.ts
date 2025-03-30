'use client';

import { useState, useEffect } from 'react';
import { Flashcard } from '@/app/topics/flashcard/types';

const INITIAL_CARDS_MAP: Record<string, Flashcard[]> = {
  security: [
    { id: 0, word: 'Defense', translation: 'הגנה', example: 'Israel has a strong defense system.', difficulty: 'easy' },
    { id: 1, word: 'Security', translation: 'ביטחון', example: 'National security is a top priority for Israel.', difficulty: 'easy' },
    { id: 2, word: 'Military', translation: 'צבאי', example: 'The military operation was successful in neutralizing the threat.', difficulty: 'easy' },
    { id: 3, word: 'Intelligence', translation: 'מודיעין', example: 'Intelligence gathering is critical for preventing attacks.', difficulty: 'medium' },
    { id: 4, word: 'Border', translation: 'גבול', example: 'Securing Israel\'s borders is an ongoing challenge.', difficulty: 'easy' }
  ],
  innovation: [
    { id: 0, word: 'Startup', translation: 'חברת הזנק', example: 'Israel is known as the Startup Nation.', difficulty: 'easy' },
    { id: 1, word: 'Technology', translation: 'טכנולוגיה', example: 'Israel is a global leader in developing advanced technology.', difficulty: 'easy' },
    { id: 2, word: 'Innovation', translation: 'חדשנות', example: 'Israeli innovation has transformed many industries.', difficulty: 'easy' },
    { id: 3, word: 'Research', translation: 'מחקר', example: 'Research institutions in Israel collaborate with industry partners.', difficulty: 'easy' },
    { id: 4, word: 'Development', translation: 'פיתוח', example: 'Many international companies have research and development centers in Israel.', difficulty: 'medium' }
  ],
  heritage: [
    { id: 0, word: 'History', translation: 'היסטוריה', example: 'The history of Israel spans thousands of years.', difficulty: 'easy' },
    { id: 1, word: 'Heritage', translation: 'מורשת', example: 'Jewish heritage is visible throughout Israel\'s culture.', difficulty: 'medium' },
    { id: 2, word: 'Ancient', translation: 'עתיק', example: 'Jerusalem is one of the ancient cities of the world.', difficulty: 'easy' },
    { id: 3, word: 'Tradition', translation: 'מסורת', example: 'Israeli traditions blend modern and historical practices.', difficulty: 'easy' },
    { id: 4, word: 'Culture', translation: 'תרבות', example: 'Israeli culture reflects its diverse population.', difficulty: 'easy' }
  ]
};

// פונקציה לטעינת מילים חדשות מה-API
async function fetchNewWords(topic: string, existingWords: string[]): Promise<Flashcard[]> {
  try {
    const response = await fetch('/api/generate-flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        difficulty: 'beginner', // ניתן לשנות למשתנה דינמי בעתיד
        existingWords,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch new flashcards');
    }

    const data = await response.json();
    return data.words;
  } catch (error) {
    console.error('Error fetching new flashcards:', error);
    throw error;
  }
}

export function useFlashcards(topic: string) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // בדיקה אם יש מילים שמורות ב-localStorage
        const savedCardsKey = `flashcards_${topic}`;
        const savedCards = localStorage.getItem(savedCardsKey);

        if (savedCards) {
          // אם יש מילים שמורות, משתמשים בהן
          setFlashcards(JSON.parse(savedCards));
        } else {
          // אחרת, משתמשים במילים הבסיסיות מהמפה הקבועה
          const initialCards = INITIAL_CARDS_MAP[topic] || [];
          
          if (initialCards.length > 0) {
            setFlashcards(initialCards);
            // שומרים את המילים הבסיסיות ב-localStorage
            localStorage.setItem(savedCardsKey, JSON.stringify(initialCards));
          } else {
            // אם אין מילים בסיסיות למרות שהנושא קיים, מנסים להביא חדשות מה-API
            try {
              const newWords = await fetchNewWords(topic, []);
              setFlashcards(newWords);
              localStorage.setItem(savedCardsKey, JSON.stringify(newWords));
            } catch (fetchError) {
              setError('אין מילים זמינות עבור נושא זה וגם לא הצלחנו לייצר חדשות');
            }
          }
        }
      } catch (err) {
        setError('אירעה שגיאה בטעינת המילים');
        console.error('Error loading flashcards:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [topic]);

  // פונקציה להוספת מילים חדשות לרשימה
  const addNewWords = async () => {
    if (!topic) return;

    setIsLoading(true);
    try {
      // מביאים את המילים הקיימות כדי לשלוח ל-API שלא יחזיר כפילויות
      const existingWords = flashcards.map(card => card.word);
      const newWords = await fetchNewWords(topic, existingWords);
      
      // מוסיפים את המילים החדשות לרשימה הקיימת
      const updatedCards = [...flashcards, ...newWords];
      setFlashcards(updatedCards);
      
      // שומרים את הרשימה המעודכנת ב-localStorage
      localStorage.setItem(`flashcards_${topic}`, JSON.stringify(updatedCards));
      
      return newWords;
    } catch (error) {
      setError('שגיאה בהבאת מילים חדשות');
      console.error('Error fetching new words:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    flashcards, 
    isLoading, 
    error, 
    addNewWords 
  };
}