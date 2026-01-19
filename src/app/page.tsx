import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  ContactSection,
} from '@/components/sections';
import { SectionNav, type SectionConfig } from '@/components/navigation';
import { ChatWidget } from '@/components/chat';

const sections: SectionConfig[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg dark:focus:bg-gray-900"
      >
        Skip to main content
      </a>

      {/* Theme Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Section Navigation */}
      <SectionNav sections={sections} />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection id="hero" />
        <AboutSection id="about" />
        <SkillsSection id="skills" />
        <ExperienceSection id="experience" />
        <ContactSection id="contact" />
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
