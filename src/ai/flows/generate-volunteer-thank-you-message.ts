'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized thank-you messages
 * for volunteers based on their attendance and participation details for the 'Dalaw Nazareno 2026' event.
 *
 * - generateVolunteerThankYouMessage - A function that handles the generation process.
 * - GenerateVolunteerThankYouMessageInput - The input type for the function.
 * - GenerateVolunteerThankYouMessageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVolunteerThankYouMessageInputSchema = z.object({
  volunteerName: z.string().describe('The full name of the volunteer.'),
  volunteerEmail: z.string().email().optional().describe('The email address of the volunteer (optional).'),
  attendanceRecords: z.array(
    z.object({
      date: z.string().describe('Date of attendance (e.g., "2026-03-10")'),
      checkIn: z.string().describe('Check-in time (e.g., "08:00 AM")'),
      checkOut: z.string().describe('Check-out time (e.g., "05:00 PM")'),
    })
  ).describe('A list of attendance records for the volunteer.').optional(),
  participationDetails: z.string().describe('Specific details about the volunteer\'s participation, roles, or notable contributions.').optional(),
});
export type GenerateVolunteerThankYouMessageInput = z.infer<typeof GenerateVolunteerThankYouMessageInputSchema>;

const GenerateVolunteerThankYouMessageOutputSchema = z.object({
  message: z.string().describe('The personalized thank-you message for the volunteer.'),
  suggestedSubject: z.string().describe('A suggested subject line for an email containing the thank-you message.'),
});
export type GenerateVolunteerThankYouMessageOutput = z.infer<typeof GenerateVolunteerThankYouMessageOutputSchema>;

export async function generateVolunteerThankYouMessage(input: GenerateVolunteerThankYouMessageInput): Promise<GenerateVolunteerThankYouMessageOutput> {
  return generateVolunteerThankYouMessageFlow(input);
}

const generateVolunteerThankYouMessagePrompt = ai.definePrompt({
  name: 'generateVolunteerThankYouMessagePrompt',
  input: {schema: GenerateVolunteerThankYouMessageInputSchema},
  output: {schema: GenerateVolunteerThankYouMessageOutputSchema},
  prompt: `You are an event organizer for "Dalaw Nazareno 2026". Your task is to write a personalized and warm thank-you message to a volunteer, acknowledging their contributions and encouraging their continued involvement.

Volunteer's Name: {{{volunteerName}}}
{{#if volunteerEmail}}Volunteer's Email: {{{volunteerEmail}}}{{/if}}

Attendance Records:
{{#if attendanceRecords}}
{{#each attendanceRecords}}
- Date: {{{date}}}, Checked In: {{{checkIn}}}, Checked Out: {{{checkOut}}}
{{/each}}
{{else}}
No specific attendance records provided.
{{/if}}

{{#if participationDetails}}Participation Details: {{{participationDetails}}}{{/if}}

Based on the information above, draft a thank-you message. Make sure to specifically mention their name and personalize it by referencing their attendance and participation details. Also, provide a concise and engaging subject line suitable for an email.

Please format your response as a JSON object with two fields: 
- message: The personalized thank-you message for the volunteer.
- suggestedSubject: A suggested subject line for an email containing the thank-you message.`,
});

const generateVolunteerThankYouMessageFlow = ai.defineFlow(
  {
    name: 'generateVolunteerThankYouMessageFlow',
    inputSchema: GenerateVolunteerThankYouMessageInputSchema,
    outputSchema: GenerateVolunteerThankYouMessageOutputSchema,
  },
  async (input) => {
    const {output} = await generateVolunteerThankYouMessagePrompt(input);
    return output!;
  }
);
