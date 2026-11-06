-- 009: 대표 구매 링크의 판매처 이름(하프클럽, 네이버 스마트스토어 …)을 직접 적어 두는 칸
-- 수파베이스 → SQL Editor에 통째로 붙여 넣고 Run 한 번 누르면 돼요.
-- 비워 두면 지금처럼 링크 주소를 보고 판매처 이름을 정해요.

alter table public.items add column if not exists buy_shop text
  check (buy_shop is null or char_length(buy_shop) between 1 and 20);

notify pgrst, 'reload schema';
