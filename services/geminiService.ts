
import { GoogleGenAI, Type } from "@google/genai";
import type { Meeting, Contact, Briefing } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this example, we'll throw an error if the key is not set.
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, one-paragraph summary of the meeting's primary goal and context."
        },
        attendeeBriefings: {
            type: Type.ARRAY,
            description: "A list of briefings for each attendee.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The attendee's full name." },
                    brief: { type: Type.STRING, description: "A concise briefing on the attendee's likely role, perspective, and key contributions relevant to this meeting's agenda. Focus on their job title and company." }
                },
                required: ["name", "brief"]
            }
        },
        talkingPoints: {
            type: Type.ARRAY,
            description: "A list of 3-5 key talking points or insightful questions to facilitate a productive discussion, based on the agenda and attendee roles.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["summary", "attendeeBriefings", "talkingPoints"]
};

export const generateMeetingBriefing = async (meeting: Meeting, contacts: Contact[]): Promise<Briefing> => {
  const attendeesInfo = contacts.map(c => `- ${c.name}, ${c.title} at ${c.company}`).join('\n');

  const prompt = `
    Generate a pre-meeting briefing for a professional setting.

    Meeting Title: ${meeting.title}

    Meeting Agenda: ${meeting.agenda}

    Attendees:
    ${attendeesInfo}

    Based on the information provided, generate a structured briefing.
    The tone should be professional, concise, and action-oriented.
    Focus only on the information given (attendee names, titles, companies, and the meeting agenda). Do not invent outside information.
    Provide a JSON object that adheres to the specified schema.
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.5,
        },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Basic validation to ensure the parsed object matches the Briefing type
    if (parsedJson.summary && parsedJson.attendeeBriefings && parsedJson.talkingPoints) {
        return parsedJson as Briefing;
    } else {
        throw new Error("AI response did not match the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate meeting briefing from the AI service.");
  }
};
