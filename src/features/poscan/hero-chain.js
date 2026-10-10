// Lightweight, illustrative block-flow animation. It is not a live blockchain feed.
export function mountHeroChain(root){
  if(!root)return ()=>{};
  const canvas=root.querySelector('canvas');if(!canvas)return ()=>{};
  const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0,raf=0,active=true,w=0,h=0,dpr=1;
  function resize(){const rect=root.getBoundingClientRect();w=Math.max(1,rect.width);h=Math.max(1,rect.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  const observer=new ResizeObserver(resize);observer.observe(root);resize();
  const nodes=Array.from({length:24},(_,i)=>({col:i%8,row:Math.floor(i/8),offset:(i*17)%7,seed:i*19+7}));
  function paint(){if(!active)return;frame+=reduce?0:.012;ctx.clearRect(0,0,w,h);
    const dark=document.documentElement.dataset.theme!=='light';const ink=dark?'143,175,235':'48,91,147';const glow=dark?'118,224,226':'14,142,164';
    const pos=nodes.map((n,i)=>{const x=w*(.08+n.col*.12)+Math.sin(frame*.6+n.seed)*w*.008;const y=h*(.24+n.row*.235)+Math.cos(frame*.7+n.seed)*h*.025;return [x,y]});
    ctx.lineWidth=.85;
    for(let i=0;i<pos.length;i++){const [x,y]=pos[i];for(const j of [i+1,i+7,i+8]){if(j>=pos.length)continue;const [xx,yy]=pos[j];if(Math.abs(xx-x)>w*.34)continue;ctx.strokeStyle=`rgba(${ink},${dark?.15:.12})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke()}}
    const progress=(frame*.25)%1;
    for(let i=0;i<pos.length;i++){const [x,y]=pos[i];const final=i<17;const shimmer=.5+.5*Math.sin(frame*2+i*.8);const size=Math.max(17,Math.min(29,w*.047));ctx.fillStyle=final?`rgba(${glow},${dark?.15:.14})`:`rgba(${ink},${dark?.12:.08})`;ctx.strokeStyle=final?`rgba(${glow},${.45+shimmer*.45})`:`rgba(${ink},${.25+shimmer*.18})`;ctx.lineWidth=1.3;ctx.beginPath();ctx.roundRect(x-size/2,y-size/2,size,size,4);ctx.fill();ctx.stroke();ctx.fillStyle=dark?'#d9f8ff':'#285371';ctx.font=`600 ${Math.max(7,size*.3)}px ui-monospace,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((1000+i*17).toString(16).toUpperCase(),x,y)}
    ctx.lineWidth=2.3;ctx.strokeStyle=`rgba(${glow},.8)`;ctx.beginPath();for(let i=0;i<8;i++){const [x,y]=pos[8+i];if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
    const [px,py]=pos[8+Math.floor(progress*7)];ctx.fillStyle=`rgba(${glow},.95)`;ctx.beginPath();ctx.arc(px,py,4.2,0,Math.PI*2);ctx.fill();
    if(!reduce)raf=requestAnimationFrame(paint);
  }
  paint();return ()=>{active=false;cancelAnimationFrame(raf);observer.disconnect()};
}
