// 사이트를 _site 폴더로 모으고, 아이템마다 검색·공유용 페이지(item/<번호>/)와 sitemap.xml을 만들어요.
// 깃허브 자동 작업(.github/workflows/deploy.yml)이 실행해요.
import { mkdir, writeFile, copyFile, readFile } from "node:fs/promises";

const BASE = (process.env.SITE_URL || "https://junsikman.github.io/eodikkeoya").replace(/\/+$/, "");
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_KEY || "";
const OUT = "_site";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const won = n => (typeof n === "number" && isFinite(n) ? n.toLocaleString("ko-KR") + "원" : "");
const md = iso => { const d = new Date(iso); return isNaN(d) ? "" : `${d.getMonth() + 1}월 ${d.getDate()}일`; };
const httpUrl = u => typeof u === "string" && /^https?:\/\//i.test(u);
const short = id => String(id).slice(0, 8);
const CATS = { top: "상의", outer: "아우터", bottom: "하의", dress: "원피스", bag: "가방", hat: "모자", shoes: "신발", jewelry: "주얼리", food: "식품", interior: "인테리어" };
const VERIFY = { official: "정품 확인", similar: "유사품", guess: "추정" };
const SHOPS = [[/wconcept\.co\.kr$/, "W컨셉"], [/musinsa\.com$/, "무신사"], [/29cm\.co\.kr$/, "29CM"], [/coupang\.com$/, "쿠팡"], [/(smartstore|brand|shopping)\.naver\.com$/, "네이버"], [/zigzag\.kr$/, "지그재그"], [/a-bly\.com$/, "에이블리"], [/kream\.co\.kr$/, "KREAM"], [/ssg\.com$/, "SSG"], [/lotteon\.com$/, "롯데온"], [/hago\.kr$/, "하고"], [/wadiz\.kr$/, "와디즈"]];
const shopName = url => { try { const h = new URL(url).hostname.replace(/^(www|m)\./, ""); const f = SHOPS.find(([re]) => re.test(h)); return f ? f[1] : h; } catch { return "구매처"; } };

async function get(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`수파베이스 ${res.status}: ${await res.text()}`);
  return res.json();
}

// ---- 1) 사이트 파일 복사 ----
await mkdir(OUT, { recursive: true });
for (const f of ["index.html", "app.js", "favicon.svg", "meerkat.webp", "og-default.jpg"]) await copyFile(f, `${OUT}/${f}`);

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

// ---- 3) 아이템 페이지 ----
const CSS = `:root{--bg:#161A26;--surface:#1D2231;--ink:#F4EFE6;--muted:#C3C0CC;--line:rgba(255,255,255,.18);--accent:#E8C18C;--accent-ink:#161A26}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 "Noto Sans KR",system-ui,-apple-system,"Apple SD Gothic Neo",sans-serif}
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
dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:16px 0}dt{color:var(--muted)}dd{margin:0}
.scene{background:rgba(0,0,0,.25);border-radius:8px;padding:12px 14px;margin:0 0 16px}
.buys{display:flex;flex-wrap:wrap;gap:8px}.btn{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 20px;border-radius:999px;text-decoration:none;font-weight:700;border:1px solid var(--line)}
.btn.main{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.btn small{font-weight:500;font-size:11px}.btn .low{background:#9CCBA8;color:#10261a;font-weight:700;padding:1px 6px;border-radius:999px}
.more{grid-column:1/-1;border-top:1px solid var(--line);padding-top:24px}.more h2{font-size:20px;margin:0 0 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}.grid a{text-decoration:none;display:grid;gap:4px;font-size:14px}
.grid .t{aspect-ratio:1;border-radius:10px;overflow:hidden;background:var(--surface)}.grid img{width:100%;height:100%;object-fit:cover}
footer.wrap{border-top:1px solid var(--line);color:var(--muted);font-size:13px;padding-block:24px 40px;display:grid;gap:4px}
@media (max-width:700px){main.wrap{grid-template-columns:1fr}h1{font-size:24px}}`;

function itemPage(it, others) {
  const s = showOf(it.show_id);
  const url = `${BASE}/item/${short(it.id)}/`;
  const scene = [s.title, it.ep].filter(Boolean).join(" ");
  const off = it.list_price > it.price ? Math.round((1 - it.price / it.list_price) * 100) : 0;
  const links = [];
  const num = v => (typeof v === "number" && isFinite(v) ? v : null);
  if (httpUrl(it.buy_url)) links.push({ shop: shopName(it.buy_url), url: it.buy_url, aff: !!it.buy_affiliate, main: true, price: num(it.price) });
  for (const l of Array.isArray(it.links) ? it.links : []) if (l && httpUrl(l.url)) links.push({ shop: (l.shop || "").trim() || shopName(l.url), url: l.url, aff: !!l.aff, price: num(l.price) });
  const priced = links.filter(l => l.price !== null);
  const min = priced.length ? Math.min(...priced.map(l => l.price)) : null;
  if (priced.length > 1) priced.forEach(l => { if (l.price === min) l.lowest = true; });
  const mainIsLowest = num(it.price) !== null && it.price <= (min ?? Infinity);
  // 사람들이 실제로 치는 말: "프로그램 인물 분류" (예: 언니네 산지직송3 염정아 모자)
  const cat = CATS[it.cat] || "";
  const kw = [s.title, it.person, cat].filter(Boolean).join(" ");
  const title = `${kw} - ${it.brand} ${it.name} | 어디꺼야?`;
  const desc = `${[scene, it.person].filter(Boolean).join(" ")} ${cat} 정보: ${it.brand} ${it.name}.${min !== null ? ` ${priced.length > 1 ? "최저 " : ""}${won(min)}.` : ""}${links.length ? ` 구매처: ${[...new Set(links.map(l => l.shop))].join(", ")}.` : ""}`;
  const image = httpUrl(it.image_url) ? it.image_url : `${BASE}/og-default.jpg`;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: it.name, brand: { "@type": "Brand", name: it.brand },
    image: httpUrl(it.image_url) ? [it.image_url] : undefined, description: desc, url,
    offers: priced.length ? (priced.length > 1
      ? { "@type": "AggregateOffer", lowPrice: min, highPrice: Math.max(...priced.map(l => l.price)), offerCount: priced.length, priceCurrency: "KRW" }
      : { "@type": "Offer", price: min, priceCurrency: "KRW", url: priced[0].url, availability: "https://schema.org/InStock" }) : undefined,
  };
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="product">
<meta property="og:site_name" content="어디꺼야?">
<meta property="og:title" content="${esc(`${kw} - ${it.brand} ${it.name}`)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<style>${CSS}</style>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${BASE}/">어디꺼야?</a><a class="cta" href="${BASE}/#request">제보하기</a></div></header>
<main class="wrap">
  <div class="img">${httpUrl(it.image_url) ? `<img src="${esc(it.image_url)}" alt="${esc(it.brand + " " + it.name)}">` : `<span>${esc(CATS[it.cat] || "")}</span>`}</div>
  <div>
    <div class="br">${esc(it.brand)} <span class="vf vf-${esc(it.verify || "guess")}">${VERIFY[it.verify] || "추정"}</span></div>
    <h1>${esc(it.name)}</h1>
    <p class="note">${esc([scene, it.person].filter(Boolean).join(" "))} ${esc(cat)} 정보</p>
    ${mainIsLowest ? `<div class="pr">${off ? `<s class="was">${won(it.list_price)}</s> <span class="off">${off}%</span> ` : ""}${won(it.price)}</div>` : min !== null ? `<div class="pr"><span class="off">최저</span> ${won(min)}</div>` : ""}
    ${it.coupon_price && it.coupon_price < it.price ? `<p class="note">${esc(shopName(it.buy_url))} 쿠폰 적용 시 최대 ${won(it.coupon_price)}</p>` : ""}
    <p class="note">${it.price_checked_at ? `${md(it.price_checked_at)} 판매처 기준 · 가격은 바뀔 수 있어요` : "등록할 때 가격이에요. 판매처에서 확인해 주세요"}</p>
    <dl>
      <dt>인물</dt><dd>${esc(it.person)}</dd>
      ${scene ? `<dt>프로그램</dt><dd>${esc(scene)}</dd>` : ""}
      ${s.platform ? `<dt>플랫폼</dt><dd>${esc(s.platform)}</dd>` : ""}
      <dt>분류</dt><dd>${esc(CATS[it.cat] || "")}</dd>
    </dl>
    ${it.scene ? `<p class="scene">${esc(it.scene)}</p>` : ""}
    ${links.length ? `<div class="buys">${links.map(l => `<a class="btn${l.main ? " main" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer${l.aff ? " sponsored" : ""}">${esc(l.shop)}${l.price !== null ? ` ${won(l.price)}` : " 보기"}${l.lowest ? ' <small class="low">최저가</small>' : ""}${l.aff ? " <small>제휴</small>" : ""}</a>`).join("")}</div>` : `<p class="note">구매처 정보가 아직 없어요.</p>`}
    ${links.some(l => l.aff) ? `<p class="note">‘제휴’ 링크로 구매하면 어디꺼야?가 수수료를 받을 수 있어요.</p>` : ""}
    <p style="margin-top:20px"><a class="btn" href="${BASE}/">어디꺼야?에서 다른 착장 보기</a></p>
  </div>
  ${others.length ? `<section class="more"><h2>${esc(it.person)}의 다른 착장</h2><div class="grid">${others.map(o => `<a href="${BASE}/item/${short(o.id)}/"><div class="t">${httpUrl(o.image_url) ? `<img src="${esc(o.image_url)}" alt="" loading="lazy">` : ""}</div><b>${esc(o.brand)}</b><span>${esc(o.name)}</span></a>`).join("")}</div></section>` : ""}
</main>
<footer class="wrap">
  <span>아이템 정보는 방송 화면을 보고 찾은 것이라 틀릴 수 있어요.</span>
  <span>구매 링크 중 일부는 제휴 링크일 수 있으며, 이 링크로 구매하면 어디꺼야?가 일정 수수료를 받을 수 있어요.</span>
  <span>정보 수정·삭제 요청과 문의: <a href="mailto:zpvlfntm1@naver.com">zpvlfntm1@naver.com</a></span>
</footer>
</body>
</html>
`;
}

const seen = new Set();
for (const it of items) {
  const k = short(it.id);
  if (seen.has(k)) continue; // 앞 8자리가 겹치는 일은 거의 없지만, 겹치면 먼저 만든 것만
  seen.add(k);
  const others = items.filter(o => o.id !== it.id && (o.person_id ? o.person_id === it.person_id : o.person === it.person)).slice(0, 8);
  await mkdir(`${OUT}/item/${k}`, { recursive: true });
  await writeFile(`${OUT}/item/${k}/index.html`, itemPage(it, others));
}

// ---- 4) 사이트맵 ----
const urls = [`<url><loc>${BASE}/</loc></url>`, ...items.filter(it => seen.has(short(it.id))).map(it => `<url><loc>${BASE}/item/${short(it.id)}/</loc><lastmod>${new Date(it.updated_at || it.created_at).toISOString().slice(0, 10)}</lastmod></url>`)];
await writeFile(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].join("\n")}\n</urlset>\n`);

// 첫 화면 index.html에도 주소를 맞춰 넣어요
const idx = await readFile(`${OUT}/index.html`, "utf8");
// 새 버전이 바로 보이도록 app.js 주소에 버전 번호를 붙여요(브라우저가 예전 파일을 쓰지 않게)
const ver = (process.env.GITHUB_SHA || String(Date.now())).slice(0, 8);
await writeFile(`${OUT}/index.html`, idx.replaceAll("__SITE_URL__", BASE).replace('src="app.js"', `src="app.js?v=${ver}"`));

console.log(`아이템 페이지 ${seen.size}개, 사이트맵 주소 ${urls.length}개를 만들었어요.`);
