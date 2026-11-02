-- 가격 자동 확인용 칸 추가
-- 수파베이스 SQL Editor에 붙여 넣고 Run 하세요. 여러 번 실행해도 괜찮아요.

alter table public.items
  add column if not exists list_price integer check (list_price is null or list_price >= 0),
  add column if not exists coupon_price integer check (coupon_price is null or coupon_price >= 0),
  add column if not exists price_checked_at timestamptz,
  add column if not exists price_check_failed boolean not null default false;
