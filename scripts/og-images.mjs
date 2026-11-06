// 카톡·SNS 공유 이미지(1200×630)와 인스타 카드(1080×1350)를 만들어요.
// 사이트를 만들 때 크롬을 한 번 켜서, 페이지마다 카드 그림을 찍어 og.jpg로 저장해요.
// 크롬이 없거나 실패하면 그 페이지는 예전처럼 상품 사진을 공유 이미지로 써요.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// 깃허브에서 돌 때는 문제를 공개 경고(::warning::)로 남겨 배포 화면에서 바로 보이게 해요
const warn = m => console.log((process.env.GITHUB_ACTIONS ? "::warning::" : "") + m);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const CSS = `*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden;background:#1A1613}
body{font-family:"Noto Sans KR",sans-serif;color:#F4EFE6;word-break:keep-all;overflow-wrap:anywhere}
.og{width:1200px;height:630px;display:grid}
.brand{font-size:30px;font-weight:900;color:#E8C18C;letter-spacing:-.5px}
.url{margin-top:auto;font-size:22px;color:#8d8275;letter-spacing:.5px}
.clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
/* 제품 */
.item{grid-template-columns:560px 1fr}
.item .pic{background:#F4EFE6;display:flex;align-items:center;justify-content:center}
.item .pic img{width:480px;height:540px;object-fit:contain}
.item .r{display:flex;flex-direction:column;padding:60px 60px 54px;min-width:0}
.item .where{margin-top:auto;font-size:25px;color:#b9ad9d;font-weight:500;-webkit-line-clamp:1}
.item .bd{font-weight:900;letter-spacing:-2px;line-height:1.1;margin:10px 0 8px;-webkit-line-clamp:2}
.item .pn{font-size:31px;font-weight:500;line-height:1.35;-webkit-line-clamp:3}
.item .pr{font-size:34px;font-weight:700;color:#E8C18C;margin-top:22px}
.item .pr span{color:#b9ad9d;font-weight:500;font-size:26px;margin-left:10px}
/* 인물·프로그램 */
.group{grid-template-columns:1fr 520px;gap:48px;padding:64px 64px 56px 72px}
.group .l{display:flex;flex-direction:column;min-width:0}
.group .kind{margin-top:auto;font-size:26px;font-weight:500;color:#b9ad9d}
.group h1{font-weight:900;letter-spacing:-2px;line-height:1.08;margin:6px 0 14px;-webkit-line-clamp:2}
.group .cnt{font-size:40px;font-weight:700;letter-spacing:-1px}
.group .cnt em{font-style:normal;color:#E8C18C}
.group .sub{font-size:24px;color:#b9ad9d;margin-top:14px;-webkit-line-clamp:2}
.g{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:16px;height:502px}
.g div{background:#F4EFE6;border-radius:20px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.g img{width:88%;height:88%;object-fit:contain}
.g .more{background:#2b241f;color:#E8C18C;font-size:44px;font-weight:900}
.g.n1 div{grid-column:1/-1;grid-row:1/-1}
.g.n2 div{grid-row:1/-1}
.g.n3 div:first-child{grid-row:1/-1}`;

const shell = (body, css = CSS) => `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&display=block">
<style>${css}</style></head><body>${body}</body></html>`;

// 인스타 카드: 위에 상품 사진, 아래에 프로그램·인물·브랜드·상품명·가격 (세로 4:5)
const INSTA_CSS = `*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1350px;overflow:hidden;background:#1A1613}
body{font-family:"Noto Sans KR",sans-serif;color:#F4EFE6;word-break:keep-all;overflow-wrap:anywhere}
.ig{width:1080px;height:1350px;display:flex;flex-direction:column;padding:56px 64px 54px}
.pic{height:830px;background:#F4EFE6;border-radius:32px;display:flex;align-items:center;justify-content:center;flex:none}
.pic img{width:700px;height:750px;object-fit:contain}
.clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
.where{margin-top:40px;font-size:30px;color:#b9ad9d;font-weight:500;-webkit-line-clamp:1}
.bd{font-weight:900;letter-spacing:-2px;line-height:1.1;margin:8px 0 6px;-webkit-line-clamp:1}
.pn{font-size:34px;font-weight:500;line-height:1.35;-webkit-line-clamp:2}
.pr{font-size:40px;font-weight:700;color:#E8C18C;margin-top:18px}
.pr span{color:#b9ad9d;font-weight:500;font-size:30px;margin-left:12px}
.ft{margin-top:auto;display:flex;justify-content:space-between;align-items:baseline}
.brand{font-size:34px;font-weight:900;color:#E8C18C;letter-spacing:-.5px}
.url{font-size:26px;color:#8d8275;letter-spacing:.5px}`;
export function instaCard({ image, where, brand, name, price, shop }) {
  const bs = fit(brand, [[8, 76], [12, 62], [18, 50], [99, 40]]);
  return shell(`<div class="ig"><div class="pic"><img src="${esc(image)}"></div>
${where ? `<div class="where clamp">${esc(where)}</div>` : `<div style="margin-top:40px"></div>`}
<div class="bd clamp" style="font-size:${bs}px">${esc(brand)}</div>
<div class="pn clamp">${esc(name)}</div>
${price ? `<div class="pr">${esc(price)}${shop ? `<span>${esc(shop)}</span>` : ""}</div>` : ""}
<div class="ft"><div class="brand">어디꺼야?</div><div class="url">wherefrom.store</div></div></div>`, INSTA_CSS);
}

// 글자 수에 맞춰 큰 글씨 크기를 줄여요 (긴 이름도 두 줄 안에)
const fit = (s, sizes) => { const n = [...String(s)].length; return sizes.find(([max]) => n <= max)?.[1] ?? sizes[sizes.length - 1][1]; };

/** 제품 카드: 왼쪽 상품 사진, 오른쪽 프로그램·인물·브랜드·상품명·가격 */
export function itemCard({ image, where, brand, name, price, shop }) {
  const bs = fit(brand, [[6, 66], [10, 54], [16, 44], [99, 36]]);
  return shell(`<div class="og item"><div class="pic"><img src="${esc(image)}"></div><div class="r">
<div class="brand">어디꺼야?</div>
${where ? `<div class="where clamp">${esc(where)}</div>` : `<div style="margin-top:auto"></div>`}
<div class="bd clamp" style="font-size:${bs}px">${esc(brand)}</div>
<div class="pn clamp">${esc(name)}</div>
${price ? `<div class="pr">${esc(price)}${shop ? `<span>${esc(shop)}</span>` : ""}</div>` : ""}
<div class="url">wherefrom.store</div></div></div>`);
}

/** 인물·프로그램 카드: 왼쪽 이름과 개수, 오른쪽 상품 사진 최대 4칸 */
export function groupCard({ kind, title, count, sub, images }) {
  const hs = fit(title, [[3, 92], [5, 80], [7, 66], [10, 54], [99, 44]]);
  const imgs = images.slice(0, count > 4 ? 3 : 4);
  const tiles = imgs.map(s => `<div><img src="${esc(s)}"></div>`).join("") + (count > 4 ? `<div class="more">+${count - 3}</div>` : "");
  const n = imgs.length + (count > 4 ? 1 : 0);
  return shell(`<div class="og group"><div class="l">
<div class="brand">어디꺼야?</div>
<div class="kind">${esc(kind)}</div>
<h1 class="clamp" style="font-size:${hs}px">${esc(title)}</h1>
<div class="cnt">방송 속 아이템 <em>${count}개</em></div>
${sub ? `<div class="sub clamp">${esc(sub)}</div>` : ""}
<div class="url">wherefrom.store</div></div>
<div class="g n${Math.min(n, 4)}">${tiles}</div></div>`);
}

const CHROMES = [process.env.CHROME_PATH, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium-browser", "/usr/bin/chromium",
  "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];

/**
 * jobs: [{ html, file, w?, h? }] → 성공한 file 목록(Set)  (크기를 안 주면 1200×630)
 * 그림이 하나라도 안 불러와지면 그 카드는 실패로 쳐요(빈 칸 있는 이미지를 올리지 않게).
 */
export async function renderOg(jobs) {
  const ok = new Set();
  const bin = CHROMES.find(p => p && existsSync(p));
  if (!jobs.length) return ok;
  if (!bin) { warn("크롬을 찾지 못해 공유 이미지를 만들지 않았어요."); return ok; }
  const dir = await mkdtemp(join(tmpdir(), "og-"));
  const proc = spawn(bin, ["--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--no-first-run",
    "--remote-debugging-port=0", `--user-data-dir=${dir}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  let ws;
  try {
    const wsUrl = await new Promise((res, rej) => {
      let buf = "";
      const t = setTimeout(() => rej(new Error("크롬이 켜지지 않아요")), 30000);
      proc.stderr.on("data", d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
      proc.on("exit", () => rej(new Error("크롬이 바로 꺼졌어요")));
    });
    ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("크롬에 연결하지 못했어요")); });
    let seq = 0;
    const pending = new Map(), waiters = [];
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
      else if (m.method) for (const w of [...waiters]) if (w.method === m.method) { waiters.splice(waiters.indexOf(w), 1); w.res(m.params); }
    };
    const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
    const once = (method, ms) => new Promise((res, rej) => { const w = { method, res }; waiters.push(w); setTimeout(() => { const i = waiters.indexOf(w); if (i >= 0) { waiters.splice(i, 1); rej(new Error("시간 초과")); } }, ms); });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    await send("Page.enable", {}, sessionId);
    let size = "";

    let i = 0;
    for (const job of jobs) {
      try {
        const w = job.w || 1200, h = job.h || 630;
        if (size !== `${w}x${h}`) { await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false }, sessionId); size = `${w}x${h}`; }
        const f = join(dir, `card${i++}.html`);
        await writeFile(f, job.html);
        const loaded = once("Page.loadEventFired", 20000);
        await send("Page.navigate", { url: pathToFileURL(f).href }, sessionId);
        await loaded;
        const { result } = await send("Runtime.evaluate", {
          awaitPromise: true, returnByValue: true,
          expression: `Promise.race([
            document.fonts.ready.then(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})))).then(()=>[...document.images].every(i=>i.naturalWidth>0)),
            new Promise(r=>setTimeout(()=>r(false),15000))])`,
        }, sessionId);
        if (!result.value) { warn(`공유 이미지: 사진을 못 불러와 건너뛰어요 (${job.file})`); continue; }
        const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 88, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } }, sessionId);
        await writeFile(job.file, Buffer.from(data, "base64"));
        ok.add(job.file);
      } catch (e) { warn(`공유 이미지 실패 (${job.file}): ${e.message}`); }
    }
  } catch (e) {
    warn(`공유 이미지를 만들지 못했어요 (${bin}): ${e.message}`);
  } finally {
    try { ws?.close(); } catch {}
    proc.kill();
    await new Promise(r => setTimeout(r, 500));
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
  return ok;
}
