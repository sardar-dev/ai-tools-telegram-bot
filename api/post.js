// Vercel serverless function — triggered daily by Vercel Cron.
// Reuses the same logic as index.js so local runs and cron runs stay identical.
const { fetchLatestItems } = require("../fetchContent");
const { formatDailyDigest } = require("../formatPost");
const { postToChannel } = require("../postToTelegram");

module.exports = async (req, res) => {
  try {
    const items = await fetchLatestItems();

    if (!items.length) {
      return res.status(200).json({ ok: true, message: "No items fetched, skipped." });
    }

    const message = formatDailyDigest(items);
    await postToChannel(message);

    res.status(200).json({ ok: true, message: "Posted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
