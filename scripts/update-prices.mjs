// 등록된 아이템의 구매 링크를 열어 판매처 가격을 읽고 수파베이스에 저장해요.
// 깃허브 자동 작업(.github/workflows/update-prices.yml)이 하루 한 번 실행해요.
// 필요한 비밀값: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (저장소 Settings → Secrets에만 넣으세요)

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!SUPABASE_URL || !KEY) {
  console.error("SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 비밀값이 없어요.");
  process.exit(1);
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const toInt = v => {
  const n = Math.round(Math.abs(parseFloat(String(v).replace(/,/g, ""))));
  return Number.isFinite(n) && n > 0 ? n : null;
};

async function db(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`수파베이스 ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// ---- 판매처별 가격 읽기 ----
// 반환: { list: 정가, sale: 판매가, coupon: 쿠폰 적용 최대 혜택가 } (모르면 null)

function pick(seg, key) {
  const m = seg.match(new RegExp(`"${key}"\\s*:\\s*"?(-?[\\d.,]+)`));
  return m ? toInt(m[1]) : null;
}

async function wconcept(url) {
  const id = (url.match(/\/Product\/(\d+)/i) || [])[1];
  if (!id) throw new Error("상품 번호를 찾지 못했어요");
  const res = await fetch(`https://www.wconcept.co.kr/Product/${id}`, {
    headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`W컨셉 응답 ${res.status}`);
  const html = await res.text();
  // 상품 페이지 안의 분석용 데이터: original_price(정가), af_sale_price(판매가), display_price(쿠폰 적용가)
  // 추천 상품 데이터와 섞이지 않게, 이 상품 번호(itemCd)가 들어 있는 구간만 봐요.
  const m = new RegExp(`"itemCd"\\s*:\\s*"?${id}\\b`).exec(html);
  const i = m ? m.index : -1;
  if (i < 0) throw new Error("가격 정보를 찾지 못했어요(페이지 구조가 바뀌었을 수 있어요)");
  const seg = html.slice(Math.max(0, i - 1500), i + 1500);
  const list = pick(seg, "original_price") ?? pick(seg, "af_price");
  const sale = pick(seg, "af_sale_price");
  const coupon = pick(seg, "display_price");
  if (!list && !sale) throw new Error("가격 숫자를 읽지 못했어요");
  return { list, sale: sale ?? list, coupon };
}

const SHOPS = [{ host: /(^|\.)wconcept\.co\.kr$/i, read: wconcept }];

// ---- 실행 ----
const items = await db("items?select=id,name,buy_url,price&buy_url=neq.", { headers: { Prefer: "" } });
let ok = 0, failed = 0, skipped = 0;

for (const it of items) {
  let host;
  try { host = new URL(it.buy_url).hostname; } catch { skipped++; continue; }
  const shop = SHOPS.find(s => s.host.test(host));
  if (!shop) { skipped++; continue; }

  try {
    const p = await shop.read(it.buy_url);
    const patch = {
      price: p.sale,
      list_price: p.list,
      coupon_price: p.coupon && p.coupon < (p.sale ?? Infinity) ? p.coupon : null,
      price_checked_at: new Date().toISOString(),
      price_check_failed: false,
    };
    await db(`items?id=eq.${it.id}`, { method: "PATCH", body: JSON.stringify(patch) });
    ok++;
    console.log(`확인 ${it.name}: 정가 ${p.list} / 판매가 ${p.sale} / 쿠폰가 ${p.coupon}`);
  } catch (e) {
    failed++;
    console.log(`실패 ${it.name}: ${e.message}`);
    try {
      await db(`items?id=eq.${it.id}`, { method: "PATCH", body: JSON.stringify({ price_check_failed: true }) });
    } catch (e2) { console.log(`  실패 표시도 저장하지 못했어요: ${e2.message}`); }
  }
  await sleep(3000); // 판매처에 부담을 주지 않도록 천천히
}

console.log(`끝: 확인 ${ok}개, 실패 ${failed}개, 지원 안 하는 판매처 ${skipped}개`);
