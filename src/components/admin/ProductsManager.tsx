"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, Category, Product, categoryLabel } from "@/lib/types";

export default function ProductsManager({
  initialProducts,
  categoryFilter,
}: {
  initialProducts: Product[];
  categoryFilter?: Category;
}) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const emptyForm = { id: "", name: "", category: categoryFilter ?? ("hand-tools" as Category), price: "", in_stock: true };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const visibleProducts = categoryFilter ? products.filter((p) => p.category === categoryFilter) : products;

  async function refresh() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({ id: p.id, name: p.name, category: p.category, price: String(p.price), in_stock: p.in_stock });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  }

  async function uploadImage(): Promise<string | null> {
    if (!file) return null;
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) {
      setErr("صار خطأ برفع الصورة: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim() || !form.price) {
      setErr("لازم تعبي اسم الصنف والسعر");
      return;
    }
    setBusy(true);

    const image_url = file ? await uploadImage() : undefined;

    if (editingId) {
      const update: Partial<Product> = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        in_stock: form.in_stock,
      };
      if (image_url) update.image_url = image_url;
      const { error } = await supabase.from("products").update(update).eq("id", editingId);
      if (error) setErr("صار خطأ بالتعديل: " + error.message);
    } else {
      const { error } = await supabase.from("products").insert({
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        in_stock: form.in_stock,
        image_url: image_url ?? null,
      });
      if (error) setErr("صار خطأ بالإضافة: " + error.message);
    }

    await refresh();
    cancelEdit();
    setBusy(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("متأكد بدك تحذف هالصنف؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setErr("صار خطأ بالحذف: " + error.message);
      return;
    }
    await refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-paper-2 border border-line rounded-sm p-6 mb-10">
        <h3 className="font-bold text-lg mb-5">{editingId ? "تعديل صنف" : "إضافة صنف جديد"}</h3>

        {err && (
          <p className="mb-4 text-sm font-semibold text-[#8a3b2f] bg-[#f3e2de] border border-[#e0c2ba] rounded-sm p-3">{err}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">اسم الصنف</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-line rounded-sm bg-paper"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">القسم</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full p-3 border border-line rounded-sm bg-paper"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">السعر (ل.س)</label>
            <input
              type="number" step="1" min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border border-line rounded-sm bg-paper"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">صورة الصنف</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full p-2.5 border border-line rounded-sm bg-paper text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 mb-5 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.in_stock}
            onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
          />
          متوفر حالياً
        </label>

        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="px-6 py-3 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light disabled:opacity-60">
            {busy ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة الصنف"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-6 py-3 font-bold rounded-sm border border-line">
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-right border-b border-line text-text-mute">
              <th className="py-3 pl-3">الصنف</th>
              <th className="py-3 pl-3">القسم</th>
              <th className="py-3 pl-3">السعر</th>
              <th className="py-3 pl-3">الحالة</th>
              <th className="py-3 pl-3"></th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p.id} className="border-b border-line">
                <td className="py-3 pl-3 font-semibold flex items-center gap-2.5">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" className="w-9 h-9 rounded-sm object-cover" />
                  ) : (
                    <span className="w-9 h-9 rounded-sm bg-paper-2 flex items-center justify-center text-[10px] font-[Cairo] font-bold text-line">ن</span>
                  )}
                  {p.name}
                </td>
                <td className="py-3 pl-3">{categoryLabel(p.category)}</td>
                <td className="py-3 pl-3">{p.price.toLocaleString("en-US")} ل.س</td>
                <td className="py-3 pl-3">
                  <span className={p.in_stock ? "text-[#4a6b48]" : "text-[#8a3b2f]"}>
                    {p.in_stock ? "متوفر" : "غير متوفر"}
                  </span>
                </td>
                <td className="py-3 pl-3 whitespace-nowrap">
                  <button onClick={() => startEdit(p)} className="text-brass-dim font-semibold ml-4">تعديل</button>
                  <button onClick={() => handleDelete(p.id)} className="text-[#8a3b2f] font-semibold">حذف</button>
                </td>
              </tr>
            ))}
            {visibleProducts.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-text-mute">ما في أصناف مضافة بهالقسم لهلق.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
