import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaula Grappling | Academia de Artes Marciais no Rio de Janeiro",
  description:
    "A Jaula Grappling é referência em Jiu-Jitsu, Grappling e Luta Livre no Grajaú, Rio de Janeiro. Formando campeões com treinos de alta performance. Agende sua aula experimental gratuitamente.",
  keywords: [
    "jiu-jitsu",
    "grappling",
    "luta livre",
    "artes marciais",
    "academia",
    "grajaú",
    "rio de janeiro",
    "aula experimental",
    "jaula grappling",
  ],
  openGraph: {
    title: "Jaula Grappling | Academia de Artes Marciais",
    description:
      "Referência em Grappling no Rio de Janeiro. Formando campeões. Agende sua aula experimental!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
