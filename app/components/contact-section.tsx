'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const contactLinks = [
  {
    label: 'Email',
    value: 'kyle7tran@gmail.com',
    href: 'mailto:kyle7tran@gmail.com',
    icon: <Mail size={16} />,
  },
  {
    label: 'LinkedIn',
    value: '/in/kyletran01',
    href: 'https://www.linkedin.com/in/kyletran01/',
    icon: <Linkedin size={16} />,
  },
  {
    label: 'X / Twitter',
    value: '@kylettran',
    href: 'https://twitter.com/kylettran',
    icon: <XIcon />,
  },
  {
    label: 'GitHub',
    value: 'github.com/kylettran',
    href: 'https://github.com/kylettran',
    icon: <Github size={16} />,
  },
];

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
      if (!res.ok) { setErrMsg(data.error ?? 'something went wrong'); setStatus('error'); return; }
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } catch {
      setErrMsg('network error — check your connection and try again');
      setStatus('error');
    }
  }

  const fieldWrap =
    'rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors focus-within:border-violet-400/50';
  const inputBase =
    'mt-1 w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none';

  return (
    <section
      id="contact"
      className="w-full px-4 sm:px-6 py-24"
      style={{
        background:
          'linear-gradient(180deg, transparent 0%, rgba(109,40,217,0.07) 15%, rgba(109,40,217,0.11) 50%, rgba(109,40,217,0.07) 85%, transparent 100%)',
        borderTop:    '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="mx-auto max-w-5xl">

        {/* ── Two-column on desktop, stacked on mobile ── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16 md:items-start">

          {/* LEFT — info + social links */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">Get in Touch</p>
              <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">
                Let&apos;s Connect
              </h2>
              <p className="mt-3 text-zinc-400 leading-relaxed">
                Have a question, project idea, or just want to say hi? I&apos;d love to hear
                from you — fill out the form or reach me on any of these platforms.
              </p>
            </div>

            {/* Social link cards */}
            <div className="flex flex-col gap-3">
              {contactLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all hover:border-violet-400/30 hover:bg-white/[0.05]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-400 transition-colors group-hover:text-violet-400">
                    {link.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                      {link.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-zinc-300 transition-colors group-hover:text-white">
                      {link.value}
                    </p>
                  </div>
                  <span className="ml-auto text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-violet-400">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="md:col-span-3">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 text-2xl">
                  ✓
                </div>
                <div>
                  <p className="text-lg font-medium text-white">Message sent!</p>
                  <p className="mt-1 text-sm text-zinc-400">I&apos;ll get back to you soon.</p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-xs text-zinc-600 underline underline-offset-2 transition-colors hover:text-zinc-400"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className={fieldWrap}>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-600">Name</label>
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
                      <label className="text-[10px] uppercase tracking-widest text-zinc-600">Email</label>
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
                    <label className="text-[10px] uppercase tracking-widest text-zinc-600">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      required
                      maxLength={2000}
                      rows={6}
                      className={`${inputBase} resize-none`}
                      style={{ fontSize: '16px' }}
                      disabled={status === 'sending'}
                    />
                    <p className="mt-1.5 text-right text-[10px] text-zinc-700">
                      {message.length} / 2000
                    </p>
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <p className="text-xs text-red-400">
                      {errMsg} — or email me at{' '}
                      <a href="mailto:kyle7tran@gmail.com" className="underline hover:text-red-300">
                        kyle7tran@gmail.com
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl bg-violet-500 py-4 text-sm font-medium text-white transition-all hover:bg-violet-400 disabled:opacity-40"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
