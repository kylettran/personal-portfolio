export interface Tool {
  name: string;
  description: string;
  emoji: string;
}

export const tools: Tool[] = [
  { name: 'Claude', description: 'Primary AI model for building and thinking', emoji: '🤖' },
  { name: 'Claude Code', description: 'Agentic coding in the terminal', emoji: '💻' },
  { name: 'Claude Cowork', description: 'Collaborative AI workspace', emoji: '🤝' },
  { name: 'Codex', description: 'Code generation and automation', emoji: '⚡' },
  { name: 'Figma', description: 'Design and prototyping', emoji: '🎨' },
  { name: 'VS Code', description: 'Code editor', emoji: '📝' },
  { name: 'Cursor', description: 'AI-native IDE', emoji: '🖱️' },
];
