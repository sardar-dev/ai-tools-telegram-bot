// Vercel serverless function, triggered by two daily crons (see vercel.json).
// Hobby plan only allows cron jobs that run once/day each, so instead of one
// hourly cron with random gating, we use two separate once-daily crons —
// that's within the free-tier limit and still gives 2 posts/day.
const { runDigest } = require("../runDigest");

module.exports = async (req, res) => {
  try {
    const result = await runDigest();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
