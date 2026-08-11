const { fetchRecentItems, pickRandom } = require("./fetchContent");
const { fetchArticle } = require("./articleReader");
const { summarizeArticle } = require("./summarizer");
const { formatDailyDigest } = require("./formatPost");
const { postToChannel } = require("./postToTelegram");

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

// Full pipeline: fetch RSS pool -> pick 3-5 random items -> read + summarize
// each with Claude -> format Template 5A digest -> post (with header image).
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

  const message = formatDailyDigest(summarized);
  await postToChannel(message, headerImage);

  return { posted: true, itemCount: summarized.length };
}

module.exports = { runDigest };
