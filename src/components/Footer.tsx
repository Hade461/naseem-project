import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-20">
      <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div>
          <h3 className="text-text-light text-base mb-3">النسيم</h3>
          <p className="text-sm">محل أدوات مطبخ وكهربائيات منزلية. هالموقع للعرض فقط، الشراء يتم داخل المحل.</p>
        </div>
        <div>
          <h3 className="text-text-light text-base mb-3">روابط</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-brass">الرئيسية</Link></li>
            <li><Link href="/menu" className="hover:text-brass">القائمة</Link></li>
            <li><Link href="/contact" className="hover:text-brass">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-text-light text-base mb-3">تواصل</h3>
          <ul className="space-y-2 text-sm">
            <li>الهاتف: (بيتم تحديده)</li>
            <li>العنوان: (بيتم تحديده)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/45">
        © 2026 النسيم — جميع الحقوق محفوظة · <Link href="/admin/login" className="hover:text-brass">دخول الإدارة</Link>
      </div>
    </footer>
  );
}
