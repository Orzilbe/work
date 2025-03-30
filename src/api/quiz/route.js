// app/api/quiz/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// יצירת מופע של OpenAI עם מפתח ה-API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API endpoint ליצירת שאלות בוחן על בסיס פלאשקארדס
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { flashcards, count = 5 } = body;

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return NextResponse.json(
        { error: "Flashcards array is missing or invalid" },
        { status: 400 }
      );
    }

    // יצירת הטקסט של המילים והדוגמאות עבור ה-prompt
    const wordsWithExamples = flashcards.map(card => 
      `- Word: "${card.word}" - Example: "${card.example}" - Translation: "${card.translation}"`
    ).join('\n');

    const prompt = `
      Create ${count} multiple-choice quiz questions in English to test understanding of these terms:
      
      ${wordsWithExamples}
      
      For each question:
      1. Create a scenario or question that tests the understanding of one of the words
      2. Provide 4 possible answers (these should be reasonable and challenging)
      3. Mark the correct answer
      
      The questions should vary in format - some should be "what does this word mean", some should be "which word fits in this context", and some should be usage-based.
      
      Return as a JSON array with this structure:
      [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0 // Index of the correct answer (0-3)
        }
      ]
      
      Make sure each question tests a different word if possible, and that questions are challenging but fair.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that creates educational quiz questions for English language learners." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    try {
      const responseContent = completion.choices[0].message.content.trim();
      let questions;
      
      try {
        // ניסיון ראשון - לפרסר את התוכן כ-JSON
        questions = JSON.parse(responseContent);
      } catch (parseError) {
        // ניסיון שני - לחלץ את ה-JSON מהתשובה עם regex
        const jsonRegex = /\[\s*{[\s\S]*}\s*\]/m;
        const jsonMatch = responseContent.match(jsonRegex);
        
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON response');
        }
      }
      
      // וידוא שהתוצאה היא מערך ושיש לפחות שאלה אחת
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid response format');
      }
      
      // וידוא שלכל שאלה יש את המבנה הנכון
      questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
            typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Question at index ${index} has invalid format`);
        }
      });
      
      return NextResponse.json({ questions }, { status: 200 });
    } catch (err) {
      console.error('Error parsing quiz questions:', err);
      
      // במקרה של כשל, יצירת שאלות בוחן בסיסיות כגיבוי
      const backupQuestions = flashcards.slice(0, count).map((card, index) => ({
        question: `What is the correct meaning of the word "${card.word}"?`,
        options: [
          card.translation,
          "Incorrect translation 1",
          "Incorrect translation 2",
          "Incorrect translation 3"
        ],
        correctAnswer: 0
      }));
      
      return NextResponse.json({ 
        questions: backupQuestions,
        note: 'Using backup questions due to generation failure'
      });
    }
  } catch (error) {
    console.error('Error in quiz API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}