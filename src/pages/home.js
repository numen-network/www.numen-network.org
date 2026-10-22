/**
 * Numen educational animation. NOT the network's PoScan algorithm.
 * Real PoScan uses deterministic asteroid geometry derived from the work seed.
 * Physical objects are illustrative of possible applications only.
 */
export const OBJECTS = [
  {id:'house',name:'PROPERTY',emoji:'🏠',color:'#81dfae'},
  {id:'car',name:'VEHICLE',emoji:'🚗',color:'#74c5fb'},
  {id:'art',name:'ARTWORK',emoji:'🖼️',color:'#ffb68d'},
  {id:'watch',name:'LUXURY WATCH',emoji:'⌚',color:'#67e8df'},
  {id:'ring',name:'JEWELRY',emoji:'💍',color:'#f6b9ee'},
  {id:'gold',name:'GOLD BAR',emoji:'🪙',color:'#ffd27b'},
  {id:'diamond',name:'DIAMOND',emoji:'💎',color:'#8cdcf7'},
  {id:'industrial',name:'MACHINERY',emoji:'⚙️',color:'#b2c6d4'},
  {id:'robot',name:'INDUSTRIAL ROBOT',emoji:'🦾',color:'#77c6d5'},
  {id:'aircraft',name:'AIRCRAFT',emoji:'✈️',color:'#9bc9ed'},
  {id:'boat',name:'YACHT',emoji:'🛥️',color:'#77bfe9'},
  {id:'container',name:'SHIPPING CONTAINER',emoji:'📦',color:'#77c6d5'},
  {id:'solar',name:'SOLAR PANEL',emoji:'☀️',color:'#77c6d5'},
  {id:'wind',name:'WIND TURBINE',emoji:'🌬️',color:'#77c6d5'},
  {id:'medical',name:'MEDICAL EQUIPMENT',emoji:'🩺',color:'#77c6d5'},
  {id:'furniture',name:'FURNITURE',emoji:'🪑',color:'#c5a98d'},
  {id:'sculpture',name:'SCULPTURE',emoji:'🗿',color:'#a8c4cf'},
  {id:'book',name:'RARE BOOK',emoji:'📚',color:'#d5bda6'},
  {id:'guitar',name:'MUSICAL INSTRUMENT',emoji:'🎸',color:'#edba85'},
  {id:'sneaker',name:'COLLECTIBLE SNEAKER',emoji:'👟',color:'#6dbaff'}
];
const STAGES=['GENERATING GEOMETRY','SCANNING MODEL','COMPUTING SPECTRUM','CHECKING CANDIDATE','GRANDPA FINALITY'];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export function mountAsteroid(root){
 if(!root)return ()=>{};
 const canvas=root.querySelector('canvas'),ctx=canvas?.getContext('2d');if(!ctx)return ()=>{};
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const buttons=[...root.querySelectorAll('[data-proof-object]')],pause=root.querySelector('#proof-pause'),next=root.querySelector('#proof-next'),state=root.querySelector('.proof-state');
 let index=0,frame=0,manual=false,playing=!media.matches,visible=true,raf=0,previous=0,w=1,h=1,dpr=1,dead=false;
 const duration=7200,TAU=Math.PI*2;
 // Demonstration-only rejection every fourth object; not a real validator response.
 const isRejected=()=>((manual?index:Math.floor(frame/12000))%4)===3;
 // Match the current site theme and redraw on changes.
 let light=true;
 let cyan=light?'#007b83':'#42e6df',white=light?'#13324b':'#eafaff',muted=light?'#526c7e':'#829eb1';
 // Refresh canvas palette whenever the page theme changes.
 function syncTheme(){
  light=document.documentElement.dataset.theme!=='dark';
  cyan=light?'#007b83':'#42e6df';
  white=light?'#13324b':'#eafaff';
  muted=light?'#526c7e':'#a9c6d4';
 }
 const line=(x,y,X,Y,color=cyan,alpha=1,width=1)=>{ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke();ctx.restore()};
 const text=(s,x,y,size=12,color=muted,align='left',weight=500)=>{ctx.fillStyle=color;ctx.textAlign=align;ctx.font=`${weight} ${size}px ui-monospace,Consolas,monospace`;ctx.fillText(s,x,y)};
 const round=(x,y,W,H,r=10)=>{ctx.beginPath();ctx.roundRect(x,y,W,H,r)};
 function panel(x,y,W,H){ctx.fillStyle=light?'rgba(239,250,253,.92)':'rgba(6,26,41,.67)';round(x,y,W,H,11);ctx.fill();ctx.strokeStyle=light?'rgba(7,115,130,.3)':'rgba(70,197,207,.19)';ctx.stroke()}
 function grid(){ctx.strokeStyle='rgba(71,165,191,.09)';ctx.lineWidth=1;const step=44;for(let x=0;x<w;x+=step)line(x,0,x,h,light?'#347f93':'#3996a6',light?.12:.06);for(let y=0;y<h;y+=step)line(0,y,w,y,light?'#347f93':'#3996a6',light?.12:.06);for(let i=0;i<90;i++){let x=(i*117.3+17)%w,y=(i*83.7+29)%h;ctx.fillStyle=light?'rgba(13,106,128,.24)':'rgba(73,210,231,.26)';ctx.fillRect(x,y,1.3,1.3)}}
 function cube(cx,cy,s,final=false,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=final?cyan:'#4997d8';ctx.shadowBlur=final?20:5;ctx.fillStyle=final?(light?'rgba(6,150,149,.18)':'rgba(19,160,158,.28)'):(light?'rgba(25,115,166,.15)':'rgba(21,91,142,.26)');ctx.strokeStyle=final?cyan:(light?'#1475a8':'#4da4df');ctx.lineWidth=1.5;const x=s*.40,y=s*.28;ctx.beginPath();ctx.moveTo(cx,cy-s*.5);ctx.lineTo(cx+x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx-x,cy-s*.5+y);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx-x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx,cy+s*.5);ctx.lineTo(cx-x,cy+s*.5-y);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx+x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx,cy+s*.5);ctx.lineTo(cx+x,cy+s*.5-y);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;if(final)text('✓',cx,cy+s*.16,Math.max(10,s*.28),white,'center',700);ctx.restore()}
 function object(x,y,r,item,phase){
  const glow=ctx.createRadialGradient(x,y,2,x,y,r*1.8);glow.addColorStop(0,'rgba(42,212,206,.14)');glow.addColorStop(1,'rgba(42,212,206,0)');ctx.fillStyle=glow;ctx.fillRect(x-r*2,y-r*2,r*4,r*4);
  ctx.save();ctx.strokeStyle='rgba(65,232,224,.75)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y+r*.83,r*.82,r*.19,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(x,y+r*.83,r*1.08,r*.26,0,0,TAU);ctx.strokeStyle='rgba(65,232,224,.17)';ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=item.color;ctx.shadowBlur=22;ctx.font=`${Math.round(r*1.23)}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;ctx.fillText(item.emoji,x,y-r*.08);ctx.shadowBlur=0;
  // Geometric reconstruction overlay: seeded point samples and triangle edges.
  const reveal=ease((phase-.06)/.18);ctx.globalAlpha=reveal*.85;
  const pts=[];for(let i=0;i<34;i++){let a=i*2.39996+index*.3,rr=r*.76*Math.sqrt((i+.5)/34);pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr*.9])}
  for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+7)%pts.length];line(p[0],p[1],q[0],q[1],item.color,.20,.7);ctx.fillStyle=item.color;ctx.fillRect(p[0]-1.2,p[1]-1.2,2.4,2.4)}
  const scan=ease((phase-.2)/.18);if(scan>0&&scan<1){const sy=y-r+scan*r*2;line(x-r,sy,x+r,sy,cyan,.85,2);ctx.fillStyle='rgba(64,239,222,.08)';ctx.fillRect(x-r,sy-12,r*2,24)}ctx.restore();
 }
 // A consistent 3D irregular asteroid mesh, rotated with perspective projection.
 // Illustrative only: no physical scan and no live PoScan consensus computation.
 const ASTEROID_VERTICES=[];const ASTEROID_FACES=[];
 {const rings=8,segments=14;for(let j=0;j<=rings;j++){const theta=Math.PI*j/rings;for(let k=0;k<segments;k++){const phi=TAU*k/segments;const variation=1+.16*Math.sin(phi*3.7+theta*4.1)+.11*Math.cos(phi*5.3-theta*2.6)+.06*Math.sin(phi*8+theta*6);ASTEROID_VERTICES.push([Math.sin(theta)*Math.cos(phi)*variation,Math.cos(theta)*variation*.86,Math.sin(theta)*Math.sin(phi)*variation*.82]);}}for(let j=0;j<rings;j++)for(let k=0;k<segments;k++){const a=j*segments+k,b=j*segments+(k+1)%segments,c=(j+1)*segments+k,d=(j+1)*segments+(k+1)%segments;ASTEROID_FACES.push([a,c,b],[b,c,d]);}}
 function asteroidMesh(cx,cy,r,phase,opacity=1){const angle=phase*TAU*.8+.45,tilt=-.28+Math.sin(phase*TAU*.42)*.14;const co=Math.cos(angle),si=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);const verts=ASTEROID_VERTICES.map(([x,y,z])=>{const X=x*co+z*si,Z=-x*si+z*co,Y=y*ct-Z*st,depth=y*st+Z*ct;const p=2.9/(2.9-depth*.24);return [cx+X*r*p,cy+Y*r*p,depth]});ctx.save();ctx.globalAlpha=opacity;const faces=ASTEROID_FACES.map(f=>{const v=f.map(i=>verts[i]);return {v,depth:(v[0][2]+v[1][2]+v[2][2])/3}}).sort((a,b)=>a.depth-b.depth);for(const face of faces){const v=face.v;const cross=(v[1][0]-v[0][0])*(v[2][1]-v[0][1])-(v[1][1]-v[0][1])*(v[2][0]-v[0][0]);const front=cross<0;ctx.beginPath();ctx.moveTo(v[0][0],v[0][1]);ctx.lineTo(v[1][0],v[1][1]);ctx.lineTo(v[2][0],v[2][1]);ctx.closePath();ctx.fillStyle=front?(light?'rgba(22,153,170,.075)':'rgba(38,214,219,.095)'):(light?'rgba(37,121,159,.025)':'rgba(26,125,163,.035)');ctx.fill();ctx.strokeStyle=front?(light?'rgba(0,111,131,.77)':'rgba(88,239,228,.78)'):(light?'rgba(20,112,135,.22)':'rgba(71,186,201,.22)');ctx.lineWidth=front?1.15:.65;ctx.stroke()}ctx.restore();}
 function spectrum(x,y,W,H,phase,item){panel(x,y,W,H);text('GEOMETRIC FEATURE VECTOR',x+13,y+22,Math.min(11,W/25),cyan);const active=ease((phase-.28)/.22);const bars=23,inner=W-30;for(let i=0;i<bars;i++){const v=(.18+.73*Math.abs(Math.sin(i*1.84+index*1.3)*Math.cos(i*.27+2)));const bh=(H-65)*v*active;ctx.fillStyle=i%5===0?item.color:cyan;ctx.globalAlpha=.35+.6*active;ctx.fillRect(x+15+i*inner/bars,y+H-27-bh,Math.max(2,inner/bars-3),bh);ctx.globalAlpha=1}text('23-D FEATURE VECTOR',x+13,y+H-11,10,muted);}
 function arrow(x1,y,x2,progress=1){line(x1,y,x2,y,cyan,.23,1.2);const xx=x1+(x2-x1)*clamp(progress);line(x1,y,xx,y,cyan,.9,2);ctx.beginPath();ctx.moveTo(xx-5,y-4);ctx.lineTo(xx,y);ctx.lineTo(xx-5,y+4);ctx.strokeStyle=cyan;ctx.stroke()}
 function drawDesktop(phase,item){const base=h*.48;const margin=w*.026,first=w*.105,geom=w*.29,specX=w*.395,specW=w*.19,newX=w*.69,chainX=w*.83;const r=Math.min(77,h*.235);
   object(first,base,r,item,phase);text(item.name,first,h*.83,11,white,'center',700);
   arrow(first+r*.9,base,geom-r*.8,ease((phase-.15)/.14));
   panel(geom-r*.95,base-r*.95,r*1.9,r*1.9);asteroidMesh(geom,base,r*.71,phase,ease((phase-.13)/.15));
   arrow(geom+r*.97,base,specX-9,ease((phase-.26)/.12));spectrum(specX,base-r*.9,specW,r*1.8,phase,item);
   arrow(specX+specW+9,base,newX-r*.68,ease((phase-.50)/.15));const accepted=ease((phase-.62)/.1);cube(newX,base,r*1.45,!isRejected()&&accepted>.6,accepted*.94+.06);if(accepted>.6)text(isRejected()?'REJECTED':'VALID WORK',newX,base+r*1.25,11,isRejected()?'#ff7e92':cyan,'center',700);
   arrow(newX+r*.72,base,chainX-r*.65,ease((phase-.69)/.10));for(let i=0;i<4;i++){const xx=chainX+i*r*.62;cube(xx,base+(i%2)*2,r*.85,!isRejected()&&(i<3||phase>.82),isRejected()&&i===3?.08:(i===3?.2+.8*ease((phase-.75)/.14):.65));if(i)line(xx-r*.4,base,xx-r*.24,base,cyan,.5,1.4)}
   const headings=[['01 / PHYSICAL ASSET',first],['02 / 3D MODEL',geom],['03 / SPECTRAL3D',specX+specW/2],['04 / POSCAN BLOCK',newX],['05 / FINALITY',chainX+r*.7]];
   headings.forEach(([t,x])=>text(t,x,h*.17,Math.max(9,Math.min(12,w/100)),muted,'center'));
 }
 function drawMobile(phase,item){const left=w*.24,right=w*.73,top=h*.27,mid=h*.64,r=Math.min(w*.14,h*.13,62);
  object(left,top,r,item,phase);text(item.name,left,top+r*1.35,11,white,'center',700);
  arrow(left+r,top,right-r*.8,ease((phase-.14)/.15));panel(right-r*.85,top-r*.8,r*1.7,r*1.6);asteroidMesh(right,top,r*.62,phase,ease((phase-.14)/.14));
  line(right,top+r*.85,right,mid-r*.8,cyan,.6,1.4);spectrum(w*.07,mid-r*.76,w*.40,r*1.53,phase,item);arrow(w*.49,mid,w*.62,ease((phase-.52)/.12));cube(w*.71,mid,r*1.4,!isRejected()&&phase>.65,ease((phase-.60)/.1));
  text('01 / OBJECT',left,top-r*1.4,10,muted,'center');text('02 / GEOMETRY',right,top-r*1.4,10,muted,'center');text('03 / POSCAN',w*.27,mid-r*1.2,10,muted,'center');text('04 / BLOCK',w*.71,mid-r*1.2,10,muted,'center');
  const y=h*.89;for(let i=0;i<5;i++){const xx=w*.25+i*w*.125;cube(xx,y,Math.min(30,w*.09),!isRejected()&&(i<4||phase>.83),isRejected()&&i===4?.08:(i===4?.15+.85*ease((phase-.8)/.1):.75));if(i)line(xx-w*.08,y,xx-w*.06,y,cyan,.7)}text('05 / GRANDPA FINALITY',w*.5,h*.985,9,muted,'center');
 }

 // Three connected panels are always visible. Their highlights advance
 // through the same object's scan, mining and record cycle.
 const SCENE_MS=4000,CYCLE_MS=SCENE_MS*3;
 function drawFlow(time){
   const mobile=w<640;
   const LW=mobile?400:1000,LH=mobile?900:360;
   ctx.save();ctx.scale(w/LW,h/LH);
   const cycle=Math.floor(time/CYCLE_MS);
   const item=OBJECTS[manual?index:cycle%OBJECTS.length];
   const rejected=(manual?index:cycle)%4===3;
   const active=Math.floor(time% CYCLE_MS / SCENE_MS);
   const phase=(time%SCENE_MS)/SCENE_MS;
   // Earlier panels keep their finished frame; later panels remain in their initial frame.
   const stagePhase=(i)=>i<active?1:i===active?phase:0;
   const centers=mobile?[[200,148],[200,450],[200,752]]:[[168,180],[500,180],[832,180]];
   const labels=['01  SCAN & MODEL','02  MINING & VECTORS','03  RECORD & BLOCK'];
   for(let i=0;i<3;i++){
     const [cx,cy]=centers[i],cw=mobile?376:308,ch=mobile?278:308;
     const x=cx-cw/2,y=cy-ch/2;
     ctx.fillStyle=light?'#ffffff':'#142536';round(x,y,cw,ch,14);ctx.fill();
     ctx.strokeStyle=i===active?(light?'#0099a3':'#52e2d9'):(light?'#d3e4e9':'#375368');ctx.lineWidth=i===active?2.2:1.2;ctx.stroke();
     ctx.fillStyle=i===active?(light?'#e8f8f9':'#19404a'):(light?'#f5f9fa':'#1b3142');round(x+9,y+9,cw-18,36,7);ctx.fill();
     text(labels[i],cx,y+32,mobile?17:12,white,'center',700);
     if(i===0){
       const progress=stagePhase(0);
       object(cx,y+105,mobile?50:40,item,progress*.6);
       if(active===0){
         const sx=cx-42+progress*84;
         line(sx,y+65,sx,y+142,(light?'#008e95':'#55d6d0'),.8,2.5);
       }
       text(progress>=1?'SCANNED':'SCANNING',cx,y+153,mobile?13:10,(light?'#476d7b':'#c3dce5'),'center',700);
       line(x+28,y+166,x+cw-28,y+166,(light?'#e0eaed':'#355367'),1);
       // The asteroid-shaped geometry only grows during stage one, then freezes.
       asteroidMesh(cx,y+215,mobile?40:35,progress*.45,ease(progress*1.6));
       text('3D MODEL',cx,y+270,mobile?13:10,(light?'#476d7b':'#c3dce5'),'center',700);
     }else if(i===1){
       const progress=stagePhase(1);
       for(let k=0;k<3;k++){
         const mx=cx+(k-1)*(mobile?120:79);
         cube(mx,y+103,mobile?48:39,k===Math.floor(progress*7)%3&&active===1,.9);
         text('MINER',mx,y+149,mobile?13:10,(light?'#32697b':'#c3dce5'),'center',700);
       }
       line(x+28,y+166,x+cw-28,y+166,(light?'#e0eaed':'#355367'),1);
       // Feature bars gradually resolve into a simple visual fingerprint.
       const barW=mobile?330:254, bx=cx-barW/2;
       panel(bx,y+183,barW,91);
       text('DIGITAL FINGERPRINT',cx,y+202,mobile?13:10,(light?'#276578':'#c3dce5'),'center',700);
       const reveal=ease(progress*1.15);
       for(let j=0;j<23;j++){
         const strength=.23+.7*Math.abs(Math.sin(j*1.83+(manual?index:cycle)*.62));
         const bh=34*strength*reveal;
         ctx.fillStyle=j%4===0?'#006f84':'#43b9bd';
         ctx.fillRect(bx+14+j*(barW-28)/23,y+257-bh,Math.max(3,(barW-28)/23-3),bh);
       }
       text('SPECTRAL3D',cx,y+287,mobile?13:10,(light?'#476d7b':'#c3dce5'),'center',700);
     }else{
       const progress=stagePhase(2);
       if(progress===0){
         text('PENDING',cx,y+104,mobile?17:12,(light?'#69808c':'#c3dce5'),'center',700);
         text('',cx,y+139,mobile?13:10,(light?'#69808c':'#c3dce5'),'center');
       }else if(rejected){
         text('REJECTED',cx,y+104,mobile?19:14,'#c54859','center',700);
         text('MODEL CHECK FAILED',cx,y+139,mobile?12:10,'#a34b58','center',700);
       }else{
         text('ACCEPTED',cx,y+102,mobile?17:12,'#007b83','center',700);
         text('HASH  0x7A3F…9C21',cx,y+139,mobile?14:10,(light?'#174a5d':'#c3dce5'),'center',700);
       }
       line(x+28,y+166,x+cw-28,y+166,(light?'#e0eaed':'#355367'),1);
       // Chain links and cubes slide left as the new block locks in.
       // Clip to this panel so old blocks exit cleanly instead of overflowing.
       const spacing=mobile?88:67, blockSize=mobile?56:45;
       const slide=ease((progress-.62)/.32)*spacing;
       const chainY=y+222;
       ctx.save();ctx.beginPath();ctx.rect(x+12,y+177,cw-24,91);ctx.clip();
       const blockX=k=>cx+(k-1.5)*spacing-slide;
       for(let k=0;k<5;k++){
         const bx=blockX(k);
         if(k<4){
           // Linked chain segments sit behind the cubes.
           const linkY=chainY+5;
           line(bx+blockSize*.32,linkY,bx+spacing-blockSize*.32,linkY,(light?'#008e95':'#55d6d0'),.9,3);
           for(let n=0;n<3;n++){
             const lx=bx+blockSize*.32+(n+.5)*(spacing-blockSize*.64)/3;
             ctx.save();ctx.strokeStyle=(light?'#008e95':'#55d6d0');ctx.lineWidth=1.6;
             ctx.beginPath();ctx.ellipse(lx,linkY,5,3.3,0,0,Math.PI*2);ctx.stroke();ctx.restore();
           }
         }
       }
       for(let k=0;k<5;k++){
         const entering=k===4;
         const opacity=entering?ease((progress-.48)/.30):1;
         cube(blockX(k),chainY,blockSize,entering&&progress>.7,opacity);
       }
       ctx.restore();
       text(progress===0?'NEXT BLOCK':progress<.75?'ADDING BLOCK':rejected?'BLOCK ADDED':'BLOCK ADDED',cx,y+287,mobile?12:9,(light?'#476d7b':'#c3dce5'),'center',700);
     }
     if(i<2){
       if(mobile){
         const yy=y+ch+7;
         line(cx,yy,cx,yy+11,(light?'#008e95':'#55d6d0'),.8,2);
       }else{
         const xx=x+cw+5;
         line(xx,cy,xx+12,cy,(light?'#008e95':'#55d6d0'),.8,2);
       }
     }
   }
   if(state)state.textContent=''+item.name+' · '+labels[active];
   ctx.restore();
 }
 function paint(){if(dead)return;ctx.clearRect(0,0,w,h);syncTheme();ctx.fillStyle=light?'#ffffff':'#0d1b2a';ctx.fillRect(0,0,w,h);drawFlow(frame);}
 function choose(i){index=(i+OBJECTS.length)%OBJECTS.length;manual=true;frame=0;previous=0;buttons.forEach(b=>{const active=b.dataset.proofObject===OBJECTS[index].id;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});paint()}
 function tick(now){if(dead)return;if(previous&&playing&&visible&&!media.matches){frame+=Math.min(now-previous,70);if(frame>3600000){frame%=CYCLE_MS*20}}previous=now;paint();if(playing&&visible&&!media.matches)raf=requestAnimationFrame(tick)}
 function resize(){const rect=canvas.getBoundingClientRect();w=Math.max(1,rect.width);h=Math.max(1,rect.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paint()}
 function toggle(){playing=!playing;if(pause){pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-pressed',String(!playing));}previous=0;cancelAnimationFrame(raf);if(playing)raf=requestAnimationFrame(tick);else paint()}
 const onMedia=()=>{playing=!media.matches;if(pause){pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-pressed',String(!playing));}cancelAnimationFrame(raf);previous=0;if(playing)raf=requestAnimationFrame(tick);else paint()};
 const themeObserver=new MutationObserver(()=>paint());themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 const io=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??true;cancelAnimationFrame(raf);previous=0;if(visible&&playing)raf=requestAnimationFrame(tick)},{threshold:.01});const ro=new ResizeObserver(resize);
 const nextClick=()=>choose((manual?index:Math.floor(frame/CYCLE_MS)%OBJECTS.length)+1);buttons.forEach(b=>b.addEventListener('click',()=>choose(Math.max(0,OBJECTS.findIndex(o=>o.id===b.dataset.proofObject)))));pause?.addEventListener('click',toggle);next?.addEventListener('click',nextClick);media.addEventListener('change',onMedia);ro.observe(canvas);io.observe(canvas);resize();if(playing)raf=requestAnimationFrame(tick);
 return()=>{dead=true;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();themeObserver.disconnect();media.removeEventListener('change',onMedia);pause?.removeEventListener('click',toggle);next?.removeEventListener('click',nextClick)};
}


/* Magic numbers throughout are design tuned. Change them and the look drifts. */
export function mountWhyAsteroid() {
  const canvas = document.getElementById("why-asteroid-canvas");
  if (!canvas) return () => {};
  let stopped = false;
  let onResize = () => {};
  let raf = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const accent = () => document.documentElement.dataset.theme === 'dark' ? '#c4a5ff' : '#6841c8';

  const norm = (v) => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  };

  const hash3 = (x, y, z) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  };

  const vnoise = (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const sm = (t) => t * t * (3 - 2 * t);
    const u = sm(x - xi), v = sm(y - yi), w = sm(z - zi);
    const lerp = (a, b, t) => a + (b - a) * t;
    return lerp(
      lerp(lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u),
           lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
      lerp(lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u),
           lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v),
      w
    );
  };

  const fbm = (x, y, z) => {
    let n = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 4; o++) {
      n += amp * (vnoise(x * f, y * f, z * f) - 0.5);
      amp *= 0.5;
      f *= 2.1;
    }
    return n;
  };

  const t0 = (1 + Math.sqrt(5)) / 2;
  let verts = [
    [-1, t0, 0], [1, t0, 0], [-1, -t0, 0], [1, -t0, 0],
    [0, -1, t0], [0, 1, t0], [0, -1, -t0], [0, 1, -t0],
    [t0, 0, -1], [t0, 0, 1], [-t0, 0, -1], [-t0, 0, 1]
  ].map(norm);
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];
  for (let s = 0; s < 3; s++) {
    const cache = new Map();
    const mid = (a, b) => {
      const key = a < b ? a + '_' + b : b + '_' + a;
      if (cache.has(key)) return cache.get(key);
      verts.push(norm([
        (verts[a][0] + verts[b][0]) / 2,
        (verts[a][1] + verts[b][1]) / 2,
        (verts[a][2] + verts[b][2]) / 2
      ]));
      cache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    const next = [];
    for (const [a, b, c] of faces) {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }
  verts = verts.map((v) => {
    const r = 1 + fbm(v[0] * 1.8 + 3.7, v[1] * 1.8 + 1.3, v[2] * 1.8 + 2.9) * 0.55;
    return [v[0] * r, v[1] * r, v[2] * r];
  });
  const eset = new Set();
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]]) {
      eset.add(p < q ? p + '_' + q : q + '_' + p);
    }
  }
  const edges = [...eset].map((k) => k.split('_').map(Number));
  const n = verts.length;

  const makeView = (canvas, opts) => {
    const ctx = canvas.getContext('2d');
    const px = new Float32Array(n), py = new Float32Array(n), pz = new Float32Array(n);
    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = opts.fixed ? window.innerWidth : canvas.clientWidth;
      h = opts.fixed ? window.innerHeight : canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener('resize', resize);
    onResize = resize;
    resize();

    const stars = opts.stars
      ? Array.from({ length: 150 }, () => ({
          x: Math.random(), y: Math.random(),
          r: 0.4 + Math.random() * 1.1, p: Math.random() * 6.283
        }))
      : [];

    return (t) => {
      const ac = accent();
      const ar = parseInt(ac.slice(1, 3), 16);
      const ag = parseInt(ac.slice(3, 5), 16);
      const ab = parseInt(ac.slice(5, 7), 16);

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const a = 0.10 + 0.22 * (0.5 + 0.5 * Math.sin(t * 0.6 + s.p));
        ctx.fillStyle = `rgba(205,214,228,${a.toFixed(3)})`;
        ctx.fillRect(s.x * w, s.y * h, s.r, s.r);
      }

      const cx = w * (opts.cx || 0.5), cy = h * opts.cy, R = Math.min(w, h) * opts.R;
      const ry = t * opts.speed, rx = 0.5 + Math.sin(t * 0.07) * 0.08;
      const cosy = Math.cos(ry), siny = Math.sin(ry);
      const cosx = Math.cos(rx), sinx = Math.sin(rx);
      const d = 3.4;
      for (let i = 0; i < n; i++) {
        const v = verts[i];
        const x1 = v[0] * cosy + v[2] * siny;
        const z1 = -v[0] * siny + v[2] * cosy;
        const y2 = v[1] * cosx - z1 * sinx;
        const z2 = v[1] * sinx + z1 * cosx;
        const s = d / (d - z2);
        px[i] = cx + x1 * s * R;
        py[i] = cy + y2 * s * R;
        pz[i] = z2;
      }

      /* Alpha buckets batch strokes, one path per bucket beats one per edge. */
      const buckets = [[], [], [], [], [], []];
      for (const e of edges) {
        const zAvg = (pz[e[0]] + pz[e[1]]) / 2;
        const nd = Math.max(0, Math.min(1, (zAvg + 1.6) / 3.2));
        buckets[Math.min(5, Math.floor(nd * 6))].push(e);
      }
      ctx.lineWidth = 1;
      for (let b = 0; b < 6; b++) {
        if (!buckets[b].length) continue;
        const a = opts.base + Math.pow((b + 0.5) / 6, 1.6) * opts.gain;
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},${a.toFixed(3)})`;
        ctx.beginPath();
        for (const e of buckets[b]) {
          ctx.moveTo(px[e[0]], py[e[0]]);
          ctx.lineTo(px[e[1]], py[e[1]]);
        }
        ctx.stroke();
      }
    };
  };

  const drawSky = makeView(canvas,
    { fixed: false, stars: false, cy: 0.5, R: 0.34, speed: 0.12, base: 0.07, gain: 0.48 });

  if (reduced) { drawSky(0); return () => { stopped = true; window.removeEventListener('resize', onResize); }; }
  const loop = (ms) => {
    if (stopped) return;
    drawSky(ms * 0.001);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
}


// HOME PAGE: Edit the headline, call-to-action links, and homepage sections here.
// Visual spacing, colors, and responsive behavior are in src/styles/v2-design.css.
// Numen page templates: home.js
export function home(){return `<main id="main-content">
<section class="hero hero-network container"><div class="hero-copy"><div class="pill"><span class="pulse"></span> PROOF OF SCAN · EVM LAYER 1</div><h1>A New Shape of <em>Blockchain.</em></h1><p>A Layer 1 powered by 3D geometric Proof of Scan mining, CPU/GPU participation and EVM-compatible smart contracts.</p><div class="cta-row hero-actions">${homeCTA('Start Mining', '/participate/mining', true)}${homeCTA('Create Wallet', 'https://wallet.numen-network.org')}${homeCTA('Buy NUMN', '/markets')}</div></div></section>

<section class="section home-animation-section"><div class="container"><div class="section-head home-centered"><span class="eyebrow">SEE PROOF OF SCAN</span><h2>Geometry becomes consensus.</h2></div><div class="proof-container">${asteroid()}</div></div></section>

<section class="section numen-difference"><div class="container">

<div class="numen-story-heading"><span class="eyebrow">THE PROBLEM · THE APPROACH · THE OPPORTUNITY</span><h3>Objects have shapes. Blockchains usually see only data.</h3><p>A photo, a description or a token can tell a story about an object. But none of them, on its own, proves that the physical object is genuine or that someone owns it.</p></div>
<div class="numen-story-grid">
<article class="numen-story-panel"><div class="numen-story-visual numen-story-photo"><img src="/assets/story/digital-record.webp" alt="Photorealistic 3D-scanned ceramic vase next to a digital object record, illustrating the difference between a physical item and its tokenized description" loading="lazy" decoding="async" width="480" height="240"></div><small>01 / THE PROBLEM</small><h4>A digital record is not the object.</h4><p>Traditional tokens can store claims about art, collectibles, products or property. Those claims may be incomplete, duplicated or impossible to check from the record alone.</p></article>
<article class="numen-story-panel"><div class="numen-story-visual numen-story-photo"><img src="/assets/story/geometry-infrastructure.webp" alt="Detailed 3D asteroid geometry converted into a polygonal wireframe and spectral data visualization" loading="lazy" decoding="async" width="480" height="240"></div><small>02 / WHAT NUMEN ADDS</small><h4>Geometry becomes part of the infrastructure.</h4><p>Numen combines a 3D geometry-based mining protocol with on-chain 3D model registration capability and EVM smart contracts. Registration is implemented; public registry access is not yet enabled.</p></article>
<article class="numen-story-panel"><div class="numen-story-visual numen-story-photo"><img src="/assets/story/programmable-3d.webp" alt="3D mechanical engine model linked to NFT, digital twin, RWA and decentralized application interfaces" loading="lazy" decoding="async" width="480" height="240"></div><small>03 / WHAT CAN BE BUILT</small><h4>Make 3D records programmable.</h4><p>Developers could connect registered models to NFTs, digital twins, product histories and RWA workflows. Physical authenticity and legal ownership still require independent evidence and verification.</p></article>
</div>
<div class="numen-story-example"><div><span class="eyebrow">IMAGINE A 3D CREATOR</span><h4>From a 3D model to an on-chain application.</h4><p>A creator designs a 3D object, records its geometric data when registry access becomes available, then builds an EVM application around that record. The blockchain preserves the submitted record; it does not automatically prove that a physical item matches it.</p></div><div class="numen-story-flow" aria-label="3D model to on-chain record to application"><span>3D model</span><b>→</b><span>On-chain record</span><b>→</b><span>NFT / dApp</span></div></div>
<div class="numen-usecases" id="numen-use-cases"><div class="section-head home-centered"><span class="eyebrow">EXPLORE THE POSSIBILITIES</span><h3>What could you build with Numen?</h3><p>One programmable Layer 1. Six paths for creators, builders and innovators.</p></div><div class="numen-usecase-grid"><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/rwa.jpg" alt="Modern architecture and buildings" loading="lazy" decoding="async"><span class="numen-usecase-label">POTENTIAL</span></div><div class="numen-usecase-body"><h4>Real-World Assets</h4><p>Connect geometric records to property, equipment and asset documentation. Independent verification of physical identity and ownership remains essential.</p></div></article><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/nft-digital-twins.jpg" alt="Digital art and gallery" loading="lazy" decoding="async"><span class="numen-usecase-label">POTENTIAL</span></div><div class="numen-usecase-body"><h4>NFTs & Digital Twins</h4><p>Link unique 3D models to programmable NFTs, collectibles and digital twins with EVM-compatible applications.</p></div></article><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/defi-tokenization.jpg" alt="Digital finance and blockchain" loading="lazy" decoding="async"><span class="numen-usecase-label">IN DEVELOPMENT</span></div><div class="numen-usecase-body"><h4>DeFi & Tokenization</h4><p>Build token markets, liquidity tools and financial applications using Numen’s EVM infrastructure.</p></div></article><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/gaming-metaverse.jpg" alt="Immersive game environment" loading="lazy" decoding="async"><span class="numen-usecase-label">POTENTIAL</span></div><div class="numen-usecase-body"><h4>Gaming & Metaverse</h4><p>Explore 3D game assets, virtual worlds, interoperable collectibles and programmable digital experiences.</p></div></article><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/3d-scanning.jpg" alt="Industrial 3D optical scanner without people" loading="lazy" decoding="async"><span class="numen-usecase-label">POTENTIAL</span></div><div class="numen-usecase-body"><h4>3D Scanning & Modeling</h4><p>Connect scanned geometry and designed 3D models with traceable digital records and future creator applications.</p></div></article><article class="numen-usecase-card"><div class="numen-usecase-image"><img src="/assets/use-cases/3d-printing.jpg" alt="3D designed shapes and production" loading="lazy" decoding="async"><span class="numen-usecase-label">POTENTIAL</span></div><div class="numen-usecase-body"><h4>3D Printing & Manufacturing</h4><p>Explore design provenance, version history, licensing and additive manufacturing workflows linked to geometric records.</p></div></article></div><div class="numen-usecase-flow"><span class="eyebrow">FROM 3D MODEL TO APPLICATION</span><div class="numen-usecase-steps"><strong>3D Scan / Model</strong><span>→</span><strong>On-chain Record</strong><span>→</span><strong>NFT / dApp / Workflow</strong></div><p>Illustrative workflow. Public registry access and specific integrations depend on deployment and development. A blockchain record does not independently verify physical authenticity or legal ownership.</p><a class="btn btn-primary" href="/ecosystem/use-cases">Explore Numen use cases →</a></div></div></div></section>
<section class="section numen-onboarding"><div class="container"><div class="section-head home-centered"><span class="eyebrow">START WITH NUMEN</span><h2>Find your way into Numen.</h2><p>New to geometric mining or ready to build? Choose your starting point.</p></div><div class="numen-onboarding-grid">
<article class="numen-onboarding-card"><div class="numen-illustration art-learn" aria-hidden="true"><span class="art-object">⬡</span><span class="art-orbit"></span><span class="art-chip">3D · PoScan</span></div><span class="eyebrow">DISCOVER</span><h3>Understand Numen</h3><p>Meet a Layer 1 where protocol-generated 3D geometry powers mining.</p><ul><li>What is Proof of Scan?</li><li>How CPU/GPU mining works</li><li>NUMN and network basics</li></ul>${link('Explore Numen →','/learn')}</article>
<article class="numen-onboarding-card"><div class="numen-illustration art-build" aria-hidden="true"><span class="art-code">&lt;/&gt;</span><span class="art-chip">EVM · Solidity</span></div><span class="eyebrow">BUILD</span><h3>Start Developing</h3><p>Deploy EVM-compatible contracts with familiar Ethereum tooling.</p><ul><li>RPC and network setup</li><li>Smart contract guides</li><li>Open-source repositories</li></ul>${link('Developer resources →','/developers')}</article>
<article class="numen-onboarding-card"><div class="numen-illustration art-participate" aria-hidden="true"><span class="art-object">⚒</span><span class="art-chip">CPU · GPU</span></div><span class="eyebrow">PARTICIPATE</span><h3>Mine &amp; Connect</h3><p>Download the miner, follow the setup guide and join solo or pool mining.</p><ul><li>Download the miner</li><li>Explore mining pools</li><li>Meet other contributors</li></ul>${link('Start mining →','/participate/mining')}</article>
</div></div></section>

</main>`}

function numnTokenPage(){return `<div class="token-utility-page">
 <div class="token-utility-intro"><span class="eyebrow">THE NETWORK'S NATIVE ASSET</span><h2>What is NUMN actually used for?</h2><p>NUMN is the native asset of the Numen Layer 1. It is used for network execution fees, miner incentives, governance participation and validator-related locking. Application demand is possible, but should not be confused with a guaranteed protocol requirement or investment return.</p><div class="token-utility-facts"><div><strong>1B</strong><span>Maximum issuance</span></div><div><strong>16 NUMN</strong><span>Initial block subsidy</span></div><div><strong>20% / 80%</strong><span>Miner / treasury fee split</span></div><div><strong>0%</strong><span>Protocol fee burn</span></div></div></div>
 <div class="section-head"><span class="eyebrow">LIVE PROTOCOL UTILITY</span><h2>How NUMN works today</h2><p>These roles are specified in the September 2026 technical whitepaper (sections 7, 9, 11 and 12).</p></div>
 <div class="token-utility-grid">
 <article class="token-utility-card"><span class="eyebrow">01 · NETWORK FEES</span><h3>Pay to transact and execute contracts</h3><p>Native transfers, Substrate operations and EVM contract execution incur network fees paid in NUMN. EVM base fees are part of the network fee market, not an automatic token burn.</p></article>
 <article class="token-utility-card"><span class="eyebrow">02 · MINING</span><h3>Reward open PoScan block production</h3><p>Permissionless miners receive newly issued NUMN, initially 16 per accepted block, plus 20% of transaction fees and all tips. The subsidy halves every 12.5 million blocks.</p></article>
 <article class="token-utility-card"><span class="eyebrow">03 · GOVERNANCE</span><h3>Vote on the network's future</h3><p>OpenGov uses conviction-weighted voting, where holders can lock NUMN to increase voting weight. Qualified referendum proposers provide a 5 NUMN deposit. Governance decides eligible treasury spending and protocol changes.</p></article>
 <article class="token-utility-card"><span class="eyebrow">04 · VALIDATOR LOCKS</span><h3>Support GRANDPA finality</h3><p>Validator admission is invitation-based in the initial network. Qualified operators use an on-chain identity, session keys and the applicable lock or an on-chain stake exemption. NUMN can be locked, but locking does not currently pay staking yield.</p></article>
 <article class="token-utility-card"><span class="eyebrow">05 · ON-CHAIN DEPOSITS</span><h3>Reserve funds for state usage</h3><p>Protocol deposits cover features such as preimages, identity, proxy, multisig and bounty metadata. The whitepaper specifies a storage deposit of 0.01 NUMN per byte; deposits and locks are not burns.</p></article>
 <article class="token-utility-card"><span class="eyebrow">06 · EVM INTEGRATION</span><h3>Interact with the native asset in apps</h3><p>Numen exposes a native ERC-20-compatible precompile for EVM integrations. This enables developers to build NUMN-aware applications, but each application must be implemented and verified separately.</p></article>
 </div>
 <div class="section-head"><span class="eyebrow">SUPPLY & MONETARY POLICY</span><h2>Inflationary or deflationary?</h2><p>An independent assessment of the published protocol rules—not a prediction of NUMN's market price.</p></div>
 <div class="token-utility-assessment"><div class="token-assessment-main"><span class="eyebrow">CURRENT CLASSIFICATION</span><h3>Disinflationary issuance, not a deflationary token</h3><p><strong>Inflationary in total supply today:</strong> new NUMN enters circulation through mining issuance, increasing total issued supply from the 600 million genesis allocation toward a hard ceiling of 1 billion.</p><p><strong>Disinflationary emission schedule:</strong> the block subsidy halves approximately every four years (12.5 million blocks), so the rate of new issuance declines over time.</p><p><strong>No built-in burn:</strong> fees are distributed 20% to block authors and 80% to the treasury, with tips paid to miners. The whitepaper explicitly states that nothing burns. Paying fees therefore redistributes NUMN; it does not destroy it.</p><p><strong>Locks are not deflation:</strong> validator locks, governance conviction locks and deposits can temporarily reduce liquid supply, but do not reduce total token supply. Treasury and vesting releases may increase available supply.</p><p><strong>Fixed cap ≠ falling supply:</strong> the 1B limit prevents perpetual issuance beyond the cap; it does not imply that outstanding NUMN will shrink.</p></div><aside class="token-assessment-side"><div class="tokenomics-donut" role="img" aria-label="NUMN allocation: 55 percent treasury, 40 percent mining and 5 percent airdrop"><div class="tokenomics-center"><strong>1B</strong><span>MAX SUPPLY</span></div></div><div class="token-assessment-legend"><p><i class="token-dot treasury"></i><strong>55%</strong> Treasury · 550M</p><p><i class="token-dot mining"></i><strong>40%</strong> Mining · 400M</p><p><i class="token-dot airdrop"></i><strong>5%</strong> Airdrop · 50M</p></div><small>Allocation and issuance, not current circulating supply. Whitepaper §11.</small></aside></div>
 <div class="section-head"><span class="eyebrow">VALIDATORS & STAKING</span><h2>What does staking mean on Numen?</h2></div><div class="token-utility-grid"><article class="token-utility-card"><h3>No validator APY today</h3><p>GRANDPA validators receive no protocol block rewards, fee share or yield under the current specification. Miners and validators are separate roles.</p></article><article class="token-utility-card"><h3>No slashing, but funds stay locked</h3><p>Offline eviction or equivocation may remove a validator without destroying its locked NUMN. Existing locks persist until their scheduled expiry; early withdrawal is not provided.</p></article><article class="token-utility-card"><h3>Entry is not yet permissionless</h3><p>Early validators require a qualified identity and prime invitation, and some are stake-exempt. Broader access and removal of prime gates are decentralization goals, not completed features.</p></article></div>
 <div class="section-head"><span class="eyebrow">FUTURE OPPORTUNITIES · NOT LIVE FEATURES</span><h2>Where could NUMN utility expand?</h2><p>Potential use cases depend on product launches, real user adoption and, where required, governance decisions.</p></div><div class="token-utility-grid"><article class="token-utility-card"><h3>NumenDEX and liquidity</h3><p>NUMN could serve as a swap asset, liquidity pair and transaction fee asset in deployed decentralized exchanges. Liquidity provision is optional and carries financial and smart-contract risk.</p></article><article class="token-utility-card"><h3>Cross-chain bridge activity</h3><p>Bridge applications could create new network transaction demand and use NUMN for Numen-side execution. Bridge security, supported routes and any additional fee model require independent verification.</p></article><article class="token-utility-card"><h3>dApps, NFTs and tokenization</h3><p>Applications may use NUMN for contract gas, payments or application-specific services. Numen supports 3D model registration modules; authenticity assessment also depends on external evidence and trusted processes, with no 100% accuracy guarantee.</p></article><article class="token-utility-card"><h3>Open validator access</h3><p>As the network matures, governance may change admission and validator economics. Validator fee-sharing or explicit finality rewards are possibilities mentioned in the whitepaper, not current entitlements.</p></article><article class="token-utility-card"><h3>Block-asteroid collectibles</h3><p>Optional naming, transfer and curation of reconstructed block asteroids could be built outside the consensus path. The whitepaper treats these as future application mechanics.</p></article><article class="token-utility-card"><h3>Developer grants and treasury programs</h3><p>Governance-controlled NUMN treasury funds can support public infrastructure, integrations, grants and bounties. Treasury allocations are not automatically token burns or guaranteed demand.</p></article></div>
 <div class="token-utility-caution"><strong>Independent economic perspective</strong><p>More applications may increase demand for network usage, but usage alone does not guarantee price appreciation. Supply releases, market liquidity, token velocity, transaction-fee levels, governance choices and actual adoption all matter. No future burn, staking APY or guaranteed exchange listing is assumed here.</p></div>
 <div class="cta-row token-utility-actions">${link('Read the original whitepaper →','/whitepaper')}${link('Tokenomics lesson →','/learn/tokenomics')}${link('Validator participation →','/participate/validators')}${link('Explore NUMN markets →','/markets')}</div>
 </div>`}
