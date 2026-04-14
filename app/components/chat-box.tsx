'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = ['Work', 'About Kyle', 'Skills', 'Connect'];

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll inside the card — not the page
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
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
    /*
     * Fixed-height card — the card never grows or shrinks when messages appear.
     * All content scrolls *inside* it so the page never shifts.
     */
    <div
      className="w-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
      style={{ height: 'clamp(280px, 42vh, 400px)' }}
    >
      {/* ── Scrollable content area (fills all space above the input) ── */}
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          /* Messages */
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
            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Empty state + suggestions — stacked inside the same scroll area */
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

      {/* ── Fixed input row at the bottom ── */}
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
