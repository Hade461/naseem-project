"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, Category, Product, categoryLabel } from "@/lib/types";

function emptyForm(category: Category) {
  return { id: "", name: "", category, price: "", in_stock: true };
}

export default function ProductsManager({
  category,
  products,
  onChanged,
}: {
  category: Category;
  products: Product[];
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState(emptyForm(category));
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const scoped = products.filter((p) => p.category === category);
  const inStockCount = scoped.filter((p) => p.in_stock).length;

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm(category));
    setFile(null);
    setErr(null);
    setShowForm(true);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({ id: p.id, name: p.name, category: p.category, price: String(p.price), in_stock: p.in_stock });
    setFile(null);
    setErr(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm(category));
    setFile(null);
    setErr(null);
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

    onChanged();
    cancelForm();
    setBusy(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("متأكد بدك تحذف هالصنف؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setErr("صار خطأ بالحذف: " + error.message);
      return;
    }
    onChanged();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <h2 className="text-xl font-bold">{categoryLabel(category)}</h2>
          <p className="text-text-mute text-sm mt-1">
            {scoped.length} صنف بهالقسم · {inStockCount} متوفر حالياً
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startAdd}
            className="px-5 py-2.5 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light text-sm"
          >
            + إضافة صنف
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-paper border border-line rounded-md p-6 mb-8">
          <h3 className="font-bold text-base mb-5">{editingId ? "تعديل صنف" : `إضافة صنف — ${categoryLabel(category)}`}</h3>

          {err && (
            <p className="mb-4 text-sm font-semibold text-[#8a3b2f] bg-[#f3e2de] border border-[#e0c2ba] rounded-sm p-3">{err}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">اسم الصنف</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border border-line rounded-sm bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">القسم</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full p-3 border border-line rounded-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">السعر ($)</label>
              <input
                type="number" step="0.01" min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 border border-line rounded-sm bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">صورة الصنف</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full p-2.5 border border-line rounded-sm bg-white text-sm"
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
            <button type="submit" disabled={busy} className="px-6 py-3 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light disabled:opacity-60 text-sm">
              {busy ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة الصنف"}
            </button>
            <button type="button" onClick={cancelForm} className="px-6 py-3 font-bold rounded-sm border border-line text-sm">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {err && !showForm && (
        <p className="mb-5 text-sm font-semibold text-[#8a3b2f] bg-[#f3e2de] border border-[#e0c2ba] rounded-sm p-3">{err}</p>
      )}

      {scoped.length === 0 ? (
        <div className="border border-dashed border-line rounded-md p-10 text-center text-text-mute text-sm">
          ما في أصناف بهالقسم لهلق. ابدأ بإضافة أول صنف.
        </div>
      ) : (
        <div className="border border-line rounded-md overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm border-collapse">
            <thead>
              <tr className="text-right bg-paper-2 text-text-mute">
                <th className="py-3 px-4 font-semibold">الصنف</th>
                <th className="py-3 px-4 font-semibold">السعر</th>
                <th className="py-3 px-4 font-semibold">الحالة</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {scoped.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="py-3 px-4 font-semibold flex items-center gap-2.5">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="w-9 h-9 rounded-sm object-cover" />
                    ) : (
                      <span className="w-9 h-9 rounded-sm bg-paper-2 flex items-center justify-center">🧺</span>
                    )}
                    {p.name}
                  </td>
                  <td className="py-3 px-4">{p.price}$</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${p.in_stock ? "bg-[#e4ecdf] text-[#4a6b48]" : "bg-[#f3e2de] text-[#8a3b2f]"}`}>
                      {p.in_stock ? "متوفر" : "غير متوفر"}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-left">
                    <button onClick={() => startEdit(p)} className="text-brass-dim font-semibold ml-4 hover:underline">تعديل</button>
                    <button onClick={() => handleDelete(p.id)} className="text-[#8a3b2f] font-semibold hover:underline">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
