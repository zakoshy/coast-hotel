
// src/ai/flows/personalized-experience-recommendations.ts
'use server';
/**
 * @fileOverview Personalized experience and activity recommendations for hotel guests.
 *
 * This file defines a Genkit flow that takes guest preferences as input and returns
 * personalized recommendations for experiences and activities.
 *
 * - personalizedExperienceRecommendations - A function to generate personalized recommendations.
 * - PersonalizedExperienceInput - The input type for the function.
 * - PersonalizedExperienceOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedExperienceInputSchema = z.object({
  travelStyle: z
    .string()
    .describe(
      'The guests preferred travel style, e.g., adventure, relaxation, cultural, family, etc.'
    ),
  interests: z
    .string()
    .describe(
      'The guests interests, e.g., water sports, hiking, historical sites, local cuisine, etc.'
    ),
  budget: z
    .string()
    .describe(
      'The guests budget, e.g., luxury, mid-range, budget-friendly, etc.'
    ),
});
export type PersonalizedExperienceInput = z.infer<
  typeof PersonalizedExperienceInputSchema
>;

const PersonalizedExperienceOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe(
      'A list of 3-4 highly specific and appealing personalized experience and activity recommendations based on the guests preferences.'
    ),
});
export type PersonalizedExperienceOutput = z.infer<
  typeof PersonalizedExperienceOutputSchema
>;

export async function personalizedExperienceRecommendations(
  input: PersonalizedExperienceInput
): Promise<PersonalizedExperienceOutput> {
  return personalizedExperienceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedExperiencePrompt',
  input: {schema: PersonalizedExperienceInputSchema},
  output: {schema: PersonalizedExperienceOutputSchema},
  prompt: `You are a high-end travel concierge for Coastal Sands Retreat, a luxury hotel on Diani Beach, Kenya. 
Based on the guest's unique preferences, curate a list of 3 to 4 specific experiences or activities.

Make the recommendations sound exclusive, luxurious, and deeply connected to the Kenyan coast. 
Use evocative language that mentions the turquoise waters, white sands, and Swahili heritage.

Guest Preferences:
- Travel Style: {{{travelStyle}}}
- Interests: {{{interests}}}
- Budget: {{{budget}}}

Return a list of short, catchy titles with a brief compelling description for each recommendation.`,
});

const personalizedExperienceRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedExperienceRecommendationsFlow',
    inputSchema: PersonalizedExperienceInputSchema,
    outputSchema: PersonalizedExperienceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
