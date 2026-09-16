"use client";

import { useState } from "react";
import ProductsManager from "./ProductsManager";
import MessagesList from "./MessagesList";
import { CATEGORIES, Product } from "@/lib/types";

type Message = {
  id: string;
  name: string;
  phone: string;
  subject: string | null;
  message: string;
  created_at: string;
};

function StatCard({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-line rounded-sm p-5 text-center">
      <div className={`font-[Cairo] font-black text-3xl ${accent ? "text-brass-dim" : "text-ink"}`}>{value}</div>
      <div className="text-text-mute text-sm mt-1">{label}</div>
    </div>
  );
}

function Overview({
  products,
  messages,
  onGoTo,
}: {
  products: Product[];
  messages: Message[];
  onGoTo: (tab: "products" | "messages") => void;
}) {
  const inStock = products.filter((p) => p.in_stock).length;

  return (
    <div>
      <div className="bg-ink text-text-light rounded-sm p-7 mb-7">
        <h2 className="font-[Cairo] font-black text-xl">أهلاً فيك 👋</h2>
        <p className="text-white/65 text-sm mt-1.5">هاد ملخص سريع عن متجر النسيم اليوم.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-9">
        <StatCard value={inStock} label="متوفر حالياً" accent />
        <StatCard value={products.length} label="كل الأصناف" />
        <StatCard value={messages.length} label="الرسائل" />
        <StatCard value={products.length - inStock} label="غير متوفر" />
      </div>

      <h3 className="font-bold text-base mb-4">الأقسام</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onGoTo("products")}
            className="text-right bg-ink text-text-light rounded-sm p-5 hover:-translate-y-0.5 transition-transform"
          >
            <div className="font-bold">{c.label}</div>
            <div className="text-white/55 text-sm mt-1">
              {products.filter((p) => p.category === c.id).length} صنف
            </div>
          </button>
        ))}
      </div>

      <div className="bg-paper-2 border border-line rounded-sm p-6">
        <h3 className="font-bold text-base mb-2">وين تبدأ؟</h3>
        <p className="text-text-mute text-sm leading-relaxed">
          اختار تبويب &quot;الأصناف&quot; فوق حتى تضيف أو تعدل الأصناف، أو افتح &quot;الرسائل&quot; لتشوف آخر استفسارات الزبائن.
        </p>
      </div>
    </div>
  );
}

export default function DashboardTabs({
  products,
  messages,
}: {
  products: Product[];
  messages: Message[];
}) {
  const [tab, setTab] = useState<"overview" | "products" | "messages">("overview");

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 md:px-5 py-3 font-bold text-sm border-b-2 -mb-px whitespace-nowrap ${
        tab === id ? "border-brass text-ink" : "border-transparent text-text-mute"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex gap-1 md:gap-2 mb-8 border-b border-line overflow-x-auto">
        {tabBtn("overview", "نظرة عامة")}
        {tabBtn("products", "الأصناف")}
        {tabBtn("messages", `الرسائل (${messages.length})`)}
      </div>

      {tab === "overview" && <Overview products={products} messages={messages} onGoTo={setTab} />}
      {tab === "products" && <ProductsManager initialProducts={products} />}
      {tab === "messages" && <MessagesList initialMessages={messages} />}
    </div>
  );
}
