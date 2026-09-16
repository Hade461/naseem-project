import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  const products = (featured ?? []) as Product[];

  return (
    <main>
      <section className="bg-ink text-text-light py-24 md:py-28 relative overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 relative z-10">
          <div className="w-[46px] h-[3px] bg-brass mb-5" />
          <h1 className="font-[Cairo] font-black text-[2.3rem] md:text-[3.6rem] leading-tight max-w-[14ch]">
            كل شي يلزم مطبخك، مرتّب وواضح قدامك
          </h1>
          <p className="max-w-[46ch] text-white/75 text-[1.08rem] mt-5">
            عصرونية النسيم بتجمعلك أدوات المطبخ اليدوية والكهربائيات المنزلية بمكان واحد — تصفح الأصناف والأسعار قبل ما تجي عالمحل.
          </p>
          <div className="flex gap-4 mt-9 flex-wrap">
            <Link href="/menu" className="px-7 py-3.5 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light">
              تصفح القائمة
            </Link>
            <Link href="/contact" className="px-7 py-3.5 font-bold rounded-sm border border-white/35 hover:border-brass hover:text-brass">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="mb-11">
            <h2 className="font-[Cairo] font-extrabold text-[1.6rem] md:text-[2.2rem]">الأقسام</h2>
            <p className="text-text-mute max-w-[42ch] mt-2">ثلاث فئات رئيسية بتغطي احتياجات مطبخك من الأدوات اليدوية للأجهزة الكهربائية.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { n: "01", cat: "hand-tools", title: "أدوات مطبخ يدوية", desc: "سكاكين، أواني، أدوات تقطيع وتحضير" },
              { n: "02", cat: "kitchen-electrics", title: "كهربائيات المطبخ", desc: "خلاطات، عصارات، محضرات طعام" },
              { n: "03", cat: "home-appliances", title: "أجهزة منزلية عامة", desc: "مكواة، مروحة، وأجهزة كهربائية أخرى" },
            ].map((c) => (
              <Link
                key={c.cat}
                href={`/menu?cat=${c.cat}`}
                className="bg-ink text-text-light p-8 rounded-sm min-h-[190px] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="text-brass font-[Cairo] font-black">{c.n}</div>
                  <h3 className="text-[1.25rem] mt-3.5">{c.title}</h3>
                </div>
                <span className="text-white/60 text-sm mt-1.5 block">{c.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-paper-2">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <h2 className="font-[Cairo] font-extrabold text-[1.6rem] md:text-[2.2rem]">أحدث الأصناف</h2>
              <p className="text-text-mute max-w-[42ch] mt-2">آخر الأصناف اللي انضافت عالقائمة.</p>
            </div>
            <Link href="/menu" className="px-7 py-3.5 font-bold rounded-sm border border-ink text-ink hover:bg-ink hover:text-text-light">
              كل الأصناف
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-text-mute">ما في أصناف مضافة لهلق — ضيفهم من لوحة التحكم.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-brass text-ink py-14 text-center">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="font-[Cairo] font-extrabold text-[1.5rem] md:text-[2rem]">دورك عالقائمة قبل ما تزورنا</h2>
          <p className="mt-2.5 text-ink/75">شوف كل الأصناف والأسعار مرتبة حسب القسم</p>
          <Link href="/menu" className="inline-block mt-6 px-7 py-3.5 font-bold rounded-sm bg-ink text-text-light">
            تصفح القائمة الكاملة
          </Link>
        </div>
      </section>
    </main>
  );
}
