const Parser = require("rss-parser");
const sources = require("./sources");

const parser = new Parser({ timeout: 10000 });

// Fetch the latest item from each source. Skips a source silently on failure
// so one dead feed doesn't break the whole run.
async function fetchLatestItems() {
  const results = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const latest = feed.items?.[0];
      if (latest) {
        results.push({
          sourceName: source.name,
          title: latest.title?.trim(),
          link: latest.link,
          pubDate: latest.pubDate,
        });
      }
    } catch (err) {
      console.error(`[fetchContent] Skipping "${source.name}": ${err.message}`);
    }
  }

  return results;
}

module.exports = { fetchLatestItems };
