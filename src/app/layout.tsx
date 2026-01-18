import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Tom Russell - Portfolio',
    template: '%s | Tom Russell',
  },
  description:
    'Personal portfolio and resume website for Tom Russell, showcasing career history, skills, and projects through interactive visualizations and AI-powered chatbot.',
  keywords: [
    'Tom Russell',
    'portfolio',
    'software engineer',
    'AI',
    'data visualization',
    'product management',
  ],
  authors: [{ name: 'Tom Russell' }],
  creator: 'Tom Russell',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Tom Russell Portfolio',
    title: 'Tom Russell - Portfolio',
    description:
      'Personal portfolio showcasing skills, experience, and projects through interactive visualizations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tom Russell - Portfolio',
    description:
      'Personal portfolio showcasing skills, experience, and projects through interactive visualizations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
