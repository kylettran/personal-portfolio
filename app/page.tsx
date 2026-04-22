import { NavDesktop } from './components/nav-desktop';
import { NavMobile } from './components/nav-mobile';
import { Hero } from './components/hero';
import { AboutSection } from './components/about-section';
import { CvSection } from './components/cv-section';
import { ProjectsSection } from './components/projects-section';
import { SkillsSection } from './components/skills-section';
import { MoreSection } from './components/more-section';
import { ContactSection } from './components/contact-section';
import { Footer } from './components/footer';

export default function Home() {
  return (
    <>
      <NavDesktop />
      <NavMobile />
      <main className="pb-16 md:pb-0">
        <Hero />
        <AboutSection />
        <CvSection />
        <ProjectsSection />
        <SkillsSection />
        <MoreSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
