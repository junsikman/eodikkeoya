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

// 그 밖의 쇼핑몰: 페이지에 들어 있는 표준 상품 정보(JSON-LD, 상품 가격 태그)를 읽어요.
// 쇼핑몰이 자동 접속을 막으면(네이버 브랜드스토어·스마트스토어 등) 실패하고, 관리자가 넣은 가격을 그대로 둬요.
async function generic(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9", Accept: "text/html" }, redirect: "follow" });
  if (!res.ok) throw new Error(`응답 ${res.status}${res.status === 403 || res.status === 429 ? " (자동 접속을 막는 쇼핑몰이에요)" : ""}`);
  const html = await res.text();
  const nums = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = o => {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o)) return o.forEach(walk);
        const t = [].concat(o["@type"] || []);
        if (t.some(x => /Offer/i.test(x))) { const v = toInt(o.price ?? o.lowPrice); if (v) nums.push(v); }
        Object.values(o).forEach(walk);
      };
      walk(JSON.parse(m[1]));
    } catch {}
  }
  if (!nums.length) {
    const m = html.match(/<meta[^>]+(?:property|name|itemprop)=["'](?:product:price:amount|og:price:amount|price)["'][^>]*content=["']([\d.,]+)/i)
      || html.match(/<meta[^>]+content=["']([\d.,]+)["'][^>]*(?:property|name|itemprop)=["'](?:product:price:amount|og:price:amount|price)["']/i);
    if (m) { const v = toInt(m[1]); if (v) nums.push(v); }
  }
  if (!nums.length) throw new Error("페이지에서 가격 정보를 찾지 못했어요");
  const sale = Math.min(...nums);
  return { list: null, sale, coupon: null };
}

const SHOPS = [{ host: /(^|\.)wconcept\.co\.kr$/i, read: wconcept }];
async function readPrice(url) {
  const host = new URL(url).hostname;
  const shop = SHOPS.find(s => s.host.test(host));
  return (shop ? shop.read : generic)(url);
}

// ---- 실행 ----
const items = await db("items?select=id,name,buy_url,price,links", { headers: { Prefer: "" } });
let ok = 0, failed = 0;

for (const it of items) {
  const now = new Date().toISOString();
  const patch = {};

  // 대표 구매 링크
  if (/^https?:\/\//i.test(it.buy_url || "")) {
    try {
      const p = await readPrice(it.buy_url);
      Object.assign(patch, {
        price: p.sale, list_price: p.list,
        coupon_price: p.coupon && p.coupon < (p.sale ?? Infinity) ? p.coupon : null,
        price_checked_at: now, price_check_failed: false,
      });
      ok++; console.log(`확인 ${it.name} [대표]: 정가 ${p.list} / 판매가 ${p.sale} / 쿠폰가 ${p.coupon}`);
    } catch (e) {
      failed++; patch.price_check_failed = true;
      console.log(`실패 ${it.name} [대표]: ${e.message}`);
    }
    await sleep(3000); // 판매처에 부담을 주지 않도록 천천히
  }

  // 다른 구매처
  const links = Array.isArray(it.links) ? it.links.map(l => ({ ...l })) : [];
  let linksChanged = false;
  for (const l of links) {
    if (!/^https?:\/\//i.test(l?.url || "")) continue;
    try {
      const p = await readPrice(l.url);
      Object.assign(l, { price: p.sale, list: p.list, checked_at: now, failed: false, src: "auto" });
      ok++; console.log(`확인 ${it.name} [${l.shop || new URL(l.url).hostname}]: 판매가 ${p.sale}`);
    } catch (e) {
      l.failed = true;
      failed++; console.log(`실패 ${it.name} [${l.shop || new URL(l.url).hostname}]: ${e.message}`);
    }
    linksChanged = true;
    await sleep(3000);
  }
  if (linksChanged) patch.links = links;

  if (Object.keys(patch).length) {
    try { await db(`items?id=eq.${it.id}`, { method: "PATCH", body: JSON.stringify(patch) }); }
    catch (e) { console.log(`  저장하지 못했어요: ${e.message}`); }
  }
}

console.log(`끝: 가격 확인 ${ok}개, 실패 ${failed}개`);
