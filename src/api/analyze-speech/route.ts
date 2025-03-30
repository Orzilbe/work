// app/api/analyze-speech/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  text: string;
  requiredWords: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { text, requiredWords } = await request.json() as AnalysisRequest;

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Check word usage
    const usedWords = requiredWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );

    // Get AI analysis
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a friendly English teacher helping students practice military vocabulary.
                   Review this response and provide encouraging feedback.
                   Focus on:
                   1. Clear pronunciation hints if needed
                   2. Grammar tips (keep it simple)
                   3. Praise for using military terms: ${requiredWords.join(', ')}
                   
                   Keep feedback brief, friendly, and spoken (will be converted to speech).`
        },
        {
          role: 'user',
          content: `Student's response: "${text}"
                   Used military terms: ${usedWords.join(', ')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    // Extract feedback
    const feedback = analysis.choices[0]?.message?.content || "Thanks for your answer!";

    return NextResponse.json({
      text: text,
      feedback: feedback,
      usedWords
    });

  } catch (error) {
    console.error('Speech analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze speech', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}