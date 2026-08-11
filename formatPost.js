// Turns a list of { sourceName, title, link } items into one Telegram message.
// Telegram messages support basic HTML formatting when parse_mode is "HTML".
function formatDailyDigest(items) {
  if (!items.length) return null;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  let message = `🤖 <b>AI Tools & News — ${today}</b>\n\n`;

  items.forEach((item, i) => {
    message += `${i + 1}. <b>${escapeHtml(item.title)}</b>\n`;
    message += `   📰 ${escapeHtml(item.sourceName)}\n`;
    message += `   🔗 <a href="${item.link}">Read more</a>\n\n`;
  });

  message += `Follow for daily AI tool drops 🚀`;

  return message;
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { formatDailyDigest };
