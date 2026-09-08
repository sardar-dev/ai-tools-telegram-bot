# The AI Updates — Telegram Image Bot

Posts one AI-generated image to your Telegram channel, twice a day (9 AM
and 9 PM UTC by default), each time in a randomly picked trending style
(cyberpunk, anime, photorealism, watercolor, etc — see `styles.js`).

**How each post is made:**
1. A random style is picked from `styles.js`.
2. Gemini writes a creative, detailed image prompt in that style.
3. Gemini's image model generates the actual image from that prompt.
4. The image is posted with the prompt text as the caption.

## Setup

1. **Create the bot** — message [@BotFather](https://t.me/BotFather) → `/newbot` → copy the token. Add the bot as **admin** to your channel.
2. **Get your channel ID** — public: `@yourchannelusername`. Private: forward a channel message to [@userinfobot](https://t.me/userinfobot).
3. **Get a Gemini API key** — free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Used for both prompt writing and image generation.
4. **Install dependencies:**
   ```bash
   npm install
   ```
5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `GEMINI_API_KEY`.

## Run manually (local / Termux)

```bash
node index.js
```

## Run on a schedule (Vercel, recommended)

1. Push this folder to a GitHub repo.
2. Import it into [Vercel](https://vercel.com), Framework Preset: **Other**.
3. Add the three env vars above (check Production + Preview).
4. Deploy.

`vercel.json` defines two separate daily cron entries (9 AM and 9 PM UTC)
— each fires once/day, which fits Vercel's Hobby/free-tier cron limit.
Edit the schedule strings there to change the times.

You can manually trigger a post any time by visiting
`https://your-project.vercel.app/api/post`.

## Customizing styles

Edit `styles.js` — it's just a list of style descriptors, one is picked at
random per post. Add, remove, or reweight as trends shift.

## Files

| File | Purpose |
|---|---|
| `styles.js` | Pool of trending style descriptors |
| `promptGenerator.js` | Gemini writes a creative image prompt in a random style |
| `imageGenerator.js` | Gemini generates the actual image from that prompt |
| `formatCaption.js` | Builds the Telegram caption (style + prompt + hashtags) |
| `postToTelegram.js` | Uploads the image + caption to the channel |
| `runPost.js` | Orchestrates the full pipeline |
| `index.js` | Local/manual entry point |
| `api/post.js` | Vercel serverless entry point (used by cron) |
