import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-[380px] bg-paper rounded-sm p-9">
        <h1 className="font-[Cairo] font-black text-xl mb-1.5">دخول لوحة التحكم</h1>
        <p className="text-text-mute text-sm mb-7">النسيم — أدوات مطبخ وكهربائيات</p>

        {params.error === "1" && (
          <p className="mb-5 text-sm font-semibold text-[#8a3b2f] bg-[#f3e2de] border border-[#e0c2ba] rounded-sm p-3">
            الإيميل أو كلمة السر غلط.
          </p>
        )}

        <form action={login}>
          <div className="mb-4.5">
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5">الإيميل</label>
            <input id="email" name="email" type="email" required className="w-full p-3 border border-line rounded-sm bg-white" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5">كلمة السر</label>
            <input id="password" name="password" type="password" required className="w-full p-3 border border-line rounded-sm bg-white" />
          </div>
          <button type="submit" className="w-full px-7 py-3.5 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light">
            دخول
          </button>
        </form>
      </div>
    </main>
  );
}
