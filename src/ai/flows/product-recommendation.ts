// src/ai/flows/product-recommendation.ts
'use server';
/**
 * @fileOverview Product recommendation AI agent.
 *
 * - recommendProducts - A function that handles the product recommendation process.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProductsInputSchema = z.object({
  preferences: z
    .string()
    .describe('The customer product preferences, such as brand, color and fit.'),
  budget: z.string().describe('The customer budget for the product.'),
  style: z.string().describe('The customer style.'),
  weather: z.string().describe('The current weather conditions.'),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  products: z
    .array(z.string())
    .describe('An array of product names that match the customer requirements.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: RecommendProductsInputSchema},
  output: {schema: RecommendProductsOutputSchema},
  prompt: `You are an AI product recommendation agent.

You will generate a list of products based on the customer's preferences, budget, style, and the current weather.

Preferences: {{{preferences}}}
Budget: {{{budget}}}
Style: {{{style}}}
Weather: {{{weather}}}

Products:`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
