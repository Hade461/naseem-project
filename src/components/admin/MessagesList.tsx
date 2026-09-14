"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  name: string;
  phone: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
  const supabase = createClient();
  const [messages, setMessages] = useState(initialMessages);

  async function handleDelete(id: string) {
    if (!confirm("متأكد بدك تحذف هالرسالة؟")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) setMessages(messages.filter((m) => m.id !== id));
  }

  if (messages.length === 0) {
    return <p className="text-text-mute">ما في رسائل لهلق.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="bg-paper-2 border border-line rounded-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="font-bold">{m.name} — <span className="font-normal text-text-mute">{m.phone}</span></div>
            <div className="text-xs text-text-mute">
              {new Date(m.created_at).toLocaleString("ar-EG")}
            </div>
          </div>
          {m.subject && <div className="text-sm text-brass-dim font-semibold mb-1.5">{m.subject}</div>}
          <p className="text-sm">{m.message}</p>
          <button onClick={() => handleDelete(m.id)} className="text-[#8a3b2f] text-sm font-semibold mt-3">حذف</button>
        </div>
      ))}
    </div>
  );
}
