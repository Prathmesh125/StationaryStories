/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// app/api/gemini/route.ts
import { type NextRequest, NextResponse } from 'next/server';

// Define the types for the request and response
interface GeminiRequestContent {
  parts: {
    text: string;
  }[];
}

interface GeminiRequest {
  contents: GeminiRequestContent[];
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiResponseCandidate {
  content: {
    parts: GeminiResponsePart[];
  };
  finishReason: string;
  index: number;
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: unknown[];
  };
}

// Add this to your .env.local
// GEMINI_API_KEY=your_api_key_here

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json();

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 },
      );
    }

    // Prepare the request to Gemini API
    const geminiRequest: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              text: body.text ?? 'Hello, Gemini!',
            },
          ],
        },
      ],
    };

    // Make the request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      },
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Error from Gemini API', details: errorData },
        { status: response.status },
      );
    }

    // Parse the response
    const data: GeminiResponse = await response.json();

    // Extract the AI response text
    let aiResponse = '';
    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates?.[0]?.content?.parts ?? [];
      aiResponse = parts.map((part) => part.text).join('');
    }

    // Return the AI response
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
