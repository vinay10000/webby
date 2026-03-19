import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTML Playground",
  description: "Browser-based code editor for HTML, CSS, and JavaScript with live preview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
