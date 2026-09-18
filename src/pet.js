/* ================= NHÀ THÚ CƯNG =================
   Học giỏi → được xu → mua đồ ăn, đồ chơi, phụ kiện cho thú cưng.
   Thú cưng lớn lên (lên cấp) nhờ sao học tập và việc chăm sóc.
   Chỉ số giảm dần theo thời gian thật nhưng thú cưng không bao giờ chết hay bỏ đi. */

const PET_TYPES={
  cat:{n:'Mèo',def:'Mimi',fav:'fish',toy:'yarn'},
  dog:{n:'Chó',def:'Lu Lu',fav:'bone',toy:'disc'},
  duck:{n:'Vịt',def:'Vàng Anh',fav:'grain',toy:'boat'},
};
const SHOP={
  food:[{id:'fish',e:'🐟',n:'Cá',p:8,h:25},{id:'bone',e:'🦴',n:'Xương',p:8,h:25},{id:'grain',e:'🌾',n:'Thóc',p:6,h:22},
        {id:'milk',e:'🥛',n:'Sữa',p:5,h:15},{id:'melon',e:'🍉',n:'Dưa hấu',p:10,h:20,j:5},{id:'cake',e:'🍰',n:'Bánh kem',p:12,h:20,j:10}],
  toy:[{id:'ball',e:'🎾',n:'Bóng',p:0},{id:'yarn',e:'🧶',n:'Cuộn len',p:40},{id:'disc',e:'🥏',n:'Đĩa bay',p:40},{id:'boat',e:'⛵',n:'Thuyền giấy',p:40},{id:'mouse',e:'🐭',n:'Chuột bông',p:50}],
  hat:[{id:'bow',e:'🎀',n:'Nơ xinh',p:50},{id:'cap',e:'🧢',n:'Mũ lưỡi trai',p:60},{id:'sunhat',e:'👒',n:'Mũ rộng vành',p:80},{id:'tophat',e:'🎩',n:'Mũ ảo thuật',p:100},{id:'crown',e:'👑',n:'Vương miện',p:150}],
  glasses:[{id:'nerd',e:'👓',n:'Kính cận',p:60},{id:'shades',e:'🕶️',n:'Kính râm',p:70}],
  room:[{id:'home',e:'🏠',n:'Phòng khách',p:0},{id:'garden',e:'🌸',n:'Vườn hoa',p:80},{id:'beach',e:'🏖️',n:'Bãi biển',p:100},{id:'night',e:'🌙',n:'Đêm sao',p:120},{id:'castle',e:'🏰',n:'Lâu đài',p:150}],
};
const ITEM=Object.fromEntries(Object.values(SHOP).flat().map(x=>[x.id,x]));
const ROOM_DECOR={
  home:[['🪴',6,62],['🖼️',74,10],['🧸',84,66]],
  garden:[['🌳',2,30],['🌸',80,64],['🌼',12,70],['🦋',70,14]],
  beach:[['☀️',78,6],['🌴',2,28],['🐚',84,74],['⛱️',70,50]],
  night:[['🌙',78,6],['⭐',12,10],['✨',40,4],['⭐',60,20]],
  castle:[['🏰',70,18],['🚩',10,8],['💎',84,70],['🕯️',6,60]],
};
const PET_RATE={hunger:5,happy:4,clean:3};        // điểm giảm mỗi giờ
const PET_QUIZ_CAP=30;                              // xu tối đa mỗi ngày từ đố vui
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const todayStr=()=>{const d=new Date();return`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};

function PD(){
  if(!S.pet)S.pet={active:null,pets:{},inv:{},owned:['ball','home'],room:'home',quiz:{d:'',c:0},gift:''};
  return S.pet;
}
const curPet=()=>{const D=PD();return D.active?D.pets[D.active]:null};
const petLevel=xp=>Math.min(20,Math.floor(Math.sqrt(xp/40))+1);
const lvXp=l=>40*(l-1)*(l-1);
function petTick(p){
  const now=Date.now(),hrs=Math.min(36,Math.max(0,(now-(p.last||now))/36e5));
  for(const k in PET_RATE)p[k]=Math.max(0,p[k]-PET_RATE[k]*hrs);
  p.last=now;
}
const clamp=v=>Math.max(0,Math.min(100,v));
function petLook(p,mood){
  if(!mood)mood=Math.min(p.hunger,p.happy)<30?'sad':p.happy>65&&p.hunger>40?'happy':'normal';
  return{mood,dirt:p.clean<60?(60-p.clean)/60:0,hat:p.hat,glasses:p.glasses};
}
function petNeed(p){
  const n=esc(p.name),m=Math.min(p.hunger,p.happy,p.clean);
  if(m>=45)return`${n} đang rất vui 💕`;
  if(p.hunger===m)return`${n} đang đói bụng 🍽️ Học bài để có xu mua đồ ăn nhé!`;
  if(p.clean===m)return`${n} cần tắm rồi 🛁`;
  return`${n} muốn chơi với con 🎾`;
}

/* ---------- vẽ thú cưng (SVG) ---------- */
function petSVG(type,look={}){
  const ink='#243A6B',k=`stroke="${ink}" stroke-width="3" stroke-linejoin="round"`,mood=look.mood||'normal';
  const E={cat:[80,92,120],dog:[80,90,120],duck:[84,78,116]}[type];
  const [ex1,ey,ex2]=E;
  const eye=(x)=>{
    if(mood==='happy')return`<path d="M${x-10} ${ey+3} Q${x} ${ey-10} ${x+10} ${ey+3}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
    if(mood==='sleep')return`<path d="M${x-9} ${ey+2} Q${x} ${ey+8} ${x+9} ${ey+2}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
    const r=type==='duck'?9:11;
    return`<g class="p-eye"><ellipse cx="${x}" cy="${ey}" rx="${r}" ry="${r+2}" fill="#fff" ${k}/><circle cx="${x+1}" cy="${ey+(mood==='sad'?4:2)}" r="${r*.6}" fill="${ink}"/><circle cx="${x+3}" cy="${ey-1}" r="2.2" fill="#fff"/></g>`;
  };
  let brows='';if(mood==='sad')brows=`<path d="M${ex1-10} ${ey-18} L${ex1+8} ${ey-13}M${ex2+10} ${ey-18} L${ex2-8} ${ey-13}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M${ex2+8} ${ey+12} q4 8 0 11 q-4 -3 0 -11z" fill="#8FD9FF"/>`;
  const cheeks=mood==='happy'||mood==='eat'?`<ellipse cx="${ex1-8}" cy="${ey+18}" rx="9" ry="5" fill="#FF8FA3" opacity=".6"/><ellipse cx="${ex2+8}" cy="${ey+18}" rx="9" ry="5" fill="#FF8FA3" opacity=".6"/>`:'';
  const my={cat:112,dog:122,duck:0}[type];
  let mouth='';
  if(type!=='duck'){
    if(mood==='eat'||mood==='talk')mouth=`<ellipse class="chomp" cx="100" cy="${my+5}" rx="9" ry="8" fill="#B8323A" ${k}/>`;
    else if(mood==='happy')mouth=`<path d="M88 ${my} Q100 ${my+20} 112 ${my} Z" fill="#E4572E" ${k}/><path d="M94 ${my+9} Q100 ${my+14} 106 ${my+9}" fill="#FF9FB0"/>`;
    else if(mood==='sad')mouth=`<path d="M90 ${my+8} Q100 ${my} 110 ${my+8}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    else mouth=`<path d="M91 ${my} Q95.5 ${my+6} 100 ${my} Q104.5 ${my+6} 109 ${my}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  }
  let body='';
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
    const open=mood==='eat'||mood==='talk';
    mouth=`<ellipse cx="100" cy="100" rx="24" ry="9" fill="#FF9F1A" ${k}/>`+(open?`<ellipse class="chomp" cx="100" cy="110" rx="18" ry="7" fill="#E4572E" ${k}/>`:mood==='sad'?`<path d="M86 106 q14 -6 28 0" fill="none" stroke="${ink}" stroke-width="2.5"/>`:'');
  }
  const spots=look.dirt?`<g opacity="${(.25+look.dirt*.65).toFixed(2)}" fill="#8A5A2B"><circle cx="70" cy="150" r="9"/><circle cx="132" cy="172" r="7"/><circle cx="120" cy="66" r="6"/><circle cx="64" cy="112" r="5"/><circle cx="106" cy="186" r="6"/></g>`:'';
  const hy={cat:48,dog:46,duck:40}[type];
  const hat=look.hat&&ITEM[look.hat]?`<text x="100" y="${hy}" text-anchor="middle" font-size="46">${ITEM[look.hat].e}</text>`:'';
  const gl=look.glasses&&ITEM[look.glasses]?`<text x="100" y="${ey+17}" text-anchor="middle" font-size="${type==='duck'?50:60}">${ITEM[look.glasses].e}</text>`:'';
  return`<svg class="pet-svg m-${mood}" viewBox="0 0 200 206" aria-hidden="true">${body}${spots}${cheeks}${eye(ex1)}${eye(ex2)}${brows}${mouth}${gl}${hat}</svg>`;
}

/* ---------- âm thanh & lời nói ---------- */
const PET_SND={
  cat(){tone(760,.18,'sine',.15,0,960);tone(900,.38,'sine',.15,.17,520)},
  dog(){tone(330,.12,'square',.07,0,210);tone(310,.14,'square',.07,.22,190)},
  duck(){tone(520,.13,'sawtooth',.06,0,360);tone(520,.13,'sawtooth',.06,.2,360)},
};
const PET_LINES=['Hi hi, nhột quá!','Con học bài chưa?','Mình thương con nhất!','Chơi với mình đi!','Học xong một màn là có xu mua quà cho mình đó!','3 × 4 = 12, mình nhớ nè!','Con giỏi quá!','Hôm nay con học bảng nhân mấy rồi?'];
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

/* ---------- thưởng khi học ---------- */
function petGain(p,xp){
  const before=petLevel(p.xp);p.xp+=xp;const after=petLevel(p.xp);
  return after>before?after:0;
}
// Gọi từ finishLevel: trả về dòng chữ hiển thị trong bảng kết quả
function petReward(stars){
  const p=curPet();if(!p)return'';
  petTick(p);const up=petGain(p,stars*10);p.happy=clamp(p.happy+stars*3);save();
  return`<span class="pill">🐾 ${esc(p.name)} +${stars*10} XP${up?` · Lên cấp ${up}!`:''}</span>`;
}

/* ---------- màn hình nhà thú cưng ---------- */
let petTimer=null,petBusy=false,petBath=false,petRec=null;
function renderPetCard(){
  const el=$('#petCard');if(!el)return;
  const D=PD(),p=curPet();
  if(!p){
    el.innerHTML=`<div class="pc-mini">${petSVG('cat',{mood:'happy'})}</div><div class="pc-info"><b>Nuôi thú cưng</b><small>Nhận nuôi mèo, chó hoặc vịt. Học giỏi để có xu chăm sóc bạn ấy nhé!</small></div><button class="btn go">Nhận nuôi 🐾</button>`;
  }else{
    petTick(p);save();
    el.innerHTML=`<div class="pc-mini">${petSVG(D.active,petLook(p))}</div><div class="pc-info"><b>${esc(p.name)} · Cấp ${petLevel(p.xp)}</b><small>${petNeed(p)}</small></div><button class="btn go">Chăm sóc ➜</button>`;
  }
  el.querySelector('button').onclick=openPet;el.querySelector('.pc-mini').onclick=openPet;
}
function openPet(){
  const D=PD();
  if(!curPet()){adoptModal(true);return}
  show('pet');petBath=false;
  if(D.gift!==todayStr()){D.gift=todayStr();S.coins+=5;save();setTimeout(()=>{toast('Quà mỗi ngày: +5 🪙','good');sfx.ok()},400)}
  renderPet();
  setTimeout(()=>{const p=curPet();if(p)petSay(petNeed(p))},600);
  clearInterval(petTimer);petTimer=setInterval(()=>{const p=curPet();if(!p||$('#pet').hidden){clearInterval(petTimer);return}petTick(p);save();renderPetStats()},60000);
}
function leavePet(){clearInterval(petTimer);petStopRec();show('home');renderHome()}
function renderPet(mood){
  const D=PD(),p=curPet();petTick(p);save();
  const L=petLevel(p.xp),a=lvXp(L),b=lvXp(L+1);
  $('#petName').innerHTML=`${esc(p.name)} <small>Cấp ${L}</small>`;
  $('#petXp').style.width=(L>=20?100:(p.xp-a)/(b-a)*100)+'%';
  $('#petCoins').textContent=S.coins;
  const room=$('#room');room.className='room r-'+D.room+(petBath?' bathing':'');
  $('#roomDecor').innerHTML=(ROOM_DECOR[D.room]||[]).map(([e,x,y])=>`<span style="left:${x}%;top:${y}%">${e}</span>`).join('');
  $('#petBody').style.setProperty('--ps',(0.82+Math.min(L,15)*0.022).toFixed(3));
  $('#petBody').innerHTML=petSVG(D.active,petLook(p,mood));
  renderPetStats();
  const owned=Object.keys(D.pets);
  $('#petSwitch').innerHTML=owned.length>1?owned.map(t=>`<button class="ps-av ${t===D.active?'on':''}" data-t="${t}" aria-label="${esc(D.pets[t].name)}">${petSVG(t,{mood:'normal'})}</button>`).join(''):'';
  $$('#petSwitch .ps-av').forEach(b=>b.onclick=()=>{if(petBusy)return;D.active=b.dataset.t;save();sfx.pop();renderPet();petSay(`Chào con! Mình là ${esc(curPet().name)}!`)});
}
function renderPetStats(){
  const p=curPet();if(!p)return;
  const bar=(icon,label,v)=>`<div class="pstat" title="${label}"><span>${icon}</span><i><b style="width:${Math.round(v)}%;background:${v>60?'var(--grass)':v>30?'var(--sun)':'var(--coral)'}"></b></i></div>`;
  $('#petStats').innerHTML=bar('🍗','No bụng',p.hunger)+bar('💖','Vui vẻ',p.happy)+bar('🫧','Sạch sẽ',p.clean);
}
function petAnim(cls,ms=700){const b=$('#petBody');b.classList.remove(cls);void b.offsetWidth;b.classList.add(cls);setTimeout(()=>b.classList.remove(cls),ms)}
function petTray(html){const t=$('#petTray');t.innerHTML=html;t.hidden=!html}

/* chạm vào thú cưng */
function petTap(){
  if(petBusy||petBath)return;
  const D=PD(),p=curPet();
  PET_SND[D.active]();petAnim('jump');
  p.happy=clamp(p.happy+1);save();renderPetStats();
  petSay(Math.min(p.hunger,p.clean,p.happy)<30?petNeed(p):pick(PET_LINES));
}

/* cho ăn */
function petFeedTray(){
  const D=PD(),foods=SHOP.food.filter(f=>D.inv[f.id]>0);
  if(!foods.length){petTray(`<p class="tray-t">Hết đồ ăn rồi! Học bài để có xu, rồi vào cửa hàng mua nhé.</p><div class="tray-row"><button class="btn" id="goShop">🛒 Cửa hàng</button></div>`);$('#goShop').onclick=()=>petShop('food');return}
  petTray(`<p class="tray-t">Chọn món cho ${esc(curPet().name)}:</p><div class="tray-row">${foods.map(f=>`<button class="tray-it" data-id="${f.id}">${f.e}<small>×${D.inv[f.id]}</small></button>`).join('')}</div>`);
  $$('#petTray .tray-it').forEach(b=>b.onclick=()=>petFeed(b.dataset.id,b));
}
function petFeed(id,btn){
  if(petBusy)return;
  const D=PD(),p=curPet(),f=ITEM[id];
  if(p.hunger>=95){petSay('Mình no rồi, để lát nữa nhé! 😋');return}
  petBusy=true;D.inv[id]--;
  const fav=PET_TYPES[D.active].fav===id;
  flyTo(btn,$('#petBody'),f.e,()=>{
    renderPet('eat');PET_SND[D.active]();
    p.hunger=clamp(p.hunger+f.h+(fav?12:0));p.happy=clamp(p.happy+(f.j||0)+(fav?8:3));
    const up=petGain(p,2);save();
    petSay(fav?'Ngon tuyệt! Món mình thích nhất! 😍':pick(['Cảm ơn con, ngon lắm!','Măm măm… ngon quá!','Mình no hơn rồi nè!']));
    petFloat(fav?'💖':'✨',fav?4:2);
    setTimeout(()=>{petBusy=false;renderPet();petFeedTray();if(up)petLevelUp(up)},1400);
  });
}

/* chơi */
function petPlayTray(){
  const D=PD(),toys=SHOP.toy.filter(t=>D.owned.includes(t.id));
  petTray(`<p class="tray-t">Ném đồ chơi cho ${esc(curPet().name)} bắt nào:</p><div class="tray-row">${toys.map(t=>`<button class="tray-it" data-id="${t.id}">${t.e}</button>`).join('')}<button class="tray-it more" id="moreToys">🛒<small>Thêm</small></button></div>`);
  $$('#petTray .tray-it[data-id]').forEach(b=>b.onclick=()=>petPlay(b.dataset.id));
  $('#moreToys').onclick=()=>petShop('toy');
}
function petPlay(id){
  if(petBusy)return;petBusy=true;
  const D=PD(),p=curPet(),t=ITEM[id],st=$('#petStage');
  const toy=h(`<span class="p-toy">${t.e}</span>`);st.appendChild(toy);
  const W=st.clientWidth;sfx.hop();
  const done=()=>{
    toy.remove();PET_SND[D.active]();
    const fav=PET_TYPES[D.active].toy===id;
    p.happy=clamp(p.happy+(fav?20:12));p.hunger=clamp(p.hunger-2);
    const up=petGain(p,2);save();renderPet('happy');
    petSay(fav?'Đồ chơi mình thích nhất! Ném nữa đi!':pick(['Bắt được rồi!','Vui quá đi!','Nữa đi, nữa đi!']));petFloat('⭐',3);
    setTimeout(()=>{petBusy=false;renderPet();if(up)petLevelUp(up)},900);
  };
  setTimeout(()=>petAnim('jump',800),420);
  if(!toy.animate||reduced){done();return}
  toy.animate([{transform:`translate(${-W*.42}px,40px) rotate(0)`},{transform:`translate(${-W*.15}px,-150px) rotate(360deg)`},{transform:'translate(0,-70px) rotate(720deg)'}],{duration:800,easing:'ease-out'}).onfinish=done;
}

/* tắm: chà tay lên người để tạo bọt */
function petBathStart(){
  if(petBusy)return;
  petBath=true;renderPet();
  petTray(`<p class="tray-t">🧽 Lấy tay chà lên người ${esc(curPet().name)} để tắm nhé!</p><div class="tray-row"><button class="btn go" id="rinse">🚿 Xả nước</button></div>`);
  petSay('Tắm thôi! Chà mạnh lên nào 🫧');
  $('#rinse').onclick=petRinse;
}
let lastBub=null;
function petScrub(e){
  if(!petBath)return;
  const st=$('#petStage'),r=st.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(lastBub&&Math.hypot(x-lastBub[0],y-lastBub[1])<14)return;
  lastBub=[x,y];
  const b=h(`<span class="bubble-f" style="left:${x}px;top:${y}px;--s:${.6+Math.random()*.8}"></span>`);st.appendChild(b);setTimeout(()=>b.remove(),1600);
  const p=curPet();p.clean=clamp(p.clean+1.6);
  if(Math.random()<.08)tone(900+Math.random()*400,.05,'sine',.05);
  renderPetStats();
  if(p.clean>=100&&!petBusy)petRinse();
}
function petRinse(){
  if(petBusy)return;petBusy=true;
  const p=curPet(),st=$('#petStage');
  for(let i=0;i<14;i++){const d=h(`<span class="drop" style="left:${10+Math.random()*80}%;animation-delay:${Math.random()*.6}s">💧</span>`);st.appendChild(d);setTimeout(()=>d.remove(),1600)}
  sfx.pour();
  setTimeout(()=>{
    p.clean=clamp(Math.max(p.clean,70)+30);p.happy=clamp(p.happy+6);
    const up=petGain(p,3);save();petBath=false;petBusy=false;
    renderPet('happy');petTray('');petSay('Thơm tho sạch sẽ rồi! Cảm ơn con! ✨');petFloat('✨',4);
    if(up)petLevelUp(up);
  },1500);
}

/* nhại giọng kiểu "Mèo Tom": ghi âm rồi phát lại giọng cao — âm thanh chỉ ở trên máy, không gửi đi đâu */
async function petRecToggle(){
  if(petRec){petRec.stop();return}
  if(petBusy)return;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){petSay('Máy này chưa hỗ trợ ghi âm 😢');return}
  let stream;
  try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){petSay('Con cần cho phép dùng micro để mình nghe được nhé!');return}
  const chunks=[],rec=new MediaRecorder(stream);petRec=rec;
  const btn=$('#pRec');btn.classList.add('rec');btn.firstChild.textContent='⏹️';
  petSay('Mình đang nghe nè… con nói đi! 👂');
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  rec.onstop=()=>{
    stream.getTracks().forEach(t=>t.stop());petRec=null;btn.classList.remove('rec');btn.firstChild.textContent='🎤';
    if(!chunks.length)return;
    const url=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType})),a=new Audio(url);
    a.preservesPitch=false;a.webkitPreservesPitch=false;a.mozPreservesPitch=false;a.playbackRate=1.6;
    petBusy=true;renderPet('talk');$('#petSay').hidden=true;
    const end=()=>{URL.revokeObjectURL(url);petBusy=false;const p=curPet();p.happy=clamp(p.happy+3);save();renderPet()};
    a.onended=end;a.onerror=end;a.play().catch(end);
  };
  rec.start();
  setTimeout(()=>{if(petRec===rec&&rec.state==='recording')rec.stop()},5000);
}
function petStopRec(){if(petRec&&petRec.state==='recording')petRec.stop()}

/* đố vui cùng thú cưng: làm toán để kiếm thêm xu */
function learnedTables(){
  const map={5:3,6:4,9:6,10:7,11:8,12:9},t=[2,5];
  LESSONS.forEach(L=>{if(map[L.id]&&lessonStars(L)>0)t.push(map[L.id])});
  if(t.length===2)t.push(3);
  return t;
}
function petQuiz(){
  const D=PD(),p=curPet(),tabs=learnedTables();
  if(D.quiz.d!==todayStr())D.quiz={d:todayStr(),c:0};
  let i=0,right=0;
  const next=()=>{
    if(i>=5){
      save();renderPet(right>=4?'happy':undefined);
      openModal(`<h2>${right>=4?'Giỏi quá!':'Cố lên nhé!'}</h2><div class="pq-pet">${petSVG(D.active,{mood:right>=3?'happy':'normal',hat:p.hat,glasses:p.glasses})}</div><p style="font-weight:800">Con đúng ${right}/5 câu.</p><p class="lbl">Hôm nay đã nhận ${D.quiz.c}/${PET_QUIZ_CAP} 🪙 từ đố vui.</p><div class="mbtns"><button class="btn go" id="pqAgain">Đố tiếp ➜</button><button class="btn ghost" id="pqClose">Xong</button></div>`);
      $('#pqAgain').onclick=petQuiz;$('#pqClose').onclick=()=>{closeModal();renderPet()};
      return;
    }
    const [t,a]=tableGen(pick(tabs))();
    openModal(`<h2>Đố vui cùng ${esc(p.name)}</h2><div class="pq-pet" id="pqPet">${petSVG(D.active,{mood:'normal',hat:p.hat,glasses:p.glasses})}</div><p class="qbig">${qfmt(t)}</p><div class="choices" id="pqc"></div><p class="lbl">Câu ${i+1} / 5 · Mỗi câu đúng +2 🪙 (hôm nay ${D.quiz.c}/${PET_QUIZ_CAP})</p>`);
    let tried=false;
    makeOptions(a).forEach(v=>{
      const b=h(`<button class="choice">${v}</button>`);
      b.onclick=()=>{
        if(v===a){
          b.classList.add('right');$$('#pqc button').forEach(x=>x.disabled=true);sfx.ok();
          if(!tried){right++;if(D.quiz.c<PET_QUIZ_CAP){D.quiz.c+=2;S.coins+=2}}
          p.happy=clamp(p.happy+3);const up=petGain(p,3);
          $('#pqPet').innerHTML=petSVG(D.active,{mood:'happy',hat:p.hat,glasses:p.glasses});PET_SND[D.active]();
          i++;save();setTimeout(()=>{if(up)toast(`${esc(p.name)} lên cấp ${up}!`,'good');next()},800);
        }else{tried=true;b.classList.add('wrong','shake');b.disabled=true;sfx.bad();$('#pqPet').innerHTML=petSVG(D.active,{mood:'sad',hat:p.hat,glasses:p.glasses})}
      };
      $('#pqc').appendChild(b);
    });
  };
  next();
}

/* lên cấp */
function petLevelUp(L){
  const p=curPet();sfx.win();confetti();
  openModal(`<h2>${esc(p.name)} lên cấp ${L}!</h2><div class="pq-pet">${petSVG(PD().active,{mood:'happy',hat:p.hat,glasses:p.glasses})}</div><p style="font-weight:800">Bạn ấy lớn thêm một chút rồi. Con chăm sóc giỏi lắm!</p><button class="btn go" id="luOk">Tuyệt!</button>`);
  $('#luOk').onclick=()=>{closeModal();renderPet()};
}

/* nhận nuôi */
function adoptModal(first,only){
  const D=PD(),types=Object.keys(PET_TYPES).filter(t=>!D.pets[t]&&(!only||t===only));
  if(!types.length){toast('Con đã nuôi đủ cả ba bạn rồi!','good');return}
  const price=Object.keys(D.pets).length===1?200:300;
  let sel=types[0];
  openModal(`<h2>${first?'Chọn thú cưng của con':'Nhận nuôi thêm bạn mới'}</h2>
    <div class="adopt">${types.map(t=>`<button class="ad-card ${t===sel?'on':''}" data-t="${t}">${petSVG(t,{mood:'happy'})}<b>${PET_TYPES[t].n}</b></button>`).join('')}</div>
    <label class="ad-l" for="adName">Đặt tên cho bạn ấy:</label><input id="adName" class="ad-in" maxlength="12" autocomplete="off" placeholder="${PET_TYPES[sel].def}">
    ${first?'':`<p class="lbl">Giá: ${price} 🪙 · Con đang có ${S.coins} 🪙</p>`}
    <div class="mbtns"><button class="btn go" id="adOk">Nhận nuôi 🐾</button>${first?'':'<button class="btn ghost" id="adNo">Để sau</button>'}</div>`,!first);
  $$('.ad-card').forEach(b=>b.onclick=()=>{sel=b.dataset.t;$$('.ad-card').forEach(x=>x.classList.toggle('on',x===b));$('#adName').placeholder=PET_TYPES[sel].def;sfx.pop();PET_SND[sel]()});
  if(!first)$('#adNo').onclick=closeModal;
  $('#adOk').onclick=()=>{
    if(!first&&S.coins<price){toast('Chưa đủ xu — học thêm nhé!','bad');sfx.bad();return}
    if(!first)S.coins-=price;
    const name=($('#adName').value||'').trim().slice(0,12)||PET_TYPES[sel].def;
    D.pets[sel]={name,xp:0,hunger:80,happy:85,clean:90,last:Date.now(),hat:null,glasses:null};
    D.active=sel;
    if(first){D.inv[PET_TYPES[sel].fav]=(D.inv[PET_TYPES[sel].fav]||0)+3;D.inv.milk=(D.inv.milk||0)+2}
    save();closeModal();sfx.win();confetti();openPet();
    setTimeout(()=>petSay(first?`Chào con! Mình là ${esc(name)}. Con tặng mình 3 món ăn rồi đó, cho mình ăn nhé!`:`Chào con! Mình là ${esc(name)}, bạn mới đây!`),700);
  };
}

/* cửa hàng */
function petShop(tab='food'){
  const D=PD(),p=curPet();
  const tabs=[['food','🍗 Đồ ăn'],['toy','🎾 Đồ chơi'],['hat','🎩 Mũ'],['glasses','🕶️ Kính'],['room','🏠 Phòng'],['pet','🐾 Bạn mới']];
  let body='';
  if(tab==='pet'){
    const rest=Object.keys(PET_TYPES).filter(t=>!D.pets[t]),price=Object.keys(D.pets).length===1?200:300;
    body=rest.length?rest.map(t=>`<button class="shop-it" data-pet="${t}"><span class="si-e si-pet">${petSVG(t,{mood:'happy'})}</span><b>${PET_TYPES[t].n}</b><small>${price} 🪙</small></button>`).join(''):'<p class="lbl">Con đã nuôi đủ cả ba bạn rồi!</p>';
  }else body=SHOP[tab].map(it=>{
    const own=tab!=='food'&&D.owned.includes(it.id);
    const tag=tab==='food'?`${it.p} 🪙 · có ${D.inv[it.id]||0}`:own?'Đã có':`${it.p} 🪙`;
    const fav=(tab==='food'&&PET_TYPES[D.active].fav===it.id)||(tab==='toy'&&PET_TYPES[D.active].toy===it.id);
    return`<button class="shop-it ${own?'own':''}" data-id="${it.id}"><span class="si-e">${it.e}</span><b>${it.n}${fav?' 💖':''}</b><small>${tag}</small></button>`;
  }).join('');
  openModal(`<h2>Cửa hàng</h2><p class="lbl">Con có <b>${S.coins} 🪙</b> · 💖 là món ${esc(p.name)} thích nhất</p>
    <div class="shop-tabs">${tabs.map(([k,n])=>`<button class="stab ${k===tab?'on':''}" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="shop-grid">${body}</div><button class="btn ghost" id="shopClose">Đóng</button>`);
  $$('.stab').forEach(b=>b.onclick=()=>{sfx.pop();petShop(b.dataset.k)});
  $('#shopClose').onclick=()=>{closeModal();renderPet()};
  $$('.shop-it[data-pet]').forEach(b=>b.onclick=()=>adoptModal(false,b.dataset.pet));
  $$('.shop-it[data-id]').forEach(b=>b.onclick=()=>{
    const it=ITEM[b.dataset.id];
    if(tab!=='food'&&D.owned.includes(it.id)){petWear(tab,it.id);petShop(tab);return}
    if(S.coins<it.p){toast('Chưa đủ xu — học thêm nhé!','bad');sfx.bad();return}
    S.coins-=it.p;sfx.ok();
    if(tab==='food')D.inv[it.id]=(D.inv[it.id]||0)+1;else{D.owned.push(it.id);petWear(tab,it.id)}
    save();toast(`Đã mua ${it.e}`,'good');petShop(tab);
  });
}
function petWear(tab,id){
  const D=PD(),p=curPet();
  if(tab==='hat')p.hat=p.hat===id?null:id;
  else if(tab==='glasses')p.glasses=p.glasses===id?null:id;
  else if(tab==='room')D.room=id;
  save();
}

/* tủ đồ: đội mũ, đeo kính, đổi phòng từ những món đã có */
function petCloset(){
  const D=PD(),p=curPet();
  const sec=(tab,title,cur)=>{const its=SHOP[tab].filter(i=>D.owned.includes(i.id));
    return`<h3 class="cl-h">${title}</h3><div class="shop-grid">${its.length?its.map(i=>`<button class="shop-it ${cur===i.id?'own on':''}" data-t="${tab}" data-id="${i.id}"><span class="si-e">${i.e}</span><b>${i.n}</b><small>${cur===i.id?'Đang dùng':'Chạm để dùng'}</small></button>`).join(''):'<p class="lbl">Chưa có — mua ở cửa hàng nhé!</p>'}</div>`};
  openModal(`<h2>Tủ đồ của ${esc(p.name)}</h2>${sec('hat','🎩 Mũ',p.hat)}${sec('glasses','🕶️ Kính',p.glasses)}${sec('room','🏠 Phòng',D.room)}<button class="btn ghost" id="clClose">Đóng</button>`);
  $$('.mcard .shop-it[data-t]').forEach(b=>b.onclick=()=>{sfx.pop();petWear(b.dataset.t,b.dataset.id);renderPet();petCloset()});
  $('#clClose').onclick=()=>{closeModal();renderPet()};
}

/* đổi tên */
function petRename(){
  const p=curPet();
  openModal(`<h2>Đổi tên</h2><input id="rnName" class="ad-in" maxlength="12" autocomplete="off" value="${esc(p.name)}"><div class="mbtns"><button class="btn go" id="rnOk">Lưu</button><button class="btn ghost" id="rnNo">Huỷ</button></div>`);
  $('#rnOk').onclick=()=>{const v=$('#rnName').value.trim().slice(0,12);if(v)p.name=v;save();closeModal();renderPet()};
  $('#rnNo').onclick=closeModal;
}

function wirePet(){
  $('#petBack').onclick=leavePet;
  $('#petName').onclick=petRename;
  const st=$('#petStage');
  st.addEventListener('click',e=>{if(!petBath&&e.target.closest('#petBody'))petTap()});
  st.addEventListener('pointermove',petScrub);
  st.addEventListener('pointerdown',e=>{if(petBath){st.setPointerCapture?.(e.pointerId);petScrub(e)}});
  $('#pFeed').onclick=()=>{if(petBath)return;sfx.pop();petFeedTray()};
  $('#pPlay').onclick=()=>{if(petBath)return;sfx.pop();petPlayTray()};
  $('#pBath').onclick=()=>{sfx.pop();petBath?petRinse():petBathStart()};
  $('#pQuiz').onclick=()=>{if(petBath)return;petQuiz()};
  $('#pRec').onclick=()=>{if(petBath)return;petRecToggle()};
  $('#pShop').onclick=()=>petShop('food');
  $('#pCloset').onclick=petCloset;
}
