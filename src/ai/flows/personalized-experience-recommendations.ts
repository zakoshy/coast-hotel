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
      'A list of personalized experience and activity recommendations based on the guests preferences.'
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
  prompt: `You are a personalized travel concierge for a luxury hotel on the Kenyan coast. Based on the guest's preferences, provide a list of recommendations for experiences and activities.

Guest Preferences:
- Travel Style: {{{travelStyle}}}
- Interests: {{{interests}}}
- Budget: {{{budget}}}

Recommendations:`,
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
