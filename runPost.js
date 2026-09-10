const { generateImagePrompt } = require("./promptGenerator");
const { generateImage } = require("./imageGenerator");
const { formatCaption } = require("./formatCaption");
const { postImage } = require("./postToTelegram");

// Full pipeline: pick a trending style -> generate a creative prompt for it
// -> generate an image from that prompt -> post the image + prompt together.
async function runPost() {
  const { style, prompt } = await generateImagePrompt();
  const { buffer, mimeType, source } = await generateImage(prompt);
  const caption = formatCaption({ style, prompt });

  await postImage({ buffer, mimeType, caption });

  return { posted: true, style, prompt, imageSource: source };
}

module.exports = { runPost };
