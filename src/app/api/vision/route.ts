import { type NextRequest, NextResponse } from 'next/server';

interface VisionRequest {
  image: string; // base64 string
  mimeType: string;
}

interface GeminiVisionRequest {
  contents: [
    {
      parts: [
        { text: string },
        {
          inlineData: {
            mimeType: string;
            data: string;
          };
        },
      ];
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VisionRequest;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 },
      );
    }

    if (!body.image || !body.mimeType) {
      return NextResponse.json(
        { error: 'Missing image data or mimeType' },
        { status: 400 },
      );
    }

    // Prepare the request to Gemini API
    const geminiRequest: GeminiVisionRequest = {
      contents: [
        {
          parts: [
            {
              text: 'Analyze this invoice/receipt. Extract the items and quantities. Return the result STRICTLY as a JSON array of objects with the keys: `name` (string), `quantity` (number). Do not include any markdown formatting, backticks, or extra text, only pure JSON.',
            },
            {
              inlineData: {
                mimeType: body.mimeType,
                data: body.image.split(',')[1] || body.image, // Handle data URIs by splitting off the prefix if present
              },
            },
          ],
        },
      ],
    };

    // Make the request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Gemini API:', errorData);
      return NextResponse.json(
        { error: 'Error from Gemini API', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    let aiResponse = '';
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.candidates && data.candidates.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const parts = data.candidates[0].content.parts || [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      aiResponse = parts.map((part: any) => part.text).join('');
    }

    // Clean up potential markdown from the response
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON from AI response:', aiResponse);
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: aiResponse },
        { status: 500 },
      );
    }

    return NextResponse.json({ items: parsedItems });
  } catch (error) {
    console.error('Error processing vision request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
