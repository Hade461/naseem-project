"use client";

import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  name: string;
  phone: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default function MessagesList({
  messages,
  onChanged,
}: {
  messages: Message[];
  onChanged: () => void;
}) {
  const supabase = createClient();

  async function handleDelete(id: string) {
    if (!confirm("متأكد بدك تحذف هالرسالة؟")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) onChanged();
  }

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold">الرسائل</h2>
        <p className="text-text-mute text-sm mt-1">{messages.length} رسالة وصلت من صفحة تواصل معنا</p>
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-line rounded-md p-10 text-center text-text-mute text-sm">
          ما في رسائل لهلق.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-paper border border-line rounded-md p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink text-brass flex items-center justify-center font-bold shrink-0">
                    {m.name.trim().charAt(0) || "؟"}
                  </div>
                  <div>
                    <div className="font-bold">{m.name}</div>
                    <div className="text-text-mute text-xs mt-0.5">{m.phone}</div>
                  </div>
                </div>
                <div className="text-xs text-text-mute whitespace-nowrap">
                  {new Date(m.created_at).toLocaleString("ar-EG")}
                </div>
              </div>

              {m.subject && (
                <div className="inline-block mt-3 text-xs font-semibold text-brass-dim bg-paper-2 px-2.5 py-1 rounded-full">
                  {m.subject}
                </div>
              )}
              <p className="text-sm mt-3 leading-relaxed">{m.message}</p>

              <button onClick={() => handleDelete(m.id)} className="text-[#8a3b2f] text-xs font-semibold mt-4 hover:underline">
                حذف الرسالة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
