# Numen Network Website 1.0

Official-style community website for Numen Network. English-only content.

## Run locally

Requirements: Node.js 18 or newer. No npm dependencies required.

```bash
npm run check
npm run build
npm run dev
```

Open the local address printed by the server. Publish the **dist/** directory to a static host. `npm run build` regenerates all pages.

## Maintain

- `src/styles/site.css`: **single consolidated stylesheet**. Its original sections are marked by comment headings; new shared overrides are at the bottom.
- `src/config/navigation.js`: header/footer menu labels and URLs.
- `src/config/network.js`: network settings, official links, team and roadmap.
- `src/config/pages.js` and `src/config/learn.js`: content and educational pages.
- `src/pages/home.js`: homepage layout and sections.
- `src/main.js`: site shell, header behavior, route rendering, CTA HTML and theme toggle.
- `src/features/poscan/asteroid.js`: educational animation (not a live miner or physical-object verifier).
- `scripts/build.mjs`: static prerendering, sitemap and SEO metadata.

## Design / product safeguards

- Hero CTAs: Create Wallet → Start Mining → Buy NUMN. Labels are escaped; arrows are separate HTML nodes.
- Desktop header supports hover and click, Escape and outside click; mobile navigation uses native `<details>`.
- No search field, locale selector or FAQ navigation item.
- PoScan computes deterministic protocol-generated asteroids. It does **not** scan or certify real-world objects.
- Tokenization use cases are proposals, not deployed products or guaranteed legal ownership.
- Wallet security: never share seed phrases.

## Release checks

Run `npm run check && npm run build`. Test the generated site at 320, 375, 768, 1280 and 1440 px in Chrome and Firefox; verify dropdown hover/click, mobile menu, keyboard focus, all CTAs, theme switching, and external links. A successful build does not replace real browser/device testing.
