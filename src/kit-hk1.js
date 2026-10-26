/* ================= BỘ CÔNG CỤ CHO BÀI 13–44 ================= */
const rep=(n,f)=>Array.from({length:n},(_,i)=>f(i));
// n câu hỏi khác nhau từ một hàm sinh (so khớp theo html)
function uniqQs(n,gen){const seen=new Set(),out=[];let g=0;while(out.length<n&&g++<300){const q=gen();const k=q.key||q.html;if(seen.has(k))continue;seen.add(k);out.push(q)}return out}
// 4 lựa chọn: đáp án + các phương án nhiễu khác nhau
function mc(ans,wrongs,count=4){const s=[ans];for(const w of wrongs){if(s.length>=count)break;if(!s.some(x=>String(x)===String(w)))s.push(w)}return shuffle(s)}
const numQ=(html,ans,hint,o={})=>({html,ans,hint,...o});
const big=t=>`<p class="qbig">${qfmt(t)}</p>`;
const bigAll=t=>`<p class="qbig">${t.replace(/\?/g,'<b class="box">?</b>')}</p>`;
const fmtN=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');

/* ---------- phân số "một phần mấy" ---------- */
const PH=['','','hai','ba','tư','năm','sáu','bảy','tám','chín','mười'];
const frac=n=>`<span class="frac"><i>1</i><i>${n}</i></span>`;
const fracName=n=>'một phần '+PH[n];
const CUT={4:[2,2],6:[2,3],8:[2,4],9:[3,3]};
// Hình chia n phần bằng nhau, tô màu `k` phần. kind: rect | circle | grid | bad (chia không đều)
function partSVG(kind,n,k=1,size=110,color='#FF9F43'){
  const st='stroke="#243A6B" stroke-width="2.5" stroke-linejoin="round"',on=new Set(shuffle(range(0,n-1)).slice(0,k));
  const f=i=>on.has(i)?color:'#fff';let g='',vb='0 0 120 120';
  if(kind==='circle'){
    if(n===1)g=`<circle cx="60" cy="60" r="52" fill="${f(0)}" ${st}/>`;
    else for(let i=0;i<n;i++){
      const a0=i*2*Math.PI/n-Math.PI/2,a1=(i+1)*2*Math.PI/n-Math.PI/2,p=a=>`${(60+52*Math.cos(a)).toFixed(1)} ${(60+52*Math.sin(a)).toFixed(1)}`;
      g+=`<path d="M60 60 L${p(a0)} A52 52 0 ${n===1?1:0} 1 ${p(a1)}Z" fill="${f(i)}" ${st}/>`;
    }
  }else if(kind==='grid'&&CUT[n]){
    const [r,c]=CUT[n],w=104/c,hh=104/r;
    for(let i=0;i<n;i++)g+=`<rect x="${8+(i%c)*w}" y="${8+Math.floor(i/c)*hh}" width="${w}" height="${hh}" fill="${f(i)}" ${st}/>`;
  }else if(kind==='bad'){
    // các phần không bằng nhau
    const cuts=[0,...shuffle(range(1,19)).slice(0,n-1).sort((a,b)=>a-b),20];
    if(cuts.slice(1).every((c,i)=>c-cuts[i]===20/n))cuts[1]=Math.max(1,cuts[1]-1);
    vb='0 0 200 80';for(let i=0;i<n;i++)g+=`<rect x="${10+cuts[i]*9}" y="10" width="${(cuts[i+1]-cuts[i])*9}" height="60" fill="${f(i)}" ${st}/>`;
  }else{
    vb='0 0 200 80';const w=180/n;for(let i=0;i<n;i++)g+=`<rect x="${10+i*w}" y="10" width="${w}" height="60" fill="${f(i)}" ${st}/>`;
  }
  const [,,W,H]=vb.split(' ').map(Number);
  return`<svg viewBox="${vb}" width="${size*W/120}" height="${size*H/120}" aria-hidden="true">${g}</svg>`;
}

/* ---------- đoạn thẳng trên thước, trung điểm ---------- */
function rulerSegSVG(L,pts){
  const u=30,x0=24,W=L*u+48;
  let s=`<svg viewBox="0 0 ${W} 112" class="fig wide" aria-hidden="true"><rect x="${x0-10}" y="58" width="${L*u+20}" height="40" rx="5" fill="#FFE9A8" stroke="#243A6B" stroke-width="2"/>`;
  for(let i=0;i<=L*2;i++){const x=x0+i*u/2;s+=`<line x1="${x}" x2="${x}" y1="58" y2="${i%2?66:72}" stroke="#243A6B" stroke-width="1.5"/>`;if(i%2===0)s+=`<text x="${x}" y="90" text-anchor="middle" font-size="13">${i/2}</text>`}
  s+=`<line x1="${x0}" x2="${x0+L*u}" y1="40" y2="40" stroke="#243A6B" stroke-width="3"/>`;
  pts.forEach(p=>{const x=x0+p.x*u;s+=`<line x1="${x}" x2="${x}" y1="40" y2="58" stroke="#E4572E" stroke-width="1" stroke-dasharray="3 3"/><circle cx="${x}" cy="40" r="5" fill="${p.c||'#E4572E'}"/><text x="${x}" y="26" text-anchor="middle" font-size="17">${p.n}</text>`});
  return s+'</svg>';
}
// ba điểm thẳng hàng và một điểm ngoài
function midFigSVG(a,m,b,c){
  return`<svg viewBox="0 0 300 150" class="fig wide" aria-hidden="true"><line x1="30" y1="110" x2="270" y2="50" stroke="#243A6B" stroke-width="3"/>
    ${[[30,110,a,-6,22],[150,80,m,0,24],[270,50,b,6,-12],[120,24,c,0,-8]].map(([x,y,n,dx,dy])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="#E4572E"/><text x="${x+dx}" y="${y+dy}" text-anchor="middle" font-size="18">${n}</text>`).join('')}</svg>`;
}

/* ---------- hình tròn ---------- */
function circleSVG({r='',d='',chord=true}={}){
  return`<svg viewBox="0 0 220 210" class="fig" aria-hidden="true"><circle cx="110" cy="105" r="80" fill="#E4F6FF" stroke="#243A6B" stroke-width="3"/>
    <line x1="30" y1="105" x2="190" y2="105" stroke="#46B85A" stroke-width="3"/><line x1="110" y1="105" x2="${110+80*Math.cos(-1.1)}" y2="${105+80*Math.sin(-1.1)}" stroke="#8A63E8" stroke-width="3"/>
    ${chord?`<line x1="${110+80*Math.cos(2.2)}" y1="${105+80*Math.sin(2.2)}" x2="${110+80*Math.cos(.75)}" y2="${105+80*Math.sin(.75)}" stroke="#FF9F43" stroke-width="3"/>`:''}
    <g fill="#E4572E">${[[110,105],[30,105],[190,105],[110+80*Math.cos(-1.1),105+80*Math.sin(-1.1)],...(chord?[[110+80*Math.cos(2.2),105+80*Math.sin(2.2)],[110+80*Math.cos(.75),105+80*Math.sin(.75)]]:[])].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}</g>
    <g font-size="17"><text x="110" y="126" text-anchor="middle">O</text><text x="14" y="111">M</text><text x="196" y="111">N</text><text x="${110+80*Math.cos(-1.1)+6}" y="${105+80*Math.sin(-1.1)-4}">A</text>
    ${chord?`<text x="${110+80*Math.cos(2.2)-16}" y="${105+80*Math.sin(2.2)+14}">P</text><text x="${110+80*Math.cos(.75)+4}" y="${105+80*Math.sin(.75)+16}">Q</text>`:''}</g>
    ${r?`<text x="${110+40*Math.cos(-1.1)+16}" y="${105+40*Math.sin(-1.1)+4}" font-size="14" fill="#6A45C6">${r}</text>`:''}${d?`<text x="${70}" y="99" font-size="14" fill="#2F8F42" text-anchor="middle">${d}</text>`:''}</svg>`;
}

/* ---------- góc ---------- */
function angleSVG(deg,[o,a,b]=['O','A','B'],rot=0,size=170){
  const r=Math.PI/180,x=70,y=140,L=120,ax=x+L,ay=y,bx=x+L*Math.cos(-deg*r),by=y+L*Math.sin(-deg*r);
  return`<svg viewBox="0 0 230 190" width="${size}" height="${size*190/230}" aria-hidden="true"><g transform="rotate(${rot} 115 95)"><polyline points="${ax},${ay} ${x},${y} ${bx},${by}" fill="none" stroke="#243A6B" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="${x}" cy="${y}" r="5" fill="#E4572E"/><g font-size="17" font-family="Baloo 2,sans-serif" font-weight="800" fill="#243A6B"><text x="${x-8}" y="${y+22}" text-anchor="middle" transform="rotate(${-rot} ${x-8} ${y+16})">${o}</text><text x="${ax+6}" y="${ay+20}" transform="rotate(${-rot} ${ax+6} ${ay+14})">${a}</text><text x="${bx+8}" y="${by}" transform="rotate(${-rot} ${bx+8} ${by-6})">${b}</text></g></g></svg>`;
}

/* ---------- các hình phẳng ---------- */
const SHAPES={
  tri:{n:'Hình tam giác',p:'60,10 110,100 10,100',rt:0,c:'#FFD36E'},
  rtri:{n:'Hình tam giác',p:'15,15 15,100 105,100',rt:1,c:'#FFB4C8'},
  quad:{n:'Hình tứ giác',p:'30,15 100,30 110,100 10,90',rt:0,c:'#B9A4FF'},
  trap:{n:'Hình tứ giác',p:'15,15 70,15 110,100 15,100',rt:2,c:'#8FD9FF'},
  rect:{n:'Hình chữ nhật',p:'5,30 115,30 115,95 5,95',rt:4,c:'#A6E88F'},
  square:{n:'Hình vuông',p:'20,15 105,15 105,100 20,100',rt:4,c:'#FFB0A6'},
};
const shapeSVG=(k,size=90)=>`<svg viewBox="0 0 120 112" width="${size}" height="${size*112/120}" aria-hidden="true"><polygon points="${SHAPES[k].p}" fill="${SHAPES[k].c}" stroke="#243A6B" stroke-width="3" stroke-linejoin="round"/></svg>`;
// hình chữ nhật/hình vuông có ghi tên đỉnh và độ dài cạnh
function rectSVG(w,h,names='ABCD',lw,lh){
  const W=Math.min(200,w*24),H=Math.min(120,h*24),x=30,y=20;
  return`<svg viewBox="0 0 ${W+60} ${H+56}" class="fig" aria-hidden="true"><rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#E8F8E4" stroke="#243A6B" stroke-width="3"/>
    <g font-size="17"><text x="${x-14}" y="${y-2}">${names[0]}</text><text x="${x+W+4}" y="${y-2}">${names[1]}</text><text x="${x+W+4}" y="${y+H+18}">${names[2]}</text><text x="${x-14}" y="${y+H+18}">${names[3]}</text></g>
    <g font-size="14" fill="#E4572E">${lw?`<text x="${x+W/2}" y="${y-4}" text-anchor="middle">${lw}</text>`:''}${lh?`<text x="${x+W+8}" y="${y+H/2+5}">${lh}</text>`:''}</g></svg>`;
}

/* ---------- xếp khối lập phương thành các cột ---------- */
function cubeStackSVG(cols){
  const s=26,dx=10,dy=10,W=cols.length*s+dx+8,H=Math.max(...cols)*s+dy+8;let g='';
  cols.forEach((n,c)=>{for(let k=0;k<n;k++){const x=4+c*s,y=H-4-(k+1)*s;
    g+=`<polygon points="${x},${y} ${x+dx},${y-dy} ${x+s+dx},${y-dy} ${x+s},${y}" fill="#B5E1FF" stroke="#243A6B" stroke-width="1.6"/><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#48AEE6" stroke="#243A6B" stroke-width="1.6"/><polygon points="${x+s},${y} ${x+s+dx},${y-dy} ${x+s+dx},${y+s-dy} ${x+s},${y+s}" fill="#2B7FB5" stroke="#243A6B" stroke-width="1.6"/>`}});
  return`<svg viewBox="0 ${-dy} ${W} ${H+dy}" width="${Math.min(260,W*2)}" height="${Math.min(260,W*2)*(H+dy)/W}" aria-hidden="true">${g}</svg>`;
}

/* ---------- sơ đồ đoạn thẳng (gấp lên, giảm đi, so sánh) ---------- */
// rows: [{name, n, lab, tot}] — n phần bằng nhau, lab ghi trên mỗi phần (hoặc chỉ phần đầu), tot ghi ở cuối
function tapeSVG(rows,w=48){
  const nameW=64,maxN=Math.max(...rows.map(r=>r.n)),W=nameW+maxN*w+80,H=rows.length*58+10;let g='';
  rows.forEach((r,i)=>{const y=14+i*58;
    g+=`<text x="${nameW-8}" y="${y+28}" text-anchor="end" font-size="15">${r.name}</text>`;
    for(let k=0;k<r.n;k++)g+=`<rect x="${nameW+k*w}" y="${y+12}" width="${w}" height="22" rx="3" fill="${r.c||(i?'#FFD36E':'#8FD9FF')}" stroke="#243A6B" stroke-width="2"/>`;
    if(r.lab)g+=`<text x="${nameW+w/2}" y="${y+6}" text-anchor="middle" font-size="13" fill="#E4572E">${r.lab}</text>`;
    if(r.tot)g+=`<text x="${nameW+r.n*w+8}" y="${y+29}" font-size="15" fill="#6A45C6">${r.tot}</text>`;
  });
  return`<svg viewBox="0 0 ${W} ${H}" class="fig wide" aria-hidden="true">${g}</svg>`;
}

/* ---------- thước mi-li-mét ---------- */
function rulerMMSVG(mm,emoji='✏️'){
  const N=Math.ceil(mm/10)+1,u=4,x0=16,W=N*10*u+32;
  let s=`<svg viewBox="0 0 ${W} 112" class="fig wide" aria-hidden="true"><rect x="${x0-8}" y="54" width="${N*10*u+16}" height="48" rx="5" fill="#FFE9A8" stroke="#243A6B" stroke-width="2"/>`;
  for(let i=0;i<=N*10;i++){const x=x0+i*u;s+=`<line x1="${x}" x2="${x}" y1="54" y2="${i%10?i%5?61:65:72}" stroke="#243A6B" stroke-width="${i%10?1:1.8}"/>`;if(i%10===0)s+=`<text x="${x}" y="90" text-anchor="middle" font-size="12">${i/10}</text>`}
  s+=`<text x="${x0+N*10*u}" y="100" text-anchor="end" font-size="10">cm</text><rect x="${x0}" y="30" width="${mm*u}" height="16" rx="6" fill="#FF9F43" stroke="#243A6B" stroke-width="2"/><text x="${x0+mm*u/2}" y="26" text-anchor="middle" font-size="20">${emoji}</text>`;
  return s+'</svg>';
}

/* ---------- cân đồng hồ theo gam, cân đĩa ---------- */
function gScaleSVG(g,emoji,size=150){
  let s=`<svg viewBox="0 0 160 200" width="${size}" height="${size*1.25}" aria-hidden="true"><text x="80" y="52" text-anchor="middle" font-size="50">${emoji}</text><ellipse cx="80" cy="62" rx="58" ry="9" fill="#E5ECF8" stroke="#243A6B" stroke-width="3"/><rect x="72" y="66" width="16" height="10" fill="#243A6B"/><rect x="22" y="74" width="116" height="118" rx="20" fill="#FF9F43" stroke="#243A6B" stroke-width="3"/><circle cx="80" cy="134" r="48" fill="#fff" stroke="#243A6B" stroke-width="3"/>`;
  for(let i=0;i<=20;i++){const a=(-150+i*15)*Math.PI/180;s+=`<line x1="${80+(i%2?41:37)*Math.sin(a)}" y1="${134-(i%2?41:37)*Math.cos(a)}" x2="${80+45*Math.sin(a)}" y2="${134-45*Math.cos(a)}" stroke="#243A6B" stroke-width="${i%2?1.2:2}"/>`;if(i%2===0)s+=`<text x="${80+28*Math.sin(a)}" y="${134-28*Math.cos(a)+3}" text-anchor="middle" font-size="${i===20?7:8}" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${i*50}</text>`}
  s+=`<text x="80" y="150" text-anchor="middle" font-size="10" font-weight="800" fill="#5E7099">g</text><line x1="80" y1="134" x2="80" y2="94" stroke="#E4572E" stroke-width="3" stroke-linecap="round" transform="rotate(${-150+g/1000*300} 80 134)"/><circle cx="80" cy="134" r="5" fill="#243A6B"/></svg>`;
  return s;
}
function balanceSVG(emoji,weights){
  const ws=weights.map((w,i)=>`<g transform="translate(${178+i*36-weights.length*16},${58-(w>=500?8:0)})"><rect x="0" y="0" width="32" height="${w>=500?30:22}" rx="5" fill="#9AA9C7" stroke="#243A6B" stroke-width="2"/><text x="16" y="${w>=500?19:15}" text-anchor="middle" font-size="${w>=1000?8:9}" fill="#fff">${w>=1000?w/1000+' kg':w+' g'}</text></g>`).join('');
  return`<svg viewBox="0 0 300 150" class="fig wide" aria-hidden="true"><rect x="146" y="70" width="8" height="60" fill="#243A6B"/><rect x="110" y="128" width="80" height="10" rx="4" fill="#243A6B"/><line x1="40" y1="80" x2="260" y2="80" stroke="#243A6B" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 80 Q80 96 120 80" fill="#E5ECF8" stroke="#243A6B" stroke-width="3"/><path d="M180 80 Q220 96 270 80" fill="#E5ECF8" stroke="#243A6B" stroke-width="3"/><text x="75" y="76" text-anchor="middle" font-size="40">${emoji}</text>${ws}</svg>`;
}

/* ---------- ca đong mi-li-lít ---------- */
function jugMLSVG(ml,cap=1000,size=120){
  const H=150,y0=20,step=cap<=500?50:100,lab=cap<=500?100:200;let t='';
  for(let v=step;v<cap;v+=step){const y=y0+H-v/cap*H;t+=`<line x1="12" x2="${v%lab?24:32}" y1="${y}" y2="${y}" stroke="#243A6B" stroke-width="1.6"/>${v%lab?'':`<text x="36" y="${y+4}" font-size="10" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${v}</text>`}`}
  const wh=ml/cap*H;
  return`<svg viewBox="0 0 110 ${H+30}" width="${size*110/120}" height="${size*(H+30)/120}" aria-hidden="true"><rect x="10" y="${y0+H-wh}" width="70" height="${wh}" fill="#7CCBFF"/><path d="M10 ${y0} V${y0+H} H80 V${y0}" fill="none" stroke="#243A6B" stroke-width="3"/><path d="M80 ${y0+20} q20 0 20 20 v40 q0 20 -20 20" fill="none" stroke="#243A6B" stroke-width="5"/>${t}<text x="45" y="${y0-6}" text-anchor="middle" font-size="11" font-weight="800" fill="#5E7099" font-family="Baloo 2,sans-serif">ml</text></svg>`;
}

/* ---------- nhiệt kế ---------- */
function thermoSVG(t,max=50,size=200){
  const top=14,bot=196,L=bot-top,y=v=>bot-v/max*L;let s='';
  const minor=max>50?5:1,major=10;
  for(let v=0;v<=max;v+=minor){s+=`<line x1="58" x2="${v%major?66:72}" y1="${y(v)}" y2="${y(v)}" stroke="#243A6B" stroke-width="${v%major?1:2}"/>`;if(v%major===0)s+=`<text x="76" y="${y(v)+4}" font-size="11" font-weight="800" fill="#243A6B" font-family="Baloo 2,sans-serif">${v}</text>`}
  return`<svg viewBox="0 0 110 236" width="${size*110/236}" height="${size}" aria-hidden="true"><rect x="36" y="${top-6}" width="20" height="${L+16}" rx="10" fill="#fff" stroke="#243A6B" stroke-width="3"/><rect x="42" y="${y(t)}" width="8" height="${bot-y(t)+12}" fill="#E8484C"/><circle cx="46" cy="${bot+18}" r="15" fill="#E8484C" stroke="#243A6B" stroke-width="3"/>${s}<text x="18" y="20" font-size="12" font-weight="800" fill="#5E7099" font-family="Baloo 2,sans-serif">°C</text></svg>`;
}

/* ---------- Vẽ trên lưới ô vuông: chạm vào điểm còn thiếu ---------- */
// rounds: [{prompt, given:[[x,y],…], names, ok:(x,y)=>bool, close:true}]
function gridLv({name,icon,rounds}){return lv(name,'hd',icon,async ctx=>{
  const st=ctx.stage,R=rounds.map(r=>typeof r==='function'?r():r),W=8,H=6,u=40;let done=0;
  for(const r of R){
    st.innerHTML=`<p class="q-t" style="text-align:center">${r.prompt}</p><div class="card" style="padding:8px"><svg viewBox="0 0 ${(W+1)*u} ${(H+1)*u}" class="grid-svg" id="gs"></svg></div>`;
    const gs=$('#gs',st),P=([x,y])=>[(x+.5)*u,(y+.5)*u];
    let lines='';for(let i=0;i<=W;i++)lines+=`<line x1="${(i+.5)*u}" x2="${(i+.5)*u}" y1="${u/2}" y2="${(H+.5)*u}" class="gl"/>`;for(let j=0;j<=H;j++)lines+=`<line y1="${(j+.5)*u}" y2="${(j+.5)*u}" x1="${u/2}" x2="${(W+.5)*u}" class="gl"/>`;
    const path=pts=>pts.map(P).map(p=>p.join(',')).join(' ');
    const draw=extra=>{
      const pts=extra?[...r.given,extra]:r.given;
      gs.innerHTML=lines+(extra&&r.close?`<polygon points="${path(pts)}" class="gp done"/>`:`<polyline points="${path(pts)}" class="gp${extra?' done':''}"/>`)+
        pts.map((p,i)=>{const [x,y]=P(p);return`<circle cx="${x}" cy="${y}" r="7" class="gv"/><text x="${x+9}" y="${y-9}" class="gt">${(r.names||'ABCD')[i]||''}</text>`}).join('')+
        (extra?'':range(0,W).flatMap(x=>range(0,H).map(y=>`<circle cx="${P([x,y])[0]}" cy="${P([x,y])[1]}" r="15" class="gd" data-x="${x}" data-y="${y}"/>`)).join(''));
    };
    draw();ctx.say(r.prompt.replace(/<[^>]+>/g,''));
    await new Promise(res=>{gs.onclick=e=>{
      const d=e.target.closest('.gd');if(!d||!ctx.alive)return;
      const x=+d.dataset.x,y=+d.dataset.y;
      if(r.given.some(([a,b])=>a===x&&b===y))return;
      if(r.ok(x,y)){ctx.good();draw([x,y]);done++;ctx.progress(done/R.length);ctx.say(r.done||'Vẽ xong rồi! 🎉');setTimeout(res,1600)}
      else{ctx.bad();shakeEl(d.closest('svg').parentNode);ctx.say('Gợi ý: '+r.hint)}
    }});
    if(!ctx.alive)return;
  }
  ctx.finish();
})}
