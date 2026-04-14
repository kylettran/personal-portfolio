'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Lynx Combinator',
  "Kyle's story",
  'What has Kyle built?',
  "Let's connect",
];

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

      if (!res.ok || !res.body) {
        throw new Error(`status ${res.status}`);
      }

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
          { ...last, content: "something went wrong — dm kyle on x (@kyle_trxn) if this keeps happening." },
        ];
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {messages.length > 0 && (
        <div className="mb-3 max-h-52 overflow-y-auto space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <span className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-200'
              }`}>
                {msg.content || <span className="opacity-40">...</span>}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything about Kyle..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
          style={{ fontSize: '16px' }}
          disabled={isStreaming}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity disabled:opacity-30"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>

      {messages.length === 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="min-h-[48px] rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
