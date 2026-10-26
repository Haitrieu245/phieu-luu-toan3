/* ================= ÔN THI CUỐI HỌC KÌ 1 =================
   Đề theo cấu trúc thường gặp: Phần I trắc nghiệm (8 câu × 0,5 điểm),
   Phần II tự luận (đặt tính, biểu thức, tìm số, giải toán hai bước, bài toán vui) = 10 điểm. */
const TN='Phần I. Trắc nghiệm',TL='Phần II. Tự luận';
const abcd=(q,o={})=>({abcd:true,cls:'wide',pts:.5,part:TN,...q,...o});
const posW=(ans,ws)=>ws.filter(w=>typeof w!=='number'||w>0);
const E={};
E.table=()=>{const a=rnd(6,9),b=rnd(3,9),p=a*b;return pick([
  abcd({html:`<p class="q-t">Kết quả của phép tính ${a} × ${b} là:</p>`,choices:mc(p,posW(p,[p+a,p-b,a*(b+1),a+b,p+10])),ans:p,hint:`Nhớ lại bảng nhân ${a}.`}),
  abcd({html:`<p class="q-t">Kết quả của phép tính ${p} : ${a} là:</p>`,choices:mc(b,posW(b,[b+1,b-1,a,b+2])),ans:b,hint:`${a} × mấy = ${p}?`})])};
E.frac=()=>{const n=rnd(3,9),k=rnd(3,9),u=pick(['kg','l','m','quả cam']);
  return abcd({html:`<p class="q-t">${frac(n)} của ${n*k} ${u} là:</p>`,say:`${fracName(n)} của ${n*k} ${u} là bao nhiêu?`,choices:mc(`${k} ${u}`,[`${k+1} ${u}`,`${n*k-n} ${u}`,`${n+k} ${u}`,`${k-1} ${u}`]),ans:`${k} ${u}`,hint:`Lấy ${n*k} : ${n}.`})};
E.unit=()=>{const a=rnd(2,9);return pick([
  abcd({html:`<p class="q-t">${a} cm = … mm. Số thích hợp điền vào chỗ chấm là:</p>`,choices:mc(a*10,[a,a*100,a+10]),ans:a*10,hint:'1 cm = 10 mm.'}),
  abcd({html:'<p class="q-t">1 kg = … g. Số thích hợp điền vào chỗ chấm là:</p>',choices:mc(1000,[100,10,10000]),ans:1000,hint:'1 kg = 1000 g.'}),
  abcd({html:'<p class="q-t">1 l = … ml. Số thích hợp điền vào chỗ chấm là:</p>',choices:mc(1000,[100,10,500]),ans:1000,hint:'1 l = 1000 ml.'}),
  abcd({html:`<p class="q-t">${a*100} g + ${(10-a)*100} g = …</p>`,choices:mc('1 kg',['10 kg','100 g','1000 kg']),ans:'1 kg',hint:`${a*100} + ${(10-a)*100} = 1000 g = 1 kg.`})])};
E.geo=()=>{const r=rnd(3,9),k=pick(['rect','rtri','trap','tri']);return pick([
  abcd({html:`<p class="q-t">Hình tròn có bán kính ${r} cm thì đường kính là:</p>`,choices:mc(`${2*r} cm`,[`${r} cm`,`${r+2} cm`,`${3*r} cm`]),ans:`${2*r} cm`,hint:'Đường kính gấp 2 lần bán kính.'}),
  abcd({html:`${shapeSVG(k,120)}<p class="q-t">Hình trên có mấy góc vuông?</p>`,choices:[0,1,2,4].map(String),ans:String(SHAPES[k].rt),hint:'Dùng ê-ke kiểm tra từng góc.'}),
  abcd({html:'<p class="q-t">Khối lập phương có bao nhiêu cạnh?</p>',choices:mc('12 cạnh',['8 cạnh','6 cạnh','4 cạnh']),ans:'12 cạnh',hint:'4 cạnh mặt trên, 4 cạnh mặt dưới, 4 cạnh đứng.'}),
  abcd({html:`<p class="q-t">M là trung điểm của đoạn thẳng AB dài ${2*r} cm. Độ dài đoạn thẳng AM là:</p>`,choices:mc(`${r} cm`,[`${2*r} cm`,`${4*r} cm`,`${r+1} cm`]),ans:`${r} cm`,hint:'AM bằng một nửa AB.'})])};
E.times=()=>{const a=rnd(3,9),k=rnd(3,9);return pick([
  abcd({html:`<p class="q-t">Gấp ${a} lên ${k} lần được:</p>`,choices:mc(a*k,[a+k,a*k-a,a*k+k]),ans:a*k,hint:`Gấp lên ${k} lần → nhân ${k}.`}),
  abcd({html:`<p class="q-t">Giảm ${a*k} đi ${k} lần được:</p>`,choices:mc(a,[a*k-k,a+1,a*k+k]),ans:a,hint:`Giảm đi ${k} lần → chia ${k}.`}),
  abcd({html:`<p class="q-t">${a*k} gấp mấy lần ${a}?</p>`,choices:mc(`${k} lần`,[`${a*k-a} lần`,`${k+1} lần`,`${a} lần`]),ans:`${k} lần`,hint:`Lấy ${a*k} : ${a}.`})])};
E.expr=()=>{const b=rnd(2,9),c=rnd(2,9),a=rnd(20,60),v=a+b*c,w=(a+b)*c;
  return pick([
    abcd({html:`<p class="q-t">Giá trị của biểu thức ${a} + ${b} × ${c} là:</p>`,choices:mc(v,[w,a+b+c,v+10]),ans:v,hint:'Nhân trước, cộng sau.'}),
    abcd({html:`<p class="q-t">Giá trị của biểu thức (${b} + ${c}) × 3 là:</p>`,choices:mc((b+c)*3,[b+c*3,b*3+c,(b+c)*3+3]),ans:(b+c)*3,hint:'Tính trong ngoặc trước.'})])};
E.read=()=>{const t=rnd(10,22)*2;return pick([
  abcd({html:`${thermoSVG(t,50,170)}<p class="q-t">Nhiệt kế chỉ:</p>`,choices:mc(`${t} °C`,[`${t+2} °C`,`${t-2} °C`,`${t+10} °C`]),ans:`${t} °C`,hint:'Mỗi vạch nhỏ là 1 °C.'}),
  (()=>{const g=rnd(2,9)*100;return abcd({html:`${gScaleSVG(g,'🍍',130)}<p class="q-t">Quả dứa cân nặng:</p>`,choices:mc(`${g} g`,[`${g+50} g`,`${g/100} kg`,`${g-100} g`]),ans:`${g} g`,hint:'Đọc số kim chỉ trên mặt cân.'})})()])};
E.rem=()=>{const d=rnd(4,9),q=rnd(3,9),r=rnd(1,d-1),x=d*q+r;return pick([
  abcd({html:`<p class="q-t">Trong phép chia có số chia là ${d}, số dư lớn nhất có thể là:</p>`,choices:mc(d-1,[d,d+1,d-2]),ans:d-1,hint:'Số dư luôn bé hơn số chia.'}),
  abcd({html:`<p class="q-t">Phép chia ${x} : ${d} có số dư là:</p>`,choices:mc(r,[q,r+1,d]),ans:r,hint:`${d} × ${q} = ${d*q}, ${x} − ${d*q} = ?`})])};
// Tự luận
const tl=(q,pts,o={})=>({part:TL,pts,...q,...o});
E.col=()=>{
  const a=rnd(125,468),b=rnd(116,499),c=rnd(512,946),d=rnd(158,c-100);
  return [
    tl({html:`<p class="q-t">Đặt tính rồi tính: ${a} + ${b}</p>`,col:[a,'+',b],say:`Đặt tính rồi tính ${a} cộng ${b}.`},.5),
    tl({html:`<p class="q-t">Đặt tính rồi tính: ${c} − ${d}</p>`,col:[c,'−',d],say:`Đặt tính rồi tính ${c} trừ ${d}.`},.5),
    (()=>{const m=mul3(true);return tl({html:`<p class="q-t">Đặt tính rồi tính: ${m[0]} × ${m[2]}</p>`,col:m,say:`Đặt tính rồi tính ${m[0]} nhân ${m[2]}.`},.5)})(),
    (()=>{const m=div3(pick([true,false]));return tl({html:`<p class="q-t">Đặt tính rồi tính: ${m[0]} : ${m[2]}</p>`,col:m,say:`Đặt tính rồi tính ${m[0]} chia ${m[2]}.`},.5)})(),
  ];
};
E.exprTL=k=>{const q=G.expr(k);return tl({...q,html:'<p class="q-t">Tính giá trị của biểu thức:</p>'+q.html},.5)};
E.findTL=()=>{const q=G.findMD();return tl({...q,html:'<p class="q-t">Tìm số thích hợp thay cho dấu ?</p>'+q.html},.5)};
// Bài toán giải bằng hai bước tính
const WP=[
  ()=>{const a=rnd(120,350),b=rnd(25,95);return{t:`Thùng thứ nhất có ${a} l nước mắm, thùng thứ hai có nhiều hơn thùng thứ nhất ${b} l. Hỏi cả hai thùng có bao nhiêu lít nước mắm?`,
    l1:'Thùng thứ hai có số lít nước mắm là:',e1:`${a} + ${b}`,v1:a+b,u1:'l',l2:'Cả hai thùng có số lít nước mắm là:',e2:`${a} + ${a+b}`,v2:2*a+b,u2:'l'}},
  ()=>{const a=rnd(12,45),k=rnd(2,4);return{t:`Lan gấp được ${a} con hạc giấy. Mai gấp được số con hạc gấp ${k} lần số hạc của Lan. Hỏi cả hai bạn gấp được bao nhiêu con hạc giấy?`,
    l1:'Mai gấp được số con hạc là:',e1:`${a} × ${k}`,v1:a*k,u1:'con hạc',l2:'Cả hai bạn gấp được số con hạc là:',e2:`${a} + ${a*k}`,v2:a+a*k,u2:'con hạc'}},
  ()=>{const s=pick([2,3,4,6]),m=s*rnd(2,4),k=rnd(3,8),tot=k*m;return{t:`Mẹ mua ${k} hộp bánh, mỗi hộp có ${m} cái bánh. Mẹ chia đều số bánh cho ${s} anh em. Hỏi mỗi người được bao nhiêu cái bánh?`,
    l1:'Mẹ mua số cái bánh là:',e1:`${m} × ${k}`,v1:tot,u1:'cái bánh',l2:'Mỗi người được số cái bánh là:',e2:`${tot} : ${s}`,v2:tot/s,u2:'cái bánh'}},
  ()=>{const n=pick([3,4,5]),q=rnd(12,40),a=n*q;return{t:`Một cửa hàng có ${a} kg gạo. Buổi sáng cửa hàng bán được số gạo bằng số gạo của cửa hàng giảm đi ${n} lần. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?`,
    l1:'Buổi sáng cửa hàng bán được số gạo là:',e1:`${a} : ${n}`,v1:q,u1:'kg',l2:'Cửa hàng còn lại số gạo là:',e2:`${a} − ${q}`,v2:a-q,u2:'kg'}},
  ()=>{const k=rnd(4,8),m=rnd(12,24),s=rnd(15,k*m-20);return{t:`Một cửa hàng có ${k} thùng sữa, mỗi thùng có ${m} hộp. Cửa hàng đã bán ${s} hộp sữa. Hỏi cửa hàng còn lại bao nhiêu hộp sữa?`,
    l1:'Cửa hàng có số hộp sữa là:',e1:`${m} × ${k}`,v1:k*m,u1:'hộp sữa',l2:'Cửa hàng còn lại số hộp sữa là:',e2:`${k*m} − ${s}`,v2:k*m-s,u2:'hộp sữa'}},
];
E.word=()=>{const w=pick(WP)();return tl({html:`<p class="q-t" style="text-align:left">${w.t}</p><div class="sol-box" style="text-align:left;width:100%"><div class="sol-t">Bài giải</div><div>${w.l1}</div><div class="sol-eq"><b class="box">?</b> (${w.u1})</div><div>${w.l2}</div><div class="sol-eq"><b class="box">?</b> (${w.u2})</div></div>`,
  say:w.t,key:w.t,ans:[w.v1,w.v2],hint:[`${w.e1} = ?`,`${w.e2} = ?`],hintAfter:1},1.5)};
// Bài toán vui
E.fun=()=>pick([
  ()=>{const x=rnd(4,20),k=rnd(2,4),c=rnd(2,9);return tl({html:`<p class="q-t">Tìm một số, biết rằng lấy số đó gấp lên ${k} lần rồi cộng thêm ${c} thì được ${x*k+c}.<br>Số đó là <b class="box">?</b></p>`,ans:x,hint:`Làm ngược lại: ${x*k+c} − ${c} = ${x*k}, rồi ${x*k} : ${k}.`},.5)},
  ()=>{const m=pick([4,5,6]),n=m*rnd(4,8)+rnd(1,m-1);return tl({html:`<p class="q-t">Có ${n} bạn đi tham quan, mỗi xe chở được ${m} bạn. Cần ít nhất <b class="box">?</b> xe để chở hết các bạn.</p>`,ans:Math.ceil(n/m),hint:`${n} : ${m} = ${Math.floor(n/m)} (dư ${n%m}). Các bạn còn dư cũng cần một xe nữa!`},.5)},
  ()=>{const c=rnd(6,9),k=rnd(4,5);return tl({html:`<p class="q-t">Năm nay con ${c} tuổi, tuổi bố gấp ${k} lần tuổi con. Bố hơn con <b class="box">?</b> tuổi.</p>`,ans:c*k-c,hint:`Tuổi bố: ${c} × ${k} = ${c*k}. Rồi lấy ${c*k} − ${c}.`},.5)},
  ()=>{const f=pick(CNT_FIGS);return tl({html:`${f.svg}<p class="q-t">${f.q}<br>Trả lời: <b class="box">?</b> hình.</p>`,say:f.q,ans:f.a,hint:f.h},.5)},
])();
function deThi(){
  return [
    E.table(),E.frac(),E.unit(),E.geo(),E.times(),E.expr(),E.read(),E.rem(),
    ...E.col(),E.exprTL('mix'),E.exprTL('paren'),E.findTL(),E.findTL(),E.word(),E.fun(),
  ];
}
const EXAM_INTRO='Đề kiểm tra cuối học kì 1. Phần I trắc nghiệm 4 điểm, Phần II tự luận 6 điểm. Đúng ngay lần đầu thì được trọn điểm câu đó. Con làm cẩn thận nhé!';

LESSONS.push(
{id:'hk1',tab:'Ôn thi HK1',title:'Ôn tập và kiểm tra cuối học kì 1',icon:'📝',note:note(`<p><b>Cấu trúc đề:</b></p>
  <p>📝 <b>Phần I. Trắc nghiệm</b> (4 điểm): 8 câu, mỗi câu 0,5 điểm — chọn A, B, C hoặc D.</p>
  <p>✍️ <b>Phần II. Tự luận</b> (6 điểm): đặt tính rồi tính (2 điểm), tính giá trị biểu thức (1 điểm), tìm số (1 điểm), giải bài toán hai bước (1,5 điểm), bài toán vui (0,5 điểm).</p>
  <p>⭐ Trả lời đúng ngay lần đầu: trọn điểm. Sai một lần: được nửa số điểm.</p>
  <p>💡 Mẹo: đọc kĩ đề, đổi về cùng đơn vị, nhân chia trước cộng trừ sau, làm xong thì thử lại.</p>`),levels:[
  quiz('Luyện trắc nghiệm','lt','🅰️',()=>shuffle([E.table(),E.frac(),E.unit(),E.geo(),E.times(),E.expr(),E.read(),E.rem(),E.unit(),E.geo()]).map(q=>({...q,pts:0})),'Đọc kĩ câu hỏi, tính ra nháp rồi chọn đáp án A, B, C hoặc D.'),
  colCalc({name:'Luyện đặt tính',icon:'🧮',probs:()=>E.col().map(q=>q.col)}),
  quiz('Luyện biểu thức và tìm số','lt','🧩',()=>[E.exprTL('lr'),E.exprTL('mix'),E.exprTL('paren'),E.findTL(),E.findTL(),E.fun()].map(q=>({...q,pts:0}))),
  words({name:'Luyện giải toán',icon:'🪜',fixed:()=>shuffle(WP).slice(0,3).map(f=>{const w=f();return{text:w.t,parts:[
    {q:'Bước 1: con chọn phép tính đúng.',ops:[w.e1,...wrongOps(w.e1)],ans:w.v1,unit:w.u1,lead:w.l1,opHint:'Đọc kĩ: “nhiều hơn” → cộng, “ít hơn” → trừ, “gấp” → nhân, “giảm đi … lần”, “chia đều” → chia.'},
    {q:'Bước 2: con chọn phép tính đúng.',ops:[w.e2,...wrongOps(w.e2)],ans:w.v2,unit:w.u2,lead:w.l2,opHint:'Dùng kết quả của bước 1 để tính tiếp.'}]}})}),
  exam('Đề số 1','1️⃣',deThi,EXAM_INTRO),
  exam('Đề số 2','2️⃣',deThi,EXAM_INTRO),
  exam('Đề số 3','3️⃣',deThi,EXAM_INTRO),
  exam('Đề số 4','4️⃣',deThi,EXAM_INTRO),
]},
);
// Hai phép tính sai để chọn: đổi dấu phép tính
function wrongOps(e){const [x,op,y]=e.split(' ');const alt={'+':['−','×'],'−':['+',':'],'×':['+',':'],':':['×','−']}[op];return alt.map(o=>`${x} ${o} ${y}`)}
