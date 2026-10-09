// app.js - logic and rendering (reads TEAMS, RES, TEAM_OF, LOCATION_OF, HOLIDAYS, TYPES, A, P, LEAVE_DATA from data.js)

const KEY="leaveData_v1";let nid=1,editId=null;
const seed=()=>LEAVE_DATA.map(([r,t,s,e,st])=>({r,t,s,e,st}));
const stored=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(s))return s}catch(e){}return null};
let L=(stored()||seed()).map(o=>({...o,id:nid++}));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(L.map(({id,...r})=>r)))}catch(_){}};
const $=id=>document.getElementById(id);
const dt=s=>new Date(s+"T00:00:00Z"),iso=d=>d.toISOString().slice(0,10),we=d=>[0,6].includes(d.getUTCDay());
const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
function wd(s,e){let n=0;for(let d=dt(s);d<=dt(e);d.setUTCDate(d.getUTCDate()+1))if(!we(d))n++;return n}
const fmt=s=>{const d=dt(s);return d.getUTCDate()+" "+MN[d.getUTCMonth()].slice(0,3)+" "+d.getUTCFullYear()};
const ini=n=>n.split(" ")[0];
let team="";const inTeam=r=>!team||TEAM_OF[r]===team;const visRes=()=>RES.filter(inTeam);
const now=new Date();let year=now.getFullYear(),cur=now.getMonth(),sel=null;
const firstWorkday=(y,m)=>{const d=new Date(Date.UTC(y,m,1));while(we(d))d.setUTCDate(d.getUTCDate()+1);return iso(d)};
const todayIso=()=>iso(new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())));
sel=we(dt(todayIso()))?firstWorkday(year,cur):todayIso();
function goto(y,m){year=y;cur=m;const t=todayIso();sel=(t.slice(0,7)===`${y}-${String(m+1).padStart(2,"0")}`&&!we(dt(t)))?t:firstWorkday(y,m);refresh()}
const yrWd=(l,y)=>{const s=l.s<`${y}-01-01`?`${y}-01-01`:l.s,e=l.e>`${y}-12-31`?`${y}-12-31`:l.e;return e<s?0:wdr(s,e,l.r)};
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const MKEY="leaveMeta_v1";let editH=null;
const meta0=()=>({loc:{...LOCATION_OF},hol:JSON.parse(JSON.stringify(HOLIDAYS))});
const metaS=()=>{try{const m=JSON.parse(localStorage.getItem(MKEY));if(m&&m.loc&&m.hol)return m}catch(e){}return null};
let M=metaS()||meta0();
const saveM=()=>{try{localStorage.setItem(MKEY,JSON.stringify(M))}catch(_){}};
const locs=()=>[...new Set([...Object.keys(M.hol),...Object.values(M.loc)])].filter(Boolean).sort();
const holName=(r,day)=>{const l=M.loc[r];if(!l)return null;const h=(M.hol[l]||[]).find(x=>x[0]===day);return h?h[1]:null};
function wdr(s,e,r){let n=0;for(let d=dt(s);d<=dt(e);d.setUTCDate(d.getUTCDate()+1))if(!we(d)&&!holName(r,iso(d)))n++;return n}
function onHol(day){const m={};visRes().forEach(r=>{const n=holName(r,day);if(n)m[r]=n});return m}
function normDate(s){if(/^\d{4}-\d{2}-\d{2}$/.test(s))return isNaN(dt(s))?null:s;const m=s.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3})[A-Za-z]*[-\s\/,]*\s*(\d{4})$/);if(!m)return null;const i=MN.findIndex(x=>x.slice(0,3).toLowerCase()===m[2].toLowerCase());return i<0?null:`${m[3]}-${String(i+1).padStart(2,"0")}-${m[1].padStart(2,"0")}`}
const inYear=(l,y)=>l.s.slice(0,4)<=String(y)&&l.e.slice(0,4)>=String(y);
function absent(day){const m={};L.forEach(l=>{if(inTeam(l.r)&&!holName(l.r,day)&&day>=l.s&&day<=l.e&&(l.st===A||$("pend").checked)){if(!m[l.r]||l.st===A)m[l.r]=l}});return m}
function render(){
 $("mo").value=cur;ensureYear(year);$("yr").value=year;document.title=`Leave Tracker ${year}`;$("sub").textContent=`${team||"All teams"} · availability by day, leave log and summary`;$("ttl").textContent=`Team Leave Tracker – ${year}`;const g=$("calg");g.innerHTML="";
 ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(h=>g.insertAdjacentHTML("beforeend",`<div class="dh">${h}</div>`));
 const first=new Date(Date.UTC(year,cur,1)),off=(first.getUTCDay()+6)%7,dim=new Date(Date.UTC(year,cur+1,0)).getUTCDate();
 for(let i=0;i<off;i++)g.insertAdjacentHTML("beforeend",'<div class="d empty"></div>');
 for(let n=1;n<=dim;n++){const d=new Date(Date.UTC(year,cur,n)),k=iso(d);
  if(we(d)){g.insertAdjacentHTML("beforeend",`<div class="d we"><div class="n">${n}</div></div>`);continue}
  const a=Object.keys(absent(k)),h=Object.keys(onHol(k));
  g.insertAdjacentHTML("beforeend",`<div class="d${k===sel?" sel":""}" data-d="${k}"><div class="n">${n}</div>${h.length?`<span class="c hl">${h.length} hol</span> `:""}${a.length?`<span class="c ab">${a.length} out</span><div class="ini">${a.slice(0,3).map(ini).join(", ")}${a.length>3?` +${a.length-3}`:""}</div>`:h.length?"":`<span class="c ok">All in</span>`}</div>`)}
 g.querySelectorAll("[data-d]").forEach(e=>e.onclick=()=>{sel=e.dataset.d;render()});
 side()}
function side(){
 const ab=absent(sel),hl=onHol(sel),vr=visRes(),out=vr.filter(r=>ab[r]),hol=vr.filter(r=>hl[r]),inn=vr.filter(r=>!ab[r]&&!hl[r]),tm=r=>team?"":TEAM_OF[r]+" · ";
 const sec=(t,it)=>`<h3>${t}</h3>`+(it.length?it.join(""):'<div class="mu">Nobody</div>');
 const wk=we(dt(sel));
 $("side").innerHTML=`<h3>${fmt(sel)} <span class="mu">(${DN[dt(sel).getUTCDay()]})</span></h3>`+(wk?'<div class="mu">Weekend – non-working day.</div>':
 `<div class="mu">${inn.length} available · ${out.length} absent${hol.length?` · ${hol.length} on public holiday`:""}</div>`+
 sec("Absent",out.map(r=>`<div class="row"><span>${r}<br><span class="mu">${tm(r)}${ab[r].t}</span></span><span class="pill ${ab[r].st}">${ab[r].st}</span></div>`))+
 (hol.length?sec("Public holiday",hol.map(r=>`<div class="row"><span>${r}<br><span class="mu">${tm(r)}${esc(hl[r])}</span></span><span class="pill Holiday">${esc(M.loc[r])}</span></div>`)):"")+
 sec("Available",inn.map(r=>`<div class="row"><span>${r}${team?"":` <span class="mu">${TEAM_OF[r]}</span>`}</span><span class="pill Approved">Available</span></div>`)))}
function logr(){
 const r=$("fr").value,t=$("ft").value,s=$("fs").value;
 $("lb").innerHTML=L.filter(l=>inYear(l,year)&&inTeam(l.r)&&(!r||l.r===r)&&(!t||l.t===t)&&(!s||l.st===s)).sort((a,b)=>a.s.localeCompare(b.s)).map(l=>`<tr><td>${l.r}</td><td>${TEAM_OF[l.r]||"–"}</td><td>${l.t}</td><td>${fmt(l.s)}</td><td>${fmt(l.e)}</td><td>${wdr(l.s,l.e,l.r)}</td><td><span class="pill ${l.st}">${l.st}</span></td><td><button data-e="${l.id}">Edit</button> <button data-x="${l.id}">Delete</button></td></tr>`).join("");
 document.querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>edit(+b.dataset.e));
 document.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>del(+b.dataset.x))}
const refresh=()=>{logr();render();summ();holr()};
function edit(id){const l=L.find(x=>x.id===id);editId=id;$("ar").value=l.r;$("at").value=l.t;$("as").value=l.s;$("ae").value=l.e;$("ast").value=l.st;$("fh").textContent="Edit leave";$("add").textContent="Save changes";$("cancel").classList.remove("hide");$("fh").scrollIntoView({behavior:"smooth"})}
function resetForm(){editId=null;$("as").value="";$("ae").value="";$("fh").textContent="Add leave";$("add").textContent="Add";$("cancel").classList.add("hide")}
function del(id){const l=L.find(x=>x.id===id);if(!confirm(`Delete ${l.t} for ${l.r} (${fmt(l.s)} to ${fmt(l.e)})?`))return;L=L.filter(x=>x.id!==id);if(editId===id)resetForm();save();refresh()}
function metaTxt(){
 const hol=Object.entries(M.hol).sort().map(([l,a])=>"  "+JSON.stringify(l)+": "+(a.length?"[\n"+[...a].sort().map(x=>"    "+JSON.stringify(x)).join(",\n")+"\n  ]":"[]")).join(",\n");
 return "const LOCATION_OF = "+JSON.stringify(M.loc,null,2)+";\nconst HOLIDAYS = {\n"+hol+"\n};\n"}
function download(){
 const rows=[...L].sort((a,b)=>a.r.localeCompare(b.r)||a.s.localeCompare(b.s)).map(l=>" "+JSON.stringify([l.r,l.t,l.s,l.e,l.st])).join(",\n");
 const txt="// data.js - exported "+new Date().toISOString().slice(0,10)+"\nconst TEAMS = "+JSON.stringify(TEAMS,null,2)+";\nconst RES = Object.values(TEAMS).flat();\nconst TEAM_OF = Object.fromEntries(Object.entries(TEAMS).flatMap(([t, m]) => m.map(n => [n, t])));\n"+metaTxt()+"const TYPES = "+JSON.stringify(TYPES)+";\nconst A = \"Approved\", P = \"Pending\";\n// [resource, type, start, end, status]\nconst LEAVE_DATA = [\n"+rows+"\n];\n";
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/javascript"}));a.download="data.js";a.click()}
function summ(){
 $("sh").innerHTML="<tr><th>Resource</th><th>Team</th>"+TYPES.map(t=>`<th>${t}</th>`).join("")+"<th>Approved</th><th>Pending</th><th>Total</th></tr>";
 $("sb").innerHTML=visRes().map(r=>{const ls=L.filter(l=>l.r===r&&inYear(l,year)),sm=f=>ls.filter(f).reduce((a,l)=>a+yrWd(l,year),0);
  return `<tr><td>${r}</td><td>${TEAM_OF[r]}</td>`+TYPES.map(t=>{const a=sm(l=>l.t===t&&l.st===A),p=sm(l=>l.t===t&&l.st===P);return `<td>${a+p?a+(p?` <span class="mu">(+${p} pending)</span>`:""):"–"}</td>`}).join("")+`<td>${sm(l=>l.st===A)}</td><td>${sm(l=>l.st===P)}</td><td><b>${sm(()=>1)}</b></td></tr>`}).join("")}
function ensureYear(y){const o=$("yr");if([...(o.options||[])].some(x=>+x.value===y))return;
 const ys=new Set([...L.flatMap(l=>[+l.s.slice(0,4),+l.e.slice(0,4)]),now.getFullYear(),y]);const a=Math.min(...ys)-1,b=Math.max(...ys)+1;
 o.innerHTML="";for(let i=a;i<=b;i++)o.insertAdjacentHTML("beforeend",`<option value="${i}">${i}</option>`)}
function fillRes(){
 const opt=r=>`<option>${r}</option>`,grp=(t,m)=>`<optgroup label="${t}">${m.map(opt).join("")}</optgroup>`,all=Object.entries(TEAMS).map(([t,m])=>grp(t,m)).join("");
 const pa=$("ar").value,pf=$("fr").value;
 $("ar").innerHTML=all;if(RES.includes(pa))$("ar").value=pa;
 $("fr").innerHTML='<option value="">All resources</option>'+(team?TEAMS[team].map(opt).join(""):all);$("fr").value=visRes().includes(pf)?pf:""}
function holr(){
 const ls=locs(),opt=l=>`<option>${esc(l)}</option>`,hl=$("hl").value,hf=$("hf").value;
 $("hl").innerHTML=ls.map(opt).join("");if(ls.includes(hl))$("hl").value=hl;
 $("hf").innerHTML='<option value="">All locations</option>'+ls.map(opt).join("");if(ls.includes(hf))$("hf").value=hf;
 $("lcb").innerHTML=visRes().map(r=>`<tr><td>${r}</td><td>${TEAM_OF[r]}</td><td><select data-r="${esc(r)}"><option value="">Not set</option>${ls.map(l=>`<option${M.loc[r]===l?" selected":""}>${esc(l)}</option>`).join("")}</select></td></tr>`).join("");
 const f=$("hf").value,rows=[];
 Object.entries(M.hol).forEach(([l,a])=>{if(!f||f===l)a.forEach(([d,n])=>rows.push({l,d,n}))});
 rows.sort((a,b)=>a.d.localeCompare(b.d)||a.l.localeCompare(b.l));
 $("hbody").innerHTML=rows.map(x=>`<tr><td>${fmt(x.d)}</td><td>${DN[dt(x.d).getUTCDay()]}${we(dt(x.d))?' <span class="mu">(weekend)</span>':""}</td><td>${esc(x.n)}</td><td>${esc(x.l)}</td><td class="mu">${RES.filter(r=>M.loc[r]===x.l).map(ini).join(", ")||"–"}</td><td><button data-he="${esc(x.l)}|${x.d}">Edit</button> <button data-hx="${esc(x.l)}|${x.d}">Delete</button></td></tr>`).join("")||'<tr><td colspan="6" class="mu">No public holidays yet. Add a location, then add holidays.</td></tr>';
 document.querySelectorAll("[data-r]").forEach(s=>s.onchange=()=>{if(s.value)M.loc[s.dataset.r]=s.value;else delete M.loc[s.dataset.r];saveM();refresh()});
 document.querySelectorAll("[data-he]").forEach(b=>b.onclick=()=>hedit(b.dataset.he));
 document.querySelectorAll("[data-hx]").forEach(b=>b.onclick=()=>hdel(b.dataset.hx))}
function hedit(k){const [l,d]=k.split("|"),x=M.hol[l].find(y=>y[0]===d);editH=k;$("hl").value=l;$("hd").value=d;$("hn").value=x[1];$("hh").textContent="Edit public holiday";$("hadd").textContent="Save changes";$("hcancel").classList.remove("hide")}
function hreset(){editH=null;$("hd").value="";$("hn").value="";$("hh").textContent="Add public holiday";$("hadd").textContent="Add";$("hcancel").classList.add("hide")}
function hdel(k){const [l,d]=k.split("|");if(!confirm(`Delete the ${fmt(d)} holiday for ${l}?`))return;M.hol[l]=M.hol[l].filter(x=>x[0]!==d);if(editH===k)hreset();saveM();refresh()}
function init(){
 $("mo").innerHTML=MN.map((m,i)=>`<option value="${i}">${m}</option>`).join("");
 $("tm").innerHTML='<option value="">All teams</option>'+Object.keys(TEAMS).map(t=>`<option value="${t}">${t} (${TEAMS[t].length})</option>`).join("");
 $("tm").onchange=e=>{team=e.target.value;fillRes();if(team&&!editId)$("ar").value=TEAMS[team][0];refresh()};
 fillRes();
 $("anl").onclick=()=>{const v=$("nl").value.trim();if(!v)return;if(!M.hol[v])M.hol[v]=[];$("nl").value="";saveM();refresh();$("hl").value=v};
 $("hadd").onclick=()=>{const l=$("hl").value,d=$("hd").value,n=$("hn").value.trim();if(!l)return alert("Add a location first");if(!d||!n)return alert("Enter a date and a holiday name");
  if(editH){const [ol,od]=editH.split("|");M.hol[ol]=M.hol[ol].filter(x=>x[0]!==od)}
  M.hol[l]=(M.hol[l]||[]).filter(x=>x[0]!==d).concat([[d,n]]);saveM();hreset();refresh()};
 $("hcancel").onclick=hreset;$("hf").onchange=holr;
 $("hbtn").onclick=()=>{const l=$("hl").value;if(!l)return alert("Add a location first");let ok=0;const bad=[];
  $("hbulk").value.split(/\n/).map(s=>s.trim()).filter(Boolean).forEach(line=>{const m=line.match(/^([^,\t;]+)[,\t;]\s*(.+)$/),d=m&&normDate(m[1].trim());if(!d){bad.push(line);return}M.hol[l]=(M.hol[l]||[]).filter(x=>x[0]!==d).concat([[d,m[2].trim()]]);ok++});
  saveM();$("hbulk").value=bad.join("\n");refresh();alert(`${ok} added to ${l}`+(bad.length?`; ${bad.length} line(s) not understood and left in the box`:""))};
 $("at").innerHTML=TYPES.map(t=>`<option>${t}</option>`).join("");$("ft").innerHTML+=TYPES.map(t=>`<option>${t}</option>`).join("");
 $("mo").onchange=e=>goto(year,+e.target.value);$("yr").onchange=e=>goto(+e.target.value,cur);$("pv").onclick=()=>cur?goto(year,cur-1):goto(year-1,11);$("nx").onclick=()=>cur<11?goto(year,cur+1):goto(year+1,0);
 $("pend").onchange=render;["fr","ft","fs"].forEach(i=>$(i).onchange=logr);
 document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));["cal","log","hol","sum"].forEach(s=>$(s).classList.toggle("hide",s!==b.dataset.t));logr();summ();holr()});
$("add").onclick=()=>{const s=$("as").value,e=$("ae").value||s;if(!s||e<s)return alert("Check the dates");
  const o={r:$("ar").value,t:$("at").value,s,e,st:$("ast").value};
  if(team&&TEAM_OF[o.r]!==team){team=TEAM_OF[o.r];$("tm").value=team;fillRes()}
  if(editId)Object.assign(L.find(x=>x.id===editId),o);else L.push({...o,id:nid++});
  save();resetForm();goto(+s.slice(0,4),+s.slice(5,7)-1)};
 $("cancel").onclick=resetForm;$("dl").onclick=download;
 $("rs").onclick=()=>{if(!confirm("Discard all edits and reload the original data.js rows?"))return;try{localStorage.removeItem(KEY)}catch(_){}L=seed().map(o=>({...o,id:nid++}));try{localStorage.removeItem(MKEY)}catch(_){}M=meta0();resetForm();hreset();refresh()};
 render();logr();summ();holr()}
init();
