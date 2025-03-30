interface FlashcardProps {
    word: string;
    translation: string;
    example: string;
    showTranslation: boolean;
    onFlip: () => void;
  }
  
  const Flashcard = ({ word, translation, example, showTranslation, onFlip }: FlashcardProps) => (
    <div
      className="relative h-72 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl flex flex-col justify-center items-center mb-8 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-md"
      onClick={onFlip}
    >
      <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
        {showTranslation ? translation : word}
      </h2>
      {!showTranslation && (
        <p className="text-gray-600 text-xl italic mt-6 px-12 text-center">
          {example}
        </p>
      )}
    </div>
  );
  
  export default Flashcard;