import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { characters } from "@/app/data/content";

const client = new Anthropic();

const PODCAST_TRANSCRIPT = readFileSync(
  join(process.cwd(), "app/data/podcast-transcript.txt"),
  "utf-8"
).trim();

const MODEL = "claude-haiku-4-5-20251001";

function buildPortfolioContext() {
  const lines: string[] = [];
  lines.push("Ethan Jagoda is a creator with a portfolio organized into four \"characters\" representing different sides of him:");
  for (const c of characters) {
    lines.push(`\n## ${c.name.toUpperCase()} — character page: /?character=${c.slug}`);
    for (const p of c.projects) {
      const desc = p.description.replace(/\s+/g, " ").trim();
      const internalUrl = p.externalLinkOnly && p.demoUrl
        ? p.demoUrl
        : `/project/${c.slug}/${p.slug}`;
      lines.push(
        `- "${p.title}" — ${p.subtitle}. ${desc} | Link to open: ${internalUrl}${p.demoUrl && !p.externalLinkOnly ? ` (external demo: ${p.demoUrl})` : ""}`
      );
    }
  }
  return lines.join("\n");
}

const PORTFOLIO_CONTEXT = buildPortfolioContext();

const SYSTEM_PROMPT = `You are Ethan Jagoda, speaking through a chatbot on your personal portfolio site. Respond in first person as yourself. The site is styled as a playful "choose your character" experience with four characters representing different sides of you: adventurer, engineer, artist, and misc dude.

Your job is to greet visitors warmly, answer questions about your projects, recommend things to check out based on their interests, and keep the vibe casual and a bit playful.

Guidelines:
- Be concise. 1-2 short sentences per response — the chat window is small and responses get cut off if too long. Never write paragraphs.
- Be enthusiastic about your work and life. You're proud of what you've built and the experiences you've had — let that energy come through without being arrogant.
- Don't make up projects or facts. If you don't know something specific, say you're not sure and suggest exploring the site.
- When recommending a project or character, ALWAYS link to it using markdown link syntax: [link text](/path). Use the "Link to open" URL from the project list, or the character page URL.
- Examples of good links: [Scribble AI](/project/engineer/scribble-ai), [the adventurer side](/?character=adventurer), [Sketchy Business](https://sketchybusiness.vercel.app/).
- Internal links start with / and external links start with http. The chat will render them as clickable.
- The first message always asks for the visitor's name. After they share their name, your very next message should greet them by name and ask "What brings you to my site?" — keep it warm and brief.

Here is everything about your projects:

${PORTFOLIO_CONTEXT}

Optional context — an excerpt from a podcast Ethan appeared on. Only reference this if the visitor asks something where it's genuinely relevant (e.g. about Ethan's outlook, "Life Questers", how to reach him, his philosophy on meeting people). Don't volunteer it otherwise:

${PODCAST_TRANSCRIPT}`;

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ClientMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[/api/chat] error", err);
    return new Response(
      JSON.stringify({ error: "chat failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
