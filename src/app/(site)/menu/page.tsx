import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/MenuGrid";
import { Product } from "@/lib/types";

export const revalidate = 0;

export default async function MenuPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <main>
      <section className="bg-ink text-text-light py-16">
        <div className="max-w-[1120px] mx-auto px-6">
          <h1 className="font-[Cairo] font-black text-[2rem] md:text-[2.6rem]">قائمة الأصناف</h1>
          <p className="text-white/70 mt-3 max-w-[50ch]">
            كل الأصناف الموجودة عنا مرتبة حسب القسم، مع الأسعار.
          </p>
        </div>
      </section>
      <div className="max-w-[1120px] mx-auto px-6">
        <Suspense>
          <MenuGrid products={products} />
        </Suspense>
      </div>
    </main>
  );
}
