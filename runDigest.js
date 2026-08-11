const { fetchRecentItems, pickRandom } = require("./fetchContent");
const { fetchArticle, pickFallbackImage } = require("./articleReader");
const { summarizeArticle } = require("./summarizer");
const { formatDailyDigest } = require("./formatPost");
const { postToChannel } = require("./postToTelegram");

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

// Full pipeline: fetch RSS pool -> pick 3-5 random items -> read + summarize
// each with Gemini -> format Template 5A digest -> post (always with an image).
async function runDigest() {
  const pool = await fetchRecentItems();
  if (!pool.length) {
    return { posted: false, reason: "No RSS items fetched." };
  }

  const count = MIN_ITEMS + Math.floor(Math.random() * (MAX_ITEMS - MIN_ITEMS + 1));
  const picked = pickRandom(pool, count);

  const summarized = [];
  let headerImage = "";

  for (const item of picked) {
    const { text, image } = await fetchArticle(item.link);
    if (!headerImage && image) headerImage = image;

    try {
      const { toolName, bullets } = await summarizeArticle({ title: item.title, text });
      if (bullets.length) {
        summarized.push({ toolName, bullets });
      }
    } catch (err) {
      console.error(`[runDigest] Summarization failed for "${item.title}": ${err.message}`);
    }
  }

  if (!summarized.length) {
    return { posted: false, reason: "No items could be summarized." };
  }

  // Image is mandatory on every post — use a themed fallback if none of the
  // articles yielded a valid image.
  if (!headerImage) headerImage = pickFallbackImage();

  const message = formatDailyDigest(summarized);
  await postToChannel(message, headerImage);

  return { posted: true, itemCount: summarized.length, usedFallbackImage: !headerImage };
}

module.exports = { runDigest };
