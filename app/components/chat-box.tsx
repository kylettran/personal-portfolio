'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = ['Work', 'About Kyle', 'Skills', 'Connect'];

// Contextual follow-ups based on what the user just asked about
const FOLLOW_UPS: Record<string, string[]> = {
  work:             ['Lynx Combinator', "What's Kyle building now?", 'Past companies', 'Favorite stack'],
  'about kyle':     ["Kyle's background", 'Where is Kyle based?', 'What drives Kyle?', 'How to reach Kyle?'],
  'kyle\'s background': ['What drives Kyle?', 'How to reach Kyle?', "Kyle's projects"],
  skills:           ['AI tools Kyle uses', 'What can Kyle build?', 'Years of experience?', 'Favorite stack'],
  connect:          ['Email Kyle', 'LinkedIn', 'X / Twitter', 'Collab ideas'],
  'lynx combinator':['What does Lynx do?', 'Is it live?', 'How to join?', "Kyle's role"],
  'favorite stack': ['Next.js details', 'Why AI-native?', 'What Kyle builds with it'],
  default:          ['Tell me more', 'What else?', 'How to reach Kyle?', 'Kyle\'s projects'],
};

function getFollowUps(text: string): string[] {
  const lower = text.toLowerCase();
  for (const key of Object.keys(FOLLOW_UPS)) {
    if (key !== 'default' && lower.includes(key)) return FOLLOW_UPS[key];
  }
  return FOLLOW_UPS.default;
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, followUps]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
    setFollowUps([]); // clear previous follow-ups while responding
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
        });
      }

      // Show contextual follow-ups once the response is complete
      setFollowUps(getFollowUps(trimmed));
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          {
            ...last,
            content:
              "something went wrong — dm kyle on x (@kyle_trxn) if this keeps happening.",
          },
        ];
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div
      className="w-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
      style={{ height: 'clamp(280px, 42vh, 400px)' }}
    >
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-3 p-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`inline-block max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/[0.06] text-zinc-200'
                  }`}
                >
                  {msg.content || <span className="opacity-40">...</span>}
                </span>
              </div>
            ))}

            {/* Follow-up chips appear after AI finishes responding */}
            {!isStreaming && followUps.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {followUps.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-violet-400/40 hover:text-violet-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Initial empty state */
          <div className="flex h-full flex-col items-center justify-center gap-5 px-5 py-6">
            <span className="text-zinc-600 text-sm">Ask me anything about Kyle...</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-400 transition-colors hover:border-violet-400/40 hover:text-violet-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed input row */}
      <div className="shrink-0 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 px-5 py-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about Kyle..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
            style={{ fontSize: '16px' }}
            disabled={isStreaming}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isStreaming || !input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-xs transition-all disabled:opacity-25 hover:bg-violet-400 hover:scale-105"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
