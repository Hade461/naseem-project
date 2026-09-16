import { logout } from "@/app/admin/actions";
import Link from "next/link";

export default function AdminHeader({ email }: { email: string }) {
  return (
    <header className="bg-ink text-text-light">
      <div className="max-w-[1120px] mx-auto px-6 py-3 md:h-[70px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-[Cairo] font-black text-lg">النسيم</span>
          <span className="text-white/50 text-sm">لوحة التحكم</span>
        </div>
        <div className="flex items-center gap-3 md:gap-5 text-sm">
          <Link href="/" className="text-white/70 hover:text-brass">مشاهدة الموقع</Link>
          <span className="hidden sm:inline text-white/50">{email}</span>
          <form action={logout}>
            <button type="submit" className="px-4 py-2 border border-white/30 rounded-sm hover:border-brass hover:text-brass">
              خروج
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
