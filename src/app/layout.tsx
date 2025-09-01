import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maveli vs Vamanan – Play & Win Free Movie Tickets",
  description:
    "Play the epic Maveli vs Vamanan game this Onam! Defeat Vamanan and stand a chance to win a free movie ticket. Fun, festive, and rewarding!",
  keywords: [
    "Maveli vs Vamanan",
    "Onam game",
    "Kerala game",
    "festival game",
    "free movie ticket",
    "fun online game",
  ],
  authors: [{ name: "Your Name or Company" }],
  openGraph: {
    title: "Maveli vs Vamanan – Play & Win Free Movie Tickets",
    description:
      "Challenge Vamanan, celebrate Onam, and get rewarded! Beat the game and claim your free movie ticket.",
    url: "https://yourdomain.com", // Replace with your deployed URL
    siteName: "Maveli vs Vamanan Game",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg", // Add your OG image (1200x630px)
        width: 1200,
        height: 630,
        alt: "Maveli vs Vamanan Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maveli vs Vamanan – Play & Win Free Movie Tickets",
    description:
      "Play this Onam special game, defeat Vamanan, and grab your free movie ticket!",
    images: ["https://yourdomain.com/og-image.jpg"],
    creator: "@yourTwitterHandle", // optional
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#FFD700", // Onam festive color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
