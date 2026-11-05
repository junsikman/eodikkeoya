-- 007: 프로그램 없이도 아이템 등록 (브랜드 행사·화보·SNS 등)
-- 수파베이스 → SQL Editor에 통째로 붙여 넣고 Run 한 번 누르면 돼요.

-- 1) 아이템의 프로그램 칸을 비워 둘 수 있게
alter table public.items alter column show_id drop not null;

-- 2) 김지원 듀베티카 패딩: 임시로 만든 '광고행사' 프로그램을 빼고, 상황을 적어 두기
update public.items
   set show_id = null,
       ep = '듀베티카 브랜드 행사'
 where id = 'ff8002fa-6b3e-4e66-9a8d-8828b4b5ed7d';

-- 3) 이제 쓰는 아이템이 없는 '광고행사' 프로그램 지우기
delete from public.shows s
 where s.id = '981c9714-1568-40bc-8bd8-de6dbebef3de'
   and not exists (select 1 from public.items i where i.show_id = s.id);
