const CATS={top:"상의",outer:"아우터",bottom:"하의",dress:"원피스",bag:"가방",hat:"모자",shoes:"신발",jewelry:"주얼리",beauty:"뷰티",food:"식품",interior:"인테리어"};
const PLATS=["Netflix","TVING","Wavve","YouTube","Disney+","coupangplay","KBS","MBC","SBS","JTBC","tvN","Instagram","공항패션","출근룩","행사·포토콜","화보·광고","기타"];
const SHAPE={
 top:'<path d="M30 22 42 15Q50 24 58 15L70 22 85 37 74 47 68 41V85H32V41L26 47 15 37Z"/>',
 outer:'<path d="M32 16 44 12 50 30 56 12 68 16 82 30 80 88H62L50 40 38 88H20L18 30Z"/>',
 bottom:'<path d="M31 12H69L74 88H56L50 40 44 88H26Z"/>',
 dress:'<path d="M40 10H60L57 32 78 88H22L43 32Z"/>',
 bag:'<path d="M36 40Q36 18 50 18Q64 18 64 40" fill="none" stroke-width="5"/><rect x="20" y="38" width="60" height="46" rx="8"/>',
 hat:'<path d="M20 62Q20 28 50 28Q80 28 80 62Z"/><path d="M14 62H86Q86 72 70 72H18Q12 72 14 62Z"/>',
 shoes:'<path d="M12 70V48Q12 42 20 42L40 44Q46 56 62 58L82 62Q90 64 90 72V76H12Z"/>',
 jewelry:'<circle cx="50" cy="58" r="22" fill="none" stroke-width="7"/><path d="M42 30 50 20 58 30 50 40Z"/>',
 beauty:'<rect x="36" y="50" width="28" height="38" rx="3"/><path d="M40 50V28L60 16V50Z"/>',
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
 beauty:'<path d="M18 24H30V42H18Z"/><path class="au" d="M20 24V13L28 8V24"/><path d="M18 30H30"/>',
 food:'<path d="M9 12Q9 22 24 22Q39 22 39 12Z"/><path d="M24 22V38M15 40Q24 37 33 40"/><circle class="auf" cx="20" cy="16" r=".9"/><circle class="auf" cx="27" cy="15" r=".9"/><circle class="auf" cx="24" cy="18.5" r=".9"/>',
 interior:'<path class="au" d="M24 8Q20.5 13.5 24 17Q27.5 13.5 24 8Z"/><path d="M20 20H28V36H20ZM24 17V20"/><path d="M13 36H35Q35 41.5 24 41.5Q13 41.5 13 36Z"/>'
};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const okUrl=u=>typeof u==="string"&&/^(https?:\/\/|\/)/i.test(u);
const won=n=>typeof n==="number"&&isFinite(n)?n.toLocaleString("ko-KR")+"원":"가격 정보 없음";
const hasNum=n=>typeof n==="number"&&isFinite(n);
const offPct=it=>hasNum(it.listPrice)&&hasNum(it.price)&&it.listPrice>it.price?Math.round((1-it.price/it.listPrice)*100):0;
function priceHtml(it){
  const p=offPct(it);
  return p?`<s class="was">${won(it.listPrice)}</s> <b class="off">${p}%</b> ${won(it.price)}`:won(it.price);
}
function priceNote(it){
  if(it.priceCheckedAt)return `${md(it.priceCheckedAt)} 판매처 기준 · 가격은 바뀔 수 있어요`;
  return "등록할 때 가격이에요. 판매처에서 확인해 주세요";
}
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
/* 방문자 통계(GoatCounter): 가입할 때 정한 코드를 넣으면 켜져요. 비워 두면 아무것도 세지 않아요. */
const GOATCOUNTER="eodikkeoya";
const BASE_PATH=location.pathname.replace(/[^/]*$/,"");
function track(path,title,event){
  try{if(!GOATCOUNTER||location.hash==="#admin"||!window.goatcounter||!window.goatcounter.count)return;
    window.goatcounter.count({path,title:title||path,event:!!event})}catch(e){}
}
if(GOATCOUNTER&&location.hash!=="#admin"){
  const g=document.createElement("script");g.async=true;g.src="https://gc.zgo.at/count.js";
  g.dataset.goatcounter=`https://${GOATCOUNTER}.goatcounter.com/count`;document.head.appendChild(g);
}
const sb=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{flowType:"pkce",detectSessionInUrl:true,persistSession:true}}):null;
const S={items:[],shows:[],reports:[],people:[],itemsOk:false,showsOk:false,owner:false,noDb:false};
const toItem=r=>({id:r.id,brand:r.brand,name:r.name,cat:r.cat,price:r.price,listPrice:r.list_price,couponPrice:r.coupon_price,priceCheckedAt:r.price_checked_at,priceCheckFailed:!!r.price_check_failed,person:r.person,personId:r.person_id,verify:r.verify||"guess",sceneTime:r.scene_time||"",links:Array.isArray(r.links)?r.links:[],buyAffiliate:!!r.buy_affiliate,showId:r.show_id,ep:r.ep,scene:r.scene,buyUrl:r.buy_url,imageUrl:r.image_url,createdAt:r.created_at,updatedAt:r.updated_at});
const toPerson=r=>({id:r.id,name:r.name});
const VERIFY={official:"동일 제품",similar:"비슷한 제품",guess:"확인 중"};
const SHOPS=[[/wconcept\.co\.kr$/,"W컨셉"],[/musinsa\.com$/,"무신사"],[/29cm\.co\.kr$/,"29CM"],[/coupang\.com$/,"쿠팡"],[/(smartstore|brand|shopping)\.naver\.com$/,"네이버"],[/zigzag\.kr$/,"지그재그"],[/a-bly\.com$/,"에이블리"],[/kream\.co\.kr$/,"KREAM"],[/ssg\.com$/,"SSG"],[/lotteon\.com$/,"롯데온"],[/hago\.kr$/,"하고"],[/wadiz\.kr$/,"와디즈"]];
function shopName(url){try{const h=new URL(url).hostname.replace(/^(www|m)\./,"");const f=SHOPS.find(([re])=>re.test(h));return f?f[1]:h}catch(e){return "구매처"}}
const httpUrl=u=>typeof u==="string"&&/^https?:\/\//i.test(u);
function buyLinks(it){
  const out=[];
  if(httpUrl(it.buyUrl))out.push({shop:shopName(it.buyUrl),url:it.buyUrl,aff:it.buyAffiliate,main:true,price:hasNum(it.price)?it.price:null,checked:it.priceCheckedAt});
  for(const l of it.links||[])if(l&&httpUrl(l.url))out.push({shop:(l.shop||"").trim()||shopName(l.url),url:l.url,aff:!!l.aff,price:hasNum(l.price)?l.price:null,checked:l.checked_at||null});
  const priced=out.filter(l=>hasNum(l.price));
  if(priced.length>1){const min=Math.min(...priced.map(l=>l.price));priced.forEach(l=>{if(l.price===min)l.lowest=true})}
  return out;
}
/* 카드·상세 창 맨 위 가격: 대표 링크가 가장 싸면 할인 표시 그대로, 다른 구매처가 더 싸면 "최저" 가격 */
function topPriceHtml(it){
  const ps=buyLinks(it).map(l=>l.price).filter(hasNum);
  if(!ps.length)return priceHtml(it);
  const min=Math.min(...ps);
  if(hasNum(it.price)&&it.price<=min)return priceHtml(it);
  return `<b class="off">최저</b> ${won(min)}`;
}
const vfTag=it=>`<span class="vf vf-${esc(it.verify)}">${VERIFY[it.verify]||"확인 중"}</span>`;
const sceneText=it=>it.ep||"";
const toShow=r=>({id:r.id,title:r.title,platform:r.platform,ep:r.ep,posterUrl:r.poster_url,createdAt:r.created_at,updatedAt:r.updated_at});
const toReport=r=>({id:r.id,show:r.show,ep:r.ep,who:r.who,cat:r.cat,desc:r.descr,link:r.link,at:r.created_at,auto:r.source==="auto",brand:r.brand||"",name:r.name||""});
let F={q:"",cat:"",show:"",person:""}, plat="전체", tab="items";
/* 인물·아이템은 처음에 몇 개만 보여주고 '전체 보기'로 펼쳐요 (PC 12개, 휴대폰 8개) */
const phoneMQ=matchMedia("(max-width:560px)");
const firstN=()=>phoneMQ.matches?8:12;
let allPeople=false,allItems=false,itemsKey="";
function moreBtn(box,kind,open,total,unit){
  $(box).innerHTML=total>firstN()?`<button class="ghost more-all" data-all="${kind}" aria-expanded="${open}">${open?"접기":`전체 보기 (${total.toLocaleString()}${unit})`}</button>`:"";
}
phoneMQ.addEventListener("change",()=>{renderPeople();renderItems();renderRecent();renderUps()});
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
  return `<div class="poster" style="background:linear-gradient(135deg,${c},${shade(c,-70)})">${okUrl(s.posterUrl)?`<img class="pbg" src="${esc(s.posterUrl)}" alt="" loading="lazy" aria-hidden="true"><img class="pfg" src="${esc(s.posterUrl)}" alt="${esc(s.title)} 포스터" loading="lazy">`:""}
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
   <b>${v}</b>${cnt[k]?`<small>${cnt[k].toLocaleString()}</small>`:""}</button>`).join("");
}
function itemCard(it){
  return `<button class="item" data-id="${esc(it.id)}">${thumb(it)}
   <span class="br">${esc(it.brand)}${sampleTag(it)} ${vfTag(it)}</span><span class="nm">${esc(it.name)}</span><span class="pr">${topPriceHtml(it)}</span>
   <span class="who">${esc(it.person)} · ${esc(showOf(it.showId).title)}</span></button>`;
}
/* 옆으로 넘기는 줄(PC·태블릿): 넘칠 때만 화살표를 보이고, 끝에 닿으면 그쪽 화살표를 흐리게 */
function railNav(id){
  const el=document.getElementById(id),nav=document.querySelector(`.rail-nav[data-rail="${id}"]`);
  if(!nav)return;
  const on=!!el&&!phoneMQ.matches&&el.scrollWidth>el.clientWidth+2;
  nav.hidden=!on;if(!on)return;
  const [prev,next]=nav.querySelectorAll("button");
  prev.disabled=el.scrollLeft<=2;next.disabled=el.scrollLeft+el.clientWidth>=el.scrollWidth-2;
  if(!el.dataset.navBound){el.dataset.navBound="1";el.addEventListener("scroll",()=>railNav(id),{passive:true})}
}
let itemsTotal=0;
/* PC: '전체 보기'는 제목 옆 ‹ › 왼쪽에. 펼쳤을 때는 목록 맨 아래에도 '접기'를 하나 더 */
function pcItemsMore(){
  const top=$("#itemsMoreTop"),el=$("#itemGrid"),over=el.scrollWidth>el.clientWidth+2;
  top.innerHTML=over&&itemsTotal?`<button class="ghost more-all in-head" data-all="items">${phoneMQ.matches?"전체 보기 ›":`전체 보기 (${itemsTotal.toLocaleString()}개)`}</button>`:"";
  $("#itemsMore").innerHTML="";
}
window.addEventListener("resize",()=>{railNav("itemGrid");railNav("recentRail");pcItemsMore();railNav("ups");upsMore()});
const RECENT_MAX=30,RECENT_MAIN=12;
function renderRecent(){
  const all=recent.map(id=>S.items.find(i=>i.id===id)).filter(Boolean),list=all.slice(0,RECENT_MAIN);
  const c=$("#seenCount");if(c){c.hidden=!all.length;c.textContent=all.length}
  if(curView==="seen")renderSeen();
  $("#clearRecent").hidden=!list.length;
  $("#recentList").innerHTML=!list.length?`<p class="empty">아직 본 아이템이 없어요. 아이템을 눌러보면 여기에 차례로 모여요.</p>`
   :phoneMQ.matches?`<div class="rail">${list.map(it=>`<button class="mini" data-id="${esc(it.id)}">${thumb(it)}<b>${esc(it.brand)}</b><span>${esc(it.name)}</span></button>`).join("")}</div>`
   :`<div class="items hrail" id="recentRail">${list.map(itemCard).join("")}${all.length>RECENT_MAIN?`<button type="button" class="rail-end rail-end-items" data-all="seen"><b>전체 보기</b><small>${all.length}개 모두 보기 ›</small></button>`:""}</div>`;
  railNav("recentRail");
}
function countFor(sid){return S.items.filter(i=>i.showId===sid).length}
function renderPeople(){
  const cnt={};S.items.forEach(i=>{if(i.person)cnt[i.person]=(cnt[i.person]||0)+1});
  const list=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  $("#peopleList").innerHTML=!S.itemsOk?"":list.length?list.slice(0,firstN()).map(([n,c])=>`<button class="person" data-person="${esc(n)}">${esc(n)}<small>${c}</small></button>`).join("")
   :`<p class="empty">아이템이 등록되면 인물이 여기에 모여요.</p>`;
  $("#peopleMore").innerHTML="";
  $("#peopleMoreTop").innerHTML=S.itemsOk&&list.length>firstN()?`<button class="ghost more-all in-head" data-all="people">${phoneMQ.matches?"전체 보기 ›":`전체 보기 (${list.length.toLocaleString()}명)`}</button>`:"";
  $("#personList").innerHTML=(S.peopleOk?S.people.map(p=>p.name):list.map(([n])=>n)).map(n=>`<option value="${esc(n)}">`).join("");
}
function filteredItems(ignoreCat){
  const words=F.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return S.items.filter(it=>{
    const hay=[it.brand,it.name,it.person,showOf(it.showId).title,CATS[it.cat],it.scene,it.ep].join(" ").toLowerCase();
    return words.every(w=>hay.includes(w))&&(ignoreCat||!F.cat||it.cat===F.cat)&&(!F.show||it.showId===F.show)&&(!F.person||it.person===F.person);
  }).sort(byNew);
}
function renderItems(){
  const list=filteredItems();
  let title="새로 올라온 아이템",sub=`아이템 ${S.items.length}개`;
  if(F.q){title=`‘${F.q}’ 검색 결과`;sub=`아이템 ${list.length}개`}
  else if(F.show){title=showOf(F.show).title+" 아이템";sub=`아이템 ${list.length}개`}
  else if(F.person){title=F.person+"의 아이템";sub=`아이템 ${list.length}개`}
  else if(F.cat){title=CATS[F.cat]+" 아이템";sub=`아이템 ${list.length}개`}
  if(F.cat&&(F.q||F.show||F.person))sub+=` · ${CATS[F.cat]}만`;
  $("#itemsTitle").textContent=title;$("#itemsSub").textContent=S.itemsOk?sub:"";
  $("#resetFilter").hidden=!(F.q||F.cat||F.show||F.person);
  const key=JSON.stringify(F),keyChanged=key!==itemsKey;if(keyChanged){itemsKey=key;allItems=false}
  $("#itemsMore").innerHTML="";
  if(!S.itemsOk&&!S.noDb)return; /* 데이터가 오기 전에는 미리 넣어 둔 목록을 그대로 둬요 */
  $("#itemGrid").innerHTML=S.noDb?`<p class="empty full">아이템 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>`
   :list.length?list.slice(0,RAIL_MAX).map(itemCard).join("")+(list.length>RAIL_MAX?railEnd("items",list.length,"개"):"")
   :`<p class="empty full">${S.items.length?"조건에 맞는 아이템이 아직 없어요. 아래에서 제보해 주시면 확인해서 올려둘게요.":"아직 등록된 아이템이 없어요."}</p>`;
  if(keyChanged)$("#itemGrid").scrollLeft=0;
  $("#itemGrid").classList.toggle("expanded",allItems&&!phoneMQ.matches);
  itemsTotal=S.itemsOk&&!S.noDb?list.length:0;
  railNav("itemGrid");pcItemsMore();
}
function showCard(s){
  return `<button class="show" data-show="${esc(s.id)}">${poster(s,`${s.ep?`<i class="new">NEW ${esc(s.ep)}</i>`:""}<i>${esc(s.platform)}</i>`)}
   <span class="meta"><strong>${esc(s.title)}${sampleTag(s)}</strong>아이템 ${countFor(s.id)}개 · ${md(s.updatedAt)} 업데이트</span></button>`;
}
/* 최근 업데이트: 한 줄이 넘칠 때만 제목 옆 '전체 보기' (PC는 개수, 휴대폰은 짧게) */
const RAIL_MAX=20; /* 메인 한 줄에 그리는 최대 개수 */
const railEnd=(kind,n,unit)=>`<button type="button" class="rail-end rail-end-${kind}" data-all="${kind}"><b>전체 보기</b><small>${n.toLocaleString()}${unit} 모두 보기 ›</small></button>`;
function upsMore(){
  const el=$("#ups"),top=$("#upsMoreTop");if(!el||!top)return;
  const over=el.scrollWidth>el.clientWidth+2,n=S.shows.length;
  top.innerHTML=over&&n?`<button class="ghost more-all in-head" data-all="shows">${phoneMQ.matches?"전체 보기 ›":`전체 보기 (${n.toLocaleString()}개)`}</button>`:"";
}
function renderUps(){
  const ps=["전체",...new Set(S.shows.map(s=>s.platform).filter(Boolean))];
  if(!ps.includes(plat))plat="전체";
  $("#platTabs").innerHTML=S.shows.length?ps.map(p=>`<button class="chip" data-plat="${esc(p)}" aria-pressed="${p===plat}">${esc(p)} ${p==="전체"?S.shows.length:S.shows.filter(s=>s.platform===p).length}</button>`).join(""):"";
  const list=S.shows.filter(s=>plat==="전체"||s.platform===plat).sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
  $("#upCount").textContent=S.showsOk?`아이템이 새로 올라온 프로그램 ${S.shows.length}개`:"아이템이 새로 올라온 프로그램";
  $("#ups").innerHTML=!S.showsOk?"":list.length?list.slice(0,RAIL_MAX).map(showCard).join("")+(list.length>RAIL_MAX?railEnd("shows",S.shows.length,"개"):"")
   :`<p class="empty">아직 등록된 프로그램이 없어요.</p>`;
  $("#ups").scrollLeft=0;
  railNav("ups");upsMore();
}
function renderSite(){renderCats();renderRecent();renderPeople();renderItems();renderUps();renderShowSelect();if(curView==="all")renderAll(false);if(curView==="shows")renderShowsPage(false);if(curView==="people")renderPeoplePage(false)}

/* ---------- 아이템 전체 보기 페이지 (#all) — toftof 목록 구조 참고: 분류 칩, 정렬, 카드, 더보기 ---------- */
let curView="site",allSort="new",allShown=0,siteY=0;
const allStep=()=>phoneMQ.matches?12:24;
function lowPrice(it){const ps=buyLinks(it).map(l=>l.price).filter(hasNum);return ps.length?Math.min(...ps):(hasNum(it.price)?it.price:null)}
function feedCard(it){
  const s=showOf(it.showId),ls=buyLinks(it),m=ls[0];
  return `<article class="fc">
   <button type="button" class="fc-th" data-id="${esc(it.id)}" aria-label="${esc(it.brand+" "+it.name)} 자세히 보기">${thumb(it)}</button>
   <div class="fc-info">
    <p class="fc-who"><button type="button" class="lnk" data-allperson="${esc(it.person)}">${esc(it.person)}</button> · ${esc(s.title)}${it.ep?" "+esc(it.ep):""}</p>
    <button type="button" class="fc-name" data-id="${esc(it.id)}"><span class="br">${esc(it.brand)}${sampleTag(it)} ${vfTag(it)}</span><span class="nm">${esc(it.name)}</span></button>
    <div class="fc-foot"><span class="pr">${topPriceHtml(it)}</span>${m?`<a class="fc-buy" href="${esc(m.url)}" target="_blank" rel="noopener noreferrer${m.aff?" sponsored":""}" data-item="${esc(it.id)}">${esc(m.shop)}에서 보기</a>`
     :`<button type="button" class="fc-buy none" data-id="${esc(it.id)}">자세히</button>`}</div>
   </div>
  </article>`;
}
function renderAll(reset){
  if(reset||!allShown)allShown=allStep();
  if(document.activeElement!==$("#allQ"))$("#allQ").value=F.q;
  let list=filteredItems();
  if(allSort!=="new"){const k=allSort==="low"?1:-1;list=list.slice().sort((a,b)=>{const x=lowPrice(a),y=lowPrice(b);return x===null?1:y===null?-1:(x-y)*k})}
  let title="아이템 전체";
  if(F.q)title=`‘${F.q}’ 검색 결과`;else if(F.person)title=F.person+"의 아이템";else if(F.show)title=showOf(F.show).title+" 아이템";else if(F.cat)title=CATS[F.cat]+" 아이템";
  $("#allTitle").innerHTML=`${esc(title)} <small>${S.itemsOk?list.length.toLocaleString()+"개":""}</small>`;
  const base=filteredItems(true),cnt={};base.forEach(i=>cnt[i.cat]=(cnt[i.cat]||0)+1);
  $("#allCats").innerHTML=`<button type="button" class="chip" data-allcat="" aria-pressed="${!F.cat}">전체 ${base.length}</button>`+
    Object.entries(CATS).filter(([k])=>cnt[k]||F.cat===k).map(([k,v])=>`<button type="button" class="chip" data-allcat="${k}" aria-pressed="${F.cat===k}">${v} ${cnt[k]||0}</button>`).join("");
  const tags=[];
  if(F.person)tags.push(["person",F.person]);if(F.show)tags.push(["show",showOf(F.show).title]);if(F.q)tags.push(["q",`‘${F.q}’`]);
  $("#allTags").innerHTML=tags.map(([k,v])=>`<button type="button" class="tagx" data-allclear="${k}" aria-label="${esc(v)} 조건 빼기">${esc(v)} <span aria-hidden="true">×</span></button>`).join("");
  $$("#allSort [data-sort]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sort===allSort));
  $("#allList").innerHTML=!S.itemsOk?"":list.length?list.slice(0,allShown).map(feedCard).join("")
    :`<p class="empty">${S.items.length?"조건에 맞는 아이템이 아직 없어요.":"아직 등록된 아이템이 없어요."}</p>`;
  const left=list.length-allShown;
  $("#allMore").innerHTML=left>0?`<button type="button" class="ghost more-all" data-allmore="1">더보기 (${left.toLocaleString()}개 남음)</button>`:"";
}
let siteF=null;
function rememberSite(){if(curView==="site"){siteY=scrollY;siteF={...F}}}
function openAll(nf){rememberSite();if(nf){F={q:"",cat:"",show:"",person:"",...nf}}history.pushState({fromSite:1},"","#all");route()}

/* ---------- 프로그램 전체 페이지 (#shows) — 아이템 전체 페이지와 같은 구조 ---------- */
let showsPlat="전체",showsSort="recent",showsShown=0;
const showsStep=()=>phoneMQ.matches?12:24;
function renderShowsPage(reset){
  if(reset||!showsShown)showsShown=showsStep();
  const ps=["전체",...new Set(S.shows.map(s=>s.platform).filter(Boolean))];
  if(!ps.includes(showsPlat))showsPlat="전체";
  $("#showsPlats").innerHTML=ps.map(p=>`<button type="button" class="chip" data-splat="${esc(p)}" aria-pressed="${p===showsPlat}">${esc(p)} ${p==="전체"?S.shows.length:S.shows.filter(s=>s.platform===p).length}</button>`).join("");
  const list=S.shows.filter(s=>showsPlat==="전체"||s.platform===showsPlat);
  if(showsSort==="items")list.sort((a,b)=>countFor(b.id)-countFor(a.id));
  else if(showsSort==="name")list.sort((a,b)=>String(a.title).localeCompare(String(b.title),"ko"));
  else list.sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
  $("#showsTitle").innerHTML=`${showsPlat==="전체"?"프로그램 전체":esc(showsPlat)+" 프로그램"} <small>${S.showsOk?list.length.toLocaleString()+"개":""}</small>`;
  $$("#showsSort [data-ssort]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.ssort===showsSort));
  $("#showsList").innerHTML=!S.showsOk?"":list.length?list.slice(0,showsShown).map(showCard).join(""):`<p class="empty">아직 등록된 프로그램이 없어요.</p>`;
  const left=list.length-showsShown;
  $("#showsMore").innerHTML=left>0?`<button type="button" class="ghost more-all" data-smore="1">더보기 (${left.toLocaleString()}개 남음)</button>`:"";
}
let peopleSort="count",peopleShown=0;
const peopleStep=()=>phoneMQ.matches?30:60;
function peopleData(){
  const m=new Map();
  S.items.forEach(it=>{if(!it.person)return;const p=m.get(it.person)||{name:it.person,count:0,latest:"",show:""};
    p.count++;if(String(it.createdAt||"")>p.latest){p.latest=String(it.createdAt||"");p.show=showOf(it.showId).title}m.set(it.person,p)});
  return [...m.values()];
}
function renderPeoplePage(reset){
  if(reset||!peopleShown)peopleShown=peopleStep();
  const q=norm($("#peopleQ").value);
  let list=peopleData().filter(p=>!q||norm(p.name).includes(q));
  if(peopleSort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"ko"));
  else if(peopleSort==="recent")list.sort((a,b)=>b.latest.localeCompare(a.latest));
  else list.sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"ko"));
  $("#peopleTitle").innerHTML=`인물 전체 <small>${S.itemsOk?list.length.toLocaleString()+"명":""}</small>`;
  $$("#peopleSort [data-psort]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.psort===peopleSort));
  $("#peoplePageList").innerHTML=!S.itemsOk?"":list.length?list.slice(0,peopleShown).map(p=>`<button type="button" class="pc" data-pperson="${esc(p.name)}">
    <span class="pc-name">${esc(p.name)}</span><span class="pc-sub">아이템 ${p.count}개</span>${p.show?`<span class="pc-show">${esc(p.show)}</span>`:""}</button>`).join("")
    :`<p class="empty">${q?"이 이름의 인물이 아직 없어요.":"아이템이 등록되면 인물이 여기에 모여요."}</p>`;
  const left=list.length-peopleShown;
  $("#peoplePageMore").innerHTML=left>0?`<button type="button" class="ghost more-all" data-pmore="1">더보기 (${left.toLocaleString()}명 남음)</button>`:"";
}
function openPeople(){rememberSite();history.pushState({fromSite:1},"","#people");route()}
$("#peopleQ").addEventListener("input",()=>renderPeoplePage(true));
/* ---------- 최근 본 아이템 페이지 (#seen): 열어본 아이템이 자동으로 쌓여요 ---------- */
let seenArmed=false;
function renderSeen(){
  const list=recent.map(id=>S.items.find(i=>i.id===id)).filter(Boolean);
  $("#seenTitle").innerHTML=`최근 본 아이템 <small>${S.itemsOk?list.length+"개":""}</small>`;
  $("#seenClear").hidden=!list.length;$("#seenClear").textContent=seenArmed?"정말 모두 지우기":"모두 지우기";
  $("#seenList").innerHTML=!S.itemsOk?"":list.length?list.map(feedCard).join("")
    :`<div class="empty seen-empty"><p>아직 본 아이템이 없어요.</p><p>아이템을 눌러 보면 여기에 최근 순서로 모여요.</p><button type="button" class="primary" data-all="items">아이템 둘러보기</button></div>`;
}
function openSeen(){rememberSite();history.pushState({fromSite:1},"","#seen");route()}
$(".nav-seen").addEventListener("click",e=>{e.preventDefault();if(curView!=="seen")openSeen()});
function openShows(){rememberSite();history.pushState({fromSite:1},"","#shows");route()}
function leaveAll(){if(history.state&&history.state.fromSite)history.back();else{history.pushState(null,"",location.pathname);route()}}

/* ---------- item modal ---------- */
const shortId=id=>String(id).slice(0,8);
const itemUrl=it=>location.origin+location.pathname.replace(/[^/]*$/,"")+"item/"+shortId(it.id)+"/";
let itemPushed=false;
function openItem(id,fromHash){
  const it=S.items.find(i=>i.id===id);if(!it)return;
  track(BASE_PATH+"item/"+String(id).slice(0,8)+"/",`${it.person} · ${it.brand} ${it.name}`);
  if(!fromHash){const h="#i/"+shortId(id);if(location.hash!==h){history.pushState(null,"",h);itemPushed=true}}
  recent=[id,...recent.filter(x=>x!==id)].slice(0,RECENT_MAX);saveRecent();renderRecent();
  const s=showOf(it.showId);
  const same=S.items.filter(i=>i.person===it.person&&i.id!==it.id).slice(0,3);
  $("#ov").innerHTML=`<div class="md" role="dialog" aria-modal="true" aria-label="${esc(it.name)}">
   <button class="x" id="close" aria-label="닫기">×</button>${thumb(it)}
   <button class="share" id="shareItem" data-share="${esc(it.id)}">링크 공유</button>
   <div class="bd"><span class="br">${esc(it.brand)}${sampleTag(it)}</span><h3>${esc(it.name)}</h3><span class="pr">${topPriceHtml(it)}</span>${hasNum(it.couponPrice)?`<span class="note">${esc(shopName(it.buyUrl))} 쿠폰 적용 시 최대 ${won(it.couponPrice)}</span>`:""}<span class="note">${priceNote(it)}</span>
   <dl><dt>확인</dt><dd>${vfTag(it)}</dd><dt>인물</dt><dd>${esc(it.person)}</dd><dt>프로그램</dt><dd>${esc(s.title)}${sceneText(it)?" · "+esc(sceneText(it)):""}</dd>
   ${s.platform?`<dt>플랫폼</dt><dd>${esc(s.platform)}</dd>`:""}<dt>분류</dt><dd>${CATS[it.cat]||""}</dd></dl>
   ${it.scene?`<p class="scene">${esc(it.scene)}</p>`:""}
   ${(()=>{const ls=buyLinks(it);if(!ls.length)return `<p class="note">구매처 정보가 아직 없어요.</p>`;
     return `<div class="buys">${ls.map(l=>`<a class="${l.main?"primary":"ghost"}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer${l.aff?" sponsored":""}">${esc(l.shop)}${hasNum(l.price)?` <b class="lp">${won(l.price)}</b>`:" 보기"}${l.lowest?' <small class="low">최저가</small>':""}${l.aff?' <small class="aff">제휴</small>':""}</a>`).join("")}</div>${ls.some(l=>l.aff)?`<p class="note">‘제휴’ 링크로 구매하면 어디꺼야?가 수수료를 받을 수 있어요.</p>`:""}`})()}
   ${same.length?`<div><b style="font-size:15px">${esc(it.person)}의 다른 아이템</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">${same.map(x=>`<button class="mini" data-id="${esc(x.id)}">${thumb(x)}<span style="font-size:13px">${esc(x.name)}</span></button>`).join("")}</div></div>`:""}
   </div></div>`;
  $("#ov").dataset.item=it.id;$("#ov").hidden=false;$("#close").focus();document.body.style.overflow="hidden";
}
function hideItem(){$("#ov").hidden=true;$("#ov").innerHTML="";document.body.style.overflow=""}
function closeItem(){
  hideItem();
  if(location.hash.startsWith("#i/")){if(itemPushed){itemPushed=false;history.back()}else history.replaceState(null,"",location.pathname+location.search)}
}
async function shareItem(id){
  const it=S.items.find(i=>i.id===id);if(!it)return;
  const url=itemUrl(it),title=`${it.person} · ${it.brand} ${it.name}`;
  if(navigator.share&&matchMedia("(pointer:coarse)").matches){try{await navigator.share({title,url});return}catch(e){if(e&&e.name==="AbortError")return}}
  try{await navigator.clipboard.writeText(url);toast("링크를 복사했어요. 카톡이나 커뮤니티에 붙여 넣어 보세요")}
  catch(e){prompt("이 링크를 복사해 주세요",url)}
}
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2800)}
function go(){document.getElementById("items").scrollIntoView({behavior:"smooth",block:"start"})}

/* ---------- data ---------- */
async function loadData(){
  if(!sb){S.noDb=true;renderSite();return}
  const [a,b,c]=await Promise.all([sb.from("items").select("*"),sb.from("shows").select("*"),sb.from("people").select("id,name").order("name")]);
  if(a.error||b.error){S.noDb=true;renderSite();return}
  S.noDb=false;S.items=a.data.map(toItem);S.shows=b.data.map(toShow);S.itemsOk=S.showsOk=true;
  S.people=c.error?[]:c.data.map(toPerson);S.peopleOk=!c.error;
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
const formShownAt=Date.now();let lastReportAt=0;
$("#reqForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if(!sb){toast("지금은 제보를 보낼 수 없어요. 잠시 후 다시 시도해 주세요");return}
  // 봇 차단: 숨김 칸을 채웠거나, 화면을 연 지 4초 안에 보내면 접수한 척만 해요
  if($("#rSite").value||Date.now()-formShownAt<4000){e.target.reset();toast("제보가 접수됐어요. 확인 후 등록할게요");return}
  if(Date.now()-lastReportAt<30000){toast("제보는 30초에 한 번 보낼 수 있어요. 잠시 후 다시 보내 주세요");return}
  const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;
  const r={show:$("#rShow").value.trim(),ep:$("#rEp").value.trim(),who:$("#rWho").value.trim(),
    cat:$("#rCat").value,descr:$("#rDesc").value.trim(),link:$("#rLink").value.trim()};
  const {error}=await sb.from("reports").insert(r);
  if(error)toast(/limit|duplicate/i.test(error.message||"")?"같은 제보가 이미 있거나 제보가 너무 많아요. 잠시 후 다시 보내 주세요":"제보를 보내지 못했어요. 잠시 후 다시 시도해 주세요");
  else{track("제보 보냄","",true);lastReportAt=Date.now();e.target.reset();toast("제보가 접수됐어요. 확인 후 등록할게요")}
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
const findPerson=n=>S.people.find(p=>norm(p.name)===norm(n));
function syncPersonNote(){
  const t=$("#iPerson").value.trim(),p=t&&findPerson(t);
  $("#iPersonNote").textContent=!t?"목록에서 고르거나 새 이름을 쓰면 인물로 추가돼요.":p?(p.name===t?"등록된 인물이에요.":`‘${p.name}’(으)로 저장돼요.`):"새 인물로 추가돼요.";
}
$("#iPerson").addEventListener("input",syncPersonNote);
async function ensurePerson(name){
  const p=findPerson(name);if(p)return p;
  const r=await sb.from("people").insert({name}).select("id,name").single();
  if(r.error){
    if(/relation|does not exist|schema cache/i.test(r.error.message||""))throw new Error("SQL_PEOPLE");
    const again=await sb.from("people").select("id,name").eq("name_key",norm(name)).maybeSingle();
    if(again.data)return toPerson(again.data);
    throw r.error;
  }
  const np=toPerson(r.data);S.people.push(np);return np;
}
/* 추가 구매처 줄 */
function linkRow(l={}){
  const d=document.createElement("div");d.className="lrow";
  d.innerHTML=`<input class="lshop" maxlength="20" placeholder="쇼핑몰" aria-label="쇼핑몰 이름" value="${esc(l.shop||"")}">
   <input class="lurl" type="url" maxlength="600" placeholder="https://" aria-label="구매 링크" value="${esc(l.url||"")}">
   <input class="lprice" type="number" min="0" step="1" placeholder="가격(원)" aria-label="이 구매처 가격(원)" value="${hasNum(l.price)?l.price:""}">
   <label class="laff"><input type="checkbox" class="lafc"${l.aff?" checked":""}> 제휴</label>
   <button type="button" class="ghost lrm" aria-label="이 구매처 빼기">빼기</button>`;
  return d;
}
function setLinks(ls){const box=$("#iLinks");box.innerHTML="";(ls||[]).forEach(l=>box.appendChild(linkRow(l)));$("#iAddLink").hidden=box.children.length>=5}
function readLinks(){
  const prev=editI?(S.items.find(i=>i.id===editI)?.links||[]):[];
  return $$("#iLinks .lrow").map(r=>{
    const url=r.querySelector(".lurl").value.trim(),pv=r.querySelector(".lprice").value;
    const price=pv===""?null:Math.round(+pv);
    const old=prev.find(o=>o&&o.url===url)||{};
    const l={shop:r.querySelector(".lshop").value.trim(),url,aff:r.querySelector(".lafc").checked,price};
    if(old.price===price&&price!==null){ // 가격을 안 바꿨으면 자동 확인 기록을 그대로 둬요
      for(const k of ["list","checked_at","failed","src"])if(old[k]!==undefined)l[k]=old[k];
    }else if(price!==null)l.src="manual";
    return l;
  }).filter(l=>l.url);
}
$("#iAddLink").addEventListener("click",()=>{$("#iLinks").appendChild(linkRow());$("#iAddLink").hidden=$("#iLinks").children.length>=5;$("#iLinks").lastElementChild.querySelector(".lurl").focus()});
$("#iLinks").addEventListener("click",e=>{const b=e.target.closest(".lrm");if(!b)return;b.closest(".lrow").remove();$("#iAddLink").hidden=false});
let editI=null,editS=null,iImg=null,sImg=null,armed=null,fetchedImg=null,fetchedList=null;
function curImg(box,url,which){
  if(!okUrl(url)){$(box).hidden=true;$(box).innerHTML="";return}
  $(box).hidden=false;$(box).innerHTML=`<img src="${esc(url)}" alt=""><span class="note">현재 이미지</span><button type="button" class="ghost" data-rmimg="${which}">이미지 빼기</button>`;
}
function delBtn(kind,id){return `<button type="button" class="ghost danger" data-del="${kind}:${esc(id)}">${armed===kind+":"+id?"정말 삭제":"삭제"}</button>`}
// 제보함: 글 속 주소를 누를 수 있게, 그리고 쇼핑몰 검색 바로가기
function linkify(t){return esc(t).replace(/https?:\/\/[^\s<]+/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u.length>60?u.slice(0,60)+"…":u}</a>`)}
const SHOP_SEARCH=[["네이버쇼핑","https://search.shopping.naver.com/search/all?query="],["쿠팡","https://www.coupang.com/np/search?q="],["무신사","https://www.musinsa.com/search/goods?keyword="],["올리브영","https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query="]];
function shopSearch(q){q=encodeURIComponent(q.trim());return SHOP_SEARCH.map(([n,u])=>`<a class="ghost sbtn" href="${u}${q}" target="_blank" rel="noopener noreferrer">${n}</a>`).join("")}
const shopUrlIn=t=>(String(t||"").match(/판매처: (https?:\/\/\S+)/)||[])[1]||"";
function renderAdmin(){
  if(!S.owner)return;
  $$("#admTabs [data-tab]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.tab===tab));
  $$("[data-panel]").forEach(p=>p.hidden=p.dataset.panel!==tab);
  $("#iList").innerHTML=S.items.length?[...S.items].sort(byNew).map(it=>`<div class="arow">${thumb(it)}
    <div style="min-width:0"><b>${esc(it.brand)} · ${esc(it.name)}</b><span>${esc(it.person)} · ${esc(showOf(it.showId).title)} ${esc(it.ep||"")} · ${won(it.price)}${it.priceCheckFailed?" · <em class=\"warn\">가격 확인 실패</em>":it.priceCheckedAt?" · "+md(it.priceCheckedAt)+" 확인":""}</span></div>
    <div class="btns"><button class="ghost" data-copyurl="${esc(it.id)}">주소 복사</button><button class="ghost" data-edit="item:${esc(it.id)}">수정</button>${delBtn("item",it.id)}</div></div>`).join("")
    :`<p class="empty">등록된 아이템이 없어요. 왼쪽에서 첫 아이템을 등록해 보세요.</p>`;
  $("#sList").innerHTML=S.shows.length?[...S.shows].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||""))).map(s=>`<div class="arow">
    <div class="pv" style="background:${colorOf(s)}">${okUrl(s.posterUrl)?`<img src="${esc(s.posterUrl)}" alt="">`:""}</div>
    <div style="min-width:0"><b>${esc(s.title)}</b><span>${esc(s.platform)} · ${esc(s.ep||"회차 없음")} · 아이템 ${countFor(s.id)}개</span></div>
    <div class="btns"><button class="ghost" data-edit="show:${esc(s.id)}">수정</button>${delBtn("show",s.id)}</div></div>`).join("")
    :`<p class="empty">등록된 프로그램이 없어요. 아이템을 올리면서 새 프로그램 이름을 쓰면 자동으로 추가돼요.</p>`;
  const pc={};S.items.forEach(i=>{const k=i.personId||("n:"+norm(i.person));pc[k]=(pc[k]||0)+1});
  $("#pList").innerHTML=!S.peopleOk?`<p class="empty">인물 목록을 쓰려면 수파베이스에서 004 SQL을 먼저 실행해 주세요.</p>`
    :S.people.length?S.people.map(p=>`<form class="arow prow" data-pid="${esc(p.id)}" style="grid-template-columns:minmax(0,1fr) auto auto">
    <label style="min-width:0"><span class="note">아이템 ${pc[p.id]||0}개</span><input class="pname" value="${esc(p.name)}" maxlength="40" aria-label="인물 이름"></label>
    <button class="ghost" type="submit">이름 저장</button>${pc[p.id]?"":delBtn("person",p.id)}</form>`).join("")
    :`<p class="empty">아직 등록된 인물이 없어요. 아이템을 등록하면 인물이 여기에 모여요.</p>`;
  $("#rList").innerHTML=S.reports.length?S.reports.map(r=>`<div class="rep">
    <div class="top"><b>${r.auto?`<em class="auto">자동 수집</em> `:""}${esc(r.show)}</b><span>${esc(r.ep||"")}${r.who?" · "+esc(r.who):""}${r.cat?" · "+esc(r.cat):""} · ${md(r.at)}</span></div>
    <p>${linkify(r.desc)}</p>
    ${r.auto&&(r.brand||r.name)?`<div class="btns shopq"><span class="note">판매처 찾기</span>${shopSearch(r.brand+" "+r.name)}</div>`:""}
    ${okUrl(r.link)&&/^https?:/i.test(r.link)?`<a class="note" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">${esc(r.link)}</a>`:""}
    <div class="btns"><button class="ghost" data-fromrep="${esc(r.id)}">이 제보로 아이템 등록</button>
    <button class="ghost danger" data-done="${esc(r.id)}">${r.auto?"틀림·버리기":"처리 완료"}</button></div></div>`).join("")
    :`<p class="empty">아직 들어온 제보가 없어요. 방문자가 제보를 보내면 여기에 쌓여요.</p>`;
  const n=S.reports.length;
  ["#repCount","#repCount2"].forEach(s=>{$(s).hidden=!n;$(s).textContent=n});
}
function resetIForm(){editI=null;iImg=null;fetchedImg=null;fetchedList=null;$("#iForm").reset();setLinks([]);syncPersonNote();curImg("#iCur");$("#iFormTitle").textContent="아이템 등록";$("#iSubmit").textContent="등록하기";$("#iCancel").hidden=true;renderShowSelect()}
function resetSForm(){editS=null;sImg=null;$("#sForm").reset();curImg("#sCur");$("#sFormTitle").textContent="프로그램 등록";$("#sSubmit").textContent="등록하기";$("#sCancel").hidden=true}
async function shrink(f){
  // 큰 사진은 올리기 전에 가로세로 최대 1200px, webp로 줄여요
  if(!/^image\/(jpeg|png|webp|heic|heif|avif)$/i.test(f.type||""))return f;
  try{
    const bmp=await createImageBitmap(f);
    const k=Math.min(1,1200/Math.max(bmp.width,bmp.height));
    const w=Math.round(bmp.width*k),h=Math.round(bmp.height*k);
    const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(bmp,0,0,w,h);
    const blob=await new Promise(r=>c.toBlob(r,"image/webp",.82));
    if(!blob||blob.type!=="image/webp"||(k===1&&blob.size>=f.size))return f;
    return new File([blob],f.name.replace(/\.[^.]+$/,"")+".webp",{type:"image/webp"});
  }catch(e){return f}
}
async function upload(input){
  let f=input.files&&input.files[0];if(!f)return null;
  f=await shrink(f);
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
    const person=await ensurePerson($("#iPerson").value.trim());
    const doc={brand:$("#iBrand").value.trim(),name:$("#iName").value.trim(),cat:$("#iCat").value,price,
      person:person.name,person_id:person.id,verify:$("#iVerify").value,
      show_id:show.id,ep,scene:$("#iScene").value.trim(),
      buy_url:$("#iUrl").value.trim(),buy_affiliate:$("#iAff").checked,links:readLinks(),
      image_url:up||fetchedImg||(iImg===false?"":(prev.imageUrl||"")),updated_at:now};
    if(fetchedList)doc.list_price=fetchedList;
    if(editI)must(await sb.from("items").update(doc).eq("id",editI));else must(await sb.from("items").insert(doc));
    if(!made&&!editI)must(await sb.from("shows").update({updated_at:now,...(ep?{ep}:{})}).eq("id",show.id));
    toast((editI?"아이템을 수정했어요":"아이템을 등록했어요")+(made?` · ‘${title}’ 프로그램도 추가했어요`:""));resetIForm();
    await loadData();
  }catch(err){err&&err.message==="SQL_PEOPLE"?toast("수파베이스에서 004 SQL을 먼저 실행해 주세요"):dbErr(err)}
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
$("#iFetch").addEventListener("click",async e=>{
  const url=$("#iUrl").value.trim();
  if(!/^https?:\/\//i.test(url)){toast("상품 링크를 먼저 붙여 넣어 주세요");$("#iUrl").focus();return}
  if(!sb||!S.owner)return;
  const btn=e.target;btn.disabled=true;btn.textContent="불러오는 중…";$("#iFetchNote").textContent="쇼핑몰에서 정보를 가져오는 중이에요. 몇 초 걸려요.";
  try{
    const {data,error}=await sb.functions.invoke("fetch-product",{body:{url}});
    if(error)throw error;
    if(!data||data.error){$("#iFetchNote").textContent=(data&&data.error)||"정보를 가져오지 못했어요. 직접 입력해 주세요.";return}
    const filled=[];
    if(data.brand){$("#iBrand").value=data.brand;filled.push("브랜드")}
    if(data.name){$("#iName").value=data.name;filled.push("상품명")}
    if(data.price){$("#iPrice").value=data.price;filled.push("가격")}
    if(data.cat&&CATS[data.cat]){$("#iCat").value=data.cat;filled.push("분류("+CATS[data.cat]+")")}
    fetchedList=data.listPrice||null;
    if(data.imageUrl){fetchedImg=data.imageUrl;iImg=null;$("#iImg").value="";curImg("#iCur",data.imageUrl,"i");filled.push("이미지")}
    $("#iFetchNote").textContent=filled.length?`채운 항목: ${filled.join(", ")}. 내용을 확인하고 인물·프로그램·회차를 골라 주세요.`:"가져온 정보가 없어요. 직접 입력해 주세요.";
  }catch(err){
    console.error(err);
    $("#iFetchNote").textContent=/not found|404|Failed to send|FunctionsFetchError|FunctionsHttpError/i.test(String(err&&(err.name+err.message)))
      ?"불러오기 기능이 아직 설치되지 않았어요(수파베이스 함수 fetch-product).":"정보를 가져오지 못했어요. 직접 입력해 주세요.";
  }finally{btn.disabled=false;btn.textContent="링크로 불러오기"}
});
$("#pList").addEventListener("submit",async e=>{
  const f=e.target.closest(".prow");if(!f)return;e.preventDefault();
  const id=f.dataset.pid,name=f.querySelector(".pname").value.trim(),cur=S.people.find(p=>p.id===id);
  if(!cur||!name||name===cur.name)return;
  const btn=f.querySelector("button[type=submit]");btn.disabled=true;
  try{
    const other=S.people.find(p=>p.id!==id&&norm(p.name)===norm(name));
    if(other){ // 같은 사람: 아이템을 옮기고 합치기
      must(await sb.from("items").update({person_id:other.id,person:other.name}).eq("person_id",id));
      must(await sb.from("people").delete().eq("id",id));
      toast(`‘${cur.name}’을(를) ‘${other.name}’(으)로 합쳤어요`);
    }else{
      must(await sb.from("people").update({name}).eq("id",id));
      must(await sb.from("items").update({person:name}).eq("person_id",id));
      toast("이름을 바꿨어요");
    }
    await loadData();
  }catch(err){dbErr(err)}
  btn.disabled=false;
});
$("#sCancel").addEventListener("click",resetSForm);

function fillItem(it){
  editI=it.id;iImg=null;
  $("#iBrand").value=it.brand||"";$("#iName").value=it.name||"";$("#iCat").value=it.cat||"top";
  $("#iPrice").value=typeof it.price==="number"?it.price:"";$("#iPerson").value=it.person||"";
  $("#iShow").value=S.shows.find(s=>s.id===it.showId)?.title||"";syncShowNote();
  $("#iEp").value=it.ep||"";$("#iVerify").value=it.verify||"guess";$("#iScene").value=it.scene||"";$("#iUrl").value=it.buyUrl||"";$("#iAff").checked=!!it.buyAffiliate;setLinks(it.links);syncPersonNote();
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
  const email=$("#loginEmail").value.trim(),password=$("#loginPw").value;
  if(!password){toast("비밀번호를 넣어 주세요. 아직 없다면 메일로 로그인 링크를 받아 주세요");$("#loginPw").focus();return}
  const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error)toast(/invalid/i.test(error.message||"")?"이메일이나 비밀번호가 맞지 않아요":"로그인하지 못했어요. 잠시 후 다시 시도해 주세요");
  else $("#loginPw").value="";
  btn.disabled=false;
});
$("#loginLink").addEventListener("click",async e=>{
  if(!sb)return;
  const email=$("#loginEmail").value.trim();
  if(!$("#loginEmail").checkValidity()||!email){toast("이메일을 먼저 넣어 주세요");$("#loginEmail").focus();return}
  e.target.disabled=true;
  const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname+"#admin"}});
  toast(error?(/rate|limit|seconds/i.test(error.message||"")?"메일을 너무 자주 요청했어요. 한 시간쯤 뒤에 다시 시도해 주세요":"로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요"):"메일함에서 로그인 링크를 눌러 주세요");
  e.target.disabled=false;
});
$("#pwToggle").addEventListener("click",()=>{$("#pwForm").hidden=!$("#pwForm").hidden;if(!$("#pwForm").hidden)$("#pwNew").focus()});
$("#pwForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!sb)return;
  const a=$("#pwNew").value,b=$("#pwNew2").value;
  if(a!==b){toast("두 비밀번호가 달라요");return}
  const btn=e.target.querySelector("button[type=submit]");btn.disabled=true;
  const {error}=await sb.auth.updateUser({password:a});
  if(error)toast(/reauth|recent/i.test(error.message||"")?"보안을 위해 메일 링크로 다시 로그인한 뒤 바로 설정해 주세요":"비밀번호를 저장하지 못했어요: "+error.message);
  else{e.target.reset();e.target.hidden=true;toast("비밀번호를 저장했어요. 다음부터 이메일과 비밀번호로 로그인하세요")}
  btn.disabled=false;
});
$("#logout").addEventListener("click",async()=>{if(sb)await sb.auth.signOut();S.owner=false;S.reports=[];location.hash="";route()});

/* ---------- routing ---------- */
function route(){
  const h=location.hash;
  if(h.startsWith("#i/")){
    const it=S.items.find(i=>shortId(i.id)===h.slice(3).toLowerCase());
    if(it&&!(!$("#ov").hidden&&$("#ov").dataset.item===it.id))openItem(it.id,true);
  }else if(!$("#ov").hidden){itemPushed=false;hideItem()}
  const adm=h==="#admin",prev=curView;
  curView=adm?"admin":(h==="#all"||(h.startsWith("#i/")&&prev==="all"))?"all":(h==="#shows"||(h.startsWith("#i/")&&prev==="shows"))?"shows":(h==="#people")?"people":(h==="#seen"||(h.startsWith("#i/")&&prev==="seen"))?"seen":"site";
  $("#site").hidden=curView!=="site";$("#allPage").hidden=curView!=="all";$("#showsPage").hidden=curView!=="shows";$("#peoplePage").hidden=curView!=="people";$("#seenPage").hidden=curView!=="seen";$("#admin").hidden=!adm;
  $("#login").hidden=!adm||S.owner;$("#admBody").hidden=!S.owner;
  if(adm){if(S.owner)renderAdmin();window.scrollTo(0,0)}
  if(curView!==prev){
    if(curView==="all"){const why=F.q?"검색: "+F.q:F.person?"인물: "+F.person:F.show?"프로그램: "+showOf(F.show).title:F.cat?"분류: "+(CATS[F.cat]||F.cat):"";track(BASE_PATH+"#all","아이템 전체"+(why?" · "+why:""))}
    else if(curView==="shows")track(BASE_PATH+"#shows","프로그램 전체");
    else if(curView==="people")track(BASE_PATH+"#people","인물 전체");
    else if(curView==="seen")track(BASE_PATH+"#seen","최근 본 아이템");
  }
  if(curView==="all"&&prev!=="all"){allSort="new";renderAll(true);window.scrollTo(0,0)}
  if(curView==="shows"&&prev!=="shows"){renderShowsPage(true);window.scrollTo(0,0)}
  if(curView==="seen"&&prev!=="seen"){seenArmed=false;renderSeen();window.scrollTo(0,0)}
  if(curView==="people"&&prev!=="people"){$("#peopleQ").value="";peopleSort="count";renderPeoplePage(true);window.scrollTo(0,0)}
  if(curView==="site"&&(prev==="all"||prev==="shows"||prev==="people"||prev==="seen")){if(siteF){F={...siteF};$("#q").value=F.q}renderCats();renderItems();window.scrollTo(0,siteY)}
}
window.addEventListener("hashchange",route);

/* ---------- events ---------- */
document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.all==="seen")return openSeen();
  if(b.closest("#seenPage")){
    if(b.id==="seenBack")return leaveAll();
    if(b.id==="seenClear"){if(!seenArmed){seenArmed=true;return renderSeen()}seenArmed=false;recent=[];saveRecent();renderRecent();renderSeen();return toast("최근 본 아이템을 지웠어요")}
  }
  if(b.dataset.all==="items")return openAll();
  if(b.dataset.all==="shows")return openShows();
  if(b.closest("#peoplePage")){
    if(b.id==="peopleBack")return leaveAll();
    if(b.dataset.psort){peopleSort=b.dataset.psort;return renderPeoplePage(true)}
    if(b.dataset.pmore)return peopleShown+=peopleStep(),renderPeoplePage(false);
    if(b.dataset.pperson)return openAll({person:b.dataset.pperson});
  }
  if(b.closest("#showsPage")){
    if(b.id==="showsBack")return leaveAll();
    if(b.dataset.splat){showsPlat=b.dataset.splat;return renderShowsPage(true)}
    if(b.dataset.ssort){showsSort=b.dataset.ssort;return renderShowsPage(true)}
    if(b.dataset.smore)return showsShown+=showsStep(),renderShowsPage(false);
    if(b.dataset.show)return openAll({show:b.dataset.show});
  }
  if(b.closest("#allPage")){
    if(b.id==="allBack")return leaveAll();
    if(b.dataset.allcat!==undefined){F.cat=b.dataset.allcat;return renderAll(true)}
    if(b.dataset.allclear){F[b.dataset.allclear]="";if(b.dataset.allclear==="q")$("#q").value="";return renderAll(true)}
    if(b.dataset.allperson!==undefined){F={q:"",cat:"",show:"",person:b.dataset.allperson};$("#q").value="";renderAll(true);return window.scrollTo(0,0)}
    if(b.dataset.sort){allSort=b.dataset.sort;return renderAll(true)}
    if(b.dataset.allmore)return allShown+=allStep(),renderAll(false);
  }
  if(b.id==="close")return closeItem();
  if(b.dataset.share)return shareItem(b.dataset.share);
  if(b.dataset.copyurl){const it=S.items.find(i=>i.id===b.dataset.copyurl);if(!it)return;const url=itemUrl(it);
    try{await navigator.clipboard.writeText(url);toast("아이템 주소를 복사했어요. 새로 올린 아이템은 1시간쯤 뒤에 페이지가 생겨요")}catch(e){prompt("이 주소를 복사해 주세요",url)}return}
  if(b.classList.contains("rail-btn")){const el=document.getElementById(b.closest(".rail-nav").dataset.rail);if(el)el.scrollBy({left:(+b.dataset.dir)*el.clientWidth*0.9});return}
  if(b.dataset.id)return openItem(b.dataset.id);
  if(b.dataset.all==="people")return openPeople();
  if(b.dataset.all){const p=b.dataset.all==="people",wasOpen=b.getAttribute("aria-expanded")==="true";
    if(p){allPeople=!allPeople;renderPeople()}else{allItems=!allItems;renderItems()}
    if(wasOpen)document.getElementById(p?"people":"items").scrollIntoView({block:"start"});return}
  if(b.dataset.cat){track("둘러보기: "+(CATS[b.dataset.cat]||b.dataset.cat),"",true);return openAll({cat:b.dataset.cat})}
  if(b.dataset.show)return openAll({show:b.dataset.show});
  if(b.dataset.person)return openAll({person:b.dataset.person});
  if(b.dataset.plat){plat=b.dataset.plat;renderUps();return}
  if(b.id==="resetFilter"){F={q:"",cat:"",show:"",person:""};$("#q").value="";renderCats();renderItems();return}
  if(b.id==="clearRecent"){recent=[];saveRecent();renderRecent();toast("최근 본 아이템을 지웠어요");return}
  if(b.dataset.tab){tab=b.dataset.tab;armed=null;renderAdmin();return}
  if(b.dataset.rmimg){if(b.dataset.rmimg==="i"){iImg=false;fetchedImg=null;curImg("#iCur")}else{sImg=false;curImg("#sCur")}return}
  if(b.dataset.edit){const [k,id]=b.dataset.edit.split(":");
    if(k==="item"){const it=S.items.find(i=>i.id===id);if(it)fillItem(it)}else{const s=S.shows.find(x=>x.id===id);if(s)fillShow(s)}return}
  if(b.dataset.del){
    const key=b.dataset.del,[k,id]=key.split(":");
    if(armed!==key){armed=key;renderAdmin();return}
    armed=null;
    if(k==="show"&&countFor(id)){toast(`이 프로그램에 아이템 ${countFor(id)}개가 있어요. 아이템을 먼저 지워 주세요`);renderAdmin();return}
    try{must(await sb.from(k==="item"?"items":k==="person"?"people":"shows").delete().eq("id",id));toast("삭제했어요");
      if(k==="item"&&editI===id)resetIForm();if(k==="show"&&editS===id)resetSForm();await loadData()}catch(err){dbErr(err)}
    return}
  if(b.dataset.fromrep){const r=S.reports.find(x=>x.id===b.dataset.fromrep);if(!r)return;
    tab="items";renderAdmin();resetIForm();
    $("#iPerson").value=r.who||"";$("#iEp").value=r.ep||"";$("#iScene").value=r.auto?"":(r.desc||"");
    if(r.brand)$("#iBrand").value=r.brand;if(r.name)$("#iName").value=r.name;
    if(r.auto&&shopUrlIn(r.desc))$("#iUrl").value=shopUrlIn(r.desc);
    const ck=Object.keys(CATS).find(k=>CATS[k]===r.cat);if(ck)$("#iCat").value=ck;
    const s=findShow(r.show);$("#iShow").value=s?s.title:(r.show||"");syncShowNote();
    toast(r.auto?(s?"자동 수집 내용을 채웠어요. 출처 글과 맞는지 확인하고 구매 링크를 넣어 주세요":"자동 수집 내용을 채웠어요. 새 프로그램이라 플랫폼도 골라 주세요")
      :s?"제보 내용을 채웠어요. 브랜드와 상품명을 넣어 주세요":"제보 내용을 채웠어요. 새 프로그램이라 플랫폼도 골라 주세요");
    $("#iForm").scrollIntoView({behavior:"smooth",block:"start"});return}
  if(b.dataset.done){b.disabled=true;
    try{must(await sb.from("reports").delete().eq("id",b.dataset.done));await loadReports();renderAdmin();toast("처리 완료로 제보함에서 뺐어요")}
    catch(err){dbErr(err);b.disabled=false}return}
});
$("#ov").addEventListener("click",e=>{if(e.target.id==="ov")closeItem()});
$("#allList").addEventListener("click",e=>{const a=e.target.closest(".fc-buy[href]");if(!a)return;const it=S.items.find(i=>i.id===a.dataset.item);
  track("구매처 클릭: "+(a.textContent.trim().split(/\s/)[0]||"")+" · "+(it?it.name:""),"",true)});
$("#ov").addEventListener("click",e=>{const a=e.target.closest(".buys a");if(!a)return;const it=S.items.find(i=>i.id===$("#ov").dataset.item);
  track("구매처 클릭: "+(a.textContent.trim().split(/\s/)[0]||"")+" · "+(it?it.name:""),"",true)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#ov").hidden)closeItem()});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();const q=$("#q").value.trim();if(q)track("검색: "+q.slice(0,60),"",true);openAll({q})});
/* 아이템 전체 페이지 안의 검색창: 새 검색어로 다시 찾기 */
$("#allSearch").addEventListener("submit",e=>{e.preventDefault();const q=$("#allQ").value.trim();if(q)track("검색: "+q.slice(0,60),"",true);F={q:"",cat:"",show:"",person:"",q};renderAll(true);window.scrollTo(0,0)});

/* ---------- boot ---------- */
renderSite();
route();
(async()=>{
  if(!sb){S.noDb=true;renderSite();return}
  const {data}=await sb.auth.getSession();
  await applyAuth(data.session);
  sb.auth.onAuthStateChange((_ev,session)=>{setTimeout(()=>applyAuth(session),0)});
  await loadData();
  if(location.hash.startsWith("#i/"))route();
})();
