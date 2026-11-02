import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerFlow — Focused Job Application & Pipeline Tracker",
  description:
    "A clean, disciplined job application management platform engineered for final-year students and recent graduates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
