// ============================================================
// controllers/aiController.js — Server-side Gemini proxy
// The API key stays on the server; the frontend never sees it.
// ============================================================
import { GoogleGenAI } from '@google/genai';
import { COMPANY_CONTEXT, SYSTEM_INSTRUCTION } from './aiKnowledge.js';
import { apiLogger } from '../config/logger.js';

let ai;
function getAi() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

// ── POST /api/ai/chat ─────────────────────────────────────────
export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const contents = [
      ...history.map((m) => ({
        role: m.role,
        parts: [{ text: String(m.text).slice(0, 2000) }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + '\n\n' + COMPANY_CONTEXT,
      },
      contents,
    });

    const text =
      response.text ||
      "I'm having trouble connecting right now. Please try again or email info@sinrem.tech.";

    res.json({ success: true, text });
  } catch (err) {
    apiLogger.error('AI chat error', { error: err.message, ip: req.ip });
    res.status(500).json({
      success: false,
      text: 'AI service is temporarily unavailable. Please try again later.',
    });
  }
};
