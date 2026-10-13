export const network={name:'Numen Network',symbol:'NUMN',chainId:32026,decimals:18,rpc:'https://rpc.numen-network.org',wss:'wss://rpc.numen-network.org',explorer:'https://explorer.numen-network.org',wallet:'https://wallet.numen-network.org',github:'https://github.com/numen-network',spectral3d:'https://github.com/numen-network/spectral3d',spectral3dCalibration:'https://github.com/numen-network/spectral3d-calibration',spectral3dCli:'https://github.com/numen-network/spectral3d-cli',faucetRepository:'https://github.com/numen-network/faucet',nodeRepository:'https://github.com/numen-network/numen',numendexRepository:'https://github.com/numen-network/numendex',miner:'https://github.com/numen-network/numen-miner/releases',website:'https://numen-network.org',coingecko:'https://www.coingecko.com/en/coins/numen',telegram:'https://t.me/numen_network',discord:'https://discord.gg/ajPKdvrvJK',x:'https://x.com/NumenOnchain',email:'contact@numen-network.org',linkedin:'https://www.linkedin.com/in/numennetwork/',instagram:'https://www.instagram.com/numen_network/',tiktok:'https://www.tiktok.com/@numen.numn',bitcointalk:'https://bitcointalk.org/index.php?action=profile;u=3763959',medium:'https://medium.com/@numennetwork',youtube:'https://www.youtube.com/@numen_network',blockspot:'https://blockspot.io/coin/numen-numn/',minerRepository:'https://github.com/numen-network/numen-miner',walletRepository:'https://github.com/numen-network/wallet',explorerRepository:'https://github.com/numen-network/explorer',registrarRepository:'https://github.com/numen-network/registrar-id',websiteRepository:'https://github.com/numen-network/numen-network.org',nativeErc20:'0x0000000000000000000000000000000000000802'};
export const products=[
 {name:'Use Cases',category:'Applications',description:'Explore potential use cases for tokenization, digital twins, identity, finance and programmable markets.',url:'/ecosystem/use-cases',status:'Explore possibilities',icon:'◇'},
 {name:'NUMN Token',category:'Native token',description:'Network fees, mining rewards, OpenGov participation and validator locks. Explore supply and monetary policy.',url:'/ecosystem/numn-token',status:'Native asset',icon:'◉'},
 {name:'Numen Explorer',category:'Infrastructure',description:'Explore blocks, transactions, addresses and network activity.',url:network.explorer,status:'Live',icon:'◫'},
 {name:'Web Wallet',category:'Wallets',description:'Access Numen accounts and transfer NUMN.',url:network.wallet,status:'Live',icon:'▣'},
 {name:'Mobile Wallet',category:'Wallets',description:'Mobile access to Numen. Official store links will appear after verification.',status:'Link pending',icon:'▯'},
 {name:'NumenDEX',category:'DeFi',description:'Decentralized swaps and liquidity for Numen assets. Verify the official deployment before trading.',status:'Verify deployment',icon:'⇄'},
 {name:'Numen Bridge',category:'Interoperability',description:'Cross-chain transfers and supported asset routes. Availability depends on deployment.',status:'In development',icon:'↔'},
 {name:'spectral3d',category:'Developer tools',description:'Open-source geometric feature extraction and spectral scanning library.',url:network.spectral3d,status:'Open source',icon:'◇'},
 {name:'Numen Miner',category:'Mining',description:'Open-source PoScan miner and release downloads.',url:network.miner,status:'Open source',icon:'⚒'}
];
export const exchanges=[{name:'NumenDEX',status:'Coming soon',url:null},{name:'Uniswap',status:'Coming soon',url:null}];
export const partners=[];
// Public team profiles. Empty values are intentionally unpublished until supplied.
// Discord and Telegram must be full, verified profile URLs; never infer links from usernames.

export const team = [
  {
    id: 'moto-z',
    name: 'Moto Z',
    role: 'Founder & Lead Blockchain Developer',
    founder: true,
    discordUsername: '@numen_motoz',
    telegram: 'https://t.me/numen_motoz',
    avatar: ''
  },
  {
    id: 'fd',
    name: 'FD',
    role: 'Founder & Application Developer',
    founder: true,
    discordUsername: '@fd3dpass',
    telegram: 'https://t.me/iayfd',
    avatar: ''
  },
  {
    id: 'aimaster',
    name: 'AlMaster',
    role: 'Application Developer',
    founder: false,
    discordUsername: '',
    telegram: 'https://t.me/InwestujzAI',
    avatar: ''
  },
  {
    id: 'aleksey',
    name: 'Алексей',
    role: 'Strategic Partnerships & Ecosystem Relations',
    founder: false,
    discordUsername: '',
    telegram: 'https://t.me/tapenumbra',
    avatar: ''
  },
  {
    // QA contributor: add only verified social profile URLs when available.
    id: 'bbaki07',
    name: 'bbaki07',
    role: 'Ecosystem Product Testing & QA',
    founder: false,
    discordUsername: '',
    telegram: '',
    avatar: ''
  },
  {
    id: 'venom',
    name: 'Venom',
    role: 'Marketing & Social Media Manager',
    founder: false,
    discordUsername: '',
    telegram: 'https://t.me/Vveennoom7',
    avatar: ''
  }
];

export const roadmap=[
 {period:'2026 · Milestones',title:'Network foundations',items:[{text:'Public testnet launched · July 23, 2026',state:'done'},{text:'Mainnet launched · September 14, 2026',state:'done'},{text:'Official website',state:'done'},{text:'Social channels and community foundations',state:'done'},{text:'Blockchain node',state:'done'},{text:'CPU and GPU miner',state:'done'},{text:'Web wallet',state:'done'},{text:'Block explorer',state:'done'},{text:'Automatic identity registrar',state:'done'}]},
 {period:'2026 · Q4',title:'Ecosystem development',items:[{text:'NumenDEX development',state:'progress'},{text:'Cross-chain bridge development',state:'progress'}]},
 {period:'2027 · Q1',title:'Market access',items:[{text:'Pursue verified CEX listings',state:'planned'},{text:'Prepare decentralized exchange liquidity and listings',state:'planned'},{text:'Continue NumenDEX and bridge development',state:'planned'}]},
 {period:'2027 · Q2',title:'Ecosystem integrations',items:[{text:'dApp integrations and EVM developer onboarding',state:'planned'},{text:'Strategic technical partnerships',state:'planned'}]},
 {period:'2027 · Q3',title:'Network participation',items:[{text:'Expand independent validators and operational tooling',state:'planned'},{text:'Evaluate security prerequisites for easier validator admission',state:'planned'}]},
 {period:'2027 · Q4',title:'Decentralization roadmap',items:[{text:'Pursue governance-led retirement of remaining prime privileges, subject to network security and referendum decisions',state:'planned'},{text:'Work toward more open validator admission, subject to validator diversity and security review',state:'planned'}]}
];
