const Parser = require("rss-parser");
const sources = require("./sources");

const parser = new Parser({ timeout: 10000 });

// How many recent items to pull per feed, so we have a pool to randomly
// select 3-5 from across all sources (not just each feed's single latest post).
const ITEMS_PER_FEED = 5;

// Fetch recent items from each source. Skips a source silently on failure
// so one dead feed doesn't break the whole run.
async function fetchRecentItems() {
  const results = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, ITEMS_PER_FEED);
      for (const item of items) {
        if (item.title && item.link) {
          results.push({
            sourceName: source.name,
            title: item.title.trim(),
            link: item.link,
            pubDate: item.pubDate,
          });
        }
      }
    } catch (err) {
      console.error(`[fetchContent] Skipping "${source.name}": ${err.message}`);
    }
  }

  return results;
}

// Randomly pick `count` items from the pool (no duplicates).
function pickRandom(items, count) {
  const pool = [...items];
  const picked = [];
  while (pool.length && picked.length < count) {
    const i = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(i, 1)[0]);
  }
  return picked;
}

module.exports = { fetchRecentItems, pickRandom };
