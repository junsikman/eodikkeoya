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

## 착장 정보 자동 수집

`.github/workflows/collect-finds.yml`이 매일 새벽 5시쯤 `scripts/collect-finds.mjs`를 실행해요.
등록된 프로그램 이름으로 "○○ 착용", "○○ 옷 브랜드"를 네이버 뉴스·블로그에서 찾고, 올라마(무료 AI)가 글에 적힌 출연자·브랜드·상품명을 뽑아 **제보함**에 "자동 수집"으로 넣어요. 사이트에 바로 올라가지 않아요.

- AI가 뽑은 브랜드·상품명이 실제 글에 없으면 버려요(지어낸 정보 막기). 이미 등록된 아이템도 건너뛰어요.
- 제보함에서 "이 제보로 아이템 등록"을 누르면 브랜드·상품명·인물·회차가 채워져요. 출처 글을 열어 맞는지 확인하고 구매 링크를 넣어 등록하세요. 틀린 건 "틀림·버리기"로 지워요.
- 더 찾고 싶은 검색어는 `scripts/collect-queries.txt`에 한 줄씩 넣어요.

설정

1. Supabase SQL Editor에서 `supabase/006_auto_finds.sql`을 실행해요.
2. 네이버 검색 API는 2026년에 [네이버 클라우드 플랫폼](https://console.ncloud.com) NAVER API HUB로 옮겨졌어요. 콘솔에서 NAVER API HUB 이용 신청 → 앱 등록(블로그 검색·뉴스 검색 선택) → 인증 정보에서 Client ID / Client Secret을 확인해요.
3. 저장소 Settings → Secrets and variables → Actions에 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`을 넣어요.
4. Actions 탭의 "착장 정보 자동 수집"에서 Run workflow로 바로 실행해 볼 수 있어요.

내 컴퓨터에서 더 큰 모델로 돌리기: [올라마](https://ollama.com)를 설치하고, 저장소 폴더에서 비밀값 4개를 환경변수로 넣은 뒤 `node scripts/collect-finds.mjs`를 실행해요. 기본 모델은 `qwen2.5:7b`이고(없으면 자동으로 받아요), `DRY_RUN=1`을 붙이면 저장하지 않고 결과만 보여줘요.
