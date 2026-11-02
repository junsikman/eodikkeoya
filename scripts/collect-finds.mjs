// 착장 정보 자동 수집
// 네이버 뉴스·블로그에서 "프로그램 + 착용" 같은 글을 찾아 읽고, 올라마(내 컴퓨터에서 도는 AI)가
// 글에 적힌 브랜드·상품명을 뽑아 제보함에 "자동 수집"으로 넣어요. 사이트에 바로 올라가지 않아요.
// 관리자가 제보함에서 확인하고 "이 제보로 아이템 등록"을 눌러야 올라가요.
//
// 깃허브 자동 작업(.github/workflows/collect-finds.yml)이 하루 한 번 실행해요. 내 컴퓨터에서도 돌릴 수 있어요.
// 필요한 비밀값: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
//   (네이버 값은 네이버 클라우드 플랫폼 NAVER API HUB 앱의 Client ID / Client Secret)
// 고를 수 있는 값: OLLAMA_URL(기본 http://localhost:11434), OLLAMA_MODEL(기본 qwen2.5:7b),
//                  DAYS(며칠 전 글까지, 기본 3), MAX_DOCS(한 번에 읽을 글 수, 기본 30), DRY_RUN=1(저장 안 하고 보기만)

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const env = k => (process.env[k] || "").trim();
const SUPABASE_URL = env("SUPABASE_URL").replace(/\/+$/, "");
const KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const NAVER_ID = env("NAVER_CLIENT_ID");
const NAVER_SECRET = env("NAVER_CLIENT_SECRET");
const OLLAMA = (env("OLLAMA_URL") || "http://localhost:11434").replace(/\/+$/, "");
const MODEL = env("OLLAMA_MODEL") || "qwen2.5:7b";
const DAYS = Number(env("DAYS")) || 3;
const MAX_DOCS = Number(env("MAX_DOCS")) || 30;
const TEXT_LIMIT = Number(env("TEXT_LIMIT")) || 3000;
const DRY = env("DRY_RUN") === "1";

const missing = [["SUPABASE_URL", SUPABASE_URL], ["SUPABASE_SERVICE_ROLE_KEY", KEY], ["NAVER_CLIENT_ID", NAVER_ID], ["NAVER_CLIENT_SECRET", NAVER_SECRET]]
  .filter(([, v]) => !v).map(([k]) => k);
if (missing.length) { console.error(`비밀값이 없어요: ${missing.join(", ")}`); process.exit(1); }

const CATS = ["상의", "아우터", "하의", "원피스", "가방", "모자", "신발", "주얼리", "뷰티", "식품", "인테리어"];
// 착장·제품 이야기일 가능성이 있는 글만 AI에게 보내요 (시간 절약)
const HINT = /착용|패션|코디|브랜드|제품|아이템|옷|자켓|재킷|점퍼|패딩|코트|셔츠|니트|후드|맨투맨|바지|팬츠|청바지|데님|치마|스커트|원피스|가방|백|모자|캡|신발|운동화|스니커즈|부츠|목걸이|반지|귀걸이|시계|안경|선글라스|화장품|립|향수|협찬|정보|어디\s*(꺼|거|제품)|가격/;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || "").toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
const cut = (s, n) => String(s || "").trim().slice(0, n);
const unhtml = s => String(s || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim();

// ---- 수파베이스 ----
async function db(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`수파베이스 ${res.status}: ${await res.text()}`);
  const t = await res.text();
  return t ? JSON.parse(t) : null;
}

// ---- 네이버 검색 ----
async function naver(kind, query) {
  // 네이버 검색 API는 2026년에 네이버 클라우드 플랫폼의 NAVER API HUB로 옮겨졌어요.
  const base = `https://naverapihub.apigw.ntruss.com/search/v1/${kind}?query=${encodeURIComponent(query)}&display=20`;
  const headers = { "X-NCP-APIGW-API-KEY-ID": NAVER_ID, "X-NCP-APIGW-API-KEY": NAVER_SECRET, Accept: "application/json" };
  let res = await fetch(`${base}&sort=date`, { headers });
  if (res.status === 400) res = await fetch(base, { headers }); // 최신순 정렬을 받지 않으면 정렬 없이 다시 물어봐요
  if (!res.ok) throw new Error(`네이버 검색 ${res.status}${res.status === 401 || res.status === 403 ? " (API HUB 키가 맞는지, 앱에서 블로그·뉴스 검색을 골랐는지 확인해 주세요)" : ""}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return (j.items || []).map(it => {
    const date = kind === "news" ? new Date(it.pubDate)
      : /^\d{8}$/.test(it.postdate || "") ? new Date(`${it.postdate.slice(0, 4)}-${it.postdate.slice(4, 6)}-${it.postdate.slice(6)}T00:00:00+09:00`) : null;
    // 네이버 뉴스 주소가 있으면 그걸 읽어요 (본문 구조가 일정해요)
    const link = kind === "news" && /n\.news\.naver\.com|news\.naver\.com/.test(it.link || "") ? it.link : (it.originallink || it.link);
    return { kind, title: unhtml(it.title), snippet: unhtml(it.description), link, date };
  });
}

// ---- 글 본문 읽기 (못 읽으면 검색 결과의 요약문만 써요) ----
async function readText(doc) {
  let url = doc.link;
  const b = url.match(/^https?:\/\/blog\.naver\.com\/([^/?#]+)\/(\d+)/);
  if (b) url = `https://m.blog.naver.com/${b[1]}/${b[2]}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9", Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(String(res.status));
    let html = await res.text();
    html = html.replace(/<(script|style|noscript|svg|header|footer|nav|aside)[\s\S]*?<\/\1>/gi, " ");
    const body = html.match(/<(?:article|div)[^>]+(?:id="(?:dic_area|articleBodyContents|article_body|articeBody|newsct_article)"|class="[^"]*(?:se-main-container|post_ct|article_body|news_end)[^"]*")[^>]*>([\s\S]*)/i);
    const text = unhtml(body ? body[1] : html);
    if (text.length < 80) throw new Error("본문이 짧아요");
    return text.slice(0, TEXT_LIMIT);
  } catch {
    return `${doc.title}. ${doc.snippet}`;
  }
}

// ---- 올라마 ----
const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          person: { type: "string" },
          show: { type: "string" },
          ep: { type: "string" },
          brand: { type: "string" },
          name: { type: "string" },
          cat: { type: "string", enum: [...CATS, "기타"] },
          evidence: { type: "string" },
        },
        required: ["person", "show", "ep", "brand", "name", "cat", "evidence"],
      },
    },
  },
  required: ["items"],
};

const SYSTEM = `너는 방송·유튜브 출연자가 입거나 쓴 제품 정보를 기사·블로그 글에서 뽑아내는 도우미야.
규칙:
- 글에 브랜드 이름이 분명히 적힌 제품만 뽑아. 추측하거나 지어내지 마. 브랜드가 없으면 뽑지 마.
- brand는 글에 적힌 글자 그대로 써 (영어로 바꾸거나 한글로 바꾸지 마).
- name은 글에 나온 상품명이나 제품 설명 (예: "울 블렌드 싱글 코트", "로고 볼캡").
- person은 그 제품을 입거나 쓴 출연자 이름. show는 프로그램 이름, ep는 회차(예: "620회")이고 모르면 빈 글자.
- cat은 제품 종류: ${CATS.join(", ")} 중 하나, 맞는 게 없으면 "기타".
- evidence는 그 제품이 나온 글의 문장을 그대로 짧게 옮겨 (50자 이내).
- 광고, 쇼핑몰 홍보, 출연자와 상관없는 제품은 빼.
- 해당하는 제품이 없으면 items를 빈 배열로 줘.`;

async function ask(doc, text) {
  const res = await fetch(`${OLLAMA}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, stream: false, format: SCHEMA, keep_alive: "10m",
      options: { temperature: 0, num_ctx: 4096 },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `검색어: ${doc.query}\n제목: ${doc.title}\n\n본문:\n${text}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`올라마 ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const out = JSON.parse(j.message?.content || "{}");
  return Array.isArray(out.items) ? out.items : [];
}

async function ensureModel() {
  let tags;
  try { tags = await (await fetch(`${OLLAMA}/api/tags`)).json(); }
  catch { console.error(`올라마에 연결하지 못했어요 (${OLLAMA}). 올라마가 켜져 있는지 확인해 주세요.`); process.exit(1); }
  const have = (tags.models || []).some(m => m.name === MODEL || m.name === `${MODEL}:latest`);
  if (have) return;
  console.log(`${MODEL} 모델을 내려받는 중이에요 (처음 한 번, 몇 분 걸려요)...`);
  const res = await fetch(`${OLLAMA}/api/pull`, { method: "POST", body: JSON.stringify({ model: MODEL, stream: false }) });
  if (!res.ok) { console.error(`모델을 내려받지 못했어요: ${await res.text()}`); process.exit(1); }
}

// ---- AI가 뽑은 결과 확인: 글에 실제로 적혀 있는지 ----
function check(c, text) {
  const brand = cut(c.brand, 60), name = cut(c.name, 120);
  if (!brand || !name) return null;
  const t = norm(text);
  if (!t.includes(norm(brand))) return null; // 브랜드가 글에 없으면 AI가 지어낸 것으로 봐요
  const words = name.split(/\s+/).map(norm).filter(w => w.length >= 2 && w !== norm(brand));
  if (words.length && !words.some(w => t.includes(w))) return null; // 상품명도 한 단어는 글에 있어야 해요
  return { ...c, brand, name };
}

// ---- 실행 ----
await ensureModel();

const [shows, items] = await Promise.all([db("shows?select=title"), db("items?select=brand,name")]);
const known = new Set(items.map(i => norm(i.brand) + "|" + norm(i.name)));

let extra = [];
try {
  extra = (await readFile(new URL("./collect-queries.txt", import.meta.url), "utf8"))
    .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"));
} catch {}

const queries = [];
const addQ = (query, show) => { if (!queries.some(q => q.query === query)) queries.push({ query, show }); };
for (const s of shows) { addQ(`${s.title} 착용`, s.title); addQ(`${s.title} 옷 브랜드`, s.title); }
for (const q of extra) addQ(q, "");
console.log(`검색어 ${queries.length}개: ${queries.map(q => q.query).join(", ")}`);

// 검색
const since = Date.now() - DAYS * 86400000;
const found = new Map();
for (const q of queries) {
  for (const kind of ["news", "blog"]) {
    try {
      for (const d of await naver(kind, q.query)) {
        if (!d.link || found.has(d.link)) continue;
        if (d.date && d.date.getTime() < since) continue;
        if (!HINT.test(d.title + " " + d.snippet)) continue;
        found.set(d.link, { ...d, query: q.query, show: q.show });
      }
    } catch (e) { console.log(`검색 실패 [${q.query} · ${kind}]: ${e.message}`); }
    await sleep(300);
  }
}

// 이미 읽은 글 빼기
let docs = [...found.values()];
if (docs.length) {
  const seen = new Set();
  for (let i = 0; i < docs.length; i += 50) {
    const part = docs.slice(i, i + 50).map(d => `"${d.link.replace(/"/g, '\\"')}"`).join(",");
    const rows = await db(`auto_seen?select=link&link=in.(${encodeURIComponent(part)})`);
    rows.forEach(r => seen.add(r.link));
  }
  docs = docs.filter(d => !seen.has(d.link));
}
docs.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
docs = docs.slice(0, MAX_DOCS);
console.log(`새로 읽을 글 ${docs.length}개`);

let added = 0, read = 0;
for (const doc of docs) {
  const text = await readText(doc);
  let cands = [];
  try { cands = await ask(doc, text); read++; }
  catch (e) { console.log(`AI 실패 [${doc.title}]: ${e.message}`); continue; } // 다음에 다시 읽도록 "읽음"으로 남기지 않아요

  const rows = [];
  for (const raw of cands) {
    const c = check(raw, `${doc.title} ${text}`);
    if (!c) { if (raw?.brand) console.log(`  버림(글에서 확인 안 됨): ${raw.brand} ${raw.name}`); continue; }
    if (known.has(norm(c.brand) + "|" + norm(c.name))) { console.log(`  이미 등록된 아이템: ${c.brand} ${c.name}`); continue; }
    const show = cut(doc.show || c.show || doc.query, 80); // 사이트에 등록된 프로그램 이름을 먼저 써요
    const who = cut(c.person, 40);
    const descr = cut([
      `${c.brand} ${c.name}`,
      c.evidence ? `근거: "${cut(c.evidence, 120)}"` : "",
      `출처: ${doc.kind === "news" ? "뉴스" : "블로그"} · ${doc.title}`,
    ].filter(Boolean).join("\n"), 600);
    rows.push({
      source: "auto", show, ep: cut(c.ep, 100), who, cat: CATS.includes(c.cat) ? c.cat : "",
      brand: c.brand, name: c.name, descr, link: cut(doc.link, 400),
      auto_key: createHash("sha1").update(`${doc.link}|${norm(c.brand)}|${norm(c.name)}`).digest("hex"),
    });
    console.log(`  찾음: ${who || "?"} · ${show} · ${c.brand} ${c.name}`);
  }

  if (!DRY) {
    try {
      if (rows.length) {
        await db("reports?on_conflict=auto_key", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(rows) });
        added += rows.length;
        rows.forEach(r => known.add(norm(r.brand) + "|" + norm(r.name)));
      }
      await db("auto_seen?on_conflict=link", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify([{ link: doc.link }]) });
    } catch (e) { console.log(`  저장하지 못했어요: ${e.message}`); }
  } else added += rows.length;
  await sleep(1500); // 글이 있는 사이트에 부담을 주지 않도록 천천히
}

console.log(`끝: 글 ${read}개를 읽고 후보 ${added}개를 제보함에 ${DRY ? "넣을 예정이에요 (시험 실행이라 저장 안 함)" : "넣었어요"}`);
