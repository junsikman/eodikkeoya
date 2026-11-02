# 어디꺼야?

방송·유튜브에 나온 아이템이 어디 거인지 찾고, 제보하는 사이트예요.

- 사이트: `index.html` + `app.js` (빌드 없이 GitHub Pages에서 바로 열려요)
- 데이터·제보·관리자 로그인·이미지: Supabase
- 관리자 화면: 사이트 주소 뒤에 `#admin` (하단 "관리자" 링크)

## 처음 설정

1. Supabase SQL Editor에서 `supabase/setup.sql`을 실행해요. 파일 안의 `ADMIN_EMAIL@example.com`을 관리자 이메일로 바꿔서 실행하세요.
2. Supabase Authentication의 URL 설정에서 Site URL과 Redirect URL에 GitHub Pages 주소를 넣어요.
3. GitHub 저장소 Settings → Pages에서 `main` 브랜치의 루트(`/`)로 배포해요.

## 가격 자동 확인

`.github/workflows/update-prices.yml`이 매일 새벽 4시쯤 `scripts/update-prices.mjs`를 실행해서, 구매 링크가 W컨셉인 아이템의 정가·판매가·쿠폰 적용가를 다시 읽어 저장해요.

1. Supabase SQL Editor에서 `supabase/002_price_check.sql`을 실행해요.
2. 저장소 Settings → Secrets and variables → Actions에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 넣어요.
3. Actions 탭의 "가격 자동 확인"에서 Run workflow로 바로 실행해 볼 수 있어요.

가격을 못 읽은 아이템은 관리자 화면에 "가격 확인 실패"로 표시되고, 가격은 그대로 남아요.

`app.js`에 들어 있는 Supabase 키는 공개용(publishable) 키예요. 데이터 권한은 Supabase 보안 규칙(RLS)이 지켜요. service_role / secret 키는 절대 이 저장소에 넣지 마세요.
