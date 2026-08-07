import { env } from "../config/env";

interface VisionTags {
  category: string;
  color?: string;
  pattern?: string;
  season?: string;
  formality?: string;
}

/**
 * Extracts the first JSON object found in a string.
 * Handles cases where the LLM wraps output in markdown code fences
 * (e.g. ```json { ... } ```) or adds surrounding prose.
 */
function extractJson(raw: string): VisionTags {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error(`Vision model returned no JSON object. Raw response: ${raw.slice(0, 200)}`);
  }
  try {
    return JSON.parse(match[0]) as VisionTags;
  } catch {
    throw new Error(`Vision model returned invalid JSON: ${match[0].slice(0, 200)}`);
  }
}

export async function tagItemFromImage(photoUrl: string): Promise<VisionTags> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Look at this clothing item and return ONLY a JSON object with these keys: category (required, must be exactly one of: "Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory", "Bag", "Other"), color (free text), pattern (free text), season (must be exactly one of: "Spring", "Summer", "Autumn", "Winter", "All season"), formality (must be exactly one of: "Casual", "Smart casual", "Business casual", "Formal", "Activewear"). If you cannot confidently determine a field, omit its key entirely rather than guessing. No markdown, no explanation — raw JSON only.',
            },
            { type: "image_url", image_url: { url: photoUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vision tagging failed (${response.status}): ${body}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const rawText: string = data.choices[0].message.content;
  return extractJson(rawText);
}