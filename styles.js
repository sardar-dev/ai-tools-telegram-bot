// Rotating pool of portrait-photoshoot themes. Each pairs a short label
// with one full example prompt showing the exact target formula:
// subject description -> setting -> wardrobe/styling -> pose/expression ->
// lighting/atmosphere -> camera/lens specs -> resolution/quality tags,
// all as one dense paragraph. This is the structure behind the viral
// "AI portrait" trend on Instagram/Pinterest in 2026. The example is never
// posted itself — it's a reference so Gemini matches this level of density
// and structure, not a one-line description.
module.exports = [
  {
    label: "golden hour park portrait",
    example: "8K ultra-realistic portrait of a young man with short tousled black hair sitting on a park bench under blooming red silk-cotton blossoms. Wearing a print shacket, black loose pants, chunky sneakers, black smartwatch. Pose: leaning back, one leg stretched, left arm on bench, right hand holding sunglasses, calm confident expression, cinematic shadows and vibrant afternoon colors.",
  },
  {
    label: "private jet quiet luxury",
    example: "An ultra-realistic luxury lifestyle portrait of an elegant woman with a sleek low bun relaxing in a plush cream leather armchair inside a private jet cabin. Warm sunset light streaming through the oval window, mahogany wood trim, champagne glass on a polished side table, dressed in minimalist quiet-luxury cashmere and a fine gold wristwatch, natural relaxed expression, shot on 50mm f/1.4 lens, cinematic depth of field, authentic rich lifestyle aesthetic, 8k resolution.",
  },
  {
    label: "enchanted fantasy royal",
    example: "A breathtaking fantasy portrait of a young woman with long silver hair transformed into an ethereal elven royal standing in an ancient enchanted forest at twilight. Luminous bioluminescent flora and glowing cyan butterflies floating gently in the air, ornate filigree silver circlet resting on her hair, velvet and silk embroidered royal robes, soft radiant skin glow, magical mystical atmosphere, cinematic volumetric lighting, shot on 85mm portrait lens, shallow depth of field, 8k resolution, high-fantasy masterpiece art.",
  },
  {
    label: "90s retro cinematic film still",
    example: "A nostalgic 1990s retro-cinematic film still of a man with a slicked side part leaning against the hood of a vintage red sports car at a scenic ocean overlook at golden hour. Wearing a worn leather bomber jacket and vintage sunglasses, ocean breeze gently tousling his hair, warm golden sun flare creating soft film halation, authentic 35mm film grain, Kodak Ektachrome color grading, relaxed confident expression, cinematic 16:9 frame, 8k resolution vintage cinema aesthetic.",
  },
  {
    label: "rooftop business executive",
    example: "An ultra-realistic editorial portrait of a sharply dressed woman with a tailored bob haircut standing on a glass-railed rooftop terrace at dusk, city skyline glittering behind her. Wearing a charcoal wool blazer over a silk blouse, minimalist gold hoop earrings, one hand resting on the railing, composed and self-assured expression, cool blue-hour lighting mixed with warm window glow, shot on 35mm f/1.8 lens, shallow depth of field, 8k resolution, high-end fashion editorial aesthetic.",
  },
  {
    label: "cozy cabin winter morning",
    example: "A warm, intimate lifestyle portrait of a man with a short beard and messy curls wrapped in a chunky knit sweater, sitting by a stone fireplace in a snowbound wooden cabin. Steam rising from a mug of coffee in his hands, soft morning light through a frosted window, worn leather armchair, golden firelight flickering across his face, relaxed genuine smile, shot on 50mm f/1.8 lens, cinematic warm color grading, 8k resolution, cozy editorial photography.",
  },
  {
    label: "urban streetwear rooftop",
    example: "A high-fashion streetwear portrait of a young man with a fresh fade haircut standing on an industrial rooftop at blue hour, neon city lights blurred in the background. Wearing an oversized bomber jacket, cargo pants, and chunky sneakers, gold chain necklace, confident stance with hands in pockets, dramatic rim lighting, shot on 35mm f/1.4 lens, moody cinematic color grade, 8k resolution, editorial streetwear photography.",
  },
  {
    label: "elegant wedding editorial",
    example: "A romantic editorial portrait of a bride with soft loose waves and a delicate veil standing in a sunlit vineyard at golden hour, rows of grapevines stretching into a soft-focus background. Wearing an ivory lace gown with a plunging back, holding a bouquet of white ranunculus, gentle wind catching the veil, serene joyful expression, warm backlit glow, shot on 85mm f/1.2 lens, dreamy shallow depth of field, 8k resolution, fine-art wedding photography.",
  },
];
