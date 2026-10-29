-- 어디꺼야? 수파베이스 설정
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.
-- 아래 'ADMIN_EMAIL@example.com'을 관리자 이메일로 바꿔서 실행하세요.

create extension if not exists pgcrypto;

-- 관리자 판별: 로그인한 사람의 이메일이 관리자 이메일인지
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(lower(auth.jwt() ->> 'email') = lower('ADMIN_EMAIL@example.com'), false)
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 프로그램
create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  platform text not null default '',
  ep text not null default '',
  poster_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 아이템(착장)
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  brand text not null check (char_length(brand) between 1 and 60),
  name text not null check (char_length(name) between 1 and 120),
  cat text not null,
  price integer check (price is null or price >= 0),
  person text not null check (char_length(person) between 1 and 40),
  show_id uuid not null references public.shows(id) on delete restrict,
  ep text not null default '',
  scene text not null default '',
  buy_url text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 제보: 누구나 보낼 수 있고, 관리자만 볼 수 있어요
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  show text not null check (char_length(show) between 1 and 80),
  ep text not null default '' check (char_length(ep) <= 30),
  who text not null default '' check (char_length(who) <= 40),
  cat text not null default '' check (char_length(cat) <= 20),
  descr text not null check (char_length(descr) between 1 and 600),
  link text not null default '' check (char_length(link) <= 400),
  created_at timestamptz not null default now()
);

alter table public.shows enable row level security;
alter table public.items enable row level security;
alter table public.reports enable row level security;

drop policy if exists "shows: anyone reads" on public.shows;
drop policy if exists "shows: admin writes" on public.shows;
create policy "shows: anyone reads" on public.shows for select using (true);
create policy "shows: admin writes" on public.shows for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "items: anyone reads" on public.items;
drop policy if exists "items: admin writes" on public.items;
create policy "items: anyone reads" on public.items for select using (true);
create policy "items: admin writes" on public.items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports: anyone sends" on public.reports;
drop policy if exists "reports: admin reads" on public.reports;
drop policy if exists "reports: admin deletes" on public.reports;
create policy "reports: anyone sends" on public.reports for insert to anon, authenticated with check (true);
create policy "reports: admin reads" on public.reports for select to authenticated using (public.is_admin());
create policy "reports: admin deletes" on public.reports for delete to authenticated using (public.is_admin());

grant select on public.shows, public.items to anon, authenticated;
grant insert, update, delete on public.shows, public.items to authenticated;
grant insert on public.reports to anon, authenticated;
grant select, delete on public.reports to authenticated;

-- 상품·포스터 이미지 저장 공간 (보기는 누구나, 올리기는 관리자만)
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images: anyone reads" on storage.objects;
drop policy if exists "images: admin uploads" on storage.objects;
drop policy if exists "images: admin updates" on storage.objects;
drop policy if exists "images: admin deletes" on storage.objects;
create policy "images: anyone reads" on storage.objects for select using (bucket_id = 'images');
create policy "images: admin uploads" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());
create policy "images: admin updates" on storage.objects for update to authenticated
  using (bucket_id = 'images' and public.is_admin());
create policy "images: admin deletes" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());
