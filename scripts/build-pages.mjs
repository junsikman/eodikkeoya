// 사이트를 _site 폴더로 모으고, 검색·공유용 진짜 페이지와 sitemap.xml을 만들어요.
//   - 아이템:   item/<번호>/
//   - 인물:     people/<이름>/      (모음: people/)
//   - 프로그램: shows/<프로그램명>/  (모음: shows/)
//   - 분류:     category/<분류>/     (모음: category/)
// 깃허브 자동 작업(.github/workflows/deploy.yml)이 실행해요.
// 미리보기에서 돌릴 때만 SRC(사이트 파일 폴더)·OUT(결과 폴더)·SITE_URL을 바꿔요.
import { mkdir, writeFile, copyFile, readFile } from "node:fs/promises";
import { itemCard, groupCard, instaCard, renderOg } from "./og-images.mjs";

const BASE = (process.env.SITE_URL || "https://wherefrom.store").replace(/\/+$/, "");
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_KEY || "";
const SRC = (process.env.SRC || ".").replace(/\/+$/, "");
const OUT = process.env.OUT || "_site";
// 방문자 통계 코드는 app.js의 GOATCOUNTER 값을 그대로 써요
const GC = ((await readFile(`${SRC}/app.js`, "utf8")).match(/const GOATCOUNTER="([a-z0-9-]*)"/) || [])[1] || "";
const GC_TAG = GC ? `<script data-goatcounter="https://${GC}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
<script>document.addEventListener("click",function(e){var a=e.target.closest(".buys a");if(!a||!window.goatcounter||!goatcounter.count)return;goatcounter.count({path:"구매처 클릭: "+a.textContent.trim().split(/\\s/)[0]+" · "+document.querySelector("h1").textContent,event:true})});</script>` : "";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const won = n => (typeof n === "number" && isFinite(n) ? n.toLocaleString("ko-KR") + "원" : "");
const md = iso => { const d = new Date(iso); return isNaN(d) ? "" : `${d.getMonth() + 1}월 ${d.getDate()}일`; };
const day = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toISOString().slice(0, 10); };
const httpUrl = u => typeof u === "string" && /^https?:\/\//i.test(u);
const short = id => String(id).slice(0, 8);
const CATS = { top: "상의", outer: "아우터", bottom: "하의", dress: "원피스", bag: "가방", hat: "모자", shoes: "신발", jewelry: "악세사리", beauty: "뷰티", food: "식품", interior: "인테리어", appliance: "전자제품" };
const VERIFY = { official: "동일 제품", similar: "비슷한 제품", guess: "확인 중" };
const CAT_KW = { top: "상의·티셔츠·니트", outer: "아우터·자켓·코트", bottom: "하의·바지·치마", dress: "원피스", bag: "가방", hat: "모자", shoes: "신발·운동화", jewelry: "악세사리·주얼리", beauty: "뷰티·화장품", food: "식품·음식", interior: "인테리어·소품", appliance: "전자제품·가전" };
const SHOPS = [[/^(naver\.me|brandconnect\.naver\.com)$/, "네이버 스마트스토어"], [/wconcept\.co\.kr$/, "W컨셉"], [/musinsa\.com$/, "무신사"], [/29cm\.co\.kr$/, "29CM"], [/coupang\.com$/, "쿠팡"], [/(smartstore|brand|shopping)\.naver\.com$/, "네이버"], [/zigzag\.kr$/, "지그재그"], [/a-bly\.com$/, "에이블리"], [/kream\.co\.kr$/, "KREAM"], [/ssg\.com$/, "SSG"], [/lotteon\.com$/, "롯데온"], [/hago\.kr$/, "하고"], [/wadiz\.kr$/, "와디즈"], [/11st\.co\.kr$/, "11번가"], [/gmarket\.co\.kr$/, "G마켓"], [/auction\.co\.kr$/, "옥션"], [/oliveyoung\.co\.kr$/, "올리브영"], [/kurly\.com$/, "컬리"], [/ohou\.se$/, "오늘의집"], [/hmall\.com$/, "현대Hmall"], [/gsshop\.com$/, "GS SHOP"], [/cjonstyle\.com$/, "CJ온스타일"], [/lfmall\.co\.kr$/, "LF몰"], [/ssfshop\.com$/, "SSF샵"], [/thehandsome\.com$/, "더한섬닷컴"]];
// 링크프라이스 제휴 링크는 링크 안의 진짜 상품 주소(tu)로 쇼핑몰 이름을 알아내요
const isLinkPrice = u => /(^|\.)(linkmoa\.kr|lase\.kr|click\.linkprice\.com)$/i.test(u.hostname) || (/\/click\.php$/i.test(u.pathname) && u.searchParams.has("tu") && u.searchParams.has("a"));
const realUrl = url => { try { const u = new URL(url); if (isLinkPrice(u)) { const t = u.searchParams.get("tu"); if (t && /^https?:\/\//i.test(t)) return t; } } catch {} return url; };
const shopName = url => { try { const h = new URL(realUrl(url)).hostname.replace(/^(www|m)\./, ""); const f = SHOPS.find(([re]) => re.test(h)); return f ? f[1] : h; } catch { return "구매처"; } };
// 주소에 쓸 이름: 폴더 이름에 못 쓰는 글자만 바꿔요 (한글·띄어쓰기는 그대로)
const slug = s => String(s || "").trim().replace(/[\/\\?%*:|"<>#&]/g, "-").replace(/\s+/g, " ") || "-";
const enc = s => encodeURIComponent(s);

async function get(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`수파베이스 ${res.status}: ${await res.text()}`);
  return res.json();
}

// ---- 1) 사이트 파일 복사 ----
await mkdir(OUT, { recursive: true });
for (const f of ["index.html", "app.js", "favicon.ico", "icon-192.png", "apple-touch-icon.png", "meerkat.webp", "og-default.jpg", "blog-widget.png"]) await copyFile(`${SRC}/${f}`, `${OUT}/${f}`);

// 없는 주소: 아이템 주소면 사이트의 상세 창으로, 아니면 첫 화면으로
await writeFile(`${OUT}/404.html`, `<!doctype html><meta charset="utf-8"><title>어디꺼야?</title>
<script>var m=location.pathname.match(/\\/item\\/([0-9a-f]{8})/i);location.replace("${BASE}/"+(m?"#i/"+m[1]:""));</script>
<p><a href="${BASE}/">어디꺼야?로 가기</a></p>`);

// ---- 2) 데이터 ----
let items = [], shows = [];
if (SUPABASE_URL && KEY) {
  try {
    [items, shows] = await Promise.all([get("items?select=*&order=created_at.desc"), get("shows?select=*")]);
  } catch (e) {
    console.log("데이터를 읽지 못해 아이템 페이지 없이 배포해요:", e.message);
  }
} else console.log("SUPABASE_URL/SUPABASE_KEY가 없어 아이템 페이지 없이 배포해요.");
const showOf = id => shows.find(s => s.id === id) || { title: "", platform: "" };

// 프로그램 주소: 프로그램명으로 (이름이 겹치면 뒤에 번호)
const showSlug = new Map();
{
  const used = new Set();
  for (const s of shows) { let k = slug(s.title); if (used.has(k)) k = `${k}-${short(s.id)}`; used.add(k); showSlug.set(s.id, k); }
}
const personUrl = name => `${BASE}/people/${enc(slug(name))}/`;
const showUrl = s => (s && showSlug.has(s.id) ? `${BASE}/shows/${enc(showSlug.get(s.id))}/` : "");
const catUrl = c => `${BASE}/category/${c}/`;
const itemUrl = it => `${BASE}/item/${short(it.id)}/`;

// 구매처·가격 (아이템 페이지와 목록 카드가 같이 써요)
function buyInfo(it) {
  const num = v => (typeof v === "number" && isFinite(v) ? v : null);
  const links = [];
  if (httpUrl(it.buy_url)) links.push({ shop: shopName(it.buy_url), url: it.buy_url, aff: !!it.buy_affiliate, main: true, price: num(it.price) });
  for (const l of Array.isArray(it.links) ? it.links : []) if (l && httpUrl(l.url)) links.push({ shop: (l.shop || "").trim() || shopName(l.url), url: l.url, aff: !!l.aff, price: num(l.price) });
  const priced = links.filter(l => l.price !== null);
  const min = priced.length ? Math.min(...priced.map(l => l.price)) : null;
  if (priced.length > 1) priced.forEach(l => { if (l.price === min) l.lowest = true; });
  const mainIsLowest = num(it.price) !== null && it.price <= (min ?? Infinity);
  const off = it.list_price > it.price ? Math.round((1 - it.price / it.list_price) * 100) : 0;
  return { links, priced, min, mainIsLowest, off };
}
const priceHtml = it => {
  const b = buyInfo(it);
  return b.mainIsLowest ? `${b.off ? `<s class="was">${won(it.list_price)}</s> <span class="off">${b.off}%</span> ` : ""}${won(it.price)}` : b.min !== null ? `<span class="off">최저</span> ${won(b.min)}` : "";
};

// ---- 3) 공통 모양 ----
const CSS = `:root{--bg:#1A1613;--surface:#241E1A;--ink:#F4EFE6;--muted:#CFC7BE;--line:rgba(255,255,255,.18);--accent:#E8C18C;--accent-ink:#1A1613}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 "Noto Sans KR",system-ui,-apple-system,"Apple SD Gothic Neo",sans-serif;word-break:keep-all;overflow-wrap:break-word}
a{color:inherit}.wrap{max-width:960px;margin:0 auto;padding:0 16px}
header{border-bottom:1px solid var(--line)}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:16px}
.logo{font-family:"Noto Serif KR",Georgia,serif;font-weight:700;font-size:22px;text-decoration:none}
.cta{background:var(--accent);color:var(--accent-ink);text-decoration:none;font-weight:700;padding:8px 16px;border-radius:999px;font-size:15px}
main.wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:32px;padding-block:32px}
.img{aspect-ratio:4/5;border-radius:12px;overflow:hidden;background:var(--surface);display:grid;place-items:center;color:var(--muted)}
.img img{width:100%;height:100%;object-fit:cover}
.br{font-weight:700;color:var(--muted);font-size:15px}h1{font-size:28px;line-height:1.35;margin:4px 0 8px}
.pr{font-size:24px;font-weight:700}.was{font-size:16px;font-weight:400;color:var(--muted)}.off{color:var(--accent)}
.note{font-size:14px;color:var(--muted);margin:4px 0}
.vf{display:inline-block;font-size:12px;font-weight:700;padding:1px 8px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
.vf-official{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}.vf-similar{border-color:var(--accent);color:var(--accent)}
dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:16px 0}dt{color:var(--muted)}dd{margin:0}dd a{text-underline-offset:3px}
.scene{background:rgba(0,0,0,.25);border-radius:8px;padding:12px 14px;margin:0 0 16px}
.buys{display:flex;flex-wrap:wrap;gap:8px}.btn{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 20px;border-radius:999px;text-decoration:none;font-weight:700;border:1px solid var(--line)}
.btn.main{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.btn small{font-weight:500;font-size:11px}.btn .low{background:#9CCBA8;color:#10261a;font-weight:700;padding:1px 6px;border-radius:999px}
.more{grid-column:1/-1;border-top:1px solid var(--line);padding-top:24px}.more h2{font-size:20px;margin:0 0 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}.grid a{text-decoration:none;display:grid;gap:4px;font-size:14px}
.grid .t{aspect-ratio:1;border-radius:10px;overflow:hidden;background:var(--surface)}.grid img{width:100%;height:100%;object-fit:cover}
footer.wrap{border-top:1px solid var(--line);color:var(--muted);font-size:13px;padding-block:24px 40px;display:grid;gap:4px}
footer nav{display:flex;flex-wrap:wrap;gap:4px 14px;margin-bottom:6px}footer nav a{color:var(--ink)}
/* 목록 페이지(인물·프로그램·분류) */
main.list{display:block;padding-block:24px 40px}
.crumb{font-size:14px;color:var(--muted);margin:0 0 6px}.crumb a{text-decoration:none}.crumb a:hover{text-decoration:underline}
.lead{color:var(--muted);margin:0 0 18px;max-width:60ch}
h1 small{font-size:16px;font-weight:500;color:var(--muted);margin-left:6px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px}.chips a{border:1px solid var(--line);border-radius:999px;padding:6px 14px;text-decoration:none;font-size:14px}
.chips a small{color:var(--muted);margin-left:4px}.chips a:hover{background:var(--surface)}
.label{font-size:14px;font-weight:700;color:var(--muted);margin:0 0 8px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:22px 16px}
.card{text-decoration:none;display:grid;gap:3px;align-content:start;font-size:14px;min-width:0}
.card .t{aspect-ratio:4/5;border-radius:10px;overflow:hidden;background:var(--surface);margin-bottom:6px;display:grid;place-items:center;color:var(--muted)}
.card .t img{width:100%;height:100%;object-fit:cover}
.card .cb{font-size:13px;font-weight:700;color:var(--muted)}
.card .cn{font-size:15px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card .cp{font-weight:700}.card .cw{font-size:13px;color:var(--muted)}
.card:hover .cn{text-decoration:underline}
.hub{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.hub a{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:14px 12px;text-decoration:none;display:grid;gap:2px;text-align:center}
.hub a b{font-size:15px}.hub a span{font-size:12px;color:var(--muted)}
@media (max-width:700px){main.wrap{grid-template-columns:1fr}h1{font-size:24px}.cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}.hub{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}}`;

const FOOT = `<footer class="wrap">
  <nav aria-label="모아 보기"><a href="${BASE}/people/">인물별 아이템</a><a href="${BASE}/shows/">프로그램별 아이템</a><a href="${BASE}/category/">분류별 아이템</a></nav>
  <span>아이템 정보는 방송 화면을 보고 찾은 것이라 틀릴 수 있어요.</span>
  <span>구매 링크 중 일부는 제휴 링크일 수 있으며, 이 링크로 구매하면 어디꺼야?가 일정 수수료를 받을 수 있어요.</span>
  <span>정보 수정·삭제 요청과 문의: <a href="#" class="mail-show" onclick="var e=['wherefromstore','gmail.com'].join('@');this.href='mailto:'+e;this.textContent=e;this.onclick=null;return false">이메일 보기</a></span>
</footer>`;

// 공유 이미지(og.jpg)를 만들 페이지 목록 — 다 만든 뒤 한꺼번에 찍어요
const ogJobs = [];
const instaJobs = []; // 인스타 카드(insta.jpg): 관리자 화면 '블로그·인스타'에서 받아 써요
function page({ title, desc, url, image, og = false, ogType = "website", ld, body, mainClass = "" }) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="${BASE}/favicon.ico" sizes="32x32 48x48">
<link rel="icon" href="${BASE}/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${BASE}/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&family=Noto+Sans+KR:wght@400;500;700&display=swap">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="어디꺼야?">
<meta property="og:title" content="${esc(title.replace(/ \| 어디꺼야\?$/, ""))}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(og ? url + "og.jpg" : image || `${BASE}/og-default.jpg`)}">${og ? `
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ""}
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>` : ""}
<style>${CSS}</style>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${BASE}/">어디꺼야?</a><a class="cta" href="${BASE}/#request">제보하기</a></div></header>
<main class="wrap${mainClass ? " " + mainClass : ""}">
${body}
</main>
${FOOT}
${GC_TAG}
</body>
</html>
`;
}

// ---- 4) 아이템 페이지 ----
function itemPage(it, others) {
  const s = showOf(it.show_id);
  const url = itemUrl(it);
  const scene = [s.title || it.platform, it.ep].filter(Boolean).join(" "); // 프로그램이 없으면 아이템의 플랫폼(행사·포토콜 등)
  const { links, priced, min, mainIsLowest, off } = buyInfo(it);
  // 사람들이 실제로 치는 말: "프로그램 인물 분류" (예: 언니네 산지직송3 염정아 모자)
  const cat = CATS[it.cat] || "";
  const kw = [s.title, it.person, cat].filter(Boolean).join(" ");
  const title = `${kw} - ${it.brand} ${it.name} | 어디꺼야?`;
  const desc = `${[scene, it.person].filter(Boolean).join(" ")} ${cat} 정보: ${it.brand} ${it.name}.${min !== null ? ` ${priced.length > 1 ? "최저 " : ""}${won(min)}.` : ""}${links.length ? ` 구매처: ${[...new Set(links.map(l => l.shop))].join(", ")}.` : ""}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: it.name, brand: { "@type": "Brand", name: it.brand },
    image: httpUrl(it.image_url) ? [it.image_url] : undefined, description: desc, url,
    offers: priced.length ? (priced.length > 1
      ? { "@type": "AggregateOffer", lowPrice: min, highPrice: Math.max(...priced.map(l => l.price)), offerCount: priced.length, priceCurrency: "KRW" }
      : { "@type": "Offer", price: min, priceCurrency: "KRW", url: priced[0].url, availability: "https://schema.org/InStock" }) : undefined,
  };
  const sUrl = showUrl(s);
  const body = `
  <div class="img">${httpUrl(it.image_url) ? `<img src="${esc(it.image_url)}" alt="${esc(it.brand + " " + it.name)}">` : `<span>${esc(CATS[it.cat] || "")}</span>`}</div>
  <div>
    <div class="br">${esc(it.brand)} <span class="vf vf-${esc(it.verify || "guess")}">${VERIFY[it.verify] || "확인 중"}</span></div>
    <h1>${esc(it.name)}</h1>
    <p class="note">${esc([scene, it.person].filter(Boolean).join(" "))} ${esc(cat)} 정보</p>
    ${mainIsLowest ? `<div class="pr">${off ? `<s class="was">${won(it.list_price)}</s> <span class="off">${off}%</span> ` : ""}${won(it.price)}</div>` : min !== null ? `<div class="pr"><span class="off">최저</span> ${won(min)}</div>` : ""}
    ${it.coupon_price && it.coupon_price < it.price ? `<p class="note">${esc(shopName(it.buy_url))} 쿠폰 적용 시 최대 ${won(it.coupon_price)}</p>` : ""}
    <p class="note">${it.price_checked_at ? `${md(it.price_checked_at)} 판매처 기준 · 가격은 바뀔 수 있어요` : "등록할 때 가격이에요. 판매처에서 확인해 주세요"}</p>
    <dl>
      <dt>인물</dt><dd>${it.person ? `<a href="${personUrl(it.person)}">${esc(it.person)}</a>` : ""}</dd>
      ${scene ? `<dt>${s.title ? "프로그램" : "어디서"}</dt><dd>${sUrl ? `<a href="${sUrl}">${esc(s.title)}</a>${it.ep ? " " + esc(it.ep) : ""}` : esc(scene)}</dd>` : ""}
      ${s.platform ? `<dt>플랫폼</dt><dd>${esc(s.platform)}</dd>` : ""}
      <dt>분류</dt><dd>${CATS[it.cat] ? `<a href="${catUrl(it.cat)}">${esc(CATS[it.cat])}</a>` : ""}</dd>
    </dl>
    ${it.scene ? `<p class="scene">${esc(it.scene)}</p>` : ""}
    ${links.length ? `<div class="buys">${links.map(l => `<a class="btn${l.main ? " main" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer${l.aff ? " sponsored" : ""}">${esc(l.shop)}${l.price !== null ? ` ${won(l.price)}` : " 보기"}${l.lowest ? ' <small class="low">최저가</small>' : ""}${l.aff ? " <small>제휴</small>" : ""}</a>`).join("")}</div>` : `<p class="note">구매처 정보가 아직 없어요.</p>`}
    ${links.some(l => l.aff) ? `<p class="note">‘제휴’ 링크로 구매하면 어디꺼야?가 수수료를 받을 수 있어요.</p>` : ""}
    <p style="margin-top:20px"><a class="btn" href="${BASE}/">어디꺼야?에서 다른 아이템 보기</a></p>
  </div>
  ${others.length ? `<section class="more"><h2><a href="${personUrl(it.person)}">${esc(it.person)}의 다른 아이템</a></h2><div class="grid">${others.map(o => `<a href="${itemUrl(o)}"><div class="t">${httpUrl(o.image_url) ? `<img src="${esc(o.image_url)}" alt="" loading="lazy">` : ""}</div><b>${esc(o.brand)}</b><span>${esc(o.name)}</span></a>`).join("")}</div></section>` : ""}`;
  const og = httpUrl(it.image_url);
  if (og) {
    const low = priced.find(l => l.price === min);
    const card = {
      image: it.image_url, where: [scene, it.person].filter(Boolean).join(" · "), brand: it.brand, name: it.name,
      price: mainIsLowest ? won(it.price) : min !== null ? `최저 ${won(min)}` : "",
      shop: [mainIsLowest ? shopName(it.buy_url) : low ? low.shop : ""].find(x => x && x !== "구매처") || "" };
    ogJobs.push({ dir: `item/${short(it.id)}`, fallback: it.image_url, html: itemCard(card) });
    instaJobs.push({ dir: `item/${short(it.id)}`, html: instaCard(card) });
  }
  return page({ title, desc, url, image: og ? it.image_url : "", og, ogType: "product", ld, body });
}

const seen = new Set();
const pageItems = [];
for (const it of items) {
  const k = short(it.id);
  if (seen.has(k)) continue; // 앞 8자리가 겹치는 일은 거의 없지만, 겹치면 먼저 만든 것만
  seen.add(k);
  pageItems.push(it);
  const others = items.filter(o => o.id !== it.id && (o.person_id ? o.person_id === it.person_id : o.person === it.person)).slice(0, 8);
  await mkdir(`${OUT}/item/${k}`, { recursive: true });
  await writeFile(`${OUT}/item/${k}/index.html`, itemPage(it, others));
}

// ---- 5) 목록 페이지: 인물·프로그램·분류 ----
const card = it => {
  const s = showOf(it.show_id);
  return `<a class="card" href="${itemUrl(it)}"><div class="t">${httpUrl(it.image_url) ? `<img src="${esc(it.image_url)}" alt="${esc(it.brand + " " + it.name)}" loading="lazy">` : `<span>${esc(CATS[it.cat] || "")}</span>`}</div>
  <span class="cb">${esc(it.brand)} <span class="vf vf-${esc(it.verify || "guess")}">${VERIFY[it.verify] || "확인 중"}</span></span><span class="cn">${esc(it.name)}</span>${priceHtml(it) ? `<span class="cp">${priceHtml(it)}</span>` : ""}<span class="cw">${esc([it.person, s.title].filter(Boolean).join(" · "))}</span></a>`;
};
const listLd = (name, url, list) => ({
  "@context": "https://schema.org", "@type": "CollectionPage", name, url,
  mainEntity: { "@type": "ItemList", numberOfItems: list.length, itemListElement: list.slice(0, 50).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: itemUrl(it), name: `${it.brand} ${it.name}` })) },
});
const crumb = (...parts) => `<p class="crumb"><a href="${BASE}/">홈</a>${parts.map(([t, u]) => ` / ${u ? `<a href="${u}">${esc(t)}</a>` : esc(t)}`).join("")}</p>`;
const firstImage = list => (list.find(it => httpUrl(it.image_url)) || {}).image_url || "";
const top = (arr, n) => [...arr.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const latest = list => list.reduce((m, it) => (String(it.updated_at || it.created_at) > m ? String(it.updated_at || it.created_at) : m), "");
const sitemap = []; // [url, lastmod]
async function save(dir, html, lastmod) { await mkdir(`${OUT}/${dir}`, { recursive: true }); await writeFile(`${OUT}/${dir}/index.html`, html); }

// 인물
const byPerson = new Map();
for (const it of pageItems) if (it.person) { const k = slug(it.person); if (!byPerson.has(k)) byPerson.set(k, { name: it.person, list: [] }); byPerson.get(k).list.push(it); }
for (const [k, { name, list }] of byPerson) {
  const url = personUrl(name);
  const showCnt = new Map(), catCnt = new Map();
  list.forEach(it => { const s = showOf(it.show_id); if (s.title) showCnt.set(s.id, (showCnt.get(s.id) || 0) + 1); if (CATS[it.cat]) catCnt.set(it.cat, (catCnt.get(it.cat) || 0) + 1); });
  const showNames = top(showCnt, 3).map(([id]) => showOf(id).title);
  const catNames = top(catCnt, 3).map(([c]) => CATS[c]);
  const brands = [...new Set(list.map(it => it.brand).filter(Boolean))].slice(0, 3);
  const title = `${name} 착장·옷·아이템 어디꺼? 방송 속 패션·제품 ${list.length}개 모음 | 어디꺼야?`;
  const desc = `${showNames.length ? showNames.join(", ") + "에 나온 " : "방송·유튜브에 나온 "}${name}의 ${catNames.join("·") || "아이템"} 정보 ${list.length}개${brands.length ? ` (${brands.join(", ")} 등)` : ""}. 브랜드·상품명·가격·구매처를 한곳에서 확인하세요.`;
  const body = `${crumb(["인물", `${BASE}/people/`], [name])}
  <h1>${esc(name)}의 아이템 <small>${list.length}개</small></h1>
  <p class="lead">${esc(desc)}</p>
  ${showCnt.size ? `<p class="label">출연 프로그램</p><div class="chips">${top(showCnt, 50).map(([id, n]) => { const s = showOf(id); return `<a href="${showUrl(s)}">${esc(s.title)}<small>${n}</small></a>`; }).join("")}</div>` : ""}
  <div class="cards">${list.map(card).join("")}</div>`;
  const pImgs = list.map(it => it.image_url).filter(httpUrl);
  if (pImgs.length) ogJobs.push({ dir: `people/${k}`, fallback: pImgs[0], html: groupCard({ kind: "인물", title: name, count: list.length, sub: showNames.join(" · "), images: pImgs }) });
  await save(`people/${k}`, page({ title, desc, url, image: firstImage(list), og: pImgs.length > 0, ld: listLd(`${name}의 아이템`, url, list), body, mainClass: "list" }));
  sitemap.push([url, day(latest(list))]);
}

// 프로그램
const byShow = new Map();
for (const it of pageItems) { const s = showOf(it.show_id); if (s.id) { if (!byShow.has(s.id)) byShow.set(s.id, []); byShow.get(s.id).push(it); } }
for (const s of shows) {
  const list = byShow.get(s.id) || [];
  if (!list.length) continue;
  const url = showUrl(s);
  const ppl = new Map();
  list.forEach(it => { if (it.person) ppl.set(it.person, (ppl.get(it.person) || 0) + 1); });
  const names = top(ppl, 4).map(([n]) => n);
  const title = `${s.title} 착장·아이템 어디꺼? 출연자 옷·패션·제품 ${list.length}개 모음 | 어디꺼야?`;
  const desc = `${s.platform ? s.platform + " " : ""}${s.title} 출연자${names.length ? ` ${names.join(", ")}` : ""}의 착장·패션·뷰티 아이템 정보 ${list.length}개. 브랜드·상품명·가격·구매처를 한곳에서 확인하세요.`;
  const body = `${crumb(["프로그램", `${BASE}/shows/`], [s.title])}
  <h1>${esc(s.title)} 아이템 <small>${list.length}개</small></h1>
  <p class="lead">${esc(desc)}</p>
  ${ppl.size ? `<p class="label">출연자</p><div class="chips">${top(ppl, 50).map(([n, c]) => `<a href="${personUrl(n)}">${esc(n)}<small>${c}</small></a>`).join("")}</div>` : ""}
  <div class="cards">${list.map(card).join("")}</div>`;
  const sImgs = list.map(it => it.image_url).filter(httpUrl);
  if (sImgs.length) ogJobs.push({ dir: `shows/${showSlug.get(s.id)}`, fallback: httpUrl(s.poster_url) ? s.poster_url : sImgs[0], html: groupCard({ kind: "프로그램", title: s.title, count: list.length, sub: names.join(" · "), images: sImgs }) });
  await save(`shows/${showSlug.get(s.id)}`, page({ title, desc, url, image: httpUrl(s.poster_url) ? s.poster_url : firstImage(list), og: sImgs.length > 0, ld: listLd(`${s.title} 아이템`, url, list), body, mainClass: "list" }));
  sitemap.push([url, day(latest(list))]);
}

// 분류
const byCat = new Map();
for (const it of pageItems) if (CATS[it.cat]) { if (!byCat.has(it.cat)) byCat.set(it.cat, []); byCat.get(it.cat).push(it); }
for (const [c, list] of byCat) {
  const url = catUrl(c), name = CATS[c];
  const ppl = new Map();
  list.forEach(it => { if (it.person) ppl.set(it.person, (ppl.get(it.person) || 0) + 1); });
  const kw = CAT_KW[c] || name;
  const title = `방송에 나온 ${kw} 어디꺼? 연예인 ${name} 아이템 ${list.length}개 모음 | 어디꺼야?`;
  const desc = `드라마·예능·유튜브에 나온 연예인 ${kw} ${list.length}개${ppl.size ? ` (${top(ppl, 3).map(([n]) => n).join(", ")} 등)` : ""}. 어느 방송인지 몰라도 브랜드·상품명·가격·구매처를 찾아보세요.`;
  const body = `${crumb(["분류", `${BASE}/category/`], [name])}
  <h1>방송에 나온 ${esc(name)} <small>${list.length}개</small></h1>
  <p class="lead">${esc(desc)}</p>
  <div class="chips">${Object.entries(CATS).filter(([k]) => byCat.has(k)).map(([k, v]) => `<a href="${catUrl(k)}"${k === c ? ' aria-current="page" style="background:var(--accent);color:var(--accent-ink);border-color:var(--accent)"' : ""}>${esc(v)}<small>${byCat.get(k).length}</small></a>`).join("")}</div>
  <div class="cards">${list.map(card).join("")}</div>`;
  await save(`category/${c}`, page({ title, desc, url, image: firstImage(list), ld: listLd(`방송에 나온 ${name}`, url, list), body, mainClass: "list" }));
  sitemap.push([url, day(latest(list))]);
}

// 모음 페이지
const hubPage = async (dir, h1, title, desc, cells, lastmod) => {
  const url = `${BASE}/${dir}/`;
  const body = `${crumb([h1])}
  <h1>${esc(h1)} <small>${cells.length}${dir === "people" ? "명" : "개"}</small></h1>
  <p class="lead">${esc(desc)}</p>
  <div class="hub">${cells.join("")}</div>`;
  await save(dir, page({ title, desc, url, body, mainClass: "list" }));
  sitemap.push([url, lastmod]);
};
const all = day(latest(pageItems));
await hubPage("people", "인물별 아이템", "인물별 방송 아이템 모음 - 연예인 착장·제품 어디꺼? | 어디꺼야?",
  `방송·유튜브 출연자 ${byPerson.size}명의 착장·패션·뷰티·식품 아이템 정보를 인물별로 모았어요.`,
  [...byPerson.values()].sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name, "ko")).map(p => `<a href="${personUrl(p.name)}"><b>${esc(p.name)}</b><span>아이템 ${p.list.length}개</span></a>`), all);
await hubPage("shows", "프로그램별 아이템", "프로그램별 방송 아이템 모음 - 드라마·예능 착장·제품 어디꺼? | 어디꺼야?",
  `드라마·예능·유튜브 ${byShow.size}개 프로그램의 출연자 착장·패션·뷰티·식품 아이템을 프로그램별로 모았어요.`,
  shows.filter(s => byShow.has(s.id)).sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || ""))).map(s => `<a href="${showUrl(s)}"><b>${esc(s.title)}</b><span>${esc(s.platform || "")}${s.platform ? " · " : ""}아이템 ${byShow.get(s.id).length}개</span></a>`), all);
await hubPage("category", "분류별 아이템", "분류별 방송 아이템 모음 - 패션·뷰티·식품·인테리어·전자제품 어디꺼? | 어디꺼야?",
  `상의, 아우터, 가방, 모자 같은 패션부터 뷰티·화장품, 식품·음식, 인테리어, 전자제품까지 방송에 나온 아이템을 분류별로 모았어요.`,
  Object.entries(CATS).filter(([k]) => byCat.has(k)).map(([k, v]) => `<a href="${catUrl(k)}"><b>${esc(v)}</b><span>아이템 ${byCat.get(k).length}개</span></a>`), all);

// ---- 공유 이미지 찍기: 못 만든 페이지는 예전처럼 상품 사진으로 되돌려요 ----
{
  const made = await renderOg([...ogJobs.map(j => ({ html: j.html, file: `${OUT}/${j.dir}/og.jpg` })),
    ...instaJobs.map(j => ({ html: j.html, file: `${OUT}/${j.dir}/insta.jpg`, w: 1080, h: 1350 }))]);
  for (const j of ogJobs) {
    if (made.has(`${OUT}/${j.dir}/og.jpg`)) continue;
    const f = `${OUT}/${j.dir}/index.html`;
    const html = (await readFile(f, "utf8")).replace(/<meta property="og:image" content="[^"]*">\r?\n<meta property="og:image:width"[^\r\n]*/,`<meta property="og:image" content="${esc(j.fallback)}">`);
    await writeFile(f, html);
  }
  const madeOg = ogJobs.filter(j => made.has(`${OUT}/${j.dir}/og.jpg`)).length;
  console.log(`공유 이미지 ${madeOg}/${ogJobs.length}개, 인스타 카드 ${made.size - madeOg}/${instaJobs.length}개를 만들었어요.`);
}

// ---- 6) 사이트맵 ----
const urls = [`<url><loc>${BASE}/</loc></url>`,
  ...pageItems.map(it => `<url><loc>${itemUrl(it)}</loc><lastmod>${day(it.updated_at || it.created_at)}</lastmod></url>`),
  ...sitemap.map(([u, d]) => `<url><loc>${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`)];
await writeFile(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].join("\n")}\n</urlset>\n`);
await writeFile(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

// 첫 화면 index.html에도 주소를 맞춰 넣어요
const idx = await readFile(`${OUT}/index.html`, "utf8");
// 새 버전이 바로 보이도록 app.js 주소에 버전 번호를 붙여요(브라우저가 예전 파일을 쓰지 않게)
const ver = (process.env.GITHUB_SHA || String(Date.now())).slice(0, 8);
// 첫 화면 '새로 올라온 아이템'에 최신 20개를 글로 미리 넣어요 — 자바스크립트를 안 돌리는 검색 로봇·AI도 보이게.
// 방문자 화면에서는 데이터를 불러오면 사이트 스크립트가 같은 자리를 새로 그려요.
const pre = pageItems.slice(0, 20).map(it => {
  const s = showOf(it.show_id);
  return `<a class="item" href="${itemUrl(it)}"><div class="th">${httpUrl(it.image_url) ? `<img src="${esc(it.image_url)}" alt="${esc(it.brand + " " + it.name)}" loading="lazy">` : ""}</div><span class="br">${esc(it.brand)} <span class="vf vf-${esc(it.verify || "guess")}">${VERIFY[it.verify] || "확인 중"}</span></span><span class="nm">${esc(it.name)}</span>${priceHtml(it) ? `<span class="pr">${priceHtml(it)}</span>` : ""}<span class="who">${esc([it.person, s.title].filter(Boolean).join(" · "))}</span></a>`;
}).join("");
let home = idx.replaceAll("__SITE_URL__", BASE).replace('src="app.js"', `src="app.js?v=${ver}"`);
if (pre) home = home.replace('<div class="items hrail" id="itemGrid"></div>', `<div class="items hrail" id="itemGrid">${pre}</div>`)
  .replace('<p id="itemsSub"></p>', `<p id="itemsSub">아이템 ${pageItems.length}개</p>`);
await writeFile(`${OUT}/index.html`, home);

console.log(`아이템 ${pageItems.length}개, 인물 ${byPerson.size}명, 프로그램 ${byShow.size}개, 분류 ${byCat.size}개 페이지와 사이트맵 주소 ${urls.length}개를 만들었어요.`);
