const fetch = require("node-fetch");
const cheerio = require("cheerio");

// Curated fallback images (stable, direct-hosted, tech/AI themed) — used ONLY
// if we can't extract a usable image from any of the picked articles, so a
// post never goes out without an image.
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&h=720&fit=crop&q=80",
];

function pickFallbackImage() {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

// Resolves a possibly-relative image URL against the article's own URL.
function resolveUrl(maybeRelative, baseUrl) {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return "";
  }
}

// Confirms a URL actually serves an image before we trust it (avoids dead
// links, redirects to HTML error pages, tiny tracking pixels, etc).
async function isValidImage(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: "HEAD", timeout: 6000 });
    const type = res.headers.get("content-type") || "";
    return res.ok && type.startsWith("image/");
  } catch {
    return false;
  }
}

// Fetches an article page and extracts main body text + a representative image.
// Returns { text, image } — image is validated, or "" if nothing usable was found.
async function fetchArticle(url) {
  try {
    const res = await fetch(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIToolsBot/1.0)" },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, aside, noscript").remove();

    // Try several meta tag variants, in order of preference (largest/most
    // reliable first), then fall back to the first in-article <img>.
    const candidates = [
      $('meta[property="og:image:secure_url"]').attr("content"),
      $('meta[property="og:image"]').attr("content"),
      $('meta[name="twitter:image"]').attr("content"),
      $('meta[name="twitter:image:src"]').attr("content"),
      $("article img").first().attr("src"),
      $("main img").first().attr("src"),
    ].filter(Boolean);

    let image = "";
    for (const candidate of candidates) {
      const resolved = resolveUrl(candidate, url);
      if (await isValidImage(resolved)) {
        image = resolved;
        break;
      }
    }

    const paragraphs = $("article p, main p, p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 40);

    const text = paragraphs.join("\n").slice(0, 6000);

    return { text, image };
  } catch (err) {
    console.error(`[articleReader] Failed to fetch ${url}: ${err.message}`);
    return { text: "", image: "" };
  }
}

module.exports = { fetchArticle, pickFallbackImage };
