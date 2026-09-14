import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardTabs from "@/components/admin/DashboardTabs";
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
    <main className="min-h-screen bg-paper">
      <AdminHeader email={user?.email ?? ""} />
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        <DashboardTabs products={(products ?? []) as Product[]} messages={messages ?? []} />
      </div>
    </main>
  );
}
