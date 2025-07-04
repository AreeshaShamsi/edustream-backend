import express from 'express';
import fetch from 'node-fetch'; 
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = express.Router();

// Use your API key from .env file
const apiKey = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    res.status(500).json({ error: 'Failed to fetch response from Gemini API' });
  }
});

export default router;
