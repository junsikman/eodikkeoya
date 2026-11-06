-- 008: 프로그램 없는 아이템(행사·화보·SNS 등)에도 플랫폼 붙이기
-- 수파베이스 → SQL Editor에 통째로 붙여 넣고 Run 한 번 누르면 돼요.
-- 프로그램이 있는 아이템은 지금처럼 프로그램의 플랫폼을 써요. 이 칸은 프로그램이 없을 때만 써요.

alter table public.items add column if not exists platform text
  check (platform is null or char_length(platform) between 1 and 40);

-- 김지원 듀베티카 패딩: 브랜드 행사 → 행사·포토콜
update public.items
   set platform = '행사·포토콜'
 where id = 'ff8002fa-6b3e-4e66-9a8d-8828b4b5ed7d';
