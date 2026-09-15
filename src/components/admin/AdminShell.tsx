"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/admin/actions";
import { CATEGORIES, Category, Product } from "@/lib/types";
import ProductsManager from "./ProductsManager";
import MessagesList from "./MessagesList";

type Message = {
  id: string;
  name: string;
  phone: string;
  subject: string | null;
  message: string;
  created_at: string;
};

type View = "overview" | Category | "messages";

export default function AdminShell({
  email,
  initialProducts,
  initialMessages,
}: {
  email: string;
  initialProducts: Product[];
  initialMessages: Message[];
}) {
  const supabase = createClient();
  const [view, setView] = useState<View>("overview");
  const [products, setProducts] = useState(initialProducts);
  const [messages, setMessages] = useState(initialMessages);

  async function refreshProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  }

  async function refreshMessages() {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
  }

  const inStock = products.filter((p) => p.in_stock).length;
  const outOfStock = products.length - inStock;

  const navItemClass = (active: boolean) =>
    `w-full text-right px-4 py-2.5 rounded-sm text-sm font-semibold transition-colors ${
      active ? "bg-brass text-ink" : "text-white/75 hover:bg-white/10 hover:text-text-light"
    }`;

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-ink flex flex-col min-h-screen sticky top-0">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="font-[Cairo] font-black text-lg text-text-light">النسيم</div>
          <div className="text-white/50 text-xs mt-0.5">لوحة تحكم المتجر</div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <button onClick={() => setView("overview")} className={navItemClass(view === "overview")}>
            نظرة عامة
          </button>

          <div className="pt-5 pb-1.5 px-4 text-[11px] font-bold text-white/35 tracking-wide">الأصناف</div>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setView(c.id)} className={navItemClass(view === c.id)}>
              {c.label}
              <span className="text-xs font-normal opacity-60"> · {products.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}

          <div className="pt-5 pb-1.5 px-4 text-[11px] font-bold text-white/35 tracking-wide">التواصل</div>
          <button onClick={() => setView("messages")} className={navItemClass(view === "messages")}>
            الرسائل
            {messages.length > 0 && <span className="text-xs font-normal opacity-60"> · {messages.length}</span>}
          </button>
        </nav>

        <div className="px-3 py-5 border-t border-white/10 space-y-3">
          <a href="/" target="_blank" className="block px-4 py-2 text-xs text-white/50 hover:text-brass">
            مشاهدة الموقع ↗
          </a>
          <div className="px-4 text-xs text-white/40 truncate">{email}</div>
          <form action={logout}>
            <button type="submit" className="w-full px-4 py-2.5 rounded-sm text-sm font-semibold border border-white/20 text-white/80 hover:border-[#A34C3F] hover:text-[#e2a89c]">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-10 max-w-[1000px]">
        {view === "overview" && (
          <div>
            <h1 className="text-2xl font-bold">أهلاً فيك 👋</h1>
            <p className="text-text-mute mt-1.5">هاد ملخص سريع عن متجر النسيم اليوم.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <StatCard label="كل الأصناف" value={products.length} />
              <StatCard label="متوفر حالياً" value={inStock} accent />
              <StatCard label="غير متوفر" value={outOfStock} />
              <StatCard label="الرسائل" value={messages.length} />
            </div>

            <div className="mt-10 bg-white border border-line rounded-md p-6">
              <h3 className="font-bold mb-1">وين تبدأ؟</h3>
              <p className="text-text-mute text-sm mb-4">اختار قسم من القائمة الجانبية حتى تضيف أو تعدل أصنافه، أو افتح الرسائل لتشوف آخر استفسارات الزبائن.</p>
              <div className="flex flex-wrap gap-2.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setView(c.id)}
                    className="px-4 py-2 text-sm font-semibold rounded-sm border border-line hover:border-ink"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {view !== "overview" && view !== "messages" && (
          <ProductsManager category={view} products={products} onChanged={refreshProducts} />
        )}

        {view === "messages" && <MessagesList messages={messages} onChanged={refreshMessages} />}
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white border border-line rounded-md p-5">
      <div className={`text-3xl font-[Cairo] font-black ${accent ? "text-brass-dim" : "text-ink"}`}>{value}</div>
      <div className="text-text-mute text-sm mt-1">{label}</div>
    </div>
  );
}
