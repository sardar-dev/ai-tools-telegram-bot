# AI Tools Telegram Bot

Posts an AI-summarized digest of 3-5 random AI tool/news articles to your
Telegram channel, twice a day at a randomized time within each 12-hour
window (so it's not always the exact same time).

Each post: reads the full article, summarizes it into a few short bullet
points via Claude, bolds the tool/company name, attaches a header image
pulled from the article, and adds hashtags + a reaction prompt. No source
links — just the summary.

## Setup

1. **Create the bot**
   - Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot` → copy the token.
   - Add the bot as an **admin** to your channel (needed to post).

2. **Get your channel ID**
   - If your channel is public: use `@yourchannelusername`.
   - If private: forward a message from it to [@userinfobot](https://t.me/userinfobot) to get the numeric ID (looks like `-1001234567890`).

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, and `ANTHROPIC_API_KEY` in `.env`.
   Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

## Run manually (local / Termux)

```bash
node index.js
```

## Run on a schedule

### Option A — Termux/laptop cron (needs device on at that time)
Add a cron job (via `crontab -e` or Termux's `cronie`):
```
0 9 * * * cd /path/to/ai-tools-bot && node index.js >> log.txt 2>&1
```

### Option B — Vercel (recommended, no device needed)
1. Push this folder to a GitHub repo.
2. Import it into [Vercel](https://vercel.com), Framework Preset: **Other**.
3. Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, and `ANTHROPIC_API_KEY` as environment variables (check Production + Preview).
4. Deploy.

**How the twice-daily random timing works:** Vercel Cron can only fire on a
fixed schedule, not a random one, so `vercel.json` schedules `/api/post` to
run **every hour** (`0 * * * *`). Inside `scheduler.js`, the function checks
whether the *current* hour is the one randomly chosen for that 12-hour
window (00:00-11:59 or 12:00-23:59 UTC) — so it silently skips 22 out of 24
hourly triggers and actually posts on the other 2, at a time that shifts
day to day.

> Note: hourly cron invocations may require a Vercel **Pro** plan depending
> on your account's cron limits — check your dashboard's Cron Jobs section.
> If you're capped on the free tier, drop to a fixed 2x/day schedule instead,
> e.g. `"0 9,21 * * *"`, and delete the `isRandomPostHour` check in `api/post.js`.

You can manually trigger a post (bypassing the hourly gate) by visiting
`https://your-project.vercel.app/api/post?force=1`.

## Customizing content sources

Edit `sources.js` to add/remove RSS feeds. Each source just needs a `name` and `url`.

## Files

| File | Purpose |
|---|---|
| `sources.js` | List of RSS feeds to pull from |
| `fetchContent.js` | Fetches latest item from each source |
| `formatPost.js` | Formats items into a Telegram HTML message |
| `postToTelegram.js` | Sends the message via Telegram Bot API |
| `index.js` | Local/manual entry point |
| `api/post.js` | Vercel serverless entry point (used by cron) |
