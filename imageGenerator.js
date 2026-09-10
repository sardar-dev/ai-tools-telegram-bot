const fetch = require("node-fetch");

// Gemini image models to try, in order. All currently show 0 free-tier
// quota on this project (confirmed via the AI Studio rate-limit dashboard —
// every image-capable model shows 0/0, not just "exhausted"), so these will
// keep failing until billing is enabled — but they're tried first so this
// starts working automatically the moment billing is turned on, no code
// change needed.
const GEMINI_IMAGE_MODELS = ["gemini-2.5-flash-image", "gemini-3.1-flash-image"];

async function tryGeminiModel(model, prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`${model}: ${data.error.message}`);
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);
  if (!imagePart) {
    throw new Error(`${model}: returned no image data.`);
  }

  return {
    buffer: Buffer.from(imagePart.inlineData.data, "base64"),
    mimeType: imagePart.inlineData.mimeType || "image/png",
    source: model,
  };
}

// Free, no-key fallback — used only if every Gemini model above fails.
// Guarantees a post can always go out even with zero API billing set up.
async function tryPollinations(prompt) {
  // model=flux: Flux has meaningfully better prompt-following than
  // Pollinations' default model, especially for flowing natural-language
  // prompts (not just comma-separated tags). seed=random avoids any
  // caching collisions if the same prompt text ever repeats.
  const seed = Math.floor(Math.random() * 2147483647);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

  const res = await fetch(url, { timeout: 30000 });
  if (!res.ok) {
    throw new Error(`Pollinations: request failed with status ${res.status}`);
  }

  const buffer = await res.buffer();
  const mimeType = res.headers.get("content-type") || "image/jpeg";

  return { buffer, mimeType, source: "pollinations" };
}

// Generates an image from a text prompt. Tries each Gemini model in order,
// then falls back to Pollinations.ai if all of them fail. Returns
// { buffer, mimeType, source } — source tells you which provider succeeded,
// useful for logs/debugging.
async function generateImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const errors = [];

  if (apiKey) {
    for (const model of GEMINI_IMAGE_MODELS) {
      try {
        return await tryGeminiModel(model, prompt, apiKey);
      } catch (err) {
        console.error(`[imageGenerator] ${err.message}`);
        errors.push(err.message);
      }
    }
  } else {
    errors.push("Missing GEMINI_API_KEY env var — skipped Gemini models.");
  }

  try {
    return await tryPollinations(prompt);
  } catch (err) {
    console.error(`[imageGenerator] ${err.message}`);
    errors.push(err.message);
  }

  throw new Error(`All image providers failed: ${errors.join(" | ")}`);
}

module.exports = { generateImage };
