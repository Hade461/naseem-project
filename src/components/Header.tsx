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

        <nav
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-0 md:gap-9 absolute md:static top-[76px] inset-x-0 md:inset-auto bg-ink md:bg-transparent px-6 md:px-0 pb-5 md:pb-0 border-b md:border-0 border-white/10 font-semibold`}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-3 md:py-1 border-b md:border-b-0 border-white/5 relative ${
                pathname === l.href ? "text-text-light" : "text-white/85 hover:text-text-light"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
