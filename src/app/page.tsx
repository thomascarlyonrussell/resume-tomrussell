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
  { id: 'visualization', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg dark:focus:bg-gray-900"
      >
        Skip to main content
      </a>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Section Navigation */}
      <SectionNav sections={sections} />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection id="hero" />
        <SkillsSection id="visualization" />
        <ExperienceSection id="experience" />
        <AboutSection id="about" />
        <ContactSection id="contact" />
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
