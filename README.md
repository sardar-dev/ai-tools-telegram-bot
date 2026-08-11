# AI Tools Telegram Bot

Posts a daily digest of the latest AI tools/news to your Telegram channel.

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
   Fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` in `.env`.

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
2. Import it into [Vercel](https://vercel.com).
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` as environment variables in the Vercel project settings.
4. `vercel.json` already schedules `/api/post` to run daily at 09:00 UTC — edit the cron string to change the time.
5. Deploy. Vercel Cron will trigger the post automatically every day.

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
