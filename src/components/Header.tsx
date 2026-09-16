"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "القائمة" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink border-b border-white/10">
      <div className="max-w-[1120px] mx-auto px-6 h-[76px] flex items-center justify-between">
        <Link href="/" className="font-[Cairo] font-black text-xl text-text-light flex items-baseline gap-2">
          النسيم<span className="text-brass">.</span>
          <small className="font-normal text-[.7rem] text-white/60">أدوات مطبخ وكهربائيات</small>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden border border-white/30 text-text-light px-3 py-2 rounded-sm"
          aria-label="فتح القائمة"
          aria-expanded={open}
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-9 font-semibold">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`py-1 relative ${
                  pathname === l.href ? "text-text-light" : "text-white/85 hover:text-text-light"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-white/55 border border-white/20 rounded-full px-4 py-1.5 hover:border-brass hover:text-brass transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } md:hidden flex-col gap-0 absolute inset-x-0 top-[76px] bg-ink px-6 pb-5 border-b border-white/10 font-semibold`}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-3 border-b border-white/5 relative ${
                pathname === l.href ? "text-text-light" : "text-white/85 hover:text-text-light"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="py-3 text-white/55 hover:text-brass"
          >
            تسجيل الدخول
          </Link>
        </nav>
      </div>
    </header>
  );
}
