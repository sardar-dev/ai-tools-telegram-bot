// Template 5A — bold header + bullet points per item.
// No source links/buttons. Bolds the tool/company name. Adds hashtags +
// an emoji reaction prompt at the end.

function formatDailyDigest(summarizedItems) {
  if (!summarizedItems.length) return null;

  let message = `🤖⚡ <b>AI TOOLS UPDATE</b>\n\n`;

  summarizedItems.forEach((item) => {
    message += `▸ <b>${escapeHtml(item.toolName)}</b>\n`;
    item.bullets.forEach((bullet) => {
      message += `  • ${escapeHtml(bullet)}\n`;
    });
    message += `\n`;
  });

  message += `🔥 React if this was useful\n`;
  message += `#AI #AITools #TechNews #Automation`;

  return message;
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { formatDailyDigest };
