-- 제보 스팸 막기
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.
--  - 같은 프로그램·같은 내용의 제보는 하루에 한 번만 받아요
--  - 전체 제보는 10분에 30개까지만 받아요 (봇이 몰려와도 제보함이 넘치지 않게)

create or replace function public.reports_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
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
