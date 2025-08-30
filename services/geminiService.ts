import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a single hero shot image by calling the Gemini API.
 */
async function generateSingleHeroShot(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        {
          text: `RETOUCHING INSTRUCTIONS
                1) Composition & Crop
                  - Center food as hero with comfortable negative space; keep full rim of plate when possible.
                  - The plate of food should take up most of the image
                  - Straighten horizon, gentle perspective correction only. Do not materially change camera angle or portion size.

                2) Background & Surface
                  - Replace clutter with a seamless, softly-lit background using the user-specified choice.
                  - If the user has no additional requests, use a standard dark or light background to provide contrast with the plate and food.
                  - Add a subtle, realistic ground shadow and a faint plate reflection; keep shadows soft and directionally consistent.

                3) Clean & Tidy
                  - Remove crumbs, smears, stains, stray herbs, fingerprints, and messy drips on plate/rim.
                  - Remove logos/packaging/brand marks; remove busy utensils unless specified in “Props”.

                4) Color & Light
                  - White-balance to neutral (no color cast); natural skin-tone equivalents for meats.
                  - Gentle studio look: soft key + mild fill; lift shadows slightly, protect highlights (no clipping).
                  - Enhance vibrancy responsibly; prioritize true-to-dish colors over saturation.

                5) Texture & Detail
                  - Subtle local contrast to emphasize appetizing textures (crisp edges, glossy sauces, fresh greens).
                  - Avoid crunchy sharpening halos or over-clarity; preserve realistic moisture and steam.
                  - Optional: add very subtle steam only if dish is hot and it looks photographic (never cartoony).

                6) Food Truth & Integrity (Strict)
                  - Do not invent or remove core ingredients unless specifically requested.
                  - Keep portion size, shape, and arrangement believable. No AI “beauty filters” that distort food identity.

                7) Styling Touches (If Allowed)
                  - Micro-replate for neatness (tuck stray bits, wipe rims).
                  - Add specified garnish only; place tastefully, not covering the hero elements.

                8) Output
                  - Generate one creative variation based on these instructions.
                  - Aspect ratio: 16:9.
                  - Export sRGB, high-quality JPEG/WEBP; clean edges; no borders; no text or watermarks.

                9) Additional User Requests:
                  ${prompt}

                NEGATIVE INSTRUCTIONS (avoid)
                - No oversaturation, neon colors, or HDR look.
                - No plastic shine, waxy textures, or unreal bokeh patterns.
                - No harsh vignette, heavy gradients, or fake lens flares.
                - No added text, stickers, or graphic overlays.
                - No drastic perspective changes or AI hallucinated ingredients.

                QUALITY CHECKLIST (final pass)
                - Plate rim clean? Background seamless? Shadows natural?
                - Colors look edible and true? Whites are neutral?
                - Portion and ingredients match the original + allowed edits?
                - Cropping leaves room for UI overlays (price/badge) if needed?
                - Does food look appetizing?
                - Dish takes up most of the image? `,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Find the first part in the response that contains image data.
  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    part => !!part.inlineData?.data
  );
  const imageBase64 = imagePart?.inlineData?.data;

  if (imageBase64) {
    return imageBase64;
  } else {
    // If no image, check for a text response to provide a better error.
    const textResponse = response.candidates
      ?.flatMap(c => c.content?.parts ?? [])
      .filter(p => !!p.text)
      .map(p => p.text)
      .join(' ');
    
    if (textResponse) {
      throw new Error(`API returned text instead of an image: ${textResponse}`);
    }
    throw new Error('No image was generated. The request may have been filtered or the response was empty.');
  }
}

/**
 * Generates three hero shots by calling the single generation helper function three times sequentially.
 */
export async function generateHeroShot(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string[]> {
  try {
    const images: string[] = [];
    // Loop three times to generate three distinct images.
    for (let i = 0; i < 3; i++) {
      // Pass a slightly different prompt for each iteration to encourage variation.
      const iterationPrompt = `${prompt} (Creative variation ${i + 1} of 3)`;
      const result = await generateSingleHeroShot(base64ImageData, mimeType, iterationPrompt);
      images.push(result);
    }
    return images;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate images: ${error.message}`);
    }
    throw new Error("Failed to generate images. Please check the prompt and try again.");
  }
}
