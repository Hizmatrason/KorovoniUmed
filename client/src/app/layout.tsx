import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korvoni Umed",
  description: "Caravan of Hope - supporting women and children in Tajikistan since 2009",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
