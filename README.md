# AI Tools Telegram Bot

Posts an AI-summarized digest of 3-5 random AI tool/news articles to your
Telegram channel, twice a day (9 AM and 9 PM UTC by default).

Each post: reads the full article, summarizes it into a few short bullet
points via Gemini, bolds the tool/company name, attaches a header image
pulled from the article (or a themed fallback if none is found), and adds
hashtags + a reaction prompt. No source links — just the summary.

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
   Fill in `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, and `GEMINI_API_KEY` in `.env`.
   Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

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
3. Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, and `GEMINI_API_KEY` as environment variables (check Production + Preview).
4. Deploy.

**Schedule:** `vercel.json` defines two separate daily cron entries (9 AM
and 9 PM UTC) — each one only runs once per day, which fits Vercel's
Hobby/free-tier limit (cron jobs on Hobby can't run more than once/day
*per entry*, but you can have multiple entries). Edit the two schedule
strings in `vercel.json` to change the times. Note Hobby-tier timing has
up to ±59 min of drift — exact-minute precision needs the Pro plan.

You can manually trigger a post any time by visiting
`https://your-project.vercel.app/api/post`.

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
