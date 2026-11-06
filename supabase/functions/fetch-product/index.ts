// 관리자 화면 "링크로 불러오기": 상품 링크를 받아 브랜드·상품명·가격·분류·이미지를 찾아 돌려줘요.
// 수파베이스 Edge Function "fetch-product"로 배포해요. 관리자만 쓸 수 있어요.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const toInt = (v: unknown) => {
  const n = Math.round(Math.abs(parseFloat(String(v ?? "").replace(/,/g, ""))));
  return Number.isFinite(n) && n > 0 ? n : null;
};
const decode = (s: string) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html: string, k: string) => {
  const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)`, "i"))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`, "i"));
  return m ? decode(m[1]) : null;
};

// 판매처 분류 이름 → 사이트 분류
function guessCat(text: string) {
  const t = text || "";
  const rules: [RegExp, string][] = [
    [/모자|햇|캡|비니|버킷/, "hat"], [/가방|백|파우치|클러치|토트|숄더|크로스/, "bag"],
    [/신발|슈즈|스니커|부츠|샌들|로퍼|구두|슬리퍼|힐/, "shoes"], [/주얼리|목걸이|귀걸이|반지|팔찌|시계/, "jewelry"],
    [/뷰티|화장품|메이크업|립스틱|립밤|틴트|쿠션|파운데이션|향수|퍼퓸|스킨케어|세럼|에센스|크림|토너|선크림|네일|헤어오일|샴푸/, "beauty"],
    [/원피스|드레스/, "dress"], [/아우터|재킷|자켓|코트|점퍼|패딩|가디건|블루종|베스트/, "outer"],
    [/팬츠|바지|스커트|데님|청바지|슬랙스|쇼츠|하의|레깅스/, "bottom"],
    [/식품|푸드|간식|음료|커피|차$|건강식품/, "food"], [/가전|디지털|전자|청소기|공기청정기|가습기|제습기|드라이기|헤어s*드라이|에어컨|선풍기|냉장고|세탁기|건조기|TV|텔레비전|오디오|스피커|이어폰|헤드폰|카메라|노트북|태블릿|안마기|전기|커피머신|에어프라이어|전자레인지|밥솥|블렌더|믹서/, "appliance"], [/인테리어|리빙|홈|가구|조명|침구|주방/, "interior"],
    [/상의|티셔츠|셔츠|블라우스|니트|스웨터|맨투맨|후드|탑/, "top"],
  ];
  for (const [re, c] of rules) if (re.test(t)) return c;
  return "";
}

function pick(seg: string, key: string) {
  const m = seg.match(new RegExp(`"${key}"\\s*:\\s*"?(-?[\\d.,]+)`));
  return m ? toInt(m[1]) : null;
}
function pickStr(seg: string, key: string) {
  const m = seg.match(new RegExp(`"${key}"\\s*:\\s*"([^"]{1,200})"`));
  return m ? decode(m[1]) : null;
}

async function page(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9", Accept: "text/html" }, redirect: "follow" });
  if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? "이 쇼핑몰은 자동으로 정보를 가져오는 걸 막고 있어요" : `쇼핑몰 응답 ${res.status}`);
  return await res.text();
}

async function wconcept(url: string) {
  const id = (url.match(/\/Product\/(\d+)/i) || [])[1];
  if (!id) throw new Error("W컨셉 상품 번호를 찾지 못했어요");
  const html = await page(`https://www.wconcept.co.kr/Product/${id}`);
  const m = new RegExp(`"itemCd"\\s*:\\s*"?${id}\\b`).exec(html);
  const seg = m ? html.slice(Math.max(0, m.index - 1500), m.index + 1500) : html;
  const catText = pickStr(html, "categoryName") || "";
  return {
    brand: pickStr(seg, "brandName") || pickStr(html, "brandName"),
    name: pickStr(seg, "itemName") || pickStr(html, "itemName"),
    price: pick(seg, "af_sale_price") ?? pick(seg, "original_price"),
    listPrice: pick(seg, "original_price") ?? pick(seg, "af_price"),
    category: catText, cat: guessCat(catText.split(">").slice(-2).join(" ")),
    image: meta(html, "og:image"),
  };
}

async function generic(url: string) {
  const html = await page(url);
  let price: number | null = null, brand: string | null = null, name: string | null = null, image: string | null = null;
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (o: any) => {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o)) return o.forEach(walk);
        const t = [].concat(o["@type"] || []);
        if (t.some((x: string) => /Product/i.test(x))) {
          name ??= o.name ? decode(String(o.name)) : null;
          brand ??= o.brand ? decode(String(typeof o.brand === "object" ? o.brand.name : o.brand)) : null;
          image ??= Array.isArray(o.image) ? o.image[0] : (typeof o.image === "object" ? o.image?.url : o.image) ?? null;
        }
        if (t.some((x: string) => /Offer/i.test(x))) price ??= toInt(o.price ?? o.lowPrice);
        Object.values(o).forEach(walk);
      };
      walk(JSON.parse(m[1]));
    } catch { /* 깨진 JSON-LD는 건너뛰어요 */ }
  }
  name ??= meta(html, "og:title");
  image ??= meta(html, "og:image");
  price ??= toInt(meta(html, "product:price:amount") || meta(html, "og:price:amount"));
  return { brand, name, price, listPrice: null, category: "", cat: guessCat(name || ""), image };
}

// 판매처 이미지를 우리 저장 공간으로 복사해요(판매처가 바깥 사이트의 이미지 사용을 막아도 보이게)
async function saveImage(admin: ReturnType<typeof createClient>, src: string) {
  const res = await fetch(src, { headers: { "User-Agent": UA, Referer: new URL(src).origin + "/" } });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") || "";
  if (!/^image\/(jpeg|png|webp|gif|avif)/i.test(type)) return null;
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > 6 * 1024 * 1024) return null;
  const ext = type.split("/")[1].replace("jpeg", "jpg").split(";")[0];
  const path = `auto/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 6)}.${ext}`;
  const { error } = await admin.storage.from("images").upload(path, buf, { contentType: type, upsert: false });
  if (error) return null;
  return admin.storage.from("images").getPublicUrl(path).data.publicUrl;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST로 보내 주세요" }, 405);
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY") || req.headers.get("apikey") || "";
    const userClient = createClient(SUPABASE_URL, anon, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
    const { data: isAdmin } = await userClient.rpc("is_admin");
    if (isAdmin !== true) return json({ error: "관리자로 로그인해야 쓸 수 있어요" }, 403);

    const { url } = await req.json();
    let u: URL;
    try { u = new URL(String(url)); } catch { return json({ error: "링크 형식이 아니에요" }, 400); }
    if (!/^https?:$/.test(u.protocol) || /^(localhost|\d+\.\d+\.\d+\.\d+|\[)/.test(u.hostname)) return json({ error: "쇼핑몰 상품 링크만 넣어 주세요" }, 400);

    const info = /(^|\.)wconcept\.co\.kr$/i.test(u.hostname) ? await wconcept(u.href) : await generic(u.href);
    let imageUrl: string | null = null;
    if (info.image && /^https?:\/\//i.test(info.image)) {
      const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      imageUrl = await saveImage(admin, info.image);
    }
    return json({ ...info, imageUrl });
  } catch (e) {
    return json({ error: (e as Error).message || "정보를 가져오지 못했어요" }, 200);
  }
});
