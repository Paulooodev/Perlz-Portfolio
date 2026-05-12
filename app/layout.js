import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata = {
  title: "Perlz — Music Producer",
  description:
    "Crafting the future of sound. Afrobeats, UK tunes, and Hip-Hop production from Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} dark`}>{children}</body>
    </html>
  );
}
