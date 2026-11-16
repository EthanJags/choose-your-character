"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Message = { from: "bot" | "user"; text: string };

function renderBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<Fragment key={`${keyPrefix}-t${key++}`}>{text.slice(last, m.index)}</Fragment>);
    parts.push(<strong key={`${keyPrefix}-b${key++}`}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={`${keyPrefix}-t${key++}`}>{text.slice(last)}</Fragment>);
  return parts.length ? parts : [text];
}

function renderWithLinks(
  text: string,
  onInternal: (href: string) => void,
  linkColor: string
) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(
        <Fragment key={`pre-${key++}`}>{renderBold(text.slice(last, m.index), `pre-${key}`)}</Fragment>
      );
    }
    const [, label, href] = m;
    const isExternal = href.startsWith("http");
    parts.push(
      <a
        key={`link-${key++}`}
        href={href}
        onClick={(e) => {
          if (!isExternal) {
            e.preventDefault();
            onInternal(href);
          }
        }}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        style={{
          color: linkColor,
          textDecoration: "underline",
          textDecorationThickness: "2px",
          textUnderlineOffset: "2px",
          fontWeight: 600,
        }}
      >
        {renderBold(label, `lbl-${key}`)}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(
      <Fragment key={`post-${key++}`}>{renderBold(text.slice(last), `post-${key}`)}</Fragment>
    );
  }
  return parts.length ? parts : renderBold(text, "only");
}

// Matches the per-message cap enforced by /api/chat
const MAX_INPUT_LENGTH = 1000;

const INITIAL_MESSAGES: Message[] = [
  { from: "bot", text: "Hey, I'm Ethan! Well, an AI version of me, trained on everything I've put online. What's your name?" },
];

type Theme = {
  accent: string;
  accentText: string;
  linkColor: string;
  panelBg: string;
};

const INK = "#171717";

const DEFAULT_THEME: Theme = {
  accent: "#FF5100",
  accentText: "#FFE8BE",
  linkColor: "#FF5100",
  panelBg: "#FFF7EC",
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function buildTheme(detail: { color: string; secondaryColor: string; thirdColor: string } | null): Theme {
  if (!detail) return DEFAULT_THEME;
  // Match the page: the character's background color with its heading color on top.
  // When those two are too close to read at chat size (adventurer's cream on
  // lavender), fall back to the dark ink used for the chat's outlines.
  const accent = detail.color;
  const accentText = contrast(detail.secondaryColor, accent) >= 2.5 ? detail.secondaryColor : INK;
  // Links sit on white bot bubbles, so use whichever character color reads best there
  const linkColor = [detail.color, detail.secondaryColor, detail.thirdColor].reduce((best, c) =>
    contrast(c, "#ffffff") > contrast(best, "#ffffff") ? c : best
  );
  return { accent, accentText, linkColor, panelBg: "#FFF7EC" };
}

type ChatSectionProps = {
  character: { color: string; secondaryColor: string; thirdColor: string } | null;
  active: boolean;
};

export default function ChatSection({ character, active }: ChatSectionProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = buildTheme(character);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, active]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  // The input is disabled while waiting, which drops focus — restore it after the reply
  const wasLoadingRef = useRef(false);
  useEffect(() => {
    if (wasLoadingRef.current && !loading && active) inputRef.current?.focus();
    wasLoadingRef.current = loading;
  }, [loading, active]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = input.trim();
      if (!value || loading) return;
      const nextMessages: Message[] = [...messages, { from: "user", text: value }];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.from === "bot" ? "assistant" : "user",
              content: m.text,
            })),
          }),
        });
        if (!res.ok) throw new Error(`chat request failed: ${res.status}`);
        const data = (await res.json()) as { text?: string; error?: string };
        const reply = data.text?.trim() || "Hmm, I'm not sure what to say to that. Try asking about Ethan's projects!";
        setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "Oops — I had trouble connecting. Try again in a sec?" },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  return (
    // Same frame as the About tab: below the tab bar, centered, max 680px wide
    <div
      className="absolute inset-0 z-15 flex flex-col items-center pt-24 px-4 pb-6 sm:pt-32 sm:pb-12"
      style={{ display: active ? "flex" : "none" }}
    >
      <style>{`
        .chatbot-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #171717;
          display: inline-block;
          animation: chatbotDot 0.9s infinite ease-in-out;
        }
        @keyframes chatbotDot {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
      <div className="relative w-[90vw] max-w-[680px] flex-1 min-h-0 max-h-[680px] mt-4 sm:mt-2">
        <Image
          src="/about/tape.png"
          alt=""
          width={244}
          height={62}
          className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 z-10 w-36 sm:w-48 object-contain pointer-events-none"
          aria-hidden
        />
        <div
          className="h-full flex flex-col overflow-hidden"
          style={{
            background: "#ffffff",
            border: "3px solid #171717",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: theme.accent,
              color: theme.accentText,
              padding: "22px 20px 12px",
              borderBottom: "3px solid #171717",
              flexShrink: 0,
              textAlign: "center",
              transition: "background 800ms ease-out, color 800ms ease-out",
            }}
          >
            <h1
              className="uppercase"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", lineHeight: 1 }}
            >
              Chat with Ethan
            </h1>
            <p
              className="hidden sm:block"
              style={{
                fontFamily: '"Figma Hand", var(--font-figma-hand), cursive',
                fontSize: "17px",
                marginTop: "4px",
                opacity: 0.85,
              }}
            >
              An AI version of me — ask about my projects, adventures, or anything else
            </p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: theme.panelBg,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  padding: "8px 14px",
                  borderRadius: m.from === "bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                  background: m.from === "bot" ? "#ffffff" : theme.accent,
                  color: m.from === "bot" ? "#171717" : theme.accentText,
                  border: "2px solid #171717",
                  fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive",
                  fontSize: "19px",
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {m.from === "bot"
                  ? renderWithLinks(m.text, (href) => router.push(href), theme.linkColor)
                  : m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "#ffffff",
                  border: "2px solid #171717",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span className="chatbot-dot" style={{ animationDelay: "0s" }} />
                <span className="chatbot-dot" style={{ animationDelay: "0.15s" }} />
                <span className="chatbot-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px",
              borderTop: "3px solid #171717",
              background: "#ffffff",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // Keep typing from triggering the site's global keyboard shortcuts
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              disabled={loading}
              maxLength={MAX_INPUT_LENGTH}
              placeholder={loading ? "Thinking…" : "Type a message…"}
              style={{
                flex: 1,
                minWidth: 0,
                border: "2px solid #171717",
                borderRadius: "9999px",
                padding: "10px 16px",
                fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive",
                fontSize: "18px",
                outline: "none",
                background: theme.panelBg,
                color: "#171717",
              }}
            />
            <button
              type="submit"
              aria-label="Send message"
              className="hover:opacity-80 transition-opacity"
              style={{
                background: theme.accent,
                border: "2px solid #171717",
                borderRadius: "9999px",
                width: "46px",
                height: "46px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: theme.accentText,
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "20px", height: "20px" }}
              >
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
