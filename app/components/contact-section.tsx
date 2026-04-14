'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactSection() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState<Status>('idle');
  const [errMsg, setErrMsg]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.error ?? 'something went wrong');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setErrMsg('network error — check your connection and try again');
      setStatus('error');
    }
  }

  const inputBase =
    'mt-1 w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none';

  const fieldWrap =
    'rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors focus-within:border-violet-400/40';

  return (
    <section id="contact" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Get in Touch</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Contact</h2>
          <p className="mt-3 text-zinc-400">
            Have a question or want to work together? Drop me a message.
          </p>
        </div>

        <div className="w-full max-w-xl">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 text-xl">
                ✓
              </div>
              <div>
                <p className="font-medium text-white">Message sent!</p>
                <p className="mt-1 text-sm text-zinc-400">
                  I&apos;ll get back to you soon.
                </p>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs text-zinc-600 underline underline-offset-2 hover:text-zinc-400 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className={fieldWrap}>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={100}
                    className={inputBase}
                    style={{ fontSize: '16px' }}
                    disabled={status === 'sending'}
                  />
                </div>
                <div className={fieldWrap}>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    maxLength={254}
                    className={inputBase}
                    style={{ fontSize: '16px' }}
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Message */}
              <div className={fieldWrap}>
                <label className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  required
                  maxLength={2000}
                  rows={5}
                  className={`${inputBase} resize-none`}
                  style={{ fontSize: '16px' }}
                  disabled={status === 'sending'}
                />
                <p className="mt-1 text-right text-[10px] text-zinc-700">
                  {message.length}/2000
                </p>
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-xs text-red-400">
                  {errMsg} — or email me directly at{' '}
                  <a
                    href="mailto:kyle7tran@gmail.com"
                    className="underline hover:text-red-300"
                  >
                    kyle7tran@gmail.com
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-xl bg-violet-500 py-3.5 text-sm font-medium text-white transition-all hover:bg-violet-400 disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
