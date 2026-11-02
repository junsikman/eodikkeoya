-- 착장 정보 자동 수집: 수집한 후보를 제보함에 "자동 수집"으로 넣어요.
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.

-- 1) 제보에 새 칸: 출처(방문자/자동 수집), 브랜드, 상품명, 중복 방지 키
alter table public.reports
  add column if not exists source text not null default 'user',
  add column if not exists brand text not null default '',
  add column if not exists name text not null default '',
  add column if not exists auto_key text;

alter table public.reports drop constraint if exists reports_source_check;
alter table public.reports add constraint reports_source_check check (source in ('user', 'auto'));
alter table public.reports drop constraint if exists reports_brand_check;
alter table public.reports add constraint reports_brand_check check (char_length(brand) <= 60);
alter table public.reports drop constraint if exists reports_name_check;
alter table public.reports add constraint reports_name_check check (char_length(name) <= 120);
create unique index if not exists reports_auto_key on public.reports (auto_key);

-- 2) 이미 읽은 글 목록 (같은 글을 매일 다시 읽지 않게). 수집 프로그램만 쓰고, 사이트에서는 보이지 않아요.
create table if not exists public.auto_seen (
  link text primary key,
  seen_at timestamptz not null default now()
);
alter table public.auto_seen enable row level security;

-- 3) 제보 스팸 막기 규칙 수정
--    수집 프로그램(비밀 키)이 넣는 건 규칙을 건너뛰고,
--    방문자가 보내는 제보는 "자동 수집"으로 꾸밀 수 없게 막아요.
create or replace function public.reports_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role'
     or coalesce(current_setting('role', true), '') = 'service_role' then
    new.created_at := now();
    return new;
  end if;

  new.source := 'user';
  new.brand := '';
  new.name := '';
  new.auto_key := null;

  if exists (
    select 1 from public.reports
    where lower(show) = lower(new.show)
      and lower(descr) = lower(new.descr)
      and created_at > now() - interval '1 day'
  ) then
    raise exception 'duplicate report' using errcode = 'P0001';
  end if;

  if (select count(*) from public.reports where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'report rate limit' using errcode = 'P0001';
  end if;

  new.created_at := now();
  return new;
end
$$;

drop trigger if exists reports_guard on public.reports;
create trigger reports_guard before insert on public.reports
  for each row execute function public.reports_guard();
