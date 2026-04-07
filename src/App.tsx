/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Compass, 
  MessageSquare, 
  Send, 
  Info, 
  RefreshCw,
  Star,
  ScrollText,
  Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { USER_PROFILE } from "./constants";
import { getMysticResponse } from "./services/geminiService";
import { cn } from "./lib/utils";

// Star background component
const StarBackground = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="star-field">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--duration": star.duration,
          } as any}
        />
      ))}
    </div>
  );
};

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "oracle">("chat");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.parts }));
      const response = await getMysticResponse(input, history);
      const modelMessage: Message = { role: "model", parts: [{ text: response }] };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Các vì sao đang mờ mịt... Hãy thử lại sau giây lát, Nam nhé." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <StarBackground />
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-mystic-gold/20 flex items-center justify-center border border-mystic-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Sparkles className="text-mystic-gold w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-widest text-mystic-gold">MAI TRUNG NAM</h1>
            <p className="text-xs text-slate-400 uppercase tracking-tighter">AI Mystic Guide</p>
          </div>
        </motion.div>

        <nav className="flex gap-4">
          <button 
            onClick={() => setActiveTab("profile")}
            className={cn(
              "p-2 rounded-lg transition-all",
              activeTab === "profile" ? "bg-mystic-gold/20 text-mystic-gold" : "text-slate-400 hover:text-white"
            )}
          >
            <Compass className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab("chat")}
            className={cn(
              "p-2 rounded-lg transition-all",
              activeTab === "chat" ? "bg-mystic-gold/20 text-mystic-gold" : "text-slate-400 hover:text-white"
            )}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab("oracle")}
            className={cn(
              "p-2 rounded-lg transition-all",
              activeTab === "oracle" ? "bg-mystic-gold/20 text-mystic-gold" : "text-slate-400 hover:text-white"
            )}
          >
            <ScrollText className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 z-10 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="mystic-glass p-6 rounded-2xl">
                <h2 className="font-display text-mystic-gold text-lg mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5" /> Chiêm Tinh Phương Tây
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Cung Hoàng Đạo</p>
                    <p className="text-lg font-serif italic">{USER_PROFILE.systems.western.sunSign}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Nguyên Tố</p>
                    <p className="text-slate-200">{USER_PROFILE.systems.western.element}</p>
                  </div>
                  <p className="text-sm text-slate-300 italic">"{USER_PROFILE.systems.western.traits}"</p>
                </div>
              </div>

              <div className="mystic-glass p-6 rounded-2xl">
                <h2 className="font-display text-mystic-gold text-lg mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5" /> Huyền Học Phương Đông
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Tuổi & Mệnh</p>
                    <p className="text-lg font-serif italic">{USER_PROFILE.systems.eastern.zodiac} - {USER_PROFILE.systems.eastern.element}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Tứ Trụ (Bát Tự)</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{USER_PROFILE.systems.eastern.bazi}</p>
                  </div>
                </div>
              </div>

              <div className="mystic-glass p-6 rounded-2xl md:col-span-2">
                <h2 className="font-display text-mystic-gold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" /> Thần Số Học
                </h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-2 border-mystic-gold flex items-center justify-center text-3xl font-display text-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    {USER_PROFILE.systems.numerology.lifePath}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Số Chủ Đạo</p>
                    <p className="text-slate-200 font-serif text-lg">{USER_PROFILE.systems.numerology.meaning}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar"
              >
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 rounded-full border border-mystic-gold/30 flex items-center justify-center"
                    >
                      <Compass className="w-12 h-12 text-mystic-gold/50" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-mystic-gold text-xl mb-2">Xin chào, Mai Trung Nam</h3>
                      <p className="text-slate-400 max-w-sm">
                        Ta là người dẫn lối tâm linh của bạn. Hãy chia sẻ những gì đang đè nặng tâm trí, hoặc hỏi về vận mệnh của mình.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        "Hôm nay của tôi thế nào?",
                        "Sự nghiệp sắp tới ra sao?",
                        "Tôi nên làm gì lúc này?",
                        "Gieo cho tôi một quẻ Kinh Dịch"
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => quickAction(q)}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-mystic-gold/10 hover:border-mystic-gold/30 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl shadow-lg",
                      msg.role === "user" 
                        ? "bg-mystic-blue/40 border border-mystic-blue/50 text-slate-100 rounded-tr-none" 
                        : "mystic-glass text-slate-200 rounded-tl-none"
                    )}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="mystic-glass p-4 rounded-2xl rounded-tl-none flex gap-2">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-mystic-gold rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-mystic-gold rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-mystic-gold rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Hỏi về vận mệnh, tâm sự cùng AI..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all text-slate-200 placeholder:text-slate-500"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-mystic-gold/20 text-mystic-gold hover:bg-mystic-gold/30 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "oracle" && (
            <motion.div
              key="oracle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(212,175,55,0.2)", "0 0 50px rgba(212,175,55,0.4)", "0 0 20px rgba(212,175,55,0.2)"] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-48 h-48 rounded-full border-2 border-mystic-gold/50 flex items-center justify-center bg-mystic-purple/20 backdrop-blur-xl"
                >
                  <Zap className="w-20 h-20 text-mystic-gold" />
                </motion.div>
                <div className="absolute -top-4 -right-4 bg-mystic-gold text-mystic-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Oracle
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <h2 className="font-display text-2xl text-mystic-gold">Vòng Quay Vận Mệnh</h2>
                <p className="text-slate-400">
                  Khi bạn lạc lối, hãy để trực giác dẫn dắt. Nhấn nút bên dưới để nhận một lời sấm truyền ngẫu nhiên từ vũ trụ.
                </p>
                <button 
                  onClick={() => {
                    setActiveTab("chat");
                    quickAction("Tôi nên làm gì lúc này? Hãy cho tôi một lời khuyên ngẫu nhiên.");
                  }}
                  className="px-8 py-3 rounded-full bg-mystic-gold text-mystic-dark font-display font-bold hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  NHẬN LỜI KHUYÊN
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {[
                  { icon: <ScrollText />, label: "Kinh Dịch" },
                  { icon: <Star />, label: "Tử Vi" },
                  { icon: <Info />, label: "Tarot" }
                ].map((item, i) => (
                  <div key={i} className="mystic-glass p-4 rounded-xl flex flex-col items-center gap-2">
                    <div className="text-mystic-gold opacity-70">{item.icon}</div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center z-10">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          &copy; 2026 AI Mystic Guide • Personalized for Mai Trung Nam
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
      `}} />
    </div>
  );
}
