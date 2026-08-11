// Vercel serverless function, triggered hourly by Vercel Cron.
// Only actually posts during the one randomly-chosen hour per 12hr window
// (see scheduler.js) — so it ends up posting twice a day at a time that
// shifts daily, without needing any external state/storage.
const { runDigest } = require("../runDigest");
const { isRandomPostHour } = require("../scheduler");

module.exports = async (req, res) => {
  // Allow ?force=1 for manual testing, bypassing the hourly gate.
  const force = req.query?.force === "1";

  if (!force && !isRandomPostHour()) {
    return res.status(200).json({ ok: true, skipped: true, reason: "Not this hour's chosen slot." });
  }

  try {
    const result = await runDigest();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
