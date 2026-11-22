/* ================= ÔN TẬP THEO PHIẾU BÀI TẬP CUỐI TUẦN =================
   Mỗi phiếu là một bộ số liệu; phieuQs() dựng thành các câu hỏi có điểm và lời giải chi tiết (q.sol).
   Thêm phiếu mới: viết một hàm trả về bộ số liệu (xem PHIEU_1) rồi thêm level vào CUỐI mảng levels
   (sao được lưu theo thứ tự level, đừng chèn vào giữa). */

// Lời giải từng bước của một phép tính đặt cột (giống gợi ý trong colOne/divOne)
function colExplain([x,op,y]){
  const out=[],H=['Hàng đơn vị','Hàng chục','Hàng trăm','Hàng nghìn'];
  if(op===':'){
    const S=divSteps(x,y),q=Math.floor(x/y),r=x%y,sx=String(x);
    S.forEach((st,j)=>out.push(`${j?`Hạ ${sx[st.i]}, được ${st.cur}. `:''}${st.cur} : ${y} được ${st.q}, viết ${st.q}; ${st.q} × ${y} = ${st.q*y}; ${st.cur} − ${st.q*y} = ${st.rem}.`));
    out.push(`<b>${x} : ${y} = ${q}${r?` (dư ${r})`:''}</b>`);
    out.push(`Thử lại: ${q} × ${y}${r?` + ${r}`:''} = ${x}. Đúng!${r?` (Số dư ${r} bé hơn số chia ${y}.)`:''}`);
    return out.map(t=>`<p>${t}</p>`).join('');
  }
  const r=op==='+'?x+y:op==='×'?x*y:x-y,sx=String(x),sy=String(y),sr=String(r);let carry=0;
  for(let c=0;c<sr.length;c++){
    const dx=+(sx[sx.length-1-c]||0),dy=+(sy[sy.length-1-c]||0);let t;
    if(op==='+'){const s=dx+dy+carry;t=`${dx} + ${dy}${carry?' + 1 (nhớ)':''} = ${s}, viết ${s%10}${s>9?', nhớ 1':''}.`;carry=s>9?1:0}
    else if(op==='×'){
      if(c<sx.length){const s=dx*y+carry;t=`${dx} × ${y} = ${dx*y}${carry?`, thêm ${carry} bằng ${s}`:''}, viết ${s%10}${s>9?`, nhớ ${Math.floor(s/10)}`:''}.`;carry=Math.floor(s/10)}
      else{t=`Viết số nhớ ${carry}.`;carry=0}
    }else{const sub=dy+carry;if(dx<sub){t=`${dx} không trừ được ${sub}, lấy 1${dx} − ${sub} = ${dx+10-sub}, viết ${dx+10-sub}, nhớ 1.`;carry=1}else{t=`${carry?`${dy} thêm 1 bằng ${sub}; `:''}${dx} − ${sub} = ${dx-sub}, viết ${dx-sub}.`;carry=0}}
    out.push(`${H[c]}: ${t}`);
  }
  out.push(`<b>${x} ${op} ${y} = ${r}</b>`);
  if(op==='+')out.push(`Thử lại: ${r} − ${y} = ${x}. Đúng!`);
  if(op==='−')out.push(`Thử lại: ${r} + ${y} = ${x}. Đúng!`);
  return out.map(t=>`<p>${t}</p>`).join('');
}

// d = {c1:[[400,2],…], c2:[[356,'+',267],…], c3a:[[38,5],…], c3b:[[69,5],…], c4:{…}, c5:{…}, c6:{a,b,c,d}}
function phieuQs(d){
  const qs=[],P=(part,n,i)=>({part,no:n>1?`${i+1}/${n}`:'',pts:0});
  // Câu 1. Tính nhẩm
  qs.push({...P('Câu 1. Tính nhẩm',1,0),pts:1,
    html:`<p class="q-t">Tính nhẩm:</p><div class="q-lines">${d.c1.map(([a,b])=>`<p class="qbig">${a} × ${b} = <b class="box">?</b></p>`).join('')}</div>`,
    say:'Tính nhẩm: '+d.c1.map(([a,b])=>`${a} × ${b}`).join(', '),
    ans:d.c1.map(([a,b])=>a*b),hint:d.c1.map(([a,b])=>`${a/100} trăm × ${b} = ${a/100*b} trăm.`),hintAfter:1,
    sol:`<p>Nhân số tròn trăm: đọc số đó là “mấy trăm”, nhân như bảng nhân rồi thêm “trăm”.</p>`+d.c1.map(([a,b])=>`<p>${a} × ${b}: ${a/100} trăm × ${b} = ${a/100*b} trăm, vậy <b>${a} × ${b} = ${a*b}</b>.</p>`).join('')});
  // Câu 2, Câu 3. Đặt tính rồi tính
  const col=(part,list,pts)=>list.forEach((c,i)=>qs.push({...P(part,list.length,i),pts,col:c,
    html:`<p class="q-t">Đặt tính rồi tính: ${c[0]} ${c[1]} ${c[2]}</p>`,say:`Đặt tính rồi tính ${c[0]} ${c[1]} ${c[2]}.`,
    sol:(c[1]===':'?'<p>Chia từ trái sang phải.</p>':'<p>Viết các chữ số thẳng cột, tính từ phải sang trái.</p>')+colExplain(c)}));
  col('Câu 2. Đặt tính rồi tính',d.c2,.5);
  col('Câu 3a. Đặt tính rồi tính',d.c3a.map(([a,b])=>[a,'×',b]),.25);
  col('Câu 3b. Đặt tính rồi tính',d.c3b.map(([a,b])=>[a,':',b]),.25);
  // Câu 4. Bài toán chia đều
  {const w=d.c4,q=w.total/w.k;
  qs.push({...P('Câu 4. Giải toán',1,0),pts:1,
    html:`<p class="q-t" style="text-align:left">${w.text}</p><div class="sol-box" style="text-align:left;width:100%"><div class="sol-t">Bài giải</div><div>${w.lead}</div><div class="sol-eq">${w.total} : ${w.k} = <b class="box">?</b> (${w.unit})</div></div>`,
    say:w.text,ans:q,hint:`Chia đều vào ${w.k} ${w.c} → lấy ${w.total} : ${w.k}. Chia từ hàng chục: ${Math.floor(w.total/10)} : ${w.k}…`,hintAfter:1,
    sol:`<p>“Xếp đều vào ${w.k} ${w.c}” nghĩa là chia ${w.total} ${w.unit} thành ${w.k} phần bằng nhau → dùng <b>phép chia</b>.</p><p>${w.lead}</p><p class="sol-eq">${w.total} : ${w.k} = ${q} (${w.unit})</p><p class="sol-ans">Đáp số: ${q} ${w.unit}.</p><p>Thử lại: ${q} × ${w.k} = ${w.total}. Đúng!</p>`})}
  // Câu 5. Nhiều hơn — cho nhau để bằng nhau
  {const w=d.c5,b=w.a-w.d,g=w.d/2;
  qs.push({...P('Câu 5. Giải toán',1,0),pts:2,
    html:`<p class="q-t" style="text-align:left">${w.A} gấp được ${w.a} ${w.u}. ${w.A} gấp được nhiều hơn ${w.B} ${w.d} ${w.u}.</p>
      <p class="q-t" style="text-align:left">a) ${w.B} gấp được <b class="box">?</b> ${w.u}.</p>
      <p class="q-t" style="text-align:left">b) ${w.A} cho ${w.B} một số ${w.u} thì số ${w.u} của hai bạn bằng nhau. ${w.A} đã cho ${w.B} <b class="box">?</b> ${w.u}.</p>`,
    say:`${w.A} gấp được ${w.a} ${w.u}. ${w.A} gấp được nhiều hơn ${w.B} ${w.d} ${w.u}. Câu a: ${w.B} gấp được bao nhiêu ${w.u}? Câu b: ${w.A} cho ${w.B} một số ${w.u} thì số ${w.u} của hai bạn bằng nhau. Hỏi ${w.A} đã cho ${w.B} bao nhiêu ${w.u}?`,
    ans:[b,g],hint:[`${w.A} nhiều hơn ${w.B} ${w.d} → ${w.B} ít hơn ${w.A} ${w.d}: ${w.a} − ${w.d} = ?`,`Nếu cho cả ${w.d} cái thì ${w.B} lại nhiều hơn! Chỉ cần cho một nửa phần hơn: ${w.d} : 2 = ?`],hintAfter:1,
    sol:`${tapeSVG([{name:w.A,n:w.a,tot:w.a},{name:w.B,n:b,tot:b}],Math.min(16,220/w.a))}
      <p><b>a)</b> ${w.A} nhiều hơn ${w.B} ${w.d} ${w.u}, tức là ${w.B} ít hơn ${w.A} ${w.d} ${w.u}.</p><p class="sol-eq">${w.a} − ${w.d} = ${b} (${w.u})</p>
      <p><b>b)</b> ${w.A} đang hơn ${w.B} ${w.d} ${w.u}. Nếu ${w.A} cho ${w.B} cả ${w.d} cái thì ${w.B} lại hơn ${w.A}. Muốn bằng nhau, ${w.A} chỉ cho <b>một nửa</b> phần hơn:</p><p class="sol-eq">${w.d} : 2 = ${g} (${w.u})</p>
      <p>Thử lại: ${w.A} còn ${w.a} − ${g} = ${w.a-g}; ${w.B} có ${b} + ${g} = ${b+g}. Bằng nhau. Đúng!</p>
      <p class="sol-ans">Đáp số: a) ${b} ${w.u}; b) ${g} ${w.u}.</p>`})}
  // Câu 6. Tính nhanh
  {const {a,b,c,d:dd}=d.c6,L=['a','b','c','d'];
  const items=[
    {e:a.e,ans:a.v,hint:'Đừng tính từ trái sang! Ghép từng cặp “cộng số lớn, trừ số bé” cạnh nhau.',sol:a.sol},
    {e:b.e,ans:b.v,hint:`Ba tích đều nhân với ${b.k}: cộng các số kia lại trước rồi nhân ${b.k}.`,sol:b.sol},
    {e:c.e,ans:c.v,hint:`${c.m} × ${c.j} = ${c.m*c.j}. Viết ${c.m*c.j} thành “mấy × ${c.k}”?`,sol:c.sol},
    {e:dd.e,ans:dd.v,hint:`Các số đều chia cho ${dd.k}: cộng các số bị chia lại trước rồi chia ${dd.k}.`,sol:dd.sol},
  ];
  items.forEach((t,i)=>qs.push({...P('Câu 6. Tính nhanh',4,i),pts:.5,
    html:`<p class="q-t">Tính nhanh:</p><p class="qbig" style="font-size:26px">${L[i]}) ${t.e} = <b class="box">?</b></p>`,
    say:`Tính nhanh: ${t.e}`,ans:t.ans,hint:t.hint,hintAfter:1,sol:t.sol.replace('<p class="sol-eq">',`<p class="sol-eq">${L[i]}) ${t.e}</p><p class="sol-eq">`)}))}
  return qs;
}

/* ---------- Câu 6: dựng biểu thức tính nhanh + lời giải ---------- */
const eq=t=>`<p class="sol-eq">${t}</p>`;
// s − x + (x+t) − (x+2t) + (x+3t) − (x+4t) + (x+5t) = s + 3t
function quickA(s,x,t){
  const n=[x,x+t,x+2*t,x+3*t,x+4*t,x+5*t],v=s+3*t;
  return{e:`${s} − ${n[0]} + ${n[1]} − ${n[2]} + ${n[3]} − ${n[4]} + ${n[5]}`,v,
    sol:`<p>Không trừ được ${s} − ${n[0]}, nên ta đổi chỗ: ghép mỗi số được cộng với số bị trừ đứng ngay trước nó.</p>
      ${eq(`= ${s} + (${n[1]} − ${n[0]}) + (${n[3]} − ${n[2]}) + (${n[5]} − ${n[4]})`)}${eq(`= ${s} + ${t} + ${t} + ${t}`)}${eq(`= ${v}`)}`};
}
// x × k + y × k + z × k, x + y + z tròn chục/trăm
function quickB(x,y,z,k){
  const S=x+y+z;
  return{k,e:`${x} × ${k} + ${y} × ${k} + ${z} × ${k}`,v:S*k,
    sol:`<p>Ba tích cùng nhân với ${k}. Ta cộng ${x}, ${y}, ${z} lại trước rồi mới nhân với ${k}.</p>${eq(`= (${x} + ${y} + ${z}) × ${k}`)}${eq(`= ${S} × ${k}`)}${eq(`= ${S*k}`)}`};
}
// x × k + y × k + m × j với m × j = z × k
function quickC(x,y,z,k,m,j){
  const S=x+y+z;
  return{k,m,j,e:`${x} × ${k} + ${y} × ${k} + ${m} × ${j}`,v:S*k,
    sol:`<p>Hai tích đầu cùng nhân với ${k}. Tích cuối ${m} × ${j} = ${m*j}, mà ${m*j} = ${z} × ${k}, nên đổi ${m} × ${j} thành ${z} × ${k}.</p>
      ${eq(`= ${x} × ${k} + ${y} × ${k} + ${z} × ${k}`)}${eq(`= (${x} + ${y} + ${z}) × ${k}`)}${eq(`= ${S} × ${k}`)}${eq(`= ${S*k}`)}`};
}
// x : k + y : k + z : k
function quickD(x,y,z,k){
  const S=x+y+z;
  return{k,e:`${x} : ${k} + ${y} : ${k} + ${z} : ${k}`,v:S/k,
    sol:`<p>Các số đều chia cho ${k}. Ta cộng các số bị chia lại trước rồi chia cho ${k} một lần.</p>${eq(`= (${x} + ${y} + ${z}) : ${k}`)}${eq(`= ${S} : ${k}`)}${eq(`= ${S/k}`)}
      <p>Cách khác: ${x/k} + ${y/k} + ${z/k} = ${S/k}. Cùng kết quả!</p>`};
}

/* ---------- Phiếu số 1: đúng đề cô giao ---------- */
const PHIEU_1=()=>({
  c1:[[400,2],[300,2],[100,7],[200,3]],
  c2:[[356,'+',267],[467,'+',98],[802,'−',368],[743,'−',89]],
  c3a:[[38,5],[46,5],[75,4],[58,4]],
  c3b:[[69,5],[73,6],[86,6],[97,7]],
  c4:{text:'Mẹ có 96 quả trứng gà xếp vào 3 khay. Hỏi mỗi khay mẹ xếp bao nhiêu quả trứng?',total:96,k:3,c:'khay',unit:'quả trứng',lead:'Mỗi khay mẹ xếp số quả trứng là:'},
  c5:{A:'Tùng',B:'Việt',a:12,d:6,u:'cái thuyền'},
  c6:{a:quickA(2,14,2),b:quickB(77,15,8,5),c:quickC(74,18,8,3,6,4),d:quickD(16,14,20,2)},
});

/* ---------- Đề tương tự: cùng dạng, số ngẫu nhiên ---------- */
function until(gen,ok){for(let g=0;g<500;g++){const v=gen();if(ok(v))return v}return gen()}
function distinct(n,gen,ok=()=>true){const seen=new Set(),out=[];for(let g=0;out.length<n&&g<500;g++){const v=gen(),k=JSON.stringify(v);if(seen.has(k)||!ok(v))continue;seen.add(k);out.push(v)}return out}
const C4_THEMES=[
  {item:'quả trứng gà',c:'khay',unit:'quả trứng',who:'Mẹ',verb:'xếp'},
  {item:'cái bánh',c:'hộp',unit:'cái bánh',who:'Cô bán hàng',verb:'xếp'},
  {item:'bút chì màu',c:'hộp',unit:'bút chì',who:'Cô giáo',verb:'chia'},
  {item:'quả cam',c:'đĩa',unit:'quả cam',who:'Bà',verb:'bày'},
  {item:'quyển vở',c:'chồng',unit:'quyển vở',who:'Thư viện',verb:'xếp'},
];
const C5_THEMES=[['Tùng','Việt','cái thuyền'],['Lan','Mai','con hạc giấy'],['Nam','Hùng','ngôi sao giấy'],['Hoa','Hà','bông hoa giấy'],['Minh','Khôi','chiếc máy bay giấy']];
function phieuTuongTu(){
  const c1=distinct(4,()=>{const h=rnd(1,4),b=rnd(2,9);return[h*100,b]},([a,b])=>a/100*b<=9);
  const add1=until(()=>[rnd(150,599),'+',rnd(150,399)],([a,,b])=>a%10+b%10>=10&&a+b<1000);
  const add2=until(()=>[rnd(200,899),'+',rnd(52,99)],([a,,b])=>a%10+b%10>=10&&a+b<1000);
  const sub1=until(()=>{const c=rnd(4,9)*100+rnd(0,6);return[c,'−',rnd(150,c-100)]},([c,,d])=>c%10<d%10);
  const sub2=until(()=>[rnd(300,999),'−',rnd(25,99)],([c,,d])=>c%10<d%10);
  const c3a=distinct(4,()=>[rnd(25,99),rnd(3,9)],([a,b])=>a%10*b>=10);
  const c3b=distinct(4,()=>[rnd(50,99),rnd(3,9)],([x,d])=>x%d>0&&Math.floor(x/10)>=d);
  const k4=pick([2,3,4]),T=pick(C4_THEMES),tot=k4*rnd(11,Math.floor(99/k4));
  const [A,B,u]=pick(C5_THEMES),d5=pick([4,6,8,10]),a5=rnd(d5+4,30);
  const t=pick([1,2,3]),x6=rnd(10,40);
  const kb=rnd(3,9),xb=rnd(40,80),yb=rnd(11,95-xb);
  const kc=pick([2,3,4]),zc=pick([4,6,8,9].filter(z=>z!==kc));
  const pairs=[];for(let m=2;m<=9;m++)for(let j=2;j<=9;j++)if(m*j===zc*kc&&m!==zc&&m!==kc)pairs.push([m,j]);
  const [mc_,jc]=pairs.length?pick(pairs):[zc,kc];
  const xc=rnd(40,80),yc=100-zc-xc;
  const kd=pick([2,3,4,5]),R=kd*10*(kd===5?1:pick([1,2])),xd=kd*rnd(2,Math.floor(R/kd)-2);
  return{c1,c2:shuffle([add1,add2]).concat([sub1,sub2]),c3a,c3b,
    c4:{text:`${T.who} có ${tot} ${T.item} ${T.verb} đều vào ${k4} ${T.c}. Hỏi mỗi ${T.c} có bao nhiêu ${T.unit}?`,total:tot,k:k4,c:T.c,unit:T.unit,lead:`Mỗi ${T.c} có số ${T.unit} là:`},
    c5:{A,B,a:a5,d:d5,u},
    c6:{a:quickA(rnd(1,9),x6,t),b:quickB(xb,yb,100-xb-yb,kb),c:quickC(xc,yc,zc,kc,mc_,jc),d:quickD(xd,R-xd,kd*rnd(2,10),kd)}};
}
const PHIEU_INTRO='Phiếu bài tập cuối tuần. Làm xong mỗi câu sẽ có lời giải chi tiết, con đọc kĩ rồi bấm “Câu tiếp” nhé!';

LESSONS.push(
{id:'phieu',tab:'Ôn tập',title:'Phiếu bài tập cuối tuần',icon:'📚',note:note(`<p><b>Phiếu bài tập cuối tuần</b> — mỗi câu làm xong đều có <b>💡 Lời giải</b> để con xem lại.</p>
  <p>🔢 <b>Tính nhẩm số tròn trăm:</b> 300 × 2 → 3 trăm × 2 = 6 trăm = 600.</p>
  <p>🧮 <b>Đặt tính:</b> cộng, trừ, nhân tính từ phải sang trái; chia tính từ trái sang phải. Số dư luôn bé hơn số chia.</p>
  <p>🍎 <b>Chia đều</b> vào mấy khay/hộp → dùng phép chia.</p>
  <p>⛵ <b>Hơn nhau bao nhiêu, cho nhau để bằng nhau:</b> chỉ cần cho <b>một nửa</b> phần hơn.</p>
  <p>⚡ <b>Tính nhanh:</b> các tích cùng nhân một số → cộng trước rồi nhân: 77 × 5 + 15 × 5 + 8 × 5 = (77 + 15 + 8) × 5 = 100 × 5.</p>`),levels:[
  exam('Phiếu số 1','📄',()=>phieuQs(PHIEU_1()),PHIEU_INTRO),
  exam('Đề tương tự 1','1️⃣',()=>phieuQs(phieuTuongTu()),PHIEU_INTRO),
  exam('Đề tương tự 2','2️⃣',()=>phieuQs(phieuTuongTu()),PHIEU_INTRO),
  exam('Đề tương tự 3','3️⃣',()=>phieuQs(phieuTuongTu()),PHIEU_INTRO),
]},
);
