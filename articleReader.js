const fetch = require("node-fetch");
const cheerio = require("cheerio");

// Fetches an article page and extracts main body text + a representative image.
// Returns { text, image } — either can be empty if extraction fails.
async function fetchArticle(url) {
  try {
    const res = await fetch(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIToolsBot/1.0)" },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, aside, noscript").remove();

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // Grab paragraph text as a reasonable proxy for article body.
    const paragraphs = $("article p, main p, p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 40); // skip short/boilerplate lines

    const text = paragraphs.join("\n").slice(0, 6000); // cap for API context

    return { text, image };
  } catch (err) {
    console.error(`[articleReader] Failed to fetch ${url}: ${err.message}`);
    return { text: "", image: "" };
  }
}

module.exports = { fetchArticle };
