const fetch = require("node-fetch");

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

// Posts the digest. Image is mandatory — sent first as a small header photo
// (short caption, well under Telegram's 1024-char photo-caption limit), then
// the full digest follows as its own text message (4096-char limit). If the
// primary image URL fails to send, retries once with a themed fallback image
// so a post never goes out without one.
async function postToChannel(message, imageUrl) {
  const { token, channelId } = getCreds();

  const trySendPhoto = async (url) => {
    const photoRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        photo: url,
        caption: "🤖⚡ AI Tools Update",
      }),
    });
    return photoRes.json();
  };

  let photoData = await trySendPhoto(imageUrl).catch((err) => ({ ok: false, description: err.message }));

  if (!photoData.ok) {
    console.error(`[postToTelegram] sendPhoto failed for primary image: ${photoData.description}`);
    const { pickFallbackImage } = require("./articleReader");
    const fallback = pickFallbackImage();
    photoData = await trySendPhoto(fallback).catch((err) => ({ ok: false, description: err.message }));
    if (!photoData.ok) {
      console.error(`[postToTelegram] sendPhoto failed for fallback image too: ${photoData.description}`);
    }
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: channelId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }
  return data;
}

module.exports = { postToChannel };
