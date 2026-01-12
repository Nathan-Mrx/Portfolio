import { Outfit } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import Header from "@/components/Header";
import CyberBackground from "@/components/CyberBackground";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Nathan-Mrx | Game Dev Portfolio",
    template: "%s | Nathan-Mrx"
  },
  description: "Game Developer Portfolio. Specializing gameplay programming in Unreal Engine 5",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Nathan-Mrx Portfolio',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Nathan-Mrx Cyber Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nathan-Mrx | Game Dev Portfolio',
    description: 'Game Developer Portfolio.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${outfit.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <CyberBackground />
          <Header locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
