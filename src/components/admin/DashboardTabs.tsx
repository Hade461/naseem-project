"use client";

import { useState } from "react";
import ProductsManager from "./ProductsManager";
import MessagesList from "./MessagesList";
import { Product } from "@/lib/types";

type Message = {
  id: string;
  name: string;
  phone: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default function DashboardTabs({
  products,
  messages,
}: {
  products: Product[];
  messages: Message[];
}) {
  const [tab, setTab] = useState<"products" | "messages">("products");

  return (
    <div>
      <div className="flex gap-2 mb-8 border-b border-line">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-3 font-bold text-sm border-b-2 -mb-px ${
            tab === "products" ? "border-brass text-ink" : "border-transparent text-text-mute"
          }`}
        >
          الأصناف
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`px-5 py-3 font-bold text-sm border-b-2 -mb-px ${
            tab === "messages" ? "border-brass text-ink" : "border-transparent text-text-mute"
          }`}
        >
          الرسائل ({messages.length})
        </button>
      </div>

      {tab === "products" ? <ProductsManager category={"" as any} products={products} onChanged={() => {}} /> : <MessagesList messages={messages} onChanged={() => {}} />}
    </div>
  );
}