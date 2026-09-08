const fetch = require("node-fetch");
const FormData = require("form-data");

function getCreds() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !channelId) {
    throw new Error(
      "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID env vars. Copy .env.example to .env and fill them in."
    );
  }
  return { token, channelId };
}

// Posts a generated image (raw bytes) with a caption, via multipart upload
// (no external image URL needed — the image never leaves our own pipeline).
async function postImage({ buffer, mimeType, caption }) {
  const { token, channelId } = getCreds();

  const form = new FormData();
  form.append("chat_id", channelId);
  form.append("caption", caption);
  form.append("parse_mode", "HTML");
  form.append("photo", buffer, {
    filename: `image.${mimeType.split("/")[1] || "png"}`,
    contentType: mimeType,
  });

  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }
  return data;
}

module.exports = { postImage };
