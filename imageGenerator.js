const fetch = require("node-fetch");

// Image generation runs entirely through Pollinations.ai (free, no key
// required). Gemini is used only for writing the prompt (see
// promptGenerator.js) — its image models were confirmed to have zero
// free-tier quota on this account, so there's no point calling them here.
async function generateImage(prompt) {
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

module.exports = { generateImage };
