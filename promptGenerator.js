const fetch = require("node-fetch");
const STYLES = require("./styles");

const TEXT_MODEL = "gemini-3.5-flash";
const MIN_WORDS = 45;
const MAX_ATTEMPTS = 2;

const BANNED_FILLER_WORDS = [
  "beautiful", "amazing", "stunning", "breathtaking", "incredible",
  "awesome", "gorgeous", "epic", "magical", "wonderful",
];

const REQUIRED_ELEMENTS_HINT = [
  "a specific subject description (invented — age, gender, hair, notable feature)",
  "a specific setting/environment",
  "specific wardrobe/styling details",
  "a specific pose and expression",
  "lighting/atmosphere detail",
  "a camera/lens spec (e.g. \"shot on 50mm f/1.4 lens\")",
  "resolution/quality tags (e.g. \"8k resolution, cinematic\")",
];

function pickRandomStyle() {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

function buildInstruction(style) {
  return `You write AI portrait-photography prompts for a social media channel that's currently getting strong engagement with a specific viral prompt format. Match that format exactly — this is NOT a short one-line description.

THEME: "${style.label}"

Here is a real example at the exact density and structure required (do NOT reuse this subject or scene — invent a completely different one):
"${style.example}"

REQUIRED STRUCTURE — your prompt must include ALL of these, woven into one dense paragraph like the example:
${REQUIRED_ELEMENTS_HINT.map((e) => `- ${e}`).join("\n")}

IMPORTANT: There is no uploaded photo to reference — invent a fully fictional
person each time (never a real named person or celebrity). Describe them
directly (e.g. "a young man with short black hair") instead of saying
"the person in the uploaded photo."

STRICT RULES:
- This must be a SINGLE dense paragraph, 60-90 words. Under 60 words is a FAILURE — do not submit a short prompt.
- Never use these overused filler words: ${BANNED_FILLER_WORDS.join(", ")}.
- No real named people, celebrities, or copyrighted characters/brands.
- Safe for work, no violence or disturbing imagery, no sexualized content.
- Pick a genuinely different subject, setting, and pose than the example above.
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
      generationConfig: { temperature: 0.95, maxOutputTokens: 300 },
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

// Generates { style, prompt } — a dense, structured AI portrait prompt
// (subject + setting + wardrobe + pose + lighting + camera specs + quality
// tags, all in one paragraph) built around a randomly chosen theme, with a
// quality retry if the first attempt is too short or generic.
async function generateImagePrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env var.");
  }

  const style = pickRandomStyle();
  const instruction = buildInstruction(style);

  let prompt = await callGemini(instruction, apiKey);

  for (let attempt = 1; attempt < MAX_ATTEMPTS && isLowQuality(prompt); attempt++) {
    console.log("[promptGenerator] Low-quality/short prompt, retrying:", prompt);
    prompt = await callGemini(instruction, apiKey);
  }

  return { style: style.label, prompt };
}

module.exports = { generateImagePrompt };
