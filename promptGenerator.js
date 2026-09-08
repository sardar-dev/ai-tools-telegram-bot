const fetch = require("node-fetch");
const STYLES = require("./styles");

const TEXT_MODEL = "gemini-3.5-flash-lite"; // fast + cheap, good for short creative text

function pickRandomStyle() {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

// Generates { style, prompt } — a vivid, self-contained AI image generation
// prompt built around one randomly chosen trending style.
async function generateImagePrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env var.");
  }

  const style = pickRandomStyle();

  const instruction = `Write one vivid, detailed AI image generation prompt in this style: "${style}".

Pick any interesting subject (a place, creature, scene, object, or abstract concept) —
be creative and varied. The prompt should be 30-50 words, richly descriptive,
and ready to feed directly into an image generator.

Rules:
- No real named people, celebrities, or copyrighted characters/brands.
- Safe for work, no violence or disturbing imagery.
- Return ONLY the prompt text itself — no preamble, no quotes, no markdown.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: instruction }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 200 },
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Gemini API error (prompt generation): ${data.error.message}`);
  }

  const prompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!prompt) {
    throw new Error("Gemini returned no prompt text.");
  }

  return { style, prompt };
}

module.exports = { generateImagePrompt };
