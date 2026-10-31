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
