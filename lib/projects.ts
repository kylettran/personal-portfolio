export interface Project {
  slug: string;
  number: string;
  type: string;
  title: string;
  description: string;
  url: string | null;
  github: string | null;
  image: string | null;
  tags: string[];
  status: 'live' | 'in-development';
}

export const projects: Project[] = [
  {
    slug: 'lynx-combinator',
    number: '01',
    type: 'Youth AI Program',
    title: 'Lynx Combinator',
    description: "Building the biggest youth incubator in existence. A 6-week bootcamp that turns young leaders into AI builders — every student ships 3 real AI products ready for their portfolio.",
    url: 'https://ls-portfolio-page.vercel.app/',
    github: null,
    image: '/lynx-hero.png',
    tags: ['AI', 'Education', 'Founders'],
    status: 'live',
  },
  {
    slug: 'ikigai-app',
    number: '02',
    type: 'In Development',
    title: 'Ikigai App',
    description: "A passion project that helps you find your passion in life — built around the Japanese concept of ikigai.",
    url: null,
    github: null,
    image: null,
    tags: ['Mobile', 'Wellness', 'AI'],
    status: 'in-development',
  },
  {
    slug: 'brain-project',
    number: '03',
    type: 'Interactive Experience',
    title: 'Brain Project',
    description: "A living neural sculpture that shifts from silhouette to synaptic pathways. An interactive 3D experience.",
    url: null,
    github: null,
    image: '/planetfall.png',
    tags: ['3D', 'Interactive', 'Creative'],
    status: 'live',
  },
  {
    slug: 'personal-portfolio',
    number: '04',
    type: 'Design & Dev',
    title: 'Personal Portfolio',
    description: "This site — designed and built with Claude, Next.js, and Tailwind. Mobile-first from the ground up.",
    url: 'https://kyletran.com',
    github: 'https://github.com/kylettran/personal-portfolio',
    image: null,
    tags: ['Next.js', 'Tailwind', 'Claude'],
    status: 'live',
  },
];
