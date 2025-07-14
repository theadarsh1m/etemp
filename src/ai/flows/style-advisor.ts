'use server';
/**
 * @fileOverview A style advisor AI agent.
 *
 * - getStyleAdvice - A function that handles the style advice process based on a user's photo.
 * - StyleAdvisorInput - The input type for the getStyleAdvice function.
 * - StyleAdvisorOutput - The return type for the getStyleAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleAdvisorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type StyleAdvisorInput = z.infer<typeof StyleAdvisorInputSchema>;

const StyleAdvisorOutputSchema = z.object({
  facialAnalysis: z.object({
    gender: z.string().describe("The detected gender of the person."),
    age: z.string().describe("The estimated age range of the person."),
    faceShape: z.string().describe("The detected face shape of the person."),
    mood: z.string().describe("The dominant mood or emotion detected."),
  }),
  styleAdvice: z
    .string()
    .describe(
      "A paragraph of personalized fashion advice based on the analysis. Suggest styles, colors, and types of clothing or accessories that would complement the user's features."
    ),
  recommendedProductTags: z
    .array(z.string())
    .describe(
      "An array of product tags to use for filtering products from the catalog."
    ),
});
export type StyleAdvisorOutput = z.infer<typeof StyleAdvisorOutputSchema>;

export async function getStyleAdvice(input: StyleAdvisorInput): Promise<StyleAdvisorOutput> {
  return styleAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleAdvisorPrompt',
  input: {schema: StyleAdvisorInputSchema},
  output: {schema: StyleAdvisorOutputSchema},
  prompt: `You are an expert fashion stylist. You will be given a photo of a person.
Your task is to analyze the person's facial features and provide personalized fashion advice and product recommendations.

1.  **Analyze Facial Features**: From the image, determine the following:
    *   Gender (e.g., Male, Female, or Non-binary)
    *   Estimated Age (e.g., 20-25)
    *   Face Shape (e.g., Oval, Round, Square, Heart)
    *   Dominant Mood/Emotion (e.g., Happy, Neutral, Thoughtful)

2.  **Generate Style Advice**: Based on your analysis, provide a concise paragraph of fashion advice. Suggest styles, colors, and types of clothing or accessories that would complement the user's features.

3.  **Recommend Product Tags**: Based on your advice, provide an array of 3-5 general product tags that can be used to search for relevant items. Choose from this list: "men", "women", "unisex", "outerwear", "pants", "shoes", "casual", "accessories", "tops", "basics", "gaming", "fitness", "summer", "winter", "leather", "denim", "sports".

Please return the output in the specified JSON format.

Photo: {{media url=photoDataUri}}
`,
});

const styleAdvisorFlow = ai.defineFlow(
  {
    name: 'styleAdvisorFlow',
    inputSchema: StyleAdvisorInputSchema,
    outputSchema: StyleAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
