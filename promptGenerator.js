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

This is for a social media channel — the goal is genuine engagement (views,
likes, shares), not just a technically correct image. Research on what
actually performs well in this style consistently shows:
- A strong single subject or clear "hook" the eye lands on immediately —
  not a busy, unfocused scene.
- Emotional pull: wonder, nostalgia, humor, or a "wait, is that real?"
  double-take — flat, purely descriptive scenes underperform.
- Specific sensory/textural detail (lighting, material, weather, mood) over
  generic adjectives like "beautiful" or "amazing."
- 2-3 well-chosen quality tags at most (e.g. "cinematic lighting,
  ultra-detailed") — stacking many dilutes the effect rather than helping.

Pick any interesting subject (a place, creature, scene, object, or moment) —
be creative and varied, but make sure it actually fits what makes THIS
specific style shareable. The prompt should be 30-50 words, richly
descriptive, and ready to feed directly into an image generator.

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
