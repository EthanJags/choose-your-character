"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
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

const INITIAL_MESSAGES: Message[] = [
  { from: "bot", text: "Hi! What's your name?" },
];

type Theme = {
  accent: string;
  accentText: string;
  panelBg: string;
};

const DEFAULT_THEME: Theme = {
  accent: "#FF5100",
  accentText: "#FFE8BE",
  panelBg: "#FFF7EC",
};

function buildTheme(detail: { color: string; secondaryColor: string; thirdColor: string } | null): Theme {
  if (!detail) return DEFAULT_THEME;
  const accent =
    detail.thirdColor && detail.thirdColor !== detail.secondaryColor
      ? detail.thirdColor
      : detail.color;
  return {
    accent,
    accentText: detail.secondaryColor,
    panelBg: "#FFF7EC",
  };
}

export default function Chatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial = (window as unknown as {
      __activeCharacter?: { color: string; secondaryColor: string; thirdColor: string } | null;
    }).__activeCharacter;
    if (initial) setTheme(buildTheme(initial));

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { color: string; secondaryColor: string; thirdColor: string }
        | null;
      setTheme(buildTheme(detail));
    };
    window.addEventListener("characterChange", handler);
    return () => window.removeEventListener("characterChange", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);

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

  const COLLAPSED = { width: 56, height: 56, radius: 9999 };
  const EXPANDED = { width: 320, height: 420, radius: 20 };

  return (
    <div
      className={`fixed z-50 chatbot-shell${open ? "" : " chatbot-shell--collapsed"}`}
      style={{
        right: "16px",
        bottom: "16px",
        width: open ? `${EXPANDED.width}px` : `${COLLAPSED.width}px`,
        height: open ? `${EXPANDED.height}px` : `${COLLAPSED.height}px`,
        maxWidth: "calc(100vw - 32px)",
        background: open ? "#ffffff" : theme.accent,
        border: "3px solid #171717",
        borderRadius: open ? `${EXPANDED.radius}px` : `${COLLAPSED.radius}px`,
        boxShadow: open ? "0 12px 32px rgba(0,0,0,0.25)" : "0 6px 16px rgba(0,0,0,0.25)",
        overflow: "hidden",
        transformOrigin: "bottom right",
        transition:
          "width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 320ms ease, background 240ms ease, box-shadow 240ms ease, transform 200ms ease",
      }}
    >
      <style>{`
        .chatbot-shell--collapsed:hover { transform: scale(1.1); }
        .chatbot-shell--collapsed:active { transform: scale(0.95); }
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
      {/* Collapsed smiley button — fades out when opening */}
      <button
        onClick={toggle}
        aria-label="Open chat"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
          transition: "opacity 160ms ease",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.accentText}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "44px", height: "44px" }}
        >
          <circle cx="9" cy="10" r="1.5" fill={theme.accentText} stroke="none" />
          <circle cx="15" cy="10" r="1.5" fill={theme.accentText} stroke="none" />
          <path d="M7.5 14c1.2 1.8 2.8 2.7 4.5 2.7s3.3-.9 4.5-2.7" />
        </svg>
      </button>

      {/* Expanded chat — fades in once open */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease",
          transitionDelay: open ? "160ms" : "0ms",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: theme.accent,
            color: theme.accentText,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "3px solid #171717",
            flexShrink: 0,
            transition: "background 240ms ease, color 240ms ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-londrina-solid), sans-serif",
              fontSize: "22px",
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            Chat with Ethan
          </div>
          <button
            onClick={toggle}
            aria-label="Close chat"
            style={{
              background: "transparent",
              border: "none",
              color: theme.accentText,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "20px", height: "20px" }}
            >
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: theme.panelBg,
            transition: "background 240ms ease",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
                maxWidth: "85%",
                padding: "8px 14px",
                borderRadius: m.from === "bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                background: m.from === "bot" ? "#ffffff" : theme.accent,
                color: m.from === "bot" ? "#171717" : theme.accentText,
                border: "2px solid #171717",
                fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive",
                fontSize: "17px",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {m.from === "bot"
                ? renderWithLinks(m.text, (href) => router.push(href), theme.accent)
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
            gap: "8px",
            padding: "10px",
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
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            disabled={loading}
            placeholder={loading ? "Thinking…" : "Type a message…"}
            style={{
              flex: 1,
              minWidth: 0,
              border: "2px solid #171717",
              borderRadius: "9999px",
              padding: "8px 14px",
              fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive",
              fontSize: "16px",
              outline: "none",
              background: theme.panelBg,
              color: "#171717",
            }}
          />
          <button
            type="submit"
            aria-label="Send message"
            style={{
              background: theme.accent,
              border: "2px solid #171717",
              borderRadius: "9999px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: theme.accentText,
              flexShrink: 0,
              transition: "background 240ms ease, color 240ms ease",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "18px", height: "18px" }}
            >
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
