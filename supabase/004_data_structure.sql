-- 데이터 구조 보강: 인물 목록, 확인 상태, 장면 시간, 추가 구매처
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.
-- 기존 아이템의 인물 이름은 자동으로 인물 목록으로 옮겨져요.

-- 1) 인물 목록
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  name_key text generated always as (lower(regexp_replace(name, '\s', '', 'g'))) stored,
  created_at timestamptz not null default now()
);
create unique index if not exists people_name_key on public.people (name_key);

alter table public.people enable row level security;
drop policy if exists "people: anyone reads" on public.people;
drop policy if exists "people: admin writes" on public.people;
create policy "people: anyone reads" on public.people for select using (true);
create policy "people: admin writes" on public.people for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
grant select on public.people to anon, authenticated;
grant insert, update, delete on public.people to authenticated;

-- 2) 아이템에 새 칸
alter table public.items
  add column if not exists person_id uuid references public.people(id) on delete restrict,
  add column if not exists verify text not null default 'guess',
  add column if not exists scene_time text not null default '',
  add column if not exists links jsonb not null default '[]'::jsonb;

alter table public.items drop constraint if exists items_verify_check;
alter table public.items add constraint items_verify_check check (verify in ('official', 'similar', 'guess'));
alter table public.items drop constraint if exists items_scene_time_check;
alter table public.items add constraint items_scene_time_check check (char_length(scene_time) <= 20);
alter table public.items drop constraint if exists items_links_check;
alter table public.items add constraint items_links_check check (jsonb_typeof(links) = 'array' and jsonb_array_length(links) <= 6);

-- 3) 기존 인물 이름 옮기기 (띄어쓰기만 다른 이름은 하나로 합쳐져요)
insert into public.people (name)
select distinct on (lower(regexp_replace(trim(person), '\s', '', 'g'))) trim(person)
from public.items
where trim(coalesce(person, '')) <> ''
order by lower(regexp_replace(trim(person), '\s', '', 'g')), created_at
on conflict (name_key) do nothing;

update public.items i
set person_id = p.id, person = p.name
from public.people p
where i.person_id is null
  and p.name_key = lower(regexp_replace(trim(i.person), '\s', '', 'g'));

-- 4) 대표 구매 링크가 제휴 링크인지 표시
alter table public.items add column if not exists buy_affiliate boolean not null default false;
