// Rotating pool of AI image styles, each paired with one hand-written
// example prompt. The example exists purely to show Gemini the level of
// specificity and concreteness expected — it's never posted itself, only
// used as a reference when generating a new, different prompt.
// Curated from what's actually driving views/shares on TikTok, Instagram,
// and Pinterest as of 2026. Update over time as trends shift.
module.exports = [
  {
    label: "toy-ification: collectible 3D action figure in blister packaging",
    example: "A collectible vinyl astronaut figure in blister packaging on a store shelf, chunky rounded proportions, matte orange spacesuit with chipped paint details, tiny embossed logo on the card backing, soft studio lighting with a warm rim light on the helmet visor.",
  },
  {
    label: "Y2K chrome aesthetic: metallic holographic early-2000s style",
    example: "A chrome liquid-metal dolphin sculpture frozen mid-leap above a holographic dance floor, magenta and cyan light refracting off every curve, tiny bubbles of pixelated static drifting around it, glossy plastic confetti scattered below.",
  },
  {
    label: "anti-AI nostalgic aesthetic: grainy disposable camera film look, imperfect and candid",
    example: "A crumpled gas station receipt taped inside a car window at dusk, dashboard lights slightly blown out, heavy film grain, a faint red light leak creeping in from the top corner, motion blur on a hand reaching for the radio dial.",
  },
  {
    label: "surreal miniature diorama world, tilt-shift, impossibly detailed",
    example: "A tiny fishing village built inside a cracked teacup, miniature boats bobbing in tea that's still steaming, a matchstick lighthouse on the rim casting a warm glow, tilt-shift blur softening the saucer below.",
  },
  {
    label: "photorealistic double exposure portrait",
    example: "A double exposure portrait where a woman's silhouette is filled with a dense pine forest at first snowfall, bare branches tracing the line of her jaw, muted blue-grey tones, a single deer visible faintly where her eye would be.",
  },
  {
    label: "digital scrapbook collage: cut-out photos, DIY mixed media, handwritten notes",
    example: "A scrapbook page with a torn Polaroid of a carousel horse taped at an angle, dried pressed flowers pinned beside it, a handwritten ticket stub reading 'summer fair,' pastel washi tape edges, faint pencil doodles of stars in the margin.",
  },
  {
    label: "satisfying macro texture close-up: glass, jelly, wax, or liquid surfaces",
    example: "An extreme macro shot of honey being poured over a stack of translucent amber wax discs, thick slow-motion ribbons catching window light, tiny air bubbles trapped mid-fall, a single drop suspended just above the surface.",
  },
  {
    label: "historical POV cinematic scene, as if witnessed firsthand",
    example: "First-person view from inside a wooden lifeboat being lowered past rows of glowing brass portholes on a grand ocean liner at night, rope creaking, distant orchestra music drifting from a lit ballroom window above.",
  },
  {
    label: "hyperrealistic impossible scene blending the mundane with the surreal",
    example: "A kitchen sink slowly filling not with water but with a swirling galaxy of stars and nebula clouds, steam rising as tiny comets streak past a dish sponge resting on the counter, warm morning light through the window.",
  },
  {
    label: "Studio Ghibli-inspired anime landscape",
    example: "A moss-covered train station platform swallowed by an overgrown forest, a single lantern still glowing on a rusted post, soft dappled sunlight through the canopy, a small spirit-like creature peeking from behind a vine-covered bench.",
  },
  {
    label: "cinematic neon cyberpunk streetscape, rain-soaked",
    example: "A narrow alley market at 2am, steam rising from a noodle stall lit by a flickering magenta sign, rain streaking through the glow of stacked holographic billboards reflected in ankle-deep puddles, a lone figure under a clear umbrella.",
  },
  {
    label: "retro-futuristic vintage sci-fi poster art",
    example: "A 1950s-style travel poster for a colony on Titan, bold sunset-orange sky with twin rings overhead, a chrome rocket on a launch pad in the foreground, retro serif lettering worn at the edges like an old print.",
  },
  {
    label: "claymation stop-motion style",
    example: "A tiny claymation fox chef kneading dough on a walnut-shell table, visible fingerprint textures in the clay fur, a felt apron with a hand-stitched pocket, warm tungsten lighting like a handmade animated short.",
  },
  {
    label: "isometric pixel art diorama",
    example: "An isometric pixel-art treehouse village connected by rope bridges strung between three giant oaks, warm pixel lantern light glowing from tiny windows, a squirrel NPC mid-hop between platforms, soft dithered sunset gradient sky.",
  },
  {
    label: "dark fantasy concept art",
    example: "A cathedral built from fossilized dragon bone, ribs arching into a vaulted ceiling dripping with bioluminescent moss, a single robed figure dwarfed at the altar, cold blue light filtering through translucent bone windows.",
  },
];
