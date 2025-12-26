
import { GoogleGenAI } from "@google/genai";

// Technical advisor service using Gemini API
export const getTechnicalAdvice = async (issue: string) => {
  try {
    // Initialize GoogleGenAI with the API key from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert technical advisor for Mepdream Operation Solutions.
      Context: The user is describing a technical or electrical problem. 
      Your goal: Provide immediate safety advice (Safety first!) and suggest which of our services they might need.
      Keep it professional, concise, and helpful. Do not give detailed DIY repair instructions if the task is dangerous.
      User Issue: ${issue}`,
      config: {
        systemInstruction: "You are the Mepdream AI Assistant. Be helpful, prioritize safety, and promote Mepdream services."
      }
    });

    // Extracting text output directly from the response property
    return response.text || "I'm having trouble analyzing that. Please call our emergency response team.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while getting advice. Please call our 24/7 support directly.";
  }
};
