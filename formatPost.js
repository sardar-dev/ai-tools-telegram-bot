// Template 5A — bold header + bullet points per item.
// No source links/buttons. Bolds the tool/company name. Adds hashtags +
// an emoji reaction prompt at the end.
//
// SEO note: hashtags are indexed by Telegram's internal search, so this
// combines a fixed branded/evergreen set (for consistent channel discovery)
// with dynamic per-tool tags (for long-tail searches like "#Gemini" or
// "#Notion" landing directly on the post that mentions them).

const EVERGREEN_TAGS = ["#AI", "#AITools", "#TechNews", "#TheAIUpdates"];
const MAX_DYNAMIC_TAGS = 3;

function toHashtag(name) {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned ? `#${cleaned}` : "";
}

function formatDailyDigest(summarizedItems) {
  if (!summarizedItems.length) return null;

  let message = `🤖⚡ <b>THE AI UPDATES</b>\n\n`;

  summarizedItems.forEach((item) => {
    message += `▸ <b>${escapeHtml(item.toolName)}</b>\n`;
    item.bullets.forEach((bullet) => {
      message += `  • ${escapeHtml(bullet)}\n`;
    });
    message += `\n`;
  });

  message += `🔥 React if this was useful\n`;

  const dynamicTags = summarizedItems
    .slice(0, MAX_DYNAMIC_TAGS)
    .map((item) => toHashtag(item.toolName))
    .filter(Boolean);

  const allTags = [...new Set([...EVERGREEN_TAGS, ...dynamicTags])];
  message += allTags.join(" ");

  return message;
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { formatDailyDigest };
