-- ============================================================
-- نسخ هالكود كامل والصقه بـ Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- جدول الأصناف
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('hand-tools', 'kitchen-electrics', 'home-appliances')),
  price numeric not null check (price >= 0),
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- جدول رسائل التواصل
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- تفعيل Row Level Security
alter table products enable row level security;
alter table messages enable row level security;

-- الأصناف: أي زائر يقدر يشوفها (SELECT عام)
create policy "products are publicly readable"
  on products for select
  using (true);

-- الأصناف: بس المستخدم المسجل دخول (الأدمن) يقدر يضيف/يعدل/يحذف
create policy "authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

-- الرسائل: أي زائر يقدر يرسل رسالة (INSERT عام) بس ما يقدر يقراها
create policy "anyone can send a message"
  on messages for insert
  to anon, authenticated
  with check (true);

-- الرسائل: بس المستخدم المسجل دخول (الأدمن) يقدر يقراها ويحذفها
create policy "authenticated users can read messages"
  on messages for select
  to authenticated
  using (true);

create policy "authenticated users can delete messages"
  on messages for delete
  to authenticated
  using (true);

-- ============================================================
-- تخزين الصور (Storage)
-- بعد تشغيل الكود اللي فوق، روح لـ Storage من القائمة الجانبية
-- وسوي Bucket جديد اسمه بالظبط: product-images
-- وفعّل عليه "Public bucket" حتى الصور تظهر بالموقع.
-- بعدين نفذ الكود التالي حتى تضبط صلاحيات الرفع:
-- ============================================================

create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
