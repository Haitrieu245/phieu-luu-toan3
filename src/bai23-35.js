/* ================= BÀI 23–35 ================= */
/* ---- nhân, chia trong phạm vi 100 ---- */
const mul2=(carry)=>{for(let g=0;g<200;g++){const a=rnd(11,49),b=rnd(2,6),p=a*b,c=(a%10)*b>9;if(p<100&&(carry==null||c===carry))return[a,'×',b]}return[12,'×',3]};
const div2=(exact)=>{for(let g=0;g<200;g++){const d=rnd(2,9),q=rnd(11,Math.floor(99/d)),r=exact?0:rnd(1,d-1),x=d*q+r;if(x<100&&q>=10)return[x,':',d]}return[48,':',2]};
G.mulMental=()=>pick([()=>{const a=rnd(1,4)*10,b=rnd(2,9);return a*b<100?numQ(big(`${a} × ${b} = ?`),a*b,`${a/10} chục × ${b} = ${a/10*b} chục.`):null},
  ()=>{const [a,,b]=mul2();return numQ(big(`${a} × ${b} = ?`),a*b,`Nhân hàng đơn vị trước: ${a%10} × ${b}, rồi hàng chục: ${Math.floor(a/10)} × ${b}.`)}])()||G.mulMental();
const mulGen=()=>{const [a,,b]=mul2();return[`${a} × ${b} = ?`,a*b]};
const divGen=()=>{const [x,,d]=div2(true);return[`${x} : ${d} = ?`,x/d]};
G.remDiv=()=>{const d=rnd(2,9),q=rnd(2,9),r=rnd(1,d-1),x=d*q+r;return numQ(bigAll(`${x} : ${d} = ? (dư ?)`),[q,r],[`${d} × ${q} = ${d*q}, ${d} × ${q+1} = ${d*(q+1)} lớn hơn ${x}. Vậy được ${q}.`,`${x} − ${d*q} = ${r}.`])};
G.remKind=()=>{const d=rnd(2,9),q=rnd(2,9),r=Math.random()<.5?0:rnd(1,d-1),x=d*q+r;
  return {html:big(`${x} : ${d}`),key:x+':'+d,choices:['Chia hết','Chia có dư'],ans:r?'Chia có dư':'Chia hết',cls:'small',say:`Phép chia ${x} chia ${d} là phép chia hết hay phép chia có dư?`,hint:`${d} × ${q} = ${d*q}${r?`, còn thừa ${r}`:''}.`}};
G.remMax=()=>{const d=rnd(3,9);return pick([
  numQ(`<p class="q-t">Trong phép chia cho ${d}, số dư lớn nhất có thể là <b class="box">?</b></p>`,d-1,'Số dư luôn bé hơn số chia.'),
  {html:`<p class="q-t">Phép chia cho ${d} có thể có số dư là số nào?</p>`,choices:shuffle([d-1,d,d+1,d+2]),ans:d-1,hint:'Số dư luôn bé hơn số chia.'}])};
G.divMental=()=>{const d=rnd(2,4),q=rnd(1,Math.floor(9/d))*10;return numQ(big(`${d*q} : ${d} = ?`),q,`${d*q/10} chục : ${d} = ${q/10} chục.`)};

/* ---- gấp, giảm, so sánh ---- */
G.timesTape=()=>{const a=rnd(2,9),k=rnd(2,5),u=pick(['cm','kg','l']);return numQ(`${tapeSVG([{name:'A',n:1,lab:`${a} ${u}`},{name:'B',n:k,tot:`? ${u}`}])}<p class="q-t">B gấp ${k} lần A. B = <b class="box">?</b> ${u}.</p>`,a*k,`Gấp ${a} lên ${k} lần: ${a} × ${k}.`,{say:`Số A là ${a}. B gấp ${k} lần A. B bằng bao nhiêu?`})};
G.timesUp=()=>{const a=rnd(2,9),k=rnd(2,9);return pick([
  numQ(`<p class="q-t">Gấp ${a} lên ${k} lần được <b class="box">?</b></p>`,a*k,`Muốn gấp một số lên nhiều lần, lấy số đó nhân với số lần: ${a} × ${k}.`),
  numQ(`<div class="qlines"><div>${a} thêm ${k} đơn vị → <b class="box">?</b></div><div>${a} gấp lên ${k} lần → <b class="box">?</b></div></div>`,[a+k,a*k],[`Thêm ${k} đơn vị: ${a} + ${k}.`,`Gấp lên ${k} lần: ${a} × ${k}.`],{say:`${a} thêm ${k} đơn vị được bao nhiêu? ${a} gấp lên ${k} lần được bao nhiêu?`})])};
G.reduceTape=()=>{const q=rnd(2,9),k=rnd(2,5),u=pick(['cm','kg','l']);return numQ(`${tapeSVG([{name:'A',n:k,tot:`${q*k} ${u}`},{name:'B',n:1,tot:`? ${u}`}])}<p class="q-t">${q*k} ${u} giảm đi ${k} lần được B. B = <b class="box">?</b> ${u}.</p>`,q,`Giảm ${q*k} đi ${k} lần: ${q*k} : ${k}.`,{say:`${q*k} giảm đi ${k} lần được bao nhiêu?`})};
G.reduce=()=>{const q=rnd(2,9),k=rnd(2,9),a=q*k;return pick([
  numQ(`<p class="q-t">Giảm ${a} đi ${k} lần được <b class="box">?</b></p>`,q,`Muốn giảm một số đi nhiều lần, lấy số đó chia cho số lần: ${a} : ${k}.`),
  numQ(`<div class="qlines"><div>${a} giảm đi ${k} đơn vị → <b class="box">?</b></div><div>${a} giảm đi ${k} lần → <b class="box">?</b></div></div>`,[a-k,q],[`Giảm ${k} đơn vị: ${a} − ${k}.`,`Giảm ${k} lần: ${a} : ${k}.`],{say:`${a} giảm đi ${k} đơn vị được bao nhiêu? ${a} giảm đi ${k} lần được bao nhiêu?`})])};
const timesGen=()=>{const a=rnd(2,9),k=rnd(2,9);return Math.random()<.5?[`Gấp ${a} lên ${k} lần = ?`,a*k]:[`Giảm ${a*k} đi ${k} lần = ?`,a]};
G.howMany=()=>{const b=rnd(2,9),k=rnd(2,9),a=b*k,u=pick(['cm','kg','quả','bạn']);return pick([
  numQ(`${tapeSVG([{name:'Lớn',n:k,lab:`${b} ${u}`,tot:`${a} ${u}`},{name:'Bé',n:1,tot:`${b} ${u}`}])}<p class="q-t">${a} ${u} gấp <b class="box">?</b> lần ${b} ${u}.</p>`,k,`Muốn biết số lớn gấp mấy lần số bé, lấy số lớn chia cho số bé: ${a} : ${b}.`,{say:`${a} gấp mấy lần ${b}?`}),
  numQ(`<p class="q-t">Số lớn là ${a}, số bé là ${b}.<br>Số lớn gấp <b class="box">?</b> lần số bé.</p>`,k,`Lấy số lớn chia cho số bé: ${a} : ${b}.`)])};

/* ---- đo lường ---- */
G.readMM=()=>{const mm=rnd(12,78),e=pick(['✏️','🐛','🔑','🖍️','📎']);return numQ(`${rulerMMSVG(mm,e)}<p class="q-t">Vật dài <b class="box">?</b> mm.</p>`,mm,`Mỗi vạch nhỏ là 1 mm, mỗi số là 1 cm = 10 mm. ${Math.floor(mm/10)} cm là ${Math.floor(mm/10)*10} mm, đếm thêm ${mm%10} vạch nhỏ.`,{say:'Vật dài bao nhiêu mi-li-mét?'})};
G.convMM=()=>{const a=rnd(2,9),b=rnd(1,9);return pick([
  numQ(big('1 cm = ? mm'),10,'1 cm có 10 vạch nhỏ, mỗi vạch 1 mm.'),
  numQ(big(`${a} cm = ? mm`),a*10,`1 cm = 10 mm, nên ${a} cm = ${a} × 10 mm.`),
  numQ(big(`${a*10} mm = ? cm`),a,`10 mm = 1 cm, nên ${a*10} mm = ${a*10} : 10 cm.`),
  numQ(big('1 m = ? mm'),1000,'1 m = 100 cm, 1 cm = 10 mm → 1 m = 1000 mm.'),
  numQ(big('1 dm = ? mm'),100,'1 dm = 10 cm = 100 mm.'),
  numQ(big(`${a} cm ${b} mm = ? mm`),a*10+b,`${a} cm = ${a*10} mm, thêm ${b} mm.`)])};
G.convG=()=>{const a=rnd(1,9)*100,b=rnd(1,9)*50;return pick([
  numQ(big('1 kg = ? g'),1000,'1 ki-lô-gam bằng 1000 gam.'),
  numQ(big(`${a} g + ${b} g = ? g`),a+b,`Cộng như cộng số: ${a} + ${b}.`),
  numQ(big(`1 kg − ${a} g = ? g`),1000-a,`Đổi 1 kg = 1000 g, rồi lấy 1000 − ${a}.`),
  numQ(big(`${a/100*20} g × 3 = ? g`),a/100*60,`${a/100*20} × 3 = ?`)])};
G.convML=()=>{const a=rnd(1,9)*100,b=rnd(1,8)*50;return pick([
  numQ(big('1 l = ? ml'),1000,'1 lít bằng 1000 mi-li-lít.'),
  numQ(big(`${a} ml + ${b} ml = ? ml`),a+b,`${a} + ${b} = ?`),
  numQ(big(`1 l − ${a} ml = ? ml`),1000-a,`Đổi 1 l = 1000 ml, rồi lấy 1000 − ${a}.`),
  numQ(big(`2 l = ? ml`),2000,'1 l = 1000 ml nên 2 l = 2000 ml.')])};
// so sánh hai số đo khác đơn vị. type: mm | g | ml | m (bỏ trống: ngẫu nhiên)
G.cmpUnit=(type)=>{
  const T=type||pick(['mm','g','ml','m']);let l,r,vl,vr,h;
  if(T==='mm'){const a=rnd(2,9),m=a*10+pick([-3,0,4]);[l,r,vl,vr,h]=[`${m} mm`,`${a} cm`,m,a*10,`${a} cm = ${a*10} mm.`]}
  if(T==='g'){const g=pick([900,1000,1100,950,999]);[l,r,vl,vr,h]=['1 kg',`${g} g`,1000,g,'1 kg = 1000 g.']}
  if(T==='ml'){const m=pick([999,1000,800,1200]);[l,r,vl,vr,h]=[`${m} ml`,'1 l',m,1000,'1 l = 1000 ml.']}
  if(T==='m'){const a=rnd(1,3),m=a*1000+pick([-100,0,100]);[l,r,vl,vr,h]=[`${a} m`,`${m} mm`,a*1000,m,`${a} m = ${a*1000} mm.`]}
  const sg=vl>vr?'>':vl<vr?'<':'=';
  return {html:`<p class="qbig" style="font-size:32px">${l} <span class="box">?</span> ${r}</p>`,key:l+r,say:`So sánh ${l} và ${r}.`,choices:['>','<','='],ans:sg,cls:'sym',hint:'Đổi về cùng đơn vị rồi so sánh: '+h}};
G.readG=()=>{const g=rnd(1,19)*50,e=pick(['🍐','🥭','🍋','🧀','🍞','🥥']);return numQ(`${gScaleSVG(g,e)}<p class="q-t">Vật trên cân nặng <b class="box">?</b> g.</p>`,g,'Mỗi vạch là 50 g. Nhìn kim đỏ chỉ vào vạch nào.',{say:'Vật trên cân nặng bao nhiêu gam?'})};
G.balance=()=>{const ws=shuffle([500,200,200,100,50,20,10]).slice(0,rnd(2,3)).sort((a,b)=>b-a),e=pick(['🍊','🍎','🥕','🧅','🍌']);
  return numQ(`${balanceSVG(e,ws)}<p class="q-t">Cân thăng bằng. Vật bên trái nặng <b class="box">?</b> g.</p>`,ws.reduce((a,b)=>a+b,0),`Cộng các quả cân: ${ws.join(' + ')}.`,{say:'Cân thăng bằng. Vật bên trái nặng bao nhiêu gam?'})};
G.readML=()=>{const cap=pick([500,1000]),ml=cap===500?rnd(1,9)*50:rnd(1,9)*100;return numQ(`${jugMLSVG(ml,cap)}<p class="q-t">Trong ca có <b class="box">?</b> ml nước.</p>`,ml,`Mỗi vạch là ${cap===500?50:100} ml. Nhìn mặt nước ngang vạch nào.`,{say:'Trong ca có bao nhiêu mi-li-lít nước?'})};
G.readT=()=>{const t=rnd(5,24)*2;return numQ(`${thermoSVG(t)}<p class="q-t">Nhiệt kế chỉ <b class="box">?</b> °C.</p>`,t,'Mỗi vạch nhỏ là 1 °C. Đọc số ngay dưới mức chất lỏng màu đỏ rồi đếm thêm.',{say:'Nhiệt kế chỉ bao nhiêu độ C?'})};
G.tempSense=()=>pick([
  {html:'<p class="q-t">Nhiệt độ cơ thể người khoẻ mạnh khoảng:</p>',choices:['37 °C','17 °C','73 °C'],ans:'37 °C',cls:'small',hint:'Thân nhiệt bình thường khoảng 37 độ C.'},
  {html:'<p class="q-t">Nước đang sôi có nhiệt độ khoảng:</p>',choices:['10 °C','100 °C','37 °C'],ans:'100 °C',cls:'small',hint:'Nước sôi ở 100 độ C.'},
  {html:'<p class="q-t">Nước đá đang tan có nhiệt độ khoảng:</p>',choices:['0 °C','30 °C','100 °C'],ans:'0 °C',cls:'small',hint:'Nước đá tan ở 0 độ C.'},
  {html:'<p class="q-t">Một ngày hè nóng bức có nhiệt độ khoảng:</p>',choices:['5 °C','35 °C','85 °C'],ans:'35 °C',cls:'small',hint:'Ngày hè nóng khoảng trên 30 độ C.'},
  {html:'<p class="q-t">Một ngày đông rét ở miền Bắc có nhiệt độ khoảng:</p>',choices:['10 °C','40 °C','90 °C'],ans:'10 °C',cls:'small',hint:'Trời rét thì nhiệt độ thấp.'},
]);
G.tempDiff=()=>{const a=rnd(8,15)*2,b=a+rnd(2,8);return numQ(`<div class="fig-row"><figure>${thermoSVG(a,50,150)}Buổi sáng</figure><figure>${thermoSVG(b,50,150)}Buổi trưa</figure></div><p class="q-t">Buổi trưa nóng hơn buổi sáng <b class="box">?</b> °C.</p>`,b-a,`Đọc hai nhiệt kế: ${a} °C và ${b} °C, rồi lấy ${b} − ${a}.`,{say:'Buổi trưa nóng hơn buổi sáng bao nhiêu độ C?'})};
const ESTI=[
  ['Chiều dài con kiến khoảng 5','mm',['cm','m']],['Quyển sách Toán dày khoảng 8','mm',['cm','dm']],['Chiếc bút chì dài khoảng 15','cm',['mm','m']],
  ['Quả trứng gà nặng khoảng 50','g',['kg','l']],['Con gà nặng khoảng 2','kg',['g','l']],['Quả chanh nặng khoảng 60','g',['kg','ml']],
  ['Lọ thuốc nhỏ mắt chứa khoảng 10','ml',['l','g']],['Cái xô chứa được khoảng 10','l',['ml','kg']],['Cốc nước chứa khoảng 250','ml',['l','kg']],
  ['Nhiệt độ trong phòng khoảng 25','°C',['kg','ml']],
];
G.unitPick=(re)=>{const [t,u,w]=pick(re?ESTI.filter(e=>re.test(e[1])):ESTI);return {html:`<p class="q-t">${t} <span class="box">?</span></p>`,key:t,say:`${t} gì? Chọn đơn vị thích hợp.`,choices:shuffle([u,...w]),ans:u,cls:'small',hint:'Hãy tưởng tượng đồ vật thật và so với đơn vị đo.'}};
G.tool=()=>{const T=[['nhiệt độ','🌡️ Nhiệt kế'],['cân nặng','⚖️ Cái cân'],['lượng nước trong chai','🥛 Ca có vạch chia'],['độ dài cái bàn','📏 Thước']],[w,a]=pick(T);
  return {html:`<p class="q-t">Dùng dụng cụ nào để đo ${w}?</p>`,key:w,choices:shuffle(T.map(x=>x[1])),ans:a,cls:'wide',hint:'Mỗi đại lượng có một dụng cụ đo riêng.'}};

/* ---- bài học ---- */
LESSONS.push(
/* ---------------- BÀI 23 ---------------- */
{id:23,title:'Nhân số có hai chữ số với số có một chữ số',icon:'✖️',note:note(`<div class="colc-wrap"><div class="colc" style="--c:3;font-size:26px"><span></span><span>2</span><span>6</span><span class="sg">×</span><span></span><span>3</span><span class="ln"></span><span></span><span>7</span><span>8</span></div></div>
  <p>Nhân từ phải sang trái: 3 nhân 6 bằng 18, viết 8 nhớ 1. 3 nhân 2 bằng 6, thêm 1 bằng 7, viết 7.</p><p>Vậy 26 × 3 = 78.</p>`),levels:[
  colCalc({name:'Đặt tính (không nhớ)',icon:'🧮',probs:()=>[[12,'×',3],[21,'×',4],...rep(2,()=>mul2(false))]}),
  colCalc({name:'Đặt tính (có nhớ)',icon:'🧮',probs:()=>[[26,'×',3],[15,'×',5],...rep(3,()=>mul2(true))]}),
  quiz('Nhân nhẩm','lt','🧠',()=>uniqQs(6,G.mulMental)),
  race({name:'Đua xe tốc độ',icon:'🏎️',gen:mulGen}),
  words({name:'Giải toán có lời văn',icon:'📦',fixed:[
    {text:'Mỗi hộp có 12 chiếc bút chì. Hỏi 4 hộp như vậy có bao nhiêu chiếc bút chì?',vis:{type:'groups',n:4,per:12,item:'✏️',head:'📦'},
      ops:['12 × 4','12 + 4','12 : 4'],ans:48,unit:'chiếc bút chì',lead:'Số bút chì ở 4 hộp là:',opHint:'4 hộp, mỗi hộp 12 chiếc → 12 được lấy 4 lần.'},
    {text:'Mỗi bao gạo nặng 25 kg. Hỏi 3 bao gạo như vậy nặng bao nhiêu ki-lô-gam?',vis:{type:'groups',n:3,per:1,item:'🌾 25 kg'},
      ops:['25 × 3','25 + 3','25 − 3'],ans:75,unit:'kg',lead:'3 bao gạo nặng là:',opHint:'3 bao, mỗi bao 25 kg → 25 × 3.'},
    {text:'Một tuần lễ có 7 ngày. Hỏi 12 tuần lễ có bao nhiêu ngày?',
      ops:['7 × 12','12 + 7','12 − 7'],ans:84,unit:'ngày',lead:'12 tuần lễ có số ngày là:',opHint:'12 tuần, mỗi tuần 7 ngày → 7 × 12 (= 12 × 7).'},
  ]}),
]},
/* ---------------- BÀI 24 ---------------- */
{id:24,title:'Gấp một số lên một số lần',icon:'🔼',note:note(`${tapeSVG([{name:'A',n:1,lab:'4 cm'},{name:'B',n:3,tot:'? cm'}])}
  <p>Muốn gấp một số lên nhiều lần, ta lấy số đó <b>nhân</b> với số lần. Gấp 4 lên 3 lần: 4 × 3 = 12.</p><p>Chú ý: “thêm 3 đơn vị” là cộng 3; “gấp lên 3 lần” là nhân 3.</p>`),levels:[
  quiz('Sơ đồ gấp lên','kp','📊',()=>uniqQs(5,G.timesTape),'Muốn gấp một số lên nhiều lần, ta lấy số đó nhân với số lần.'),
  quiz('Gấp lên hay thêm?','lt','🔼',()=>uniqQs(6,G.timesUp)),
  chain({name:'Máy gấp số',icon:'⚙️',chains:[{s:2,steps:[['×',3],['×',2]]},()=>({s:rnd(2,4),steps:[['×',rnd(2,3)],['×',2]]}),()=>({s:rnd(2,5),steps:[['×',2],['+',rnd(2,9)]]})]}),
  words({name:'Giải toán có lời văn',icon:'🍎',fixed:[
    {text:'Lan có 6 quả táo. Số táo của Mai gấp 3 lần số táo của Lan. Hỏi Mai có bao nhiêu quả táo?',vis:{type:'html',html:tapeSVG([{name:'Lan',n:1,lab:'6 quả'},{name:'Mai',n:3,tot:'? quả'}])},
      ops:['6 × 3','6 + 3','6 : 3'],ans:18,unit:'quả táo',lead:'Số táo của Mai là:',opHint:'Gấp 6 lên 3 lần → 6 × 3.'},
    {text:'Bao gạo nhỏ nặng 15 kg. Bao gạo to nặng gấp 3 lần bao gạo nhỏ. Hỏi bao gạo to nặng bao nhiêu ki-lô-gam?',vis:{type:'html',html:tapeSVG([{name:'Nhỏ',n:1,lab:'15 kg'},{name:'To',n:3,tot:'? kg'}])},
      ops:['15 × 3','15 + 3','15 − 3'],ans:45,unit:'kg',lead:'Bao gạo to nặng là:',opHint:'Gấp 15 lên 3 lần.'},
    {text:'Thùng nhỏ chứa 8 l nước. Thùng to chứa gấp 4 lần thùng nhỏ. Hỏi thùng to chứa bao nhiêu lít nước?',
      ops:['8 × 4','8 + 4','8 : 4'],ans:32,unit:'l',lead:'Thùng to chứa số lít nước là:',opHint:'Gấp 8 lên 4 lần.'},
  ]}),
]},
/* ---------------- BÀI 25 ---------------- */
{id:25,title:'Phép chia hết, phép chia có dư',icon:'🍬',note:note(`<p>12 : 4 = 3 là <b>phép chia hết</b> (không còn thừa).</p><p>13 : 4 = 3 (dư 1) là <b>phép chia có dư</b>.</p><p>⚠️ Số dư luôn <b>bé hơn</b> số chia.</p>`),levels:[
  quiz('Xếp kẹo vào đĩa','kp','🍬',()=>uniqQs(4,()=>{const d=rnd(2,5),q=rnd(2,4),r=rnd(0,d-1),x=d*q+r;
    return {html:`${vis({type:'groups',n:q,per:d,item:'🍬',head:'🍽️'})}${r?`<div class="pile">${'<span>🍬</span>'.repeat(r)}</div>`:''}<p class="q-t">Có ${x} cái kẹo, xếp mỗi đĩa ${d} cái.<br>Được <b class="box">?</b> đĩa, còn thừa <b class="box">?</b> cái kẹo.</p>`,
      say:`Có ${x} cái kẹo, xếp mỗi đĩa ${d} cái. Được mấy đĩa, còn thừa mấy cái?`,ans:[q,r],hint:['Đếm số đĩa đã xếp đầy.','Đếm số kẹo còn lại bên ngoài.'],explain:`${x} : ${d} = ${q}${r?` (dư ${r})`:''}.`}}),'Chia đều, nếu còn thừa ra thì đó là số dư.'),
  quiz('Tìm thương và số dư','lt','➗',()=>uniqQs(6,G.remDiv)),
  quiz('Chia hết hay có dư?','lt','❓',()=>shuffle([...uniqQs(4,G.remKind),...uniqQs(2,G.remMax)])),
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:()=>[[29,':',5],[19,':',3],...rep(2,()=>{const d=rnd(3,9),q=rnd(2,9);return[d*q+rnd(1,d-1),':',d]})]}),
  words({name:'Giải toán có lời văn',icon:'🧵',fixed:[
    {direct:true,text:'Có 17 m vải. May mỗi bộ quần áo hết 3 m vải. Hỏi may được nhiều nhất bao nhiêu bộ quần áo và còn thừa mấy mét vải?',
      options:['5 bộ, thừa 2 m','6 bộ, thừa 1 m','5 bộ, thừa 3 m','4 bộ, thừa 5 m'],ans:'5 bộ, thừa 2 m',opHint:'Tính 17 : 3. Số dư phải bé hơn 3.',explain:'17 : 3 = 5 (dư 2). May được nhiều nhất <b>5 bộ</b>, còn thừa <b>2 m</b> vải.'},
    {direct:true,text:'Có 30 bạn đi chèo thuyền, mỗi thuyền chở được 4 bạn. Hỏi cần ít nhất bao nhiêu thuyền để chở hết các bạn?',vis:{type:'pile',total:30,item:'🧒'},
      options:['7 thuyền','8 thuyền','6 thuyền','9 thuyền'],ans:'8 thuyền',opHint:'30 : 4 = 7 (dư 2). Hai bạn còn lại cũng cần một thuyền!',explain:'30 : 4 = 7 (dư 2). 7 thuyền chở 28 bạn, còn 2 bạn cần thêm 1 thuyền: 7 + 1 = <b>8 thuyền</b>.'},
  ]}),
]},
/* ---------------- BÀI 26 ---------------- */
{id:26,title:'Chia số có hai chữ số cho số có một chữ số',icon:'➗',note:note(`<div class="colc-wrap"><div class="divc" style="font-size:26px"><div class="divl" style="--c:2;grid-auto-rows:36px"><span>6</span><span>5</span><span>1</span><span>5</span><span></span><span>0</span></div><div class="divr"><span class="dv-d" style="height:36px">5</span><span class="dv-q">13</span></div></div></div>
  <p>Chia từ trái sang phải: 6 chia 5 được 1, viết 1; 1 nhân 5 bằng 5; 6 trừ 5 bằng 1. Hạ 5, được 15; 15 chia 5 được 3, viết 3; 3 nhân 5 bằng 15; 15 trừ 15 bằng 0.</p><p>Vậy 65 : 5 = 13.</p>`),levels:[
  colCalc({name:'Chia hết',icon:'🧮',probs:()=>[[48,':',2],[65,':',5],...rep(2,()=>div2(true))]}),
  colCalc({name:'Chia có dư',icon:'🧮',probs:()=>[[47,':',3],...rep(2,()=>div2(false))]}),
  quiz('Chia nhẩm','lt','🧠',()=>uniqQs(5,G.divMental)),
  race({name:'Đua thuyền',icon:'🚤',me:'🚤',rival:'⛵',gen:divGen}),
  words({name:'Giải toán có lời văn',icon:'📚',fixed:[
    {text:'Có 84 quyển vở chia đều cho 4 nhóm. Hỏi mỗi nhóm được bao nhiêu quyển vở?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">📚📚📚📚</div>'},
      ops:['84 : 4','84 × 4','84 − 4'],ans:21,unit:'quyển vở',lead:'Số vở mỗi nhóm được là:',opHint:'Chia đều cho 4 nhóm → 84 : 4.'},
    {text:'Một cuộn dây dài 96 m được cắt thành 8 đoạn bằng nhau. Hỏi mỗi đoạn dây dài bao nhiêu mét?',
      ops:['96 : 8','96 − 8','96 × 8'],ans:12,unit:'m',lead:'Mỗi đoạn dây dài là:',opHint:'Cắt thành 8 đoạn bằng nhau → 96 : 8.'},
    {direct:true,text:'Có 75 quả trứng, xếp vào các khay, mỗi khay 6 quả. Hỏi xếp được nhiều nhất bao nhiêu khay đầy và còn thừa mấy quả trứng?',
      options:['12 khay, thừa 3 quả','13 khay, thừa 3 quả','12 khay, thừa 6 quả','11 khay, thừa 9 quả'],ans:'12 khay, thừa 3 quả',opHint:'Đặt tính 75 : 6. Số dư phải bé hơn 6.',explain:'75 : 6 = 12 (dư 3). Xếp được <b>12 khay</b>, còn thừa <b>3 quả</b>.'},
  ]}),
]},
/* ---------------- BÀI 27 ---------------- */
{id:27,title:'Giảm một số đi một số lần',icon:'🔽',note:note(`${tapeSVG([{name:'A',n:3,tot:'12 cm'},{name:'B',n:1,tot:'? cm'}])}
  <p>Muốn giảm một số đi nhiều lần, ta lấy số đó <b>chia</b> cho số lần. Giảm 12 đi 3 lần: 12 : 3 = 4.</p><p>Chú ý: “giảm đi 3 đơn vị” là trừ 3; “giảm đi 3 lần” là chia 3.</p>`),levels:[
  quiz('Sơ đồ giảm đi','kp','📊',()=>uniqQs(5,G.reduceTape),'Muốn giảm một số đi nhiều lần, ta lấy số đó chia cho số lần.'),
  quiz('Giảm đi mấy lần hay mấy đơn vị?','lt','🔽',()=>uniqQs(6,G.reduce)),
  race({name:'Đua gấp – giảm',icon:'🏇',me:'🏇',rival:'🐎',gen:timesGen}),
  words({name:'Giải toán có lời văn',icon:'🥚',fixed:[
    {text:'Mẹ có 24 quả trứng. Sau khi làm bánh, số trứng giảm đi 4 lần. Hỏi mẹ còn lại bao nhiêu quả trứng?',vis:{type:'pile',total:24,item:'🥚'},after:{type:'pile',total:6,item:'🥚'},
      ops:['24 : 4','24 − 4','24 × 4'],ans:6,unit:'quả trứng',lead:'Số trứng còn lại là:',opHint:'Giảm đi 4 lần → chia cho 4.'},
    {text:'Đi bộ từ nhà đến trường hết 30 phút. Nếu đi xe đạp thì thời gian giảm đi 3 lần. Hỏi đi xe đạp hết bao nhiêu phút?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🚶 ➜ 🚲</div>'},
      ops:['30 : 3','30 − 3','30 × 3'],ans:10,unit:'phút',lead:'Thời gian đi xe đạp là:',opHint:'Giảm đi 3 lần → chia cho 3.'},
    {text:'Con lợn nặng 80 kg. Cân nặng của con chó bằng cân nặng của con lợn giảm đi 8 lần. Hỏi con chó nặng bao nhiêu ki-lô-gam?',
      ops:['80 : 8','80 − 8','80 × 8'],ans:10,unit:'kg',lead:'Con chó nặng là:',opHint:'Giảm 80 đi 8 lần.'},
  ]}),
]},
/* ---------------- BÀI 28 ---------------- */
{id:28,title:'Bài toán giải bằng hai bước tính',icon:'🪜',note:note(`<p><i>Thùng thứ nhất có 24 l dầu, thùng thứ hai có nhiều hơn thùng thứ nhất 8 l. Hỏi cả hai thùng có bao nhiêu lít dầu?</i></p>
  <p><b>Bước 1:</b> Thùng thứ hai có: 24 + 8 = 32 (l)</p><p><b>Bước 2:</b> Cả hai thùng có: 24 + 32 = 56 (l)</p><p>Đáp số: 56 l dầu.</p>`),levels:[
  words({name:'Nhiều hơn, ít hơn',icon:'🛢️',fixed:[
    {text:'Thùng thứ nhất có 24 l dầu, thùng thứ hai có nhiều hơn thùng thứ nhất 8 l dầu. Hỏi cả hai thùng có bao nhiêu lít dầu?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🛢️ 🛢️</div>'},parts:[
      {q:'Trước hết, tìm số dầu ở thùng thứ hai:',ops:['24 + 8','24 − 8','24 × 8'],ans:32,unit:'l',lead:'Thùng thứ hai có số lít dầu là:',opHint:'Nhiều hơn 8 l → cộng thêm 8.'},
      {q:'Rồi tìm số dầu ở cả hai thùng:',ops:['24 + 32','32 − 24','32 + 8'],ans:56,unit:'l',lead:'Cả hai thùng có số lít dầu là:',opHint:'Cả hai thùng → cộng số dầu của hai thùng.'}]},
    {text:'Hàng trên có 35 cái kẹo, hàng dưới có ít hơn hàng trên 9 cái kẹo. Hỏi cả hai hàng có bao nhiêu cái kẹo?',parts:[
      {q:'Trước hết, tìm số kẹo ở hàng dưới:',ops:['35 − 9','35 + 9','35 : 9'],ans:26,unit:'cái kẹo',lead:'Hàng dưới có số kẹo là:',opHint:'Ít hơn 9 cái → trừ đi 9.'},
      {q:'Rồi tìm số kẹo của cả hai hàng:',ops:['35 + 26','35 − 26','26 − 9'],ans:61,unit:'cái kẹo',lead:'Cả hai hàng có số kẹo là:',opHint:'Cộng số kẹo của hai hàng.'}]},
  ]}),
  words({name:'Gấp lên, giảm đi',icon:'🌸',fixed:[
    {text:'Lan hái được 8 bông hoa. Mai hái được số hoa gấp 3 lần số hoa của Lan. Hỏi cả hai bạn hái được bao nhiêu bông hoa?',vis:{type:'html',html:tapeSVG([{name:'Lan',n:1,lab:'8 bông'},{name:'Mai',n:3}])},parts:[
      {q:'Trước hết, tìm số hoa Mai hái được:',ops:['8 × 3','8 + 3','8 : 3'],ans:24,unit:'bông hoa',lead:'Mai hái được số bông hoa là:',opHint:'Gấp 8 lên 3 lần.'},
      {q:'Rồi tìm số hoa của cả hai bạn:',ops:['8 + 24','24 − 8','24 × 3'],ans:32,unit:'bông hoa',lead:'Cả hai bạn hái được số bông hoa là:',opHint:'Cộng số hoa của Lan và Mai.'}]},
    {text:'Bao gạo nặng 36 kg. Bao ngô nặng bằng bao gạo giảm đi 4 lần. Hỏi bao gạo nặng hơn bao ngô bao nhiêu ki-lô-gam?',parts:[
      {q:'Trước hết, tìm cân nặng của bao ngô:',ops:['36 : 4','36 − 4','36 × 4'],ans:9,unit:'kg',lead:'Bao ngô nặng là:',opHint:'Giảm 36 đi 4 lần.'},
      {q:'Rồi tìm bao gạo nặng hơn bao ngô bao nhiêu:',ops:['36 − 9','36 + 9','9 × 4'],ans:27,unit:'kg',lead:'Bao gạo nặng hơn bao ngô là:',opHint:'Nặng hơn bao nhiêu → lấy số lớn trừ số bé.'}]},
  ]}),
  words({name:'Nhân và chia',icon:'🍰',fixed:[
    {text:'Mẹ mua 4 hộp bánh, mỗi hộp có 6 cái bánh. Mẹ chia đều số bánh đó cho 3 anh em. Hỏi mỗi người được mấy cái bánh?',vis:{type:'groups',n:4,per:6,item:'🍰',head:'📦'},parts:[
      {q:'Trước hết, tìm số bánh mẹ mua:',ops:['6 × 4','6 + 4','6 : 3'],ans:24,unit:'cái bánh',lead:'Số bánh mẹ mua là:',opHint:'4 hộp, mỗi hộp 6 cái.'},
      {q:'Rồi chia đều cho 3 anh em:',ops:['24 : 3','24 × 3','24 − 3'],ans:8,unit:'cái bánh',lead:'Mỗi người được số bánh là:',opHint:'Chia đều cho 3 người.'}]},
    {text:'Cửa hàng có 5 thùng nước, mỗi thùng có 9 chai. Cửa hàng đã bán 18 chai. Hỏi cửa hàng còn lại bao nhiêu chai nước?',vis:{type:'groups',n:5,per:9,item:'🧴',head:'📦'},parts:[
      {q:'Trước hết, tìm số chai cửa hàng có:',ops:['9 × 5','9 + 5','9 − 5'],ans:45,unit:'chai',lead:'Cửa hàng có số chai nước là:',opHint:'5 thùng, mỗi thùng 9 chai.'},
      {q:'Rồi tìm số chai còn lại:',ops:['45 − 18','45 + 18','45 : 5'],ans:27,unit:'chai',lead:'Cửa hàng còn lại số chai nước là:',opHint:'Đã bán đi → trừ.'}]},
  ]}),
  chain({name:'Hai bước tính',icon:'🪜',hero:'🧗',goal:'⛰️',chains:[{s:8,steps:[['×',3],['−',9]]},()=>({s:rnd(12,30),steps:[['+',rnd(5,20)],['−',rnd(3,9)]]}),()=>{const d=pick([2,3,4]),k=rnd(2,4);return{s:d*k*rnd(1,2),steps:[[':',d],['×',rnd(2,5)]]}}]}),
]},
/* ---------------- BÀI 29 ---------------- */
{id:29,title:'Luyện tập chung',icon:'🏁',note:note(`<p>✖️ Đặt tính nhân: tính từ phải sang trái. ➗ Đặt tính chia: tính từ trái sang phải.</p><p>🔼 Gấp lên n lần: nhân n. 🔽 Giảm đi n lần: chia n.</p><p>⚠️ Số dư luôn bé hơn số chia.</p>`),levels:[
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:()=>[mul2(true),mul2(),div2(true),div2(false)]}),
  quiz('Gấp lên, giảm đi','lt','🔁',()=>shuffle([...uniqQs(3,G.timesUp),...uniqQs(3,G.reduce)])),
  quiz('Chia có dư','lt','➗',()=>shuffle([...uniqQs(3,G.remDiv),G.remMax()])),
  race({name:'Đua tên lửa',icon:'🚀',me:'🚀',rival:'🛸',meT:'rotate(45deg)',rivalT:'none',gen:()=>pick([mulGen,divGen,timesGen])()}),
  words({name:'Giải toán có lời văn',icon:'🐔',fixed:[
    {text:'Đàn gà có 12 con gà trống. Số gà mái gấp 4 lần số gà trống. Hỏi đàn gà có tất cả bao nhiêu con?',vis:{type:'html',html:tapeSVG([{name:'Trống',n:1,lab:'12 con'},{name:'Mái',n:4}])},parts:[
      {q:'Trước hết, tìm số gà mái:',ops:['12 × 4','12 + 4','12 : 4'],ans:48,unit:'con',lead:'Số gà mái là:',opHint:'Gấp 12 lên 4 lần.'},
      {q:'Rồi tìm số gà của cả đàn:',ops:['12 + 48','48 − 12','48 × 4'],ans:60,unit:'con',lead:'Đàn gà có tất cả số con là:',opHint:'Cộng số gà trống và gà mái.'}]},
    {text:'Có 64 quyển truyện xếp đều vào 4 ngăn tủ. Hỏi mỗi ngăn có bao nhiêu quyển truyện?',
      ops:['64 : 4','64 − 4','64 × 4'],ans:16,unit:'quyển truyện',lead:'Mỗi ngăn có số quyển truyện là:',opHint:'Xếp đều vào 4 ngăn → 64 : 4.'},
  ]}),
]},
/* ---------------- BÀI 30 ---------------- */
{id:30,title:'Mi-li-mét',icon:'📏',note:note(`<p>Mi-li-mét viết tắt là <b>mm</b>.</p><p>1 cm = 10 mm &nbsp;·&nbsp; 1 dm = 100 mm &nbsp;·&nbsp; 1 m = 1000 mm</p>`),levels:[
  quiz('Đo bằng thước','kp','📏',()=>uniqQs(5,G.readMM),'Trên thước, mỗi vạch nhỏ dài 1 mi-li-mét. 10 vạch nhỏ là 1 xăng-ti-mét.'),
  quiz('Đổi đơn vị','lt','🔁',()=>uniqQs(6,G.convMM)),
  quiz('So sánh độ dài','lt','⚖️',()=>uniqQs(4,()=>G.cmpUnit(pick(['mm','mm','m'])))),
  quiz('Ước lượng','hd','🐜',()=>uniqQs(3,()=>G.unitPick(/^(mm|cm)$/))),
  words({name:'Giải toán có lời văn',icon:'🐜',fixed:[
    {text:'Con kiến bò từ A đến B dài 25 mm, rồi bò tiếp từ B đến C dài 37 mm. Hỏi con kiến đã bò được bao nhiêu mi-li-mét?',vis:{type:'html',html:'<div style="font-size:20px;text-align:center;font-weight:800">🐜 A —25 mm— B —37 mm— C 🍬</div>'},
      ops:['25 + 37','37 − 25','25 × 3'],ans:62,unit:'mm',lead:'Con kiến đã bò được là:',opHint:'Cộng hai quãng đường.'},
    {text:'Thước kẻ dài 20 cm. Bút chì dài 150 mm. Hỏi thước kẻ dài hơn bút chì bao nhiêu mi-li-mét?',vis:{type:'html',html:'<p style="text-align:center;font-weight:800;margin:0">Nhớ: 20 cm = 200 mm</p>'},
      ops:['200 − 150','150 − 20','200 + 150'],ans:50,unit:'mm',lead:'Thước kẻ dài hơn bút chì là:',opHint:'Đổi 20 cm = 200 mm rồi trừ.'},
  ]}),
]},
/* ---------------- BÀI 31 ---------------- */
{id:31,title:'Gam',icon:'⚖️',note:note(`<p>Gam viết tắt là <b>g</b>. &nbsp; <b>1 kg = 1000 g</b></p><p>Quả cân thường gặp: 10 g, 20 g, 50 g, 100 g, 200 g, 500 g.</p>`),levels:[
  quiz('Cân đồng hồ','kp','⚖️',()=>uniqQs(5,G.readG),'Đọc số gam mà kim đỏ chỉ. Mỗi vạch là 50 gam.'),
  quiz('Cân đĩa thăng bằng','hd','🍊',()=>uniqQs(4,G.balance),'Khi cân thăng bằng, vật bên trái nặng bằng tổng các quả cân bên phải.'),
  quiz('Tính với đơn vị gam','lt','🔢',()=>shuffle([...uniqQs(4,G.convG),...uniqQs(2,()=>G.cmpUnit('g'))])),
  quiz('Ước lượng','hd','🥚',()=>uniqQs(3,()=>G.unitPick(/^k?g$/))),
  words({name:'Giải toán có lời văn',icon:'🍬',fixed:[
    {text:'Gói kẹo cân nặng 250 g, gói bánh cân nặng 400 g. Hỏi cả hai gói cân nặng bao nhiêu gam?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🍬 🍪</div>'},
      ops:['250 + 400','400 − 250','400 + 25'],ans:650,unit:'g',lead:'Cả hai gói cân nặng là:',opHint:'Cả hai gói → cộng.'},
    {text:'Mẹ mua 1 kg đường, mẹ đã dùng 300 g đường để làm bánh. Hỏi còn lại bao nhiêu gam đường?',vis:{type:'html',html:'<p style="text-align:center;font-weight:800;margin:0">Nhớ: 1 kg = 1000 g</p>'},
      ops:['1000 − 300','300 − 1','1000 + 300'],ans:700,unit:'g',lead:'Số đường còn lại là:',opHint:'Đổi 1 kg = 1000 g rồi trừ đi 300 g.'},
    {text:'Mỗi gói mì cân nặng 80 g. Hỏi 4 gói mì như vậy cân nặng bao nhiêu gam?',vis:{type:'groups',n:4,per:1,item:'🍜'},
      ops:['80 × 4','80 + 4','80 : 4'],ans:320,unit:'g',lead:'4 gói mì cân nặng là:',opHint:'4 gói, mỗi gói 80 g.'},
  ]}),
]},
/* ---------------- BÀI 32 ---------------- */
{id:32,title:'Mi-li-lít',icon:'🥛',note:note(`<p>Mi-li-lít viết tắt là <b>ml</b>. &nbsp; <b>1 l = 1000 ml</b></p><p>Một thìa canh khoảng 15 ml, một cốc nước khoảng 250 ml.</p>`),levels:[
  quiz('Ca đong có vạch','kp','🥛',()=>uniqQs(5,G.readML),'Mặt nước ngang vạch nào thì đọc số mi-li-lít ở vạch đó.'),
  quiz('Tính với đơn vị mi-li-lít','lt','🔢',()=>shuffle([...uniqQs(4,G.convML),...uniqQs(2,()=>G.cmpUnit('ml'))])),
  quiz('Ước lượng','hd','🪣',()=>uniqQs(3,()=>G.unitPick(/^m?l$/))),
  words({name:'Giải toán có lời văn',icon:'🧃',fixed:[
    {text:'Mỗi hộp sữa có 180 ml. Hỏi 2 hộp sữa như vậy có bao nhiêu mi-li-lít sữa?',vis:{type:'groups',n:2,per:1,item:'🧃'},
      ops:['180 × 2','180 + 2','180 : 2'],ans:360,unit:'ml',lead:'2 hộp sữa có số mi-li-lít là:',opHint:'2 hộp, mỗi hộp 180 ml.'},
    {text:'Chai nước có 500 ml. Rót ra 3 cốc, mỗi cốc 150 ml. Hỏi trong chai còn lại bao nhiêu mi-li-lít nước?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🍶 ➜ 🥛🥛🥛</div>'},parts:[
      {q:'Trước hết, tìm số nước đã rót ra:',ops:['150 × 3','150 + 3','500 − 150'],ans:450,unit:'ml',lead:'Số nước đã rót ra là:',opHint:'3 cốc, mỗi cốc 150 ml.'},
      {q:'Rồi tìm số nước còn lại:',ops:['500 − 450','500 + 450','450 − 150'],ans:50,unit:'ml',lead:'Trong chai còn lại số nước là:',opHint:'Lấy số nước ban đầu trừ đi số đã rót.'}]},
  ]}),
]},
/* ---------------- BÀI 33 ---------------- */
{id:33,title:'Nhiệt độ. Đơn vị đo nhiệt độ',icon:'🌡️',note:note(`<p>Đơn vị đo nhiệt độ là <b>độ C</b>, viết là <b>°C</b>. Dùng <b>nhiệt kế</b> để đo nhiệt độ.</p><p>🧊 Nước đá đang tan: 0 °C &nbsp;·&nbsp; 🔥 Nước sôi: 100 °C &nbsp;·&nbsp; 🙂 Cơ thể khoẻ mạnh: khoảng 37 °C</p>`),levels:[
  quiz('Đọc nhiệt kế','kp','🌡️',()=>uniqQs(5,G.readT),'Nhìn mức chất lỏng màu đỏ dừng ở vạch nào trên nhiệt kế.'),
  quiz('Nóng hay lạnh?','hd','☀️',()=>uniqQs(4,G.tempSense)),
  quiz('So sánh nhiệt độ','lt','🌤️',()=>uniqQs(3,G.tempDiff)),
  words({name:'Giải toán có lời văn',icon:'🤒',fixed:[
    {text:'Hôm nay Hà Nội có nhiệt độ 18 °C, Thành phố Hồ Chí Minh có nhiệt độ 32 °C. Hỏi Thành phố Hồ Chí Minh nóng hơn Hà Nội bao nhiêu độ C?',
      ops:['32 − 18','32 + 18','18 − 3'],ans:14,unit:'°C',lead:'Thành phố Hồ Chí Minh nóng hơn Hà Nội là:',opHint:'Nóng hơn bao nhiêu → lấy số lớn trừ số bé.'},
    {text:'Bé Na bị sốt 39 °C. Sau khi uống thuốc, nhiệt độ cơ thể bé giảm đi 2 °C. Hỏi lúc đó nhiệt độ cơ thể bé Na là bao nhiêu độ C?',vis:{type:'html',html:`<div class="fig-row">${thermoSVG(39,50,150)}</div>`},
      ops:['39 − 2','39 + 2','39 : 2'],ans:37,unit:'°C',lead:'Nhiệt độ cơ thể bé Na lúc đó là:',opHint:'Giảm đi 2 °C (2 đơn vị) → trừ 2.'},
  ]}),
]},
/* ---------------- BÀI 34 ---------------- */
{id:34,title:'Thực hành và trải nghiệm với các đơn vị mi-li-mét, gam, mi-li-lít, độ C',icon:'🧪',note:note(`<p>📏 Độ dài nhỏ: mm &nbsp;·&nbsp; ⚖️ Vật nhẹ: g &nbsp;·&nbsp; 🥛 Lượng nước ít: ml &nbsp;·&nbsp; 🌡️ Nhiệt độ: °C</p>`),levels:[
  quiz('Chọn đơn vị phù hợp','hd','🧪',()=>uniqQs(6,G.unitPick)),
  quiz('Dụng cụ đo','hd','🧰',()=>uniqQs(4,G.tool)),
  quiz('Đo và đọc','lt','🔍',()=>shuffle([G.readMM(),G.readG(),G.readML(),G.readT(),G.balance()])),
]},
/* ---------------- BÀI 35 ---------------- */
{id:35,title:'Luyện tập chung',icon:'🏁',note:note(`<p>1 cm = 10 mm &nbsp;·&nbsp; 1 m = 1000 mm</p><p>1 kg = 1000 g &nbsp;·&nbsp; 1 l = 1000 ml</p><p>Đơn vị đo nhiệt độ: °C</p>`),levels:[
  quiz('Đổi đơn vị','lt','🔁',()=>shuffle([G.convMM(),G.convMM(),G.convG(),G.convG(),G.convML(),G.convML()])),
  quiz('So sánh','lt','⚖️',()=>uniqQs(5,G.cmpUnit)),
  quiz('Đo và đọc','lt','🔍',()=>shuffle([G.readMM(),G.readG(),G.readML(),G.readT(),G.tempDiff()])),
  words({name:'Giải toán có lời văn',icon:'🍯',fixed:[
    {text:'Lọ mật ong thứ nhất có 350 ml, lọ thứ hai có nhiều hơn lọ thứ nhất 150 ml. Hỏi cả hai lọ có bao nhiêu mi-li-lít mật ong?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🍯 🍯</div>'},parts:[
      {q:'Trước hết, tìm số mật ong ở lọ thứ hai:',ops:['350 + 150','350 − 150','150 × 2'],ans:500,unit:'ml',lead:'Lọ thứ hai có số mật ong là:',opHint:'Nhiều hơn 150 ml → cộng.'},
      {q:'Rồi tìm số mật ong ở cả hai lọ:',ops:['350 + 500','500 − 350','500 + 150'],ans:850,unit:'ml',lead:'Cả hai lọ có số mật ong là:',opHint:'Cộng số mật ong của hai lọ.'}]},
    {text:'Một quả dưa nặng 2 kg. Mẹ đã cắt ra 500 g để ăn. Hỏi phần dưa còn lại nặng bao nhiêu gam?',vis:{type:'html',html:'<p style="text-align:center;font-weight:800;margin:0">Nhớ: 2 kg = 2000 g</p>'},
      ops:['2000 − 500','500 − 2','2000 + 500'],ans:1500,unit:'g',lead:'Phần dưa còn lại nặng là:',opHint:'Đổi 2 kg = 2000 g rồi trừ.'},
  ]}),
]},
);
