require("dotenv").config();

const { fetchLatestItems } = require("./fetchContent");
const { formatDailyDigest } = require("./formatPost");
const { postToChannel } = require("./postToTelegram");

async function run() {
  console.log("Fetching latest AI tool/news items...");
  const items = await fetchLatestItems();

  if (!items.length) {
    console.log("No items fetched — skipping post.");
    return;
  }

  const message = formatDailyDigest(items);
  console.log("Posting to Telegram...\n");
  console.log(message);

  await postToChannel(message);
  console.log("\n✅ Posted successfully.");
}

run().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
