// 수파베이스 데이터를 backup/ 폴더에 JSON으로 저장해요. 깃허브 자동 작업(backup.yml)이 매일 실행하고,
// 결과는 이 저장소의 backup 브랜치에 날짜별 기록으로 남아요.
// 제보(reports)는 방문자가 보낸 비공개 내용이라, 공개 저장소에는 넣지 않아요.
import { mkdir, writeFile } from "node:fs/promises";

const URL_ = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!URL_ || !KEY) { console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 비밀값이 없어요."); process.exit(1); }

async function all(table) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${URL_}/rest/v1/${table}?select=*&order=created_at.asc`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

const dir = process.argv[2] || "backup";
await mkdir(dir, { recursive: true });
const summary = {};
for (const t of ["shows", "people", "items"]) {
  const rows = await all(t);
  await writeFile(`${dir}/${t}.json`, JSON.stringify(rows, null, 1) + "\n");
  summary[t] = rows.length;
}
console.log("백업:", Object.entries(summary).map(([k, v]) => `${k} ${v}개`).join(", "));
