import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dgroup App - CCF Discipleship Groups",
  description: "Connect, grow, and thrive in your discipleship journey",
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
