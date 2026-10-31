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
    <html lang="en" className="dark">
      <body className="bg-[#05060A] text-slate-100 antialiased selection:bg-violet-600 selection:text-white min-h-screen relative overflow-x-hidden">
        <div className="ambient-grid fixed inset-0 pointer-events-none opacity-40 z-0" />
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
