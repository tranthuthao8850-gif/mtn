import { GoogleGenAI } from "@google/genai";
import { MYSTIC_PROMPT, USER_PROFILE } from "../constants";

// Khởi tạo AI - Lưu ý: process.env.GEMINI_API_KEY sẽ được Vite thay thế bằng giá trị thực tế
// Chúng ta sẽ kiểm tra khóa ngay trong hàm gọi để tránh lỗi khởi tạo sớm
export async function getMysticResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
    return "Lỗi: Hệ thống chưa nhận được API Key hợp lệ từ phần Secrets. Nam hãy thử làm mới (Refresh) trang web hoặc đợi vài giây để máy chủ cập nhật nhé.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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

    return response.text || "Các vì sao đang mờ mịt... Hãy thử lại sau.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Có một chút nhiễu loạn từ vũ trụ (Lỗi kết nối AI). Nam hãy thử lại sau giây lát nhé.";
  }
}
