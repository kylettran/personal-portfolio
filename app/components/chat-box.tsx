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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      {/* Message area */}
      {messages.length > 0 ? (
        <div className="max-h-60 overflow-y-auto space-y-2 p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-zinc-200'
                }`}
              >
                {msg.content || <span className="opacity-40">...</span>}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        /* Empty state placeholder */
        <div className="flex items-center justify-center h-36 text-zinc-600 text-sm">
          Ask me anything about Kyle...
        </div>
      )}

      {/* Suggestion pills — only visible before first message */}
      {messages.length === 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-4">
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
      )}

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Input row */}
      <div className="flex items-center gap-3 px-4 py-3">
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
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-xs transition-opacity disabled:opacity-30 hover:bg-violet-400"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
