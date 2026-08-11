// Vercel Cron itself can't pick a "random" time — it needs a fixed schedule.
// Workaround: the cron fires every hour, and this function decides whether
// THIS hour is the one to actually post, based on a deterministic pseudo-random
// pick that's stable for a given day+window (so it doesn't post twice or skip
// the window entirely), but changes day to day so it's not always the same time.

function seededRandom(seedStr) {
  // Simple string hash -> [0, 1) float. Deterministic, no dependencies.
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 10000) / 10000;
}

// Returns true if the current UTC hour is the chosen post-hour for this
// 12-hour window (00:00-11:59 or 12:00-23:59 UTC).
function isRandomPostHour(now = new Date()) {
  const hour = now.getUTCHours();
  const dateStr = now.toISOString().slice(0, 10); // e.g. "2026-08-11"
  const windowStart = hour < 12 ? 0 : 12;

  const seed = `${dateStr}-${windowStart}`;
  const targetHour = windowStart + Math.floor(seededRandom(seed) * 12);

  return hour === targetHour;
}

module.exports = { isRandomPostHour };
