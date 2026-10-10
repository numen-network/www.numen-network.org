/**
 * Numen educational animation. NOT the network's PoScan algorithm.
 * Real PoScan uses deterministic asteroid geometry derived from the work seed.
 * Physical objects are illustrative of possible applications only.
 */
export const OBJECTS = [
  {id:'watch',name:'WATCH',emoji:'⌚',color:'#67e8df'},
  {id:'sneaker',name:'SNEAKER',emoji:'👟',color:'#6dbaff'},
  {id:'gem',name:'GEMSTONE',emoji:'💎',color:'#a99aff'},
  {id:'gold',name:'GOLD BAR',emoji:'🪙',color:'#ffd27b'},
  {id:'ring',name:'RING',emoji:'💍',color:'#f6b9ee'},
  {id:'house',name:'PROPERTY',emoji:'🏠',color:'#81dfae'},
  {id:'car',name:'VEHICLE',emoji:'🚗',color:'#74c5fb'},
  {id:'laptop',name:'LAPTOP',emoji:'💻',color:'#89b9ff'},
  {id:'art',name:'ARTWORK',emoji:'🖼️',color:'#ffb68d'},
  {id:'sculpture',name:'SCULPTURE',emoji:'🗿',color:'#a8c4cf'},
  {id:'camera',name:'CAMERA',emoji:'📷',color:'#91ccfa'},
  {id:'bag',name:'DESIGNER BAG',emoji:'👜',color:'#f4ad9b'},
  {id:'boat',name:'YACHT',emoji:'🛥️',color:'#77bfe9'},
  {id:'aircraft',name:'AIRCRAFT',emoji:'✈️',color:'#9bc9ed'},
  {id:'guitar',name:'INSTRUMENT',emoji:'🎸',color:'#edba85'},
  {id:'bicycle',name:'BICYCLE',emoji:'🚲',color:'#82d8c2'},
  {id:'furniture',name:'FURNITURE',emoji:'🪑',color:'#c5a98d'},
  {id:'book',name:'RARE BOOK',emoji:'📚',color:'#d5bda6'},
  {id:'diamond',name:'DIAMOND',emoji:'💠',color:'#8cdcf7'},
  {id:'industrial',name:'MACHINERY',emoji:'⚙️',color:'#b2c6d4'},
  {id:'robot',name:'INDUSTRIAL ROBOT',emoji:'🦾',color:'#77c6d5'},
  {id:'turbine',name:'TURBINE',emoji:'🌀',color:'#77c6d5'},
  {id:'engine',name:'ENGINE',emoji:'🛠️',color:'#77c6d5'},
  {id:'chip',name:'MICROCHIP',emoji:'🔳',color:'#77c6d5'},
  {id:'factory',name:'FACTORY',emoji:'🏭',color:'#77c6d5'},
  {id:'container',name:'SHIPPING CONTAINER',emoji:'📦',color:'#77c6d5'},
  {id:'solar',name:'SOLAR PANEL',emoji:'☀️',color:'#77c6d5'},
  {id:'wind',name:'WIND TURBINE',emoji:'🌬️',color:'#77c6d5'},
  {id:'medical',name:'MEDICAL DEVICE',emoji:'🩺',color:'#77c6d5'},
  {id:'blueprint',name:'2D BLUEPRINT',emoji:'📐',color:'#77c6d5'},
  {id:'cad',name:'3D CAD MODEL',emoji:'🧊',color:'#77c6d5'},
  {id:'bim',name:'BIM ARCHITECTURE',emoji:'🏗️',color:'#77c6d5'},
  {id:'schematic',name:'CIRCUIT SCHEMATIC',emoji:'🗺️',color:'#77c6d5'},
  {id:'fingerprint',name:'BIOMETRIC TEMPLATE',emoji:'🫆',color:'#77c6d5'},
  {id:'face',name:'FACIAL GEOMETRY',emoji:'👤',color:'#77c6d5'},
  {id:'iris',name:'IRIS PATTERN',emoji:'👁️',color:'#77c6d5'},
  {id:'dna',name:'GENOMIC DATA',emoji:'🧬',color:'#77c6d5'},
  {id:'credential',name:'DIGITAL CREDENTIAL',emoji:'🪪',color:'#77c6d5'},
  {id:'document',name:'SIGNED DOCUMENT',emoji:'📄',color:'#77c6d5'},
  {id:'certificate',name:'CERTIFICATE',emoji:'🎓',color:'#77c6d5'},
  {id:'farm',name:'AGRICULTURAL ASSET',emoji:'🌾',color:'#77c6d5'},
  {id:'energy',name:'ENERGY ASSET',emoji:'🔋',color:'#77c6d5'},
  {id:'satellite',name:'SATELLITE',emoji:'🛰️',color:'#77c6d5'},
  {id:'drone',name:'INDUSTRIAL DRONE',emoji:'🚁',color:'#77c6d5'},
  {id:'sensor',name:'IOT SENSOR',emoji:'📡',color:'#77c6d5'},
  {id:'museum',name:'MUSEUM OBJECT',emoji:'🏺',color:'#77c6d5'},
  {id:'patent',name:'PATENT DRAWING',emoji:'📜',color:'#77c6d5'},
  {id:'land',name:'LAND PARCEL',emoji:'🗺️',color:'#77c6d5'}
];
const STAGES=['GENERATING GEOMETRY','SCANNING MODEL','COMPUTING SPECTRUM','CANDIDATE ACCEPTED','GRANDPA FINALITY'];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export function mountAsteroid(root){
 if(!root)return ()=>{};
 const canvas=root.querySelector('canvas'),ctx=canvas?.getContext('2d');if(!ctx)return ()=>{};
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const buttons=[...root.querySelectorAll('[data-proof-object]')],pause=root.querySelector('#proof-pause'),next=root.querySelector('#proof-next'),state=root.querySelector('.proof-state');
 let index=0,frame=0,playing=!media.matches,visible=true,raf=0,previous=0,w=1,h=1,dpr=1,dead=false;
 const duration=8000,TAU=Math.PI*2;
 const light=document.documentElement.dataset.theme==='light';
 const cyan=light?'#007b83':'#42e6df',white=light?'#13324b':'#eafaff',muted=light?'#526c7e':'#829eb1';
 const line=(x,y,X,Y,color=cyan,alpha=1,width=1)=>{ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke();ctx.restore()};
 const text=(s,x,y,size=12,color=muted,align='left',weight=500)=>{ctx.fillStyle=color;ctx.textAlign=align;ctx.font=`${weight} ${size}px ui-monospace,Consolas,monospace`;ctx.fillText(s,x,y)};
 const round=(x,y,W,H,r=10)=>{ctx.beginPath();ctx.roundRect(x,y,W,H,r)};
 function panel(x,y,W,H){ctx.fillStyle=light?'rgba(239,250,253,.92)':'rgba(6,26,41,.67)';round(x,y,W,H,11);ctx.fill();ctx.strokeStyle=light?'rgba(7,115,130,.3)':'rgba(70,197,207,.19)';ctx.stroke()}
 function grid(){ctx.strokeStyle='rgba(71,165,191,.09)';ctx.lineWidth=1;const step=35;for(let x=0;x<w;x+=step)line(x,0,x,h,light?'#347f93':'#3996a6',light?.12:.06);for(let y=0;y<h;y+=step)line(0,y,w,y,light?'#347f93':'#3996a6',light?.12:.06);for(let i=0;i<55;i++){let x=(i*117.3+17)%w,y=(i*83.7+29)%h;ctx.fillStyle=light?'rgba(13,106,128,.24)':'rgba(73,210,231,.26)';ctx.fillRect(x,y,1.3,1.3)}}
 function cube(cx,cy,s,final=false,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=final?cyan:'#4997d8';ctx.shadowBlur=final?20:5;ctx.fillStyle=final?(light?'rgba(6,150,149,.18)':'rgba(19,160,158,.28)'):(light?'rgba(25,115,166,.15)':'rgba(21,91,142,.26)');ctx.strokeStyle=final?cyan:(light?'#1475a8':'#4da4df');ctx.lineWidth=1.5;const x=s*.40,y=s*.28;ctx.beginPath();ctx.moveTo(cx,cy-s*.5);ctx.lineTo(cx+x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx-x,cy-s*.5+y);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx-x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx,cy+s*.5);ctx.lineTo(cx-x,cy+s*.5-y);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx+x,cy-s*.5+y);ctx.lineTo(cx,cy-s*.5+y*2);ctx.lineTo(cx,cy+s*.5);ctx.lineTo(cx+x,cy+s*.5-y);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;if(final)text('✓',cx,cy+s*.16,Math.max(10,s*.28),white,'center',700);ctx.restore()}
 function object(x,y,r,item,phase){
  const glow=ctx.createRadialGradient(x,y,2,x,y,r*1.8);glow.addColorStop(0,'rgba(42,212,206,.14)');glow.addColorStop(1,'rgba(42,212,206,0)');ctx.fillStyle=glow;ctx.fillRect(x-r*2,y-r*2,r*4,r*4);
  ctx.save();ctx.strokeStyle='rgba(65,232,224,.75)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y+r*.83,r*.82,r*.19,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(x,y+r*.83,r*1.08,r*.26,0,0,TAU);ctx.strokeStyle='rgba(65,232,224,.17)';ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=item.color;ctx.shadowBlur=16;ctx.font=`${Math.round(r*1.23)}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;ctx.fillText(item.emoji,x,y-r*.08);ctx.shadowBlur=0;
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
 function spectrum(x,y,W,H,phase,item){panel(x,y,W,H);text('SPECTRAL FEATURE EXTRACTION',x+13,y+22,Math.min(11,W/25),cyan);const active=ease((phase-.28)/.22);const bars=23,inner=W-30;for(let i=0;i<bars;i++){const v=(.18+.73*Math.abs(Math.sin(i*1.84+index*1.3)*Math.cos(i*.27+2)));const bh=(H-65)*v*active;ctx.fillStyle=i%5===0?item.color:cyan;ctx.globalAlpha=.35+.6*active;ctx.fillRect(x+15+i*inner/bars,y+H-27-bh,Math.max(2,inner/bars-3),bh);ctx.globalAlpha=1}text('23-D FEATURE VECTOR',x+13,y+H-11,10,muted);}
 function arrow(x1,y,x2,progress=1){line(x1,y,x2,y,cyan,.23,1.2);const xx=x1+(x2-x1)*clamp(progress);line(x1,y,xx,y,cyan,.9,2);ctx.beginPath();ctx.moveTo(xx-5,y-4);ctx.lineTo(xx,y);ctx.lineTo(xx-5,y+4);ctx.strokeStyle=cyan;ctx.stroke()}
 function drawDesktop(phase,item){const base=h*.48;const margin=w*.026,first=w*.115,geom=w*.31,specX=w*.41,specW=w*.18,newX=w*.685,chainX=w*.85;const r=Math.min(68,h*.22);
   object(first,base,r,item,phase);text(item.name,first,h*.83,11,white,'center',700);
   arrow(first+r*.9,base,geom-r*.8,ease((phase-.15)/.14));
   panel(geom-r*.95,base-r*.95,r*1.9,r*1.9);asteroidMesh(geom,base,r*.71,phase,ease((phase-.13)/.15));
   arrow(geom+r*.97,base,specX-9,ease((phase-.26)/.12));spectrum(specX,base-r*.9,specW,r*1.8,phase,item);
   arrow(specX+specW+9,base,newX-r*.68,ease((phase-.50)/.15));const accepted=ease((phase-.62)/.1);cube(newX,base,r*1.45,accepted>.6,accepted*.94+.06);if(accepted>.6)text('VALID WORK',newX,base+r*1.25,10,cyan,'center',700);
   arrow(newX+r*.72,base,chainX-r*.65,ease((phase-.69)/.10));for(let i=0;i<4;i++){const xx=chainX+i*r*.62;cube(xx,base+(i%2)*2,r*.85,i<3||phase>.82,i===3?.2+.8*ease((phase-.75)/.14):.65);if(i)line(xx-r*.4,base,xx-r*.24,base,cyan,.5,1.4)}
   const headings=[['01 / ASSET',first],['02 / 3D GEOMETRY',geom],['03 / POSCAN',specX+specW/2],['04 / BLOCK',newX],['05 / CHAIN',chainX+r*.7]];
   headings.forEach(([t,x])=>text(t,x,h*.17,Math.max(9,Math.min(12,w/100)),muted,'center'));
 }
 function drawMobile(phase,item){const left=w*.24,right=w*.73,top=h*.27,mid=h*.64,r=Math.min(w*.14,h*.13,62);
  object(left,top,r,item,phase);text(item.name,left,top+r*1.35,11,white,'center',700);
  arrow(left+r,top,right-r*.8,ease((phase-.14)/.15));panel(right-r*.85,top-r*.8,r*1.7,r*1.6);asteroidMesh(right,top,r*.62,phase,ease((phase-.14)/.14));
  line(right,top+r*.85,right,mid-r*.8,cyan,.6,1.4);spectrum(w*.07,mid-r*.76,w*.40,r*1.53,phase,item);arrow(w*.49,mid,w*.62,ease((phase-.52)/.12));cube(w*.71,mid,r*1.4,phase>.65,ease((phase-.60)/.1));
  text('01 / OBJECT',left,top-r*1.4,10,muted,'center');text('02 / GEOMETRY',right,top-r*1.4,10,muted,'center');text('03 / POSCAN',w*.27,mid-r*1.2,10,muted,'center');text('04 / BLOCK',w*.71,mid-r*1.2,10,muted,'center');
  const y=h*.89;for(let i=0;i<5;i++){const xx=w*.25+i*w*.125;cube(xx,y,Math.min(30,w*.09),i<4||phase>.83,i===4?.15+.85*ease((phase-.8)/.1):.75);if(i)line(xx-w*.08,y,xx-w*.06,y,cyan,.7)}text('05 / GRANDPA FINALITY',w*.5,h*.985,9,muted,'center');
 }
 function paint(){if(dead)return;ctx.clearRect(0,0,w,h);grid();const item=OBJECTS[index];const phase=frame/duration;const halo=ctx.createRadialGradient(w*.38,h*.4,10,w*.38,h*.4,w*.7);halo.addColorStop(0,light?'rgba(45,164,185,.10)':'rgba(11,101,122,.18)');halo.addColorStop(1,'rgba(3,13,25,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);if(w<760)drawMobile(phase,item);else drawDesktop(phase,item);const stage=Math.min(4,Math.floor(phase*5));if(state)state.textContent=STAGES[stage];for(let i=0;i<5;i++){const x=18+i*(w-36)/5;ctx.fillStyle=i<=stage?cyan:light?'rgba(7,117,134,.22)':'rgba(73,167,180,.22)';ctx.fillRect(x,h-8,(w-44)/5,2)}}
 function choose(i){index=(i+OBJECTS.length)%OBJECTS.length;frame=0;previous=0;buttons.forEach((b,n)=>{b.classList.toggle('selected',n===index);b.setAttribute('aria-pressed',String(n===index))});paint()}
 function tick(now){if(dead)return;if(previous&&playing&&visible&&!media.matches){frame+=Math.min(now-previous,70);if(frame>=duration){frame%=duration;choose(index+1)}}previous=now;paint();if(playing&&visible&&!media.matches)raf=requestAnimationFrame(tick)}
 function resize(){const rect=canvas.getBoundingClientRect();w=Math.max(1,rect.width);h=Math.max(1,rect.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paint()}
 function toggle(){playing=!playing;pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-pressed',String(!playing));previous=0;cancelAnimationFrame(raf);if(playing)raf=requestAnimationFrame(tick);else paint()}
 const onMedia=()=>{playing=!media.matches;pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-pressed',String(!playing));cancelAnimationFrame(raf);previous=0;if(playing)raf=requestAnimationFrame(tick);else paint()};
 const io=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??true;cancelAnimationFrame(raf);previous=0;if(visible&&playing)raf=requestAnimationFrame(tick)},{threshold:.01});const ro=new ResizeObserver(resize);
 const nextClick=()=>choose(index+1);buttons.forEach((b,i)=>b.addEventListener('click',()=>choose(i)));pause.addEventListener('click',toggle);next.addEventListener('click',nextClick);media.addEventListener('change',onMedia);ro.observe(canvas);io.observe(canvas);resize();if(playing)raf=requestAnimationFrame(tick);
 return()=>{dead=true;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();media.removeEventListener('change',onMedia);pause.removeEventListener('click',toggle);next.removeEventListener('click',nextClick)};
}
