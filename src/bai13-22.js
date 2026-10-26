/* ================= BÀI 13–22 ================= */
/* Các hàm sinh câu hỏi dùng chung cho bài học, bài ôn tập và đề kiểm tra */
const G={};
const note=html=>()=>`<div class="note-txt">${html}</div>`;

/* ---- tìm thành phần ---- */
G.factor=()=>{const a=rnd(2,9),b=rnd(2,9),p=a*b;return pick([
  numQ(big(`? × ${a} = ${p}`),b,`Muốn tìm thừa số, lấy tích chia cho thừa số kia: ${p} : ${a}.`),
  numQ(big(`${a} × ? = ${p}`),b,`Muốn tìm thừa số, lấy tích chia cho thừa số kia: ${p} : ${a}.`)])};
G.dividend=()=>{const a=rnd(2,9),b=rnd(2,9);return numQ(big(`? : ${a} = ${b}`),a*b,`Muốn tìm số bị chia, lấy thương nhân với số chia: ${b} × ${a}.`)};
G.divisor=()=>{const a=rnd(2,9),b=rnd(2,9);return numQ(big(`${a*b} : ? = ${b}`),a,`Muốn tìm số chia, lấy số bị chia chia cho thương: ${a*b} : ${b}.`)};
G.findMD=()=>pick([G.factor,G.factor,G.dividend,G.divisor])();
G.findAS=()=>{const a=rnd(12,89),b=rnd(11,99-a+10),s=a+b;return pick([
  numQ(big(`? + ${a} = ${s}`),b,`Muốn tìm số hạng, lấy tổng trừ đi số hạng kia: ${s} − ${a}.`),
  numQ(big(`${s} − ? = ${a}`),b,`Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu: ${s} − ${a}.`),
  numQ(big(`? − ${a} = ${b}`),s,`Muốn tìm số bị trừ, lấy hiệu cộng với số trừ: ${b} + ${a}.`)])};
const findGen=()=>{const a=rnd(2,9),b=rnd(2,10);return pick([[`? × ${a} = ${a*b}`,b],[`${a} × ? = ${a*b}`,b],[`? : ${a} = ${b}`,a*b],[`${a*b} : ? = ${b}`,a]])};

/* ---- một phần mấy ---- */
const fracKinds=n=>CUT[n]?['rect','circle','grid']:['rect','circle'];
G.fracShape=()=>{const n=rnd(2,9),k=pick(fracKinds(n));
  return {html:`${partSVG(k,n,1,130)}<p class="q-t">Đã tô màu mấy phần của hình?</p>`,key:n+k,say:'Đã tô màu một phần mấy của hình?',
    choices:mc(n,shuffle(range(2,9))),ans:n,label:v=>frac(v),hint:'Đếm xem hình được chia thành mấy phần bằng nhau.',
    explain:`Hình được chia thành ${n} phần bằng nhau, tô màu 1 phần: đã tô màu ${frac(n)} hình.`}};
G.fracPick=()=>{const n=rnd(3,8),m=pick([2,3,4,5,6,8,9].filter(x=>x!==n)),kn=pick(fracKinds(n));
  const svgs={a:partSVG(kn,n,1,92),b:partSVG('bad',n,1,92),c:partSVG(pick(fracKinds(m)),m,1,92),d:partSVG('rect',n,2,92)};
  return {html:`<p class="q-t">Hình nào đã tô màu ${frac(n)} hình?</p>`,say:`Hình nào đã tô màu ${fracName(n)} hình?`,key:'p'+n+m,
    choices:shuffle(['a','b','c','d']),ans:'a',cls:'shape',label:v=>svgs[v],hint:`Hình phải được chia thành ${n} phần BẰNG NHAU và tô màu đúng 1 phần.`}};
G.fracOf=(withPic)=>{const n=rnd(2,9),k=rnd(2,withPic?6:10),it=pick([['🍊','quả cam'],['🍬','cái kẹo'],['⭐','ngôi sao'],['🌸','bông hoa'],['🍎','quả táo']]);
  return numQ(`${withPic?vis({type:'groups',n,per:k,item:it[0]}):''}<p class="q-t">${frac(n)} của ${n*k} ${it[1]} là <b class="box">?</b> ${it[1]}.</p>`,k,`Muốn tìm ${frac(n)} của ${n*k}, lấy ${n*k} chia cho ${n}.`,{say:`${fracName(n)} của ${n*k} ${it[1]} là bao nhiêu ${it[1]}?`})};
const fracGen=()=>{const n=rnd(2,9),k=rnd(1,10);return[`${frac(n)} của ${n*k} = ?`,k]};

/* ---- trung điểm ---- */
const LET=['A','B','C','D','E','G','H','I','K','M','N','O','P','Q'];
G.between=()=>{const [a,m,b,c]=shuffle(LET).slice(0,4);return pick([
  {html:`${midFigSVG(a,m,b,c)}<p class="q-t">Điểm nào ở giữa hai điểm ${a} và ${b}?</p>`,choices:shuffle([a,m,b,c]),ans:m,hint:`Ba điểm ${a}, ${m}, ${b} thẳng hàng; điểm ở giữa nằm trên đoạn thẳng nối hai điểm kia.`},
  {html:`${midFigSVG(a,m,b,c)}<p class="q-t">${m} là điểm ở giữa hai điểm nào?</p>`,choices:shuffle([`${a} và ${b}`,`${a} và ${c}`,`${c} và ${b}`]),ans:`${a} và ${b}`,cls:'small',hint:'Tìm hai điểm cùng nằm trên một đường thẳng với điểm đó, ở hai phía.'},
  {html:`${midFigSVG(a,m,b,c)}<p class="q-t">Ba điểm ${a}, ${m}, ${c} có thẳng hàng không?</p>`,choices:['Có','Không'],ans:'Không',hint:`Điểm ${c} không nằm trên đường thẳng đi qua ${a} và ${m}.`}])};
G.midRuler=()=>{const L=pick([4,6,8,10]),[p,q,r]=shuffle(['M','N','I','K']).slice(0,3),xs=shuffle([L/2,L/2-1,L/2+1]);
  const pts=[{n:'A',x:0,c:'#243A6B'},{n:'B',x:L,c:'#243A6B'},{n:p,x:xs[0]},{n:q,x:xs[1]},{n:r,x:xs[2]}],mid=pts.find(t=>t.x===L/2).n;
  return pick([
    {html:`${rulerSegSVG(L,pts)}<p class="q-t">Điểm nào là trung điểm của đoạn thẳng AB?</p>`,choices:shuffle([p,q,r]),ans:mid,hint:`Đoạn thẳng AB dài ${L} cm. Trung điểm cách A đúng ${L/2} cm.`},
    numQ(`${rulerSegSVG(L,[pts[0],pts[1],{n:'M',x:L/2}])}<p class="q-t">M là trung điểm của AB. Độ dài đoạn thẳng AM là <b class="box">?</b> cm.</p>`,L/2,`AB = ${L} cm, AM bằng một nửa AB: ${L} : 2.`)])};
G.midLen=()=>{const a=rnd(2,9)*2;return pick([
  numQ(`<p class="q-t">M là trung điểm của đoạn thẳng AB. AB = ${a} cm.<br>Độ dài đoạn thẳng AM là <b class="box">?</b> cm.</p>`,a/2,`AM bằng một nửa AB: ${a} : 2.`),
  numQ(`<p class="q-t">O là trung điểm của đoạn thẳng CD. OC = ${a/2} cm.<br>Độ dài đoạn thẳng CD là <b class="box">?</b> cm.</p>`,a,`CD gấp đôi OC: ${a/2} × 2.`),
  numQ(`<p class="q-t">I là trung điểm của đoạn thẳng PQ dài 1 dm.<br>Độ dài đoạn thẳng IP là <b class="box">?</b> cm.</p>`,5,'1 dm = 10 cm, lấy 10 : 2.')])};

/* ---- hình tròn ---- */
G.circleParts=()=>pick([
  {html:`${circleSVG()}<p class="q-t">Tâm của hình tròn là điểm nào?</p>`,choices:['O','M','A','P'],ans:'O',hint:'Tâm là điểm chính giữa hình tròn.'},
  {html:`${circleSVG()}<p class="q-t">Đoạn thẳng nào là một bán kính?</p>`,choices:shuffle(['OA','MN','PQ']),ans:'OA',hint:'Bán kính nối tâm O với một điểm trên đường tròn.'},
  {html:`${circleSVG()}<p class="q-t">Đoạn thẳng nào là đường kính?</p>`,choices:shuffle(['OA','MN','PQ']),ans:'MN',hint:'Đường kính đi qua tâm O, hai đầu nằm trên đường tròn.'},
  {html:`${circleSVG()}<p class="q-t">O là trung điểm của đoạn thẳng nào?</p>`,choices:shuffle(['OA','MN','PQ']),ans:'MN',hint:'Tâm O là trung điểm của đường kính.'},
  {html:`${circleSVG()}<p class="q-t">Đoạn thẳng OM là bán kính hay đường kính?</p>`,choices:['Bán kính','Đường kính'],ans:'Bán kính',cls:'small',hint:'OM nối tâm O với điểm M trên đường tròn.'},
]);
G.radius=()=>{const r=rnd(2,9);return pick([
  numQ(`${circleSVG({r:r+' cm',chord:false})}<p class="q-t">Hình tròn tâm O có bán kính OA = ${r} cm.<br>Đường kính MN dài <b class="box">?</b> cm.</p>`,2*r,`Đường kính gấp 2 lần bán kính: ${r} × 2.`),
  numQ(`${circleSVG({d:2*r+' cm',chord:false})}<p class="q-t">Hình tròn tâm O có đường kính MN = ${2*r} cm.<br>Bán kính OA dài <b class="box">?</b> cm.</p>`,r,`Bán kính bằng một nửa đường kính: ${2*r} : 2.`),
  numQ(`${circleSVG({r:r+' cm',chord:false})}<p class="q-t">OA = ${r} cm. Độ dài OM là <b class="box">?</b> cm.</p>`,r,'Các bán kính của một hình tròn đều bằng nhau.')])};
G.circleObj=()=>{const ok=pick([['🕒','Mặt đồng hồ'],['🥁','Mặt trống'],['🍪','Chiếc bánh quy'],['🪙','Đồng xu']]);
  return {html:`<p class="q-t">Đồ vật nào có dạng hình tròn?</p>`,key:ok[1],choices:mc(ok.join(' '),shuffle(['📏 Thước kẻ','📕 Quyển sách','🚪 Cửa ra vào','📱 Điện thoại','🏳️ Lá cờ'])),ans:ok.join(' '),cls:'wide',hint:'Hình tròn không có góc, tròn đều.'}};

/* ---- góc ---- */
G.angleKind=()=>{const deg=pick([90,90,90,45,60,120,135,30]),rot=pick([0,0,-20,25,90,180]);
  return {html:`${angleSVG(deg,['O','A','B'],rot)}<p class="q-t">Đây là góc vuông hay góc không vuông?</p>`,key:deg+'/'+rot,choices:['Góc vuông','Góc không vuông'],ans:deg===90?'Góc vuông':'Góc không vuông',cls:'small',hint:'Góc vuông có hai cạnh tạo thành một góc giống góc của quyển vở, của ê-ke.'}};
G.angleName=()=>{const [o,a,b]=shuffle(LET).slice(0,3),deg=pick([90,60,120]);return pick([
  {html:`${angleSVG(deg,[o,a,b],pick([0,20,-15]))}<p class="q-t">Góc trên có đỉnh là điểm nào?</p>`,choices:shuffle([o,a,b]),ans:o,hint:'Đỉnh là điểm chung của hai cạnh.'},
  {html:`${angleSVG(deg,[o,a,b],pick([0,20,-15]))}<p class="q-t">Hai cạnh của góc là:</p>`,choices:shuffle([`${o}${a} và ${o}${b}`,`${a}${o} và ${a}${b}`,`${b}${o} và ${a}${b}`]),ans:`${o}${a} và ${o}${b}`,cls:'small',hint:`Hai cạnh đều xuất phát từ đỉnh ${o}.`}])};
G.rightCount=()=>{const k=pick(Object.keys(SHAPES));return {html:`${shapeSVG(k,140)}<p class="q-t">Hình trên có mấy góc vuông?</p>`,key:k,choices:[0,1,2,3,4],ans:SHAPES[k].rt,hint:'Dùng ê-ke kiểm tra từng góc của hình.'}};

/* ---- hình tam giác, tứ giác, chữ nhật, vuông ---- */
G.shapePick=()=>{const want=pick(['rect','square','tri','quad']),name={rect:'hình chữ nhật',square:'hình vuông',tri:'hình tam giác',quad:'hình tứ giác'}[want];
  const pool={rect:['square','tri','quad'],square:['rect','tri','trap'],tri:['square','quad','rect'],quad:['tri','rtri','tri']}[want];
  const keys=shuffle([want,...pool]).map((k,i)=>k+'#'+i);
  return {html:`<p class="q-t">Hình nào là ${name}?</p>`,key:want,choices:keys,ans:keys.find(k=>k.startsWith(want+'#')),cls:'shape',label:v=>shapeSVG(v.split('#')[0],80),
    hint:{rect:'Hình chữ nhật có 4 góc vuông, hai cạnh dài bằng nhau, hai cạnh ngắn bằng nhau.',square:'Hình vuông có 4 góc vuông và 4 cạnh bằng nhau.',tri:'Hình tam giác có 3 cạnh, 3 đỉnh.',quad:'Hình tứ giác có 4 cạnh, 4 đỉnh.'}[want]}};
G.rectFacts=()=>{const w=rnd(4,9),hh=rnd(2,w-1),s=rnd(3,8);return pick([
  numQ(`<p class="q-t">Hình chữ nhật có <b class="box">?</b> góc vuông.</p>`,4,'Đếm các góc của hình chữ nhật.'),
  numQ(`<p class="q-t">Hình vuông có <b class="box">?</b> cạnh bằng nhau.</p>`,4,'Hình vuông có các cạnh đều bằng nhau.'),
  numQ(`<p class="q-t">Hình tam giác có <b class="box">?</b> đỉnh.</p>`,3,'Đếm số đỉnh: mỗi góc là một đỉnh.'),
  numQ(`${rectSVG(w,hh,'ABCD',w+' cm',hh+' cm')}<p class="q-t">Hình chữ nhật ABCD. Độ dài cạnh CD là <b class="box">?</b> cm.</p>`,w,`Hình chữ nhật có hai cạnh dài bằng nhau: CD = AB.`),
  numQ(`${rectSVG(w,hh,'ABCD',w+' cm',hh+' cm')}<p class="q-t">Hình chữ nhật ABCD. Độ dài cạnh AD là <b class="box">?</b> cm.</p>`,hh,`Hình chữ nhật có hai cạnh ngắn bằng nhau: AD = BC.`),
  numQ(`${rectSVG(4,4,'MNPQ',s+' cm')}<p class="q-t">Hình vuông MNPQ có cạnh MN = ${s} cm. Cạnh NP dài <b class="box">?</b> cm.</p>`,s,'Hình vuông có 4 cạnh bằng nhau.')])};
const CNT_FIGS=[
  {svg:`<svg viewBox="0 0 220 110" class="fig wide"><rect x="10" y="10" width="200" height="90" fill="#E8F8E4" stroke="#243A6B" stroke-width="3"/><line x1="90" y1="10" x2="90" y2="100" stroke="#243A6B" stroke-width="3"/></svg>`,q:'Có bao nhiêu hình chữ nhật?',a:3,h:'Hai hình nhỏ và một hình lớn.'},
  {svg:`<svg viewBox="0 0 220 110" class="fig wide"><rect x="10" y="10" width="200" height="90" fill="#E8F8E4" stroke="#243A6B" stroke-width="3"/><line x1="70" y1="10" x2="70" y2="100" stroke="#243A6B" stroke-width="3"/><line x1="140" y1="10" x2="140" y2="100" stroke="#243A6B" stroke-width="3"/></svg>`,q:'Có bao nhiêu hình chữ nhật?',a:6,h:'3 hình đơn, 2 hình ghép từ 2 hình, 1 hình lớn nhất.'},
  {svg:`<svg viewBox="0 0 140 140" class="fig"><rect x="10" y="10" width="120" height="120" fill="#FFE0DC" stroke="#243A6B" stroke-width="3"/><line x1="70" y1="10" x2="70" y2="130" stroke="#243A6B" stroke-width="3"/><line x1="10" y1="70" x2="130" y2="70" stroke="#243A6B" stroke-width="3"/></svg>`,q:'Có bao nhiêu hình vuông?',a:5,h:'4 hình vuông nhỏ và 1 hình vuông lớn.'},
  {svg:`<svg viewBox="0 0 200 170" class="fig"><polygon points="100,10 10,160 190,160" fill="#FFF3D6" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/><line x1="100" y1="10" x2="70" y2="160" stroke="#243A6B" stroke-width="3"/><line x1="100" y1="10" x2="130" y2="160" stroke="#243A6B" stroke-width="3"/></svg>`,q:'Có bao nhiêu hình tam giác?',a:6,h:'3 hình đơn, 2 hình ghép đôi, 1 hình lớn.'},
  {svg:`<svg viewBox="0 0 200 170" class="fig"><polygon points="100,10 10,160 190,160" fill="#FFF3D6" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/><line x1="100" y1="10" x2="100" y2="160" stroke="#243A6B" stroke-width="3"/></svg>`,q:'Có bao nhiêu hình tam giác?',a:3,h:'Hai hình nhỏ và một hình lớn.'},
];
G.countFig=()=>{const f=pick(CNT_FIGS);return {html:`${f.svg}<p class="q-t">${f.q}</p>`,key:f.q+f.a,choices:mc(f.a,[f.a-1,f.a+1,f.a-2,f.a+2]),ans:f.a,hint:f.h}};

/* ---- khối ---- */
G.solidFacts=()=>{const s=pick(['cube','box']),nm=SOLID_NAME[s].toLowerCase();return pick([
  numQ(`${solidSVG(s,'blue',90)}<p class="q-t">${SOLID_NAME[s]} có <b class="box">?</b> mặt.</p>`,6,'Đếm cả mặt trên, mặt dưới, mặt trước, mặt sau, mặt trái, mặt phải.'),
  numQ(`${solidSVG(s,'green',90)}<p class="q-t">${SOLID_NAME[s]} có <b class="box">?</b> đỉnh.</p>`,8,'4 đỉnh ở mặt trên và 4 đỉnh ở mặt dưới.'),
  numQ(`${solidSVG(s,'yellow',90)}<p class="q-t">${SOLID_NAME[s]} có <b class="box">?</b> cạnh.</p>`,12,'4 cạnh ở mặt trên, 4 cạnh ở mặt dưới và 4 cạnh đứng.'),
  {html:`${solidSVG(s,'purple',90)}<p class="q-t">Các mặt của ${nm} là hình gì?</p>`,choices:['Hình vuông','Hình chữ nhật','Hình tròn','Hình tam giác'],ans:s==='cube'?'Hình vuông':'Hình chữ nhật',cls:'small',hint:s==='cube'?'Khối lập phương có 6 mặt là các hình vuông bằng nhau.':'Các mặt của khối hộp chữ nhật là hình chữ nhật.'}])};
G.solidObj=()=>{const o=pick([{e:'🎲',n:'Con xúc xắc',a:'cube'},{e:'🧊',n:'Viên đá lạnh',a:'cube'},{e:'🧩',n:'Khối rubik',a:'cube'},{e:'📦',n:'Thùng các-tông',a:'box'},{e:'🧱',n:'Viên gạch',a:'box'},{e:'🎁',n:'Hộp quà dài',a:'box'},{e:'🥫',n:'Lon sữa',a:'cyl'},{e:'⚽',n:'Quả bóng',a:'sph'}]);
  return {html:`<div class="obj"><span class="obj-e">${o.e}</span><b>${o.n}</b></div><p class="q-t">${o.n} có dạng khối gì?</p>`,key:o.n,say:`${o.n} có dạng khối gì?`,
    choices:Object.values(SOLID_NAME),ans:SOLID_NAME[o.a],cls:'wide',label:v=>`${solidSVG(SOLID_KEY[v],'blue',34)}${v}`,hint:'Khối lập phương có 6 mặt vuông bằng nhau; khối hộp chữ nhật có các mặt là hình chữ nhật.'}};
G.cubeCount=()=>{const cols=rep(rnd(2,4),()=>rnd(1,3)),n=cols.reduce((a,b)=>a+b,0);return numQ(`${cubeStackSVG(cols)}<p class="q-t">Có <b class="box">?</b> khối lập phương.</p>`,n,`Đếm từng cột: ${cols.join(' + ')}.`)};

/* ---- vẽ trên lưới ---- */
const gridRect=sq=>()=>{
  const w=sq?rnd(2,4):rnd(3,5),hh=sq?w:rnd(2,4),x=rnd(0,8-w),y=rnd(0,6-hh);
  const c=[[x,y],[x+w,y],[x+w,y+hh],[x,y+hh]],rot=rnd(0,3),P=[0,1,2,3].map(i=>c[(i+rot)%4]),D=P[3];
  return {prompt:`Chạm vào điểm D để được <b>${sq?'hình vuông':'hình chữ nhật'} ABCD</b>.`,given:P.slice(0,3),close:true,
    ok:(a,b)=>a===D[0]&&b===D[1],hint:sq?'Hình vuông có 4 cạnh bằng nhau và 4 góc vuông.':'Cạnh AD phải song song và bằng cạnh BC.',done:`Được ${sq?'hình vuông':'hình chữ nhật'} ABCD rồi! 🎉`}};
const gridRight=()=>{
  const O=[rnd(2,6),rnd(2,4)],dir=pick([[1,0],[-1,0],[0,1],[0,-1]]),k=2,A=[O[0]+dir[0]*k,O[1]+dir[1]*k];
  return {prompt:'Chạm vào một điểm B để được <b>góc vuông</b> đỉnh O, cạnh OA và OB.',given:[A,O],names:'AOB',
    ok:(x,y)=>(x-O[0])*dir[0]+(y-O[1])*dir[1]===0&&!(x===O[0]&&y===O[1]),hint:'Cạnh OB phải vuông góc với OA, giống góc của ê-ke.',done:'Được góc vuông đỉnh O rồi! 🎉'}};
const gridMid=()=>{
  const hor=Math.random()<.5,L=pick([2,4,6]),x=rnd(0,hor?8-L:8),y=rnd(0,hor?6:6-L),B=hor?[x+L,y]:[x,y+L],M=hor?[x+L/2,y]:[x,y+L/2];
  return {prompt:'Chạm vào <b>trung điểm M</b> của đoạn thẳng AB.',given:[[x,y],B],names:'ABM',ok:(a,b)=>a===M[0]&&b===M[1],hint:`Đoạn AB dài ${L} ô, trung điểm cách A ${L/2} ô.`,done:'M là trung điểm của AB! 🎉'}};

/* ---- bài học ---- */
LESSONS.push(
/* ---------------- BÀI 13 ---------------- */
{id:13,title:'Tìm thành phần trong phép nhân, phép chia',icon:'🔎',note:note(`<p>✖️ Muốn tìm <b>thừa số</b>, ta lấy tích chia cho thừa số kia.<br><i>? × 4 = 20 → 20 : 4 = 5</i></p>
  <p>➗ Muốn tìm <b>số bị chia</b>, ta lấy thương nhân với số chia.<br><i>? : 3 = 6 → 6 × 3 = 18</i></p>
  <p>➗ Muốn tìm <b>số chia</b>, ta lấy số bị chia chia cho thương.<br><i>20 : ? = 4 → 20 : 4 = 5</i></p>`),levels:[
  quiz('Tìm thừa số','kp','✖️',()=>uniqQs(8,G.factor),'Muốn tìm thừa số, ta lấy tích chia cho thừa số kia. Ví dụ: ? × 4 = 20 thì ? = 20 : 4 = 5.'),
  quiz('Tìm số bị chia, số chia','kp','➗',()=>shuffle([...uniqQs(4,G.dividend),...uniqQs(4,G.divisor)]),'Tìm số bị chia: lấy thương nhân với số chia. Tìm số chia: lấy số bị chia chia cho thương.'),
  quiz('Điền bảng','lt','📋',()=>{
    const A=rep(3,()=>[rnd(2,9),rnd(2,9)]),B=rep(3,()=>[rnd(2,9),rnd(2,9)]);
    const td=v=>v==null?'<td><b class="box">?</b></td>':`<td>${v}</td>`;
    // bảng nhân: ẩn thừa số 1, thừa số 2, tích lần lượt từng cột
    const r1=A.map(([a],i)=>i===0?null:a),r2=A.map(([,b],i)=>i===1?null:b),r3=A.map(([a,b],i)=>i===2?null:a*b);
    const d1=B.map(([a,b],i)=>i===0?null:a*b),d2=B.map(([a],i)=>i===1?null:a),d3=B.map(([,b],i)=>i===2?null:b);
    return [
      {html:`<table class="tbl"><tr><th>Thừa số</th>${r1.map(td).join('')}</tr><tr><th>Thừa số</th>${r2.map(td).join('')}</tr><tr><th>Tích</th>${r3.map(td).join('')}</tr></table>`,say:'Điền số thích hợp vào ô trống trong bảng.',
        ans:[A[0][0],A[1][1],A[2][0]*A[2][1]],hint:[`Tìm thừa số: ${A[0][0]*A[0][1]} : ${A[0][1]}`,`Tìm thừa số: ${A[1][0]*A[1][1]} : ${A[1][0]}`,`Tính tích: ${A[2][0]} × ${A[2][1]}`]},
      {html:`<table class="tbl"><tr><th>Số bị chia</th>${d1.map(td).join('')}</tr><tr><th>Số chia</th>${d2.map(td).join('')}</tr><tr><th>Thương</th>${d3.map(td).join('')}</tr></table>`,say:'Điền số thích hợp vào ô trống trong bảng.',
        ans:[B[0][0]*B[0][1],B[1][0],B[2][1]],hint:[`Tìm số bị chia: ${B[0][1]} × ${B[0][0]}`,`Tìm số chia: ${B[1][0]*B[1][1]} : ${B[1][1]}`,`Tính thương: ${B[2][0]*B[2][1]} : ${B[2][0]}`]},
    ];
  }),
  race({name:'Đua tìm số',icon:'🏎️',gen:findGen}),
  words({name:'Giải toán có lời văn',icon:'🍊',fixed:[
    {text:'Bác An có 35 quả bưởi xếp đều vào các rổ, mỗi rổ 5 quả. Hỏi bác An xếp được mấy rổ bưởi?',vis:{type:'pile',total:35,item:'🍈'},after:{type:'groups',n:7,per:5,item:'🍈',head:'🧺'},
      ops:['35 : 5','35 × 5','35 − 5'],ans:7,unit:'rổ',lead:'Số rổ bưởi xếp được là:',opHint:'Mỗi rổ 5 quả → chia 35 cho 5.'},
    {text:'Một phép nhân có tích là 36, thừa số thứ nhất là 4. Tìm thừa số thứ hai.',
      ops:['36 : 4','36 × 4','36 − 4'],ans:9,unit:'',lead:'Thừa số thứ hai là:',opHint:'Muốn tìm thừa số, lấy tích chia cho thừa số kia.'},
    {text:'Mai nghĩ ra một số. Lấy số đó chia cho 6 thì được 7. Hỏi Mai đã nghĩ ra số nào?',
      ops:['7 × 6','7 + 6','7 − 6'],ans:42,unit:'',lead:'Số Mai nghĩ là:',opHint:'Số cần tìm là số bị chia: lấy thương nhân với số chia.'},
  ]}),
]},
/* ---------------- BÀI 14 ---------------- */
{id:14,title:'Một phần mấy',icon:'🍕',note:note(`<div class="fig-row">${partSVG('circle',4,1,80)}${partSVG('rect',3,1,90)}</div>
  <p>Chia hình thành 4 phần <b>bằng nhau</b>, tô màu 1 phần: đã tô màu ${frac(4)} (một phần tư) hình.</p>
  <p>Muốn tìm ${frac(3)} của 12, ta lấy 12 : 3 = 4.</p>`),levels:[
  quiz('Đã tô màu một phần mấy?','kp','🍕',()=>uniqQs(6,G.fracShape),'Hình được chia thành mấy phần bằng nhau thì mỗi phần là một phần mấy của hình.'),
  quiz('Hình nào đúng?','lt','🔍',()=>uniqQs(5,G.fracPick)),
  quiz('Chia phần quà','kp','🎁',()=>[...uniqQs(3,()=>G.fracOf(true)),...uniqQs(3,()=>G.fracOf(false))],'Muốn tìm một phần mấy của một số, ta lấy số đó chia cho số phần.'),
  race({name:'Đua tìm một phần mấy',icon:'🛵',me:'🛵',rival:'🚲',gen:fracGen}),
  words({name:'Giải toán có lời văn',icon:'🍬',fixed:[
    {text:`Mẹ có 24 cái kẹo. Mẹ cho Lan ${frac(4)} số kẹo. Hỏi Lan được mấy cái kẹo?`,vis:{type:'pile',total:24,item:'🍬'},after:{type:'groups',n:4,per:6,item:'🍬'},
      ops:['24 : 4','24 × 4','24 − 4'],ans:6,unit:'cái kẹo',lead:'Số kẹo Lan được là:',opHint:`Tìm ${frac(4)} của 24 → lấy 24 chia cho 4.`},
    {text:`Lớp 3A có 32 bạn, trong đó ${frac(8)} số bạn được khen thưởng. Hỏi lớp 3A có bao nhiêu bạn được khen thưởng?`,
      ops:['32 : 8','32 − 8','32 × 8'],ans:4,unit:'bạn',lead:'Số bạn được khen thưởng là:',opHint:`Tìm ${frac(8)} của 32 → lấy 32 chia cho 8.`},
    {text:`Một sợi dây dài 45 cm. Bố cắt đi ${frac(5)} sợi dây. Hỏi đoạn dây bố cắt đi dài bao nhiêu xăng-ti-mét?`,vis:{type:'html',html:'<div class="wood"><span>45 cm</span></div>'},after:{type:'html',html:`<div class="wood">${'<span>9 cm</span>'.repeat(5)}</div>`},
      ops:['45 : 5','45 − 5','45 × 5'],ans:9,unit:'cm',lead:'Đoạn dây cắt đi dài là:',opHint:`Tìm ${frac(5)} của 45 → lấy 45 chia cho 5.`},
  ]}),
]},
/* ---------------- BÀI 15 ---------------- */
{id:15,title:'Luyện tập chung',icon:'🏁',note:note(`<p>✖️ Thừa số = Tích : Thừa số kia</p><p>➗ Số bị chia = Thương × Số chia</p><p>➗ Số chia = Số bị chia : Thương</p><p>🍕 ${frac(5)} của 20 là 20 : 5 = 4.</p>`),levels:[
  bees({name:'Ong tìm hoa',icon:'🐝',center:'?',rounds:[
    ()=>shuffle(range(6,9)).map(a=>{const k=rnd(2,9);return Math.random()<.5?`${a} × ${k}`:`${a*k} : ${a}`}),
    ()=>shuffle(range(2,9)).slice(0,5).map(a=>{const k=rnd(2,9);return Math.random()<.5?`${a} × ${k}`:`${a*k} : ${a}`})]}),
  quiz('Tìm số còn thiếu','lt','🔎',()=>shuffle([...uniqQs(5,G.findMD),...uniqQs(2,G.findAS)])),
  quiz('Một phần mấy','lt','🍕',()=>shuffle([...uniqQs(3,G.fracShape),...uniqQs(3,()=>G.fracOf(false))])),
  compareLv({name:'Cân đĩa so sánh',icon:'⚖️',pairs:[
    [['6 × 7','8 × 5'],['63 : 9','56 : 8'],['9 × 4','6 × 6'],['48 : 6','72 : 9'],['7 × 8','9 × 6']],
    ()=>rep(2,()=>{const a=rnd(6,9),b=rnd(2,9),c=rnd(6,9),d=rnd(2,9);return[`${a} × ${b}`,`${c} × ${d}`]})]}),
  chain({name:'Tàu lửa tính nhẩm',icon:'🚂',hero:'🚂',goal:'🏁',chains:[
    {s:7,steps:[['×',6],[':',2],['+',9]]},
    ()=>genChain(pick([6,7,8,9]),[2,3,4,5,6]),
    ()=>{const k=rnd(2,9);return{s:9,steps:[['×',k],['−',rnd(2,9)]]}},
  ]}),
  words({name:'Giải toán có lời văn',icon:'🚌',fixed:[
    {text:'Có 48 học sinh đi tham quan, chia đều thành 6 nhóm. Hỏi mỗi nhóm có bao nhiêu học sinh?',vis:{type:'pile',total:48,item:'🧒'},after:{type:'groups',n:6,per:8,item:'🧒'},
      ops:['48 : 6','48 × 6','48 − 6'],ans:8,unit:'học sinh',lead:'Số học sinh mỗi nhóm là:',opHint:'Chia đều thành 6 nhóm → chia 48 cho 6.'},
    {text:`Trong vườn có 63 cây, ${frac(7)} số cây là cây cam. Hỏi trong vườn có bao nhiêu cây cam?`,vis:{type:'pile',total:63,item:'🌳'},
      ops:['63 : 7','63 − 7','63 × 7'],ans:9,unit:'cây',lead:'Số cây cam là:',opHint:`Tìm ${frac(7)} của 63 → lấy 63 chia cho 7.`},
    {text:'Mỗi con nhện có 8 chân. Hỏi 7 con nhện có bao nhiêu chân?',vis:{type:'groups',n:7,per:8,item:'•',head:'🕷️'},
      ops:['8 × 7','8 + 7','8 − 7'],ans:56,unit:'chân',lead:'Số chân của 7 con nhện là:',opHint:'7 con, mỗi con 8 chân → 8 được lấy 7 lần.'},
  ]}),
]},
/* ---------------- BÀI 16 ---------------- */
{id:16,title:'Điểm ở giữa. Trung điểm của đoạn thẳng',icon:'📍',note:note(`${rulerSegSVG(6,[{n:'A',x:0,c:'#243A6B'},{n:'M',x:3},{n:'B',x:6,c:'#243A6B'}])}
  <p>A, M, B thẳng hàng, M nằm giữa A và B: <b>M là điểm ở giữa</b> hai điểm A và B.</p>
  <p>Nếu thêm AM = MB thì <b>M là trung điểm</b> của đoạn thẳng AB. Khi đó AM = AB : 2.</p>`),levels:[
  quiz('Điểm ở giữa','kp','📍',()=>uniqQs(5,G.between),'Điểm ở giữa hai điểm thì cả ba điểm phải thẳng hàng.'),
  quiz('Tìm trung điểm trên thước','lt','📏',()=>uniqQs(5,G.midRuler)),
  gridLv({name:'Đánh dấu trung điểm',icon:'✳️',rounds:[gridMid,gridMid,gridMid]}),
  quiz('Tính độ dài','lt','📐',()=>uniqQs(5,G.midLen)),
  words({name:'Giải toán có lời văn',icon:'🪵',fixed:[
    {text:'Bác thợ mộc đánh dấu trung điểm của một thanh gỗ dài 60 cm rồi cưa tại đó. Hỏi mỗi đoạn gỗ dài bao nhiêu xăng-ti-mét?',vis:{type:'html',html:'<div class="wood"><span>60 cm</span></div>'},after:{type:'html',html:'<div class="wood"><span>30 cm</span><span>30 cm</span></div>'},
      ops:['60 : 2','60 × 2','60 − 2'],ans:30,unit:'cm',lead:'Mỗi đoạn gỗ dài là:',opHint:'Trung điểm chia đoạn thẳng thành 2 phần bằng nhau.'},
    {text:'O là trung điểm của đoạn thẳng CD. Đoạn thẳng OC dài 9 cm. Hỏi đoạn thẳng CD dài bao nhiêu xăng-ti-mét?',
      ops:['9 × 2','9 : 2','9 + 1'],ans:18,unit:'cm',lead:'Đoạn thẳng CD dài là:',opHint:'CD gồm hai đoạn OC và OD bằng nhau.'},
  ]}),
]},
/* ---------------- BÀI 17 ---------------- */
{id:17,title:'Hình tròn. Tâm, bán kính, đường kính',icon:'⭕',note:note(`${circleSVG({chord:false})}
  <p>O là <b>tâm</b>. OA, OM, ON là các <b>bán kính</b> (đều bằng nhau). MN là <b>đường kính</b>.</p>
  <p>Tâm O là trung điểm của đường kính. Đường kính gấp 2 lần bán kính.</p>`),levels:[
  quiz('Tâm, bán kính, đường kính','kp','⭕',()=>uniqQs(5,G.circleParts),'Tâm là điểm chính giữa. Bán kính nối tâm với một điểm trên đường tròn. Đường kính đi qua tâm.'),
  quiz('Đường kính gấp đôi bán kính','lt','📏',()=>uniqQs(6,G.radius)),
  quiz('Đồ vật hình tròn','hd','🕒',()=>uniqQs(3,G.circleObj)),
  words({name:'Giải toán có lời văn',icon:'🍽️',fixed:[
    {text:'Một chiếc đĩa hình tròn có đường kính 20 cm. Hỏi bán kính của chiếc đĩa dài bao nhiêu xăng-ti-mét?',vis:{type:'html',html:'<div style="font-size:60px;text-align:center">🍽️</div>'},
      ops:['20 : 2','20 × 2','20 − 2'],ans:10,unit:'cm',lead:'Bán kính của chiếc đĩa là:',opHint:'Bán kính bằng một nửa đường kính.'},
    {text:'Rô-bốt vẽ một hình tròn có bán kính 4 cm. Hỏi đường kính của hình tròn đó dài bao nhiêu xăng-ti-mét?',
      ops:['4 × 2','4 : 2','4 + 4 + 4'],ans:8,unit:'cm',lead:'Đường kính của hình tròn là:',opHint:'Đường kính gấp 2 lần bán kính.'},
  ]}),
]},
/* ---------------- BÀI 18 ---------------- */
{id:18,title:'Góc, góc vuông, góc không vuông',icon:'📐',note:note(`<div class="fig-row">${angleSVG(90,['O','A','B'],0,120)}${angleSVG(60,['M','C','D'],0,120)}</div>
  <p>Góc vuông đỉnh O, cạnh OA, OB. Góc không vuông đỉnh M, cạnh MC, MD.</p><p>📐 Dùng <b>ê-ke</b> để kiểm tra góc vuông.</p>`),levels:[
  quiz('Góc vuông hay không?','kp','📐',()=>uniqQs(6,G.angleKind),'Đặt góc vuông của ê-ke trùng với đỉnh và một cạnh của góc. Nếu cạnh kia trùng với cạnh ê-ke thì đó là góc vuông.'),
  quiz('Đỉnh và cạnh của góc','lt','🔤',()=>uniqQs(4,G.angleName)),
  quiz('Đếm góc vuông','lt','🔲',()=>uniqQs(5,G.rightCount)),
  gridLv({name:'Vẽ góc vuông',icon:'✏️',rounds:[gridRight,gridRight,gridRight]}),
]},
/* ---------------- BÀI 19 ---------------- */
{id:19,title:'Hình tam giác, hình tứ giác. Hình chữ nhật, hình vuông',icon:'🔷',note:note(`<div class="fig-row">${shapeSVG('tri',60)}${shapeSVG('quad',60)}${shapeSVG('rect',60)}${shapeSVG('square',60)}</div>
  <p>🔺 Hình tam giác: 3 cạnh, 3 đỉnh, 3 góc.</p><p>🔷 Hình tứ giác: 4 cạnh, 4 đỉnh, 4 góc.</p>
  <p>▭ Hình chữ nhật: 4 góc vuông, 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau.</p><p>◻️ Hình vuông: 4 góc vuông, 4 cạnh bằng nhau.</p>`),levels:[
  quiz('Nhận dạng hình','kp','🔷',()=>uniqQs(6,G.shapePick)),
  quiz('Cạnh và góc','lt','📏',()=>uniqQs(6,G.rectFacts)),
  quiz('Đếm hình','dv','🧐',()=>uniqQs(4,G.countFig)),
  gridLv({name:'Vẽ hình vuông, hình chữ nhật',icon:'✏️',rounds:[gridRect(true),gridRect(false),gridRect(false)]}),
]},
/* ---------------- BÀI 20 ---------------- */
{id:20,title:'Thực hành vẽ góc vuông, vẽ đường tròn, hình vuông, hình chữ nhật và vẽ trang trí',icon:'🎨',note:note(`<p>📐 Vẽ góc vuông: dùng ê-ke.</p><p>🧭 Vẽ đường tròn: mở com-pa bằng độ dài <b>bán kính</b>, đặt đầu nhọn vào tâm rồi quay.</p><p>✏️ Vẽ hình vuông, hình chữ nhật trên giấy ô vuông: đếm ô cho các cạnh.</p>`),levels:[
  gridLv({name:'Vẽ góc vuông',icon:'📐',rounds:[gridRight,gridRight,gridRight]}),
  gridLv({name:'Vẽ hình chữ nhật, hình vuông',icon:'🟩',rounds:[gridRect(false),gridRect(true),gridRect(false),gridRect(true)]}),
  quiz('Dùng com-pa và ê-ke','lt','🧭',()=>{const r=rnd(2,5);return[
    numQ(`<p class="q-t">Để vẽ hình tròn tâm O bán kính ${r} cm, con mở com-pa rộng <b class="box">?</b> cm.</p>`,r,'Mở com-pa bằng độ dài bán kính.'),
    numQ(`<p class="q-t">Để vẽ hình tròn có đường kính ${2*r+2} cm, con mở com-pa rộng <b class="box">?</b> cm.</p>`,r+1,`Bán kính = đường kính : 2 = ${2*r+2} : 2.`),
    {html:'<p class="q-t">Dụng cụ nào dùng để vẽ hình tròn?</p>',choices:['🧭 Com-pa','📐 Ê-ke','📏 Thước thẳng'],ans:'🧭 Com-pa',cls:'wide',hint:'Dụng cụ có một đầu nhọn và một đầu bút chì.'},
    {html:'<p class="q-t">Dụng cụ nào dùng để kiểm tra góc vuông?</p>',choices:['🧭 Com-pa','📐 Ê-ke','📏 Thước thẳng'],ans:'📐 Ê-ke',cls:'wide',hint:'Dụng cụ hình tam giác có một góc vuông.'},
  ]}),
  quiz('Hoa văn trang trí','dv','🎨',()=>rep(4,g=>{
    const pool=shuffle(['🔴','🔺','🟦','🟩','⭐','🟡','🔷','🟣']),per=g<2?2:3,unit=pool.slice(0,per),seq=rep(9,i=>unit[i%per]);
    return {html:`<p class="q-t">Chọn hình thích hợp đặt vào dấu “?”.</p><div class="pattern" style="font-size:34px">${seq.slice(0,8).join(' ')} <span class="qm">?</span></div>`,say:'Tìm quy luật rồi chọn hình thích hợp.',
      choices:mc(seq[8],pool.slice(per)),ans:seq[8],hint:'Các hình lặp lại theo một nhóm. Tìm nhóm đó nhé!'}})),
]},
/* ---------------- BÀI 21 ---------------- */
{id:21,title:'Khối lập phương, khối hộp chữ nhật',icon:'🧊',note:note(`<div class="fig-row">${solidSVG('cube','red',70)}${solidSVG('box','blue',80)}</div>
  <p>Khối lập phương và khối hộp chữ nhật đều có <b>6 mặt, 8 đỉnh, 12 cạnh</b>.</p><p>Các mặt của khối lập phương là hình vuông. Các mặt của khối hộp chữ nhật là hình chữ nhật.</p>`),levels:[
  quiz('Khối hình quanh em','kp','📦',()=>uniqQs(6,G.solidObj)),
  quiz('Mặt, đỉnh, cạnh','lt','🧊',()=>uniqQs(6,G.solidFacts)),
  quiz('Đếm khối lập phương','dv','🧱',()=>uniqQs(5,G.cubeCount)),
]},
/* ---------------- BÀI 22 ---------------- */
{id:22,title:'Luyện tập chung',icon:'🏁',note:note(`<p>📍 Trung điểm M của AB: AM = MB = AB : 2.</p><p>⭕ Đường kính = bán kính × 2.</p><p>📐 Hình chữ nhật, hình vuông có 4 góc vuông.</p><p>🧊 Khối lập phương, khối hộp chữ nhật: 6 mặt, 8 đỉnh, 12 cạnh.</p>`),levels:[
  quiz('Ôn hình học','lt','📐',()=>shuffle([G.between(),G.midRuler(),G.circleParts(),G.angleKind(),G.shapePick(),G.solidFacts()])),
  quiz('Tính độ dài','lt','📏',()=>shuffle([...uniqQs(3,G.midLen),...uniqQs(3,G.radius)])),
  gridLv({name:'Vẽ hình',icon:'✏️',rounds:[gridMid,gridRight,gridRect(true),gridRect(false)]}),
  quiz('Đếm hình','dv','🧐',()=>shuffle([...uniqQs(3,G.countFig),...uniqQs(2,G.cubeCount)])),
]},
);
