import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'DreamRoom AI - Transform Your Space with AI',
  description: 'Upload a photo of your room and watch our AI transform it into a stunning 3D environment. Redesign with simple voice commands and bring your dream space to life.',
  keywords: 'AI room design, interior design, 3D room visualization, AI assistant, home decoration',
  authors: [{ name: 'DreamRoom AI Team' }],
  creator: 'DreamRoom AI',
  publisher: 'DreamRoom AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dreamroom-ai.com',
    title: 'DreamRoom AI - Transform Your Space with AI',
    description: 'Upload a photo of your room and watch our AI transform it into a stunning 3D environment. Redesign with simple voice commands and bring your dream space to life.',
    siteName: 'DreamRoom AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DreamRoom AI - Transform Your Space with AI',
    description: 'Upload a photo of your room and watch our AI transform it into a stunning 3D environment. Redesign with simple voice commands and bring your dream space to life.',
    creator: '@dreamroomai',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8b5cf6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
        <body className={`${inter.variable} font-body antialiased`}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </body>
    </html>
  );
}