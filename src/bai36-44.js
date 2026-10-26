/* ================= BÀI 36–44 ================= */
/* ---- nhân, chia trong phạm vi 1000 ---- */
const mul3=(carry)=>{for(let g=0;g<300;g++){const a=rnd(101,499),b=rnd(2,9),p=a*b;
  const c=String(a).split('').reverse().reduce((o,d)=>{const s=+d*b+o.k;return{k:Math.floor(s/10),any:o.any||s>9}},{k:0,any:false}).any;
  if(p<1000&&(carry==null||c===carry))return[a,'×',b]}return[123,'×',3]};
// zero: thương có chữ số 0 ở giữa hoặc cuối
const div3=(exact,zero)=>{for(let g=0;g<400;g++){const d=rnd(2,9),q=rnd(Math.max(10,Math.ceil(100/d)),Math.floor(999/d)),r=exact?0:rnd(1,d-1),x=d*q+r;
  const hasZ=String(q).includes('0');if(x>=100&&x<1000&&(zero==null||hasZ===zero))return[x,':',d]}return[648,':',3]};
G.mul3Mental=()=>{const a=rnd(1,4)*100,b=rnd(2,9);return a*b<1000?numQ(big(`${a} × ${b} = ?`),a*b,`${a/100} trăm × ${b} = ${a/100*b} trăm.`):G.mul3Mental()};
G.div3Mental=()=>{const d=rnd(2,4),q=rnd(1,Math.floor(9/d))*100;return numQ(big(`${d*q} : ${d} = ?`),q,`${d*q/100} trăm : ${d} = ${q/100} trăm.`)};
const mul3Gen=()=>{const a=rnd(1,4)*100+pick([0,10,20]),b=rnd(2,4);return a*b<1000?[`${a} × ${b} = ?`,a*b]:[`${a} × 2 = ?`,a*2]};
const div3Gen=()=>{const d=rnd(2,9),q=pick([10,20,30,40,100,200,300]);return d*q<1000?[`${d*q} : ${d} = ?`,q]:[`${2*q} : 2 = ?`,q]};

/* ---- biểu thức số ---- */
// mỗi dạng trả về [biểu thức, dòng giữa có "?", giá trị bước 1, giá trị cuối]
const EXPR={
  lr:()=>pick([
    ()=>{const a=rnd(20,90),b=rnd(10,60),c=rnd(5,a+b-1);return[`${a} + ${b} − ${c}`,`? − ${c}`,a+b,a+b-c]},
    ()=>{const a=rnd(50,99),b=rnd(10,a-5),c=rnd(5,60);return[`${a} − ${b} + ${c}`,`? + ${c}`,a-b,a-b+c]},
    ()=>{const a=rnd(2,9),b=rnd(2,9),d=pick([2,3,4,6].filter(x=>a*b%x===0))||1;return d===1?[`${a} × ${b} × 2`,`? × 2`,a*b,a*b*2]:[`${a} × ${b} : ${d}`,`? : ${d}`,a*b,a*b/d]},
    ()=>{const d=rnd(2,9),q=rnd(2,9),b=rnd(2,5);return[`${d*q} : ${d} × ${b}`,`? × ${b}`,q,q*b]}])(),
  mix:()=>pick([
    ()=>{const a=rnd(10,90),b=rnd(2,9),c=rnd(2,9);return[`${a} + ${b} × ${c}`,`${a} + ?`,b*c,a+b*c]},
    ()=>{const b=rnd(2,9),c=rnd(2,9),a=b*c+rnd(5,60);return[`${a} − ${b} × ${c}`,`${a} − ?`,b*c,a-b*c]},
    ()=>{const d=rnd(2,9),q=rnd(2,9),a=rnd(10,80);return[`${a} + ${d*q} : ${d}`,`${a} + ?`,q,a+q]},
    ()=>{const b=rnd(2,9),c=rnd(2,9),e=rnd(5,40);return[`${b} × ${c} + ${e}`,`? + ${e}`,b*c,b*c+e]},
    ()=>{const d=rnd(2,9),q=rnd(2,9),e=rnd(1,q*1-1)||0;return[`${d*q} : ${d} − ${e}`,`? − ${e}`,q,q-e]}])(),
  paren:()=>pick([
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(2,5);return[`(${a} + ${b}) × ${c}`,`? × ${c}`,a+b,(a+b)*c]},
    ()=>{const c=rnd(2,9),q=rnd(2,9),s=c*q,a=rnd(1,s-1);return[`(${a} + ${s-a}) : ${c}`,`? : ${c}`,s,q]},
    ()=>{const a=rnd(2,9),c=rnd(1,8),b=c+rnd(2,9);return[`${a} × (${b} − ${c})`,`${a} × ?`,b-c,a*(b-c)]},
    ()=>{const a=rnd(30,90),b=rnd(2,9),c=rnd(2,9);return[`${a} − (${b} + ${c})`,`${a} − ?`,b+c,a-b-c]}])(),
};
const exprHint={lr:'Chỉ có cộng, trừ (hoặc chỉ có nhân, chia): tính từ trái sang phải.',mix:'Có cả cộng, trừ và nhân, chia: thực hiện nhân, chia trước.',paren:'Có dấu ngoặc: tính trong ngoặc trước.'};
G.expr=(kind)=>{const k=kind||pick(['lr','mix','paren']),[e,mid,v1,v2]=EXPR[k]();
  return {html:`<div class="qlines"><div>${e}</div><div>= ${mid.replace('?','<b class="box">?</b>')}</div><div>= <b class="box">?</b></div></div>`,key:e,say:`Tính giá trị của biểu thức ${e}. ${exprHint[k]}`,
    ans:[v1,v2],hint:[exprHint[k],`Tính tiếp: ${mid.replace('?',v1)}.`]}};
const exprPair=()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(2,5);return pick([[`(${a} + ${b}) × ${c}`,`${a} + ${b} × ${c}`],[`${a} × ${b} + ${c}`,`${a} × (${b} + ${c})`],[`${a*c} : ${c} + ${b}`,`${b} + ${a*c} : ${c}`]])};

/* ---- số lớn gấp mấy lần số bé ---- */
const howGen=()=>{const b=rnd(2,9),k=rnd(2,9);return[`${b*k} gấp ? lần ${b}`,k]};
G.moreVsTimes=()=>{const b=rnd(2,9),k=rnd(2,9),a=b*k;return numQ(`<div class="qlines"><div>${a} hơn ${b} là <b class="box">?</b> đơn vị.</div><div>${a} gấp <b class="box">?</b> lần ${b}.</div></div>`,[a-b,k],[`Hơn bao nhiêu: lấy ${a} − ${b}.`,`Gấp mấy lần: lấy ${a} : ${b}.`],{say:`${a} hơn ${b} bao nhiêu đơn vị? ${a} gấp mấy lần ${b}?`})};

/* ---- bài học ---- */
LESSONS.push(
/* ---------------- BÀI 36 ---------------- */
{id:36,title:'Nhân số có ba chữ số với số có một chữ số',icon:'✖️',note:note(`<div class="colc-wrap"><div class="colc" style="--c:4;font-size:26px"><span></span><span>1</span><span>2</span><span>7</span><span class="sg">×</span><span></span><span></span><span>3</span><span class="ln"></span><span></span><span>3</span><span>8</span><span>1</span></div></div>
  <p>3 nhân 7 bằng 21, viết 1 nhớ 2. 3 nhân 2 bằng 6, thêm 2 bằng 8, viết 8. 3 nhân 1 bằng 3, viết 3.</p><p>Vậy 127 × 3 = 381.</p>`),levels:[
  colCalc({name:'Đặt tính (không nhớ)',icon:'🧮',probs:()=>[[213,'×',3],[112,'×',4],...rep(2,()=>mul3(false))]}),
  colCalc({name:'Đặt tính (có nhớ)',icon:'🧮',probs:()=>[[127,'×',3],[243,'×',4],...rep(2,()=>mul3(true))]}),
  quiz('Nhân nhẩm số tròn trăm','lt','🧠',()=>uniqQs(5,G.mul3Mental)),
  race({name:'Đua xe tốc độ',icon:'🏎️',gen:mul3Gen}),
  words({name:'Giải toán có lời văn',icon:'🚚',fixed:[
    {text:'Mỗi chuyến xe chở được 125 bao gạo. Hỏi 4 chuyến xe như vậy chở được bao nhiêu bao gạo?',vis:{type:'groups',n:4,per:1,item:'🚚'},
      ops:['125 × 4','125 + 4','125 : 4'],ans:500,unit:'bao gạo',lead:'4 chuyến xe chở được số bao gạo là:',opHint:'4 chuyến, mỗi chuyến 125 bao.'},
    {text:'Mỗi cuộn vải dài 115 m. Hỏi 6 cuộn vải như vậy dài bao nhiêu mét?',
      ops:['115 × 6','115 + 6','115 − 6'],ans:690,unit:'m',lead:'6 cuộn vải dài là:',opHint:'6 cuộn, mỗi cuộn 115 m.'},
    {text:'Một quyển truyện dày 108 trang. Hỏi 3 quyển truyện như vậy dày bao nhiêu trang?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">📕📗📘</div>'},
      ops:['108 × 3','108 + 3','108 : 3'],ans:324,unit:'trang',lead:'3 quyển truyện dày là:',opHint:'3 quyển, mỗi quyển 108 trang.'},
  ]}),
]},
/* ---------------- BÀI 37 ---------------- */
{id:37,title:'Chia số có ba chữ số cho số có một chữ số',icon:'➗',note:note(`<p>Chia từ trái sang phải. Lần chia đầu tiên, nếu chữ số hàng trăm bé hơn số chia thì lấy hai chữ số đầu.</p>
  <p>648 : 3 = 216 &nbsp;·&nbsp; 236 : 4 = 59 &nbsp;·&nbsp; 816 : 4 = 204</p><p>⚠️ Lần chia nào được 0 thì phải viết 0 ở thương.</p>`),levels:[
  colCalc({name:'Chia hết',icon:'🧮',probs:()=>[[648,':',3],[236,':',4],...rep(2,()=>div3(true,false))]}),
  colCalc({name:'Thương có chữ số 0',icon:'0️⃣',probs:()=>[[816,':',4],...rep(2,()=>div3(true,true))]}),
  colCalc({name:'Chia có dư',icon:'🧮',probs:()=>[[457,':',3],...rep(2,()=>div3(false))]}),
  race({name:'Đua chia nhẩm',icon:'🚤',me:'🚤',rival:'⛵',gen:div3Gen}),
  words({name:'Giải toán có lời văn',icon:'📚',fixed:[
    {text:'Có 216 quyển sách xếp đều vào 3 ngăn tủ. Hỏi mỗi ngăn có bao nhiêu quyển sách?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">📚📚📚</div>'},
      ops:['216 : 3','216 × 3','216 − 3'],ans:72,unit:'quyển sách',lead:'Mỗi ngăn có số quyển sách là:',opHint:'Xếp đều vào 3 ngăn → 216 : 3.'},
    {text:'Có 125 bông hoa, bó thành các bó, mỗi bó 5 bông. Hỏi bó được bao nhiêu bó hoa?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">💐</div>'},
      ops:['125 : 5','125 × 5','125 − 5'],ans:25,unit:'bó hoa',lead:'Số bó hoa bó được là:',opHint:'Mỗi bó 5 bông → 125 : 5.'},
    {direct:true,text:'Một năm có 365 ngày, mỗi tuần lễ có 7 ngày. Hỏi một năm có bao nhiêu tuần lễ và mấy ngày?',
      options:['52 tuần lễ và 1 ngày','51 tuần lễ và 8 ngày','52 tuần lễ','53 tuần lễ và 1 ngày'],ans:'52 tuần lễ và 1 ngày',opHint:'Đặt tính 365 : 7. Số dư bé hơn 7.',explain:'365 : 7 = 52 (dư 1). Một năm có <b>52 tuần lễ và 1 ngày</b>.'},
  ]}),
]},
/* ---------------- BÀI 38 ---------------- */
{id:38,title:'Biểu thức số. Tính giá trị của biểu thức số',icon:'🧩',note:note(`<p>1️⃣ Chỉ có cộng, trừ (hoặc chỉ có nhân, chia): tính <b>từ trái sang phải</b>.<br><i>60 + 20 − 5 = 80 − 5 = 75</i></p>
  <p>2️⃣ Có cộng, trừ và nhân, chia: <b>nhân, chia trước</b>; cộng, trừ sau.<br><i>60 + 20 × 2 = 60 + 40 = 100</i></p>
  <p>3️⃣ Có dấu ngoặc: tính <b>trong ngoặc trước</b>.<br><i>(60 + 20) × 2 = 80 × 2 = 160</i></p>`),levels:[
  quiz('Từ trái sang phải','kp','➡️',()=>uniqQs(4,()=>G.expr('lr')),exprHint.lr),
  quiz('Nhân, chia trước','kp','✖️',()=>uniqQs(4,()=>G.expr('mix')),exprHint.mix),
  quiz('Trong ngoặc trước','kp','🫧',()=>uniqQs(4,()=>G.expr('paren')),exprHint.paren),
  compareLv({name:'Cân biểu thức',icon:'⚖️',pairs:[[['(8 + 2) × 3','8 + 2 × 3'],['20 − 10 : 2','(20 − 10) : 2'],['4 × 5 + 6','6 + 5 × 4']],()=>rep(2,exprPair)]}),
  selectLv({name:'Toa tàu biểu thức',icon:'🚂',theme:'train',rounds:[
    {cond:'max',items:['12 + 3 × 2','(12 + 3) × 2','12 × 3 − 2','12 : 3 + 2'],prompt:'Toa tàu nào có giá trị biểu thức <b>lớn nhất</b>?'},
    ()=>({cond:'min',items:rep(4,()=>EXPR[pick(['lr','mix','paren'])]()[0]),prompt:'Toa tàu nào có giá trị biểu thức <b>bé nhất</b>?'})]}),
  words({name:'Giải bằng biểu thức',icon:'🍊',fixed:[
    {text:'Mẹ mua 3 túi cam, mỗi túi có 8 quả. Mẹ biếu bà 5 quả. Hỏi mẹ còn lại bao nhiêu quả cam?',vis:{type:'groups',n:3,per:8,item:'🍊',head:'🛍️'},
      ops:['8 × 3 − 5','8 + 3 − 5','8 × 3 + 5'],ans:19,unit:'quả cam',lead:'Mẹ còn lại số quả cam là:',opHint:'Tìm số cam mẹ mua (8 × 3) rồi bớt đi 5 quả.'},
    {text:'Có 2 hộp bút, mỗi hộp 10 cái, và thêm 6 cái bút lẻ. Số bút đó chia đều cho 2 bạn. Hỏi mỗi bạn được mấy cái bút?',
      ops:['(10 × 2 + 6) : 2','10 × 2 + 6 : 2','10 + 2 + 6 : 2'],ans:13,unit:'cái bút',lead:'Mỗi bạn được số bút là:',opHint:'Phải tính tổng số bút trước rồi mới chia → dùng dấu ngoặc.'},
  ]}),
]},
/* ---------------- BÀI 39 ---------------- */
{id:39,title:'So sánh số lớn gấp mấy lần số bé',icon:'📊',note:note(`${tapeSVG([{name:'Lớn',n:3,lab:'2 cm',tot:'6 cm'},{name:'Bé',n:1,tot:'2 cm'}])}
  <p>Muốn tìm số lớn gấp mấy lần số bé, ta lấy số lớn <b>chia</b> cho số bé. 6 : 2 = 3, vậy 6 cm gấp 3 lần 2 cm.</p>`),levels:[
  quiz('Sơ đồ so sánh','kp','📊',()=>uniqQs(5,G.howMany),'Muốn tìm số lớn gấp mấy lần số bé, ta lấy số lớn chia cho số bé.'),
  quiz('Hơn bao nhiêu, gấp mấy lần','lt','🤔',()=>uniqQs(4,G.moreVsTimes)),
  race({name:'Đua ngựa',icon:'🏇',me:'🏇',rival:'🐎',gen:howGen}),
  words({name:'Giải toán có lời văn',icon:'🪿',fixed:[
    {text:'Con gà cân nặng 2 kg, con ngỗng cân nặng 6 kg. Hỏi con ngỗng cân nặng gấp mấy lần con gà?',vis:{type:'html',html:'<div style="font-size:44px;text-align:center">🐔 🪿</div>'},
      ops:['6 : 2','6 − 2','6 × 2'],ans:3,unit:'lần',lead:'Con ngỗng cân nặng gấp con gà số lần là:',opHint:'Gấp mấy lần → lấy số lớn chia cho số bé.'},
    {text:'Đoạn thẳng AB dài 24 cm, đoạn thẳng CD dài 6 cm. Hỏi đoạn thẳng AB dài gấp mấy lần đoạn thẳng CD?',vis:{type:'html',html:tapeSVG([{name:'AB',n:4,tot:'24 cm'},{name:'CD',n:1,tot:'6 cm'}])},
      ops:['24 : 6','24 − 6','24 × 6'],ans:4,unit:'lần',lead:'Đoạn AB dài gấp đoạn CD số lần là:',opHint:'Lấy 24 chia cho 6.'},
    {text:'Lớp 3B có 32 bạn, trong đó có 8 bạn đeo kính. Hỏi số bạn cả lớp gấp mấy lần số bạn đeo kính?',
      ops:['32 : 8','32 − 8','32 + 8'],ans:4,unit:'lần',lead:'Số bạn cả lớp gấp số bạn đeo kính số lần là:',opHint:'Lấy số lớn chia cho số bé.'},
  ]}),
]},
/* ---------------- BÀI 40 ---------------- */
{id:40,title:'Luyện tập chung',icon:'🏁',note:note(`<p>✖️➗ Đặt tính nhân, chia số có ba chữ số.</p><p>🧩 Biểu thức: ngoặc trước → nhân, chia → cộng, trừ.</p><p>📊 Số lớn gấp mấy lần số bé: lấy số lớn chia số bé.</p>`),levels:[
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:()=>[mul3(true),mul3(),div3(true),div3(false)]}),
  quiz('Tính giá trị biểu thức','lt','🧩',()=>[G.expr('lr'),G.expr('mix'),G.expr('paren'),G.expr()]),
  quiz('Gấp mấy lần','lt','📊',()=>shuffle([...uniqQs(2,G.howMany),...uniqQs(2,G.moreVsTimes),G.timesUp(),G.reduce()])),
  words({name:'Giải toán có lời văn',icon:'🍉',fixed:[
    {text:'Một cửa hàng có 145 kg táo. Số cam gấp 3 lần số táo. Hỏi cửa hàng có tất cả bao nhiêu ki-lô-gam táo và cam?',parts:[
      {q:'Trước hết, tìm số cam:',ops:['145 × 3','145 + 3','145 : 3'],ans:435,unit:'kg',lead:'Cửa hàng có số ki-lô-gam cam là:',opHint:'Gấp 145 lên 3 lần.'},
      {q:'Rồi tìm số táo và cam:',ops:['145 + 435','435 − 145','435 × 3'],ans:580,unit:'kg',lead:'Cửa hàng có tất cả số ki-lô-gam táo và cam là:',opHint:'Cộng số táo và số cam.'}]},
    {text:'Có 234 quả dưa xếp đều lên 6 xe. Hỏi mỗi xe có bao nhiêu quả dưa?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">🍉 🚚🚚🚚🚚🚚🚚</div>'},
      ops:['234 : 6','234 × 6','234 − 6'],ans:39,unit:'quả dưa',lead:'Mỗi xe có số quả dưa là:',opHint:'Xếp đều lên 6 xe → 234 : 6.'},
  ]}),
]},
/* ---------------- BÀI 41 ---------------- */
{id:41,title:'Ôn tập phép nhân, phép chia trong phạm vi 100, 1 000',icon:'🔁',note:note(`<p>📋 Bảng nhân, bảng chia từ 2 đến 9.</p><p>✖️ Nhân: tính từ phải sang trái. ➗ Chia: tính từ trái sang phải.</p><p>🔎 Thừa số = Tích : Thừa số kia · Số bị chia = Thương × Số chia · Số chia = Số bị chia : Thương</p>`),levels:[
  race({name:'Ôn bảng nhân, bảng chia',icon:'🏎️',gen:()=>tableGen(rnd(2,9))()}),
  colCalc({name:'Đặt tính nhân',icon:'✖️',probs:()=>[mul2(true),mul3(false),mul3(true)]}),
  colCalc({name:'Đặt tính chia',icon:'➗',probs:()=>[div2(true),div3(true),div3(false)]}),
  quiz('Tìm thành phần chưa biết','lt','🔎',()=>uniqQs(6,G.findMD)),
  words({name:'Giải toán có lời văn',icon:'🧺',fixed:[
    {text:'Mỗi rổ có 18 quả xoài. Hỏi 5 rổ như vậy có bao nhiêu quả xoài?',vis:{type:'groups',n:5,per:1,item:'🧺'},
      ops:['18 × 5','18 + 5','18 : 5'],ans:90,unit:'quả xoài',lead:'5 rổ có số quả xoài là:',opHint:'5 rổ, mỗi rổ 18 quả.'},
    {text:'Có 306 cái bánh chia đều vào 9 hộp. Hỏi mỗi hộp có bao nhiêu cái bánh?',
      ops:['306 : 9','306 × 9','306 − 9'],ans:34,unit:'cái bánh',lead:'Mỗi hộp có số cái bánh là:',opHint:'Chia đều vào 9 hộp → 306 : 9.'},
  ]}),
]},
/* ---------------- BÀI 42 ---------------- */
{id:42,title:'Ôn tập biểu thức số',icon:'🧩',note:note(`<p>1️⃣ Chỉ có + − hoặc chỉ có × : → trái sang phải.</p><p>2️⃣ Có cả + − và × : → nhân, chia trước.</p><p>3️⃣ Có ngoặc → trong ngoặc trước.</p>`),levels:[
  quiz('Tính giá trị biểu thức','lt','🧩',()=>shuffle([...uniqQs(2,()=>G.expr('lr')),...uniqQs(2,()=>G.expr('mix')),...uniqQs(2,()=>G.expr('paren'))])),
  compareLv({name:'Cân biểu thức',icon:'⚖️',pairs:[()=>rep(5,exprPair)]}),
  pairs({name:'Ghép biểu thức cùng giá trị',icon:'🚁',theme:'heli',top:'trực thăng',bottom:'bãi đáp',rounds:[
    {tops:['(3 + 5) × 2','20 − 4 × 2','6 × 3 : 2','10 + 10 : 2'],bottoms:['4 × 3','12 : 3 × 4','3 × 3','3 × 5']},
  ]}),
  words({name:'Giải bằng biểu thức',icon:'🐟',fixed:[
    {text:'Bể thứ nhất có 45 con cá, bể thứ hai có 35 con cá. Người ta chia đều số cá ở cả hai bể vào 8 chậu. Hỏi mỗi chậu có bao nhiêu con cá?',vis:{type:'html',html:'<div style="font-size:40px;text-align:center">🐟 ➜ 🪣×8</div>'},
      ops:['(45 + 35) : 8','45 + 35 : 8','45 × 35 : 8'],ans:10,unit:'con cá',lead:'Mỗi chậu có số con cá là:',opHint:'Tính tổng số cá trước (cần dấu ngoặc), rồi chia cho 8.'},
    {text:'Mỗi gói kẹo có 9 cái. Lan có 4 gói kẹo và 7 cái kẹo lẻ. Hỏi Lan có tất cả bao nhiêu cái kẹo?',vis:{type:'groups',n:4,per:9,item:'🍬',head:'🛍️'},
      ops:['9 × 4 + 7','9 × (4 + 7)','9 + 4 + 7'],ans:43,unit:'cái kẹo',lead:'Lan có tất cả số cái kẹo là:',opHint:'Kẹo trong gói: 9 × 4, cộng thêm 7 cái lẻ.'},
  ]}),
]},
/* ---------------- BÀI 43 ---------------- */
{id:43,title:'Ôn tập hình học và đo lường',icon:'📐',note:note(`<p>📍 Trung điểm · ⭕ Tâm, bán kính, đường kính · 📐 Góc vuông · 🔷 Hình chữ nhật, hình vuông · 🧊 Khối lập phương, khối hộp chữ nhật</p>
  <p>📏 1 cm = 10 mm · ⚖️ 1 kg = 1000 g · 🥛 1 l = 1000 ml · 🌡️ °C</p>`),levels:[
  quiz('Ôn hình học','lt','📐',()=>shuffle([G.midRuler(),G.circleParts(),G.radius(),G.angleKind(),G.rightCount(),G.rectFacts(),G.solidFacts()])),
  quiz('Ôn đo lường','lt','📏',()=>shuffle([G.readMM(),G.readG(),G.readML(),G.readT(),G.convMM(),G.convG(),G.convML()])),
  quiz('So sánh số đo','lt','⚖️',()=>uniqQs(5,G.cmpUnit)),
  gridLv({name:'Vẽ hình',icon:'✏️',rounds:[gridMid,gridRight,gridRect(false),gridRect(true)]}),
  words({name:'Giải toán có lời văn',icon:'🧃',fixed:[
    {text:'Mỗi chai nước có 500 ml. Hỏi 2 chai như vậy có bao nhiêu mi-li-lít nước? (Đó cũng chính là 1 l nước đấy!)',vis:{type:'groups',n:2,per:1,item:'🍶'},
      ops:['500 × 2','500 + 2','500 : 2'],ans:1000,unit:'ml',lead:'2 chai có số mi-li-lít nước là:',opHint:'2 chai, mỗi chai 500 ml.',},
    {text:'Hình tròn tâm O có đường kính 18 cm. Hỏi bán kính của hình tròn dài bao nhiêu xăng-ti-mét?',
      ops:['18 : 2','18 × 2','18 − 2'],ans:9,unit:'cm',lead:'Bán kính hình tròn dài là:',opHint:'Bán kính bằng một nửa đường kính.'},
  ]}),
]},
/* ---------------- BÀI 44 ---------------- */
{id:44,title:'Ôn tập chung',icon:'🏆',note:note(`<p>Ôn lại tất cả các bài trong học kì 1. Làm xong bài này, con hãy thử sức với <b>Đề kiểm tra cuối học kì 1</b> nhé!</p>`),levels:[
  quiz('Tính nhẩm','lt','🧠',()=>shuffle([G.mulMental(),G.mul3Mental(),G.divMental(),G.div3Mental(),G.findMD(),G.timesUp(),G.reduce(),G.fracOf(false)])),
  colCalc({name:'Đặt tính rồi tính',icon:'🧮',probs:()=>[[rnd(100,499),'+',rnd(100,499)],[rnd(500,999),'−',rnd(100,499)],mul3(true),div3(pick([true,false]))]}),
  quiz('Biểu thức và tìm số','lt','🧩',()=>shuffle([G.expr(),G.expr(),G.findMD(),G.findMD(),G.remDiv()])),
  quiz('Hình học và đo lường','lt','📐',()=>shuffle([G.circleParts(),G.radius(),G.angleKind(),G.countFig(),G.readT(),G.cmpUnit(),G.fracShape()])),
  words({name:'Giải toán hai bước',icon:'🪜',fixed:()=>shuffle([
    {text:'Thùng thứ nhất có 126 l nước, thùng thứ hai có ít hơn thùng thứ nhất 38 l. Hỏi cả hai thùng có bao nhiêu lít nước?',parts:[
      {q:'Trước hết, tìm số nước ở thùng thứ hai:',ops:['126 − 38','126 + 38','126 : 38'],ans:88,unit:'l',lead:'Thùng thứ hai có số lít nước là:',opHint:'Ít hơn 38 l → trừ.'},
      {q:'Rồi tìm số nước ở cả hai thùng:',ops:['126 + 88','126 − 88','88 + 38'],ans:214,unit:'l',lead:'Cả hai thùng có số lít nước là:',opHint:'Cộng số nước của hai thùng.'}]},
    {text:'Một cửa hàng có 96 kg đường, đã bán được số đường bằng số đường của cửa hàng giảm đi 4 lần. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam đường?',parts:[
      {q:'Trước hết, tìm số đường đã bán:',ops:['96 : 4','96 − 4','96 × 4'],ans:24,unit:'kg',lead:'Số đường đã bán là:',opHint:'Giảm 96 đi 4 lần.'},
      {q:'Rồi tìm số đường còn lại:',ops:['96 − 24','96 + 24','24 × 4'],ans:72,unit:'kg',lead:'Cửa hàng còn lại số đường là:',opHint:'Lấy số đường ban đầu trừ số đã bán.'}]},
    {text:'Lớp 3A trồng được 8 cây. Lớp 3B trồng được gấp 3 lần số cây của lớp 3A. Hỏi lớp 3B trồng nhiều hơn lớp 3A bao nhiêu cây?',parts:[
      {q:'Trước hết, tìm số cây lớp 3B trồng:',ops:['8 × 3','8 + 3','8 : 3'],ans:24,unit:'cây',lead:'Lớp 3B trồng được số cây là:',opHint:'Gấp 8 lên 3 lần.'},
      {q:'Rồi tìm lớp 3B trồng nhiều hơn bao nhiêu cây:',ops:['24 − 8','24 + 8','24 : 8'],ans:16,unit:'cây',lead:'Lớp 3B trồng nhiều hơn lớp 3A số cây là:',opHint:'Nhiều hơn bao nhiêu → lấy số lớn trừ số bé.'}]},
  ]).slice(0,2)}),
]},
);
