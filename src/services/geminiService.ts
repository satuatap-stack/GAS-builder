import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhancePrompt(userRequest: any) {
  const systemInstruction = `You are a prompt engineering expert specializing in Google Apps Script (GAS) and Google Sheets. 
Your goal is to take a raw description of a web app and turn it into a master-level prompt for DeepSeek.

The final prompt must instruct DeepSeek to:
1. Provide a Code.gs file with doGet, doPost, and server-side logic (spreadsheet CRUD).
2. Provide an index.html file with a modern responsive UI.
3. Use google.script.run for client-server communication.
4. Define the spreadsheet structure (Sheet names and column headers).
5. Handle error states and loading feedback.

Structure the output as a clean, copy-pasteable prompt block.`;

  const prompt = `Convert this app requirement into a high-fidelity DeepSeek prompt:
  - Project Title: ${userRequest.title}
  - Features: ${userRequest.features}
  - Sheet Structure: ${userRequest.sheets}
  - UI Style: ${userRequest.uiStyle}
  - Additional Context: ${userRequest.context}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to enhance prompt. Please try again.";
  }
}
