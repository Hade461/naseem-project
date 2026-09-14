"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !phone || !message) {
    redirect("/contact?error=1");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({ name, phone, subject, message });

  if (error) {
    redirect("/contact?error=1");
  }

  redirect("/contact?sent=1");
}
