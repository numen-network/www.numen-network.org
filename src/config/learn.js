export const learnChapters = {
  "what-is-numen": {
    "eyebrow": "Start here",
    "title": "What is Numen?",
    "lead": "A public Layer 1 where verifiable geometric computation produces blocks and GRANDPA finalizes history.",
    "readTime": "5–7 min",
    "paper": "1–3",
    "sections": [
      [
        "The idea",
        "Numen replaces an opaque hash-only mining inner loop with deterministic geometric work. A successful miner leaves behind a reproducible 3D asteroid as a visible trace of the effort spent producing the block."
      ],
      [
        "What makes it a blockchain",
        "Nodes independently verify transactions and blocks. PoScan miners propose new blocks without permission; GRANDPA validators vote on a prefix of the chain to make its history final."
      ],
      [
        "A hybrid by design",
        "Proof-of-Work determines who produces the next block. Byzantine fault tolerant voting determines which history becomes irreversible. These functions are deliberately separate."
      ],
      [
        "A visible artifact, not an authenticity certificate",
        "Each sealed block can reconstruct an asteroid from its winning nonce and pre-hash. It is not a proof that a physical watch, house, gold bar or artwork is authentic."
      ],
      [
        "Applications and tooling",
        "The Frontier EVM layer makes Ethereum-style smart contracts and tools available. DeFi, tokenized assets, NFTs and object registries are application possibilities, not claims that the consensus protocol itself authenticates real-world objects."
      ],
      [
        "Important limits",
        "Mining is permissionless; early validator admission is invitation-based. The September 2026 whitepaper discloses no independent third-party audit and makes no FPGA/ASIC resistance claim."
      ]
    ]
  },
  "proof-of-scan": {
    "eyebrow": "Mining technology",
    "title": "Proof of Scan explained",
    "lead": "From a block-bound seed to a full-entropy work value: the deterministic five-stage PoScan pipeline.",
    "readTime": "9–12 min",
    "paper": "5",
    "sections": [
      [
        "1. Bind each attempt to its block",
        "seed = SHA-256(protocol || 0x00 || pre_hash || nonce). The full 32-byte seed incorporates the block pre-hash, which commits to the parent and author. A winning nonce cannot be replayed against a different parent or miner."
      ],
      [
        "2. Generate a protocol-defined asteroid",
        "The chain, not the miner, chooses the object. A seeded PCG64 generator and per-seed Perlin/fBm noise shape a subdivision-4 icosphere with exactly 2,562 vertices. Five noise octaves, ten craters and four lobes are fixed work counts."
      ],
      [
        "3. Perform the spectral scan",
        "spectral3d normalizes the mesh, samples 4,096 surface points and computes 23 features: two covariance eigenvalue ratios, one mean-radius statistic, six area-weighted and six radius-weighted spherical-harmonic powers, and an eight-bin radius histogram."
      ],
      [
        "4. Quantize and hash",
        "Features are quantized much more finely than recognition-grade buckets, with epsilon scale 10^-5. The final work value is SHA-256(protocol || 0x00 || pre_hash || buckets). The result is tested against the difficulty target."
      ],
      [
        "5. Verify by replay",
        "The seal carries a nonce and work value, not the entire mesh or feature vector. A verifier derives the seed, rebuilds the asteroid, rescans it, requantizes and hashes exactly once. Invalid work is rejected."
      ],
      [
        "Why shortcuts matter",
        "Cheap decimated meshes, surrogate models, precomputed tables, miner-supplied meshes and variable-cost seed filtering are addressed through protocol parameters and construction. The whitepaper reports experimental measurements; these are not an independent audit."
      ],
      [
        "Determinism is a consensus rule",
        "Floating-point behavior must match bit-for-bit on supported architectures. The reference uses software libm, forbids fast-math/FMA contraction and tests golden work-value anchors across native and wasm execution."
      ],
      [
        "One block, one asteroid",
        "The geometry is not stored in the block. Its winning pre-hash and nonce allow reconstruction through the poscan_getObject export RPC. Collectible or asset functionality, if added, belongs outside consensus."
      ]
    ]
  },
  "consensus": {
    "eyebrow": "Network security",
    "title": "Hybrid consensus",
    "lead": "Permissionless PoScan block production and GRANDPA BFT finality protect different parts of one chain.",
    "readTime": "8–10 min",
    "paper": "4, 7",
    "sections": [
      [
        "The production lane",
        "Miners search PoScan nonces and propose blocks at a 10-second target interval. The protocol enforces a two-second minimum timestamp spacing. Before finality, competing branches can occur."
      ],
      [
        "Fork choice",
        "The best unfinalized chain is selected by highest accumulated difficulty, not simply height. At equal weight the first-seen branch wins. No branch may override a GRANDPA-finalized block."
      ],
      [
        "The finality lane",
        "GRANDPA validators vote on chains rather than one block at a time. A round with more than two-thirds of validator weight finalizes a whole prefix. About one minute to irreversibility is a design target, not a guaranteed service-level promise."
      ],
      [
        "Sessions and handover",
        "Validator-set changes happen every 60 blocks, roughly ten minutes at the target interval. Scheduled changes let the previous validator set complete its last voting round."
      ],
      [
        "Different failure modes",
        "If enough validators go offline, PoW block production can continue while finality stalls. If PoW hash power is attacked, finalized blocks remain protected by GRANDPA safety assumptions."
      ],
      [
        "Security tradeoff",
        "Validators are identity-bearing and early admission is invitation-based. The whitepaper explicitly acknowledges central control over validator entry during this phase."
      ]
    ]
  },
  "asteroid-artifacts": {
    "eyebrow": "Geometric artifacts",
    "title": "One block, one asteroid",
    "lead": "Why every winning PoScan nonce leaves a visible, reconstructible proof trace.",
    "readTime": "5–7 min",
    "paper": "5.8, 8.1",
    "sections": [
      [
        "Not a warehouse",
        "Numen does not store full asteroid meshes in every block. The chain stores the minimal seal data required to regenerate the object deterministically."
      ],
      [
        "A reproducible catalogue",
        "Block height acts as an artifact catalogue number. Explorers or wallets may render the corresponding asteroid from the export RPC without changing consensus."
      ],
      [
        "How reconstruction works",
        "The original block pre-hash and winning nonce regenerate the same seed, parameters, 2,562-vertex mesh and spectral computation. Visual materials and lighting are presentation choices."
      ],
      [
        "Collectibles are optional",
        "Naming, transfer and curation mechanics are suggested as possible future application or pallet features. They are not automatically provided by PoScan consensus."
      ],
      [
        "Do not confuse objects",
        "The real-world object carousel on the homepage is an educational metaphor for possible applications. Actual PoScan mining generates protocol-chosen asteroids, not miner-uploaded watches or artworks."
      ]
    ]
  },
  "validators": {
    "eyebrow": "Participation",
    "title": "Validators and finality",
    "lead": "How accountable validators vote, join, exit and keep the chain final.",
    "readTime": "8–10 min",
    "paper": "7",
    "sections": [
      [
        "A separate role",
        "Miners produce blocks and earn block rewards. Validators vote in GRANDPA and do not receive protocol validator rewards under the whitepaper v1.1 rules."
      ],
      [
        "Admission and identity",
        "Early entry requires qualified on-chain identity with a reachable social channel and an invitation by the prime authority. The published criteria emphasize community trust, independence from large miners and reliable infrastructure."
      ],
      [
        "Two keys, two purposes",
        "The account key holds funds and remains offline; the validator server holds GRANDPA and heartbeat session keys, which do not control the account balance."
      ],
      [
        "Heartbeats and removal",
        "Each validator must send a signed heartbeat per session. Missing one session or equivocation can trigger eviction at a session boundary and a one-day cooldown."
      ],
      [
        "Locking without slashing",
        "Active validators have time-locked funds, with automatic renewal while active. No slashing applies and there is no early unlock after exit; exemption-list entries may join with a zero-value lock."
      ],
      [
        "Safety limits",
        "A validator committee requires more than two-thirds participation for finality. Corrupting more than one-third of its weight threatens safety; this is why early validator-set admission is tightly controlled."
      ]
    ]
  },
  "difficulty": {
    "eyebrow": "Mining economics",
    "title": "Difficulty and ASERT",
    "lead": "How Numen retargets mining difficulty and recovers after prolonged outages.",
    "readTime": "6–8 min",
    "paper": "6",
    "sections": [
      [
        "The 10-second schedule",
        "Numen uses ASERT, an absolutely scheduled exponential retarget, instead of a rolling window. Difficulty responds to elapsed time relative to block height."
      ],
      [
        "Thirty-minute half-life",
        "The ASERT half-life is 1,800 seconds: approximately 30 minutes behind schedule halves difficulty, and 30 minutes ahead doubles it."
      ],
      [
        "Timestamp constraints",
        "A block timestamp must advance at least two seconds beyond its parent and may not run more than two seconds ahead of network time."
      ],
      [
        "Outage re-anchoring",
        "After a gap longer than 1,800 seconds between blocks, the anchor resets at the recovery block to avoid repaying downtime with thousands of near-free blocks."
      ],
      [
        "Consensus validation",
        "Peers calculate the accepted target from chain data and the proposed block timestamp, never from each verifier’s current wall clock."
      ]
    ]
  },
  "tokenomics": {
    "eyebrow": "Understanding NUMN supply",
    "title": "NUMN tokenomics: where the tokens go",
    "lead": "A plain-English guide to the community treasury, airdrop vesting and miner rewards — based on the Numen technical whitepaper v1.1.",
    "readTime": "12–15 min",
    "paper": "11–12",
    "sections": [
      ["The big picture: one billion NUMN", "The protocol has a fixed issuance ceiling of 1,000,000,000 NUMN. At genesis, 600 million were issued: 550 million for the on-chain treasury and 50 million for the launch airdrop. The remaining 400 million are progressively issued as mining rewards. These are allocations, not the same thing as freely circulating supply."],
      ["55% · Community-governed treasury (550 million NUMN)", "The treasury is an on-chain account, not a private team wallet. Its funds are spendable through Numen OpenGov decisions: NUMN holders participate in referenda to authorize eligible spending. The founder or project prime key cannot simply transfer treasury funds to itself or to another wallet. The treasury also receives 80% of ordinary transaction fees, as specified by the whitepaper."],
      ["How a treasury grant can work", "A contributor can propose work that benefits the network, provide a scope and budget, and seek approval through the applicable governance track. The whitepaper describes bounties and child-bounties: a scope is approved, a curator is appointed with a bond, deliverables are checked, and payment follows verified work. The guiding principle is 'deliver first, pay later'. Approval is never automatic, and eligibility, voting thresholds and treasury resources matter."],
      ["What could treasury funding support?", "Illustrative proposals include protocol engineering and security audits; open-source developer grants; dApp and wallet development; blockchain explorers, APIs and tooling; exchange integrations and potential listing costs; DEX liquidity programs; bridge and ecosystem integrations; bug bounties and security research; community education, documentation and translation; marketing and adoption campaigns; and transparent economic incentives. These are possible grant categories, not approved budgets, promised payments, endorsements of exchanges, or guarantees of future funding."],
      ["Treasury referenda in practice", "The whitepaper defines small_spender (up to 200,000 NUMN per transaction), medium_spender (up to 1,000,000 NUMN) and big_spender (up to 10,000,000 NUMN) tracks, each with different decision rules. A referendum submission requires a qualified on-chain identity and a 5 NUMN submission deposit; the relevant track may have additional decision deposits. Community votes determine outcomes. The prime key retains limited safety-related rejection powers, so governance control should not be confused with a claim that all administrative powers have already been decentralized."],
      ["5% · Launch airdrop (50 million NUMN)", "The whitepaper reserves 50 million NUMN for registered recipient addresses as a launch distribution, with linear vesting beginning at genesis and running for approximately two years. Vested transfers release each recipient's allocation progressively: the unlocked part can be spent, while the locked part cannot be transferred, used for deposits or used to pay fees. At the end of the vesting period, the scheduled allocation should be fully unlocked, subject to the actual vesting schedule and successful distribution."],
      ["Who received the airdrop?", "The project describes the launch airdrop as a proportional distribution to eligible former 3DPass holders, based on a defined snapshot and registration process. That historical eligibility description is project-provided context, not specified in whitepaper v1.1, which only states that registered addresses receive vested transfers. Eligibility, the snapshot formula and individual balances should be verified against official registration records and on-chain data."],
      ["Does the airdrop unlock 8 NUMN every block?", "The whitepaper does not specify a network-wide fixed release of 8 NUMN per block. It specifies per-recipient linear vesting over approximately two years. The amount released per block depends on the particular vesting schedules and total allocation; it must not be confused with the miner reward of 16 NUMN per block. A claim of 8 NUMN unlocked per block would require separate confirmation from genesis vesting data or implementation code."],
      ["40% · Proof of Scan mining (400 million NUMN)", "The remaining 400 million NUMN are not all available at launch. They are issued over time to miners who produce valid PoScan blocks. The initial block reward is 16 NUMN for a winning block, paid to its block author. At the approximately 10-second target interval, that corresponds to about 8,640 blocks and 138,240 newly issued NUMN per day before any halving, assuming the target cadence is met. Actual production can differ."],
      ["Halving: new supply slows over time", "Every 12,500,000 blocks — approximately four years at the target 10-second spacing — the mining subsidy halves: 16 → 8 → 4 → 2 → 1 NUMN per block, continuing to decline. The geometric schedule approaches a total of 400 million mined NUMN. Together with the 600 million genesis issuance, supply approaches the one-billion ceiling without an unlimited tail emission."],
      ["Who receives transaction fees?", "For ordinary Substrate transaction fees and EVM base fees, 20% goes to the block author and 80% to the community treasury. Transaction tips go fully to the block author. No portion is automatically burned under the published monetary policy. Validators receive neither a protocol block reward nor a staking yield under the current design."],
      ["Is NUMN inflationary or deflationary?", "NUMN is currently increasing in total issued supply as miners earn newly minted rewards, so it is not a deflationary token. Its issuance rate is disinflationary because scheduled halvings reduce the number of new tokens per block. Treasury grants and airdrop vesting may increase liquid supply without minting new tokens; validator and governance locks may reduce liquid supply temporarily without burning tokens. A fixed maximum supply is not a promise of price appreciation."],
      ["Read the source and verify decisions", "The monetary rules above are drawn from whitepaper v1.1, especially sections 10–12. Grant categories are illustrative, and 3DPass airdrop eligibility is additional project context. For actual treasury payments, referendum results, balances, and vesting status, consult the live Numen explorer and on-chain governance data rather than assuming that a proposal has been approved."]
    ]
  },
  "governance": {
    "eyebrow": "On-chain decisions",
    "title": "Governance and treasury",
    "lead": "OpenGov referenda, public treasury spending and the deliberately limited prime authority.",
    "readTime": "8–10 min",
    "paper": "12–13",
    "sections": [
      [
        "OpenGov and treasury",
        "The whitepaper describes on-chain referenda, treasury proposals, bounties and community oversight. Treasury funds are not a founder-owned wallet."
      ],
      [
        "No sudo",
        "Numen removes the unrestricted sudo superuser. Root-level changes require governance processes rather than a hidden unilateral balance-transfer key."
      ],
      [
        "Prime is not powerless",
        "A designated prime authority retains specified administrative gates and emergency or upgrade-related powers. It cannot directly transfer treasury or user funds, but these privileges still create a centralization tradeoff."
      ],
      [
        "Deliver, then pay",
        "The treasury culture described in the paper prioritizes public work, deliverables and accountable grants instead of opaque discretionary distributions."
      ],
      [
        "Decentralization as a path",
        "Governance can evolve the privileged arrangements over time. Calling the launch configuration fully permissionless in every role would misrepresent the documented validator admission rules."
      ]
    ]
  },
  "evm": {
    "eyebrow": "Developers",
    "title": "EVM and accounts",
    "lead": "Ethereum-compatible smart contracts on a Substrate-based Layer 1.",
    "readTime": "7–9 min",
    "paper": "9–10",
    "sections": [
      [
        "Frontier compatibility",
        "Frontier provides pallet-evm and pallet-ethereum, supporting Ethereum RPC, Solidity applications and familiar development tools such as MetaMask, Hardhat and Foundry."
      ],
      [
        "Native NUMN ERC-20 facade",
        "The native token has an ERC-20-compatible precompile. The paper describes balance and transfer functionality, cross-VM withdrawal, WETH9-style deposit semantics and EIP-2612 permit."
      ],
      [
        "Separate account features",
        "Substrate accounts support multisig, scoped proxies, batching, on-chain identity and vesting. These are chain-level primitives distinct from deployed EVM applications."
      ],
      [
        "Build with care",
        "EVM compatibility does not imply that any specific DEX, bridge, token or NFT marketplace is live or audited. Verify contracts, deployments and RPC configuration before handling assets."
      ]
    ]
  },
  "mining": {
    "eyebrow": "Participate",
    "title": "Mining and block production",
    "lead": "Built-in and external PoScan mining, tasks, submissions and verification.",
    "readTime": "7–9 min",
    "paper": "4.1, 8",
    "sections": [
      [
        "Permissionless block authorship",
        "A node configured with a miner address can compete to produce PoScan blocks. Rewards are paid to the address committed to the candidate block."
      ],
      [
        "Built-in mining",
        "The --miner <SS58> flag enables the mining RPC, while --node-miner [threads] adds an in-process nonce search. The paper describes built-in mining as useful for tests and benchmarks."
      ],
      [
        "External mining",
        "External CPU/GPU miners can obtain tasks with mining_getTask, subscribe through mining_subscribeTask and return candidates using mining_submitSeal."
      ],
      [
        "Tasks and stale work",
        "The node produces a task roughly once per second and retains up to 256 tasks. When the best chain head changes, stale tasks are cleared and outdated pre-hashes rejected."
      ],
      [
        "Trustless verification",
        "The node replays every submitted PoScan seal and recalculates difficulty from the parent chain state. A worker cannot redirect the configured author reward."
      ],
      [
        "Risk and economics",
        "The protocol makes no FPGA/ASIC resistance guarantee. Mining profitability depends on competitive hashrate, electricity, hardware, difficulty and market conditions."
      ]
    ]
  },
  "security": {
    "eyebrow": "Protocol boundaries",
    "title": "Security and limitations",
    "lead": "Read the explicit tradeoffs, known risks and non-goals before relying on the protocol.",
    "readTime": "8–10 min",
    "paper": "14–16",
    "sections": [
      [
        "Consensus is not object recognition",
        "PoScan is designed for geometric labour, not physical asset authenticity. Similar-shape recognition, manufacturing certification and real-world identity are expressly excluded from consensus claims."
      ],
      [
        "Floating-point determinism",
        "The scan uses floating-point geometry, so platform-level determinism is security-critical. The paper describes software math, pinned RNG and golden anchor tests."
      ],
      [
        "Validator admission",
        "Early finality validators are invited and identity-bearing. This is a real governance and centralization limitation, even while PoW mining remains open."
      ],
      [
        "Hardware specialization",
        "Version 1 does not target FPGA or ASIC resistance. The work may be accelerated by specialized hardware."
      ],
      [
        "Audit status",
        "The September 2026 v1.1 whitepaper states no independent third-party security audit had been performed. Do not interpret a technical whitepaper as an audit."
      ],
      [
        "Operational and application risks",
        "Node outages, finality stalls, software defects, bridge risks, contract vulnerabilities and off-chain tokenization oracles are separate issues requiring their own controls."
      ]
    ]
  },
  "glossary": {
    "eyebrow": "Reference",
    "title": "Glossary",
    "lead": "A practical vocabulary for reading Numen technical documentation.",
    "readTime": "4–6 min",
    "paper": "17",
    "sections": [
      [
        "PoScan",
        "Proof of Scan: the consensus work function requiring deterministic generation and spectral scanning of a chain-chosen 3D mesh."
      ],
      [
        "pre_hash",
        "The candidate block header hash before the PoW seal, committing to the parent and block author."
      ],
      [
        "Nonce",
        "The changing mining input from which a fresh geometric seed is derived."
      ],
      [
        "spectral3d",
        "The geometric feature-extraction pipeline used to compute the 23-dimensional shape spectrum."
      ],
      [
        "GRANDPA",
        "A Byzantine-fault-tolerant voting gadget that finalizes a prefix of the blockchain."
      ],
      [
        "ASERT",
        "An exponential difficulty-adjustment mechanism anchored to an absolute time-and-height schedule."
      ],
      [
        "Finality",
        "The point after which a block cannot be reorganized without violating the BFT safety assumptions."
      ],
      [
        "Prime",
        "A limited but privileged administrative origin documented in the whitepaper; it is not a sudo account."
      ]
    ]
  }
};
