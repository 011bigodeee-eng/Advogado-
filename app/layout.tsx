import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://advogado-self.vercel.app"),
  title: "Dr. Osmar Malta | Advocacia",
  description:
    "Compromisso com o Direito. Respeito à sua história. Direito de Família, Inventários e Execução Penal no Rio de Janeiro.",
  openGraph: {
    title: "Dr. Osmar Malta | Advocacia",
    description:
      "Cada história exige atenção. Cada decisão exige responsabilidade.",
    url: "/",
    images: [
      {
        url: "/images/retrato-abertura.png",
        width: 510,
        height: 510,
        alt: "Dr. Osmar Malta — Advocacia",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/cormorant.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/manrope.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
