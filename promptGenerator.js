const fetch = require("node-fetch");
const STYLES = require("./styles");

const TEXT_MODEL = "gemini-3.5-flash"; // stronger creative writing than flash-lite; quota comfortably covers 4 posts/day
const MIN_WORDS = 20;
const MAX_ATTEMPTS = 2;

const BANNED_FILLER_WORDS = [
  "beautiful", "amazing", "stunning", "breathtaking", "incredible",
  "awesome", "gorgeous", "epic", "magical", "wonderful",
];

function pickRandomStyle() {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

function buildInstruction(style) {
  return `You write AI image generation prompts for a social media channel. The goal is genuine engagement (views, likes, shares) — not just a technically valid image.

STYLE: "${style.label}"

Here is one example of the quality bar expected for this exact style (do NOT reuse this example or its subject — write something entirely different):
"${style.example}"

What makes prompts like that work:
- One clear subject or moment the eye lands on immediately — not a busy, unfocused scene.
- Concrete, specific sensory detail: exact lighting, texture, material, weather, color — never vague adjectives.
- A small unexpected or emotional detail that makes it feel like a real moment, not a generic render.
- Reads as one flowing descriptive sentence or two — not a comma-separated tag dump.

STRICT RULES:
- Never use these overused filler words: ${BANNED_FILLER_WORDS.join(", ")}.
- No real named people, celebrities, or copyrighted characters/brands.
- Safe for work, no violence or disturbing imagery.
- 35-60 words.
- Pick a genuinely different subject than the example above.
- Return ONLY the prompt text itself — no preamble, no quotes, no markdown, no labels.`;
}

function isLowQuality(text) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < MIN_WORDS) return true;
  const lower = text.toLowerCase();
  return BANNED_FILLER_WORDS.some((w) => lower.includes(w));
}

async function callGemini(instruction, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: instruction }] }],
      generationConfig: { temperature: 0.95, maxOutputTokens: 250 },
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Gemini API error (prompt generation): ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Gemini returned no prompt text.");
  }
  return text;
}

// Generates { style, prompt } — a vivid, concrete AI image generation prompt
// built around one randomly chosen trending style, with a quality retry if
// the first attempt is too short or leans on generic filler words.
async function generateImagePrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env var.");
  }

  const style = pickRandomStyle();
  const instruction = buildInstruction(style);

  let prompt = await callGemini(instruction, apiKey);

  for (let attempt = 1; attempt < MAX_ATTEMPTS && isLowQuality(prompt); attempt++) {
    console.log("[promptGenerator] Low-quality prompt, retrying:", prompt);
    prompt = await callGemini(instruction, apiKey);
  }

  return { style: style.label, prompt };
}

module.exports = { generateImagePrompt };
