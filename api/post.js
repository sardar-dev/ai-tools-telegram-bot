// Vercel serverless function, triggered by two daily crons (see vercel.json).
const { runPost } = require("../runPost");

module.exports = async (req, res) => {
  try {
    const result = await runPost();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
