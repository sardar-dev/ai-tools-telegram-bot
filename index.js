require("dotenv").config();
const { runDigest } = require("./runDigest");

runDigest()
  .then((result) => {
    console.log(result);
    if (result.posted) console.log("✅ Posted successfully.");
    else console.log("ℹ️  Skipped:", result.reason);
  })
  .catch((err) => {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  });
