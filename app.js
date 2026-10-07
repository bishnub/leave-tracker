// app.js - logic and rendering (reads RES, TYPES, A, P, LEAVE_DATA from data.js)

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
const now=new Date();let year=now.getFullYear(),cur=now.getMonth(),sel=null;
const firstWorkday=(y,m)=>{const d=new Date(Date.UTC(y,m,1));while(we(d))d.setUTCDate(d.getUTCDate()+1);return iso(d)};
const todayIso=()=>iso(new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())));
sel=we(dt(todayIso()))?firstWorkday(year,cur):todayIso();
function goto(y,m){year=y;cur=m;const t=todayIso();sel=(t.slice(0,7)===`${y}-${String(m+1).padStart(2,"0")}`&&!we(dt(t)))?t:firstWorkday(y,m);render();logr();summ()}
const yrWd=(l,y)=>{const s=l.s<`${y}-01-01`?`${y}-01-01`:l.s,e=l.e>`${y}-12-31`?`${y}-12-31`:l.e;return e<s?0:wd(s,e)};
const inYear=(l,y)=>l.s.slice(0,4)<=String(y)&&l.e.slice(0,4)>=String(y);
function absent(day){const m={};L.forEach(l=>{if(day>=l.s&&day<=l.e&&(l.st===A||$("pend").checked)){if(!m[l.r]||l.st===A)m[l.r]=l}});return m}
function render(){
 $("mo").value=cur;ensureYear(year);$("yr").value=year;document.title=`Leave Tracker ${year}`;$("ttl").textContent=`Team Leave Tracker – ${year}`;const g=$("calg");g.innerHTML="";
 ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(h=>g.insertAdjacentHTML("beforeend",`<div class="dh">${h}</div>`));
 const first=new Date(Date.UTC(year,cur,1)),off=(first.getUTCDay()+6)%7,dim=new Date(Date.UTC(year,cur+1,0)).getUTCDate();
 for(let i=0;i<off;i++)g.insertAdjacentHTML("beforeend",'<div class="d empty"></div>');
 for(let n=1;n<=dim;n++){const d=new Date(Date.UTC(year,cur,n)),k=iso(d);
  if(we(d)){g.insertAdjacentHTML("beforeend",`<div class="d we"><div class="n">${n}</div></div>`);continue}
  const a=Object.keys(absent(k));
  g.insertAdjacentHTML("beforeend",`<div class="d${k===sel?" sel":""}" data-d="${k}"><div class="n">${n}</div>${a.length?`<span class="c ab">${a.length} out</span><div class="ini">${a.map(ini).join(", ")}</div>`:`<span class="c ok">All in</span>`}</div>`)}
 g.querySelectorAll("[data-d]").forEach(e=>e.onclick=()=>{sel=e.dataset.d;render()});
 side()}
function side(){
 const ab=absent(sel),out=RES.filter(r=>ab[r]),inn=RES.filter(r=>!ab[r]);
 const wk=we(dt(sel));
 $("side").innerHTML=`<h3>${fmt(sel)} <span class="mu">(${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt(sel).getUTCDay()]})</span></h3>`+(wk?'<div class="mu">Weekend – non-working day.</div>':
 `<div class="mu">${inn.length} available · ${out.length} absent</div><h3>Absent</h3>`+(out.length?out.map(r=>`<div class="row"><span>${r}<br><span class="mu">${ab[r].t}</span></span><span class="pill ${ab[r].st}">${ab[r].st}</span></div>`).join(""):'<div class="mu">Nobody</div>')+
 `<h3>Available</h3>`+(inn.length?inn.map(r=>`<div class="row"><span>${r}</span><span class="pill Approved">Available</span></div>`).join(""):'<div class="mu">Nobody</div>'))}
function logr(){
 const r=$("fr").value,t=$("ft").value,s=$("fs").value;
 $("lb").innerHTML=L.filter(l=>inYear(l,year)&&(!r||l.r===r)&&(!t||l.t===t)&&(!s||l.st===s)).sort((a,b)=>a.s.localeCompare(b.s)).map(l=>`<tr><td>${l.r}</td><td>${l.t}</td><td>${fmt(l.s)}</td><td>${fmt(l.e)}</td><td>${wd(l.s,l.e)}</td><td><span class="pill ${l.st}">${l.st}</span></td><td><button data-e="${l.id}">Edit</button> <button data-x="${l.id}">Delete</button></td></tr>`).join("");
 document.querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>edit(+b.dataset.e));
 document.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>del(+b.dataset.x))}
const refresh=()=>{logr();render();summ()};
function edit(id){const l=L.find(x=>x.id===id);editId=id;$("ar").value=l.r;$("at").value=l.t;$("as").value=l.s;$("ae").value=l.e;$("ast").value=l.st;$("fh").textContent="Edit leave";$("add").textContent="Save changes";$("cancel").classList.remove("hide");$("fh").scrollIntoView({behavior:"smooth"})}
function resetForm(){editId=null;$("as").value="";$("ae").value="";$("fh").textContent="Add leave";$("add").textContent="Add";$("cancel").classList.add("hide")}
function del(id){const l=L.find(x=>x.id===id);if(!confirm(`Delete ${l.t} for ${l.r} (${fmt(l.s)} to ${fmt(l.e)})?`))return;L=L.filter(x=>x.id!==id);if(editId===id)resetForm();save();refresh()}
function download(){
 const rows=[...L].sort((a,b)=>a.r.localeCompare(b.r)||a.s.localeCompare(b.s)).map(l=>" "+JSON.stringify([l.r,l.t,l.s,l.e,l.st])).join(",\n");
 const txt="// data.js - exported "+new Date().toISOString().slice(0,10)+"\nconst RES = "+JSON.stringify(RES)+";\nconst TYPES = "+JSON.stringify(TYPES)+";\nconst A = \"Approved\", P = \"Pending\";\n// [resource, type, start, end, status]\nconst LEAVE_DATA = [\n"+rows+"\n];\n";
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/javascript"}));a.download="data.js";a.click()}
function summ(){
 $("sh").innerHTML="<tr><th>Resource</th>"+TYPES.map(t=>`<th>${t}</th>`).join("")+"<th>Approved</th><th>Pending</th><th>Total</th></tr>";
 $("sb").innerHTML=RES.map(r=>{const ls=L.filter(l=>l.r===r&&inYear(l,year)),sm=f=>ls.filter(f).reduce((a,l)=>a+yrWd(l,year),0);
  return `<tr><td>${r}</td>`+TYPES.map(t=>{const a=sm(l=>l.t===t&&l.st===A),p=sm(l=>l.t===t&&l.st===P);return `<td>${a+p?a+(p?` <span class="mu">(+${p} pending)</span>`:""):"–"}</td>`}).join("")+`<td>${sm(l=>l.st===A)}</td><td>${sm(l=>l.st===P)}</td><td><b>${sm(()=>1)}</b></td></tr>`}).join("")}
function ensureYear(y){const o=$("yr");if([...(o.options||[])].some(x=>+x.value===y))return;
 const ys=new Set([...L.flatMap(l=>[+l.s.slice(0,4),+l.e.slice(0,4)]),now.getFullYear(),y]);const a=Math.min(...ys)-1,b=Math.max(...ys)+1;
 o.innerHTML="";for(let i=a;i<=b;i++)o.insertAdjacentHTML("beforeend",`<option value="${i}">${i}</option>`)}
function init(){
 $("mo").innerHTML=MN.map((m,i)=>`<option value="${i}">${m}</option>`).join("");
 const ro=RES.map(r=>`<option>${r}</option>`).join("");
 $("fr").innerHTML='<option value="">All resources</option>'+ro;$("ar").innerHTML=ro;
 $("at").innerHTML=TYPES.map(t=>`<option>${t}</option>`).join("");$("ft").innerHTML+=TYPES.map(t=>`<option>${t}</option>`).join("");
 $("mo").onchange=e=>goto(year,+e.target.value);$("yr").onchange=e=>goto(+e.target.value,cur);$("pv").onclick=()=>cur?goto(year,cur-1):goto(year-1,11);$("nx").onclick=()=>cur<11?goto(year,cur+1):goto(year+1,0);
 $("pend").onchange=render;["fr","ft","fs"].forEach(i=>$(i).onchange=logr);
 document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));["cal","log","sum"].forEach(s=>$(s).classList.toggle("hide",s!==b.dataset.t));logr();summ()});
$("add").onclick=()=>{const s=$("as").value,e=$("ae").value||s;if(!s||e<s)return alert("Check the dates");
  const o={r:$("ar").value,t:$("at").value,s,e,st:$("ast").value};
  if(editId)Object.assign(L.find(x=>x.id===editId),o);else L.push({...o,id:nid++});
  save();resetForm();goto(+s.slice(0,4),+s.slice(5,7)-1)};
 $("cancel").onclick=resetForm;$("dl").onclick=download;
 $("rs").onclick=()=>{if(!confirm("Discard all edits and reload the original data.js rows?"))return;try{localStorage.removeItem(KEY)}catch(_){}L=seed().map(o=>({...o,id:nid++}));resetForm();refresh()};
 render();logr();summ()}
init();
