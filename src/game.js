/* ================= Phiêu Lưu Toán 3 ================= */
/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function h(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hintText=x=>typeof x==='function'?x():x;

const BOT_SVG=`<svg class="bot" viewBox="0 0 100 110" aria-hidden="true">
 <line x1="50" y1="20" x2="50" y2="8" stroke="#243A6B" stroke-width="3"/>
 <circle cx="50" cy="7" r="5.5" fill="#FFC83D" stroke="#243A6B" stroke-width="2.5"/>
 <rect x="10" y="44" width="8" height="16" rx="4" fill="#8A63E8" stroke="#243A6B" stroke-width="2.5"/>
 <rect x="82" y="44" width="8" height="16" rx="4" fill="#8A63E8" stroke="#243A6B" stroke-width="2.5"/>
 <rect x="16" y="20" width="68" height="58" rx="26" fill="#EEF6FF" stroke="#243A6B" stroke-width="3"/>
 <g class="eye-l"><circle cx="37" cy="46" r="13" fill="#fff" stroke="#243A6B" stroke-width="3"/><circle cx="39" cy="47" r="6.5" fill="#243A6B"/><circle cx="41" cy="44" r="2" fill="#fff"/></g>
 <g class="eye-r"><circle cx="63" cy="46" r="13" fill="#fff" stroke="#243A6B" stroke-width="3"/><circle cx="61" cy="47" r="6.5" fill="#243A6B"/><circle cx="63" cy="44" r="2" fill="#fff"/></g>
 <path class="mouth" d="M41 66 Q50 73 59 66" stroke="#243A6B" stroke-width="3" fill="none" stroke-linecap="round"/>
 <rect x="30" y="80" width="40" height="26" rx="10" fill="#7CCBFF" stroke="#243A6B" stroke-width="3"/>
 <circle cx="50" cy="93" r="5" fill="#FF6B5B"/>
</svg>`;
$$('[data-bot]').forEach(e=>e.innerHTML=BOT_SVG);
const PINWHEEL=`<svg viewBox="0 0 40 42" aria-hidden="true"><line x1="20" y1="20" x2="20" y2="47" stroke="#8A5A22" stroke-width="3"/><path d="M20 20 L20 2 L32 10Z" fill="#FF6B5B"/><path d="M20 20 L38 20 L30 32Z" fill="#FFC83D"/><path d="M20 20 L20 38 L8 30Z" fill="#48AEE6"/><path d="M20 20 L2 20 L10 8Z" fill="#46B85A"/><circle cx="20" cy="20" r="2.5" fill="#243A6B"/></svg>`;

/* ---------- save ---------- */
const SAVE_KEY='phieu-luu-toan3-v1';
const S={stars:{},coins:0,stickers:[],sound:true,autoRead:false,unlockAll:false};
try{Object.assign(S,JSON.parse(localStorage.getItem(SAVE_KEY)||'{}'))}catch(e){}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}

/* ---------- sound & voice ---------- */
let actx=null;
function tone(f,d,type='sine',vol=.14,when=0,f2){
  if(!S.sound)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const t=actx.currentTime+when,o=actx.createOscillator(),g=actx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
    o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d+.02);
  }catch(e){}
}
const sfx={
  ok(){tone(660,.12,'triangle');tone(990,.2,'triangle',.14,.1)},
  bad(){tone(260,.28,'sawtooth',.06,0,160)},
  pop(){tone(560,.07,'square',.05)},
  hop(){tone(300,.18,'sine',.12,0,700)},
  pour(){tone(420,.35,'sine',.08,0,180)},
  win(){[523,659,784,1047].forEach((f,i)=>tone(f,.28,'triangle',.14,i*.13))},
};
function speak(text,pitch=1){
  if(!('speechSynthesis' in window))return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g,' ').replace(/×/g,' nhân ').replace(/ : /g,' chia ').replace(/−/g,' trừ ').replace(/\?/g,' mấy ').replace(/ l\b/g,' lít'));
    u.lang='vi-VN';u.rate=.9;u.pitch=pitch;
    const v=speechSynthesis.getVoices().find(v=>/^vi/i.test(v.lang));if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
}

/* ---------- screens ---------- */
const KINDS={kp:'Khám phá',hd:'Hoạt động',lt:'Luyện tập',gt:'Giải toán',dv:'Đố vui'};
const PRAISE=['Giỏi quá!','Chính xác!','Tuyệt vời!','Đúng rồi!','Siêu quá!','Xuất sắc!'];
const OOPS=['Chưa đúng rồi!','Thử lại nhé!','Gần đúng rồi!'];
function show(id){['home','lesson','play','pet'].forEach(s=>$('#'+s).hidden=s!==id)}
const totalStars=()=>Object.values(S.stars).reduce((a,b)=>a+b,0);
const lvKey=(L,i)=>`b${L.id}-${i}`;
const lvOpen=(L,i)=>S.unlockAll||i===0||(S.stars[lvKey(L,i-1)]||0)>0;
const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
const lessonStars=L=>L.levels.reduce((a,_,i)=>a+(S.stars[lvKey(L,i)]||0),0);

function drawMap(host,items){
  const n=items.length,H=n*150+40,xs=[26,72,30,70,28,72,30,70];
  const pts=items.map((_,i)=>[xs[i%xs.length],(i*150+95)/H*100]);
  let d=`M${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<n;i++){const [x1,y1]=pts[i-1],[x2,y2]=pts[i],ym=(y1+y2)/2;d+=` C${x1} ${ym} ${x2} ${ym} ${x2} ${y2}`}
  host.style.height=H+'px';
  host.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="road-o" d="${d}"/><path class="road-i" d="${d}"/></svg>`;
  items.forEach((it,i)=>{
    const s=h(`<div class="spot" style="left:${pts[i][0]}%;top:${pts[i][1]}%"></div>`);
    const b=h(`<button class="node ${it.state}" aria-label="${it.aria}"><span class="ico">${it.icon}</span>${it.state.includes('locked')?'<span class="lock">🔒</span>':''}</button>`);
    b.onclick=it.onClick;
    s.appendChild(b);s.appendChild(h(`<div class="cap">${it.cap}</div>`));
    host.appendChild(s);
  });
}

function renderHome(){
  $('#hStars').textContent=totalStars();$('#hCoins').textContent=S.coins;
  let got=0,all=0;
  $('#shelf').innerHTML=LESSONS.map(L=>`<div class="shelf-lesson"><b>Bài ${L.id}</b><div class="shelf-row">${L.levels.map((lv,i)=>{all++;const has=S.stickers.includes(lvKey(L,i));if(has)got++;return has?`<span class="stk" title="${lv.name}">${lv.icon}</span>`:`<span class="stk empty">?</span>`}).join('')}</div></div>`).join('');
  $('#stkCount').textContent=`(${got}/${all})`;
  renderPetCard();
  let nowSet=false;
  drawMap($('#homeMap'),LESSONS.map(L=>{
    const st=lessonStars(L),done=L.levels.every((_,i)=>S.stars[lvKey(L,i)]);
    let state=done?'done':'';if(!done&&!nowSet){state+=' now';nowSet=true}
    return {icon:L.icon,state,aria:`Bài ${L.id}: ${L.title}`,
      cap:`<b>Bài ${L.id}</b><small>${L.title}</small><span class="st">⭐ ${st}/${L.levels.length*3}</span>`,
      onClick:()=>openLesson(L)};
  }));
}

let curLesson=null;
function openLesson(L){
  curLesson=L;show('lesson');
  $('#lTab').textContent='Bài '+L.id;$('#lTtl').textContent=L.title.toUpperCase();
  let nowSet=false;
  drawMap($('#lessonMap'),L.levels.map((lv,i)=>{
    const st=S.stars[lvKey(L,i)]||0,open=lvOpen(L,i);
    let state=open?(st?'done':''):'locked';
    if(open&&!st&&!nowSet){state+=' now';nowSet=true}
    return {icon:lv.icon,state,aria:lv.name,
      cap:`<span class="kind k-${lv.kind}">${KINDS[lv.kind]}</span><b>${lv.name}</b><span class="st">${starStr(st)}</span>`,
      onClick:()=>{ if(open)startLevel(L,i); else {sfx.bad();toast('Qua màn trước đã nhé!','bad')} }};
  }));
}

/* ---------- feedback ---------- */
let toastEl=null;
function toast(msg,kind='good'){
  if(toastEl)toastEl.remove();
  toastEl=h(`<div class="toast ${kind}">${msg}</div>`);document.body.appendChild(toastEl);
  const me=toastEl;setTimeout(()=>me.remove(),950);
}
function botMood(m){
  const b=$('#guideBot .bot');if(!b)return;
  b.classList.remove('happy','sad');void b.offsetWidth;b.classList.add(m);
  $('.mouth',b).setAttribute('d',m==='sad'?'M41 70 Q50 63 59 70':'M39 64 Q50 78 61 64');
  clearTimeout(botMood.t);botMood.t=setTimeout(()=>$('.mouth',b).setAttribute('d','M41 66 Q50 73 59 66'),900);
}
function flyTo(fromEl,toEl,html,after){
  const a=fromEl.getBoundingClientRect(),b=toEl.getBoundingClientRect();
  const f=h(`<div class="flyer">${html}</div>`);document.body.appendChild(f);
  const x0=a.left+a.width/2,y0=a.top+a.height/2,dx=b.left+b.width/2-x0,dy=b.top+b.height/2-y0;
  f.style.left=x0+'px';f.style.top=y0+'px';
  const end=()=>{f.remove();after&&after()};
  if(!f.animate||reduced){end();return}
  f.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${dx/2}px),calc(-50% + ${dy/2-70}px)) rotate(-12deg) scale(1.15)`},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`}],{duration:650,easing:'ease-in-out'}).onfinish=end;
}
function confetti(){
  if(reduced)return;
  const c=$('#confetti'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;
  const cols=['#FFC83D','#FF6B5B','#46B85A','#8A63E8','#48AEE6'];
  const P=Array.from({length:130},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.6,vx:(Math.random()-.5)*3,vy:2.5+Math.random()*3,r:5+Math.random()*6,c:pick(cols),a:Math.random()*6}));
  let t=0;(function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=.12;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/3,p.r,p.r*.66);x.restore()});if(++t<200)requestAnimationFrame(f);else x.clearRect(0,0,c.width,c.height)})();
}
function shakeEl(e){e.classList.remove('shake');void e.offsetWidth;e.classList.add('shake')}

/* ---------- level engine ---------- */
let CTX=null;
function startLevel(L,i){
  if(CTX)CTX.end();
  const lv=L.levels[i],stage=$('#stage');
  const ctx={alive:true,mistakes:0,cleanups:[],stage,lesson:L,
    say(t){$('#bubble').innerHTML=t;if(S.autoRead)speak(t)},
    good(msg){sfx.ok();botMood('happy');toast(msg||pick(PRAISE),'good')},
    bad(msg){ctx.mistakes++;sfx.bad();botMood('sad');toast(msg||pick(OOPS),'bad')},
    progress(f){$('#pbar').style.width=Math.min(100,f*100)+'%'},
    sleep:ms=>new Promise(r=>setTimeout(r,ms)),
    on(t,ev,fn){t.addEventListener(ev,fn);ctx.cleanups.push(()=>t.removeEventListener(ev,fn))},
    end(){ctx.alive=false;ctx.cleanups.forEach(f=>f());ctx.cleanups=[]},
    finish(o){finishLevel(ctx,L,i,o||{})},
  };
  CTX=ctx;show('play');
  $('#playTitle').textContent=lv.name;
  const k=$('#playKind');k.textContent=KINDS[lv.kind];k.className='kind k-'+lv.kind;
  stage.innerHTML='';$('#playScroll').scrollTop=0;ctx.progress(0);ctx.say('');
  lv.run(ctx);
}
function finishLevel(ctx,L,i,o){
  if(!ctx.alive)return;ctx.end();
  let stars=ctx.mistakes<=1?3:ctx.mistakes<=4?2:1;
  if(o.penalty)stars=Math.max(1,stars-1);
  const key=lvKey(L,i),lv=L.levels[i],coins=stars*10;
  S.stars[key]=Math.max(S.stars[key]||0,stars);S.coins+=coins;
  const newSticker=!S.stickers.includes(key);if(newSticker)S.stickers.push(key);
  const petLine=petReward(stars);
  save();ctx.progress(1);sfx.win();confetti();botMood('happy');
  const hasNext=i+1<L.levels.length;
  const msg=stars===3?'Con làm xuất sắc!':stars===2?'Con làm tốt lắm!':'Con đã hoàn thành rồi!';
  openModal(`<h2>${msg}</h2>
    <div class="big-stars">${[0,1,2].map(j=>`<span class="${j<stars?'':'off'}" style="animation-delay:${.2+j*.25}s">⭐</span>`).join('')}</div>
    <p style="margin:0;font-weight:800;color:var(--ink-2)">${ctx.mistakes===0?'Không sai câu nào!':`Số lần chọn sai: ${ctx.mistakes}`}</p>
    <div class="reward"><span class="pill">+${coins} 🪙</span>${newSticker?`<span class="pill">Hình dán mới: ${lv.icon}</span>`:''}${petLine}</div>
    <div class="mbtns">
      ${hasNext?`<button class="btn go" id="mNext">Màn tiếp theo ➜</button>`:`<button class="btn go" id="mMap">Về bản đồ bài học ➜</button>`}
      <button class="btn ghost" id="mAgain">↻ Chơi lại màn này</button>
    </div>`,false);
  if(hasNext)$('#mNext').onclick=()=>{closeModal();startLevel(L,i+1)};
  else $('#mMap').onclick=()=>{closeModal();openLesson(L)};
  $('#mAgain').onclick=()=>{closeModal();startLevel(L,i)};
}
function exitLevel(){if(CTX)CTX.end();CTX=null;if('speechSynthesis' in window)speechSynthesis.cancel();openLesson(curLesson)}
function openModal(html,dismiss=true){
  $('#mcard').innerHTML=html;$('#modal').hidden=false;
  $('#modal').onclick=e=>{if(dismiss&&e.target.id==='modal')closeModal()};
}
function closeModal(){$('#modal').hidden=true;$('#mcard').innerHTML=''}

/* ---------- shared widgets ---------- */
function makeOptions(ans,count=4){
  const s=new Set([ans]);
  for(const d of shuffle([1,-1,2,-2,3,-3,10,-10,4])){if(s.size>=count)break;if(ans+d>=0)s.add(ans+d)}
  let k=5;while(s.size<count)s.add(ans+k++);
  return shuffle([...s]);
}
function askChoice(ctx,host,options,correct,{hint,cls='',label}={}){
  return new Promise(res=>{
    host.innerHTML='';
    options.forEach(v=>{
      const b=h(`<button class="choice ${cls}">${label?label(v):v}</button>`);
      b.onclick=()=>{
        if(!ctx.alive)return;
        if(String(v)===String(correct)){
          b.classList.add('right');$$('button',host).forEach(x=>x.disabled=true);ctx.good();setTimeout(res,650);
        }else{
          b.classList.add('wrong','shake');b.disabled=true;ctx.bad();
          if(hint)ctx.say('Gợi ý: '+hintText(hint));
        }
      };
      host.appendChild(b);
    });
  });
}
function numpad(ctx,host,{max=3,auto=false}={}){
  const w=h(`<div class="numpad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="np-k" data-k="${n}">${n}</button>`).join('')}<button class="np-k np-del" data-k="del" aria-label="Xoá">⌫</button><button class="np-k" data-k="0">0</button><button class="np-k np-ok" data-k="ok" aria-label="Kiểm tra">✓</button></div>`);
  let val='',locked=false;
  const api={el:w,target:null,onSubmit:null,
    setTarget(t){api.target=t;val='';render()},
    clear(){val='';render()},lock(v){locked=v}};
  function render(){if(api.target&&!api.target.classList.contains('ok'))api.target.textContent=val||'?'}
  function press(k){
    if(locked||!ctx.alive)return;
    if(k==='ok'){if(val&&api.onSubmit)api.onSubmit(+val);return}
    if(k==='del')val=val.slice(0,-1);else if(val.length<max)val=(val==='0'?'':val)+k;
    sfx.pop();render();
    if(auto&&val.length===max&&api.onSubmit)api.onSubmit(+val);
  }
  w.onclick=e=>{const b=e.target.closest('.np-k');if(b)press(b.dataset.k)};
  ctx.on(document,'keydown',e=>{if(!$('#modal').hidden||host.hidden)return;if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('del');else if(e.key==='Enter'){e.preventDefault();press('ok')}});
  host.appendChild(w);
  return api;
}
function askNum(ctx,np,ans,{hint,hintAfter=2}={}){
  return new Promise(res=>{
    let wrong=0;
    np.onSubmit=v=>{
      if(!ctx.alive)return;
      const t=np.target;
      if(v===ans){np.lock(true);t.textContent=ans;t.classList.add('ok');ctx.good();setTimeout(()=>{np.lock(false);res()},700)}
      else{wrong++;ctx.bad();shakeEl(t);if(hint&&wrong>=hintAfter)ctx.say('Gợi ý: '+hintText(hint));setTimeout(()=>np.clear(),450)}
    };
  });
}
const qfmt=s=>s.replace('?','<b class="box">?</b>');
const tableRows=(a,op)=>Array.from({length:10},(_,i)=>op==='×'?[`${a} × ${i+1}`,a*(i+1)]:[`${a*(i+1)} : ${a}`,i+1]);
function calc(t){const [a,op,b]=t.split(' ');return op==='×'?a*b:op===':'?a/b:op==='+'?+a + +b:a-b}
function apply(v,[op,x]){return op==='×'?v*x:op===':'?v/x:op==='+'?v+x:v-x}
const lv=(name,kind,icon,run)=>({name,kind,icon,run});

/* ================= LEVEL TYPES ================= */

/* ----- Khám phá bảng nhân: thêm từng nhóm, rồi tự hoàn thành bảng ----- */
function explore(n,s){return lv(s.name,'kp',s.icon,async ctx=>{
  const st=ctx.stage,k0=s.k0;
  st.innerHTML=`<div class="scene sc-${s.scene}"><div class="lane" id="lane"><span class="empty-note">Chưa có ${s.thing} nào…</span></div></div>
    <div class="split"><div class="ttable" id="tt"></div><div class="side" id="side"></div></div>`;
  const lane=$('#lane',st),tt=$('#tt',st),side=$('#side',st);
  tt.innerHTML=`<div class="tt-h">Bảng nhân ${n}</div>`+tableRows(n,'×').map(([l],i)=>`<div class="tr" data-k="${i+1}"><span>${l}</span><span>=</span><span class="v">?</span></div>`).join('');
  const row=k=>$(`[data-k="${k}"]`,tt);
  const setRow=(k,v)=>{const r=row(k);$('.v',r).textContent=v;r.classList.remove('cur');r.classList.add('done','flash')};
  const addG=()=>{const e=$('.empty-note',lane);if(e)e.remove();lane.appendChild(h(`<div class="xl"><span class="xl-e ${s.flip?'flip':''}">${s.head}</span><span class="xl-w">${`<i>${s.dot||'●'}</i>`.repeat(n)}</span></div>`));sfx.hop()};

  side.innerHTML=`<div class="sum" id="sum"></div><div class="mul" id="mul">0 ${s.thing}</div><button class="btn" id="add">+ Thêm 1 ${s.thing}</button>`;
  ctx.say(`${s.q} Con bấm “Thêm 1 ${s.thing}” nhé!`);
  let c=0;
  await new Promise(res=>{
    $('#add',side).onclick=function(){
      if(!ctx.alive)return;
      if(c>=k0){res();return}
      c++;addG();
      $('#sum',side).textContent=Array(c).fill(n).join(' + ')+' = '+n*c;
      $('#mul',side).innerHTML=`${n} × ${c} = <b>${n*c}</b>`;
      setRow(c,n*c);ctx.progress(c/k0*.3);
      if(c===1)ctx.say(`1 ${s.thing} có ${n} ${s.unit}. Ta viết: ${n} × 1 = ${n}`);
      else if(c<k0)ctx.say(`Thêm ${n} vào kết quả của ${n} × ${c-1} ta được kết quả của ${n} × ${c}: &nbsp;${n*(c-1)} + ${n} = ${n*c}`);
      else{ctx.say(`${k0} ${s.thing} có ${n*k0} ${s.unit}! Vì ${Array(k0).fill(n).join(' + ')} = ${n*k0} nên ${n} × ${k0} = ${n*k0}.`);this.textContent='Con tự làm tiếp ➜';this.classList.add('go')}
    };
  });
  if(!ctx.alive)return;

  side.innerHTML=`<div class="qline" id="q"></div><div id="np"></div>`;
  const q=$('#q',side),np=numpad(ctx,$('#np',side));
  const B=range(k0+1,9),TOTAL=B.length+5;let done=0;
  for(const k of B){
    row(k).classList.add('cur');
    q.innerHTML=qfmt(`${n} × ${k} = ?`);np.setTarget($('.box',q));
    ctx.say(`Thêm ${n} vào kết quả của ${n} × ${k-1} ta được kết quả của ${n} × ${k}. Vậy ${n} × ${k} = ?`);
    await askNum(ctx,np,n*k,{hint:()=>`${n*(k-1)} + ${n} = ?`});
    if(!ctx.alive)return;
    setRow(k,n*k);addG();done++;ctx.progress(.3+done/TOTAL*.7);
  }
  setRow(10,n*10);addG();
  ctx.say(`Tuyệt vời! Con đã hoàn thành bảng nhân ${n}. Giờ bảng bị che rồi — đố nhanh nhé!`);
  await ctx.sleep(1600);if(!ctx.alive)return;
  tt.classList.add('masked');
  for(const k of shuffle(range(2,9)).slice(0,5)){
    row(k).classList.add('cur');
    q.innerHTML=qfmt(`${n} × ${k} = ?`);np.setTarget($('.box',q));
    ctx.say(`Đố nhanh: ${n} × ${k} bằng bao nhiêu?`);
    await askNum(ctx,np,n*k,{hint:()=>`${n} × ${k-1} = ${n*(k-1)}, thêm ${n} nữa là bao nhiêu?`});
    if(!ctx.alive)return;
    row(k).classList.remove('cur');done++;ctx.progress(.3+done/TOTAL*.7);
  }
  ctx.finish();
})}

/* ----- Khám phá bảng chia: xếp chấm tròn thành nhóm, rồi hoàn thành bảng chia ----- */
function divExplore(n,k0,icon){return lv(`Bảng chia ${n}`,'kp',icon,async ctx=>{
  const st=ctx.stage,T=n*k0;
  st.innerHTML=`<div class="card dv-demo"><div id="dvv"><div class="dots">${'<i></i>'.repeat(T)}</div></div><div class="dv-eq" id="dveq">Có ${T} chấm tròn</div><button class="btn" id="dvb">Xếp mỗi nhóm ${n} chấm</button></div>
    <div class="split"><div class="ttable" id="tt"></div><div class="side" id="side"></div></div>`;
  const tt=$('#tt',st),side=$('#side',st);
  tt.innerHTML=`<div class="tt-h">Bảng chia ${n}</div>`+tableRows(n,':').map(([l],i)=>`<div class="tr" data-k="${i+1}"><span>${l}</span><span>=</span><span class="v">?</span></div>`).join('');
  const row=k=>$(`[data-k="${k}"]`,tt);
  const setRow=(k)=>{const r=row(k);$('.v',r).textContent=k;r.classList.remove('cur');r.classList.add('done','flash')};
  ctx.say(`Có ${T} chấm tròn, xếp thành các nhóm, mỗi nhóm ${n} chấm. Hỏi được mấy nhóm?`);
  await new Promise(res=>{
    const b=$('#dvb',st);let step=0;
    b.onclick=()=>{
      if(!ctx.alive)return;
      if(step===0){
        step=1;sfx.hop();
        $('#dvv',st).innerHTML=`<div class="dgroups">${Array.from({length:k0},(_,i)=>`<div class="dgroup" style="animation-delay:${i*.08}s">${'<i></i>'.repeat(n)}</div>`).join('')}</div>`;
        $('#dveq',st).innerHTML=`${n} × ${k0} = ${T} &nbsp;→&nbsp; ${T} : ${n} = <b>${k0}</b>`;
        ctx.say(`Được ${k0} nhóm! Vì ${n} × ${k0} = ${T} nên ${T} : ${n} = ${k0}. Từ bảng nhân ${n} ta lập được bảng chia ${n}.`);
        setRow(k0);ctx.progress(.15);
        b.textContent='Con tự làm bảng chia ➜';b.classList.add('go');
      }else res();
    };
  });
  if(!ctx.alive)return;
  setRow(1);setRow(10);
  side.innerHTML=`<div class="mini-hint" id="mh"></div><div class="qline" id="q"></div><div id="np"></div>`;
  const q=$('#q',side),mh=$('#mh',side),np=numpad(ctx,$('#np',side));
  const B=range(2,9).filter(k=>k!==k0),TOTAL=B.length+4;let done=0;
  for(const k of B){
    row(k).classList.add('cur');
    mh.textContent=`Nhớ lại: ${n} × ? = ${n*k}`;
    q.innerHTML=qfmt(`${n*k} : ${n} = ?`);np.setTarget($('.box',q));
    ctx.say(`${n*k} : ${n} bằng mấy? Con nhẩm: ${n} nhân mấy bằng ${n*k}?`);
    await askNum(ctx,np,k,{hint:()=>`${n} × ${k-1} = ${n*(k-1)}, ${n} × ${k} = ?`});
    if(!ctx.alive)return;
    setRow(k);done++;ctx.progress(.15+done/TOTAL*.85);
  }
  ctx.say(`Con đã lập xong bảng chia ${n}! Giờ bảng bị che — đố nhanh nhé!`);
  mh.textContent='';
  await ctx.sleep(1400);if(!ctx.alive)return;
  tt.classList.add('masked');
  for(const k of shuffle(range(2,9)).slice(0,4)){
    row(k).classList.add('cur');
    q.innerHTML=qfmt(`${n*k} : ${n} = ?`);np.setTarget($('.box',q));
    ctx.say(`Đố nhanh: ${n*k} : ${n} = ?`);
    await askNum(ctx,np,k,{hint:()=>`${n} × mấy = ${n*k}?`});
    if(!ctx.alive)return;
    row(k).classList.remove('cur');done++;ctx.progress(.15+done/TOTAL*.85);
  }
  ctx.finish();
})}

/* ----- Nhảy qua suối: nêu các số còn thiếu ----- */
function frog(n,{name,icon,hero}){return lv(name,'hd',icon,async ctx=>{
  const up=range(1,10).map(i=>i*n);
  const rb=shuffle(range(1,9)).slice(0,5).sort((a,b)=>a-b);
  const rounds=[
    {t:`Đếm thêm ${n}`,seq:up,blanks:[3,4,6,8]},
    {t:`Đếm bớt ${n}`,seq:up.slice().reverse(),blanks:[3,4,6,8]},
    Math.random()<.5?{t:`Thử thách: đếm thêm ${n}`,seq:up,blanks:rb}:{t:`Thử thách: đếm bớt ${n}`,seq:up.slice().reverse(),blanks:rb},
  ];
  const total=rounds.reduce((a,r)=>a+r.blanks.length,0);let done=0;
  const st=ctx.stage;
  for(const r of rounds){
    st.innerHTML=`<div class="pond"><div class="pond-h">${r.t}</div><div class="pads" id="pads"></div><div class="frog" id="frog">${hero}</div></div><div class="choices" id="ch"></div>`;
    const padsEl=$('#pads',st),fr=$('#frog',st),ch=$('#ch',st);
    const pads=r.seq.map((v,i)=>{const p=h(`<div class="pad ${r.blanks.includes(i)?'blank':''}">${r.blanks.includes(i)?'?':v}</div>`);padsEl.appendChild(p);return p});
    let pos=0,fx=0,fy=0;
    // con vật đứng phía trên lá sen để không che số
    const T=(X,Y,s=1)=>`translate(${X}px,${Y}px) translate(-50%,-100%) scale(${s})`;
    const place=(i,anim)=>{
      const p=pads[i],x=p.offsetLeft+p.offsetWidth/2,y=p.offsetTop+8;
      if(anim&&fr.animate&&!reduced){fr.animate([{transform:T(fx,fy)},{transform:T((fx+x)/2,Math.min(fy,y)-40,1.2)},{transform:T(x,y)}],{duration:420,easing:'ease-in-out'});sfx.hop()}
      fx=x;fy=y;fr.style.transform=T(x,y);
    };
    place(0,false);
    ctx.on(window,'resize',()=>place(pos,false));
    const dir=r.seq[1]>r.seq[0]?'thêm':'bớt';
    ctx.say(`Giúp bạn nhỏ nhảy qua suối! Mỗi bước ${dir} ${n} đơn vị.`);
    while(pos<r.seq.length-1){
      const nx=pos+1;
      if(r.blanks.includes(nx)){
        pads[nx].classList.add('cur');
        ctx.say(`${r.seq[pos]} ${dir} ${n} là bao nhiêu?`);
        await askChoice(ctx,ch,makeOptions(r.seq[nx]),r.seq[nx],{hint:()=>`${r.seq[pos]} ${dir==='thêm'?'+':'−'} ${n} = ?`});
        if(!ctx.alive)return;
        ch.innerHTML='';
        pads[nx].className='pad filled';pads[nx].textContent=r.seq[nx];
        done++;ctx.progress(done/total);
      }else await ctx.sleep(380);
      if(!ctx.alive)return;
      pos=nx;place(pos,true);
      await ctx.sleep(420);
    }
    ctx.say('Qua suối rồi! 🎉');
    await ctx.sleep(1100);if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Ong tìm hoa: nối phép tính với kết quả ----- */
function bees({name,icon,center,rounds,petals:fixedPetals}){return lv(name,'hd',icon,async ctx=>{
  const st=ctx.stage,R=rounds.map(r=>typeof r==='function'?r():r);
  const total=R.flat().length;let done=0;
  const pcs=['#FFB4C8','#FFD36E','#B9A4FF','#8FD9FF','#A6E88F'];
  st.innerHTML=`<p class="lbl">Chạm vào một chú ong, rồi chạm vào cánh hoa ghi kết quả đúng.</p><div class="bees" id="bees"></div>
    <div class="flower-wrap"><div class="flower" id="flower"></div><div class="stem"></div><div class="pot"></div></div>`;
  const fl=$('#flower',st),beesEl=$('#bees',st);
  let sel=null;
  for(const r of R){
    let vals=fixedPetals||[...new Set(r.map(calc))];
    if(!fixedPetals){const pool=shuffle([...new Set(r.flatMap(t=>{const v=calc(t);return[v+1,v-1,v+2,v*2].filter(x=>x>0)}))]);while(vals.length<8&&pool.length){const x=pool.pop();if(!vals.includes(x))vals.push(x)}vals.sort((a,b)=>a-b)}
    const m=vals.length;
    fl.innerHTML=`<div class="f-center">${center}</div>`;
    const petals=vals.map((v,i)=>{const p=h(`<button class="petal" style="--a:${i*360/m}deg;--pc:${pcs[i%5]}" data-v="${v}"><span>${v}</span></button>`);fl.appendChild(p);return p});
    beesEl.innerHTML='';sel=null;
    ctx.say('Mỗi chú ong mang một phép tính. Con giúp ong bay đến đúng cánh hoa nhé!');
    await new Promise(res=>{
      let left=r.length;
      r.forEach(t=>{
        const b=h(`<button class="bee" data-v="${calc(t)}" data-t="${t}"><span class="bee-i">🐝</span><span>${t}</span></button>`);
        b.onclick=()=>{if(!ctx.alive)return;sfx.pop();$$('.bee',beesEl).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;ctx.say(`${t} = ? &nbsp;Chạm vào cánh hoa có kết quả đúng!`)};
        beesEl.appendChild(b);
      });
      petals.forEach(p=>p.onclick=()=>{
        if(!ctx.alive)return;
        if(!sel){ctx.say('Con chọn một chú ong trước nhé!');sfx.pop();return}
        if(p.dataset.v===sel.dataset.v){
          const b=sel;sel=null;ctx.good();
          flyTo($('.bee-i',b),p,'🐝',()=>{p.classList.add('got');p.appendChild(h('<span class="pb">🐝</span>'))});
          b.classList.remove('sel');b.classList.add('gone');b.disabled=true;
          done++;ctx.progress(done/total);
          if(--left===0)setTimeout(res,1000);else ctx.say('Chọn chú ong tiếp theo nào!');
        }else{
          ctx.bad();shakeEl($('span',p));
          const [a,op,x]=sel.dataset.t.split(' ');
          ctx.say(op===':'?`Gợi ý: ${x} × mấy = ${a}?`:`Gợi ý: đọc lại bảng nhân ${a}: ${a} × ${x} = ?`);
        }
      });
    });
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Ghép cặp cùng kết quả (tách–đĩa, xe tải, dưa hấu, trực thăng) ----- */
function genPairs(tables,must,count=5){
  const ex=new Map();
  for(const a of tables)for(let b=1;b<=10;b++){ex.set(`${a} × ${b}`,a*b);if(b<=10)ex.set(`${b} × ${a}`,a*b);ex.set(`${a*b} : ${a}`,b)}
  const byV={};for(const [t,v] of ex)(byV[v]=byV[v]||[]).push(t);
  const has=t=>t.split(/ [×:] /).includes(String(must));
  const vals=shuffle(Object.keys(byV).map(Number).filter(v=>byV[v].length>=2&&byV[v].some(has))).slice(0,count);
  const pairs=vals.map(v=>{const l=shuffle(byV[v]);const a=l.find(has);const b=l.find(t=>t!==a&&t.includes('×')!==a.includes('×'))||l.find(t=>t!==a);return Math.random()<.5?[a,b]:[b,a]});
  return {tops:shuffle(pairs.map(p=>p[0])),bottoms:shuffle(pairs.map(p=>p[1]))};
}
function pairs({name,icon,theme='cup',top,bottom,rounds}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,R=rounds.map(r=>typeof r==='function'?r():r);
  const total=R.reduce((a,r)=>a+r.tops.length,0);let done=0;
  const ccs=['#FFE08A','#FFC4D6','#BDF0C0','#D8CCFF','#BFE6FF'];
  for(const r of R){
    st.innerHTML=`<p class="lbl">Hai phép tính nào có cùng kết quả? Chạm vào ${top}, rồi chạm vào ${bottom} phù hợp.</p>
      <div class="table-top th-${theme}"><div class="cups" id="cups"></div><div class="plates" id="plates"></div></div>`;
    const cupsEl=$('#cups',st),platesEl=$('#plates',st);
    let sel=null;
    ctx.say(`Mỗi ${top} phải về đúng ${bottom} có cùng kết quả!`);
    await new Promise(res=>{
      let left=r.tops.length;
      r.tops.forEach((t,i)=>{
        const c=h(`<button class="cup" data-v="${calc(t)}"><span class="cup-b" style="--cc:${ccs[i%5]}">${t}</span></button>`);
        c.onclick=()=>{if(!ctx.alive)return;sfx.pop();$$('.cup',cupsEl).forEach(x=>x.classList.remove('sel'));c.classList.add('sel');sel=c;ctx.say(`${t} = ? &nbsp;Tìm ${bottom} có cùng kết quả!`)};
        cupsEl.appendChild(c);
      });
      r.bottoms.forEach(t=>{
        const p=h(`<button class="plate" data-v="${calc(t)}"><span class="slot"></span><span class="dish">${t}</span></button>`);
        p.onclick=()=>{
          if(!ctx.alive||p.classList.contains('got'))return;
          if(!sel){ctx.say(`Con chọn ${top} trước nhé!`);sfx.pop();return}
          const cup=sel,ct=$('.cup-b',cup).textContent;
          if(p.dataset.v===cup.dataset.v){
            sel=null;ctx.good();p.classList.add('got');
            const html=$('.cup-b',cup).outerHTML;
            flyTo($('.cup-b',cup),$('.slot',p),html,()=>$('.slot',p).innerHTML=html);
            cup.classList.remove('sel');cup.classList.add('gone');cup.disabled=true;
            ctx.say(`Đúng rồi: ${ct} = ${$('.dish',p).textContent} = ${p.dataset.v}`);
            done++;ctx.progress(done/total);
            if(--left===0)setTimeout(res,1100);
          }else{
            ctx.bad();shakeEl($('.dish',p));
            ctx.say(`Chưa đúng: ${ct} = ${cup.dataset.v}, còn ${$('.dish',p).textContent} = ${p.dataset.v}. Tìm chỗ khác nhé!`);
          }
        };
        platesEl.appendChild(p);
      });
    });
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Đua tốc độ: trả lời nhanh ----- */
const tableGen=n=>()=>{const k=rnd(1,10);return pick([[`${n} × ${k} = ?`,n*k],[`${k} × ${n} = ?`,n*k],[`${n*k} : ${n} = ?`,k],[`${n*k} : ${n} = ?`,k],[`${n} × ? = ${n*k}`,k],[`? : ${n} = ${k}`,n*k]])};
const zeroOneGen=()=>{const a=rnd(2,9),t=pick([2,3,4,5]),k=rnd(1,10);return pick([[`${a} × 1 = ?`,a],[`1 × ${a} = ?`,a],[`${a} : 1 = ?`,a],[`0 × ${a} = ?`,0],[`${a} × 0 = ?`,0],[`0 : ${a} = ?`,0],[`${t} × ${k} = ?`,t*k],[`${t*k} : ${t} = ?`,k]])};
function race({name,icon,gen,me='🏎️',rival='🚙',meT='scaleX(-1)',rivalT='scaleX(-1)',intro}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,N=12,RIVAL_MS=N*9000;
  st.innerHTML=`<div class="track"><div class="rlane"><span class="car" id="me"><i style="transform:${meT}">${me}</i></span><span class="who">CON</span></div><div class="rlane"><span class="car" id="rv"><i style="transform:${rivalT}">${rival}</i></span><span class="who">RÔ-BỐT</span></div><div class="finish"></div></div>
    <div class="qcard"><div class="qbig" id="q"></div><div class="choices" id="ch"></div></div>`;
  const meE=$('#me',st),rv=$('#rv',st),q=$('#q',st),ch=$('#ch',st);
  let pos=0,riv=0,rivalWon=false,last=performance.now();
  const place=()=>{meE.style.left=`calc(${pos/N} * (100% - 74px) + 4px)`;rv.style.left=`calc(${riv} * (100% - 74px) + 4px)`};
  place();
  if(intro){ctx.say(intro);await ctx.sleep(3500);if(!ctx.alive)return}
  last=performance.now();
  const timer=setInterval(()=>{
    const now=performance.now();riv=Math.min(1,riv+(now-last)/RIVAL_MS);last=now;
    if(riv>=1&&!rivalWon&&pos<N){rivalWon=true;ctx.say('Rô-bốt về đích trước rồi! Không sao, con cứ bình tĩnh làm tiếp nhé!')}
    place();
  },250);
  ctx.cleanups.push(()=>clearInterval(timer));
  ctx.say('Trả lời đúng để con về đích trước Rô-bốt!');
  const seen=new Set(),qs=[];let guard=0;
  while(qs.length<N&&guard++<400){const [t,a]=gen();if(seen.has(t))continue;seen.add(t);qs.push({t,a})}
  for(const it of qs){
    q.innerHTML=qfmt(it.t);
    await askChoice(ctx,ch,makeOptions(it.a),it.a);
    if(!ctx.alive)return;
    pos++;place();ctx.progress(pos/N);sfx.hop();
  }
  clearInterval(timer);
  ctx.say(rivalWon?'Về đích rồi! Lần sau mình nhanh hơn nhé!':'Con về nhất! Nhanh hơn cả Rô-bốt!');
  await ctx.sleep(1200);
  ctx.finish({penalty:rivalWon});
})}

/* ----- Máy biến hình: chuỗi phép tính ----- */
function genChain(n,known,extra){
  for(let g=0;g<50;g++){
    const k=rnd(2,9),p=n*k,ds=known.filter(d=>d!==n&&p%d===0&&p/d<=10);
    if(!ds.length)continue;
    const steps=[['×',k],[':',pick(ds)]];
    if(extra)steps.push(extra());
    return {s:n,steps};
  }
  return {s:n,steps:[['×',2],[':',2]]};
}
function chain({name,icon,hero='',goal='',chains}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,C=chains.map(c=>typeof c==='function'?c():c);
  const total=C.reduce((a,c)=>a+c.steps.length,0);let done=0;
  st.innerHTML=`<p class="lbl">Tính lần lượt theo chiều mũi tên, điền số vào hình còn trống.</p><div class="card" style="padding:10px 8px"><div class="chain" id="chn"></div></div><div id="np"></div>`;
  const chn=$('#chn',st),np=numpad(ctx,$('#np',st));
  for(const c of C){
    let v=c.s,html=`${hero?`<span class="ch-hero">${hero}</span>`:''}<div class="ch-node ch-sq"><span>${c.s}</span></div>`;
    c.steps.forEach(([op,x],i)=>{html+=`<div class="ch-arrow">${op} ${x}<i></i></div><div class="ch-node ${i%2?'ch-tri':'ch-ci'}" data-i="${i}"><span>?</span></div>`});
    if(goal)html+=`<span class="ch-goal">${goal}</span>`;
    chn.innerHTML=html;
    for(let i=0;i<c.steps.length;i++){
      const node=$(`[data-i="${i}"]`,chn),[op,x]=c.steps[i],nv=apply(v,c.steps[i]);
      node.classList.add('cur');np.setTarget($('span',node));
      ctx.say(`${v} ${op} ${x} = ?`);
      await askNum(ctx,np,nv,{hint:()=>op==='×'?`Bảng nhân: ${v} × ${x} = ?`:op===':'?`${x} × mấy = ${v}?`:`${v} ${op} ${x} = ?`});
      if(!ctx.alive)return;
      node.classList.remove('cur');node.classList.add('ok');v=nv;done++;ctx.progress(done/total);
    }
    ctx.say('Hoàn thành một chặng! 🎉');
    await ctx.sleep(1000);if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Chọn tất cả / lớn nhất: bóng bay, toa tàu, bình hoa ----- */
function selectLv({name,icon,theme='balloon',rounds}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,R=rounds.map(r=>typeof r==='function'?r():r);
  const test=(r,v)=>r.cond==='lt'?v<r.val:r.cond==='gt'?v>r.val:r.cond==='max'?v===Math.max(...r.items.map(calc)):v===Math.min(...r.items.map(calc));
  const total=R.reduce((a,r)=>a+r.items.filter(t=>test(r,calc(t))).length,0);let done=0;
  const bcs=['#FF6B5B','#8A63E8','#48AEE6','#46B85A','#E0A21A','#FF7EB6'];
  for(const r of R){
    const want=r.items.filter(t=>test(r,calc(t))).length;
    st.innerHTML=`<p class="q-t" style="text-align:center">${r.prompt}</p><div class="${theme==='train'?'train':'balloons th-'+theme}" id="its"></div><div class="sel-count" id="cnt"></div>`;
    const its=$('#its',st),cnt=$('#cnt',st);
    if(theme==='train')its.appendChild(h('<span class="loco">🚂</span>'));
    let got=0;
    const upd=()=>cnt.textContent=r.cond==='max'||r.cond==='min'?'':`Đã tìm được ${got} / ${want}`;
    upd();ctx.say(r.prompt);
    await new Promise(res=>{
      r.items.forEach((t,i)=>{
        const v=calc(t),b=h(`<button class="${theme==='train'?'wagon':'ball'}" style="--bc:${bcs[i%bcs.length]}">${t}</button>`);
        b.onclick=()=>{
          if(!ctx.alive||b.classList.contains('got'))return;
          if(test(r,v)){
            b.classList.add('got');got++;done++;ctx.good();ctx.progress(done/total);upd();
            ctx.say(`Đúng rồi: ${t} = ${v}.`);
            if(got===want)setTimeout(res,1000);
          }else{
            ctx.bad();shakeEl(b);
            ctx.say(r.cond==='lt'?`${t} = ${v}, không bé hơn ${r.val}.`:r.cond==='gt'?`${t} = ${v}, không lớn hơn ${r.val}.`:`${t} = ${v}. Tính kết quả từng toa rồi so sánh nhé!`);
          }
        };
        its.appendChild(b);
      });
    });
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Cân so sánh >, <, = ----- */
function compareLv({name,icon,pairs:P}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,list=P.map(p=>typeof p==='function'?p():p).flat();let done=0;
  st.innerHTML=`<p class="lbl">Tính kết quả hai bên rồi chọn dấu &gt;, &lt; hoặc = thích hợp.</p>
    <div class="card" style="padding:14px 10px"><div class="cmp"><div class="cmp-mid" id="mid">?</div><div class="fulcrum"></div><div class="beam" id="beam"><div class="pan l"><div class="pan-card" id="pl"></div></div><div class="pan r"><div class="pan-card" id="pr"></div></div></div></div></div>
    <div class="choices" id="ch"></div>`;
  const beam=$('#beam',st),pl=$('#pl',st),pr=$('#pr',st),mid=$('#mid',st),ch=$('#ch',st);
  for(const [a,b] of list){
    const va=calc(a),vb=calc(b),sign=va>vb?'>':va<vb?'<':'=';
    beam.style.rotate='0deg';mid.textContent='?';
    pl.innerHTML=`${a}<small></small>`;pr.innerHTML=`${b}<small></small>`;
    ctx.say(`${a} ? ${b}`);
    await askChoice(ctx,ch,['>','<','='],sign,{cls:'sym',hint:()=>`${a} = ${va}, còn ${b} = ${vb}.`});
    if(!ctx.alive)return;
    $('small',pl).textContent='= '+va;$('small',pr).textContent='= '+vb;mid.textContent=sign;
    beam.style.rotate=sign==='>'?'-9deg':sign==='<'?'9deg':'0deg';
    done++;ctx.progress(done/list.length);
    await ctx.sleep(1300);if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Quiz tổng quát (chọn đáp án hoặc điền số) ----- */
function quiz(name,kind,icon,makeQs,intro){return lv(name,kind,icon,async ctx=>{
  const st=ctx.stage,qs=makeQs();
  st.innerHTML=`<div class="card qz" id="qz"></div><div id="np" hidden></div>`;
  const qz=$('#qz',st),npHost=$('#np',st),np=numpad(ctx,npHost);
  if(intro){ctx.say(intro)}
  for(let i=0;i<qs.length;i++){
    const q=qs[i];
    qz.innerHTML=`<div class="prob-no">Câu ${i+1} / ${qs.length}</div>${q.html}<div class="choices" id="qc"></div>`;
    $('#playScroll').scrollTop=0;
    if(q.say||i>0||!intro)ctx.say(q.say||q.html.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
    if(q.choices){npHost.hidden=true;await askChoice(ctx,$('#qc',qz),q.choices,q.ans,{hint:q.hint,cls:q.cls||'',label:q.label})}
    else{npHost.hidden=false;np.setTarget($('.box',qz));await askNum(ctx,np,q.ans,{hint:q.hint,hintAfter:q.hintAfter||2})}
    if(!ctx.alive)return;
    ctx.progress((i+1)/qs.length);
    if(q.explain){ctx.say(q.explain);await ctx.sleep(1700);if(!ctx.alive)return}
  }
  ctx.finish();
})}

/* ----- Giải toán có lời văn ----- */
function vis(v){
  if(!v)return'';
  const items=(n,it)=>Array.from({length:n},(_,j)=>`<span>${Array.isArray(it)?it[j%it.length]:it}</span>`).join('');
  if(v.type==='groups')return`<div class="grps">${Array.from({length:v.n},(_,i)=>`<div class="grp" style="animation-delay:${i*.05}s">${v.head?`<div class="grp-h">${v.head}</div>`:''}<div class="grp-i">${items(v.per,v.item)}</div></div>`).join('')}</div>`;
  if(v.type==='pile')return`<div class="pile">${items(v.total,v.item)}</div>`;
  if(v.type==='html')return v.html;
  return'';
}
const WTHEMES=[{c:'hộp',u:'chiếc bánh',e:'🍪',he:'📦'},{c:'giỏ',u:'quả táo',e:'🍎',he:'🧺'},{c:'túi',u:'viên bi',e:'🔵',he:'👜'},{c:'đĩa',u:'quả cam',e:'🍊',he:'🍽️'},{c:'lọ',u:'bông hoa',e:'🌷',he:'🏺'},{c:'khay',u:'quả trứng',e:'🥚',he:'🧺'}];
function wordRandom(n,count=2){
  const th=shuffle(WTHEMES);
  return shuffle(['mul','share','group']).slice(0,count).map((kind,i)=>{
    const {c,u,e,he}=th[i],k=rnd(3,9);
    if(kind==='mul'){const d=n===k?`${n} : ${n}`:n>k?`${n} − ${k}`:`${k} − ${n}`;
      return {text:`Mỗi ${c} có ${n} ${u}. Hỏi ${k} ${c} như thế có bao nhiêu ${u}?`,vis:{type:'groups',n:k,per:n,item:e,head:he},
        ops:[`${n} × ${k}`,`${n} + ${k}`,d],ans:n*k,unit:u,lead:`Số ${u} có là:`,opHint:`${k} ${c}, mỗi ${c} ${n} ${u} → ${n} được lấy ${k} lần.`}}
    if(kind==='share')return {text:`Có ${n*k} ${u} chia đều vào ${n} ${c}. Hỏi mỗi ${c} có bao nhiêu ${u}?`,vis:{type:'pile',total:n*k,item:e},after:{type:'groups',n,per:k,item:e,head:he},
        ops:[`${n*k} : ${n}`,`${n*k} × ${n}`,`${n*k} − ${n}`],ans:k,unit:u,lead:`Số ${u} ở mỗi ${c} là:`,opHint:`Chia đều vào ${n} ${c} → dùng phép chia cho ${n}.`};
    return {text:`Có ${n*k} ${u}, xếp vào các ${c}, mỗi ${c} ${n} ${u}. Hỏi xếp được bao nhiêu ${c}?`,vis:{type:'pile',total:n*k,item:e},after:{type:'groups',n:k,per:n,item:e,head:he},
        ops:[`${n*k} : ${n}`,`${n*k} × ${n}`,`${n*k} + ${n}`],ans:k,unit:c,lead:`Số ${c} xếp được là:`,opHint:`Mỗi ${c} ${n} ${u} → chia ${n*k} cho ${n}.`};
  });
}
function words({name,icon,fixed,n,extra=2}){return lv(name,'gt',icon,async ctx=>{
  const st=ctx.stage,probs=[...fixed,...(n?wordRandom(n,extra):[])];
  const total=probs.reduce((a,p)=>a+(p.direct?1:2),0);let done=0;
  st.innerHTML=`<div class="card prob" id="pb"></div><div id="np" hidden></div>`;
  const pb=$('#pb',st),npHost=$('#np',st),np=numpad(ctx,npHost);
  for(let i=0;i<probs.length;i++){
    const p=probs[i],last=i===probs.length-1;
    pb.innerHTML=`<div class="prob-no">Bài toán ${i+1} / ${probs.length}</div><p class="prob-t">${p.text}</p><div id="vis">${vis(p.vis)}</div>
      <div><div class="step-l">${p.direct?'Con chọn câu trả lời đúng:':'① Con chọn phép tính đúng:'}</div><div class="choices" id="ops"></div></div><div id="sol" hidden></div>`;
    $('#playScroll').scrollTop=0;npHost.hidden=true;
    ctx.say(p.text);
    const sol=$('#sol',pb);
    if(p.direct){
      await askChoice(ctx,$('#ops',pb),p.options,p.ans,{hint:p.opHint,cls:'small'});
      if(!ctx.alive)return;done++;ctx.progress(done/total);
      sol.hidden=false;sol.innerHTML=`<div class="sol-box">${p.explain}</div>`;
      if(p.after)$('#vis',pb).innerHTML=vis(p.after);
      ctx.say(p.explain);
    }else{
      await askChoice(ctx,$('#ops',pb),shuffle(p.ops),p.ops[0],{hint:p.opHint,cls:'small'});
      if(!ctx.alive)return;done++;ctx.progress(done/total);
      sol.hidden=false;
      sol.innerHTML=`<div class="step-l">② Con tính và điền kết quả:</div><div class="sol-box"><div class="sol-t">Bài giải</div><div>${p.lead}</div><div class="sol-eq">${p.ops[0]} = <b class="box">?</b> (${p.unit})</div><div class="sol-ans" hidden>Đáp số: ${p.ans} ${p.unit}.</div></div>`;
      npHost.hidden=false;np.setTarget($('.box',sol));
      ctx.say(`${p.ops[0]} bằng bao nhiêu?`);
      sol.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
      const [x,op,y]=p.ops[0].split(' ');
      await askNum(ctx,np,p.ans,{hint:()=>op==='×'?`Nhớ bảng nhân: ${x} × ${y} = ?`:op===':'?`${y} × mấy = ${x}?`:`Đặt tính rồi tính ${x} ${op} ${y} nhé.`});
      if(!ctx.alive)return;done++;ctx.progress(done/total);
      npHost.hidden=true;$('.sol-ans',sol).hidden=false;
      if(p.after)$('#vis',pb).innerHTML=vis(p.after);
      ctx.say(`Đáp số: ${p.ans} ${p.unit}. ${last?'Con giải hết rồi!':'Sang bài tiếp nhé!'}`);
    }
    await new Promise(res=>{const row=h(`<div class="next-row"><button class="btn go">${last?'Hoàn thành ➜':'Bài tiếp theo ➜'}</button></div>`);$('button',row).onclick=res;sol.appendChild(row);row.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'})});
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Xếp theo cân nặng (Bài 8) ----- */
function sortLv({name,icon,rounds}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,R=rounds.map(r=>typeof r==='function'?r():r);
  const total=R.flat().length;let done=0;
  for(const r of R){
    const order=r.slice().sort((a,b)=>a.w-b.w);let idx=0;
    st.innerHTML=`<p class="lbl">Chạm vào các con vật theo thứ tự cân nặng <b>từ bé đến lớn</b>.</p><div class="order" id="ord"><span class="ph">Nhẹ nhất ở đây ➜</span></div><div class="animals" id="an"></div>`;
    const ord=$('#ord',st),an=$('#an',st);
    ctx.say('Con vật nào nhẹ nhất? Chạm vào nó trước nhé!');
    await new Promise(res=>{
      shuffle(r).forEach(a=>{
        const b=h(`<button class="ani"><span class="ae">${a.e}</span><b>${a.n}</b><small>${a.w} kg</small></button>`);
        b.onclick=()=>{
          if(!ctx.alive)return;
          if(a.w===order[idx].w){
            ctx.good();b.classList.add('used');
            if(idx===0)ord.innerHTML='';else ord.appendChild(h('<span class="lt">&lt;</span>'));
            ord.appendChild(h(`<span class="oa">${a.e}<small>${a.w} kg</small></span>`));
            idx++;done++;ctx.progress(done/total);
            if(idx===order.length){ctx.say('Thứ tự từ bé đến lớn: '+order.map(x=>x.n).join(', ')+'.');setTimeout(res,1800)}
            else ctx.say(`Tiếp theo: con vật nào nhẹ nhất trong các con còn lại?`);
          }else{
            ctx.bad();shakeEl(b);ctx.say(`${a.n} nặng ${a.w} kg. Còn con vật nhẹ hơn đấy, so sánh chữ số hàng trăm trước nhé!`);
          }
        };
        an.appendChild(b);
      });
    });
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Đặt tính rồi tính (Bài 8) ----- */
function colCalc({name,icon,probs}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,P=typeof probs==='function'?probs():probs;
  const digits=P.map(([x,op,y])=>String(op==='+'?x+y:x-y).length),TOT=digits.reduce((a,b)=>a+b,0);let done=0;
  st.innerHTML=`<p class="lbl">Tính từ phải sang trái: hàng đơn vị, rồi hàng chục, rồi hàng trăm.</p><div class="colc-wrap" id="cw"></div><div id="np"></div>`;
  const cw=$('#cw',st),np=numpad(ctx,$('#np',st),{max:1,auto:true});
  for(const [x,op,y] of P){
    const r=op==='+'?x+y:x-y,sx=String(x),sy=String(y),sr=String(r),C=Math.max(sx.length,sy.length,sr.length);
    const cells=(s,pre='')=>{const a=[pre];for(let i=0;i<C;i++){const j=i-(C-s.length);a.push(j>=0?s[j]:'')}return a.map(c=>`<span>${c}</span>`).join('')};
    let res='<span></span>';for(let i=0;i<C;i++){const j=i-(C-sr.length);res+=j>=0?`<span><b class="box idle" data-c="${C-1-i}">?</b></span>`:'<span></span>'}
    cw.innerHTML=`<div class="colc" style="--c:${C+1}">${cells(sx)}${cells(sy,'').replace('<span></span>',`<span class="sg">${op==='+'?'+':'−'}</span>`)}<span class="ln"></span>${res}</div>`;
    ctx.say(`Đặt tính rồi tính: ${x} ${op==='+'?'+':'−'} ${y}`);
    let carry=0;
    for(let c=0;c<sr.length;c++){
      const dx=+(sx[sx.length-1-c]||0),dy=+(sy[sy.length-1-c]||0);
      let digit,hint;
      if(op==='+'){const s=dx+dy+carry;digit=s%10;hint=`${dx} + ${dy}${carry?' thêm 1 (nhớ)':''} = ${s}, viết ${s%10}${s>9?', nhớ 1':''}.`;carry=s>9?1:0}
      else{const sub=dy+carry;if(dx<sub){digit=dx+10-sub;hint=`${dx} không trừ được ${sub}, lấy 1${dx} trừ ${sub} bằng ${digit}, viết ${digit}, nhớ 1.`;carry=1}else{digit=dx-sub;hint=`${carry?`${dy} thêm 1 bằng ${sub}; `:''}${dx} trừ ${sub} bằng ${digit}, viết ${digit}.`;carry=0}}
      const box=$(`[data-c="${c}"]`,cw);box.classList.remove('idle');np.setTarget(box);
      ctx.say(['Hàng đơn vị','Hàng chục','Hàng trăm','Hàng nghìn'][c]+': viết chữ số nào?');
      await askNum(ctx,np,digit,{hint,hintAfter:1});
      if(!ctx.alive)return;
      ctx.say(hint);done++;ctx.progress(done/TOT);
    }
    ctx.say(`${x} ${op==='+'?'+':'−'} ${y} = ${r}. Giỏi lắm!`);
    await ctx.sleep(1500);if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ----- Tháp số (Bài 8) ----- */
function pyramidLv({name,icon,base,given}){return lv(name,'lt',icon,async ctx=>{
  const st=ctx.stage,rows=[base];
  while(rows[rows.length-1].length>1){const p=rows[rows.length-1];rows.push(p.slice(1).map((v,i)=>p[i]+v))}
  const isGiven=(r,i)=>r===0||given.some(([gr,gi])=>gr===r&&gi===i);
  st.innerHTML=`<p class="lbl">Mỗi viên gạch bằng tổng hai viên gạch ngay bên dưới.</p><div class="card" style="padding:14px 6px"><div class="pyr" id="py"></div></div><div id="np"></div>`;
  const py=$('#py',st);
  py.innerHTML=rows.slice().reverse().map((row,ri)=>{const r=rows.length-1-ri;return`<div class="pyr-row">${row.map((v,i)=>`<span class="pc ${isGiven(r,i)?'':'q'}" data-r="${r}" data-i="${i}">${isGiven(r,i)?v:'?'}</span>`).join('')}</div>`}).join('');
  const np=numpad(ctx,$('#np',st));
  const todo=[];rows.forEach((row,r)=>row.forEach((v,i)=>{if(!isGiven(r,i))todo.push([r,i,v])}));
  let done=0;
  ctx.say('Viên gạch nào có dấu ? thì con tính tổng hai viên bên dưới nó nhé!');
  for(const [r,i,v] of todo){
    const cell=$(`[data-r="${r}"][data-i="${i}"]`,py),a=$(`[data-r="${r-1}"][data-i="${i}"]`,py),b=$(`[data-r="${r-1}"][data-i="${i+1}"]`,py);
    cell.classList.add('cur');a.classList.add('src');b.classList.add('src');
    np.setTarget(cell);
    ctx.say(`${rows[r-1][i]} + ${rows[r-1][i+1]} = ?`);
    await askNum(ctx,np,v,{hint:()=>`Cộng hai viên màu đỏ: ${rows[r-1][i]} + ${rows[r-1][i+1]}`});
    if(!ctx.alive)return;
    cell.classList.remove('cur','q','ok');cell.classList.add('okk');cell.textContent=v;a.classList.remove('src');b.classList.remove('src');
    done++;ctx.progress(done/todo.length);
  }
  ctx.say('Xây xong tháp rồi! 🏆');await ctx.sleep(1000);
  ctx.finish();
})}

/* ----- Đố vui: đong nước (Bài 7) ----- */
function jugSVG(cap,w){
  const H=cap*15+20,y0=16;
  let ticks='';for(let i=1;i<cap;i++)ticks+=`<line x1="10" x2="20" y1="${y0+H-i*H/cap}" y2="${y0+H-i*H/cap}" stroke="#243A6B" stroke-width="1.5"/>`;
  const wh=H*w/cap;
  return`<svg viewBox="0 0 90 ${H+24}" width="90" height="${H+24}"><rect x="54" y="4" width="16" height="14" rx="3" fill="#BFE6FF" stroke="#243A6B" stroke-width="2.5"/><rect x="6" y="${y0}" width="70" height="${H}" rx="12" fill="#fff" stroke="#243A6B" stroke-width="3"/><rect class="water" x="9" y="${y0+H-wh+1}" width="64" height="${Math.max(0,wh-3)}" rx="9" fill="#48AEE6"/>${ticks}<text x="41" y="${y0+H/2+6}" text-anchor="middle" font-size="16" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${cap} l</text></svg>`;
}
function pourLv(){return lv('Đố bạn: Đong nước','dv','🪣',async ctx=>{
  const st=ctx.stage,P=[{caps:[3,5],opt:4},{caps:[4,9],opt:4}];
  for(let pi=0;pi<P.length;pi++){
    const {caps,opt}=P[pi];let w=[0,0],moves=0;
    const draw=()=>{
      st.innerHTML=`<div class="card pz"><p class="q-t">Có một can ${caps[0]} l và một can ${caps[1]} l. Chỉ dùng hai can đó, làm thế nào để lấy được đúng <b>1 l</b> nước từ bể?</p>
        <div class="cans">${caps.map((c,i)=>`<div class="can-col">${jugSVG(c,w[i])}<div class="lv">${w[i]} / ${c} l</div>
          <button class="btn" data-a="fill" data-i="${i}">🚰 Múc đầy</button><button class="btn ghost" data-a="empty" data-i="${i}">↩ Đổ lại bể</button><button class="btn go" data-a="pour" data-i="${i}">Rót sang can ${caps[1-i]} l ➜</button></div>`).join('')}</div>
        <div class="pz-foot"><span>Số bước: ${moves}</span><button class="btn ghost" id="rs">↻ Làm lại</button></div></div>`;
    };
    draw();
    ctx.say(pi===0?'Đố bạn! Hãy tiết kiệm nước nhé. Con thử múc, rót giữa hai can xem sao!':'Thử thách khó hơn: can 4 l và can 9 l. Làm sao lấy được 1 l?');
    await new Promise(res=>{
      st.onclick=e=>{
        if(!ctx.alive)return;
        const b=e.target.closest('button');if(!b)return;
        if(b.id==='rs'){w=[0,0];moves=0;draw();ctx.say('Làm lại từ đầu nhé!');return}
        const i=+b.dataset.i,j=1-i;
        if(b.dataset.a==='fill')w[i]=caps[i];
        else if(b.dataset.a==='empty')w[i]=0;
        else{const a=Math.min(w[i],caps[j]-w[j]);w[i]-=a;w[j]+=a}
        moves++;sfx.pour();draw();
        if(w.includes(1)){st.onclick=null;ctx.good('Lấy được 1 l rồi!');ctx.mistakes+=Math.floor(Math.max(0,moves-opt)/2);
          ctx.say(`Tuyệt vời! Con làm trong ${moves} bước.`+(pi===0?' Cách nhanh nhất: múc đầy can 3 l, rót sang can 5 l, múc đầy can 3 l lần nữa, rót sang can 5 l cho đầy — can 3 l còn đúng 1 l!':' Cách nhanh nhất: múc đầy can 9 l, rót sang can 4 l, đổ can 4 l lại bể, rót tiếp sang can 4 l — can 9 l còn 1 l!'));
          ctx.progress((pi+1)/P.length);setTimeout(res,3500);return}
        if(moves===6)ctx.say(pi===0?'Gợi ý: thử múc đầy can 3 l rồi rót sang can 5 l, làm hai lần xem!':'Gợi ý: múc đầy can 9 l, rồi rót sang can 4 l hai lần (nhớ đổ can 4 l đi ở giữa).');
      };
    });
    st.onclick=null;
    if(!ctx.alive)return;
  }
  ctx.finish();
})}

/* ================= HÌNH VẼ ================= */
const SC={red:['#FFB0A6','#E8484C','#B8323A'],yellow:['#FFEB9E','#F7C531','#C9920A'],blue:['#B5E1FF','#48AEE6','#2B7FB5'],green:['#C4F2B8','#5CC24D','#3C8F33'],purple:['#DCCFFF','#8A63E8','#6A45C6']};
function solidSVG(t,c='blue',s=40){
  const [l,m,d]=SC[c],k='stroke="#243A6B" stroke-width="2" stroke-linejoin="round"';let g='';
  if(t==='cube')g=`<polygon points="8,22 20,10 50,10 38,22" fill="${l}" ${k}/><rect x="8" y="22" width="30" height="30" fill="${m}" ${k}/><polygon points="38,22 50,10 50,40 38,52" fill="${d}" ${k}/>`;
  if(t==='box')g=`<polygon points="2,28 12,18 58,18 48,28" fill="${l}" ${k}/><rect x="2" y="28" width="46" height="22" fill="${m}" ${k}/><polygon points="48,28 58,18 58,40 48,50" fill="${d}" ${k}/>`;
  if(t==='cyl')g=`<path d="M12 14 V46 A18 7 0 0 0 48 46 V14" fill="${m}" ${k}/><ellipse cx="30" cy="14" rx="18" ry="7" fill="${l}" ${k}/>`;
  if(t==='sph')g=`<circle cx="30" cy="31" r="22" fill="${m}" ${k}/><ellipse cx="22" cy="23" rx="7" ry="5" fill="#fff" opacity=".6"/>`;
  return`<svg viewBox="0 0 60 60" width="${s}" height="${s}" aria-hidden="true">${g}</svg>`;
}
const SOLID_NAME={cube:'Khối lập phương',box:'Khối hộp chữ nhật',cyl:'Khối trụ',sph:'Khối cầu'};
const SOLID_KEY=Object.fromEntries(Object.entries(SOLID_NAME).map(([k,v])=>[v,k]));
function clockSVG(hh,mm,size=170){
  let s=`<svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true"><circle cx="100" cy="100" r="93" fill="#FF9F43" stroke="#243A6B" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="#fff"/>`;
  for(let i=0;i<60;i++){const a=i*6*Math.PI/180,r1=i%5?76:71;s+=`<line x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+80*Math.sin(a)}" y2="${100-80*Math.cos(a)}" stroke="#243A6B" stroke-width="${i%5?1:2.5}"/>`}
  for(let i=1;i<=12;i++){const a=i*30*Math.PI/180;s+=`<text x="${100+60*Math.sin(a)}" y="${100-60*Math.cos(a)+7}" text-anchor="middle" font-size="19" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${i}</text>`}
  const ha=((hh%12)+mm/60)*30,ma=mm*6;
  s+=`<line x1="100" y1="100" x2="100" y2="58" stroke="#243A6B" stroke-width="8" stroke-linecap="round" transform="rotate(${ha} 100 100)"/><line x1="100" y1="100" x2="100" y2="32" stroke="#E4572E" stroke-width="5" stroke-linecap="round" transform="rotate(${ma} 100 100)"/><circle cx="100" cy="100" r="7" fill="#243A6B"/></svg>`;
  return s;
}
function scaleSVG(kg,emoji,size=150){
  let s=`<svg viewBox="0 0 160 200" width="${size}" height="${size*1.25}" aria-hidden="true"><text x="80" y="52" text-anchor="middle" font-size="50">${emoji}</text><ellipse cx="80" cy="62" rx="58" ry="9" fill="#E5ECF8" stroke="#243A6B" stroke-width="3"/><rect x="72" y="66" width="16" height="10" fill="#243A6B"/><rect x="22" y="74" width="116" height="118" rx="20" fill="#46B85A" stroke="#243A6B" stroke-width="3"/><circle cx="80" cy="134" r="46" fill="#fff" stroke="#243A6B" stroke-width="3"/>`;
  for(let i=0;i<=10;i++){const a=(-150+i*30)*Math.PI/180;s+=`<line x1="${80+38*Math.sin(a)}" y1="${134-38*Math.cos(a)}" x2="${80+44*Math.sin(a)}" y2="${134-44*Math.cos(a)}" stroke="#243A6B" stroke-width="2"/><text x="${80+29*Math.sin(a)}" y="${134-29*Math.cos(a)+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${i}</text>`}
  s+=`<text x="80" y="122" text-anchor="middle" font-size="10" font-weight="800" fill="#5E7099">kg</text><line x1="80" y1="134" x2="80" y2="96" stroke="#E4572E" stroke-width="3.5" stroke-linecap="round" transform="rotate(${-150+kg*30} 80 134)"/><circle cx="80" cy="134" r="5" fill="#243A6B"/></svg>`;
  return s;
}
function canSVG(l,color='#D8CCFF',w=70){
  const H=40+l*3;
  return`<svg viewBox="0 0 70 ${H+14}" width="${w}" height="${(H+14)*w/70}" aria-hidden="true"><rect x="40" y="2" width="14" height="12" rx="3" fill="#fff" stroke="#243A6B" stroke-width="2.5"/><rect x="6" y="12" width="58" height="${H}" rx="10" fill="${color}" stroke="#243A6B" stroke-width="3"/><path d="M14 12 V4 H32 V12" fill="none" stroke="#243A6B" stroke-width="3"/><text x="35" y="${12+H/2+7}" text-anchor="middle" font-size="18" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${l} l</text></svg>`;
}
const FIG_TRI=`<svg viewBox="0 0 200 195" class="fig"><g stroke="#243A6B" stroke-width="3" fill="none" stroke-linejoin="round"><polygon points="100,18 20,170 180,170"/><line x1="20" y1="170" x2="140" y2="94"/><line x1="180" y1="170" x2="60" y2="94"/></g><g fill="#E4572E">${[[100,18],[20,170],[180,170],[60,94],[140,94],[100,118.7]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g><g font-size="18"><text x="100" y="12" text-anchor="middle">A</text><text x="12" y="190">B</text><text x="178" y="190">C</text><text x="38" y="92">N</text><text x="150" y="92">M</text><text x="100" y="143" text-anchor="middle">O</text></g></svg>`;
const FIG_QUAD=`<svg viewBox="0 0 200 175" class="fig"><polygon points="60,20 140,20 180,160 20,160" fill="#FFF3D6" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/><g stroke="#243A6B" stroke-width="3"><line x1="40" y1="90" x2="160" y2="90"/><line x1="100" y1="90" x2="100" y2="160"/></g></svg>`;
const FIG_TRI3=`<svg viewBox="0 0 200 175" class="fig"><polygon points="100,15 20,160 180,160" fill="#E4F6FF" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/><line x1="100" y1="15" x2="118" y2="160" stroke="#243A6B" stroke-width="3"/></svg>`;
function polySVG(lens,unit='cm',deco){
  const pts=lens.length===3?[[24,52],[88,92],[210,92],[306,34]]:[[20,104],[80,24],[140,104],[200,24],[260,104]];
  const names='ABCDE';
  let s=`<svg viewBox="0 0 ${lens.length===3?330:280} 128" class="fig wide"><polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach(([x,y],i)=>{s+=`<circle cx="${x}" cy="${y}" r="4.5" fill="#E4572E"/><text x="${x+(i===0?-14:i===pts.length-1?8:0)}" y="${y+(y>60?22:-8)}" text-anchor="middle" font-size="16">${names[i]}</text>`});
  lens.forEach((l,i)=>{const [x1,y1]=pts[i],[x2,y2]=pts[i+1];s+=`<text x="${(x1+x2)/2+(y1===y2?0:12*(y2<y1?1:-1))}" y="${(y1+y2)/2+(y1===y2?-8:-6)}" text-anchor="middle" font-size="14" fill="#E4572E">${l} ${unit}</text>`});
  if(deco)s+=`<text x="${pts[0][0]-8}" y="${pts[0][1]-12}" font-size="24">${deco[0]}</text><text x="${pts[pts.length-1][0]-6}" y="${pts[pts.length-1][1]-10}" font-size="26">${deco[1]}</text>`;
  return s+'</svg>';
}

/* ================= NỘI DUNG CÁC BÀI ================= */
const known=[2,3,4,5];
const L5_ICONS=['🛺','🐸','🐝','☕','🏎️','♟️'];
function tableNote(n){
  const tb=(title,rows)=>`<div class="ttable"><div class="tt-h">${title}</div>${rows.map(([l,v])=>`<div class="tr done"><span>${l}</span><span>=</span><span class="v">${v}</span></div>`).join('')}</div>`;
  return`<div class="note-grid">${tb('Bảng nhân '+n,tableRows(n,'×'))}${tb('Bảng chia '+n,tableRows(n,':'))}</div>
    <p style="margin:0 0 14px;font-weight:700;color:var(--ink-2)">Mẹo: thêm ${n} vào kết quả của ${n} × 2 ta được kết quả của ${n} × 3. Từ ${n} × 4 = ${n*4} ta có ${n*4} : ${n} = 4.</p>`;
}
const STICK='<i class="stick"></i>';

const LESSONS=[
/* ---------------- BÀI 5 ---------------- */
{id:5,title:'Bảng nhân 3, bảng chia 3',icon:'🛺',note:()=>tableNote(3),levels:[
  explore(3,{name:'Xích lô vui nhộn',icon:'🛺',head:'🛺',flip:true,scene:'road',thing:'xe',unit:'bánh xe',k0:4,q:'Mỗi xe xích lô có 3 bánh xe. Hỏi 4 xe xích lô có bao nhiêu bánh xe?'}),
  frog(3,{name:'Ếch con qua suối',icon:'🐸',hero:'🐸'}),
  bees({name:'Ong tìm hoa',icon:'🐝',center:': 3',petals:range(1,10),rounds:[
    ['3 : 3','27 : 3','12 : 3','24 : 3','21 : 3','18 : 3'],
    ()=>shuffle([6,9,15,30,...shuffle([12,18,21,24,27]).slice(0,2)]).map(d=>`${d} : 3`)]}),
  pairs({name:'Tách và đĩa',icon:'☕',theme:'cup',top:'tách',bottom:'đĩa',rounds:[
    {tops:['2 × 4','12 : 3','18 : 3','18 : 2','5 × 3'],bottoms:['3 × 2','3 × 5','24 : 3','20 : 5','3 × 3']},
    ()=>genPairs([2,3,5],3)]}),
  race({name:'Đua xe tốc độ',icon:'🏎️',gen:tableGen(3)}),
  words({name:'Giải toán có lời văn',icon:'♟️',n:3,extra:3,fixed:[
    {text:'Mỗi bàn đấu cờ vua có 3 người. Hỏi 6 bàn đấu cờ vua như vậy có bao nhiêu người?',vis:{type:'groups',n:6,per:3,item:['👦','👧','🧑'],head:'♟️'},
      ops:['3 × 6','6 : 3','6 + 3'],ans:18,unit:'người',lead:'Số người có là:',opHint:'6 bàn, mỗi bàn 3 người → 3 được lấy 6 lần.'},
    {text:'Chia đều 30 que tính thành 3 bó. Hỏi mỗi bó có bao nhiêu que tính?',vis:{type:'pile',total:30,item:STICK},after:{type:'groups',n:3,per:10,item:STICK},
      ops:['30 : 3','30 × 3','30 − 3'],ans:10,unit:'que tính',lead:'Số que tính ở mỗi bó là:',opHint:'Chia đều thành 3 bó → dùng phép chia cho 3.'},
    {text:'Mỗi xe xích lô có 3 bánh xe. Hỏi 4 xe xích lô có bao nhiêu bánh xe?',vis:{type:'groups',n:4,per:3,item:'⚫',head:'🛺'},
      ops:['3 × 4','3 + 4','4 − 3'],ans:12,unit:'bánh xe',lead:'Số bánh xe có là:',opHint:'4 xe, mỗi xe 3 bánh → 3 được lấy 4 lần.'},
  ]}),
]},
/* ---------------- BÀI 6 ---------------- */
{id:6,title:'Bảng nhân 4, bảng chia 4',icon:PINWHEEL,note:()=>tableNote(4),levels:[
  explore(4,{name:'Chong chóng quay',icon:PINWHEEL,head:PINWHEEL,scene:'field',thing:'chong chóng',unit:'cánh',k0:5,q:'Mỗi chong chóng có 4 cánh. Hỏi 5 chong chóng có bao nhiêu cánh?'}),
  divExplore(4,6,'🍬'),
  frog(4,{name:'Thỏ con qua suối',icon:'🐰',hero:'🐰'}),
  selectLv({name:'Toa tàu kì diệu',icon:'🚂',theme:'train',rounds:[
    {cond:'max',items:['8 : 4','16 : 4','40 : 4','24 : 4'],prompt:'Toa tàu nào ghi phép tính có kết quả lớn nhất?'},
    ()=>{const ks=shuffle(range(1,10)).slice(0,4);return{cond:'min',items:ks.map(k=>Math.random()<.5?`4 × ${k}`:`${4*k} : 4`),prompt:'Toa tàu nào ghi phép tính có kết quả bé nhất?'}},
    ()=>{const ks=shuffle(range(1,10)).slice(0,5);return{cond:'max',items:ks.map(k=>Math.random()<.5?`4 × ${k}`:`${4*k} : 4`),prompt:'Toa tàu nào ghi phép tính có kết quả lớn nhất?'}},
  ]}),
  chain({name:'Máy nhân chia thần kì',icon:'⚙️',chains:[
    {s:4,steps:[['×',5],[':',4]]},{s:4,steps:[['×',4],[':',4]]},{s:4,steps:[['×',6],[':',4]]},
    ()=>genChain(4,known,()=>['+',rnd(2,9)]),
  ]}),
  race({name:'Đua xe đạp',icon:'🚲',me:'🚲',rival:'🛵',gen:tableGen(4)}),
  words({name:'Giải toán có lời văn',icon:'🚗',n:4,fixed:[
    {text:'Mỗi ô tô con có 4 bánh xe. Hỏi 8 ô tô con như vậy có bao nhiêu bánh xe?',vis:{type:'groups',n:8,per:4,item:'⚫',head:'🚗'},
      ops:['4 × 8','8 + 4','8 − 4'],ans:32,unit:'bánh xe',lead:'Số bánh xe có là:',opHint:'8 ô tô, mỗi ô tô 4 bánh → 4 được lấy 8 lần.'},
    {text:'Có 24 chiếc bánh chia vào các hộp, mỗi hộp 4 chiếc bánh. Hỏi được bao nhiêu hộp bánh như vậy?',vis:{type:'pile',total:24,item:'🍪'},after:{type:'groups',n:6,per:4,item:'🍪',head:'📦'},
      ops:['24 : 4','24 − 4','24 × 4'],ans:6,unit:'hộp',lead:'Số hộp bánh có là:',opHint:'Mỗi hộp 4 chiếc → chia 24 cho 4.'},
  ]}),
]},
/* ---------------- BÀI 7 ---------------- */
{id:7,title:'Ôn tập hình học và đo lường',icon:'📐',note:()=>`<div style="text-align:left;font-weight:700;line-height:1.7;margin:12px 0">
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${Object.entries(SOLID_NAME).map(([k,v],i)=>`<div style="display:flex;align-items:center;gap:6px">${solidSVG(k,['red','yellow','blue','green'][i],36)}${v}</div>`).join('')}</div>
   <p>📏 1 m = 10 dm = 100 cm &nbsp;·&nbsp; 1 dm = 10 cm</p><p>⚖️ Cân nặng đo bằng ki-lô-gam (kg). Sức chứa đo bằng lít (l).</p><p>🕒 1 giờ = 60 phút. 15 giờ là 3 giờ chiều, 19 giờ là 7 giờ tối.</p><p>📅 Một tuần lễ có 7 ngày.</p><p>〰️ Độ dài đường gấp khúc = tổng độ dài các đoạn thẳng.</p></div>`,levels:[
  quiz('Khối hình quanh em','lt','🧊',()=>{
    const objs=shuffle([{e:'🎲',n:'Con xúc xắc',a:'cube'},{e:'🧊',n:'Viên đá lạnh',a:'cube'},{e:'📦',n:'Thùng các-tông',a:'box'},{e:'🧱',n:'Viên gạch',a:'box'},{e:'⚽',n:'Quả bóng',a:'sph'},{e:'🌍',n:'Quả địa cầu',a:'sph'},{e:'🥫',n:'Lon sữa',a:'cyl'},{e:'🥁',n:'Cái trống',a:'cyl'},{e:'🍊',n:'Quả cam',a:'sph'}]).slice(0,6);
    const qs=objs.map(o=>({html:`<div class="obj"><span class="obj-e">${o.e}</span><b>${o.n}</b></div><p class="q-t">${o.n} có dạng khối gì?</p>`,say:`${o.n} có dạng khối gì?`,
      choices:Object.values(SOLID_NAME),ans:SOLID_NAME[o.a],cls:'wide',label:v=>`${solidSVG(SOLID_KEY[v],'blue',34)}${v}`,hint:'Khối cầu tròn đều; khối trụ có hai mặt đáy tròn; khối lập phương có 6 mặt vuông bằng nhau.'}));
    for(let g=0;g<3;g++){
      const toks=shuffle(Object.keys(SOLID_NAME).flatMap(t=>['red','yellow','blue'].map(c=>`${t}-${c}`)));
      const per=g===0?2:3,unit=toks.slice(0,per),seq=Array.from({length:8},(_,i)=>unit[i%per]);
      const ans=seq[7],opts=shuffle([ans,...toks.filter(t=>t!==ans).slice(0,3)]);
      qs.push({html:`<p class="q-t">Chọn hình thích hợp đặt vào dấu “?”.</p><div class="pattern">${seq.slice(0,7).map(t=>solidSVG(...t.split('-'),42)).join('')}<span class="qm">?</span></div>`,say:'Tìm quy luật rồi chọn hình thích hợp đặt vào dấu hỏi.',
        choices:opts,ans,cls:'shape',label:v=>solidSVG(...v.split('-'),50),hint:'Các hình lặp lại theo một nhóm. Tìm nhóm đó nhé!'});
    }
    return qs;
  }),
  quiz('Thám tử hình học','lt','🔍',()=>{
    const lines=shuffle(['A, N, B','A, M, C','B, O, M','C, O, N']).slice(0,2),bad=['A, O, B','N, O, M','A, N, M','B, O, C','A, O, M','N, M, C'];
    const snail=[125,380,300],r=[rnd(12,48),rnd(12,48),rnd(12,48)],e=rnd(2,6);
    return [
      ...lines.map(l=>({html:`${FIG_TRI}<p class="q-t">Ba điểm nào dưới đây thẳng hàng?</p>`,say:'Ba điểm nào dưới đây thẳng hàng?',choices:shuffle([l,...shuffle(bad).slice(0,3)]),ans:l,cls:'small',hint:'Ba điểm thẳng hàng khi cùng nằm trên một đường thẳng.'})),
      {html:`${FIG_QUAD}<p class="q-t">Trong hình trên có bao nhiêu hình tứ giác?</p>`,choices:['3 hình','4 hình','5 hình','6 hình'],ans:'5 hình',cls:'small',hint:'Đếm cả hình nhỏ, hình ghép từ hai hình nhỏ và cả hình lớn nhất nhé!',explain:'Có 5 hình tứ giác: 1 hình phía trên, 2 hình nhỏ phía dưới, 1 hình ghép phía dưới và hình lớn nhất.'},
      {html:`${FIG_TRI3}<p class="q-t">Trong hình trên có bao nhiêu hình tam giác?</p>`,choices:['2 hình','3 hình','4 hình','5 hình'],ans:'3 hình',cls:'small',hint:'Hai hình tam giác nhỏ và một hình tam giác lớn ghép từ chúng.'},
      {html:`${polySVG(snail,'cm',['🐌','🌴'])}<p class="q-t">Con ốc sên bò theo đường gấp khúc ABCD. Quãng đường ốc sên phải bò dài <b class="box">?</b> cm</p>`,say:'Tính độ dài quãng đường ốc sên phải bò.',ans:805,hint:'125 + 380 + 300 = ?'},
      {html:`${polySVG(r)}<p class="q-t">Độ dài đường gấp khúc ABCD là <b class="box">?</b> cm</p>`,ans:r[0]+r[1]+r[2],hint:`${r[0]} + ${r[1]} + ${r[2]} = ?`},
      {html:`${polySVG([e,e,e,e])}<p class="q-t">Đường gấp khúc ABCDE gồm 4 đoạn thẳng, mỗi đoạn dài ${e} cm. Độ dài đường gấp khúc là <b class="box">?</b> cm</p>`,ans:4*e,hint:`${e} + ${e} + ${e} + ${e} = ${e} × 4 = ?`},
    ];
  }),
  quiz('Đồng hồ biết nói','lt','⏰',()=>{
    const fmt=(hh,mm)=>`${hh} giờ${mm?` ${mm} phút`:''}`;
    const qs=[{h:3,m:30},...shuffle(range(1,12)).slice(0,4).map(hh=>({h:hh,m:pick([0,15,30])}))].map(({h:hh,m:mm})=>{
      const ans=fmt(hh,mm),sw=fmt(mm===0?12:mm/5,(hh%12)*5||0),o=new Set([ans]);
      [sw,fmt(hh%12+1,mm),fmt(hh,mm===30?15:30),fmt(hh===1?12:hh-1,mm),fmt(hh,mm?0:15)].forEach(x=>{if(o.size<4)o.add(x)});
      return {html:`${clockSVG(hh,mm)}<p class="q-t">Đồng hồ chỉ mấy giờ?</p>`,say:'Đồng hồ chỉ mấy giờ? Kim ngắn chỉ giờ, kim dài chỉ phút.',choices:shuffle([...o]),ans,cls:'small',hint:'Kim ngắn (xanh) chỉ giờ, kim dài (đỏ) chỉ phút. Kim dài chỉ số 3 là 15 phút, số 6 là 30 phút.'};
    });
    const pad=x=>String(x).padStart(2,'0');
    shuffle([2,5,7,9,4,8]).slice(0,3).forEach(hh=>{
      const mm=pick([0,15,30]),ans=`${hh+12}:${pad(mm)}`,o=new Set([ans]);
      [`${pad(hh)}:${pad(mm)}`,`${hh+13}:${pad(mm)}`,`${hh+12}:${pad(mm===30?15:30)}`,`${hh+11}:${pad(mm)}`].forEach(x=>{if(o.size<4)o.add(x)});
      qs.push({html:`${clockSVG(hh,mm)}<p class="q-t">Vào buổi ${hh+12<18?'chiều':'tối'}, đồng hồ điện tử sẽ chỉ giờ nào?</p>`,say:`Vào buổi ${hh+12<18?'chiều':'tối'}, đồng hồ điện tử chỉ giờ nào?`,choices:shuffle([...o]),ans,cls:'digi-c',hint:`Buổi chiều, tối: lấy số giờ cộng thêm 12. ${hh} giờ ${hh+12<18?'chiều':'tối'} là ${hh+12} giờ.`});
    });
    return qs;
  }),
  quiz('Cân và can','lt','⚖️',()=>{
    const fr=shuffle([['🍍','Quả dứa'],['🍉','Quả dưa hấu'],['🎃','Quả bí ngô'],['🍈','Quả dưa lưới']]),a=rnd(5,9),b=rnd(2,a-1),x=rnd(2,8),y=rnd(5,15);
    return [
      {html:`${scaleSVG(a,fr[0][0])}<p class="q-t">${fr[0][1]} cân nặng <b class="box">?</b> kg</p>`,ans:a,hint:'Nhìn xem kim đỏ chỉ vào số nào trên mặt cân.'},
      {html:`${scaleSVG(b,fr[1][0])}<p class="q-t">${fr[1][1]} cân nặng <b class="box">?</b> kg</p>`,ans:b,hint:'Nhìn xem kim đỏ chỉ vào số nào trên mặt cân.'},
      {html:`<div class="row-fig">${scaleSVG(a,fr[0][0],110)}${scaleSVG(b,fr[1][0],110)}</div><p class="q-t">${fr[0][1]} nặng hơn ${fr[1][1].toLowerCase()} <b class="box">?</b> kg</p>`,ans:a-b,hint:`${a} − ${b} = ?`},
      {html:`<div class="row-fig">${canSVG(5,'#FFF',60)}${canSVG(15,'#D8CCFF',80)}</div><p class="q-t">Hai can chứa đầy dầu. Cả hai can có <b class="box">?</b> l dầu.</p>`,ans:20,hint:'5 + 15 = ?'},
      {html:`<div class="row-fig">${canSVG(x,'#BFE6FF',60)}${canSVG(y,'#FFE08A',74)}</div><p class="q-t">Hai can chứa đầy nước. Cả hai can có <b class="box">?</b> l nước.</p>`,ans:x+y,hint:`${x} + ${y} = ?`},
      {html:`<div class="row-fig">${canSVG(2,'#C4F2B8',50)}${canSVG(10,'#FFB0A6',80)}</div><p class="q-t">Dùng can 2 l để đổ đầy can 10 l thì cần đổ <b class="box">?</b> lần.</p>`,ans:5,hint:'2 × mấy = 10?'},
      {html:`<p class="q-t" style="font-size:26px">1 m = <b class="box">?</b> cm</p>`,say:'1 mét bằng bao nhiêu xăng-ti-mét?',ans:100,hint:'1 m = 10 dm, 1 dm = 10 cm.'},
    ];
  }),
  pourLv(),
  words({name:'Giải toán có lời văn',icon:'🌾',fixed:[
    {text:'Mỗi tuần gia đình cô Hoa ăn hết 5 kg gạo. Cô Hoa mua về 20 kg gạo. Hỏi gia đình cô Hoa ăn trong mấy tuần thì hết số gạo đó?',vis:{type:'pile',total:4,item:'🌾 5 kg'},
      ops:['20 : 5','20 − 5','20 × 5'],ans:4,unit:'tuần',lead:'Số tuần ăn hết gạo là:',opHint:'Mỗi tuần 5 kg → 20 kg chia thành các phần 5 kg.'},
    {direct:true,text:'Nếu ngày 4 tháng 10 là thứ Ba thì ngày 10 tháng 10 là thứ mấy?',
      vis:{type:'html',html:`<div class="cal">${range(4,10).map((d,i)=>`<div class="${i===0?'hl':i===6?'tg':''}"><b>${d}</b>${i===0?'Thứ Ba':'?'}</div>`).join('')}</div>`},
      after:{type:'html',html:`<div class="cal">${range(4,10).map((d,i)=>`<div class="${i===0?'hl':i===6?'tg':''}"><b>${d}</b>${['Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ nhật','Thứ Hai'][i]}</div>`).join('')}</div>`},
      options:['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư'],ans:'Thứ Hai',opHint:'Đếm tiếp từng ngày: 5 là thứ Tư, 6 là thứ Năm…',explain:'Ngày 11 tháng 10 cũng là thứ Ba (4 + 7 = 11), nên ngày 10 tháng 10 là <b>Thứ Hai</b>.'},
    {text:'Mai cao 128 cm. Nam cao hơn Mai 7 cm. Hỏi Nam cao bao nhiêu xăng-ti-mét?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">👧 🧒</div>'},
      ops:['128 + 7','128 − 7','128 : 7'],ans:135,unit:'cm',lead:'Chiều cao của Nam là:',opHint:'Cao hơn → dùng phép cộng.'},
    {text:'Một sợi dây dài 1 m. Bạn Việt cắt đi 35 cm. Hỏi sợi dây còn lại dài bao nhiêu xăng-ti-mét?',vis:{type:'html',html:'<p style="text-align:center;font-weight:800;margin:0">Nhớ: 1 m = 100 cm</p>'},
      ops:['100 − 35','100 + 35','35 − 1'],ans:65,unit:'cm',lead:'Sợi dây còn lại dài là:',opHint:'Đổi 1 m = 100 cm, rồi lấy 100 trừ đi phần đã cắt.'},
  ]}),
]},
/* ---------------- BÀI 8 ---------------- */
{id:8,title:'Luyện tập chung',icon:'🏁',note:()=>`<div style="text-align:left;font-weight:700;line-height:1.7;margin:12px 0">
   <p>1️⃣ Số nào nhân với 1 cũng bằng chính số đó: 5 × 1 = 5.</p><p>1️⃣ Số nào chia cho 1 cũng bằng chính số đó: 5 : 1 = 5.</p><p>0️⃣ Số 0 nhân với số nào cũng bằng 0: 0 × 7 = 0.</p><p>0️⃣ Số nào nhân với 0 cũng bằng 0: 7 × 0 = 0.</p><p>0️⃣ Số 0 chia cho số nào khác 0 cũng bằng 0: 0 : 7 = 0.</p><p>🧮 Muốn tìm số hạng: lấy tổng trừ đi số hạng kia. Muốn tìm số bị trừ: lấy hiệu cộng với số trừ. Muốn tìm số trừ: lấy số bị trừ trừ đi hiệu.</p></div>`,levels:[
  sortLv({name:'Xếp hàng cân nặng',icon:'🐻‍❄️',rounds:[
    [{e:'🐻‍❄️',n:'Gấu trắng',w:250},{e:'🐅',n:'Hổ',w:167},{e:'🐆',n:'Báo',w:86},{e:'🦁',n:'Sư tử',w:155}],
    ()=>shuffle([{e:'🐐',n:'Dê',w:45},{e:'🐖',n:'Lợn',w:120},{e:'🦌',n:'Hươu',w:180},{e:'🦓',n:'Ngựa vằn',w:320},{e:'🐄',n:'Bò',w:450},{e:'🐻',n:'Gấu nâu',w:305}]).slice(0,5),
  ]}),
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:[[64,'+',73],[326,'+',58],[132,'+',597],[157,'−',85],[965,'−',549],[828,'−',786]]}),
  pyramidLv({name:'Xây tháp số',icon:'🧱',base:[9,9,8,8,7,7],given:[[1,0],[1,1],[1,2],[2,0]]}),
  quiz('Tìm số còn thiếu','lt','🔎',()=>{
    const n=rnd(2,9)*100+rnd(1,9)*10+rnd(1,9),hd=Math.floor(n/100)*100,tn=Math.floor(n%100/10)*10,un=n%10;
    return [
      {html:`<p class="qbig">${qfmt('4 × ? = 8')}</p>`,ans:2,hint:'Muốn tìm thừa số, lấy tích chia cho thừa số kia: 8 : 4.'},
      {html:`<p class="qbig">${qfmt('12 : ? = 3')}</p>`,ans:4,hint:'Nghĩ: 3 × mấy = 12?'},
      {html:`<p class="qbig">${qfmt('3 × ? = 18')}</p>`,ans:6,hint:'Muốn tìm thừa số, lấy tích chia cho thừa số kia: 18 : 3.'},
      {html:`<p class="qbig">${qfmt('25 : ? = 5')}</p>`,ans:5,hint:'Nghĩ: 5 × mấy = 25?'},
      {html:`<p class="qbig">${qfmt('46 + ? = 75')}</p>`,ans:29,hint:'Muốn tìm số hạng, lấy tổng trừ đi số hạng kia: 75 − 46.'},
      {html:`<p class="qbig">${qfmt('? + 18 = 52')}</p>`,ans:34,hint:'Muốn tìm số hạng, lấy tổng trừ đi số hạng kia: 52 − 18.'},
      {html:`<p class="qbig">${qfmt('81 − ? = 34')}</p>`,ans:47,hint:'Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu: 81 − 34.'},
      {html:`<p class="qbig">${qfmt('? − 23 = 49')}</p>`,ans:72,hint:'Muốn tìm số bị trừ, lấy hiệu cộng với số trừ: 49 + 23.'},
      {html:`<p class="q-t">Viết số thành tổng các trăm, chục và đơn vị:</p><p class="qbig" style="font-size:30px">${qfmt(`${n} = ${hd} + ? + ${un}`)}</p>`,ans:tn,hint:`Chữ số hàng chục của ${n} là ${tn/10}.`},
    ];
  }),
  pairs({name:'Trực thăng hạ cánh',icon:'🚁',theme:'heli',top:'trực thăng',bottom:'bãi đáp',rounds:[
    {tops:['0 × 6','15 : 3','3 × 4','14 : 2'],bottoms:['28 : 4','5 × 0','25 : 5','2 × 6']},
    ()=>genPairs([2,3,4,5],4,4)]}),
  chain({name:'Ốc sên về nhà',icon:'🐌',hero:'🐌',goal:'🏡',chains:[
    {s:2,steps:[['×',6],[':',3],['×',0]]},
    ()=>{const c=genChain(pick([2,3,4,5]),known);c.steps.push(['×',pick([0,1])]);return c},
    ()=>{const c=genChain(pick([2,3,4,5]),known);c.steps.push([':',1]);return c},
  ]}),
  race({name:'Đường đua số 0 và 1',icon:'🏁',gen:zeroOneGen,intro:'Nhớ nhé: số nào nhân hoặc chia cho 1 cũng bằng chính số đó. Số 0 nhân với số nào, hay số nào nhân với 0 cũng bằng 0!'}),
  words({name:'Giải toán có lời văn',icon:'🏫',fixed:[
    {text:'Trường Tiểu học Quang Trung có 563 học sinh, Trường Tiểu học Lê Lợi có nhiều hơn Trường Tiểu học Quang Trung 29 học sinh. Hỏi Trường Tiểu học Lê Lợi có bao nhiêu học sinh?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">🏫 🏫</div>'},
      ops:['563 + 29','563 − 29','29 + 29'],ans:592,unit:'học sinh',lead:'Số học sinh Trường Lê Lợi có là:',opHint:'Nhiều hơn → dùng phép cộng.'},
    {text:'Tổ Một có 8 bạn, mỗi bạn góp 5 quyển vở để giúp đỡ các bạn vùng bị lũ lụt. Hỏi Tổ Một góp được bao nhiêu quyển vở?',vis:{type:'groups',n:8,per:5,item:'📘',head:'🧒'},
      ops:['5 × 8','8 + 5','8 − 5'],ans:40,unit:'quyển vở',lead:'Số quyển vở Tổ Một góp được là:',opHint:'8 bạn, mỗi bạn 5 quyển → 5 được lấy 8 lần.'},
    {text:'Đường gấp khúc ABCDE gồm 4 đoạn thẳng, mỗi đoạn dài 3 cm. Tính độ dài đường gấp khúc ABCDE.',vis:{type:'html',html:polySVG([3,3,3,3])},
      ops:['3 × 4','3 + 4','4 − 3'],ans:12,unit:'cm',lead:'Độ dài đường gấp khúc ABCDE là:',opHint:'4 đoạn bằng nhau, mỗi đoạn 3 cm → 3 được lấy 4 lần.'},
    {text:'Gấu trắng Bắc Cực nặng 250 kg, hổ nặng 167 kg. Hỏi gấu trắng nặng hơn hổ bao nhiêu ki-lô-gam?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🐻‍❄️ 🐅</div>'},
      ops:['250 − 167','250 + 167','167 − 25'],ans:83,unit:'kg',lead:'Gấu trắng nặng hơn hổ là:',opHint:'Nặng hơn bao nhiêu → lấy số lớn trừ số bé.'},
  ]}),
]},
/* ---------------- BÀI 9 ---------------- */
{id:9,title:'Bảng nhân 6, bảng chia 6',icon:'🐞',note:()=>tableNote(6),levels:[
  explore(6,{name:'Bọ rùa đốm',icon:'🐞',head:'🐞',scene:'garden',thing:'con bọ rùa',unit:'chấm',k0:4,q:'Mỗi con bọ rùa có 6 chấm ở cánh. Hỏi 4 con bọ rùa như vậy có bao nhiêu chấm ở cánh?'}),
  divExplore(6,4,'🧩'),
  frog(6,{name:'Vịt con qua suối',icon:'🦆',hero:'🦆'}),
  pairs({name:'Xe tải về bến',icon:'🚚',theme:'truck',top:'xe tải',bottom:'bến đỗ',rounds:[
    {tops:['6 × 1','6 × 3','12 : 6','48 : 6','6 × 5'],bottoms:['2 × 9','4 × 2','36 : 6','5 × 6','6 : 3']},
    ()=>genPairs([2,3,4,5,6],6)]}),
  chain({name:'Bướm bay qua hoa',icon:'🦋',hero:'🦋',goal:'🌸',chains:[
    {s:6,steps:[['×',4],[':',3],[':',2]]},
    ()=>genChain(6,[2,3,4,5],()=>['+',rnd(2,9)]),
    ()=>genChain(6,[2,3,4,5]),
  ]}),
  race({name:'Đua thuyền',icon:'🚤',me:'🚤',rival:'⛵',gen:tableGen(6)}),
  words({name:'Giải toán có lời văn',icon:'✏️',n:6,fixed:[
    {text:'Mỗi hộp có 6 chiếc bút chì màu. Hỏi 4 hộp như vậy có bao nhiêu chiếc bút chì màu?',vis:{type:'groups',n:4,per:6,item:'✏️',head:'📦'},
      ops:['6 × 4','6 + 4','6 − 4'],ans:24,unit:'chiếc',lead:'Số bút chì màu ở 4 hộp là:',opHint:'4 hộp, mỗi hộp 6 chiếc → 6 được lấy 4 lần.'},
    {text:'Một thanh gỗ dài 60 cm được cưa thành 6 đoạn bằng nhau. Hỏi mỗi đoạn gỗ dài bao nhiêu xăng-ti-mét?',vis:{type:'html',html:'<div class="wood"><span>60 cm</span></div>'},after:{type:'html',html:`<div class="wood">${'<span>10 cm</span>'.repeat(6)}</div>`},
      ops:['60 : 6','60 − 6','60 × 6'],ans:10,unit:'cm',lead:'Mỗi đoạn gỗ dài là:',opHint:'Cưa thành 6 đoạn bằng nhau → chia 60 cho 6.'},
  ]}),
]},
/* ---------------- BÀI 10 ---------------- */
{id:10,title:'Bảng nhân 7, bảng chia 7',icon:'🪢',note:()=>tableNote(7),levels:[
  explore(7,{name:'Đội kéo co',icon:'🪢',head:'🚩',dot:'🧒',scene:'field',thing:'đội',unit:'bạn',k0:2,q:'Mỗi đội chơi kéo co có 7 bạn. Hỏi 2 đội kéo co có bao nhiêu bạn?'}),
  divExplore(7,2,'🎯'),
  selectLv({name:'Hái bóng bay',icon:'🎈',rounds:[
    {cond:'lt',val:28,items:['7 × 3','56 : 7','35 : 7','7 × 6','7 × 4','49 : 7','7 × 9','21 : 7'],prompt:'Rô-bốt lấy các quả bóng ghi phép tính có kết quả <b>bé hơn 28</b>. Con giúp Rô-bốt nhé!'},
    ()=>{const ks=shuffle(range(1,10)).slice(0,7);return{cond:'gt',val:35,items:ks.map(k=>Math.random()<.6?`7 × ${k}`:`${7*k} : 7`),prompt:'Hái những quả bóng ghi phép tính có kết quả <b>lớn hơn 35</b>.'}},
  ]}),
  frog(7,{name:'Rùa con qua suối',icon:'🐢',hero:'🐢'}),
  compareLv({name:'Cân đĩa so sánh',icon:'⚖️',pairs:[
    [['7 × 5','7 × 4'],['7 × 2','2 × 7'],['7 × 8','7 × 9'],['42 : 7','42 : 6'],['21 : 7','6 : 2'],['56 : 7','49 : 7']],
    ()=>Array.from({length:3},()=>{const a=rnd(2,9),b=rnd(2,9);return[`7 × ${a}`,Math.random()<.5?`${a} × 7`:`7 × ${b}`]}),
  ]}),
  race({name:'Đua ngựa',icon:'🏇',me:'🏇',rival:'🐎',gen:tableGen(7)}),
  words({name:'Giải toán có lời văn',icon:'📅',n:7,fixed:[
    {text:'Mỗi tuần lễ có 7 ngày. Bố của Mai đi công tác 4 tuần lễ. Hỏi bố của Mai đi công tác bao nhiêu ngày?',vis:{type:'groups',n:4,per:7,item:'☀️',head:'🗓️'},
      ops:['7 × 4','7 + 4','7 − 4'],ans:28,unit:'ngày',lead:'Số ngày bố Mai đi công tác là:',opHint:'4 tuần, mỗi tuần 7 ngày → 7 được lấy 4 lần.'},
    {text:'Có 42 cái cốc xếp đều vào 7 hộp. Hỏi mỗi hộp có mấy cái cốc?',vis:{type:'pile',total:42,item:'🥛'},after:{type:'groups',n:7,per:6,item:'🥛',head:'📦'},
      ops:['42 : 7','42 − 7','42 × 7'],ans:6,unit:'cái cốc',lead:'Số cốc ở mỗi hộp là:',opHint:'Xếp đều vào 7 hộp → chia 42 cho 7.'},
  ]}),
]},
/* ---------------- BÀI 11 ---------------- */
{id:11,title:'Bảng nhân 8, bảng chia 8',icon:'🐙',note:()=>tableNote(8),levels:[
  explore(8,{name:'Bạch tuộc tí hon',icon:'🐙',head:'🐙',scene:'sea',thing:'con bạch tuộc',unit:'xúc tu',k0:2,q:'Mỗi con bạch tuộc có 8 xúc tu. Hỏi 2 con bạch tuộc có bao nhiêu xúc tu?'}),
  divExplore(8,2,'🍩'),
  frog(8,{name:'Chim cánh cụt qua suối',icon:'🐧',hero:'🐧'}),
  bees({name:'Ong tìm hoa',icon:'🌼',center:'8',rounds:[
    ['64 : 8','8 × 2','40 : 8','8 × 5','8 × 7'],
    ()=>shuffle(range(1,10)).slice(0,6).map(k=>Math.random()<.5?`8 × ${k}`:`${8*k} : 8`)]}),
  chain({name:'Máy biến hình',icon:'🤖',chains:[
    {s:8,steps:[['×',3],['+',16]]},
    ()=>genChain(8,[2,4]),
    ()=>{const k=rnd(2,9);return{s:8,steps:[['×',k],['−',rnd(2,9)]]}},
  ]}),
  race({name:'Đua tên lửa',icon:'🚀',me:'🚀',rival:'🛸',meT:'rotate(45deg)',rivalT:'none',gen:tableGen(8)}),
  words({name:'Giải toán có lời văn',icon:'🦀',n:8,fixed:[
    {text:'Mỗi con cua có 8 cái chân và 2 cái càng. Hỏi 3 con cua có bao nhiêu cái chân?',vis:{type:'groups',n:3,per:8,item:'•',head:'🦀'},
      ops:['8 × 3','8 + 3','8 − 3'],ans:24,unit:'cái chân',lead:'Số chân của 3 con cua là:',opHint:'3 con, mỗi con 8 chân → 8 được lấy 3 lần.'},
    {text:'Mỗi con cua có 2 cái càng. Hỏi 6 con cua có bao nhiêu cái càng?',vis:{type:'groups',n:6,per:2,item:'✂️',head:'🦀'},
      ops:['2 × 6','2 + 6','6 − 2'],ans:12,unit:'cái càng',lead:'Số càng của 6 con cua là:',opHint:'6 con, mỗi con 2 càng → 2 được lấy 6 lần.'},
    {text:'Mỗi hộp có 8 chiếc bút chì màu. Hỏi 5 hộp như vậy có bao nhiêu chiếc bút chì màu?',vis:{type:'groups',n:5,per:8,item:'✏️',head:'📦'},
      ops:['8 × 5','8 + 5','8 − 5'],ans:40,unit:'chiếc',lead:'Số bút chì màu ở 5 hộp là:',opHint:'5 hộp, mỗi hộp 8 chiếc → 8 được lấy 5 lần.'},
  ]}),
]},
/* ---------------- BÀI 12 ---------------- */
{id:12,title:'Bảng nhân 9, bảng chia 9',icon:'🐉',note:()=>tableNote(9),levels:[
  explore(9,{name:'Đội múa rồng',icon:'🐉',head:'🐉',scene:'fest',thing:'đội',unit:'người',k0:2,q:'Mỗi đội múa rồng có 9 người. Hỏi 2 đội múa rồng có bao nhiêu người?'}),
  divExplore(9,2,'🏮'),
  frog(9,{name:'Chuột túi qua suối',icon:'🦘',hero:'🦘'}),
  pairs({name:'Dưa hấu vào rổ',icon:'🍉',theme:'melon',top:'quả dưa',bottom:'chiếc rổ',rounds:[
    {tops:['9 × 2','45 : 9','9 × 1','54 : 9'],bottoms:['20 : 4','2 × 3','3 × 6','18 : 2']},
    ()=>genPairs([2,3,4,5,6,9],9,4)]}),
  selectLv({name:'Bình hoa hướng dương',icon:'🌻',theme:'flower',rounds:[
    {cond:'gt',val:10,items:['54 : 9','45 : 9','9 × 5','9 × 2','90 : 9'],prompt:'Những bông hoa nào ghi phép tính có kết quả <b>lớn hơn 10</b>?'},
    {cond:'lt',val:10,items:['54 : 9','45 : 9','9 × 5','9 × 2','90 : 9'],prompt:'Những bông hoa nào ghi phép tính có kết quả <b>bé hơn 10</b>?'},
    ()=>{const ks=shuffle(range(1,10)).slice(0,6);return{cond:'gt',val:40,items:ks.map(k=>Math.random()<.6?`9 × ${k}`:`${9*k} : 9`),prompt:'Những bông hoa nào có kết quả <b>lớn hơn 40</b>?'}},
  ]}),
  chain({name:'Tàu vũ trụ',icon:'🛸',hero:'🛸',goal:'🪐',chains:[
    {s:9,steps:[['×',2],[':',3]]},
    ()=>genChain(9,[2,3,4,5,6]),
    ()=>genChain(9,[2,3,4,5,6],()=>['+',rnd(2,9)]),
  ]}),
  race({name:'Về đích thần tốc',icon:'🚴',me:'🚴',rival:'🏃',gen:tableGen(9)}),
  words({name:'Giải toán có lời văn',icon:'🚣',n:9,fixed:[
    {text:'Chia đều 45 l nước mắm vào 9 cái can. Hỏi mỗi can có bao nhiêu lít nước mắm?',vis:{type:'pile',total:9,item:'🛢️'},
      ops:['45 : 9','45 − 9','45 × 9'],ans:5,unit:'l',lead:'Số lít nước mắm ở mỗi can là:',opHint:'Chia đều vào 9 can → chia 45 cho 9.'},
    {text:'Trên mỗi thuyền có 9 người. Hỏi trên 5 thuyền như vậy có bao nhiêu người?',vis:{type:'groups',n:5,per:9,item:'🧑',head:'🚣'},
      ops:['9 × 5','9 + 5','9 − 5'],ans:45,unit:'người',lead:'Số người trên 5 thuyền là:',opHint:'5 thuyền, mỗi thuyền 9 người → 9 được lấy 5 lần.'},
  ]}),
]},
];

/* chuyển hình dán kiểu cũ (lưu theo biểu tượng) sang kiểu mới (lưu theo màn chơi) */
S.stickers=S.stickers.map(s=>{const i=L5_ICONS.indexOf(s);return i>=0?`b5-${i}`:s});save();

/* ---------- settings & notes ---------- */
function openSettings(){
  const row=(id,label,sub,on)=>`<div class="set-row"><div>${label}<small>${sub}</small></div><button class="tog" id="${id}" aria-pressed="${on}" aria-label="${label}"></button></div>`;
  openModal(`<h2>Cài đặt</h2>
    ${row('tSound','Âm thanh','Tiếng “ting” khi trả lời',S.sound)}
    ${row('tRead','Tự đọc câu hỏi','Dùng giọng đọc tiếng Việt của máy (nếu có)',S.autoRead)}
    ${row('tUnlock','Mở khoá mọi màn','Dành cho phụ huynh xem trước',S.unlockAll)}
    <div class="mbtns" style="margin-top:16px"><button class="btn go" id="sClose">Xong</button><button class="btn ghost" id="sReset">Xoá toàn bộ tiến độ</button></div>`);
  const bind=(id,k)=>{$('#'+id).onclick=e=>{S[k]=!S[k];e.currentTarget.setAttribute('aria-pressed',S[k]);save();sfx.pop()}};
  bind('tSound','sound');bind('tRead','autoRead');bind('tUnlock','unlockAll');
  $('#sClose').onclick=()=>{closeModal();renderHome()};
  $('#sReset').onclick=()=>{if(confirm('Xoá hết sao, xu và hình dán?')){S.stars={};S.coins=0;S.stickers=[];save();closeModal();renderHome()}};
}
function openNotes(){
  openModal(`<h2>Sổ tay Bài ${curLesson.id}</h2>${curLesson.note()}<button class="btn go" id="nClose">Đóng</button>`);
  $('#nClose').onclick=closeModal;
}

/* ---------- wiring ---------- */
$('#btnSettings').onclick=openSettings;
$('#btnNote').onclick=openNotes;
$('#lessonBack').onclick=()=>{show('home');renderHome()};
$('#playBack').onclick=exitLevel;
wirePet();
$('#btnRead').onclick=()=>speak($('#bubble').textContent);
if('speechSynthesis' in window)speechSynthesis.getVoices();
renderHome();
