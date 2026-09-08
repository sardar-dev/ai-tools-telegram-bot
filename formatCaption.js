// Builds the caption for an image post. Telegram photo captions are capped
// at 1024 characters, so this stays compact.

const EVERGREEN_TAGS = ["#AIArt", "#AIImage", "#TheAIUpdates"];

function styleToHashtag(style) {
  // Use just the first word/phrase of the style as a tag, e.g.
  // "cyberpunk neon cityscape" -> "#Cyberpunk"
  const firstWord = style.split(/[\s,]+/)[0].replace(/[^a-zA-Z0-9]/g, "");
  return firstWord ? `#${firstWord.charAt(0).toUpperCase()}${firstWord.slice(1)}` : "";
}

function formatCaption({ style, prompt }) {
  const styleTag = styleToHashtag(style);
  const tags = [...new Set([...EVERGREEN_TAGS, styleTag].filter(Boolean))];

  let caption = `🎨 <b>THE AI UPDATES</b>\n`;
  caption += `<i>Style: ${escapeHtml(style)}</i>\n\n`;
  caption += `${escapeHtml(prompt)}\n\n`;
  caption += tags.join(" ");

  // Hard safety trim in case a prompt runs long — Telegram caption cap is 1024.
  if (caption.length > 1024) {
    caption = caption.slice(0, 1000) + "…";
  }

  return caption;
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { formatCaption };
