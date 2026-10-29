const CATS={top:"상의",outer:"아우터",bottom:"하의",dress:"원피스",bag:"가방",hat:"모자",shoes:"신발",jewelry:"주얼리",food:"식품",interior:"인테리어"};
const PLATS=["Netflix","TVING","Wavve","YouTube","Disney+","coupangplay","KBS","MBC","SBS","JTBC","tvN","기타"];
const SHAPE={
 top:'<path d="M30 22 42 15Q50 24 58 15L70 22 85 37 74 47 68 41V85H32V41L26 47 15 37Z"/>',
 outer:'<path d="M32 16 44 12 50 30 56 12 68 16 82 30 80 88H62L50 40 38 88H20L18 30Z"/>',
 bottom:'<path d="M31 12H69L74 88H56L50 40 44 88H26Z"/>',
 dress:'<path d="M40 10H60L57 32 78 88H22L43 32Z"/>',
 bag:'<path d="M36 40Q36 18 50 18Q64 18 64 40" fill="none" stroke-width="5"/><rect x="20" y="38" width="60" height="46" rx="8"/>',
 hat:'<path d="M20 62Q20 28 50 28Q80 28 80 62Z"/><path d="M14 62H86Q86 72 70 72H18Q12 72 14 62Z"/>',
 shoes:'<path d="M12 70V48Q12 42 20 42L40 44Q46 56 62 58L82 62Q90 64 90 72V76H12Z"/>',
 jewelry:'<circle cx="50" cy="58" r="22" fill="none" stroke-width="7"/><path d="M42 30 50 20 58 30 50 40Z"/>',
 food:'<path d="M18 40H70V60Q70 82 44 82Q18 82 18 60Z"/><path d="M70 46Q86 46 86 57Q86 68 70 67" fill="none" stroke-width="5"/><path d="M34 30Q30 22 36 16M48 30Q44 22 50 16" fill="none"/>',
 interior:'<path d="M34 14H66L80 48H20Z"/><path d="M50 48V82" fill="none" stroke-width="6"/><path d="M30 84H70" fill="none" stroke-width="7" stroke-linecap="round"/>'
};

const ICON={
 top:'<path d="M17 8 9 12 5 22 10 24 13 18V41H35V18L38 24 43 22 39 12 31 8 24 16Z"/><path d="M24 16V41"/><path class="auf" d="M24 17 20 14.5V19.5ZM24 17 28 14.5V19.5Z"/>',
 outer:'<path d="M16 7 8 12 6 42H42L40 12 32 7 24 16Z"/><path d="M16 7 21 20 24 16 27 20 32 7M8 27H40"/><rect class="au" x="21.5" y="25.5" width="5" height="3" rx=".6"/><circle class="auf" cx="20.5" cy="32" r="1.1"/><circle class="auf" cx="27.5" cy="32" r="1.1"/><circle class="auf" cx="20.5" cy="37" r="1.1"/><circle class="auf" cx="27.5" cy="37" r="1.1"/>',
 bottom:'<path d="M14 6H34L37 42H28L24 15 20 42H11Z"/><path d="M14.3 10H33.7M17.5 17 16 40M30.5 17 32 40"/><circle class="auf" cx="24" cy="8" r="1.1"/>',
 dress:'<path d="M19.5 4 20.5 12.5M28.5 4 27.5 12.5"/><path d="M20.5 12.5Q24 15 27.5 12.5L35 42H13Z"/><path d="M18.6 21Q24 23 29.4 21"/><path class="au" d="M14.5 37Q24 39.5 33.5 37"/>',
 bag:'<path d="M18 17V13Q18 8.5 24 8.5Q30 8.5 30 13V17"/><path d="M10 17H38L41 41H7Z"/><path d="M10 17 24 26 38 17"/><rect class="au" x="22" y="25" width="4" height="5" rx="1"/>',
 hat:'<path d="M14 30Q13.5 16 19 14.5Q24 18 29 14.5Q34.5 16 34 30"/><path d="M4 31Q24 25.5 44 31Q24 38 4 31Z"/><path class="au" d="M14.2 26.5Q24 28.8 33.8 26.5"/>',
 shoes:'<path d="M5 36Q5 31 11 31L21 32Q29 32 35 23L40 17Q43.5 15 43.5 19V27"/><path d="M5 36Q22 38.5 37 30L43.5 27"/><path class="au" d="M42.5 27.5 39.5 41"/>',
 jewelry:'<circle cx="24" cy="32" r="10"/><path class="au" d="M18 15 21 10H27L30 15 24 22ZM18 15H30M21 10 24 15 27 10M24 15V22"/>',
 food:'<path d="M9 12Q9 22 24 22Q39 22 39 12Z"/><path d="M24 22V38M15 40Q24 37 33 40"/><circle class="auf" cx="20" cy="16" r=".9"/><circle class="auf" cx="27" cy="15" r=".9"/><circle class="auf" cx="24" cy="18.5" r=".9"/>',
 interior:'<path class="au" d="M24 8Q20.5 13.5 24 17Q27.5 13.5 24 8Z"/><path d="M20 20H28V36H20ZM24 17V20"/><path d="M13 36H35Q35 41.5 24 41.5Q13 41.5 13 36Z"/>'
};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>typeof u==="string"&&/^(https?:\/\/|\/)/i.test(u);
const won=n=>typeof n==="number"&&isFinite(n)?n.toLocaleString("ko-KR")+"원":"가격 정보 없음";
const TONES=["#C26A55","#4F7A6B","#D2A45A","#5D6FA8","#5E9AB0","#8C4E8E","#A87A5C","#3E5470","#7FA35C","#B4566A","#8A5A3A","#6E7F94"];
const toneOf=s=>{let h=0;for(const ch of String(s||""))h=(h*31+ch.charCodeAt(0))>>>0;return TONES[h%TONES.length]};
const hex=c=>/^#[0-9a-f]{6}$/i.test(c||"")?c:"#C9A88A";
const colorOf=x=>/^#[0-9a-f]{6}$/i.test(x.color||"")?x.color:toneOf(x.title||x.name);
const norm=s=>String(s||"").replace(/\s/g,"").toLowerCase();
function shade(h,amt){h=hex(h);let n=parseInt(h.slice(1),16),c=v=>Math.max(0,Math.min(255,v));
  return "#"+((1<<24)+(c((n>>16)+amt)<<16)+(c((n>>8&255)+amt)<<8)+c((n&255)+amt)).toString(16).slice(1)}
const lum=h=>{const n=parseInt(hex(h).slice(1),16);return (n>>16)*.3+(n>>8&255)*.59+(n&255)*.11};
const md=iso=>{const d=new Date(iso);return isNaN(d)?"":`${d.getMonth()+1}월 ${d.getDate()}일`};

/* state */
/* Supabase: 공개(publishable) 키만 둡니다. 실제 권한은 수파베이스 보안 규칙(RLS)이 정해요. */
const SUPABASE_URL="https://zsguwckfbnglcwubmsor.supabase.co";
const SUPABASE_KEY="sb_publishable_sgNoVED5UXmYv85QtPZSlA_L8XzIpay";
const sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{flowType:"pkce",detectSessionInUrl:true,persistSession:true}}):null;
const S={items:[],shows:[],reports:[],itemsOk:false,showsOk:false,owner:false,noDb:false};
const toItem=r=>({id:r.id,brand:r.brand,name:r.name,cat:r.cat,price:r.price,person:r.person,showId:r.show_id,ep:r.ep,scene:r.scene,buyUrl:r.buy_url,imageUrl:r.image_url,createdAt:r.created_at,updatedAt:r.updated_at});
const toShow=r=>({id:r.id,title:r.title,platform:r.platform,ep:r.ep,posterUrl:r.poster_url,createdAt:r.created_at,updatedAt:r.updated_at});
const toReport=r=>({id:r.id,show:r.show,ep:r.ep,who:r.who,cat:r.cat,desc:r.descr,link:r.link,at:r.created_at});
let F={q:"",cat:"",show:"",person:""}, plat="전체", tab="items";
const showOf=id=>S.shows.find(s=>s.id===id)||{title:"알 수 없는 프로그램",platform:"",color:"#8A7A70"};
const byNew=(a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||""));

function thumb(it,cls=""){
  if(okUrl(it.imageUrl))return `<div class="th ${cls}"><img src="${esc(it.imageUrl)}" alt="" loading="lazy"></div>`;
  const c=colorOf(it),bg=lum(c)>150?shade(c,-40):shade(c,70);
  return `<div class="th ${cls}" style="background:linear-gradient(160deg,${bg},${shade(bg,-18)})">
  <svg viewBox="0 0 100 100" aria-hidden="true" fill="${c}" stroke="${shade(c,-60)}" stroke-width="2.5" stroke-linejoin="round">${SHAPE[it.cat]||SHAPE.top}</svg></div>`;
}
function poster(s,badges){
  const c=colorOf(s);
  return `<div class="poster" style="background:linear-gradient(135deg,${c},${shade(c,-70)})">${okUrl(s.posterUrl)?`<img src="${esc(s.posterUrl)}" alt="" loading="lazy">`:""}
  <div class="badge">${badges}</div>${okUrl(s.posterUrl)?"":`<span class="t">${esc(s.title)}</span>`}</div>`;
}
const sampleTag=x=>x.sample?' <span class="tag">예시</span>':"";

/* recent (this browser only) */
let recent=[];
try{recent=JSON.parse(localStorage.getItem("eodi_recent")||"[]");if(!Array.isArray(recent))recent=[]}catch(e){recent=[]}
function saveRecent(){try{localStorage.setItem("eodi_recent",JSON.stringify(recent))}catch(e){}}

/* ---------- site render ---------- */
function renderCats(){
  const cnt={};S.items.forEach(i=>cnt[i.cat]=(cnt[i.cat]||0)+1);
  $("#catList").innerHTML=Object.entries(CATS).map(([k,v])=>`<button class="cat" data-cat="${k}" aria-pressed="${F.cat===k}">
   <svg viewBox="0 0 48 48" aria-hidden="true">${ICON[k]}</svg>
   <b>${v}</b><small>${(cnt[k]||0).toLocaleString()}</small></button>`).join("");
}
function renderRecent(){
  const list=recent.map(id=>S.items.find(i=>i.id===id)).filter(Boolean);
  $("#recentCount").hidden=!list.length;$("#recentCount").textContent=list.length;
  $("#clearRecent").hidden=!list.length;
  $("#recentList").innerHTML=list.length?`<div class="rail">${list.map(it=>`<button class="mini" data-id="${esc(it.id)}">${thumb(it)}<b>${esc(it.brand)}</b><span>${esc(it.name)}</span></button>`).join("")}</div>`
   :`<p class="empty">아직 본 아이템이 없어요. 아래 착장을 눌러보면 여기에 차례로 모여요.</p>`;
}
function countFor(sid){return S.items.filter(i=>i.showId===sid).length}
function renderNewEps(){
  if(!S.showsOk){$("#newEps").innerHTML="";return}
  const list=[...S.shows].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||""))).slice(0,6);
  $("#newEps").innerHTML=list.length?`<div class="rail">${list.map(s=>`<button class="show" data-show="${esc(s.id)}">
   ${poster(s,`${s.ep?`<i class="new">NEW ${esc(s.ep)}</i>`:""}<i>${esc(s.platform)}</i>`)}
   <span class="meta"><strong>${esc(s.title)}${sampleTag(s)}</strong>${s.ep?esc(s.ep)+" 포함 ":""}착장 ${countFor(s.id)}개</span></button>`).join("")}</div>`
   :`<p class="empty">아직 등록된 프로그램이 없어요.</p>`;
}
function renderPeople(){
  const cnt={};S.items.forEach(i=>{if(i.person)cnt[i.person]=(cnt[i.person]||0)+1});
  const list=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  $("#peopleList").innerHTML=!S.itemsOk?"":list.length?list.map(([n,c])=>`<button class="person" data-person="${esc(n)}">${esc(n)}<small>${c}</small></button>`).join("")
   :`<p class="empty">아이템이 등록되면 인물이 여기에 모여요.</p>`;
  $("#personList").innerHTML=list.map(([n])=>`<option value="${esc(n)}">`).join("");
}
function renderItems(){
  const words=F.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list=S.items.filter(it=>{
    const hay=[it.brand,it.name,it.person,showOf(it.showId).title,CATS[it.cat],it.scene,it.ep].join(" ").toLowerCase();
    return words.every(w=>hay.includes(w))&&(!F.cat||it.cat===F.cat)&&(!F.show||it.showId===F.show)&&(!F.person||it.person===F.person);
  }).sort(byNew);
  let title="새로 올라온 착장",sub=`아이템 ${S.items.length}개`;
  if(F.q){title=`‘${F.q}’ 검색 결과`;sub=`아이템 ${list.length}개`}
  else if(F.show){title=showOf(F.show).title+" 착장";sub=`아이템 ${list.length}개`}
  else if(F.person){title=F.person+"의 착장";sub=`아이템 ${list.length}개`}
  else if(F.cat){title=CATS[F.cat]+" 착장";sub=`아이템 ${list.length}개`}
  if(F.cat&&(F.q||F.show||F.person))sub+=` · ${CATS[F.cat]}만`;
  $("#itemsTitle").textContent=title;$("#itemsSub").textContent=S.itemsOk?sub:"";
  $("#resetFilter").hidden=!(F.q||F.cat||F.show||F.person);
  if(!S.itemsOk&&!S.noDb){$("#itemGrid").innerHTML="";return}
  $("#itemGrid").innerHTML=S.noDb?`<p class="empty full">착장 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>`
   :list.length?list.map(it=>`<button class="item" data-id="${esc(it.id)}">${thumb(it)}
   <span class="br">${esc(it.brand)}${sampleTag(it)}</span><span class="nm">${esc(it.name)}</span><span class="pr">${won(it.price)}</span>
   <span class="who">${esc(it.person)} · ${esc(showOf(it.showId).title)}</span></button>`).join("")
   :`<p class="empty full">${S.items.length?"조건에 맞는 착장이 아직 없어요. 아래에서 제보해 주시면 확인해서 올려둘게요.":"아직 등록된 착장이 없어요."}</p>`;
}
function renderUps(){
  const ps=["전체",...new Set(S.shows.map(s=>s.platform).filter(Boolean))];
  if(!ps.includes(plat))plat="전체";
  $("#platTabs").innerHTML=S.shows.length?ps.map(p=>`<button class="chip" data-plat="${esc(p)}" aria-pressed="${p===plat}">${esc(p)} ${p==="전체"?S.shows.length:S.shows.filter(s=>s.platform===p).length}</button>`).join(""):"";
  const list=S.shows.filter(s=>plat==="전체"||s.platform===plat).sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
  $("#upCount").textContent=S.showsOk?`프로그램 ${S.shows.length}개`:"";
  $("#ups").innerHTML=list.map(s=>`<button class="show" data-show="${esc(s.id)}">${poster(s,`<i>${esc(s.platform)}</i>`)}
   <span class="meta"><strong>${esc(s.title)}${sampleTag(s)}</strong>${md(s.updatedAt)} 업데이트</span></button>`).join("");
}
function renderSite(){renderCats();renderRecent();renderNewEps();renderPeople();renderItems();renderUps();renderShowSelect()}

/* ---------- item modal ---------- */
function openItem(id){
  const it=S.items.find(i=>i.id===id);if(!it)return;
  recent=[id,...recent.filter(x=>x!==id)].slice(0,12);saveRecent();renderRecent();
  const s=showOf(it.showId);
  const same=S.items.filter(i=>i.person===it.person&&i.id!==it.id).slice(0,3);
  $("#ov").innerHTML=`<div class="md" role="dialog" aria-modal="true" aria-label="${esc(it.name)}">
   <button class="x" id="close" aria-label="닫기">×</button>${thumb(it)}
   <div class="bd"><span class="br">${esc(it.brand)}${sampleTag(it)}</span><h3>${esc(it.name)}</h3><span class="pr">${won(it.price)}</span>
   <dl><dt>인물</dt><dd>${esc(it.person)}</dd><dt>프로그램</dt><dd>${esc(s.title)}${it.ep?" · "+esc(it.ep):""}</dd>
   ${s.platform?`<dt>플랫폼</dt><dd>${esc(s.platform)}</dd>`:""}<dt>분류</dt><dd>${CATS[it.cat]||""}</dd></dl>
   ${it.scene?`<p class="scene">${esc(it.scene)}</p>`:""}
   ${okUrl(it.buyUrl)&&/^https?:/i.test(it.buyUrl)?`<a class="primary" href="${esc(it.buyUrl)}" target="_blank" rel="noopener noreferrer">구매처 보기</a>`:`<p class="note">구매처 정보가 아직 없어요.</p>`}
   ${same.length?`<div><b style="font-size:15px">${esc(it.person)}의 다른 착장</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">${same.map(x=>`<button class="mini" data-id="${esc(x.id)}">${thumb(x)}<span style="font-size:13px">${esc(x.name)}</span></button>`).join("")}</div></div>`:""}
   </div></div>`;
  $("#ov").hidden=false;$("#close").focus();document.body.style.overflow="hidden";
}
function closeItem(){$("#ov").hidden=true;$("#ov").innerHTML="";document.body.style.overflow=""}
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2800)}
function go(){document.getElementById("items").scrollIntoView({behavior:"smooth",block:"start"})}

/* ---------- data ---------- */
async function loadData(){
  if(!sb){S.noDb=true;renderSite();return}
  const [a,b]=await Promise.all([sb.from("items").select("*"),sb.from("shows").select("*")]);
  if(a.error||b.error){S.noDb=true;renderSite();return}
  S.noDb=false;S.items=a.data.map(toItem);S.shows=b.data.map(toShow);S.itemsOk=S.showsOk=true;
  renderSite();
  if(S.owner){await loadReports();renderAdmin()}
}
async function loadReports(){
  if(!sb||!S.owner)return;
  const {data,error}=await sb.from("reports").select("*").order("created_at",{ascending:false});
  if(!error)S.reports=data.map(toReport);
}

/* ---------- report submit ---------- */
$("#rCat").innerHTML=`<option value="">선택 안 함</option>`+Object.values(CATS).map(v=>`<option>${v}</option>`).join("");
$("#reqForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if(!sb){toast("지금은 제보를 보낼 수 없어요. 잠시 후 다시 시도해 주세요");return}
  const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;
  const r={show:$("#rShow").value.trim(),ep:$("#rEp").value.trim(),who:$("#rWho").value.trim(),
    cat:$("#rCat").value,descr:$("#rDesc").value.trim(),link:$("#rLink").value.trim()};
  const {error}=await sb.from("reports").insert(r);
  if(error)toast("제보를 보내지 못했어요. 잠시 후 다시 시도해 주세요");
  else{e.target.reset();toast("제보가 접수됐어요. 확인 후 등록할게요")}
  btn.disabled=false;
});

/* ---------- admin ---------- */
$("#iCat").innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
$("#sPlat").innerHTML=$("#iPlat").innerHTML=PLATS.map(p=>`<option>${p}</option>`).join("");
const findShow=t=>S.shows.find(s=>norm(s.title)===norm(t));
function renderShowSelect(){
  $("#showOptions").innerHTML=S.shows.map(s=>`<option value="${esc(s.title)}">`).join("");
  syncShowNote();
}
function syncShowNote(){
  const t=$("#iShow").value.trim(),s=t&&findShow(t);
  if(s){$("#iPlat").value=PLATS.includes(s.platform)?s.platform:"기타";$("#iPlat").disabled=true;$("#iShowNote").textContent="등록된 프로그램이에요."}
  else{$("#iPlat").disabled=false;$("#iShowNote").textContent=t?"새 프로그램이에요. 플랫폼을 고르면 저장할 때 함께 추가돼요.":"처음 입력하는 프로그램은 저장할 때 자동으로 추가돼요."}
}
$("#iShow").addEventListener("input",syncShowNote);
let editI=null,editS=null,iImg=null,sImg=null,armed=null;
function curImg(box,url,which){
  if(!okUrl(url)){$(box).hidden=true;$(box).innerHTML="";return}
  $(box).hidden=false;$(box).innerHTML=`<img src="${esc(url)}" alt=""><span class="note">현재 이미지</span><button type="button" class="ghost" data-rmimg="${which}">이미지 빼기</button>`;
}
function delBtn(kind,id){return `<button class="ghost danger" data-del="${kind}:${esc(id)}">${armed===kind+":"+id?"정말 삭제":"삭제"}</button>`}
function renderAdmin(){
  if(!S.owner)return;
  $$("#admTabs [data-tab]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tab===tab));
  $$("[data-panel]").forEach(p=>p.hidden=p.dataset.panel!==tab);
  $("#iList").innerHTML=S.items.length?[...S.items].sort(byNew).map(it=>`<div class="arow">${thumb(it)}
    <div style="min-width:0"><b>${esc(it.brand)} · ${esc(it.name)}</b><span>${esc(it.person)} · ${esc(showOf(it.showId).title)} ${esc(it.ep||"")} · ${won(it.price)}</span></div>
    <div class="btns"><button class="ghost" data-edit="item:${esc(it.id)}">수정</button>${delBtn("item",it.id)}</div></div>`).join("")
    :`<p class="empty">등록된 아이템이 없어요. 왼쪽에서 첫 아이템을 등록해 보세요.</p>`;
  $("#sList").innerHTML=S.shows.length?[...S.shows].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||""))).map(s=>`<div class="arow">
    <div class="pv" style="background:${colorOf(s)}">${okUrl(s.posterUrl)?`<img src="${esc(s.posterUrl)}" alt="">`:""}</div>
    <div style="min-width:0"><b>${esc(s.title)}</b><span>${esc(s.platform)} · ${esc(s.ep||"회차 없음")} · 아이템 ${countFor(s.id)}개</span></div>
    <div class="btns"><button class="ghost" data-edit="show:${esc(s.id)}">수정</button>${delBtn("show",s.id)}</div></div>`).join("")
    :`<p class="empty">등록된 프로그램이 없어요. 아이템을 올리면서 새 프로그램 이름을 쓰면 자동으로 추가돼요.</p>`;
  $("#rList").innerHTML=S.reports.length?S.reports.map(r=>`<div class="rep">
    <div class="top"><b>${esc(r.show)}</b><span>${esc(r.ep||"")}${r.who?" · "+esc(r.who):""}${r.cat?" · "+esc(r.cat):""} · ${md(r.at)}</span></div>
    <p>${esc(r.desc)}</p>
    ${okUrl(r.link)&&/^https?:/i.test(r.link)?`<a class="note" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">${esc(r.link)}</a>`:""}
    <div class="btns"><button class="ghost" data-fromrep="${esc(r.id)}">이 제보로 아이템 등록</button>
    <button class="ghost danger" data-done="${esc(r.id)}">처리 완료</button></div></div>`).join("")
    :`<p class="empty">아직 들어온 제보가 없어요. 방문자가 제보를 보내면 여기에 쌓여요.</p>`;
  const n=S.reports.length;
  ["#repCount","#repCount2"].forEach(s=>{$(s).hidden=!n;$(s).textContent=n});
}
function resetIForm(){editI=null;iImg=null;$("#iForm").reset();curImg("#iCur");$("#iFormTitle").textContent="아이템 등록";$("#iSubmit").textContent="등록하기";$("#iCancel").hidden=true;renderShowSelect()}
function resetSForm(){editS=null;sImg=null;$("#sForm").reset();curImg("#sCur");$("#sFormTitle").textContent="프로그램 등록";$("#sSubmit").textContent="등록하기";$("#sCancel").hidden=true}
async function upload(input){
  const f=input.files&&input.files[0];if(!f)return null;
  const ext=((f.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,""))||"jpg";
  const path=`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}.${ext}`;
  const {error}=await sb.storage.from("images").upload(path,f,{contentType:f.type||undefined,upsert:false});
  if(error)throw error;
  return sb.storage.from("images").getPublicUrl(path).data.publicUrl;
}
function dbErr(e){console.error(e);toast("저장하지 못했어요. 로그인 상태를 확인하고 다시 시도해 주세요")}
const must=r=>{if(r.error)throw r.error;return r};

$("#iForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!sb||!S.owner)return;
  const btn=$("#iSubmit");btn.disabled=true;
  try{
    const up=await upload($("#iImg"));
    const price=$("#iPrice").value===""?null:Math.round(+$("#iPrice").value);
    const now=new Date().toISOString();
    const prev=editI?S.items.find(i=>i.id===editI)||{}:{};
    const title=$("#iShow").value.trim(),ep=$("#iEp").value.trim();
    let show=findShow(title),made=false;
    if(!show){
      const r=must(await sb.from("shows").insert({title,platform:$("#iPlat").value,ep}).select().single());
      show={id:r.data.id};made=true;
    }
    const doc={brand:$("#iBrand").value.trim(),name:$("#iName").value.trim(),cat:$("#iCat").value,price,
      person:$("#iPerson").value.trim(),show_id:show.id,ep,scene:$("#iScene").value.trim(),
      buy_url:$("#iUrl").value.trim(),image_url:up||(iImg===false?"":(prev.imageUrl||"")),updated_at:now};
    if(editI)must(await sb.from("items").update(doc).eq("id",editI));else must(await sb.from("items").insert(doc));
    if(!made&&!editI)must(await sb.from("shows").update({updated_at:now,...(ep?{ep}:{})}).eq("id",show.id));
    toast((editI?"아이템을 수정했어요":"아이템을 등록했어요")+(made?` · ‘${title}’ 프로그램도 추가했어요`:""));resetIForm();
    await loadData();
  }catch(err){dbErr(err)}
  btn.disabled=false;
});
$("#sForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!sb||!S.owner)return;
  const btn=$("#sSubmit");btn.disabled=true;
  try{
    const up=await upload($("#sImg"));
    const now=new Date().toISOString();
    const prev=editS?S.shows.find(s=>s.id===editS)||{}:{};
    const doc={title:$("#sTitle").value.trim(),platform:$("#sPlat").value,ep:$("#sEp").value.trim(),
      poster_url:up||(sImg===false?"":(prev.posterUrl||""))};
    if(editS)must(await sb.from("shows").update(doc).eq("id",editS));else must(await sb.from("shows").insert({...doc,updated_at:now}));
    toast(editS?"프로그램을 수정했어요":"프로그램을 등록했어요");resetSForm();
    await loadData();
  }catch(err){dbErr(err)}
  btn.disabled=false;
});
$("#iCancel").addEventListener("click",resetIForm);
$("#sCancel").addEventListener("click",resetSForm);

function fillItem(it){
  editI=it.id;iImg=null;
  $("#iBrand").value=it.brand||"";$("#iName").value=it.name||"";$("#iCat").value=it.cat||"top";
  $("#iPrice").value=typeof it.price==="number"?it.price:"";$("#iPerson").value=it.person||"";
  $("#iShow").value=S.shows.find(s=>s.id===it.showId)?.title||"";syncShowNote();
  $("#iEp").value=it.ep||"";$("#iScene").value=it.scene||"";$("#iUrl").value=it.buyUrl||"";
  $("#iImg").value="";curImg("#iCur",it.imageUrl,"i");
  $("#iFormTitle").textContent="아이템 수정";$("#iSubmit").textContent="수정 저장";$("#iCancel").hidden=false;
  $("#iForm").scrollIntoView({behavior:"smooth",block:"start"});
}
function fillShow(s){
  editS=s.id;sImg=null;
  $("#sTitle").value=s.title||"";$("#sPlat").value=PLATS.includes(s.platform)?s.platform:"기타";$("#sEp").value=s.ep||"";
  $("#sImg").value="";curImg("#sCur",s.posterUrl,"s");
  $("#sFormTitle").textContent="프로그램 수정";$("#sSubmit").textContent="수정 저장";$("#sCancel").hidden=false;
  $("#sForm").scrollIntoView({behavior:"smooth",block:"start"});
}

/* ---------- login ---------- */
async function checkAdmin(session){
  if(!sb||!session){S.owner=false;return}
  const {data,error}=await sb.rpc("is_admin");
  S.owner=!error&&data===true;
}
async function applyAuth(session){
  const was=S.owner;
  await checkAdmin(session);
  $("#admLink").hidden=!S.owner;
  $("#loginNote").textContent=session&&!S.owner?"이 계정은 관리자가 아니에요. 관리자 이메일로 다시 로그인해 주세요.":"";
  if(S.owner&&!was){await loadReports();renderAdmin()}
  route();
}
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!sb)return;
  const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;
  const {error}=await sb.auth.signInWithOtp({email:$("#loginEmail").value.trim(),
    options:{emailRedirectTo:location.origin+location.pathname+"#admin"}});
  toast(error?"로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요":"메일함에서 로그인 링크를 눌러 주세요");
  btn.disabled=false;
});
$("#logout").addEventListener("click",async()=>{if(sb)await sb.auth.signOut();S.owner=false;S.reports=[];location.hash="";route()});

/* ---------- routing ---------- */
function route(){
  const adm=location.hash==="#admin";
  $("#site").hidden=adm;$("#admin").hidden=!adm;
  $("#login").hidden=!adm||S.owner;$("#admBody").hidden=!S.owner;
  if(adm){if(S.owner)renderAdmin();window.scrollTo(0,0)}
}
window.addEventListener("hashchange",route);

/* ---------- events ---------- */
document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.id==="close")return closeItem();
  if(b.dataset.id)return openItem(b.dataset.id);
  if(b.dataset.cat){F.cat=F.cat===b.dataset.cat?"":b.dataset.cat;renderCats();renderItems();if(F.cat)go();return}
  if(b.dataset.show){F={q:"",cat:"",show:b.dataset.show,person:""};$("#q").value="";renderCats();renderItems();go();return}
  if(b.dataset.person){F={q:"",cat:"",show:"",person:b.dataset.person};$("#q").value="";renderCats();renderItems();go();return}
  if(b.dataset.plat){plat=b.dataset.plat;renderUps();return}
  if(b.id==="resetFilter"){F={q:"",cat:"",show:"",person:""};$("#q").value="";renderCats();renderItems();return}
  if(b.id==="clearRecent"){recent=[];saveRecent();renderRecent();toast("최근 본 아이템을 지웠어요");return}
  if(b.dataset.tab){tab=b.dataset.tab;armed=null;renderAdmin();return}
  if(b.dataset.rmimg){if(b.dataset.rmimg==="i"){iImg=false;curImg("#iCur")}else{sImg=false;curImg("#sCur")}return}
  if(b.dataset.edit){const [k,id]=b.dataset.edit.split(":");
    if(k==="item"){const it=S.items.find(i=>i.id===id);if(it)fillItem(it)}else{const s=S.shows.find(x=>x.id===id);if(s)fillShow(s)}return}
  if(b.dataset.del){
    const key=b.dataset.del,[k,id]=key.split(":");
    if(armed!==key){armed=key;renderAdmin();return}
    armed=null;
    if(k==="show"&&countFor(id)){toast(`이 프로그램에 아이템 ${countFor(id)}개가 있어요. 아이템을 먼저 지워 주세요`);renderAdmin();return}
    try{must(await sb.from(k==="item"?"items":"shows").delete().eq("id",id));toast("삭제했어요");
      if(k==="item"&&editI===id)resetIForm();if(k==="show"&&editS===id)resetSForm();await loadData()}catch(err){dbErr(err)}
    return}
  if(b.dataset.fromrep){const r=S.reports.find(x=>x.id===b.dataset.fromrep);if(!r)return;
    tab="items";renderAdmin();resetIForm();
    $("#iPerson").value=r.who||"";$("#iEp").value=r.ep||"";$("#iScene").value=r.desc||"";
    const ck=Object.keys(CATS).find(k=>CATS[k]===r.cat);if(ck)$("#iCat").value=ck;
    const s=findShow(r.show);$("#iShow").value=s?s.title:(r.show||"");syncShowNote();
    toast(s?"제보 내용을 채웠어요. 브랜드와 상품명을 넣어 주세요":"제보 내용을 채웠어요. 새 프로그램이라 플랫폼도 골라 주세요");
    $("#iForm").scrollIntoView({behavior:"smooth",block:"start"});return}
  if(b.dataset.done){b.disabled=true;
    try{must(await sb.from("reports").delete().eq("id",b.dataset.done));await loadReports();renderAdmin();toast("처리 완료로 제보함에서 뺐어요")}
    catch(err){dbErr(err);b.disabled=false}return}
});
$("#ov").addEventListener("click",e=>{if(e.target.id==="ov")closeItem()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#ov").hidden)closeItem()});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();F={q:$("#q").value,cat:"",show:"",person:""};renderCats();renderItems();go()});
$("#q").addEventListener("input",()=>{F.q=$("#q").value;F.show="";F.person="";renderItems()});

/* ---------- boot ---------- */
renderSite();
route();
(async()=>{
  if(!sb){S.noDb=true;renderSite();return}
  const {data}=await sb.auth.getSession();
  await applyAuth(data.session);
  sb.auth.onAuthStateChange((_ev,session)=>{setTimeout(()=>applyAuth(session),0)});
  await loadData();
})();
