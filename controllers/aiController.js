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
    const normalizedMessage = String(message || '').toLowerCase();

    // Keep Sinrem AI responsive even if provider key is missing.
    if (!process.env.GEMINI_API_KEY) {
      let fallback =
        "Sinrem AI is currently running in fallback mode. For project scoping, please use /contact and our team will respond quickly.";
      if (normalizedMessage.includes('service') || normalizedMessage.includes('ai')) {
        fallback =
          "We deliver custom software, AI automation, mobile/web apps, and cloud systems. Share your requirement on /contact and we can scope stack, timeline, and execution.";
      }
      return res.json({ success: true, text: fallback });
    }

    const contents = [
      ...history.map((m) => ({
        role: m.role,
        parts: [{ text: String(m.text).slice(0, 2000) }],
      })),
      { role: 'user', parts: [{ text: String(message).slice(0, 2000) }] },
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
