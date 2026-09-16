"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function MenuGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "all";
  const [active, setActive] = useState(initialCat);

  const filters = [{ id: "all", label: "الكل" }, ...CATEGORIES];

  return (
    <div>
      <div className="flex gap-2.5 flex-wrap py-6 border-b border-line sticky top-[76px] bg-paper z-40">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`px-4.5 py-2 rounded-full border text-sm font-semibold ${
              active === f.id ? "bg-ink text-text-light border-ink" : "border-line hover:bg-ink hover:text-text-light hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="pb-20">
        {CATEGORIES.filter((c) => active === "all" || active === c.id).map((cat) => {
          const items = products.filter((p) => p.category === cat.id);
          if (items.length === 0) return null;
          return (
            <div key={cat.id} className="pt-14">
              <h2 className="text-[1.4rem] font-extrabold flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-px after:bg-line">
                {cat.label}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
        {products.length === 0 && <p className="text-text-mute pt-10">ما في أصناف مضافة لهلق.</p>}
      </div>
    </div>
  );
}
