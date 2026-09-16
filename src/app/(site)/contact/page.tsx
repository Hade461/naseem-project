import { submitMessage } from "./actions";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main>
      <section className="bg-ink text-text-light py-16">
        <div className="max-w-[1120px] mx-auto px-6">
          <h1 className="font-[Cairo] font-black text-[2rem] md:text-[2.6rem]">تواصل معنا</h1>
          <p className="text-white/70 mt-3 max-w-[50ch]">عندك سؤال عن صنف أو توفره؟ راسلنا أو مر علينا بالمحل.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-14 items-start">
          <div>
            <h3 className="text-[1.2rem] mb-4.5 font-bold">معلومات التواصل</h3>
            {[
              { ic: "📍", t: "العنوان", d: "(بيتم تحديد عنوان المحل هون)" },
              { ic: "📞", t: "الهاتف", d: "(بيتم تحديد رقم الهاتف هون)" },
              { ic: "🕒", t: "أوقات الدوام", d: "يومياً من 9 صباحاً حتى 9 مساءً" },
              { ic: "✉️", t: "البريد الإلكتروني", d: "(بيتم تحديده هون)" },
            ].map((it) => (
              <div key={it.t} className="flex gap-3.5 py-4 border-b border-line">
                <div className="w-9.5 h-9.5 rounded-full bg-ink text-brass flex items-center justify-center shrink-0">{it.ic}</div>
                <div>
                  <h4 className="text-[.95rem] font-bold">{it.t}</h4>
                  <p className="text-text-mute text-sm mt-0.5">{it.d}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 border border-line rounded-sm aspect-video bg-paper-2 flex items-center justify-center text-text-mute text-sm text-center p-5">
              خريطة موقع المحل (تنحط هون لاحقاً)
            </div>
          </div>

          <div className="bg-paper-2 border border-line rounded-sm p-8">
            <h3 className="text-[1.2rem] font-bold mb-5.5">ارسلنا رسالة</h3>

            {params.sent === "1" && (
              <p className="mb-5 text-sm font-semibold text-[#4a6b48] bg-[#e4ecdf] border border-[#c8d8c1] rounded-sm p-3">
                تم استلام رسالتك، رح نتواصل معك قريباً.
              </p>
            )}
            {params.error === "1" && (
              <p className="mb-5 text-sm font-semibold text-[#8a3b2f] bg-[#f3e2de] border border-[#e0c2ba] rounded-sm p-3">
                في مشكلة بإرسال الرسالة، جرب مرة ثانية.
              </p>
            )}

            <form action={submitMessage}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4.5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-1.5">الاسم</label>
                  <input id="name" name="name" type="text" required className="w-full p-3 border border-line rounded-sm bg-paper" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-1.5">رقم الهاتف</label>
                  <input id="phone" name="phone" type="tel" required className="w-full p-3 border border-line rounded-sm bg-paper" />
                </div>
              </div>
              <div className="mb-4.5">
                <label htmlFor="subject" className="block text-sm font-semibold mb-1.5">الموضوع</label>
                <select id="subject" name="subject" className="w-full p-3 border border-line rounded-sm bg-paper">
                  <option>استفسار عن صنف</option>
                  <option>استفسار عن التوفر</option>
                  <option>ملاحظة عامة</option>
                </select>
              </div>
              <div className="mb-4.5">
                <label htmlFor="message" className="block text-sm font-semibold mb-1.5">الرسالة</label>
                <textarea id="message" name="message" required className="w-full p-3 border border-line rounded-sm bg-paper min-h-[120px]" />
              </div>
              <button type="submit" className="px-7 py-3.5 font-bold rounded-sm bg-brass text-ink hover:bg-brass-light">
                إرسال
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
