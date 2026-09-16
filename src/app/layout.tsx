import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "النسيم | أدوات مطبخ وكهربائيات منزلية",
    template: "%s | النسيم",
  },
  description: "عصرونية النسيم لأدوات المطبخ والكهربائيات المنزلية — تصفح الأصناف والأسعار قبل ما تزور المحل.",
  openGraph: {
    title: "النسيم | أدوات مطبخ وكهربائيات منزلية",
    description: "عصرونية النسيم لأدوات المطبخ والكهربائيات المنزلية — تصفح الأصناف والأسعار قبل ما تزور المحل.",
    locale: "ar",
    type: "website",
  },
  other: {
    "theme-color": "#1B1B18",
  },
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
