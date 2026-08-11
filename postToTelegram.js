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

// Posts the digest. If an image URL is provided, sends it first as a small
// header photo (short caption, well under Telegram's 1024-char photo-caption
// limit), then sends the full digest as its own text message (4096-char
// limit) right after — so the image always shows regardless of digest length.
async function postToChannel(message, imageUrl) {
  const { token, channelId } = getCreds();

  if (imageUrl) {
    try {
      const photoRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          photo: imageUrl,
          caption: "🤖⚡ AI Tools Update",
        }),
      });
      const photoData = await photoRes.json();
      if (!photoData.ok) {
        console.error(`[postToTelegram] sendPhoto failed: ${photoData.description}`);
      }
    } catch (err) {
      console.error(`[postToTelegram] sendPhoto error: ${err.message}`);
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
