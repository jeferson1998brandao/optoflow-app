import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optoflow — Sistema para Optometristas",
  description: "Gerencie seus pacientes, prontuários e receitas com praticidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
