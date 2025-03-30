// src/app/topics/quiz/QuizComponent.tsx
import React, { useState, useEffect } from 'react';
import HomeNavigation from '../../HomeNavigation';
import LoadingSpinner from '../flashcard/LoadingSpinner';
import ErrorMessage from '../flashcard/ErrorMessage';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizComponentProps {
  flashcards: any[];
  topic: string;
  onComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ 
  flashcards, 
  topic, 
  onComplete,
  onBack
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // שליחת בקשה ל-API ליצירת שאלות בוחן על בסיס הפלאשקארדס
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flashcards,
            count: 5, // כמות שאלות בבוחן
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate quiz questions');
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error('Error generating quiz:', err);
        setError(err.message || 'An error occurred while generating the quiz');
      } finally {
        setIsLoading(false);
      }
    };

    generateQuiz();
  }, [flashcards]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    
    const isAnswerCorrect = optionIndex === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    // מעבר אוטומטי לשאלה הבאה אחרי 1.5 שניות
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
      } else {
        setIsQuizComplete(true);
        onComplete(isAnswerCorrect ? score + 1 : score, questions.length);
      }
    }, 1500);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (questions.length === 0) {
    return <ErrorMessage message="No quiz questions available" />;
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            סיימת את הבוחן!
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">ציון</span>
              <span className="text-sm font-medium text-gray-700">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${percentage >= 70 ? 'bg-green-600' : 'bg-yellow-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-600">
              ענית נכון על <span className="font-bold text-gray-800">{score}</span> מתוך{' '}
              <span className="font-bold text-gray-800">{questions.length}</span> שאלות
            </p>
            
            {percentage >= 70 ? (
              <p className="mt-2 text-green-600 font-medium">
                כל הכבוד! אתה מוכן להמשיך לשלב הבא!
              </p>
            ) : (
              <p className="mt-2 text-yellow-600 font-medium">
                כדאי לחזור על המילים ולנסות שוב.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            {percentage >= 70 ? (
              <button
                onClick={() => window.location.href = `/topics/${topic}/post`}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                המשך לתרגול פוסט ברשת חברתית
              </button>
            ) : null}
            
            <button
              onClick={onBack}
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              חזור ללימוד המילים
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <HomeNavigation />
      
      <h1 className="text-3xl font-bold mb-8 text-center">בוחן: {topic}</h1>
      
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <span className="text-sm font-medium text-gray-500">
            שאלה {currentQuestionIndex + 1} מתוך {questions.length}
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  selectedOption === index
                    ? showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-red-100 border-2 border-red-500'
                      : 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            ))}
          </div>
          
          {showFeedback && (
            <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isCorrect 
                ? 'תשובה נכונה! כל הכבוד!' 
                : `תשובה שגויה. התשובה הנכונה היא: ${currentQuestion.options[currentQuestion.correctAnswer]}`
              }
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm font-medium text-gray-600">
            ציון: {score}/{currentQuestionIndex + (selectedOption !== null ? 1 : 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;