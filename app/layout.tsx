import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iForgot - AI-Powered Note Taking",
  description: "Never forget anything with AI-powered notes and task extraction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
