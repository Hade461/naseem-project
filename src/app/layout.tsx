import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "النسيم | أدوات مطبخ وكهربائيات منزلية",
  description: "عصرونية النسيم لأدوات المطبخ والكهربائيات المنزلية",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
