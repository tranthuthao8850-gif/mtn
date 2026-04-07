import { GoogleGenAI } from "@google/genai";
import { MYSTIC_PROMPT, USER_PROFILE } from "../constants";

// Khởi tạo AI với API Key từ môi trường
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMysticResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  try {
    // Đảm bảo chúng ta luôn gửi kèm ngữ cảnh cá nhân trong mỗi lần gọi
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `${MYSTIC_PROMPT}\n\nThông tin chi tiết của chủ nhân: ${JSON.stringify(USER_PROFILE)}` }],
        },
        {
          role: "model",
          parts: [{ text: "Ta đã thấu hiểu bản mệnh của Mai Trung Nam. Ta sẽ dùng trí tuệ của các vì sao và huyền học để trả lời mọi câu hỏi của bạn." }],
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
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    if (!response.text) {
      throw new Error("AI returned empty response");
    }

    return response.text;
  } catch (error) {
    console.error("Detailed AI Error:", error);
    // Trả về thông báo lỗi chi tiết hơn để người dùng biết
    if (!process.env.GEMINI_API_KEY) {
      return "Lỗi: Chưa cấu hình API Key cho AI. Nam hãy kiểm tra lại phần Secrets.";
    }
    return "Các vì sao đang bị che khuất bởi mây mù... Hãy thử hỏi lại một cách cụ thể hơn nhé, Nam.";
  }
}
