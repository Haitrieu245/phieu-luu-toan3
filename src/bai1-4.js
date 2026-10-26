/* ================= BÀI 1–4 (Chủ đề 1: Ôn tập và bổ sung) ================= */
// Đọc số đến 1000 bằng chữ: 134 → "một trăm ba mươi tư", 307 → "ba trăm linh bảy"
const SO=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function readVN(n){
  if(n===1000)return'một nghìn';
  const t=Math.floor(n/100),c=Math.floor(n%100/10),d=n%10,out=[];
  if(t)out.push(SO[t]+' trăm');
  if(c===0){if(d)out.push((t?'linh ':'')+SO[d])}
  else{
    out.push(c===1?'mười':SO[c]+' mươi');
    if(d)out.push(d===1&&c>1?'mốt':d===5?'lăm':d===4&&c>1?'tư':SO[d]);
  }
  return out.join(' ')||'không';
}
// Khối trăm (tấm vuông), chục (thanh), đơn vị (khối nhỏ)
function blocksSVG(n){
  const t=Math.floor(n/100),c=Math.floor(n%100/10),d=n%10;let g='',x=4;
  for(let i=0;i<t;i++){g+=`<rect x="${x}" y="4" width="50" height="50" fill="#8FD18A" stroke="#2F8F42" stroke-width="2"/>`;for(let k=1;k<10;k++)g+=`<line x1="${x+k*5}" x2="${x+k*5}" y1="4" y2="54" stroke="#2F8F42" stroke-width=".6"/><line y1="${4+k*5}" y2="${4+k*5}" x1="${x}" x2="${x+50}" stroke="#2F8F42" stroke-width=".6"/>`;x+=56}
  if(t)x+=6;
  for(let i=0;i<c;i++){g+=`<rect x="${x}" y="4" width="6" height="50" fill="#8FD18A" stroke="#2F8F42" stroke-width="1.5"/>`;x+=9}
  if(c)x+=8;
  for(let i=0;i<d;i++)g+=`<rect x="${x+(i%2)*9}" y="${4+Math.floor(i/2)*9}" width="7" height="7" fill="#8FD18A" stroke="#2F8F42" stroke-width="1.5"/>`;
  x+=d?20:0;
  return`<svg viewBox="0 0 ${x+4} 58" class="fig wide" style="max-width:${Math.min(340,(x+4)*1.6)}px" aria-hidden="true">${g}</svg>`;
}
const num3=()=>rnd(1,9)*100+rnd(0,9)*10+rnd(0,9);
G.readNum=()=>{const n=num3();return pick([
  numQ(`${blocksSVG(n)}<p class="q-t">Viết số: <b class="box">?</b></p>`,n,'Đếm số tấm trăm, số thanh chục, số khối đơn vị.',{say:'Có bao nhiêu trăm, bao nhiêu chục, bao nhiêu đơn vị? Viết số.'}),
  (()=>{const w=[readVN(n),readVN(Math.floor(n/100)*100+(n%10)*10+Math.floor(n%100/10)),readVN((n%10||1)*100+Math.floor(n%100/10)*10+Math.floor(n/100)),readVN(n+10<1000?n+10:n-10)];
    return {html:`<p class="qbig">${n}</p><p class="q-t">Số ${n} đọc là:</p>`,key:'r'+n,say:`Số này đọc là gì?`,choices:mc(w[0],w.slice(1)),ans:w[0],cls:'wide',hint:'Đọc lần lượt hàng trăm, hàng chục, hàng đơn vị. Chục là 0 thì đọc “linh”.'}})(),
  (()=>{const r=readVN(n);return numQ(`<p class="q-t">“${r}”<br>Viết số: <b class="box">?</b></p>`,n,'Viết lần lượt chữ số hàng trăm, hàng chục, hàng đơn vị.',{say:`Viết số ${r}.`})})()])};
G.placeVal=()=>{const n=num3(),t=Math.floor(n/100),c=Math.floor(n%100/10),d=n%10;return pick([
  numQ(`<p class="q-t">Số gồm ${t} trăm, ${c} chục và ${d} đơn vị là <b class="box">?</b></p>`,n,`Viết ${t} ở hàng trăm, ${c} ở hàng chục, ${d} ở hàng đơn vị.`),
  numQ(`<div class="qlines"><div>${n} gồm <b class="box">?</b> trăm,</div><div><b class="box">?</b> chục và <b class="box">?</b> đơn vị.</div></div>`,[t,c,d],['Chữ số đầu tiên là hàng trăm.','Chữ số ở giữa là hàng chục.','Chữ số cuối cùng là hàng đơn vị.']),
  numQ(`<p class="q-t">Viết thành tổng các trăm, chục và đơn vị:</p>${bigAll(`${n} = ${t*100} + ? + ${d}`)}`,c*10,`Chữ số hàng chục là ${c}, tức là ${c*10}.`)])};
G.neighbor=()=>{const n=rnd(11,998);return pick([
  numQ(`<div class="qlines"><div>Số liền trước của ${n} là <b class="box">?</b></div><div>Số liền sau của ${n} là <b class="box">?</b></div></div>`,[n-1,n+1],['Số liền trước bé hơn 1 đơn vị.','Số liền sau lớn hơn 1 đơn vị.']),
  numQ(`<p class="q-t">Ba số liên tiếp:</p>${bigAll(`${n-1}, ${n}, ?`)}`,n+1,'Số liền sau thêm 1 đơn vị.'),
  numQ(`<p class="q-t">Ba số liên tiếp:</p>${bigAll(`${n+1}, ?, ${n-1}`)}`,n,'Dãy đang giảm dần 1 đơn vị.')])};
G.seq=()=>{const up=Math.random()<.5,s=up?rnd(100,980):rnd(119,1000),seq=rep(8,i=>up?s+i:s-i),bl=[2,3,5,6];
  return numQ(`<p class="q-t">${up?'Đếm thêm 1':'Đếm bớt 1'}:</p><div class="qlines" style="align-items:center;font-size:24px"><div>${seq.map((v,i)=>bl.includes(i)?'<b class="box">?</b>':v).join(', ')}</div></div>`,bl.map(i=>seq[i]),`Mỗi số ${up?'hơn':'kém'} số trước nó 1 đơn vị.`,{key:'s'+s,say:'Điền các số còn thiếu.'})};
G.mental=()=>pick([()=>{const a=rnd(1,8)*10,b=rnd(1,9-a/10)*10;return numQ(big(`${a} + ${b} = ?`),a+b,`${a/10} chục + ${b/10} chục.`)},
  ()=>{const a=rnd(2,9)*100,b=rnd(1,a/100-1)*100;return numQ(big(`${a} − ${b} = ?`),a-b,`${a/100} trăm − ${b/100} trăm.`)},
  ()=>{const a=rnd(1,9)*100;return numQ(big(`1000 − ${a} = ?`),1000-a,`1000 là 10 trăm; 10 trăm − ${a/100} trăm.`)},
  ()=>{const a=rnd(1,9)*10;return numQ(big(`100 − ${a} = ?`),100-a,`100 là 10 chục; 10 chục − ${a/10} chục.`)}])();
G.findASbook=()=>{const s=rnd(25,99),a=rnd(10,s-5);return pick([
  numQ(big(`? + ${a} = ${s}`),s-a,`Muốn tìm số hạng, lấy tổng trừ đi số hạng kia: ${s} − ${a}.`),
  numQ(big(`${a} + ? = ${s}`),s-a,`Muốn tìm số hạng, lấy tổng trừ đi số hạng kia: ${s} − ${a}.`)])};
G.findSub=()=>{const x=rnd(30,99),y=rnd(10,x-5),z=x-y;return pick([
  numQ(big(`? − ${y} = ${z}`),x,`Muốn tìm số bị trừ, lấy hiệu cộng với số trừ: ${z} + ${y}.`),
  numQ(big(`${x} − ? = ${z}`),y,`Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu: ${x} − ${z}.`)])};
const asGen=()=>{const x=rnd(20,99),y=rnd(10,x-5);return pick([[`? + ${y} = ${x}`,x-y],[`${y} + ? = ${x}`,x-y],[`? − ${y} = ${x-y}`,x],[`${x} − ? = ${x-y}`,y]])};
// Bảng điền số: cols = [[hàng1,hàng2,hàng3],…], hide = vị trí ẩn trong mỗi cột
function fillTable(heads,cols,hide){
  const td=(v,h)=>h?'<td><b class="box">?</b></td>':`<td>${v}</td>`,ans=[];
  const rows=heads.map((hd,r)=>`<tr><th>${hd}</th>${cols.map((c,k)=>{const h=hide[k]===r;return td(c[r],h)}).join('')}</tr>`);
  heads.forEach((_,r)=>cols.forEach((c,k)=>{if(hide[k]===r)ans.push(c[r])}));
  return {html:`<table class="tbl">${rows.join('')}</table>`,ans,say:'Điền số thích hợp vào ô trống trong bảng.'};
}
const tableQ=(n,op)=>{const ks=shuffle(range(1,10)).slice(0,4);
  return op==='×'?{...fillTable(['Thừa số','Thừa số','Tích'],ks.map(k=>[n,k,n*k]),ks.map(()=>2)),hint:`Nhớ lại bảng nhân ${n}.`}
    :{...fillTable(['Số bị chia','Số chia','Thương'],ks.map(k=>[n*k,n,k]),ks.map(()=>2)),hint:`Nhớ lại bảng chia ${n}: ${n} nhân mấy bằng số bị chia?`}};

LESSONS.unshift(
/* ---------------- BÀI 1 ---------------- */
{id:1,title:'Ôn tập các số đến 1 000',icon:'🔢',note:note(`${blocksSVG(134)}<p>134 gồm 1 trăm, 3 chục, 4 đơn vị. Đọc là: <b>một trăm ba mươi tư</b>.</p>
  <p>385 = 300 + 80 + 5 &nbsp;·&nbsp; 307 đọc là “ba trăm <b>linh</b> bảy”.</p><p>Số liền trước của 15 là 14, số liền sau của 15 là 16. Ta có 14, 15, 16 là ba số liên tiếp.</p>`),levels:[
  quiz('Đọc, viết số','kp','🔢',()=>uniqQs(6,G.readNum),'Mỗi tấm vuông lớn là 1 trăm, mỗi thanh là 1 chục, mỗi khối nhỏ là 1 đơn vị.'),
  quiz('Trăm, chục, đơn vị','lt','🧱',()=>[numQ('<p class="q-t">Số gồm 3 trăm, 2 chục và 6 đơn vị là <b class="box">?</b></p>',326,'Viết 3 ở hàng trăm, 2 ở hàng chục, 6 ở hàng đơn vị.'),
    numQ('<p class="q-t">Số gồm 5 trăm, 0 chục và 4 đơn vị là <b class="box">?</b></p>',504,'Hàng chục là 0 thì viết chữ số 0 ở giữa.'),...uniqQs(4,G.placeVal)]),
  quiz('Số liền trước, liền sau','lt','👫',()=>[numQ('<div class="qlines"><div>Số liền trước của 426 là <b class="box">?</b></div><div>Số liền sau của 426 là <b class="box">?</b></div></div>',[425,427],['Bớt đi 1.','Thêm 1.']),
    numQ('<div class="qlines"><div>Số liền trước của 999 là <b class="box">?</b></div><div>Số liền sau của 999 là <b class="box">?</b></div></div>',[998,1000],['999 bớt 1.','999 thêm 1 là 1000.']),...uniqQs(3,G.neighbor),G.seq(),G.seq()]),
  compareLv({name:'So sánh số',icon:'⚖️',pairs:[[['505','550'],['399','401'],['100','90 + 9'],['400 + 70 + 5','475'],['738','700 + 30 + 7'],['50 + 1','50 − 1']],
    ()=>rep(2,()=>{const a=num3();return[String(a),String(pick([a+pick([1,10,100]),a-pick([1,10]),a]))]})]}),
  sortLv({name:'Xếp theo cân nặng',icon:'🐷',rounds:[
    [{e:'🐷',n:'Lợn trắng',w:110},{e:'🐗',n:'Lợn đen',w:99},{e:'🐖',n:'Lợn khoang',w:101}],
    ()=>shuffle([{e:'🐐',n:'Dê',w:45},{e:'🐑',n:'Cừu',w:54},{e:'🦌',n:'Hươu',w:180},{e:'🦓',n:'Ngựa vằn',w:320},{e:'🐄',n:'Bò',w:450},{e:'🐻',n:'Gấu nâu',w:305}]).slice(0,4)]}),
]},
/* ---------------- BÀI 2 ---------------- */
{id:2,title:'Ôn tập phép cộng, phép trừ trong phạm vi 1 000',icon:'➕',note:note(`<div class="fig-row"><div class="colc" style="--c:4;font-size:24px"><span></span><span></span><span>8</span><span>4</span><span class="sg">+</span><span></span><span>1</span><span>6</span><span class="ln"></span><span></span><span>1</span><span>0</span><span>0</span></div>
  <div class="colc" style="--c:4;font-size:24px"><span></span><span>1</span><span>0</span><span>0</span><span class="sg">−</span><span></span><span>3</span><span>7</span><span class="ln"></span><span></span><span></span><span>6</span><span>3</span></div></div>
  <p>Đặt tính thẳng cột, tính từ phải sang trái. Nhớ cộng thêm 1 (khi cộng có nhớ) hoặc trừ thêm 1 (khi trừ có nhớ).</p>`),levels:[
  quiz('Tính nhẩm','kp','🧠',()=>uniqQs(6,G.mental),'Tính nhẩm với số tròn chục, tròn trăm: 5 chục + 4 chục = 9 chục, tức là 50 + 40 = 90.'),
  colCalc({name:'Đặt tính (theo mẫu)',icon:'🧮',probs:[[48,'+',52],[75,'+',25],[100,'−',26],[100,'−',45]]}),
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:()=>[[35,'+',48],[146,'+',29],[77,'−',59],[394,'−',158]]}),
  quiz('Điền bảng','lt','📋',()=>[{...fillTable(['Số hạng','Số hạng','Tổng'],[[18,25,43],[66,28,94],[59,13,72],[130,80,210]],[2,2,2,2]),hint:'Tổng = số hạng + số hạng.'},
    {...fillTable(['Số bị trừ','Số trừ','Hiệu'],[[563,137,426],[210,60,150],[100,26,74],[216,132,84]],[2,2,2,2]),hint:'Hiệu = số bị trừ − số trừ.'}]),
  chain({name:'Đường đi của số',icon:'🛤️',chains:[{s:305,steps:[['+',105],['−',205]]},()=>({s:rnd(100,400),steps:[['+',rnd(1,4)*100+rnd(1,9)],['−',rnd(1,9)*10]]})]}),
  selectLv({name:'Những chum tương',icon:'🏺',theme:'balloon',rounds:[
    {cond:'gt',val:150,items:['135 + 48','80 + 27','537 − 361','25 + 125','216 − 109'],prompt:'Những chum nào ghi phép tính có kết quả <b>lớn hơn 150</b>?'},
    ()=>({cond:'lt',val:300,items:rep(5,()=>{const a=rnd(100,450),b=rnd(20,250);return Math.random()<.5?`${a} + ${b}`:`${a+b} − ${b}`}),prompt:'Những chum nào có kết quả <b>bé hơn 300</b>?'})]}),
  words({name:'Giải toán có lời văn',icon:'🐃',fixed:[
    {text:'Con trâu cân nặng 650 kg, con nghé cân nặng 150 kg. Hỏi con trâu và con nghé cân nặng tất cả bao nhiêu ki-lô-gam?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🐃 🐂</div>'},
      ops:['650 + 150','650 − 150','150 + 150'],ans:800,unit:'kg',lead:'Con trâu và con nghé cân nặng là:',opHint:'Tất cả → cộng.'},
    {text:'Con trâu cân nặng 650 kg, con nghé cân nặng 150 kg. Hỏi con trâu nặng hơn con nghé bao nhiêu ki-lô-gam?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🐃 🐂</div>'},
      ops:['650 − 150','650 + 150','150 − 65'],ans:500,unit:'kg',lead:'Con trâu nặng hơn con nghé là:',opHint:'Nặng hơn bao nhiêu → lấy số lớn trừ số bé.'},
    {text:'Ở một trường học, khối lớp Ba có 142 học sinh, khối lớp Bốn có ít hơn khối lớp Ba 18 học sinh. Hỏi cả hai khối lớp có bao nhiêu học sinh?',parts:[
      {q:'a) Khối lớp Bốn có bao nhiêu học sinh?',ops:['142 − 18','142 + 18','18 + 18'],ans:124,unit:'học sinh',lead:'Khối lớp Bốn có số học sinh là:',opHint:'Ít hơn 18 → trừ.'},
      {q:'b) Cả hai khối lớp có bao nhiêu học sinh?',ops:['142 + 124','142 − 124','124 + 18'],ans:266,unit:'học sinh',lead:'Cả hai khối lớp có số học sinh là:',opHint:'Cộng số học sinh hai khối.'}]},
  ]}),
]},
/* ---------------- BÀI 3 ---------------- */
{id:3,title:'Tìm thành phần trong phép cộng, phép trừ',icon:'🔍',note:note(`<p>➕ 10 + <b>?</b> = 14 → Muốn tìm <b>số hạng</b>, ta lấy tổng trừ đi số hạng kia: 14 − 10 = 4.</p>
  <p>➖ <b>?</b> − 5 = 3 → Muốn tìm <b>số bị trừ</b>, ta lấy hiệu cộng với số trừ: 3 + 5 = 8.</p>
  <p>➖ 8 − <b>?</b> = 3 → Muốn tìm <b>số trừ</b>, ta lấy số bị trừ trừ đi hiệu: 8 − 3 = 5.</p>`),levels:[
  quiz('Tìm số hạng','kp','🍏',()=>[numQ(big('? + 20 = 35'),15,'35 − 20.'),numQ(big('? + 15 = 25'),10,'25 − 15.'),numQ(big('14 + ? = 28'),14,'28 − 14.'),...uniqQs(3,G.findASbook)],
    'Một túi có 14 quả táo, trong đó 10 quả táo xanh. Số táo đỏ là 14 − 10 = 4. Muốn tìm một số hạng, ta lấy tổng trừ đi số hạng kia.'),
  quiz('Tìm số bị trừ, số trừ','kp','🔴',()=>[numQ(big('? − 20 = 40'),60,'Lấy hiệu cộng số trừ: 40 + 20.'),numQ(big('? − 12 = 25'),37,'25 + 12.'),numQ(big('? − 18 = 42'),60,'42 + 18.'),
    numQ(big('50 − ? = 10'),40,'Lấy số bị trừ trừ đi hiệu: 50 − 10.'),numQ(big('35 − ? = 15'),20,'35 − 15.'),numQ(big('51 − ? = 18'),33,'51 − 18.')],
    'Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ. Muốn tìm số trừ, ta lấy số bị trừ trừ đi hiệu.'),
  quiz('Điền bảng','lt','📋',()=>[{...fillTable(['Số hạng','Số hạng','Tổng'],[[18,12,30],[22,16,38],[21,33,54],[22,18,40],[60,110,170]],[2,0,1,0,1]),hint:'Số hạng = tổng − số hạng kia.'},
    {...fillTable(['Số bị trừ','Số trừ','Hiệu'],[[70,20,50],[39,14,25],[34,22,12],[44,26,18],[64,27,37]],[2,0,1,0,1]),hint:'Số bị trừ = hiệu + số trừ; số trừ = số bị trừ − hiệu.'}]),
  quiz('Chọn câu trả lời đúng','lt','🅰️',()=>[
    {html:'<p class="q-t">Biết số trừ là 36, hiệu là 25, số bị trừ là:</p>',choices:[51,11,61],ans:61,abcd:true,cls:'wide',hint:'Số bị trừ = hiệu + số trừ = 25 + 36.'},
    {html:'<p class="q-t">Biết số bị trừ là 52, hiệu là 28, số trừ là:</p>',choices:[80,34,24],ans:24,abcd:true,cls:'wide',hint:'Số trừ = số bị trừ − hiệu = 52 − 28.'},
    ...uniqQs(2,()=>{const t=rnd(10,40),h=rnd(10,50);return{html:`<p class="q-t">Biết số trừ là ${t}, hiệu là ${h}, số bị trừ là:</p>`,key:t+'/'+h,choices:mc(t+h,[h-t>0?h-t:t+h+10,t+h-10,t+h+1]),ans:t+h,abcd:true,cls:'wide',hint:`Số bị trừ = hiệu + số trừ = ${h} + ${t}.`}})]),
  race({name:'Đua tìm số',icon:'🏎️',gen:asGen}),
  words({name:'Giải toán có lời văn',icon:'⛵',fixed:[
    {text:'Hai bến có tất cả 65 thuyền để chở khách đi tham quan, trong đó bến thứ nhất có 40 thuyền. Hỏi bến thứ hai có bao nhiêu thuyền?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">⛵⛵⛵ ⛵⛵</div>'},
      ops:['65 − 40','65 + 40','40 − 25'],ans:25,unit:'thuyền',lead:'Bến thứ hai có số thuyền là:',opHint:'Tìm số hạng: lấy tổng trừ đi số hạng kia.'},
    {text:'Lúc đầu có 64 con vịt ở trên bờ. Lúc sau có một số con vịt xuống ao bơi lội, số vịt còn lại ở trên bờ là 24 con. Hỏi có bao nhiêu con vịt xuống ao?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">🦆🦆🦆 ➜ 🌊</div>'},
      ops:['64 − 24','64 + 24','24 − 4'],ans:40,unit:'con vịt',lead:'Số con vịt xuống ao là:',opHint:'Tìm số trừ: lấy số bị trừ trừ đi hiệu.'},
    {text:'Việt có một số viên bi. Việt đã cho bạn 5 viên, còn lại 3 viên bi. Hỏi lúc đầu Việt có bao nhiêu viên bi?',vis:{type:'pile',total:8,item:'🔴'},
      ops:['3 + 5','5 − 3','5 + 5'],ans:8,unit:'viên bi',lead:'Số bi lúc đầu Việt có là:',opHint:'Tìm số bị trừ: lấy hiệu cộng với số trừ.'},
  ]}),
]},
/* ---------------- BÀI 4 ---------------- */
{id:4,title:'Ôn tập bảng nhân 2; 5, bảng chia 2; 5',icon:'✋',note:()=>tableNote(2)+tableNote(5),levels:[
  quiz('Bảng nhân 2, bảng chia 2','kp','2️⃣',()=>[tableQ(2,'×'),tableQ(2,':')],'Điền số vào bảng. Nhớ lại bảng nhân 2 và bảng chia 2 nhé!'),
  frog(2,{name:'Gà con qua suối',icon:'🐥',hero:'🐥'}),
  quiz('Bảng nhân 5, bảng chia 5','kp','5️⃣',()=>[tableQ(5,'×'),tableQ(5,':')],'Điền số vào bảng. Nhớ lại bảng nhân 5 và bảng chia 5 nhé!'),
  frog(5,{name:'Sóc con qua suối',icon:'🐿️',hero:'🐿️'}),
  selectLv({name:'Rô-bốt hái bưởi',icon:'🍈',theme:'flower',rounds:[
    {cond:'max',items:['5 × 2','50 : 5','25 : 5','5 × 1','2 × 5','20 : 5'],prompt:'Sọt nào sẽ có nhiều bưởi nhất? Chọn <b>tất cả</b> quả bưởi bỏ vào sọt <b>10</b>.'},
    {cond:'min',items:['5 × 2','50 : 5','25 : 5','5 × 1','2 × 5','20 : 5'],prompt:'Quả bưởi nào bỏ vào sọt có số <b>bé nhất</b>?'}]}),
  compareLv({name:'Cân đĩa so sánh',icon:'⚖️',pairs:[[['40 : 5','7'],['45 : 5','10'],['5 × 2','50 : 5']],()=>rep(3,()=>{const a=rnd(1,10),b=rnd(1,10),d=pick([2,5]);return[`${pick([2,5])} × ${a}`,`${d*b} : ${d}`]})]}),
  race({name:'Đua xe tốc độ',icon:'🏎️',gen:()=>tableGen(pick([2,5]))()}),
  words({name:'Giải toán có lời văn',icon:'🪑',fixed:[
    {text:'Có 18 học sinh ngồi vào các bàn học, mỗi bàn 2 bạn. Hỏi có bao nhiêu bàn học như vậy?',vis:{type:'pile',total:18,item:'🧒'},after:{type:'groups',n:9,per:2,item:'🧒',head:'🪑'},
      ops:['18 : 2','18 × 2','18 − 2'],ans:9,unit:'bàn học',lead:'Số bàn học là:',opHint:'Mỗi bàn 2 bạn → chia 18 cho 2.'},
    {text:'Trong ngày hội đấu vật đầu xuân có 10 cặp đô vật tham gia thi đấu. Hỏi có bao nhiêu đô vật tham gia thi đấu?',vis:{type:'groups',n:10,per:2,item:'🤼'},
      ops:['2 × 10','10 + 2','10 : 2'],ans:20,unit:'đô vật',lead:'Số đô vật tham gia thi đấu là:',opHint:'Mỗi cặp có 2 người → 2 được lấy 10 lần.'},
    {text:'Cửa hàng có 50 kg gạo nếp. Người ta chia đều số gạo nếp đó vào 5 túi. Hỏi mỗi túi có bao nhiêu ki-lô-gam gạo nếp?',vis:{type:'groups',n:5,per:1,item:'🛍️'},
      ops:['50 : 5','50 × 5','50 − 5'],ans:10,unit:'kg',lead:'Mỗi túi có số gạo nếp là:',opHint:'Chia đều vào 5 túi → 50 : 5.'},
  ]}),
]},
);
