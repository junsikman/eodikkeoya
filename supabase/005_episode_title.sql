-- 회차 칸에 영상 제목도 넣을 수 있게 제보의 회차 글자 수 제한을 30자 → 100자로 늘려요.
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요.
alter table public.reports drop constraint if exists reports_ep_check;
alter table public.reports add constraint reports_ep_check check (char_length(ep) <= 100);
