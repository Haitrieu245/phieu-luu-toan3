/* ================= THÚ CƯNG =================
   Học xong mỗi màn → nhận thức ăn + nước uống. Học xong trọn một bài → nhận một bộ trang phục.
   Thú cưng chỉ cần cho ăn, cho uống; lớn lên theo tổng số sao học tập (6 sao = 1 cấp).
   No bụng / khát nước giảm dần theo thời gian thật nhưng thú cưng không bao giờ chết hay bỏ đi. */

const PET_TYPES={
  cat:{n:'Mèo',def:'Mimi',fav:'fish'},
  dog:{n:'Chó',def:'Lu Lu',fav:'bone'},
  duck:{n:'Vịt',def:'Vàng Anh',fav:'grain'},
};
const FOOD={fish:{e:'🐟',n:'Cá'},bone:{e:'🦴',n:'Xương'},grain:{e:'🌾',n:'Thóc'},melon:{e:'🍉',n:'Dưa hấu'},cake:{e:'🍰',n:'Bánh kem'},egg:{e:'🍳',n:'Trứng'}};
const DRINK={water:{e:'💧',n:'Nước'},milk:{e:'🥛',n:'Sữa'},juice:{e:'🧃',n:'Nước ép'}};
// Mỗi bài học hoàn thành trọn vẹn được tặng một bộ, theo thứ tự này
const OUTFITS=[
  {id:'bow',e:'🎀',n:'Nơ xinh',slot:'hat'},{id:'cap',e:'🧢',n:'Mũ lưỡi trai',slot:'hat'},{id:'nerd',e:'👓',n:'Kính cận',slot:'glasses'},
  {id:'scarf',e:'🧣',n:'Khăn quàng',slot:'neck'},{id:'sunhat',e:'👒',n:'Mũ rộng vành',slot:'hat'},{id:'shades',e:'🕶️',n:'Kính râm',slot:'glasses'},
  {id:'tophat',e:'🎩',n:'Mũ ảo thuật',slot:'hat'},{id:'crown',e:'👑',n:'Vương miện',slot:'hat'},
];
const OUTFIT=Object.fromEntries(OUTFITS.map(o=>[o.id,o]));
const PET_RATE={hunger:4,thirst:5};   // điểm giảm mỗi giờ
const STARS_PER_LEVEL=6;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=v=>Math.max(0,Math.min(100,v));

/* S.pet = {type,name,hunger,thirst,last} hoặc null; S.bag = {food:{},drink:{},outfits:[],wear:{},given:[]} */
function BAG(){if(!S.bag)S.bag={food:{},drink:{},outfits:[],wear:{},given:[]};return S.bag}
const curPet=()=>S.pet&&S.pet.type?S.pet:null;
const petLevel=()=>Math.floor(totalStars()/STARS_PER_LEVEL)+1;
function petTick(p){
  const now=Date.now(),hrs=Math.min(36,Math.max(0,(now-(p.last||now))/36e5));
  for(const k in PET_RATE)p[k]=clamp(p[k]-PET_RATE[k]*hrs);
  p.last=now;
}
function petMood(p){return Math.min(p.hunger,p.thirst)<30?'sad':Math.min(p.hunger,p.thirst)>60?'happy':'normal'}
function petNeed(p){
  const n=esc(p.name);
  if(p.hunger<40&&p.hunger<=p.thirst)return`${n} đói bụng rồi 🍽️`;
  if(p.thirst<40)return`${n} khát nước rồi 💧`;
  return`${n} đang rất vui 💕`;
}
const bagCount=o=>Object.values(o).reduce((a,b)=>a+b,0);

/* ---------- vẽ thú cưng (SVG) ---------- */
function petSVG(type,look={}){
  const ink='#243A6B',k=`stroke="${ink}" stroke-width="3" stroke-linejoin="round"`,mood=look.mood||'normal';
  const [ex1,ey,ex2]={cat:[80,92,120],dog:[80,90,120],duck:[84,78,116]}[type];
  const eye=x=>{
    if(mood==='happy')return`<path d="M${x-10} ${ey+3} Q${x} ${ey-10} ${x+10} ${ey+3}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
    const r=type==='duck'?9:11;
    return`<g class="p-eye"><ellipse cx="${x}" cy="${ey}" rx="${r}" ry="${r+2}" fill="#fff" ${k}/><circle cx="${x+1}" cy="${ey+(mood==='sad'?4:2)}" r="${r*.6}" fill="${ink}"/><circle cx="${x+3}" cy="${ey-1}" r="2.2" fill="#fff"/></g>`;
  };
  const brows=mood==='sad'?`<path d="M${ex1-10} ${ey-18} L${ex1+8} ${ey-13}M${ex2+10} ${ey-18} L${ex2-8} ${ey-13}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M${ex2+8} ${ey+12} q4 8 0 11 q-4 -3 0 -11z" fill="#8FD9FF"/>`:'';
  const cheeks=mood==='happy'||mood==='eat'?`<ellipse cx="${ex1-8}" cy="${ey+18}" rx="9" ry="5" fill="#FF8FA3" opacity=".6"/><ellipse cx="${ex2+8}" cy="${ey+18}" rx="9" ry="5" fill="#FF8FA3" opacity=".6"/>`:'';
  const my={cat:112,dog:122,duck:0}[type];
  let mouth='',body='';
  if(type!=='duck'){
    if(mood==='eat')mouth=`<ellipse class="chomp" cx="100" cy="${my+5}" rx="9" ry="8" fill="#B8323A" ${k}/>`;
    else if(mood==='happy')mouth=`<path d="M88 ${my} Q100 ${my+20} 112 ${my} Z" fill="#E4572E" ${k}/><path d="M94 ${my+9} Q100 ${my+14} 106 ${my+9}" fill="#FF9FB0"/>`;
    else if(mood==='sad')mouth=`<path d="M90 ${my+8} Q100 ${my} 110 ${my+8}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    else mouth=`<path d="M91 ${my} Q95.5 ${my+6} 100 ${my} Q104.5 ${my+6} 109 ${my}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  }
  if(type==='cat'){
    const c='#FFB347',d='#E0892B';
    body=`<path class="p-tail" d="M148 168 Q192 150 176 104" fill="none" stroke="${ink}" stroke-width="18" stroke-linecap="round"/><path class="p-tail" d="M148 168 Q192 150 176 104" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
      <ellipse cx="100" cy="160" rx="56" ry="38" fill="${c}" ${k}/><ellipse cx="100" cy="166" rx="30" ry="24" fill="#FFE7C7"/>
      <ellipse cx="74" cy="194" rx="16" ry="9" fill="${c}" ${k}/><ellipse cx="126" cy="194" rx="16" ry="9" fill="${c}" ${k}/>
      <polygon points="46,70 54,22 88,50" fill="${c}" ${k}/><polygon points="154,70 146,22 112,50" fill="${c}" ${k}/><polygon points="56,58 58,36 76,50" fill="#FF9FB0"/><polygon points="144,58 142,36 124,50" fill="#FF9FB0"/>
      <ellipse cx="100" cy="94" rx="58" ry="50" fill="${c}" ${k}/>
      <path d="M92 50 l3 14 M100 48 v15 M108 50 l-3 14" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
      <path d="M96 104 h8 l-4 5z" fill="#FF6F8E" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M52 104 h22 M52 112 l22 -3 M148 104 h-22 M148 112 l-22 -3" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
  }else if(type==='dog'){
    const c='#E0B07A',d='#8A5A2B';
    body=`<path class="p-tail" d="M150 162 Q186 150 182 118" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/><path class="p-tail" d="M150 162 Q186 150 182 118" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="100" cy="160" rx="56" ry="38" fill="${c}" ${k}/><ellipse cx="100" cy="166" rx="30" ry="24" fill="#FFF1DC"/>
      <ellipse cx="74" cy="194" rx="16" ry="9" fill="${c}" ${k}/><ellipse cx="126" cy="194" rx="16" ry="9" fill="${c}" ${k}/>
      <ellipse cx="100" cy="92" rx="56" ry="52" fill="${c}" ${k}/><ellipse cx="122" cy="86" rx="20" ry="18" fill="#C98E55"/>
      <ellipse cx="48" cy="94" rx="15" ry="34" fill="${d}" ${k} transform="rotate(14 48 94)"/><ellipse cx="152" cy="94" rx="15" ry="34" fill="${d}" ${k} transform="rotate(-14 152 94)"/>
      <ellipse cx="100" cy="116" rx="28" ry="19" fill="#FFF1DC" ${k}/><ellipse cx="100" cy="106" rx="10" ry="7" fill="${ink}"/>`;
    if(mood==='happy')mouth+=`<path d="M96 128 q4 14 8 0z" fill="#FF6F8E" stroke="${ink}" stroke-width="2"/>`;
  }else{
    const c='#FFD54F';
    body=`<polygon points="150,140 182,126 166,160" fill="${c}" ${k}/>
      <ellipse cx="100" cy="152" rx="60" ry="44" fill="${c}" ${k}/><ellipse class="p-wing" cx="134" cy="150" rx="24" ry="16" fill="#FFC107" ${k} transform="rotate(-20 134 150)"/>
      <path d="M72 190 l-12 8 h26z M128 190 l-12 8 h26z" fill="#FF9F1A" ${k}/>
      <circle cx="100" cy="80" r="46" fill="${c}" ${k}/><path d="M96 36 q-6 -14 6 -16 q-4 8 4 14" fill="${c}" ${k}/>`;
    mouth=`<ellipse cx="100" cy="100" rx="24" ry="9" fill="#FF9F1A" ${k}/>`+(mood==='eat'?`<ellipse class="chomp" cx="100" cy="110" rx="18" ry="7" fill="#E4572E" ${k}/>`:mood==='sad'?`<path d="M86 106 q14 -6 28 0" fill="none" stroke="${ink}" stroke-width="2.5"/>`:'');
  }
  const w=look.wear||{},hy={cat:48,dog:46,duck:40}[type];
  const hat=w.hat&&OUTFIT[w.hat]?`<text x="100" y="${hy}" text-anchor="middle" font-size="46">${OUTFIT[w.hat].e}</text>`:'';
  const gl=w.glasses&&OUTFIT[w.glasses]?`<text x="100" y="${ey+17}" text-anchor="middle" font-size="${type==='duck'?50:60}">${OUTFIT[w.glasses].e}</text>`:'';
  const nk=w.neck&&OUTFIT[w.neck]?`<text x="100" y="${type==='duck'?146:156}" text-anchor="middle" font-size="44">${OUTFIT[w.neck].e}</text>`:'';
  return`<svg class="pet-svg m-${mood}" viewBox="0 0 200 206" aria-hidden="true">${body}${nk}${cheeks}${eye(ex1)}${eye(ex2)}${brows}${mouth}${gl}${hat}</svg>`;
}
const petLook=(p,mood)=>({mood:mood||petMood(p),wear:BAG().wear});

/* ---------- âm thanh & lời nói ---------- */
const PET_SND={
  cat(){tone(760,.18,'sine',.15,0,960);tone(900,.38,'sine',.15,.17,520)},
  dog(){tone(330,.12,'square',.07,0,210);tone(310,.14,'square',.07,.22,190)},
  duck(){tone(520,.13,'sawtooth',.06,0,360);tone(520,.13,'sawtooth',.06,.2,360)},
};
const PET_LINES=['Hi hi, nhột quá!','Con học bài chưa?','Mình thương con nhất!','Học xong một màn là có quà cho mình đó!','Con học giỏi thì mình lớn nhanh lắm!','3 × 4 = 12, mình nhớ nè!'];
let petSayT=0;
function petSay(text){
  const b=$('#petSay');if(!b)return;
  b.innerHTML=text;b.hidden=false;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');
  clearTimeout(petSayT);petSayT=setTimeout(()=>b.hidden=true,3500);
  if(S.autoRead)speak(text,1.7);
}
function petFloat(emoji,n=3){
  const st=$('#petStage');if(!st)return;
  for(let i=0;i<n;i++){const f=h(`<span class="p-float" style="left:${35+Math.random()*30}%;animation-delay:${i*.15}s">${emoji}</span>`);st.appendChild(f);setTimeout(()=>f.remove(),1800)}
}

/* ---------- phần thưởng sau mỗi màn học ---------- */
// Gọi từ finishLevel SAU khi đã cộng sao. Trả về HTML các phần thưởng để hiện trong bảng kết quả.
function petRewards(L,stars,levelBefore){
  const B=BAG(),p=curPet(),out=[];
  const foods=Object.keys(FOOD),fav=p?PET_TYPES[p.type].fav:null;
  const nf=stars>=2?2:1,nd=stars===3?2:1;
  const f=fav&&Math.random()<.6?fav:pick(foods),d=pick(Object.keys(DRINK));
  B.food[f]=(B.food[f]||0)+nf;B.drink[d]=(B.drink[d]||0)+nd;
  out.push(`<span class="pill">${FOOD[f].e} ×${nf}</span>`,`<span class="pill">${DRINK[d].e} ×${nd}</span>`);
  // hoàn thành trọn bài lần đầu → tặng trang phục
  if(!B.given.includes(L.id)&&L.levels.every((_,i)=>S.stars[lvKey(L,i)])){
    B.given.push(L.id);
    const o=OUTFITS.find(o=>!B.outfits.includes(o.id));
    if(o){B.outfits.push(o.id);out.push(`<span class="pill">Trang phục mới: ${o.e} ${o.n}</span>`)}
  }
  if(p&&petLevel()>levelBefore)out.push(`<span class="pill">🐾 ${esc(p.name)} lớn lên: cấp ${petLevel()}!</span>`);
  return out.join('');
}

/* ---------- màn hình thú cưng ---------- */
let petTimer=null,petBusy=false;
function renderPetCard(){
  const el=$('#petCard');if(!el)return;
  const p=curPet();
  if(!p){
    el.innerHTML=`<div class="pc-mini">${petSVG('cat',{mood:'happy'})}</div><div class="pc-info"><b>Nuôi thú cưng</b><small>Học xong mỗi màn sẽ có thức ăn, nước uống cho bạn ấy nhé!</small></div><button class="btn go">Nhận nuôi 🐾</button>`;
  }else{
    petTick(p);save();
    el.innerHTML=`<div class="pc-mini">${petSVG(p.type,petLook(p))}</div><div class="pc-info"><b>${esc(p.name)} · Cấp ${petLevel()}</b><small>${petNeed(p)}</small></div><button class="btn go">Thăm ${esc(p.name)} ➜</button>`;
  }
  el.querySelector('button').onclick=openPet;el.querySelector('.pc-mini').onclick=openPet;
}
function openPet(){
  if(!curPet()){adoptModal();return}
  show('pet');renderPet();petTray('');
  setTimeout(()=>{const p=curPet();if(p)petSay(petNeed(p))},500);
  clearInterval(petTimer);petTimer=setInterval(()=>{const p=curPet();if(!p||$('#pet').hidden){clearInterval(petTimer);return}petTick(p);save();renderPetStats()},60000);
}
function leavePet(){clearInterval(petTimer);show('home');renderHome()}
function renderPet(mood){
  const p=curPet();petTick(p);save();
  const L=petLevel(),st=totalStars(),into=st-(L-1)*STARS_PER_LEVEL;
  $('#petName').innerHTML=`${esc(p.name)} <small>Cấp ${L}</small>`;
  $('#petXp').style.width=(into/STARS_PER_LEVEL*100)+'%';
  $('#petNext').textContent=`⭐ ${into}/${STARS_PER_LEVEL}`;
  $('#petBody').style.setProperty('--ps',(0.72+Math.min(L,20)*0.022).toFixed(3));
  $('#petBody').innerHTML=petSVG(p.type,petLook(p,mood));
  renderPetStats();
}
function renderPetStats(){
  const p=curPet();if(!p)return;
  const bar=(icon,label,v)=>`<div class="pstat" title="${label}"><span>${icon}</span><i><b style="width:${Math.round(v)}%;background:${v>60?'var(--grass)':v>30?'var(--sun)':'var(--coral)'}"></b></i><small>${label}</small></div>`;
  $('#petStats').innerHTML=bar('🍗','No bụng',p.hunger)+bar('💧','Hết khát',p.thirst);
}
function petAnim(cls,ms=700){const b=$('#petBody');b.classList.remove(cls);void b.offsetWidth;b.classList.add(cls);setTimeout(()=>b.classList.remove(cls),ms)}
function petTray(html){const t=$('#petTray');t.innerHTML=html;t.hidden=!html}
function petEmptyTray(what){
  petTray(`<p class="tray-t">Hết ${what} rồi! Con học một màn để nhận thêm nhé.</p><div class="tray-row"><button class="btn go" id="goLearn">📚 Đi học ➜</button></div>`);
  $('#goLearn').onclick=leavePet;
}

function petTap(){
  if(petBusy)return;
  const p=curPet();PET_SND[p.type]();petAnim('jump');
  petSay(Math.min(p.hunger,p.thirst)<40?petNeed(p):pick(PET_LINES));
}

/* cho ăn / cho uống */
function petGiveTray(kind){
  const B=BAG(),list=kind==='food'?FOOD:DRINK,have=Object.keys(list).filter(k=>B[kind][k]>0);
  if(!have.length){petEmptyTray(kind==='food'?'thức ăn':'nước uống');return}
  petTray(`<p class="tray-t">${kind==='food'?'Chọn món ăn':'Chọn đồ uống'} cho ${esc(curPet().name)}:</p><div class="tray-row">${have.map(k=>`<button class="tray-it" data-k="${k}">${list[k].e}<small>×${B[kind][k]}</small></button>`).join('')}</div>`);
  $$('#petTray .tray-it').forEach(b=>b.onclick=()=>petGive(kind,b.dataset.k,b));
}
function petGive(kind,key,btn){
  if(petBusy)return;
  const B=BAG(),p=curPet(),stat=kind==='food'?'hunger':'thirst';
  if(p[stat]>=95){petSay(kind==='food'?'Mình no rồi, để lát nữa nhé! 😋':'Mình uống đủ rồi, cảm ơn con!');return}
  petBusy=true;B[kind][key]--;
  const fav=kind==='food'&&PET_TYPES[p.type].fav===key,e=(kind==='food'?FOOD:DRINK)[key].e;
  flyTo(btn,$('#petBody'),e,()=>{
    renderPet('eat');PET_SND[p.type]();
    p[stat]=clamp(p[stat]+(fav?40:30));save();
    petSay(fav?'Ngon tuyệt! Món mình thích nhất! 😍':kind==='food'?pick(['Cảm ơn con, ngon lắm!','Măm măm… ngon quá!']):pick(['Ực ực… mát quá!','Cảm ơn con, hết khát rồi!']));
    petFloat(fav?'💖':'✨',fav?4:2);
    setTimeout(()=>{petBusy=false;renderPet();petGiveTray(kind)},1300);
  });
}

/* mặc đồ: chạm để mặc, chạm lần nữa để cởi */
function petWearTray(){
  const B=BAG(),have=OUTFITS.filter(o=>B.outfits.includes(o.id));
  if(!have.length){petTray(`<p class="tray-t">Chưa có trang phục nào. Học xong trọn một bài để nhận trang phục đầu tiên nhé!</p><div class="tray-row"><button class="btn go" id="goLearn">📚 Đi học ➜</button></div>`);$('#goLearn').onclick=leavePet;return}
  petTray(`<p class="tray-t">Chạm để mặc, chạm lần nữa để cởi:</p><div class="tray-row">${have.map(o=>`<button class="tray-it ${B.wear[o.slot]===o.id?'on':''}" data-id="${o.id}" title="${o.n}">${o.e}</button>`).join('')}</div>`);
  $$('#petTray .tray-it').forEach(b=>b.onclick=()=>{
    const o=OUTFIT[b.dataset.id];B.wear[o.slot]=B.wear[o.slot]===o.id?null:o.id;save();sfx.pop();
    renderPet('happy');petWearTray();if(B.wear[o.slot])petSay(`Mình đẹp không? ${o.e}`);
  });
}

/* nhận nuôi (chỉ một thú cưng) */
function adoptModal(){
  let sel='cat';
  openModal(`<h2>Chọn thú cưng của con</h2>
    <div class="adopt">${Object.keys(PET_TYPES).map(t=>`<button class="ad-card ${t===sel?'on':''}" data-t="${t}">${petSVG(t,{mood:'happy'})}<b>${PET_TYPES[t].n}</b></button>`).join('')}</div>
    <label class="ad-l" for="adName">Đặt tên cho bạn ấy:</label><input id="adName" class="ad-in" maxlength="12" autocomplete="off" placeholder="${PET_TYPES[sel].def}">
    <div class="mbtns"><button class="btn go" id="adOk">Nhận nuôi 🐾</button><button class="btn ghost" id="adNo">Để sau</button></div>`);
  $$('.ad-card').forEach(b=>b.onclick=()=>{sel=b.dataset.t;$$('.ad-card').forEach(x=>x.classList.toggle('on',x===b));$('#adName').placeholder=PET_TYPES[sel].def;sfx.pop();PET_SND[sel]()});
  $('#adNo').onclick=closeModal;
  $('#adOk').onclick=()=>{
    const name=($('#adName').value||'').trim().slice(0,12)||PET_TYPES[sel].def,B=BAG(),fav=PET_TYPES[sel].fav;
    S.pet={type:sel,name,hunger:70,thirst:70,last:Date.now()};
    B.food[fav]=(B.food[fav]||0)+2;B.drink.water=(B.drink.water||0)+2;   // quà chào mừng
    save();closeModal();sfx.win();confetti();openPet();
    setTimeout(()=>petSay(`Chào con! Mình là ${esc(name)}. Con cho mình ăn, uống nhé! Học giỏi là mình lớn nhanh lắm!`),700);
  };
}
function petRename(){
  const p=curPet();
  openModal(`<h2>Đổi tên</h2><input id="rnName" class="ad-in" maxlength="12" autocomplete="off" value="${esc(p.name)}"><div class="mbtns"><button class="btn go" id="rnOk">Lưu</button><button class="btn ghost" id="rnNo">Huỷ</button></div>`);
  $('#rnOk').onclick=()=>{const v=$('#rnName').value.trim().slice(0,12);if(v)p.name=v;save();closeModal();renderPet()};
  $('#rnNo').onclick=closeModal;
}

/* dữ liệu cũ (bản có xu, hình dán, nhiều thú cưng) → dạng mới */
function migratePet(){
  delete S.coins;delete S.stickers;
  const o=S.pet;
  if(o&&o.pets){
    const B=BAG(),a=o.active&&o.pets[o.active];
    for(const k in (o.inv||{})){if(FOOD[k])B.food[k]=(B.food[k]||0)+o.inv[k];else if(DRINK[k])B.drink[k]=(B.drink[k]||0)+o.inv[k]}
    S.pet=a?{type:o.active,name:a.name,hunger:a.hunger,thirst:70,last:a.last}:null;
  }
  save();
}

function wirePet(){
  migratePet();
  $('#petBack').onclick=leavePet;
  $('#petName').onclick=petRename;
  $('#petStage').addEventListener('click',e=>{if(e.target.closest('#petBody'))petTap()});
  $('#pFeed').onclick=()=>{sfx.pop();petGiveTray('food')};
  $('#pDrink').onclick=()=>{sfx.pop();petGiveTray('drink')};
  $('#pWear').onclick=()=>{sfx.pop();petWearTray()};
  $('#pLearn').onclick=leavePet;
}
