const fetch = require("node-fetch");

const MODEL = "gemini-3.5-flash-lite"; // current-gen, low-latency, built for high-volume automation

// Summarizes one article into: { toolName, bullets: string[] }.
// toolName is the AI tool/company/product the article is mainly about (for bolding).
// bullets is capped at 4 short lines (well under the 10-line ceiling per item).
async function summarizeArticle({ title, text }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env var.");
  }

  const prompt = `You summarize AI/tech news for a Telegram channel.

Article title: ${title}

Article text:
${text || "(No body text extracted — summarize based on the title alone.)"}

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{"toolName": "short name of the main tool/company/product", "bullets": ["point 1", "point 2", "point 3"]}

Rules:
- 2 to 4 bullets max, each under 15 words.
- Only the most important, concrete points (what it does, what's new, why it matters).
- No fluff, no restating the headline.
- toolName should be 1-4 words (e.g. "GPT-5", "Hugging Face", "Notion AI").`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
  const cleaned = raw.replace(/^```json\s*|\s*```$/g, "");

  try {
    const parsed = JSON.parse(cleaned);
    return {
      toolName: parsed.toolName || title.split(" ").slice(0, 3).join(" "),
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets.slice(0, 4) : [],
    };
  } catch (err) {
    console.error("[summarizer] Failed to parse Gemini response:", raw);
    return { toolName: title, bullets: [] };
  }
}

module.exports = { summarizeArticle };
