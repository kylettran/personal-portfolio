export interface Tool {
  name: string;
  description: string;
  emoji: string;
  logo?: string; // URL to actual brand logo — overrides emoji when set
}

export const tools: Tool[] = [
  { name: 'Claude',        description: 'Primary AI model for building and thinking', emoji: '🤖', logo: '/claude.svg' },
  { name: 'Claude Code',   description: 'Agentic coding in the terminal',             emoji: '💻', logo: '/claude-code.svg' },
  { name: 'Codex',         description: 'Code generation and automation',             emoji: '⚡', logo: 'https://cdn.simpleicons.org/openai/ffffff' },
  { name: 'Cursor',        description: 'AI-native IDE',                              emoji: '🖱️', logo: 'https://cdn.simpleicons.org/cursor/ffffff' },
  { name: 'Next.js',       description: 'React framework for the web',                emoji: '▲',  logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { name: 'TypeScript',    description: 'Typed JavaScript at scale',                  emoji: '🔷', logo: 'https://cdn.simpleicons.org/typescript/ffffff' },
  { name: 'Tailwind',      description: 'Utility-first CSS framework',                emoji: '🌊', logo: 'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  { name: 'Vercel',        description: 'Deploy and scale instantly',                 emoji: '🚀', logo: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { name: 'GitHub',        description: 'Version control and collaboration',          emoji: '🐙', logo: 'https://cdn.simpleicons.org/github/ffffff' },
  { name: 'Figma',         description: 'Design and prototyping',                     emoji: '🎨', logo: 'https://cdn.simpleicons.org/figma/ffffff' },
  { name: 'n8n',           description: 'Workflow automation',                        emoji: '⚙️', logo: 'https://cdn.simpleicons.org/n8n/ffffff' },
  { name: 'VS Code',       description: 'Code editor and debugger',                   emoji: '📝', logo: 'https://cdn.simpleicons.org/visualstudiocode/ffffff' },
  { name: 'Framer Motion', description: 'Production-ready animations',                emoji: '🎞️', logo: 'https://cdn.simpleicons.org/framer/ffffff' },
];
