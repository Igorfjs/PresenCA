import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "PresenCA · Cristo Alegria", description: "Sistema de Gestão de Presença da comunidade Cristo Alegria." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
