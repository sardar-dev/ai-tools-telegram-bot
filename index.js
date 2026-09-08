require("dotenv").config();
const { runPost } = require("./runPost");

runPost()
  .then((result) => {
    console.log(result);
    console.log("✅ Posted successfully.");
  })
  .catch((err) => {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  });
