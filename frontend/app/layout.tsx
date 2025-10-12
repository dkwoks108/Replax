import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReplaX — EcoCart Hub',
  description: 'Eco-friendly products and sustainable living',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-cream text-gray-900">{children}</main>
      </body>
    </html>
  );
}
