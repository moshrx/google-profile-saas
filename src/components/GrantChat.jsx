import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUPPORT_EMAIL } from "../utils/constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are the GrantReady PEI AI assistant — a friendly, knowledgeable guide for small business owners in Prince Edward Island, Canada who want to find and apply for government grants.

You know everything about PEI business grants including:

Innovation PEI Programs:
- Web Presence Assistance Program: covers up to 50% of website development costs. For businesses needing to establish/improve online presence. No minimum time in business required.
- Business Development Support: up to $5,000 for business planning, market research, consulting. Requires 1+ years in business with at least 2 employees.
- Digital Adoption Support: up to $2,500 for adopting digital technologies, software, tools. For solo operators and small businesses (1–10 employees).
- Small Business Investment Grant: various amounts for capital investment in equipment, facilities improvements.
- Tourism Business Improvement Program: for tourism operators, covers marketing and product development.
- Export Development Program: for businesses looking to sell outside PEI.

Federal Programs available to PEI businesses:
- Canada Digital Adoption Program (CDAP): up to $15,000 for digital transformation. Ended March 2024 but encourage checking for successors.
- Canada Small Business Financing Program: loans up to $1.15M for equipment, leaseholds, intangible assets.
- BDC (Business Development Bank): flexible loans and advisory services.
- ACOA (Atlantic Canada Opportunities Agency): various funding for Atlantic Canadian businesses — Business Scale-Up and Productivity, Innovation, Community Economic Development.
- Women Entrepreneurship Fund, Black Entrepreneurship Program, Indigenous Business grants for qualifying applicants.

Key eligibility rules:
- Most PEI provincial grants require the business to be registered and operating in PEI.
- Many require a minimum number of employees or years of operation.
- Most are cost-sharing (you contribute a portion).
- Applications require a business plan, financial statements, and project quotes.
- Grant amounts vary and are usually reimbursement-based (you spend first, then claim).

ListedPEI context:
- ListedPEI is a free tool that generates Google Business Profile SEO kits for PEI businesses — descriptions, posts, review templates, keywords.
- PickUp AI is a service by ListedPEI that provides AI phone agents for PEI businesses — answers calls 24/7, handles bookings, FAQs. Plans start at $199/mo.
- PEI Web Studio (${SUPPORT_EMAIL}) builds websites and digital marketing for Island businesses and can help with grant applications.

Formatting rules — follow these strictly:
- Write in plain text only. No asterisks, no bold, no markdown of any kind.
- Use plain dashes (-) for bullet lists, never asterisks (*) or double asterisks (**).
- Never start a sentence with ** or end with **. If you feel the urge to bold something, just write it normally.
- Keep responses short and complete. 2–4 short paragraphs or a brief bullet list is ideal.
- Always finish your thought. Never cut off mid-sentence.
- End with one helpful next step or a follow-up offer.
- If asked what you can help with: finding grants, eligibility questions, what documents to prepare, application tips, and PEI business questions.
- Never make up grant amounts or deadlines you are unsure about — say "check the Innovation PEI website for current figures."`;

const WELCOME_MESSAGE = {
  role: "model",
  text: "Hi! I'm the GrantReady PEI assistant. I can help you find grants you qualify for, answer eligibility questions, and walk you through what to prepare for your application.\n\nWhat would you like to know?",
};

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-black shrink-0 mr-2 mt-0.5">G</div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-slate-900 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-black shrink-0 mr-2 mt-0.5">G</div>
      <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const SUGGESTED = [
  "What grants can I apply for?",
  "I have a restaurant, what am I eligible for?",
  "How do I apply for a grant?",
  "What documents do I need?",
];

export default function GrantChat({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState(null);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Init Gemini chat session once
  useEffect(() => {
    if (!API_KEY) return;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });
    const session = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
    });
    setChat(session);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setShowSuggested(false);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      if (!chat) throw new Error("Chat not initialised");
      const result = await chat.sendMessage(trimmed);
      const reply = result.response.text();
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `Sorry, I ran into an issue. Please try again or email ${SUPPORT_EMAIL} for help.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open grant assistant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white rounded-full shadow-2xl shadow-slate-900/30 transition-all hover:scale-105 active:scale-95 px-4 py-3 sm:px-5"
      >
        {open ? (
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-500"></span>
            </span>
            <span className="font-black text-sm">Ask the Grant AI</span>
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-5 z-50 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md flex flex-col rounded-[1.5rem] bg-white shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 100px))" }}
        >
          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-black">G</div>
            <div>
              <p className="text-white font-black text-sm leading-none">GrantReady AI</p>
              <p className="text-slate-400 text-xs mt-0.5">PEI grants assistant · powered by Gemini</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}
            {loading && <TypingDots />}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions — shown once */}
          {showSuggested && messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5 shrink-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 px-1">Suggested</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-700 rounded-full px-3 py-1.5 font-medium transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Policy disclaimer */}
          <div className="px-4 pt-2 pb-1 shrink-0">
            <p className="text-[10px] text-slate-400 leading-tight">
              AI-generated responses may not be 100% accurate. Always verify grant amounts, deadlines, and eligibility on the official <a href="https://www.princeedwardisland.ca/en/information/innovation-pei" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Innovation PEI</a> website. Chats are processed by Google Gemini and are not stored by ListedPEI.
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 flex gap-2 border-t border-slate-100 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about PEI grants..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:opacity-50 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white transition hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
