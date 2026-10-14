// Read-only mining overview. Never infer PoScan miner identity from EVM block.miner.
const miningRpcUrl = 'https://rpc.numen-network.org';
let miningRefreshTimer = null;
let miningLastBlocks = [];
let miningLastIntervals = [];
let miningChartMode = 'interval';
let miningRequestSerial = 0;
const miningSubstrateWs = 'wss://rpc.numen-network.org';
// twox128('Difficulty') ++ twox128('CurrentDifficulty'), verified against the runtime pallet.
const miningDifficultyStorageKey = '0x7d15dd66fbf0cbda1d3a651b5e606df259769e16105568cee9f916e870cb6e6f';

function miningDashboardPage(){
 return `<main id="main-content" class="container mining-page"><div class="mining-heading"><div><span class="eyebrow">NUMEN MAINNET · LIVE RPC</span><h1>Mining Dashboard</h1><p>Live block observations and PoScan difficulty-based network estimates.</p></div><div class="mining-actions"><span id="mining-status" role="status">Connecting…</span><button type="button" class="mining-refresh" id="mining-refresh">Refresh data</button></div></div>
 <div class="mining-v7-layout"><div class="mining-v7-left">
 <div class="mining-metrics mining-v7-metrics" aria-label="PoScan metrics">${[['Current PoScan difficulty','difficulty'],['Estimated effective network hashrate','hashrate'],['Substrate state','miners'],['Latest block','latest'],['Average block interval · sample','interval'],['Block reward · initial','reward']].map(([label,id])=>`<article class="mining-metric"><span>${label}</span><strong id="mining-${id}">${id==='reward'?'16 NUMN':'—'}</strong></article>`).join('')}</div>
 </div><section class="mining-panel mining-v7-right"><span class="eyebrow">POSCAN ANALYTICS</span><h2>Network statistics</h2><div class="mining-link-stack"><a href="https://explorer.numen-network.org/miners" target="_blank" rel="noopener noreferrer">Miner leaderboard ↗</a><a href="https://explorer.numen-network.org/blocks" target="_blank" rel="noopener noreferrer">PoScan block details ↗</a><a href="/participate/mining-pools">Mining pools →</a></div></section></div>
 <section class="mining-graphs" aria-label="Network history charts">
 <article class="mining-panel"><span class="eyebrow">NETWORK WORK</span><h2>Estimated network hashrate</h2><p class="mining-muted">Estimated effective work · recent difficulty samples</p><div id="mining-hash-chart" class="mining-line-chart">Loading history…</div></article>
 <article class="mining-panel"><span class="eyebrow">POSCAN DIFFICULTY</span><h2>Network difficulty</h2><p class="mining-muted">Recent finalized PoScan difficulty samples</p><div id="mining-difficulty-chart" class="mining-line-chart">Loading history…</div></article>
 <article class="mining-panel"><span class="eyebrow">BLOCK PRODUCTION</span><h2>Average block time</h2><p class="mining-muted">Rolling average · recent block samples</p><div id="mining-interval-chart" class="mining-line-chart">Loading history…</div></article>
 </section>
 <div class="mining-footnote">Data sources: Numen EVM JSON-RPC and Substrate WebSocket JSON-RPC. PoScan hashrate is a statistical estimate, not a direct hardware measurement. Initial 16 NUMN block reward is protocol information, not a live subsidy reading. This dashboard never requests wallet access.</div></main>`;
}
async function miningRpc(method,params=[],signal){
 const res=await fetch(miningRpcUrl,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal});
 if(!res.ok)throw new Error('RPC HTTP '+res.status);
 const data=await res.json();if(data.error)throw new Error(data.error.message||'RPC error');if(data.result==null)throw new Error('Empty RPC response');return data.result;
}
function miningSet(id,value){const el=document.getElementById('mining-'+id);if(el)el.textContent=value;}
function miningTime(hex){if(!hex)return null;const n=Number(BigInt(hex));return Number.isFinite(n)?n:null;}
async function miningLoad(){
 const serial=++miningRequestSerial;
 const status=document.getElementById('mining-status');if(!status)return;
 status.textContent='Updating…';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const [chain,head]=await Promise.all([miningRpc('eth_chainId',[],controller.signal),miningRpc('eth_blockNumber',[],controller.signal)]);
  if(serial!==miningRequestSerial)return;
  const chainId=Number(BigInt(chain));miningSet('chain',String(chainId));if(chainId!==32026)throw new Error('Unexpected chain ID: '+chainId);
  const number=BigInt(head);const heights=Array.from({length:Number(number<36n?number+1n:36n)},(_,i)=>number-BigInt(i));
  const results=await Promise.allSettled(heights.map(n=>miningRpc('eth_getBlockByNumber',['0x'+n.toString(16),false],controller.signal)));
  if(serial!==miningRequestSerial)return;
  const blocks=results.filter(x=>x.status==='fulfilled'&&x.value&&x.value.timestamp).map(x=>x.value).sort((a,b)=>Number(BigInt(b.number)-BigInt(a.number)));
  miningLastBlocks=blocks;miningSet('latest',number.toLocaleString('en-US'));
  const intervals=[];for(let i=0;i<blocks.length-1;i++){const diff=Number(BigInt(blocks[i].number)-BigInt(blocks[i+1].number));const seconds=miningTime(blocks[i].timestamp)-miningTime(blocks[i+1].timestamp);if(diff===1&&seconds>=0&&seconds<3600)intervals.push(seconds);}
  miningLastIntervals=intervals;miningSet('interval',intervals.length?(intervals.reduce((a,b)=>a+b,0)/intervals.length).toFixed(1)+' s':'Unavailable');
  await miningLoadSubstrate(serial);

  const chron=intervals.slice().reverse();
  const rolling=chron.map((_,i)=>{const window=chron.slice(Math.max(0,i-5),i+1);return window.reduce((a,b)=>a+b,0)/window.length;});
  miningDrawSeries('mining-interval-chart',rolling,{unit:' s',digits:1});

  miningSet('updated','Last updated '+new Date().toLocaleString('en-US'));status.textContent='Live · '+new Date().toLocaleTimeString('en-US');status.dataset.state='ok';
 }catch(err){if(serial!==miningRequestSerial)return;status.textContent='RPC unavailable · '+(err.name==='AbortError'?'request timed out':err.message);status.dataset.state='error';}
 finally{clearTimeout(timeout);}
}
function miningCsv(){if(!miningLastBlocks.length)return;const lines=['block,timestamp_utc,evm_transaction_count,evm_block_hash',...miningLastBlocks.map(b=>[BigInt(b.number).toString(),new Date(miningTime(b.timestamp)*1000).toISOString(),Array.isArray(b.transactions)?b.transactions.length:'',String(b.hash||'')].join(','))];const blob=new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='numen-sampled-evm-blocks.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function miningMount(){miningUnmount();document.getElementById('mining-refresh')?.addEventListener('click',miningLoad);miningLoad();miningRefreshTimer=setInterval(()=>{if(!document.hidden){miningLoad()}},30000);}
function miningUnmount(){if(miningRefreshTimer!==null){clearInterval(miningRefreshTimer);miningRefreshTimer=null;}miningRequestSerial++;miningLastBlocks=[];}

// Substrate RPC: query the Difficulty pallet storage directly, without GraphQL.
// StorageValue<U256> is SCALE-encoded as a 32-byte little-endian integer.
function miningDecodeU256(hex){
 if(typeof hex!=='string'||!/^0x[0-9a-f]{64}$/i.test(hex))throw Error('Unexpected U256 storage encoding');
 const bytes=hex.slice(2).match(/../g).reverse().join('');return BigInt('0x'+bytes);
}
function miningFormatWork(value){
 const units=[['TH/s',1e12],['GH/s',1e9],['MH/s',1e6],['kH/s',1e3],['H/s',1]];
 const unit=units.find(([,scale])=>value>=scale)||units.at(-1);
 return (value/unit[1]).toLocaleString('en-US',{maximumFractionDigits:2})+' '+unit[0];
}
function miningSubstrateSession(){
 return new Promise((resolve,reject)=>{
  const ws=new WebSocket(miningSubstrateWs);let seq=0;const pending=new Map();
  const timer=setTimeout(()=>{ws.close();reject(Error('Substrate WebSocket timeout'));},10000);
  ws.onopen=()=>{clearTimeout(timer);resolve({
   call(method,params=[]){return new Promise((yes,no)=>{const id=++seq;const t=setTimeout(()=>{pending.delete(id);no(Error(method+' timed out'));},9000);pending.set(id,{yes,no,t});ws.send(JSON.stringify({jsonrpc:'2.0',id,method,params}));});},
   close(){for(const v of pending.values()){clearTimeout(v.t);v.no(Error('Connection closed'));}pending.clear();ws.close();}
  });};
  ws.onerror=()=>{clearTimeout(timer);reject(Error('Substrate WebSocket connection failed'));};
  ws.onclose=()=>{clearTimeout(timer);for(const v of pending.values()){clearTimeout(v.t);v.no(Error('Substrate WebSocket closed'));}pending.clear();};
  ws.onmessage=e=>{try{const msg=JSON.parse(e.data);const p=pending.get(msg.id);if(!p)return;pending.delete(msg.id);clearTimeout(p.t);if(msg.error)p.no(Error(msg.error.message||'RPC error'));else p.yes(msg.result);}catch{}};
 });
}
async function miningLoadSubstrate(serial){
 let session;
 try{
  session=await miningSubstrateSession();
  const head=await session.call('chain_getFinalizedHead');
  const header=await session.call('chain_getHeader',[head]);
  const height=Number(BigInt(header.number));
  const currentHex=await session.call('state_getStorage',[miningDifficultyStorageKey,head]);
  if(!currentHex)throw Error('Difficulty.CurrentDifficulty storage not exposed');
  const current=miningDecodeU256(currentHex);
  if(current<=0n)throw Error('Invalid zero difficulty');
  // Read a small historical sample. Some public nodes prune historical state.
  const heights=Array.from({length:20},(_,i)=>height-i*3).filter(n=>n>=0);
  const samples=await Promise.allSettled(heights.map(async n=>{
   const hash=await session.call('chain_getBlockHash',[n]);
   const value=await session.call('state_getStorage',[miningDifficultyStorageKey,hash]);
   return value?miningDecodeU256(value):null;
  }));
  if(serial!==miningRequestSerial)return;
  const ds=samples.filter(x=>x.status==='fulfilled'&&x.value!==null&&x.value>0n).map(x=>x.value);
  const historical=samples.map((x,i)=>({height:heights[i],difficulty:x.status==='fulfilled'?x.value:null})).filter(x=>x.difficulty!==null&&x.difficulty>0n).reverse();
  miningDrawSeries('mining-difficulty-chart',historical.map(x=>Number(x.difficulty)),{unit:'',digits:0,labels:historical.map(x=>'#'+x.height)});
  const historicalInterval=miningLastIntervals.length?miningLastIntervals.reduce((a,b)=>a+b,0)/miningLastIntervals.length:0;
  miningDrawSeries('mining-hash-chart',historicalInterval>0?historical.map(x=>Number(x.difficulty)/historicalInterval/1e6):[],{unit:' MH/s',digits:2,labels:historical.map(x=>'#'+x.height)});
  miningSet('difficulty',current.toLocaleString('en-US'));
  
  
  miningSet('miners','Connected');
  // This is an approximate short-window estimate: a live difficulty snapshot / observed EVM block interval.
  // Never label it as directly measured device hashrate.
  const avg=miningLastIntervals.length?miningLastIntervals.reduce((a,b)=>a+b,0)/miningLastIntervals.length:0;
  const rate=avg>0?Number(current)/avg:NaN;
  miningSet('hashrate',Number.isFinite(rate)&&rate>0?miningFormatWork(rate):'Unavailable');

 }catch(e){if(serial!==miningRequestSerial)return;
  for(const id of ['difficulty','hashrate','miners'])miningSet(id,'Unavailable');
  for(const id of ['mining-difficulty-chart','mining-hash-chart'])miningDrawSeries(id,[],{});

 }finally{session?.close();}
}



// Responsive SVG area charts inspired by mining pool analytics.
// Purple is inherited from the Numen theme; no invented historical data.
function miningDrawSeries(id,values,{unit='',digits=1,labels=[]}={}){
 const target=document.getElementById(id);if(!target)return;
 const points=values.filter(v=>Number.isFinite(v)&&v>=0);
 if(points.length<2){target.textContent='Not enough verified historical data.';return;}
 const w=680,h=290,left=72,right=18,top=30,bottom=40;
 const min=Math.min(...points),max=Math.max(...points),range=max-min;
 const low=Math.max(0,min-range*.24),high=max+(range||Math.max(max*.1,1))*.24;
 const x=i=>left+i*(w-left-right)/(points.length-1);
 const y=v=>top+(high-v)/(high-low)*(h-top-bottom);
 const fmt=v=>v.toLocaleString('en-US',{maximumFractionDigits:digits});
 const avg=points.reduce((a,b)=>a+b,0)/points.length;
 const line=points.map((v,i)=>`${i?'L':'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
 const area=line+` L ${x(points.length-1).toFixed(1)} ${h-bottom} L ${left} ${h-bottom} Z`;
 const uid=id.replace(/[^a-z0-9]/gi,'');
 const ticks=[0,.25,.5,.75,1].map(f=>{
  const v=low+(high-low)*f,py=y(v);
  return `<line x1="${left}" y1="${py}" x2="${w-right}" y2="${py}" stroke="currentColor" opacity=".09" stroke-dasharray="3 5"/><text x="${left-10}" y="${py+4}" text-anchor="end" fill="currentColor" opacity=".62" font-size="12">${fmt(v)}</text>`;
 }).join('');
 const last=points.at(-1);
 const xLabels=[0,Math.floor((points.length-1)/2),points.length-1].map((i,j)=>`<text x="${x(i)}" y="${h-11}" text-anchor="${j===0?'start':j===2?'end':'middle'}" font-size="12" fill="currentColor" opacity=".6">${labels[i]||'Sample '+(i+1)}</text>`).join('');
 const averageY=y(avg);
 const average=`<line x1="${left}" y1="${averageY}" x2="${w-right}" y2="${averageY}" stroke="currentColor" stroke-dasharray="8 6" opacity=".55"/><text x="${w-right}" y="${Math.max(12,averageY-8)}" text-anchor="end" fill="currentColor" font-size="11" opacity=".8">Avg ${fmt(avg)}${unit}</text>`;
 const dots=points.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="8" fill="transparent"><title>${labels[i]||'Sample '+(i+1)}: ${fmt(v)}${unit}</title></circle>`).join('');
 target.innerHTML=`<div class="mining-chart-stats"><div><strong>${fmt(last)}${unit}</strong><small>Latest sample</small></div><div class="mining-chart-average"><strong>${fmt(avg)}${unit}</strong><small>Sample average</small></div></div><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${id.replaceAll('-',' ')} with ${points.length} real RPC samples" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="${uid}Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".25"/><stop offset="100%" stop-color="var(--accent)" stop-opacity=".015"/></linearGradient></defs>${ticks}<path d="${area}" fill="url(#${uid}Fill)"/>${average}<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xLabels}</svg><div class="mining-chart-foot">Recent RPC samples · ${points.length} observations</div>`;
}
