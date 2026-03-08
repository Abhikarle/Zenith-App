import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getTaskSuggestions = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 3-5 subtasks or related tasks for: "${input}". 
      Return the suggestions in a JSON array format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the suggested task." },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The priority of the suggested task." },
              categoryId: { type: Type.STRING, description: "The category ID (work, personal, shopping, health)." }
            },
            required: ["title", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return [];
  }
};

export const getSmartReminders = async (tasks: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these tasks: ${JSON.stringify(tasks)}, provide 2-3 short, motivating reminders or productivity tips. 
      Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Reminder Error:", error);
    return [];
  }
};
