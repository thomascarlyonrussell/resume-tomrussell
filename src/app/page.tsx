import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Theme Toggle */}
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Hero Section Placeholder */}
      <section className="text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">Tom Russell</h1>
        <p className="mb-8 text-lg text-[var(--color-muted)] md:text-xl">
          Engineering Leader • AI/ML Specialist • Product Innovator
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="rounded-full bg-[var(--color-engineering)] px-4 py-2 text-sm text-white">
            Engineering
          </span>
          <span className="rounded-full bg-[var(--color-software-development)] px-4 py-2 text-sm text-white">
            Software Development
          </span>
          <span className="rounded-full bg-[var(--color-ai-automation)] px-4 py-2 text-sm text-white">
            AI & Automation
          </span>
          <span className="rounded-full bg-[var(--color-product-management)] px-4 py-2 text-sm text-white">
            Product Management
          </span>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="mt-16 text-center text-[var(--color-muted)]">
        <p className="text-sm">Interactive visualizations and AI chatbot coming soon...</p>
      </section>
    </main>
  );
}
