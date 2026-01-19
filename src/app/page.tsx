import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { FibonacciSpiral } from '@/components/visualizations';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      {/* Theme Toggle */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="pt-8 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">Tom Russell</h1>
        <p className="mb-8 text-lg text-[var(--color-muted)] md:text-xl">
          Engineering Leader • AI/ML Specialist • Product Innovator
        </p>
      </section>

      {/* Skills Visualization Section */}
      <section className="w-full max-w-6xl">
        <h2 className="mb-4 text-center text-2xl font-semibold md:text-3xl">
          Skills & Experience
        </h2>
        <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
          Hover or tap on skills to learn more. Size reflects proficiency and experience.
        </p>
        <FibonacciSpiral />
      </section>

      {/* Coming Soon */}
      <section className="mt-8 text-center text-[var(--color-muted)]">
        <p className="text-sm">Timeline view and AI chatbot coming soon...</p>
      </section>
    </main>
  );
}
