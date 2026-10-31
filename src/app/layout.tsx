import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProfessorX — Your Notes Interrogate You',
  description: 'An adaptive AI oral-exam simulator. ProfessorX analyzes your notes, interrogates you one question at a time, detects misconceptions, and generates a personalized repair plan.',
  keywords: ['AI oral exam', 'Gemini Flash', 'Adaptive Learning', 'Misconception Detection', 'Study Tool', 'Next-Gen Agent'],
  authors: [{ name: 'ProfessorX Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF9F6] text-neutral-900 antialiased selection:bg-rose-500 selection:text-white min-h-screen relative overflow-x-hidden">
        {/* Vibrant Gradient Mesh Background */}
        <div className="editorial-mesh" />

        {/* App Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
