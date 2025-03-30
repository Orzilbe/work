// app/api/create-post/route.js
import OpenAI from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is missing" },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { requiredWords } = body;

    if (!requiredWords || !Array.isArray(requiredWords) || requiredWords.length === 0) {
      return NextResponse.json(
        { error: "Required words array is missing, invalid, or empty" },
        { status: 400 }
      );
    }

    // Validate requiredWords content
    if (!requiredWords.every(word => typeof word === 'string' && word.trim().length > 0)) {
      return NextResponse.json(
        { error: "All items in 'requiredWords' must be non-empty strings" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Create a social media style post about Jewish heritage and Israeli history.
                     The post should:
                     - Be written in a social media-friendly tone (like Facebook)
                     - Include no more than 4 relevant emojis
                     - Highlight key historical dates and places
                     - Share a real and inspiring story from Jewish or Israeli history, featuring key figures or events
                     - Naturally use these terms: ${requiredWords.join(', ')}
                     - End with 1-2 engaging questions to spark conversation
                     - Keep it concise (100-150 words)
                     - Be pro-Israel and factual
                     - Avoid controversial political statements or hashtags
                     
                     Follow this structure:
                     1. Start with relevant emojis
                     2. Share the story in 2-3 short paragraphs
                     3. End with engaging questions`
        },
        {
          role: "user",
          content: `Create an engaging social media post about a specific event from Jewish or Israeli history.
                   Use these terms naturally: ${requiredWords.join(', ')}`,
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim();

    // Fallback text in case of empty response
    if (!generatedText) {
      return NextResponse.json(
        { text: "🕍 Discover a remarkable story from Jewish heritage or Israeli history soon. Stay tuned!" },
        { status: 200 }
      );
    }

    return NextResponse.json({ text: generatedText }, { status: 200 });

  } catch (error) {
    console.error("Error generating post:", error);
    return NextResponse.json(
      { error: "Failed to generate post", details: error.message },
      { status: 500 }
    );
  }
}
