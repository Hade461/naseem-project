import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import { Product } from "@/lib/types";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false });

  return (
    <AdminShell
      email={user?.email ?? ""}
      initialProducts={(products ?? []) as Product[]}
      initialMessages={messages ?? []}
    />
  );
}
