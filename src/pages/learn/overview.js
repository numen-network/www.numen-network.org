// Learn Overview: self-contained page content. Edit this file for text and cards.
// Original geometric illustrations are drawn as inline SVG, without external image dependencies.
function numenLearnArt(kind){
 const shell=(body)=>`<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract illustration of ${kind.replaceAll('-',' ')}"><defs><linearGradient id="lg-${kind}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#89e5ec"/><stop offset="1" stop-color="#7866d9"/></linearGradient></defs>${body}</svg>`;
 const poly=(cx,cy,r,n=6)=>Array.from({length:n},(_,i)=>{const a=Math.PI*2*i/n-Math.PI/2;return `${(cx+Math.cos(a)*r).toFixed(1)},${(cy+Math.sin(a)*r).toFixed(1)}`}).join(' ');
 const mesh=(cx,cy,r)=>`<polygon points="${poly(cx,cy,r,8)}" fill="url(#lg-${kind})" fill-opacity=".12" stroke="#6256cc" stroke-width="2"/>${Array.from({length:8},(_,i)=>`<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(Math.PI*2*i/8-Math.PI/2)*r}" y2="${cy+Math.sin(Math.PI*2*i/8-Math.PI/2)*r}" stroke="#6256cc" opacity=".48"/>`).join('')}`;
 if(kind==='network')return shell(`<circle cx="160" cy="95" r="54" fill="#dde5ff"/>${[[160,34],[95,68],[224,68],[108,144],[210,145],[160,96]].map(([x,y],i)=>`<line x1="160" y1="96" x2="${x}" y2="${y}" stroke="#6256cc" stroke-width="3" opacity=".5"/><circle cx="${x}" cy="${y}" r="${i===5?22:13}" fill="${i===5?'#6256cc':'#b8e7ef'}" stroke="#6256cc" stroke-width="2"/>`).join('')}<path d="M153 96h14m-7-7v14" stroke="white" stroke-width="3"/>`);
 if(kind==='coin')return shell(`<ellipse cx="160" cy="111" rx="65" ry="24" fill="#cad8fb"/><circle cx="160" cy="88" r="59" fill="#c5baff" stroke="#6256cc" stroke-width="4"/><circle cx="160" cy="88" r="46" fill="none" stroke="#fff" stroke-width="2"/>${mesh(160,88,27)}<circle cx="231" cy="45" r="12" fill="#9ee3e6"/><circle cx="91" cy="143" r="9" fill="#aa9bec"/>`);
 if(kind==='geometry'||kind==='registry')return shell(`${mesh(153,91,66)}<circle cx="241" cy="55" r="20" fill="#c6f1ed" stroke="#4f9baf" stroke-width="3"/><path d="m231 55 7 7 14-17" stroke="#257e79" fill="none" stroke-width="4" stroke-linecap="round"/>${kind==='registry'?'<rect x="38" y="123" width="88" height="34" rx="9" fill="#e0d9ff" stroke="#6256cc"/><path d="M51 140h61" stroke="#6256cc" stroke-dasharray="5 5"/>':''}`);
 if(kind==='mining')return shell(`${mesh(118,92,47)}${mesh(214,92,36)}<path d="M155 93h22" stroke="#6256cc" stroke-width="4" stroke-dasharray="5 6"/><path d="m171 86 9 7-9 7" fill="none" stroke="#6256cc" stroke-width="3"/><rect x="91" y="153" width="141" height="9" rx="4" fill="#91cad9"/>`);
 if(kind==='contracts')return shell(`<rect x="90" y="30" width="140" height="130" rx="13" fill="#e6e1ff" stroke="#6256cc" stroke-width="3"/><path d="M115 66h91M115 89h64M115 112h87" stroke="#7c72d4" stroke-width="6" stroke-linecap="round"/><path d="m150 140 10 9 20-24" fill="none" stroke="#319a91" stroke-width="5"/>`);
 if(kind==='wallet')return shell(`<rect x="68" y="52" width="185" height="105" rx="18" fill="#d9e6ff" stroke="#6256cc" stroke-width="3"/><rect x="173" y="85" width="97" height="45" rx="10" fill="#a8e5e7" stroke="#6256cc" stroke-width="3"/><circle cx="196" cy="107" r="8" fill="#6256cc"/><path d="M90 52V39h124" stroke="#6256cc" stroke-width="3"/>`);
 if(kind==='apps')return shell(`${[[109,66],[195,66],[109,136],[195,136]].map(([x,y],i)=>`<rect x="${x-30}" y="${y-27}" width="60" height="54" rx="12" fill="${i%2?'#b5e6e8':'#d6ceff'}" stroke="#6256cc" stroke-width="2"/>`).join('')}<path d="M109 66h0m86 0h0" stroke="#6256cc"/>`);
 if(kind==='usecases')return shell(`<rect x="61" y="68" width="84" height="75" rx="9" fill="#bfe5e9" stroke="#559bb4" stroke-width="3"/><path d="M72 68V46l31-20 32 20v22" fill="#dcd4ff" stroke="#6256cc" stroke-width="3"/><rect x="182" y="50" width="87" height="93" rx="9" fill="#dcd4ff" stroke="#6256cc" stroke-width="3"/>${mesh(225,95,27)}<path d="M147 107h30m-8-7 9 7-9 7" stroke="#6256cc" stroke-width="3" fill="none"/>`);
 if(kind==='roadmap')return shell(`<path d="M57 139c48-88 96 51 146-45 13-25 36-26 63-44" fill="none" stroke="#6256cc" stroke-width="5" stroke-dasharray="8 9"/>${[[58,138],[159,114],[266,50]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="15" fill="#b6e9e8" stroke="#6256cc" stroke-width="3"/>`).join('')}`);
 return shell(`${mesh(160,95,62)}`);
}
const numenOverviewCard=(title,desc,url,action,art)=>`<a class="nl-card" href="${url}" data-link><div class="nl-art">${numenLearnArt(art)}</div><div class="nl-card-content"><h3>${title}</h3><p>${desc}</p><span class="nl-card-action">${action} <span aria-hidden="true">↗</span></span></div></a>`;
function numenLearnOverview(){
 return `<main id="main-content" class="nl-page"><div class="nl-container">
 <section class="nl-section nl-intro"><span class="nl-kicker">LEARN · OVERVIEW</span><h1>Understand Numen</h1><p>Numen is an open Layer 1 network where three-dimensional geometry meets blockchain infrastructure. Discover Proof of Scan mining, Numen’s architecture and programmable applications.</p><div class="nl-grid">${[
 ['What is Numen?','Meet the network, its purpose and the technologies behind it.','/learn/what-is-numen','Start here','network'],
 ['What is NUMN?','Learn about the native asset used for network fees and mining rewards.','/apps/wallet','Explore NUMN','coin'],
 ['Why Numen?','Understand why geometric computation and open infrastructure matter.','/learn/why-numen','Discover why','geometry']
 ].map(c=>numenOverviewCard(...c)).join('')}</div></section>
 <section class="nl-section"><h2>Keep learning</h2><p class="nl-lead">Explore the ideas that make Numen different, from its 3D geometry to its programmable execution layer.</p><div class="nl-grid">${[
 ['Proof of Scan','See how miners work with protocol-generated 3D asteroids to produce blocks.','/technology/proof-of-scan','Explore mining','mining'],
 ['Smart contracts','Build programmable applications using Numen’s EVM-compatible infrastructure.','/technology/evm-smart-contracts','How they work','contracts']
 ].map(c=>numenOverviewCard(...c)).join('')}</div></section>
 <section class="nl-section"><h2>How do I use Numen?</h2><p class="nl-lead">Get started with a wallet, explore the network or take part in mining.</p><div class="nl-grid">${[
 ['Choose a wallet','Connect with Numen Web Wallet or configure a compatible EVM wallet.','/apps/wallet','Explore wallets','wallet'],
 ['Explore applications','Discover NumenDEX, the explorer and the growing application ecosystem.','/apps','Browse apps','apps'],
 ['Start mining','Learn about the node, CPU/GPU miner and network dashboard.','/apps/miner','Start mining','mining']
 ].map(c=>numenOverviewCard(...c)).join('')}</div></section>
 <section class="nl-section"><h2>What can Numen be used for?</h2><p class="nl-lead">Geometry-aware records and EVM applications open up possibilities in physical asset workflows, tokenization, digital twins, NFTs, DeFi, gaming and 3D manufacturing.</p><a class="nl-banner" href="/technology/use-cases" data-link><div><span class="nl-kicker">EXPLORE THE POSSIBILITIES</span><h3>Discover Numen use cases</h3><p>From 3D scanning and printing to real-world asset records and programmable digital economies.</p><span class="nl-banner-button">Explore use cases ↗</span></div><div class="nl-banner-art" aria-hidden="true">${numenLearnArt('usecases')}</div></a></section>
 <section class="nl-section"><h2>How does Numen work?</h2><p class="nl-lead">Explore the architecture, the network's development and its technical foundations.</p><div class="nl-grid">${[
 ['Network architecture','Learn how PoScan block production, GRANDPA finality and EVM execution fit together.','/technology/proof-of-scan','Explore technology','network'],
 ['Roadmap','See completed milestones, ongoing work and planned improvements.','/learn/roadmap','View roadmap','roadmap'],
 ['Technical whitepaper','Read the original Numen technical specification and its design assumptions.','/whitepaper','Read whitepaper','contracts']
 ].map(c=>numenOverviewCard(...c)).join('')}</div></section>
 <p class="nl-footnote">3D geometric matching evaluates models under defined criteria; it does not independently establish legal ownership or product authenticity. Public registry availability depends on deployment status.</p>
 </div></main>`;
}
pageRegistry['/learn']=numenLearnOverview;
