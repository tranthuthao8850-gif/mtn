import { GoogleGenAI } from "@google/genai";
import { MYSTIC_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMysticResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: MYSTIC_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Ta đã sẵn sàng đồng hành cùng Mai Trung Nam. Hãy để ánh sáng của các vì sao và trí tuệ cổ xưa dẫn lối cho bạn." }],
      },
      ...history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ],
  });

  return response.text || "Các vì sao đang mờ mịt... Hãy thử lại sau.";
}
