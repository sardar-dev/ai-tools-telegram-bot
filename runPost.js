const { generateImagePrompt } = require("./promptGenerator");
const { generateImage } = require("./imageGenerator");
const { formatCaption } = require("./formatCaption");
const { postImage } = require("./postToTelegram");

// Full pipeline: Gemini picks a trending style and writes a creative prompt
// -> Pollinations generates the actual image from that exact prompt ->
// both the image and the prompt text are posted together as one post.
async function runPost() {
  const { style, prompt } = await generateImagePrompt();
  const { buffer, mimeType, source } = await generateImage(prompt);
  const caption = formatCaption({ style, prompt });

  await postImage({ buffer, mimeType, caption });

  return { posted: true, style, prompt, imageSource: source };
}

module.exports = { runPost };
