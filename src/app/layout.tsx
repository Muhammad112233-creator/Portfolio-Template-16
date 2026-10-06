import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const dmSans = localFont({ src: "../../public/fonts/dm-sans-latin.woff2", variable: "--font-dm-sans", weight: "100 1000", display: "swap" });
const geistMono = localFont({ src: "../../public/fonts/geist-mono-latin.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap" });
const newsreader = localFont({ src: "../../public/fonts/newsreader-latin.woff2", variable: "--font-newsreader", weight: "300", display: "swap" });

export const metadata: Metadata = {
  title: "Morgan Ellis — Product Engineer",
  description: "A small desktop-style portfolio by Morgan Ellis: product engineering, selected work, notes, and ways to get in touch.",
  applicationName: "Morgan OS Portfolio",
  keywords: ["portfolio", "product engineer", "creative developer", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Morgan Ellis" }],
  openGraph: {
    title: "Morgan Ellis — Product Engineer",
    description: "A small desktop-style portfolio: product engineering, selected work, notes, and ways to get in touch.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Morgan Ellis — Product Engineer",
    description: "A small desktop-style portfolio: product engineering, selected work, notes, and ways to get in touch."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff631a"
};

const themeBootstrap = `
(() => {
  try {
    const root = document.documentElement;
    const saved = JSON.parse(localStorage.getItem("morgan-os:display-preferences:v1") || "{}");
    const themes = ["light", "dark"];
    const accents = ["orange", "green", "blue", "purple"];
    const wallpapers = ["sunset", "grove", "tide", "paper"];
    root.dataset.theme = themes.includes(saved.theme) ? saved.theme : "light";
    root.dataset.accent = accents.includes(saved.accent) ? saved.accent : "orange";
    root.dataset.wallpaper = wallpapers.includes(saved.wallpaper) ? saved.wallpaper : "sunset";
    const brightness = Math.max(75, Math.min(100, Number(saved.brightness) || 100));
    root.style.setProperty("--display-brightness", String(brightness / 100));
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${geistMono.variable} ${newsreader.variable}`} data-theme="light" data-accent="orange" data-wallpaper="sunset" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>{children}</body>
    </html>
  );
}
