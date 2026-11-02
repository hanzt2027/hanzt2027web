/* ============================ 程式（一般不需修改） ============================ */
const C = CONFIG;
C.mapsUrl = "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(C.mapQuery);
let lang = "zh";
const store = { get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}} };
lang = store.get("hefc-lang","zh");
const L = v => v==null ? "" : (typeof v==="object" && !Array.isArray(v)) ? (v[lang] ?? v.zh) : v;
const T = (zh,en) => lang==="en" ? en : zh;
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const todayD = ()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate());};
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const D = s => {const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const WK=["日","一","二","三","四","五","六"],WKE=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fd(s,short){const d=D(s);return lang==="en"?`${WKE[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}${short?"":", "+d.getFullYear()}`:`${short?"":d.getFullYear()+"/"}${d.getMonth()+1}/${d.getDate()}（${WK[d.getDay()]}）`;}
const range=(a,b)=>b&&b!==a?`${fd(a)} – ${fd(b,true)}`:fd(a);
const days=s=>Math.round((D(s)-todayD())/864e5);
function state(a,b){b=b||a;const t=todayD();if(t>D(b))return"past";if(t>=D(a))return"now";return"up";}
function stTag(a,b){const s=state(a,b);if(s==="past")return`<span class="tag past">${T("已截止","Closed")}</span>`;if(s==="now")return`<span class="tag now">${T("進行中","Open")}</span>`;return`<span class="tag">${T("倒數 ","in ")}${days(a)}${T(" 天"," days")}</span>`;}
const tbd=()=>`<span class="tag tbd">${T("暫定","TBC")}</span>`;
const ph=(what,size)=>`<div class="ph"><span><b>〔待填〕${T("放圖","Image")}：${what}</b>${size||""}</span></div>`;
const linkBtn=(url,label,primary)=>url?`<a class="btn${primary?" primary":""}" href="${url}" target="_blank" rel="noopener">${label}</a>`:`<span class="btn" aria-disabled="true">${label}・${T("準備中","Coming soon")}</span>`;
const head=(eb,h,p)=>`<div class="head rv"><span class="eyebrow">${eb}</span><h2>${h}</h2>${p?`<p>${p}</p>`:""}</div>`;
const tabState={}; let timers=[]; let rafId=0;

function tabs(id,list){
  const cur=Math.min(tabState[id]??0,list.length-1);
  return `<div class="tabgroup"><div class="tabs" role="tablist">${list.map((t,i)=>`<button role="tab" aria-selected="${i===cur}" data-tabs="${id}" data-i="${i}">${L(t[0])}</button>`).join("")}</div>${list.map((t,i)=>`<div class="panel" role="tabpanel" data-panel="${id}" data-i="${i}" ${i===cur?"":"hidden"}>${t[1]()}</div>`).join("")}</div>`;
}

/* ---------- fees ---------- */
function stageIndex(dateStr){const i=C.feeStages.findIndex(s=>dateStr<=s.end);return i<0?C.feeStages.length-1:i;}
function calcFee(cat,conf,forum,dateStr){
  const k=stageIndex(dateStr), s=C.feeStages[k], cur=C.feeCur[cat];
  if(forum && cat>1) return {stage:L(s.name),cur,amount:null};
  return {stage:L(s.name),cur,amount:(conf?s.conf[cat]:0)+(forum?s.forum:0),k};
}
const money=(cur,n)=>n==null?T("另洽大會","Contact us"):`${cur} ${n.toLocaleString()}`;

/* ---------- sponsors (sample logos, fictional) ---------- */
function sampleLogo(name,i){
  const hues=["#1747c4","#139fc4","#1e7f4f","#7a4bc0","#b26a00","#0d1b2a"];const c=hues[i%hues.length];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96"><rect width="240" height="96" fill="#ffffff"/><circle cx="40" cy="48" r="20" fill="none" stroke="${c}" stroke-width="5"/><circle cx="40" cy="48" r="7" fill="${c}"/><text x="72" y="54" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#0d1b2a">${name.replace(/&/g,"&amp;")}</text><text x="72" y="72" font-family="Arial, sans-serif" font-size="10" fill="#8a96a3">SAMPLE LOGO</text></svg>`;
  return "data:image/svg+xml,"+encodeURIComponent(svg);
}
const marquee=()=>{const imgs=C.sponsors.map((n,i)=>`<img src="${sampleLogo(n,i)}" alt="${esc(n)}" width="180" height="72">`).join("");return `<div class="marquee" aria-label="${T("贊助廠商","Sponsors")}"><div class="marquee-track">${imgs}${imgs.replace(/alt="[^"]*"/g,'alt=""')}</div></div>`;};

/* ---------- hero ---------- */
function hero(){
  const news=C.news.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(n=>`<a href="#home" data-jump="news">${n.date.slice(5).replace("-","/")}｜${esc(n.title)}</a>`).join("");
  return `<section class="hero"><canvas id="bubbles" aria-hidden="true"></canvas><div class="wrap hero-in">
   <div style="min-width:0">
     <span class="eyebrow">Forum · Conference · Posters — ${T(`第 ${C.edition} 屆`,`${C.edition}nd edition`)}</span>
     <h1 style="margin-top:10px">${L(C.title)}</h1>
     <p class="sub">${L(C.subtitle)}</p>
     ${lang==="zh"?`<p class="en">${C.title.en}</p>`:""}
     <dl class="facts">
       <dt>${T("日期","Date")}</dt><dd class="mono">${range(C.start,C.end)}</dd>
       <dt>${T("地點","Venue")}</dt><dd>${L(C.venue)}<br><span class="note">${L(C.address)}</span></dd>
       <dt>${T("晚宴","Banquet")}</dt><dd>${L(C.banquet)}</dd>
     </dl>
     <div class="cta">
       <a class="btn primary" href="#submit">${T("線上投稿／報名","Submit / Register")}</a>
       <a class="btn" href="#cfp">${T("徵稿資訊","Call for papers")}</a>
       <a class="btn" href="#register">${T("註冊費用","Fees")}</a>
       <a class="btn" href="#contact">${T("參展贊助","Sponsor")}</a>
     </div>
   </div>
   <div class="tile-wrap"><div class="tile" id="heroTile" aria-label="HANZT 2027">
     <div class="row"><span>${C.edition}</span><span>${C.year}</span></div>
     <div class="sym">H<sub>2</sub></div>
     <div><div class="nm">HYDROGEN · NET ZERO · TAINAN</div><div class="cdline" id="tileCd">T−</div></div>
   </div></div>
  </div>
  <div class="ticker"><b>${T("最新公告","News")}</b><div class="ticker-view"><div class="ticker-track">${news}${news}</div></div></div>
  </section>`;
}
function startBubbles(){
  const cv=document.getElementById("bubbles"); if(!cv) return;
  const ctx=cv.getContext&&cv.getContext("2d"); if(!ctx) return; const dpr=Math.min(2,window.devicePixelRatio||1);
  const size=()=>{cv.width=cv.clientWidth*dpr;cv.height=cv.clientHeight*dpr;};
  size(); window.addEventListener("resize",size);
  const col=()=>getComputedStyle(document.documentElement).getPropertyValue("--flame").trim()||"#139fc4";
  const W=()=>cv.width,H=()=>cv.height;
  const mk=(y)=>({x:Math.random()*W(),y:y??H()+20*dpr,r:(4+Math.random()*16)*dpr,v:(.25+Math.random()*.6)*dpr,ph:Math.random()*6.28,lab:Math.random()<.18});
  const bs=Array.from({length:34},()=>mk(Math.random()*H()));
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame(){
    if(!cv.isConnected) return;
    ctx.clearRect(0,0,W(),H()); const c=col();
    for(const b of bs){
      if(!reduce){b.y-=b.v;b.ph+=.015;b.x+=Math.sin(b.ph)*.35*dpr;}
      if(b.y<-30*dpr){Object.assign(b,mk());}
      const fade=Math.min(1,b.y/(H()*.5));
      ctx.globalAlpha=.32*fade; ctx.strokeStyle=c; ctx.lineWidth=1.3*dpr;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,6.283); ctx.stroke();
      if(b.lab&&b.r>10*dpr){ctx.globalAlpha=.45*fade;ctx.fillStyle=c;ctx.font=`600 ${Math.round(b.r*.75)}px "IBM Plex Mono",monospace`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("H₂",b.x,b.y);}
    }
    ctx.globalAlpha=1;
    if(!reduce) rafId=requestAnimationFrame(frame);
  }
  frame();
}
/* 首頁 H₂ 方塊：滑鼠移動時 3D 傾斜 */
function startTilt(){
  const hero=document.querySelector(".hero"), tile=document.getElementById("heroTile");
  if(!hero||!tile||matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  hero.onpointermove=e=>{if(e.pointerType!=="mouse")return;const t=tile.getBoundingClientRect(),cx=t.left+t.width/2,cy=t.top+t.height/2;
    const ry=Math.max(-14,Math.min(14,(e.clientX-cx)/innerWidth*40)), rx=Math.max(-12,Math.min(12,-(e.clientY-cy)/innerHeight*34));
    tile.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;};
  hero.onpointerleave=()=>{tile.style.transform="";};
}
function startCountdown(){
  const el=document.getElementById("cd"), tc=document.getElementById("tileCd"); if(!el&&!tc) return;
  const [h,m]=C.openTime.split(":").map(Number); const tgt=D(C.start); tgt.setHours(h,m,0,0);
  const p2=n=>String(n).padStart(2,"0");
  const tick=()=>{let s=Math.max(0,Math.floor((tgt-new Date())/1000));const v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
    if(el) el.querySelectorAll("b").forEach((b,i)=>b.textContent=String(v[i]).padStart(i?2:1,"0"));
    if(tc) tc.textContent=s>0?`T−${v[0]}${T(" 天 ","d ")}${p2(v[1])}:${p2(v[2])}:${p2(v[3])}`:"LIVE · NCKU";};
  tick(); timers.push(setInterval(tick,1000));
}

/* ---------- views ---------- */
const V={};
V.home=()=>{
  const cats={all:T("全部","All"),general:T("公告","General"),cfp:T("徵稿","Papers"),reg:T("註冊","Registration"),agenda:T("議程","Program"),notice:T("行前通知","Briefing"),award:T("得獎","Awards")};
  const f=tabState.news||"all";
  const allNews=C.news.filter(n=>f==="all"||n.cat===f).sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||b.date.localeCompare(a.date));
  const news=tabState.newsAll?allNews:allNews.slice(0,3);
  const e=D(C.end);e.setDate(e.getDate()+1);
  const gcal=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(C.short)}&dates=${C.start.replace(/-/g,"")}/${iso(e).replace(/-/g,"")}&location=${encodeURIComponent(L(C.venue))}`;
  const quick=[["cfp","Call for papers",T("徵稿資訊","Call for papers"),T("投稿主題、格式、獎項與範本下載","Topics, formats, prizes, templates")],["submit","Submit",T("線上投稿／報名","Submit / Register"),T("投稿、修改稿件、回報匯款","Submit, revise, report payment")],["register","Fees",T("註冊費用","Fees"),T("各階段費用與費用試算","Fees by stage and calculator")],["agenda","Program",T("議程","Program"),T("兩日議程與逐篇發表時間","Two-day program and paper slots")],["venue","Travel",T("交通住宿","Travel & venue"),T("交通方式、地圖、住宿與晚宴","Getting there, map, hotels, banquet")],["faq","FAQ","FAQ",T("報名、投稿、費用、交通問答","Common questions")]];
  return `
  <section class="section">${head("Important dates",T("重要日程","Important dates"),T("依今天日期自動標示狀態；標示「暫定」者尚待確認。","Status updates automatically; TBC items are provisional."))}
    <div class="card rv" style="padding:28px 24px"><ol class="htl" style="--n:${C.dates.length}">${C.dates.map(d=>{const a=d.extendedTo||d.start,st=state(a,d.end);return`<li class="${st}"><span class="d">${d.extendedTo?`<s>${fd(d.start,true)}</s> → ${fd(d.extendedTo,true)}`:range(d.start,d.end).replace(/^\d{4}\//,"")}</span><span class="l">${L(d.label)}</span><span>${d.tbd?tbd():""} ${stTag(a,d.end)}</span></li>`}).join("")}</ol></div>
    <div><a class="btn small" href="${gcal}" target="_blank" rel="noopener">${T("把大會加入 Google 日曆","Add the conference to Google Calendar")}</a></div>
  </section>
  <section class="section" id="news">${head("News",T("最新消息","News"))}
    <div class="filters">${Object.entries(cats).map(([k,v])=>`<button class="chip" data-news="${k}" aria-pressed="${f===k}">${v}</button>`).join("")}</div>
    <div class="newslist">${news.length?news.map(n=>`<article class="news-item rv"><div class="meta"><span class="mono">${n.date.replace(/-/g,".")}</span>${n.pin?`<span class="pin">${T("置頂","Pinned")}</span>`:""}<span class="tag" style="color:var(--flame)">${cats[n.cat]}</span></div><h3>${esc(n.title)}</h3><p class="note">${esc(n.text)}</p></article>`).join(""):`<p class="note">${T("此分類目前沒有消息。","No news in this category.")}</p>`}</div>
    ${allNews.length>3?`<div><button class="btn small" data-newsall="1">${tabState.newsAll?T("收合","Show less"):T(`看全部 ${allNews.length} 則`,`Show all ${allNews.length}`)}</button></div>`:""}
  </section>
  <section class="grid2" style="align-items:center;gap:40px">
    <div class="prose rv">${head("About",T(`關於 ${C.short}`,`About ${C.short}`))}<p>${L(C.about)}</p>
      <div class="grid3" style="margin-top:8px">${C.highlights.map(([h,d])=>`<div><b>${L(h)}</b><p class="note">${d}</p></div>`).join("")}</div>
      <div><a class="btn small" href="#info">${T("更多大會資訊 →","More about the conference →")}</a></div></div>
    ${ph(T("大會主視覺海報","Key visual poster"),"（建議 1200×1700 或 1600×900）")}
  </section>
  <section class="section">${head("Quick links",T("快速入口","Quick links"))}
    <div class="grid3">${quick.map(([h,eb,t,d])=>`<a class="card rv" href="#${h}"><span class="eyebrow">${eb}</span><h3>${t}</h3><p class="note">${d}</p><span class="go">${T("前往 →","Open →")}</span></a>`).join("")}</div>
    <div class="card" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center"><b style="margin-right:6px">${T("下載","Downloads")}</b>${linkBtn(C.links.handbook,T("大會手冊","Handbook"))}${linkBtn(C.links.briefing,T("行前通知","Briefing"))}${linkBtn(C.links.awards,T("得獎名單","Awards"))}${linkBtn(C.links.photos,T("活動照片","Photos"))}</div>
  </section>
  <section class="section">${head("Sponsors",T("贊助夥伴","Sponsors"),T("目前為樣品 logo，正式贊助商確定後替換。","Sample logos for now."))}${marquee()}<div><a class="btn" href="#contact">${T("成為贊助夥伴","Become a sponsor")}</a></div></section>
  <section class="section">${head("Organizers",T("主協辦單位","Organizers"))}
    ${C.organizers.map(g=>`<div class="org-group"><h3>${L(g.role)}</h3><div class="logos">${g.items.map(n=>`<div class="ph"><span><b>${n}</b>〔待填〕Logo</span></div>`).join("")}</div></div>`).join("")}
  </section>`;
};

V.info=()=>`${head("About",T("會議資訊","Conference information"),`${range(C.start,C.end)}・${L(C.venue)}`)}
<section class="grid2"><div class="prose rv"><h3>${T("大會宗旨與願景","Mission")}</h3><p>${L(C.about)}</p></div>${ph(T("往屆活動照片","Past event photo"))}</section>
<section style="display:grid;gap:16px"><h3>${T("大會目標","Goals")}</h3><div class="grid4">${C.goals.map(([h,d])=>`<div class="card rv"><h3>${L(h)}</h3><p class="note">${d}</p></div>`).join("")}</div></section>
<section style="display:grid;gap:16px"><h3>${T("核心主題","Core topics")}</h3><div class="grid3">${C.topics.map(g=>`<a class="card rv" href="#cfp"><h3>${L(g.area)}</h3><p class="note">${g.items.map(i=>i[0]+" "+L(i[1])).join("、")}</p></a>`).join("")}</div></section>
<section style="display:grid;gap:16px"><h3>${T("大會組織架構","Organization")}</h3><p class="note">${T("實際名單以正式公告為準。","Subject to official announcement.")}</p>
 <div class="grid3">${C.committeeKey.map(([r,n,o])=>`<div class="card"><span class="eyebrow">${r}</span><p style="font-weight:700;margin-top:6px">${n}</p><p class="note">${o}</p></div>`).join("")}</div></section>
<section style="display:grid;gap:16px"><h3>${T("籌備工作小組","Working groups")}</h3><div class="tw"><table><thead><tr><th>${T("組別","Group")}</th><th>${T("負責人","Lead")}</th><th>${T("主要工作","Responsibilities")}</th></tr></thead><tbody>${C.workgroups.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div></section>
<section style="display:grid;gap:16px"><h3>${T("委員名單","Committee members")}</h3><div class="grid4">${C.members.map(m=>`<div class="card" style="padding:14px 16px">${m}</div>`).join("")}</div></section>`;

function agendaDay(day){
  const names={keynote:T("大會演講","Plenary"),forum:T("技術論壇","Forum"),paper:T("論文發表","Papers"),break:T("報到／休息","Break"),social:T("餐敘","Social"),ceremony:T("典禮","Ceremony")};
  const now=new Date(), isToday=iso(todayD())===day.day, hm=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return `<div class="legend">${Object.entries(names).map(([k,v])=>`<span><i style="background:var(--c-${k})"></i>${v}</span>`).join("")}</div>
  <div class="ag">${day.items.map(([a,b,k,t,w])=>`<div class="ag-row${isToday&&hm>=a&&hm<b?" live":""}" data-search="${esc((L(t)+" "+w).toLowerCase())}"><span class="t">${a}–${b}</span><span class="ag-bar" style="background:var(--c-${k})"></span><div><span class="k" style="color:var(--c-${k})">${names[k]}</span><div style="font-weight:700">${L(t)}</div>${w?`<div class="note">${w}</div>`:""}</div></div>`).join("")}</div>`;
}
function paperTable(list){
  const mine=store.get("hefc-mine",[]);
  return `<div class="tw"><table><thead><tr><th style="width:40px"><span class="note">★</span></th><th>${T("編號","ID")}</th><th>${T("時間","Time")}</th><th>${T("題目","Title")}</th><th>${T("作者","Authors")}</th><th>${T("地點","Room")}</th></tr></thead><tbody>${list.map(r=>`<tr data-paper="${r[0]}" data-search="${esc(r.join(" ").toLowerCase())}"><td><button class="star" data-star="${r[0]}" aria-pressed="${mine.includes(r[0])}" aria-label="${T("加入我的場次","Add to my schedule")}">★</button></td><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table></div>`;
}
V.agenda=()=>`${head("Program",T("議程資訊","Program"),T("Day 1 技術論壇、Day 2 學術研討會。議程為暫定版本，以大會最新公告為準。","Day 1 forum, Day 2 conference. Provisional."))}
<div class="toolbar"><input type="search" id="agSearch" placeholder="${T("搜尋論文編號、題目、作者或講者","Search by ID, title, author or speaker")}" aria-label="search"><button class="chip" id="mineOnly" aria-pressed="false">★ ${T("只看我的場次","My schedule only")}</button>${linkBtn(C.links.agendaPdf,T("下載議程 PDF","Program PDF"))}</div>
<div id="agWrap">${tabs("agenda",[
 [{zh:`Day 1 ${C.agenda[0].name.zh}`,en:`Day 1 ${C.agenda[0].name.en}`},()=>`<p class="note">${fd(C.agenda[0].day)}</p>`+agendaDay(C.agenda[0])],
 [{zh:`Day 2 ${C.agenda[1].name.zh}`,en:`Day 2 ${C.agenda[1].name.en}`},()=>`<p class="note">${fd(C.agenda[1].day)}</p>`+agendaDay(C.agenda[1])],
 [{zh:"一般論文發表",en:"Oral papers"},()=>paperTable(C.papers.oral)],
 [{zh:"學生論文競賽",en:"Student competition"},()=>paperTable(C.papers.student)],
 [{zh:"海報競賽",en:"Posters"},()=>paperTable(C.papers.poster)]
])}</div><p class="note">${T("★ 標記的場次只存在你這台裝置的瀏覽器裡。","Starred sessions are saved in this browser only.")}</p>`;

V.speakers=()=>`${head("Featured speakers",T("大會講者","Plenary speakers"),T(`Day 2 大會演講・${fd(C.agenda[1].day)}`,`Day 2 plenary · ${fd(C.agenda[1].day)}`))}
<div class="grid2">${C.keynotes.map(k=>`<div class="card rv"><div class="person">${ph(T("講者照片","Photo"))}<div style="min-width:0"><span class="eyebrow">${k.time.slice(11)}・${fd(k.time.slice(0,10),true)}</span><h3 style="margin-top:4px">${k.name}</h3><p class="note">${k.org}</p><p style="margin-top:8px;font-weight:700">${k.title}</p><p class="note" style="margin-top:4px">${T("引言人","Chair")}：${k.chair}</p></div></div>
<details><summary>${T("講者簡介與演講摘要","Biography & abstract")}</summary><div><b>${T("講者介紹","Biography")}</b><p>${k.bio}</p><b>${T("演講摘要","Abstract")}</b><p>${k.abs}</p></div></details></div>`).join("")}</div>
<div><a class="btn" href="#agenda">${T("查看完整議程","Full program")}</a></div>`;

V.cfp=()=>{const dls=C.dates.filter(d=>d.deadline);
return `${head("Call for papers",T("徵稿資訊","Call for papers"),T("三大領域、八個主題；一般論文、學生論文競賽與海報競賽三種發表形式。","Three areas, eight topics; oral, student competition and poster."))}
<div class="grid3">${dls.map(d=>`<div class="card rv"><span class="eyebrow">Deadline</span><h3 style="margin-top:6px">${L(d.label)}</h3><p class="mono">${fd(d.extendedTo||d.start)} 23:59</p><p style="margin-top:6px">${d.tbd?tbd():""} ${stTag(d.extendedTo||d.start)}</p></div>`).join("")}
<div class="card rv" style="display:grid;gap:10px;align-content:center"><p>${T("每篇論文至少須有 1 人完成註冊。","At least one author must register per paper.")}</p><a class="btn primary" href="#submit">${T("前往線上投稿","Submit online")}</a></div></div>
${tabs("cfp",[
 [{zh:"投稿主題",en:"Topics"},()=>`<div class="grid3" style="align-items:start">${C.topics.map(g=>`<div style="display:grid;gap:4px"><h3>${L(g.area)}</h3>${g.items.map(([c,n,d])=>`<div class="topic"><span class="code">${c}</span><div><div style="font-weight:700">${L(n)}</div><p class="note">${L(d)}</p></div></div>`).join("")}</div>`).join("")}</div>`],
 [{zh:"格式與規定",en:"Formats"},()=>`<div class="grid3">${C.formats.map(([h,d])=>`<div class="card"><h3>${L(h)}</h3><p class="note">${d}</p></div>`).join("")}</div>`],
 [{zh:"獎項",en:"Prizes"},()=>`<div class="grid4">${C.prizes.map(([h,d])=>`<div class="card"><span class="eyebrow">${h}</span><p class="mono" style="font-size:1.2rem;margin-top:6px">${d}</p></div>`).join("")}</div>`],
 [{zh:"範本下載",en:"Templates"},()=>`<div class="grid2"><div class="card prose"><h3>${T("一般投稿範本","General template")}</h3><p class="note">${T("適用一般論文、學生論文競賽、海報競賽（暫定）","For all paper types (TBC)")}</p><div class="dl">${linkBtn(C.links.templateZh,T("中文範本","Chinese"))}${linkBtn(C.links.templateEn,T("英文範本","English"))}</div></div>
   <div class="card prose"><h3>${T("學生論文競賽範本","Student template")}</h3><div class="dl">${linkBtn(C.links.templateStudentZh,T("中文範本","Chinese"))}${linkBtn(C.links.templateStudentEn,T("英文範本","English"))}</div></div>
   <div class="card prose"><h3>${T("海報張貼範本","Poster template")}</h3><div class="dl">${linkBtn(C.links.templatePoster,T("開啟範本","Open"))}</div></div>
   <div class="card prose"><h3>${T("著作權授權書","Copyright form")}</h3><p class="note">${T("錄取後隨通知信提供（暫定）","Sent with acceptance (TBC)")}</p><div class="dl">${linkBtn(C.links.copyright,T("下載授權書","Download"))}</div></div></div>`]
])}`;};

V.register=()=>{
  const k=C.feeStages.findIndex(s=>state(s.start,s.end)==="now");
  const th=C.feeStages.map((s,i)=>`<th class="num">${L(s.name)}<br><span class="mono note" style="font-weight:400">${fd(s.start,true)}–${fd(s.end,true)}</span>${i===k?`<br><span class="tag now">${T("目前","Now")}</span>`:""}</th>`).join("");
  return `${head("Registration",T("研討會註冊","Registration"),T("費用依匯款日期判斷級距。金額參考往年標準，屬暫定。","Fees follow the payment date. Provisional amounts."))}
  <section style="display:grid;gap:12px"><h3>${T("學術研討會註冊費","Conference fees")} ${tbd()}</h3>
  <div class="tw"><table><thead><tr><th>${T("身分","Category")}</th>${th}</tr></thead><tbody>${C.feeCats.map((c,ci)=>`<tr><td>${L(c)}</td>${C.feeStages.map((s,i)=>`<td class="num${i===k?" cur":""}">${C.feeCur[ci]} ${s.conf[ci].toLocaleString()}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>
  <section style="display:grid;gap:12px"><h3>${T("技術論壇註冊費","Forum fees")} ${tbd()}</h3>
  <div class="tw"><table><thead><tr><th>${T("項目","Item")}</th>${th}</tr></thead><tbody><tr><td>${T("技術論壇（Day 1）","Forum (Day 1)")}</td>${C.feeStages.map((s,i)=>`<td class="num${i===k?" cur":""}">NTD ${s.forum.toLocaleString()}</td>`).join("")}</tr></tbody></table></div></section>
  <section class="card" style="display:grid;gap:16px"><h3>${T("費用試算","Fee calculator")}</h3>
   <div class="frow">
    <div class="field"><label for="fcCat">${T("身分","Category")}</label><select id="fcCat">${C.feeCats.map((c,i)=>`<option value="${i}">${L(c)}</option>`).join("")}</select></div>
    <div class="field"><label for="fcWhat">${T("報名項目","What")}</label><select id="fcWhat"><option value="conf">${T("學術研討會（Day 2）","Conference")}</option><option value="forum">${T("技術論壇（Day 1）","Forum")}</option><option value="both">${T("兩日都參加","Both days")}</option></select></div>
    <div class="field"><label for="fcDate">${T("預計匯款日期","Payment date")}</label><input type="date" id="fcDate" value="${iso(todayD())}"></div>
   </div><div class="feebox" id="fcOut" aria-live="polite"></div></section>
  <section style="display:grid;gap:14px"><h3>${T("報名流程","How to register")}</h3>
  <ol class="steps"><li>${T("在「線上投稿／報名」選擇報名模式並送出","Submit the online form")}</li><li>${T("收到確認信（含編號與驗證碼）","Receive your ID and code by email")}</li><li>${T("完成匯款","Pay the fee")}</li><li>${T("登入「稿件與匯款管理」回報末 5 碼","Report the last 5 digits")}</li><li>${T("收到繳費確認信，完成報名","Receive payment confirmation")}</li></ol></section>
  <div class="grid2"><div class="card"><h3>${T("匯款資訊","Bank details")}</h3><dl class="kv" style="margin-top:12px">${C.bank.map(([a,b])=>`<dt>${a}</dt><dd class="mono">${b}</dd><span></span>`).join("")}</dl></div>
  <div class="card prose"><h3>${T("注意事項","Notes")}</h3><ul><li>${T("每篇論文至少須有 1 人註冊。","At least one registration per paper.")}</li><li>${T("學生身分需上傳學生證明。","Students must upload proof of status.")}</li><li>${C.refund}</li><li>${T("未盡事宜以現場公告為主，大會保留最終解釋權。","The organizers reserve the right of final interpretation.")}</li></ul><div class="cta" style="margin-top:4px"><a class="btn primary" href="#submit">${T("前往報名","Register now")}</a></div></div></div>`;
};
function updateCalc(){
  const o=document.getElementById("fcOut"); if(!o) return;
  const cat=+document.getElementById("fcCat").value, w=document.getElementById("fcWhat").value, d=document.getElementById("fcDate").value||iso(todayD());
  const r=calcFee(cat,w!=="forum",w!=="conf",d);
  o.innerHTML=`<span class="note">${T("應繳","Total")}</span><b>${money(r.cur,r.amount)}</b><span class="note">${r.stage}${r.amount==null?"":"・"+T("依匯款日期","by payment date")}</span>`;
}

/* ---------- submission & manage ---------- */
const MODES={paper:{zh:"論文投稿",en:"Submit a paper"},forum:{zh:"只報名技術論壇（Day 1）",en:"Forum only (Day 1)"},conf:{zh:"只報名學術研討會（不投稿）",en:"Conference only (no paper)"},both:{zh:"兩日報名（不投稿）",en:"Both days (no paper)"}};
const TYPES={oral:{zh:"一般論文發表 (Oral)",en:"Oral paper"},student:{zh:"學生論文競賽 (Oral Competition)",en:"Student competition"},poster:{zh:"海報發表 (Poster)",en:"Poster"}};
const demoNote=()=>C.apiUrl?"":`<div class="banner info">${T("展示模式：尚未連接後端，資料只會暫存在這個頁面，不會真的送出或寄信。試用帳號：demo@example.com／驗證碼 12345。","Demo mode: not connected to the backend. Try demo@example.com / code 12345.")}</div>`;
V.submit=()=>`${head("Submission",T("線上投稿與報名","Online submission & registration"),T("送出後系統會寄出確認信，信中有編號與 5 位數驗證碼，之後用來修改稿件與回報匯款。","You'll receive an ID and a 5-digit code by email for later revisions and payment reports."))}
${demoNote()}
${tabs("sub",[
 [{zh:"線上投稿／報名",en:"Submit / register"},()=>`<form class="form card" id="subForm" novalidate>
  <div class="field"><span class="lbl req">${T("報名模式","Registration type")}</span><div class="seg">${Object.entries(MODES).map(([k,v],i)=>`<label><input type="radio" name="mode" value="${k}" ${i===0?"checked":""}><span>${L(v)}</span></label>`).join("")}</div></div>
  <div class="frow" data-paper>
   <div class="field"><label class="req" for="sType">${T("發表形式","Presentation")}</label><select id="sType" name="type"><option value="">${T("請選擇","Select")}</option>${Object.entries(TYPES).map(([k,v])=>`<option value="${k}">${L(v)}</option>`).join("")}</select></div>
   <div class="field"><label class="req" for="sField">${T("投稿領域","Area")}</label><select id="sField" name="field"><option value="">${T("請選擇","Select")}</option>${C.topics.map(g=>`<option value="${g.key}">${L(g.area)}</option>`).join("")}</select></div>
  </div>
  <div class="field" data-paper><label class="req" for="sTitle">${T("論文題目","Paper title")}</label><input id="sTitle" name="title"></div>
  <div class="frow">
   <div class="field"><label class="req" for="sAuthor"><span data-paper>${T("發表作者","Presenting author")}</span><span data-nopaper hidden>${T("姓名","Name")}</span></label><input id="sAuthor" name="author" autocomplete="name"></div>
   <div class="field"><label class="req" for="sAff">${T("單位／學校","Affiliation")}</label><input id="sAff" name="affiliation" autocomplete="organization"></div>
  </div>
  <div class="frow">
   <div class="field"><label class="req" for="sEmail">Email</label><input id="sEmail" name="email" type="email" autocomplete="email"><span class="hint">${T("確認信與驗證碼會寄到這裡","Your ID and code will be sent here")}</span></div>
   <div class="field"><span class="lbl req">${T("身分","Status")}</span><div class="seg"><label><input type="radio" name="identity" value="general" checked>${T("國內一般","Domestic")}</label><label><input type="radio" name="identity" value="student">${T("國內學生","Domestic student")}</label><label><input type="radio" name="identity" value="intl">${T("國際一般（USD）","International (USD)")}</label><label><input type="radio" name="identity" value="intlStudent">${T("國際學生（USD）","International student (USD)")}</label></div><span class="hint">${T("國內身分以新台幣計價，可刷卡、ATM、超商或匯款；國際身分以美金計價，使用 PayPal。","Domestic: NTD by card/ATM/convenience store/transfer. International: USD via PayPal.")}</span></div>
  </div>
  <div class="field" data-student hidden><label class="req" for="sProof">${T("學生證明","Student proof")}</label><input id="sProof" name="proof" type="file" accept=".pdf,.png,.jpg,.jpeg"><span class="hint">PDF／PNG／JPG，≤20 MB</span></div>
  <label data-paper style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="withForum">${T("同時報名技術論壇（加計論壇註冊費）","Also register for the forum (adds forum fee)")}</label>
  <div class="frow" data-paper>
   <div class="field"><label for="sCorr">${T("通訊作者（指導教授）","Corresponding author")}</label><input id="sCorr" name="corrAuthor"></div>
   <div class="field"><label for="sCorrE">${T("通訊作者 Email","Corresponding email")}</label><input id="sCorrE" name="corrEmail" type="email"></div>
  </div>
  <div class="field" data-paper><label class="req" for="sAbs">${T("摘要簡述","Abstract")}</label><textarea id="sAbs" name="abstract"></textarea><span class="hint counter" id="absCount"></span></div>
  <div class="field" data-paper><label class="req" for="sKw">${T("關鍵字","Keywords")}</label><input id="sKw" name="keywords" placeholder="${T("以逗號分隔","comma-separated")}"></div>
  <div class="field" data-paper><label class="req" for="sPdf">${T("論文摘要 PDF","Abstract PDF")}</label><input id="sPdf" name="pdf" type="file" accept=".pdf"><span class="hint">${T("請依範本製作，PDF，≤20 MB","Use the template, PDF ≤20 MB")}</span></div>
  <details class="card" style="padding:14px 18px;margin:0"><summary>${T("個人資料蒐集、處理及利用告知","Privacy notice")}</summary><div class="note" style="display:grid;gap:6px;padding-top:8px">${T(
    `<p>依據《個人資料保護法》，${C.short} 大會（主辦：${C.organizers[1].items.join("、")}；合辦：${C.organizers[2].items.join("、")}）告知如下：</p><p>一、蒐集目的：研討會投稿審查、報名、繳費、收據開立、會議通知與會務聯繫。</p><p>二、蒐集類別：姓名、單位、Email、學生身分證明、投稿內容、付款紀錄（信用卡資料由綠界或 PayPal 處理，大會不會取得完整卡號）。</p><p>三、利用期間與方式：自蒐集起至會議結束後〔待填〕年內，由大會與主辦、合辦單位於上述目的範圍內利用。</p><p>四、您可依個資法第 3 條請求查詢、閱覽、更正、停止利用或刪除，請來信 hanzt2027@gmail.com。</p><p>五、若不提供必要資料，將無法完成投稿或報名。</p>`,
    `<p>${C.short} collects your name, affiliation, email, student proof, submission and payment records solely for paper review, registration, payment, receipts and conference communication. Card details are handled by ECPay or PayPal; we never receive full card numbers. Data are kept for 〔待填〕 years after the conference. To access, correct or delete your data, email hanzt2027@gmail.com. Without the required data we cannot process your submission.</p>`)}</div></details>
  <label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" name="consent" style="margin-top:6px"><span class="req">${T("我已閱讀並同意上述個人資料蒐集、處理及利用告知","I have read and agree to the privacy notice")}</span></label>
  <div class="feebox" id="subFee" aria-live="polite"></div>
  <div id="subMsg" aria-live="polite"></div>
  <div><button class="btn primary" type="submit" id="subBtn">${T("確認送出","Submit")}</button></div>
 </form>`],
 [{zh:"稿件與匯款管理",en:"Manage submission"},()=>`<form class="form card" id="verForm" novalidate><h3>${T("驗證身分","Sign in")}</h3><p class="note">${T("請使用確認信中的 Email 與驗證碼。","Use the email and code from your confirmation.")}</p>
   <div class="frow"><div class="field"><label class="req" for="vEmail">Email</label><input id="vEmail" type="email" autocomplete="email"></div><div class="field"><label class="req" for="vCode">${T("驗證碼","Code")}</label><input id="vCode" inputmode="numeric" maxlength="5" class="mono"></div></div>
   <div id="verMsg" aria-live="polite"></div><div><button class="btn primary" type="submit">${T("驗證並載入","Verify")}</button></div></form>
   <div id="manageArea"></div>`]
])}`;

function statusPill(v){const m={"審核通過":"ok","已繳費":"ok","待確認":"warn","審核未通過":"bad","未繳費":"bad"};return v?`<span class="pill ${m[v]||""}">${v}</span>`:"";}
function readFile(f){return new Promise((res,rej)=>{if(f.size>20*1024*1024)return rej(new Error(T("檔案超過 20 MB","File exceeds 20 MB")));const r=new FileReader();r.onload=()=>res({name:f.name,mime:f.type||"application/octet-stream",data:String(r.result).split(",")[1]});r.onerror=()=>rej(new Error("read error"));r.readAsDataURL(f);});}
const showMsg=(id,ok,html)=>{const el=document.getElementById(id);if(el)el.innerHTML=`<div class="msg ${ok?"ok":"err"}">${html}</div>`;};

const IDX={general:0,student:1,intl:2,intlStudent:3};
function initSubmit(){
  const f=document.getElementById("subForm"); if(!f) return;
  const sync=()=>{
    const mode=f.elements.mode.value, paper=mode==="paper", idn=f.elements.identity.value, stu=idn==="student"||idn==="intlStudent", intl=idn==="intl"||idn==="intlStudent";
    f.elements.withForum.disabled=intl; if(intl) f.elements.withForum.checked=false;
    f.querySelectorAll("[data-paper]").forEach(e=>e.hidden=!paper);
    f.querySelectorAll("[data-nopaper]").forEach(e=>e.hidden=paper);
    f.querySelector("[data-student]").hidden=!stu;
    const conf=mode!=="forum", forum=mode==="forum"||mode==="both"||(paper&&f.elements.withForum.checked);
    const r=calcFee(IDX[idn]??0,conf,forum,iso(todayD()));
    document.getElementById("subFee").innerHTML=(intl&&forum)?`<span class="note">${T("國際身分報名技術論壇請來信洽詢大會 hanzt2027@gmail.com","International forum registration: please email hanzt2027@gmail.com")}</span>`:`<span class="note">${T("目前應繳","Fee if paid today")}</span><b>${money(r.cur,r.amount)}</b><span class="note">${r.stage}・${T("實際以付款日期為準","final amount follows payment date")}</span>`;
    const a=f.elements.abstract.value, cjk=/[㐀-鿿]/.test(a), n=cjk?a.replace(/\s/g,"").length:(a.trim()?a.trim().split(/\s+/).length:0), lim=cjk?500:1000;
    const c=document.getElementById("absCount"); c.textContent=`${n} / ${lim} ${cjk?T("字","chars"):T("詞","words")}`; c.classList.toggle("over",n>lim);
  };
  f.addEventListener("input",sync); f.addEventListener("change",sync); sync();
  f.addEventListener("submit",async e=>{
    e.preventDefault(); const btn=document.getElementById("subBtn");
    const mode=f.elements.mode.value, paper=mode==="paper";
    const p={action:"submit",mode,identity:f.elements.identity.value,consent:f.elements.consent.checked,author:f.elements.author.value.trim(),affiliation:f.elements.affiliation.value.trim(),email:f.elements.email.value.trim()};
    if(paper) Object.assign(p,{type:f.elements.type.value,field:f.elements.field.value,title:f.elements.title.value.trim(),withForum:f.elements.withForum.checked,corrAuthor:f.elements.corrAuthor.value.trim(),corrEmail:f.elements.corrEmail.value.trim(),abstract:f.elements.abstract.value.trim(),keywords:f.elements.keywords.value.trim()});
    const miss=[];
    if(!p.author)miss.push(T("姓名","name"));if(!p.affiliation)miss.push(T("單位","affiliation"));if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))miss.push("Email");
    if(paper){if(!p.type)miss.push(T("發表形式","type"));if(!p.field)miss.push(T("領域","area"));if(!p.title)miss.push(T("題目","title"));if(!p.abstract)miss.push(T("摘要","abstract"));if(!p.keywords)miss.push(T("關鍵字","keywords"));if(!f.elements.pdf.files[0])miss.push("PDF");}
    const stuId=p.identity==="student"||p.identity==="intlStudent", intlId=p.identity==="intl"||p.identity==="intlStudent";
    if(stuId&&!f.elements.proof.files[0])miss.push(T("學生證明","student proof"));
    if(!p.consent)miss.push(T("個資同意","privacy consent"));
    if(intlId&&(mode==="forum"||mode==="both"||p.withForum)) return showMsg("subMsg",false,T("國際身分報名技術論壇請來信洽詢大會 hanzt2027@gmail.com","International forum registration: please email hanzt2027@gmail.com"));
    if(miss.length) return showMsg("subMsg",false,T("請補齊：","Please complete: ")+miss.join("、"));
    btn.disabled=true; btn.textContent=T("送出中…","Submitting…");
    try{
      if(paper){const pdf=f.elements.pdf.files[0]; if(pdf.type!=="application/pdf") throw new Error(T("論文檔案需為 PDF","Paper must be a PDF")); p.pdf=await readFile(pdf);}
      if(stuId) p.proof=await readFile(f.elements.proof.files[0]);
      const r=await api(p); if(!r.ok) throw new Error(r.error);
      showMsg("subMsg",true,`<b>${T("送出成功","Submitted")}</b>　${T("編號","ID")} <span class="mono">${r.id}</span>・${T("應繳","Fee")} ${r.fee.currency||"NTD"} ${r.fee.amount.toLocaleString()}（${r.fee.stage}）<br>${T("請到「稿件與匯款管理」登入後線上付款。","Sign in to Manage submission to pay online.")}<br><span class="note">${r.demoCode?T(`展示模式驗證碼：${r.demoCode}`,`Demo code: ${r.demoCode}`):T("確認信與驗證碼已寄到你的 Email，沒收到請檢查垃圾郵件匣。","Check your inbox (and spam) for the code.")}</span>`);
      f.reset(); sync();
    }catch(err){showMsg("subMsg",false,esc(err.message));}
    finally{btn.disabled=false;btn.textContent=T("確認送出","Submit");}
  });
}
function initManage(){
  const v=document.getElementById("verForm"); if(!v) return;
  v.addEventListener("submit",async e=>{e.preventDefault();
    try{const r=await api({action:"verify",email:vEmail.value.trim(),code:vCode.value.trim()}); if(!r.ok) throw new Error(r.error);
      document.getElementById("verMsg").innerHTML=""; renderManage(r.record,vEmail.value.trim(),vCode.value.trim());}
    catch(err){showMsg("verMsg",false,esc(err.message));}
  });
}
let pubCfg=null;
async function getPublicConfig(){ if(pubCfg) return pubCfg; try{const r=await api({action:"publicConfig"}); pubCfg=r&&r.ok?r:{ecpay:{},paypal:{}};}catch(e){pubCfg={ecpay:{},paypal:{}};} return pubCfg; }
function alertMsg(err){const m=document.getElementById("ecpayMsg")||document.getElementById("ppMsg")||document.getElementById("payMsg"); if(m) m.innerHTML=`<div class="msg err">${esc(err.message||err)}</div>`;}
/* 綠界：先同步開新視窗（避免被瀏覽器擋），再把付款表單送到那個視窗 */
async function payEcpay(email,code){
  let w=null; try{w=window.open("","hanztpay");}catch(e){}
  try{ if(w&&w.document) w.document.write('<p style="font-family:sans-serif;padding:24px">正在前往綠界付款頁… Redirecting to ECPay…</p>'); }catch(e){}
  try{
    const r=await api({action:"ecpayCreate",email,code}); if(!r.ok) throw new Error(r.error);
    const form=document.createElement("form"); form.method="POST"; form.action=r.url; form.acceptCharset="UTF-8"; form.target=w?"hanztpay":"_top";
    Object.entries(r.params).forEach(([k,v])=>{const i=document.createElement("input");i.type="hidden";i.name=k;i.value=v;form.appendChild(i);});
    document.body.appendChild(form); form.submit(); form.remove();
    showMsg("ecpayMsg",true,T("已開啟綠界付款頁。付款完成後，回到這裡按「重新整理狀態」。","ECPay opened. After paying, come back and press Refresh status."));
  }catch(err){ try{w&&w.close();}catch(e){} showMsg("ecpayMsg",false,esc(err.message)); }
}
/* PayPal：從後端取得 Client ID 後載入 SDK；訂單由後端建立與確認 */
async function mountPayPal(email,code){
  const box=document.getElementById("ppBtns");
  try{
    const cfg=await getPublicConfig(); const cid=cfg.paypal&&cfg.paypal.clientId;
    if(!cid){box.innerHTML=`<p class="note">${T("PayPal 付款尚未開通，請來信 hanzt2027@gmail.com。","PayPal is not available yet. Please email hanzt2027@gmail.com.")}</p>`;return;}
    if(!window.paypal) await new Promise((res,rej)=>{const sc=document.createElement("script");sc.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cid)}&currency=USD&intent=capture`;sc.onload=res;sc.onerror=()=>rej(new Error(T("PayPal 載入失敗","Could not load PayPal")));document.head.appendChild(sc);});
    box.innerHTML="";
    window.paypal.Buttons({
      createOrder:async()=>{const r=await api({action:"paypalCreate",email,code}); if(!r.ok) throw new Error(r.error); return r.orderID;},
      onApprove:async(d)=>{const r=await api({action:"paypalCapture",email,code,orderID:d.orderID}); if(!r.ok) throw new Error(r.error); renderManage(r.record,email,code);},
      onError:(err)=>showMsg("ppMsg",false,esc((err&&err.message)||T("PayPal 付款失敗，請稍後再試","PayPal payment failed")))
    }).render("#ppBtns");
  }catch(err){box.innerHTML="";showMsg("ppMsg",false,esc(err.message));}
}
function renderManage(rec,email,code){
  const area=document.getElementById("manageArea"); const paper=rec.mode===MODES.paper.zh;
  area.innerHTML=`<div class="card" style="display:grid;gap:10px;margin-top:20px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span class="mono" style="font-size:1.2rem">${esc(rec.id)}</span>${statusPill(rec.review)}${statusPill(rec.payment)}</div>
   <p class="note">${esc(rec.mode)}${rec.type?"・"+esc(rec.type):""}・${T("應繳","Fee")} ${esc(rec.currency||"NTD")} ${Number(rec.fee).toLocaleString()}（${esc(rec.stage)}）${rec.last5?`・${T("已回報末 5 碼","Reported")} ${esc(rec.last5)}`:""}</p></div>
  <div class="grid2" style="margin-top:20px;align-items:start">
   ${paper?`<form class="form card" id="updForm" novalidate><h3>${T("修改稿件","Revise paper")}</h3>
    <div class="field"><label class="req">${T("論文題目","Title")}</label><input name="title" value="${esc(rec.title)}"></div>
    <div class="field"><label class="req">${T("發表作者","Author")}</label><input name="author" value="${esc(rec.author)}"></div>
    <div class="frow"><div class="field"><label>${T("通訊作者","Corresponding")}</label><input name="corrAuthor" value="${esc(rec.corrAuthor)}"></div><div class="field"><label>${T("通訊作者 Email","Corr. email")}</label><input name="corrEmail" value="${esc(rec.corrEmail)}"></div></div>
    <div class="field"><label class="req">${T("摘要","Abstract")}</label><textarea name="abstract">${esc(rec.abstract)}</textarea></div>
    <div class="field"><label class="req">${T("關鍵字","Keywords")}</label><input name="keywords" value="${esc(rec.keywords)}"></div>
    <div class="field"><label>${T("重新上傳 PDF（選填）","Replace PDF (optional)")}</label><input name="pdf" type="file" accept=".pdf"><span class="hint">${T("目前版本","Current version")} v${esc(rec.version||1)}</span></div>
    <div id="updMsg"></div><div><button class="btn primary" type="submit">${T("確認更新","Update")}</button></div></form>`:`<div class="card note">${T("此筆為報名資料，沒有稿件可修改。","Registration only — nothing to revise.")}</div>`}
   <div class="card" style="display:grid;gap:14px;align-content:start" id="payCard"><h3>${T("繳費","Payment")}</h3>
    <p>${T("應繳","Amount due")} <b class="mono">${esc(rec.currency||"NTD")} ${Number(rec.fee).toLocaleString()}</b> <span class="note">（${esc(rec.stage)}）</span></p>
    ${rec.payment==="已繳費"?`<div class="msg ok"><b>${T("已完成繳費","Payment complete")}</b><br><span class="note">${esc(rec.payMethod||"")} ${esc(String(rec.txn||"").replace("'",""))} ${esc(rec.paidAt||"")}</span></div>`
     :(rec.currency==="USD")?`<div id="ppBtns"><p class="note">${T("正在載入 PayPal…","Loading PayPal…")}</p></div><div id="ppMsg"></div>`
     :`<div><button class="btn primary" type="button" id="ecpayBtn">${T("線上付款（信用卡／ATM／超商）","Pay online (card / ATM / convenience store)")}</button></div>
       <p class="note">${T("將在新視窗開啟綠界付款頁；付款完成後回到這裡按「重新整理狀態」。","ECPay opens in a new window; come back and refresh your status after paying.")}</p><div id="ecpayMsg"></div>
       <details><summary>${T("改用銀行匯款並回報","Pay by bank transfer instead")}</summary>
   <form class="form" id="payForm" novalidate style="padding-top:10px">
    <div class="frow"><div class="field"><label class="req">${T("轉帳末 5 碼","Last 5 digits")}</label><input name="last5" inputmode="numeric" maxlength="5" class="mono"><span class="hint">${T("使用台灣 Pay 者請填實際轉帳帳戶末 5 碼","Use your real account digits")}</span></div>
    <div class="field"><label class="req">${T("轉帳日期","Date")}</label><input name="date" type="date" value="${iso(todayD())}"></div></div>
    <div class="field"><label>${T("匯款備註","Note")}</label><input name="note"></div>
    <div class="field"><span class="lbl">${T("是否需要收據","Receipt")}</span><div class="seg"><label><input type="radio" name="receipt" value="no" checked>${T("不需要","No")}</label><label><input type="radio" name="receipt" value="yes">${T("需要","Yes")}</label></div></div>
    <div class="frow" data-receipt hidden><div class="field"><label class="req">${T("收據抬頭","Receipt title")}</label><input name="receiptTitle"></div><div class="field"><label>${T("統一編號","Tax ID")}</label><input name="taxId" class="mono"></div></div>
    <div class="field"><label>${T("匯款證明（選填）","Proof (optional)")}</label><input name="proof" type="file" accept=".pdf,.png,.jpg,.jpeg"></div>
    <div id="payMsg"></div><div><button class="btn primary" type="submit" ${rec.payment==="已繳費"?"disabled":""}>${rec.payment==="已繳費"?T("已確認繳費","Payment confirmed"):T("送出匯款資料","Send")}</button></div></form>
       </details>`}
    <div><button class="btn small" type="button" id="payRefresh">${T("重新整理狀態","Refresh status")}</button></div>
   </div>
  </div>`;
  document.getElementById("payRefresh").onclick=async()=>{try{const r=await api({action:"verify",email,code});if(!r.ok)throw new Error(r.error);renderManage(r.record,email,code);}catch(err){alertMsg(err);}};
  const eb=document.getElementById("ecpayBtn"); if(eb) eb.onclick=()=>payEcpay(email,code);
  if(document.getElementById("ppBtns")) mountPayPal(email,code);
  if(eb) getPublicConfig().then(c=>{if(c.ecpay&&c.ecpay.test){const m=document.getElementById("ecpayMsg"); if(m&&!m.innerHTML) m.innerHTML=`<div class="banner info note">${T("目前為綠界測試環境，不會真的扣款。測試信用卡：4311-9522-2222-2222，有效期限任意未來日期，安全碼 222。","ECPay test mode (no real charge). Test card 4311-9522-2222-2222, any future expiry, CVV 222.")}</div>`;}});
  const pf=document.getElementById("payForm");
  if(pf) pf.addEventListener("change",()=>pf.querySelector("[data-receipt]").hidden=pf.elements.receipt.value!=="yes");
  if(pf) pf.addEventListener("submit",async e=>{e.preventDefault();
    try{ if(!/^\d{5}$/.test(pf.elements.last5.value)) throw new Error(T("末 5 碼需為 5 位數字","Enter 5 digits"));
      if(pf.elements.receipt.value==="yes"&&!pf.elements.receiptTitle.value.trim()) throw new Error(T("請填寫收據抬頭","Enter receipt title"));
      const p={action:"payment",email,code,last5:pf.elements.last5.value,date:pf.elements.date.value,note:pf.elements.note.value,receipt:pf.elements.receipt.value,receiptTitle:pf.elements.receiptTitle.value,taxId:pf.elements.taxId.value};
      if(pf.elements.proof.files[0]) p.proof=await readFile(pf.elements.proof.files[0]);
      const r=await api(p); if(!r.ok) throw new Error(r.error); renderManage(r.record,email,code); showMsg("payMsg",true,T("已送出，工作人員確認後會寄出通知信。","Sent. You'll be notified once confirmed."));
    }catch(err){showMsg("payMsg",false,esc(err.message));}
  });
  const uf=document.getElementById("updForm");
  if(uf) uf.addEventListener("submit",async e=>{e.preventDefault();
    try{const p={action:"update",email,code,title:uf.elements.title.value,author:uf.elements.author.value,corrAuthor:uf.elements.corrAuthor.value,corrEmail:uf.elements.corrEmail.value,abstract:uf.elements.abstract.value,keywords:uf.elements.keywords.value};
      if(uf.elements.pdf.files[0]){if(uf.elements.pdf.files[0].type!=="application/pdf")throw new Error("PDF only");p.pdf=await readFile(uf.elements.pdf.files[0]);}
      const r=await api(p); if(!r.ok) throw new Error(r.error); renderManage(r.record,email,code); showMsg("updMsg",true,T("稿件已更新。","Updated."));
    }catch(err){showMsg("updMsg",false,esc(err.message));}
  });
}

V.faq=()=>`${head("FAQ",T("常見問題","Frequently asked questions"),T("依主題整理報名、投稿、系統操作與交通的常見問題，可用上方搜尋框找關鍵字。","Questions on registration, submission, the online system and travel. Use the search box to filter."))}
<div class="toolbar"><input type="search" id="faqSearch" placeholder="${T("搜尋問題","Search questions")}" aria-label="search"></div>
<div class="faq" style="display:grid;gap:28px">${C.faq.map(g=>`<section class="faq-cat"><h3 style="margin-bottom:10px">${L(g.cat)}</h3><div class="list">${g.items.map(([q,a])=>`<details data-search="${esc((L(q)+" "+L(a)).toLowerCase())}"><summary>${L(q)}</summary><div><p>${L(a)}</p></div></details>`).join("")}</div></section>`).join("")}</div>
<p class="note">${T("沒有找到答案？請到「聯絡與贊助」頁聯絡大會。","Can't find it? Contact us.")}</p>`;

V.venue=()=>`${head("Travel, stay & venue",T("交通、住宿與會場","Travel, stay & venue"),T("會場位置與地圖、晚宴地點、各種交通方式、樓層配置與建議住宿。","Venue and map, banquet, how to get here, floor plan and hotels."))}
<section class="grid2"><div class="card prose"><dl class="kv"><dt>${T("會場","Venue")}</dt><dd>${L(C.venue)}<br><span class="note">${C.venueDetail}</span></dd><span></span><dt>${T("地址","Address")}</dt><dd>${L(C.address)}</dd><span></span><dt>${T("晚宴","Banquet")}</dt><dd>${L(C.banquet)}<br><a class="note" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.banquetMapQuery)}" target="_blank" rel="noopener">${T("晚宴地點地圖 →","Banquet map →")}</a></dd><span></span></dl><div class="cta" style="margin-top:4px"><a class="btn" href="${C.mapsUrl}" target="_blank" rel="noopener">${T("在 Google 地圖開啟","Open in Google Maps")}</a></div></div>${ph(T("會場外觀照片","Venue photo"),"（建議 1200×800）")}</section>
<section style="display:grid;gap:14px"><h3>${T("會場位置","Location")}</h3>
 <div class="mapbox"><p class="note">${T("地圖載入中；若沒有顯示，請按下方按鈕開啟 Google 地圖。","Loading map. If it doesn't appear, use the button below.")}</p><iframe title="${T("會場位置地圖","Venue map")}" src="https://www.google.com/maps?q=${encodeURIComponent(C.mapQuery)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
 <div class="cta" style="margin-top:0"><a class="btn primary" href="${C.mapsUrl}" target="_blank" rel="noopener">${T("在 Google 地圖開啟","Open in Google Maps")}</a><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(C.mapQuery)}" target="_blank" rel="noopener">${T("規劃路線","Get directions")}</a></div></section>
<section style="display:grid;gap:14px"><h3>${T("會場樓層配置","Floor plan")}</h3><p class="note">${T("實際動線與教室安排以會前公告為準。","Final room assignments will be announced.")}</p>
 <div>${C.floors.map(([f,d,r])=>`<div class="floor"><b>${f}</b><div>${d}<div class="rooms">${r.map(x=>`<span>${x}</span>`).join("")}</div></div></div>`).join("")}</div>
 <div class="grid2">${ph(T("樓層平面圖","Floor plan"),"（建議 1600×1000）")}${ph(T("校園地圖","Campus map"),"（建議 1600×1000）")}</div></section>
<section style="display:grid;gap:14px"><h3>${T("交通資訊","Getting there")}</h3><div class="grid3">${C.transport.map(([h,d,chk])=>`<div class="card"><h3>${L(h)}</h3><p class="note">${L(d)}</p>${chk?`<p style="margin-top:6px"><span class="tag tbd">${T("步行時間待確認","walk time TBC")}</span></p>`:""}</div>`).join("")}</div></section>
<section style="display:grid;gap:14px"><h3>${T("建議住宿","Hotels")}</h3><div class="tw"><table><thead><tr><th>${T("名稱","Hotel")}</th><th>${T("距離","Distance")}</th><th>${T("備註","Notes")}</th></tr></thead><tbody>${C.hotels.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div><p class="note">${T("實際房價與空房以各飯店公告為準。","Rates subject to each hotel.")}</p></section>
<section style="display:grid;gap:14px"><h3>${T("台南旅遊","Around Tainan")}</h3><div class="grid4">${C.sights.map(([z,e,d])=>`<div class="card" style="display:grid;gap:10px">${ph(T("景點照片","Photo"))}<h3>${T(z,e)}</h3><p class="note">${d}</p></div>`).join("")}</div></section>`;

V.h2car=()=>`${head("Student H₂ car contest",T("全國學生盃氫能車競賽","Student Hydrogen Car Contest"),T("競賽規則、參賽報名與競賽議程。","Rules, entry and schedule."))}
<div class="banner">${T("本屆是否舉辦尚未確定。","Whether this contest runs in 2027 is not yet decided.")}</div>
${tabs("car",[
 [{zh:"競賽規則",en:"Rules"},()=>`<div class="card prose"><ul>${C.h2car.rules.map(x=>`<li>${x}</li>`).join("")}</ul></div>`],
 [{zh:"參賽報名",en:"Entry"},()=>`<div class="card prose"><p>${T("報名截止","Deadline")}：${C.h2car.deadline}</p><div class="dl">${linkBtn(C.links.h2carRegister,T("參賽報名","Enter"),true)}</div></div>`],
 [{zh:"競賽議程",en:"Schedule"},()=>`<div class="card prose"><p>${C.h2car.schedule}</p></div>`]
])}`;

V.contact=()=>`${head("Contact & sponsorship",T("聯絡與贊助","Contact & sponsorship"),T("大會與贊助聯絡窗口，以及參展、廣告與贊助方案。","Contacts, exhibition, advertising and sponsorship packages."))}
<div class="grid2">${C.contacts.map((c,ci)=>`<div class="card rv"><span class="eyebrow">${L(c.role)}</span><h3 style="margin-top:6px">${c.name}</h3><dl class="kv" style="margin-top:10px"><dt>Email</dt><dd id="ce${ci}">${c.email}</dd><button class="copy" data-copy="ce${ci}">${T("複製","Copy")}</button><dt>${T("電話","Phone")}</dt><dd id="cp${ci}" class="mono">${c.phone}</dd><button class="copy" data-copy="cp${ci}">${T("複製","Copy")}</button></dl></div>`).join("")}</div>
<section style="display:grid;gap:16px"><h3>${T("參展與贊助方案","Sponsorship packages")} ${tbd()}</h3>
<div class="grid3">${C.packages.map(([n,d,p])=>`<div class="card rv"><span class="eyebrow">${L(n)}</span><p class="mono" style="font-size:1.2rem;margin-top:6px">${p}</p><p class="note" style="margin-top:6px">${d}</p></div>`).join("")}</div>
<div class="tw"><table><tbody>${C.booth.map(([a,b])=>`<tr><th style="width:160px">${a}</th><td>${b}</td></tr>`).join("")}</tbody></table></div>
<div class="dl">${linkBtn(C.links.sponsorForm,T("下載贊助辦法與申請表","Sponsorship form"),true)}</div></section>
<section style="display:grid;gap:16px"><h3>${T("贊助夥伴","Sponsors")}</h3>${marquee()}</section>`;

/* ---------- staff ---------- */
let staff={token:"",mode:"review",q:"",filter:"all",page:1,rows:[],dirty:{},sheetUrl:""};
V.staff=()=>`${head("Staff",T("工作人員入口","Staff portal"),T("內部作業使用：審稿管理與繳費確認。狀態改為「已繳費」或審稿結果時，系統會自動寄信通知。","Internal use."))}
${C.apiUrl?"":`<div class="banner info">${T("展示模式密碼：demo","Demo password: demo")}</div>`}
<div id="staffArea"></div>`;
function renderStaff(){
  const a=document.getElementById("staffArea"); if(!a) return;
  if(!staff.token){a.innerHTML=`<form class="form card" id="stLogin" style="max-width:420px"><div class="field"><label for="stKey">${T("工作人員密碼","Staff password")}</label><input id="stKey" type="password" autocomplete="current-password"></div><div id="stMsg"></div><div><button class="btn primary" type="submit">${T("登入","Sign in")}</button></div></form>`;
    document.getElementById("stLogin").addEventListener("submit",async e=>{e.preventDefault();try{const r=await api({action:"staffLogin",key:stKey.value});if(!r.ok)throw new Error(r.error);staff.token=r.token;staff.sheetUrl=r.sheetUrl||"";loadStaff();}catch(err){showMsg("stMsg",false,esc(err.message));}});return;}
  const s=staff.stats||{}, rv=staff.mode==="review";
  const filters={all:T("全部","All"),oral:"Oral",student:T("學生競賽","Student"),poster:"Poster",forum:T("只報論壇","Forum"),conf:T("只報研討會","Conf"),both:T("兩日","Both")};
  a.innerHTML=`<div style="display:grid;gap:18px">
  <div class="stats"><div><span class="note">${T("總數","Total")}</span><b>${s.total??0}</b></div><div><span class="note">${T("已審稿","Reviewed")}</span><b>${s.reviewDone??0}</b></div><div><span class="note">${T("待確認匯款","Pending")}</span><b style="color:var(--warn)">${s.pending??0}</b></div><div><span class="note">${T("已繳費","Paid")}</span><b style="color:var(--ok)">${s.paid??0}</b></div></div>
  <div class="toolbar"><div class="tabs" style="border:0"><button aria-selected="${rv}" data-smode="review">${T("審稿管理","Review")}</button><button aria-selected="${!rv}" data-smode="payment">${T("繳費管理","Payments")}</button></div>
   <input type="search" id="stQ" value="${esc(staff.q)}" placeholder="${T("搜尋編號、姓名、Email、題目、末5碼","Search")}"><select id="stF" style="width:auto">${Object.entries(filters).map(([k,v])=>`<option value="${k}" ${staff.filter===k?"selected":""}>${v}</option>`).join("")}</select>
   <button class="btn small" id="stGo">${T("搜尋","Search")}</button><button class="btn small" id="stSave" ${Object.keys(staff.dirty).length?"":"disabled"}>${T("儲存變更","Save changes")}（${Object.keys(staff.dirty).length}）</button>
   ${staff.sheetUrl?`<a class="btn small" href="${staff.sheetUrl}" target="_blank" rel="noopener">${T("開啟試算表","Open sheet")}</a>`:""}<button class="btn small" id="stOut">${T("登出","Sign out")}</button></div>
  <div id="stMsg"></div>
  <div class="tw"><table class="staff"><thead><tr><th>${T("編號","ID")}</th><th>${T("姓名／單位","Name")}</th>${rv?`<th>${T("題目","Title")}</th><th>${T("檔案","Files")}</th><th>${T("審稿狀態","Review")}</th>`:`<th>${T("應繳","Fee")}</th><th>${T("末5碼／日期","Payment")}</th><th>${T("收據","Receipt")}</th><th>${T("繳費狀態","Status")}</th>`}<th>${T("備註","Note")}</th></tr></thead>
  <tbody>${staff.rows.length?staff.rows.map(r=>{const d=staff.dirty[r.id]||{};return `<tr class="${staff.dirty[r.id]?"dirty":""}"><td class="mono">${esc(r.id)}<br><span class="note">${esc(r.type||r.mode)}</span></td><td>${esc(r.author)}<br><span class="note">${esc(r.affiliation)}・${esc(r.email)}・${esc(r.identity)}</span></td>
   ${rv?`<td>${esc(r.title)||"—"}</td><td>${r.pdf?`<a href="${esc(r.pdf)}" target="_blank" rel="noopener">PDF v${esc(r.version)}</a>`:"—"}${r.proof?`<br><a href="${esc(r.proof)}" target="_blank" rel="noopener">${T("學生證明","Proof")}</a>`:""}</td><td>${r.review?`<select data-edit="${esc(r.id)}" data-k="review">${["尚未審核","審核通過","審核未通過"].map(o=>`<option ${(d.review??r.review)===o?"selected":""}>${o}</option>`).join("")}</select>`:"—"}</td>`
       :`<td class="mono">${Number(r.fee).toLocaleString()}<br><span class="note">${esc(r.stage)}</span></td><td class="mono">${esc(r.last5)||"—"}<br><span class="note">${esc(r.payDate)}</span>${r.payProof?`<br><a href="${esc(r.payProof)}" target="_blank" rel="noopener">${T("證明","Proof")}</a>`:""}</td><td>${r.receipt==="是"?`${esc(r.receiptTitle)}<br><span class="note mono">${esc(r.taxId)}</span>`:"—"}</td><td><select data-edit="${esc(r.id)}" data-k="payment">${["未繳費","待確認","已繳費"].map(o=>`<option ${(d.payment??r.payment)===o?"selected":""}>${o}</option>`).join("")}</select></td>`}
   <td><input data-edit="${esc(r.id)}" data-k="note" value="${esc(d.note??r.note??"")}"></td></tr>`}).join(""):`<tr><td colspan="7" class="note">${T("沒有符合的資料","No records")}</td></tr>`}</tbody></table></div>
  <div class="toolbar"><button class="btn small" id="stPrev" ${staff.page<=1?"disabled":""}>${T("上一頁","Prev")}</button><span class="mono note">${staff.page} / ${staff.pages||1}</span><button class="btn small" id="stNext" ${staff.page>=(staff.pages||1)?"disabled":""}>${T("下一頁","Next")}</button></div></div>`;
  a.querySelectorAll("[data-smode]").forEach(b=>b.onclick=()=>{staff.mode=b.dataset.smode;renderStaff();});
  const go=()=>{staff.q=stQ.value;staff.filter=stF.value;staff.page=1;loadStaff();};
  stGo.onclick=go; stQ.onkeydown=e=>{if(e.key==="Enter")go();};
  stPrev.onclick=()=>{staff.page--;loadStaff();}; stNext.onclick=()=>{staff.page++;loadStaff();};
  stOut.onclick=()=>{staff={...staff,token:"",rows:[],dirty:{}};renderStaff();};
  a.querySelectorAll("[data-edit]").forEach(el=>el.onchange=()=>{(staff.dirty[el.dataset.edit] ||= {})[el.dataset.k]=el.value;renderStaff();});
  stSave.onclick=async()=>{try{const changes=Object.entries(staff.dirty).map(([id,c])=>({id,...c}));const r=await api({action:"staffUpdate",token:staff.token,changes});if(!r.ok)throw new Error(r.error);staff.dirty={};await loadStaff();showMsg("stMsg",true,T(`已更新 ${r.updated} 筆`,`${r.updated} updated`));}catch(err){showMsg("stMsg",false,esc(err.message));}};
}
async function loadStaff(){
  try{const r=await api({action:"staffList",token:staff.token,q:staff.q,filter:staff.filter,page:staff.page});if(!r.ok)throw new Error(r.error);Object.assign(staff,{rows:r.rows,page:r.page,pages:r.pages,stats:r.stats});renderStaff();}
  catch(err){if(/登入/.test(err.message))staff.token="";renderStaff();showMsg("stMsg",false,esc(err.message));}
}

/* ---------- API (real or demo) ---------- */
async function api(p){
  if(!C.apiUrl) return demoApi(p);
  const r=await fetch(C.apiUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(p)});
  return r.json();
}
const demo={rows:[
  {id:"GP01-001",mode:"論文投稿",type:"一般論文發表",title:"示範論文題目",author:"王小明",affiliation:"示範大學",email:"demo@example.com",code:"12345",identity:"一般",corrAuthor:"",corrEmail:"",abstract:"示範摘要。",keywords:"水素, 燃料電池",version:1,fee:4200,stage:"早鳥",review:"尚未審核",payment:"未繳費",last5:"",pdf:"#",note:""},
  {id:"SC02-001",mode:"論文投稿",type:"學生論文競賽",title:"示範學生論文",author:"陳小華",affiliation:"示範大學",email:"student@example.com",code:"54321",identity:"學生",abstract:"",keywords:"",version:2,fee:5500,stage:"早鳥",review:"審核通過",payment:"待確認",last5:"67890",payDate:"2027-04-02",receipt:"是",receiptTitle:"示範大學",taxId:"12345678",pdf:"#",proof:"#",note:""},
  {id:"FR-001",mode:"只報名技術論壇（Day 1）",type:"",title:"",author:"林大同",affiliation:"示範公司",email:"forum@example.com",code:"11111",identity:"一般",fee:2000,stage:"早鳥",review:"",payment:"已繳費",last5:"24680",payDate:"2027-03-20",receipt:"否",note:""}
]};
async function demoApi(p){
  await new Promise(r=>setTimeout(r,350));
  const find=()=>demo.rows.find(r=>r.email===String(p.email).toLowerCase()&&r.code===String(p.code));
  const typeKey=r=>({"一般論文發表":"oral","學生論文競賽":"student","海報發表":"poster"})[r.type]||({"只報名技術論壇（Day 1）":"forum","只報名學術研討會（不投稿）":"conf","兩日報名（不投稿）":"both"})[r.mode];
  switch(p.action){
    case "submit":{const key=p.mode==="paper"?p.type:p.mode, pre={oral:"GP",student:"SC",poster:"PO",forum:"FR",conf:"CF",both:"BD"}[key];
      const id=pre+(p.field?("0"+p.field).slice(-2):"")+"-"+String(demo.rows.filter(r=>r.id.startsWith(pre)).length+1).padStart(3,"0");
      const code=String(10000+Math.floor(Math.random()*90000)); const fee=calcFee(({general:0,student:1,intl:2,intlStudent:3})[p.identity]??0,p.mode!=="forum",p.mode==="forum"||p.mode==="both"||(p.mode==="paper"&&p.withForum),iso(todayD()));
      demo.rows.push({id,code,mode:MODES[p.mode].zh,type:p.type?TYPES[p.type].zh.split(" (")[0]:"",title:p.title||"",author:p.author,affiliation:p.affiliation,email:p.email.toLowerCase(),identity:p.identity==="student"?"學生":"一般",corrAuthor:p.corrAuthor||"",corrEmail:p.corrEmail||"",abstract:p.abstract||"",keywords:p.keywords||"",version:p.pdf?1:"",fee:fee.amount,stage:fee.stage,review:p.mode==="paper"?"尚未審核":"",payment:"未繳費",last5:"",pdf:p.pdf?"#":"",note:""});
      return {ok:true,id,fee:{amount:fee.amount,stage:fee.stage},demoCode:code};}
    case "verify":{const r=find();return r?{ok:true,record:{...r}}:{ok:false,error:T("Email 或驗證碼不正確","Wrong email or code")};}
    case "update":{const r=find();if(!r)return{ok:false,error:"auth"};Object.assign(r,{title:p.title,author:p.author,corrAuthor:p.corrAuthor,corrEmail:p.corrEmail,abstract:p.abstract,keywords:p.keywords});if(p.pdf)r.version=(+r.version||1)+1;return{ok:true,record:{...r}};}
    case "payment":{const r=find();if(!r)return{ok:false,error:"auth"};if(r.payment==="已繳費")return{ok:false,error:T("此筆已確認繳費","Already confirmed")};Object.assign(r,{last5:p.last5,payDate:p.date,receipt:p.receipt==="yes"?"是":"否",receiptTitle:p.receiptTitle,taxId:p.taxId,payment:"待確認"});return{ok:true,record:{...r}};}
    case "publicConfig":return {ok:true,ecpay:{enabled:true,test:true},paypal:{clientId:""}};
    case "ecpayCreate":case "paypalCreate":case "paypalCapture":return {ok:false,error:T("展示模式不支援線上付款","Online payment is not available in demo mode")};
    case "staffLogin":return p.key==="demo"?{ok:true,token:"demo",sheetUrl:""}:{ok:false,error:T("密碼錯誤","Wrong password")};
    case "staffList":{const q=(p.q||"").toLowerCase();const list=demo.rows.filter(r=>(p.filter==="all"||typeKey(r)===p.filter)&&(!q||[r.id,r.title,r.author,r.email,r.affiliation,r.last5].join(" ").toLowerCase().includes(q)));
      return{ok:true,rows:list.map(r=>({...r})),page:1,pages:1,stats:{total:list.length,reviewDone:list.filter(r=>r.review&&r.review!=="尚未審核").length,paid:list.filter(r=>r.payment==="已繳費").length,pending:list.filter(r=>r.payment==="待確認").length}};}
    case "staffUpdate":{let n=0;p.changes.forEach(c=>{const r=demo.rows.find(x=>x.id===c.id);if(r){Object.assign(r,c);n++;}});return{ok:true,updated:n};}
  }
  return {ok:false,error:"unknown"};
}

/* ---------- 全站搜尋：在瀏覽器內比對整個網站內容（含同義詞），不需要網路 ---------- */
const SYN=[
  [["停車","開車","車位","parking"],["停車","開車"]],
  [["交通","怎麼去","怎麼到","前往","高鐵","台鐵","火車","捷運","公車","機場","transport","train","bus","airport","get there"],["交通","台鐵","高鐵","機場"]],
  [["住宿","飯店","旅館","hotel","stay"],["住宿","飯店"]],
  [["晚宴","宴會","餐會","banquet","dinner"],["晚宴"]],
  [["截止","期限","deadline","due","什麼時候","何時","when"],["截止","日程"]],
  [["費用","多少錢","價格","報名費","註冊費","fee","price","cost","how much"],["費用","註冊"]],
  [["匯款","繳費","付款","轉帳","payment","pay"],["匯款","繳費"]],
  [["收據","發票","統編","receipt","invoice"],["收據"]],
  [["投稿","稿件","論文","submit","submission","paper"],["投稿","論文"]],
  [["海報","poster"],["海報"]],
  [["學生","student"],["學生"]],
  [["範本","模板","格式","template","format"],["範本","格式"]],
  [["地點","會場","地址","在哪","哪裡","位置","地圖","where","address","map","venue"],["會場","地點","地址"]],
  [["講者","演講","keynote","speaker","plenary"],["講者","演講"]],
  [["議程","時間表","program","schedule","agenda"],["議程"]],
  [["贊助","攤位","參展","sponsor","booth","exhibit"],["贊助","攤位"]],
  [["聯絡","email","電話","contact","phone"],["聯絡"]],
  [["獎","獎金","award","prize"],["獎"]],
  [["修改","更改","驗證碼","revise","edit"],["修改","驗證碼"]]
];
const STOP=new Set(["怎麼","什麼","如何","多少","請問","是否","可以","需要","一下","我要","我想","要在","的是","在哪","哪裡","嗎","呢","the","a","an","is","to","of","and","for","in","do","i","what","how"]);
const nrm=x=>String(x??"").toLowerCase();
function sxTerms(q){
  q=nrm(q).trim(); const out=new Set();
  q.split(/[\s,，、。？?！!：:；;／/（）()「」"']+/).filter(Boolean).forEach(w=>{
    if(/[㐀-鿿]/.test(w)){ if(w.length<=2){if(!STOP.has(w))out.add(w);} else for(let i=0;i<w.length-1;i++){const b=w.slice(i,i+2); if(!STOP.has(b)) out.add(b);} }
    else if(!STOP.has(w)&&w.length>1) out.add(w);
  });
  SYN.forEach(([keys,add])=>{if(keys.some(k=>q.includes(k))) add.forEach(a=>out.add(nrm(a)));});
  return [...out];
}
const VIEW_KIND={home:{zh:"首頁",en:"Home"},info:{zh:"大會資訊",en:"About"},speakers:{zh:"講者",en:"Speakers"},venue:{zh:"交通住宿",en:"Travel"},h2car:{zh:"氫能車",en:"H₂ car"},agenda:{zh:"議程",en:"Program"},cfp:{zh:"徵稿",en:"Papers"},register:{zh:"費用",en:"Fees"},submit:{zh:"投稿系統",en:"Submit"},faq:{zh:"FAQ",en:"FAQ"},contact:{zh:"聯絡贊助",en:"Contact"}};
const clean=x=>String(L(x)??"").replace(/〔待填〕[^，。；、｜|]*/g,T("（尚未公布）","(TBA)"));
function buildIndex(){
  const I=[]; const add=(t,x,v,o={})=>{t=clean(t);x=clean(x); if(t.replace(/（尚未公布）|\(TBA\)/g,"").trim()) I.push({t,x,v,...o});};
  add(C.title,`${range(C.start,C.end)}・${L(C.venue)}・${L(C.address)}`,"home");
  add(T("會議地點","Venue"),`${L(C.venue)}，${L(C.address)}`,"venue");
  add(T("晚宴地點","Banquet venue"),L(C.banquet),"venue");
  add(T("關於大會","About"),L(C.about),"info");
  C.dates.forEach(d=>add(d.label,`${d.extendedTo?fd(d.extendedTo):range(d.start,d.end)}${d.tbd?T("（暫定）"," (TBC)"):""}`,"home"));
  C.news.forEach(n=>add(n.title,`${n.date} ${n.text}`,"home"));
  C.feeCats.forEach((c,ci)=>add(`${L(c)} ${T("研討會註冊費","conference fee")}`,C.feeStages.map(st=>`${L(st.name)}（${st.start}～${st.end}）${C.feeCur[ci]} ${st.conf[ci]}`).join("；"),"register"));
  add(T("技術論壇註冊費","Forum fee"),C.feeStages.map(st=>`${L(st.name)} NTD ${st.forum}`).join("；"),"register");
  add(T("匯款帳戶","Bank details"),C.bank.map(([a,b])=>`${a}：${b}`).join("；"),"register");
  add(T("取消與退費規定","Refund policy"),C.refund,"register");
  add(T("報名流程","How to register"),T("線上投稿／報名 → 收到編號與驗證碼 → 匯款 → 回報轉帳末 5 碼 → 收到繳費確認信","Submit online → receive ID & code → pay → report last 5 digits → confirmation"),"register");
  add(T("線上投稿／報名","Online submission"),T("選擇報名模式：論文投稿、只報名技術論壇、只報名學術研討會、兩日報名；上傳摘要 PDF","Choose: paper, forum only, conference only, both days; upload PDF"),"submit",{tab:["sub",0]});
  add(T("修改稿件與回報匯款","Revise paper / report payment"),T("用投稿 Email 與 5 位數驗證碼登入「稿件與匯款管理」","Sign in with your email and 5-digit code"),"submit",{tab:["sub",1]});
  C.topics.forEach(g=>g.items.forEach(([c,n,d])=>add(`${c} ${L(n)}`,`${L(g.area)}：${L(d)}`,"cfp",{tab:["cfp",0]})));
  C.formats.forEach(([h,d])=>add(`${L(h)} ${T("格式規定","format")}`,d,"cfp",{tab:["cfp",1]}));
  C.prizes.forEach(([h,d])=>add(`${h} ${T("獎項","prize")}`,d,"cfp",{tab:["cfp",2]}));
  add(T("投稿範本下載","Templates"),T("一般投稿範本、學生論文競賽範本、海報張貼範本、著作權授權書","Paper, student, poster templates; copyright form"),"cfp",{tab:["cfp",3]});
  C.keynotes.forEach(k=>add(`${k.name}・${k.title}`,`${k.org}｜${k.time}｜${k.bio}`,"speakers"));
  C.agenda.forEach((d,di)=>d.items.forEach(([a,b,k,t,w])=>add(`${L(t)}（Day ${di+1}）`,`${fd(d.day)} ${a}–${b} ${w}`,"agenda",{tab:["agenda",di]})));
  [["oral",2],["student",3],["poster",4]].forEach(([k,ti])=>C.papers[k].forEach(r=>add(`${r[0]} ${r[2]}`,`${r[1]}｜${r[3]}｜${r[4]}`,"agenda",{tab:["agenda",ti]})));
  C.faq.forEach(g=>g.items.forEach(([q,a])=>add(q,a,"faq",{focus:L(q)})));
  C.transport.forEach(([h,d])=>add(`${T("交通","Transport")}：${L(h)}`,L(d),"venue"));
  C.hotels.forEach(h=>add(`${T("住宿","Hotel")}：${h[0]}`,`${h[1]}｜${h[2]}`,"venue"));
  C.floors.forEach(([f,d,r])=>add(`${T("樓層","Floor")} ${f}`,`${d}｜${r.join("、")}`,"venue"));
  C.contacts.forEach(c=>add(L(c.role),`${c.name}｜${c.email}｜${c.phone}`,"contact"));
  C.packages.forEach(([n,d,pr])=>add(`${T("贊助方案","Package")}：${L(n)}`,`${d}｜${pr}`,"contact"));
  C.booth.forEach(([a,b])=>add(a,b,"contact"));
  C.committeeKey.forEach(([r,n,o])=>add(`${r} ${n}`,o,"info"));
  C.workgroups.forEach(([g,n,w])=>add(`${g}（${n}）`,w,"info"));
  if(C.showH2Car) add(T("氫能車競賽","H₂ car contest"),C.h2car.rules.join("；"),"h2car");
  return I;
}
function sxSearch(q){
  const ts=sxTerms(q); if(!ts.length) return [];
  return buildIndex().map(e=>{const t=nrm(e.t),x=nrm(e.x);let sc=0;ts.forEach(w=>{if(t.includes(w))sc+=3;else if(x.includes(w))sc+=1;});if(nrm(q).trim()&&t.includes(nrm(q).trim()))sc+=6;return {...e,sc};})
    .filter(e=>e.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,8);
}
const sx={open:false,q:"",sel:0,items:[]};
function sxOpen(prefill){const el=document.getElementById("sx");el.hidden=false;sx.open=true;const inp=document.getElementById("sxInput");inp.placeholder=T("搜尋網站內容…（例：學生早鳥、停車、晚宴）","Search the site…");inp.value=prefill??sx.q;sxRender();setTimeout(()=>inp.focus(),20);}
function sxClose(){document.getElementById("sx").hidden=true;sx.open=false;}
function sxRender(){
  const body=document.getElementById("sxBody"); const q=document.getElementById("sxInput").value; sx.q=q;
  const res=sxSearch(q);
  sx.items=res; if(sx.sel>=sx.items.length) sx.sel=0;
  let h="";
  if(!q.trim()){
    const ex=T(["投稿截止日","學生早鳥費用","怎麼到會場","晚宴地點","刷卡"],["deadline","student fee","how to get there","banquet","credit card"]);
    h+=`<div class="sx-hint"><span>${T("輸入關鍵字搜尋整個網站。","Type keywords to search the whole site.")}</span><div class="chips">${ex.map(x=>`<button class="chip" data-sxq="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>`;
  } else if(res.length){
    h+=`<div class="sx-sec">${T("網站內容","ON THIS SITE")}</div>`+res.map((r,i)=>`<button class="sx-item" data-sxi="${i}" aria-selected="${sx.sel===i}"><span class="k">${L(VIEW_KIND[r.v]||r.v)}</span><span class="t">${esc(r.t)}</span><span class="x">${esc(r.x)}</span></button>`).join("");
  } else h+=`<div class="sx-hint">${T("找不到相關內容，換個關鍵字試試，或到 FAQ、聯絡我們。","No results. Try other words, or see FAQ / contact us.")}</div>`;
  body.innerHTML=h;
  body.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"});
}
function sxPick(i){
  const it=sx.items[i]; if(!it) return;
  sxClose(); if(it.tab) tabState[it.tab[0]]=it.tab[1]; go(it.v);
  if(it.focus) setTimeout(()=>{const d=[...document.querySelectorAll(".faq details")].find(x=>x.querySelector("summary").textContent===it.focus); if(d){d.open=true;d.scrollIntoView({behavior:"smooth",block:"center"});}},60);
}
document.getElementById("searchBtn").onclick=()=>sxOpen();
document.getElementById("sxClose").onclick=sxClose;
document.getElementById("sx").addEventListener("click",e=>{
  if(e.target.id==="sx"){sxClose();return;}
  const b=e.target.closest("[data-sxi]"); if(b){sxPick(+b.dataset.sxi);return;}
  const c=e.target.closest("[data-sxq]"); if(c){const inp=document.getElementById("sxInput");inp.value=c.dataset.sxq;sx.sel=0;sxRender();inp.focus();}
});
document.getElementById("sxInput").addEventListener("input",()=>{sx.sel=0;sxRender();});
document.getElementById("sxInput").addEventListener("keydown",e=>{
  if(e.key==="ArrowDown"){e.preventDefault();sx.sel=Math.min(sx.items.length-1,sx.sel+1);sxRender();}
  else if(e.key==="ArrowUp"){e.preventDefault();sx.sel=Math.max(0,sx.sel-1);sxRender();}
  else if(e.key==="Enter"){e.preventDefault();sxPick(sx.sel);}
  else if(e.key==="Escape"){sxClose();}
});
document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();sx.open?sxClose():sxOpen();}
  else if(e.key==="/"&&!sx.open&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||"")){e.preventDefault();sxOpen();}
  else if(e.key==="Escape"&&sx.open) sxClose();
});

/* ---------- render ---------- */
const NAV=[
  ["home",{zh:"首頁",en:"Home"}],
  {group:{zh:"會議資訊",en:"About"}, items:[["info",{zh:"大會資訊",en:"Conference"}],["speakers",{zh:"大會講者",en:"Speakers"}],["venue",{zh:"交通住宿",en:"Travel & venue"}],["h2car",{zh:"氫能車競賽",en:"H₂ car contest"}]].filter(v=>v[0]!=="h2car"||C.showH2Car)},
  ["agenda",{zh:"議程",en:"Program"}],
  {group:{zh:"徵稿與報名",en:"Papers & registration"}, items:[["cfp",{zh:"徵稿資訊",en:"Call for papers"}],["register",{zh:"註冊費用",en:"Fees"}],["submit",{zh:"線上投稿／報名",en:"Submit / register"}]]},
  ["faq",{zh:"FAQ",en:"FAQ"}],
  ["contact",{zh:"聯絡贊助",en:"Contact"}]
];
const validView=h=>!!(V[h]&&(h!=="h2car"||C.showH2Car));
let route=(()=>{let h="";try{h=location.hash.slice(1);}catch(e){}return validView(h)?h:"home";})();
function current(){return route;}
/* 頁面切換：不依賴網址 #，嵌在 Google Sites 或預覽視窗裡也能正常切換 */
function go(view){
  if(!validView(view)) view="home";
  route=view; render(); window.scrollTo(0,0);
  document.getElementById("nav").classList.remove("open");
  try{history.replaceState(null,"","#"+view);}catch(e){}
}
function render(){
  timers.forEach(clearInterval); timers=[]; cancelAnimationFrame(rafId);
  document.documentElement.lang=lang==="en"?"en":"zh-Hant";
  const cur=current();
  const navA=([k,n])=>`<a href="#${k}" ${k===cur?'aria-current="page"':""}>${L(n)}</a>`;
  document.getElementById("nav").innerHTML=NAV.map(x=>Array.isArray(x)?navA(x):`<div class="dd${x.items.some(i=>i[0]===cur)?" active":""}"><button type="button" class="dd-btn" aria-expanded="false">${L(x.group)}<span class="car" aria-hidden="true">▾</span></button><div class="dd-menu">${x.items.map(navA).join("")}</div></div>`).join("");
  document.getElementById("langBtn").textContent=lang==="en"?"中文":"EN";
  const sb=document.getElementById("searchBtn"); sb.querySelector(".lbl").textContent=T("搜尋","Search"); sb.setAttribute("aria-label",T("搜尋網站","Search the site"));
  document.getElementById("menuBtn").textContent=T("選單","Menu");
  document.getElementById("hero").innerHTML=cur==="home"?hero():"";
  document.getElementById("app").innerHTML=`<div class="view">${V[cur]()}</div>`;
  document.getElementById("foot").innerHTML=`<div class="foot-org"><div><b>EVENT</b><span>${L(C.title)}</span><br>${C.title.en}</div><div><b>ORGANIZER</b><span>${C.organizers[1].items.join("、")}</span></div><div><b>HOST</b><span>${C.organizers[2].items.join("、")}</span></div></div>
   <div>${T("往屆網站","Past editions")}：${C.pastSites.map(([y,u])=>`<a href="${u}" target="_blank" rel="noopener">${y}</a>`).join("　")}　｜　<a href="#staff">${T("工作人員入口","Staff portal")}</a></div><div class="mono">© ${C.year} ${C.short}</div><div class="wordmark" aria-hidden="true">HANZT<span>${C.year}</span></div>`;
  if(cur==="home"){startBubbles();startTilt();startCountdown();}
  if(cur==="register"){["fcCat","fcWhat","fcDate"].forEach(id=>document.getElementById(id).addEventListener("input",updateCalc));updateCalc();}
  if(cur==="submit"){initSubmit();initManage();}
  if(cur==="staff") renderStaff();
  if(cur==="agenda") initAgenda();
  if(cur==="faq") document.getElementById("faqSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll(".faq details").forEach(d=>{const hit=!q||d.dataset.search.includes(q);d.hidden=!hit;if(q&&hit)d.open=true;});});
  const io=("IntersectionObserver" in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.1}):null;
  if(io) document.querySelectorAll(".rv").forEach(el=>io.observe(el));
  onScroll();
  markTodos();
}
function onScroll(){const hd=document.querySelector("header"), pr=document.getElementById("progress"); if(!hd) return;
  const y=window.scrollY||0; hd.classList.toggle("scrolled",y>8);
  const max=document.documentElement.scrollHeight-innerHeight; if(pr) pr.style.width=(max>0?Math.min(100,y/max*100):0)+"%";}
window.addEventListener("scroll",onScroll,{passive:true});
function markTodos(){
  let n=0;
  ["hero","app","foot"].forEach(id=>{const root=document.getElementById(id);if(!root)return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:t=>t.nodeValue.includes("〔待填〕")&&!t.parentElement.closest("mark,script,style,textarea,option")?1:2});
    const list=[];while(w.nextNode())list.push(w.currentNode);
    list.forEach(t=>{const frag=document.createDocumentFragment();t.nodeValue.split("〔待填〕").forEach((part,i)=>{if(i){const m=document.createElement("mark");m.className="todo";m.textContent=T("待填","TODO");frag.appendChild(m);n++;}if(part)frag.appendChild(document.createTextNode(part));});t.replaceWith(frag);});
  });
  const pill=document.getElementById("todoPill");pill.hidden=!n;pill.textContent=T(`本頁還有 ${n} 處待填`,`${n} items to fill on this page`);
}
function initAgenda(){
  const s=document.getElementById("agSearch"), m=document.getElementById("mineOnly");
  const apply=()=>{const q=s.value.toLowerCase().trim(), only=m.getAttribute("aria-pressed")==="true", mine=store.get("hefc-mine",[]);
    document.querySelectorAll("#agWrap [data-search]").forEach(r=>{r.hidden=!((!q||r.dataset.search.includes(q))&&(!only||(r.dataset.paper&&mine.includes(r.dataset.paper))||(!r.dataset.paper&&!only)));});};
  s.addEventListener("input",apply); m.onclick=()=>{m.setAttribute("aria-pressed",m.getAttribute("aria-pressed")!=="true");apply();};
}
window.addEventListener("hashchange",()=>{let h="";try{h=location.hash.slice(1);}catch(e){} if(validView(h)&&h!==route) go(h);});
document.addEventListener("click",e=>{
  const ddb=e.target.closest(".dd-btn");
  document.querySelectorAll(".dd.open").forEach(d=>{if(!ddb||d!==ddb.parentElement){d.classList.remove("open");d.querySelector(".dd-btn").setAttribute("aria-expanded","false");}});
  if(ddb){const d=ddb.parentElement,o=d.classList.toggle("open");ddb.setAttribute("aria-expanded",o);return;}
  const t=e.target.closest("[data-tabs]");
  if(t){const id=t.dataset.tabs,i=+t.dataset.i;tabState[id]=i;const g=t.closest(".tabgroup");
    g.querySelectorAll(`:scope > .tabs [data-tabs="${id}"]`).forEach(b=>b.setAttribute("aria-selected",+b.dataset.i===i));
    g.querySelectorAll(`:scope > [data-panel="${id}"]`).forEach(p=>p.hidden=+p.dataset.i!==i);return;}
  const na=e.target.closest("[data-newsall]"); if(na){tabState.newsAll=!tabState.newsAll;render();document.getElementById("news")?.scrollIntoView();return;}
  const n=e.target.closest("[data-news]"); if(n){tabState.news=n.dataset.news;render();document.getElementById("news")?.scrollIntoView();return;}
  const j=e.target.closest("[data-jump]"); if(j){e.preventDefault();if(current()!=="home")go("home");setTimeout(()=>document.getElementById(j.dataset.jump)?.scrollIntoView({behavior:"smooth"}),50);return;}
  const a=e.target.closest('a[href^="#"]'); if(a){const h=a.getAttribute("href").slice(1); e.preventDefault(); if(validView(h)) go(h); else if(h) document.getElementById(h)?.scrollIntoView({behavior:"smooth"}); return;}
  const st=e.target.closest("[data-star]"); if(st){const id=st.dataset.star;let mine=store.get("hefc-mine",[]);mine=mine.includes(id)?mine.filter(x=>x!==id):[...mine,id];store.set("hefc-mine",mine);document.querySelectorAll(`[data-star="${id}"]`).forEach(b=>b.setAttribute("aria-pressed",mine.includes(id)));return;}
  const c=e.target.closest("[data-copy]"); if(c){const el=document.getElementById(c.dataset.copy);const done=()=>{c.textContent=T("已複製","Copied");setTimeout(()=>c.textContent=T("複製","Copy"),1500);};
    const sel=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);};
    try{navigator.clipboard.writeText(el.textContent).then(done).catch(sel);}catch(err){sel();}}
});
document.getElementById("langBtn").onclick=()=>{lang=lang==="en"?"zh":"en";store.set("hefc-lang",lang);render();};
document.getElementById("menuBtn").onclick=e=>{const nav=document.getElementById("nav");const o=nav.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o);};
render();
