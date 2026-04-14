export interface Tool {
  name: string;
  description: string;
  emoji: string;
}

export const tools: Tool[] = [
  { name: 'Claude', description: 'Primary AI model for building and thinking', emoji: '🤖' },
  { name: 'Claude Code', description: 'Agentic coding in the terminal', emoji: '💻' },
  { name: 'Codex', description: 'Code generation and automation', emoji: '⚡' },
  { name: 'Cursor', description: 'AI-native IDE', emoji: '🖱️' },
  { name: 'Next.js', description: 'React framework for the web', emoji: '▲' },
  { name: 'TypeScript', description: 'Typed JavaScript at scale', emoji: '🔷' },
  { name: 'Tailwind', description: 'Utility-first CSS framework', emoji: '🌊' },
  { name: 'Vercel', description: 'Deploy and scale instantly', emoji: '🚀' },
  { name: 'GitHub', description: 'Version control and collaboration', emoji: '🐙' },
  { name: 'Figma', description: 'Design and prototyping', emoji: '🎨' },
  { name: 'n8n', description: 'Workflow automation', emoji: '⚙️' },
  { name: 'VS Code', description: 'Code editor and debugger', emoji: '📝' },
  { name: 'Framer Motion', description: 'Production-ready animations', emoji: '🎞️' },
];
