const fs = require('fs');
require('dotenv').config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API Key");
    return;
  }
  
  const geminiRequest = {
    contents: [
      {
        parts: [
          {
            text: "Hello, Gemini!",
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    }
  );

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
