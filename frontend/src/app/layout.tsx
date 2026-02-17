import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ishi-doro Builder",
  description:
    "Design and build Japanese stone lanterns. Select from traditional forms or compose your own from six classical parts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-950 text-stone-200">
        {children}
      </body>
    </html>
  );
}
