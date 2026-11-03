import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";
export const metadata: Metadata = {
  title: "Dr. Osmar Malta | Advocacia",
  description:
    "Compromisso com o Direito. Respeito à sua história. Direito de Família, Inventários e Execução Penal no Rio de Janeiro.",
  openGraph: {
    title: "Dr. Osmar Malta | Advocacia",
    description:
      "Cada história exige atenção. Cada decisão exige responsabilidade.",
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
      <body>{children}</body>
    </html>
  );
}
