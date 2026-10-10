<<<<<<< HEAD
# Numen Network Website — v1.0.0

Official website source. English is the canonical source language.

## Quick start

```bash
npm ci
npm run dev
```

Build production-ready static pages:

```bash
npm run check
npm run build
npm run preview
```

Deploy the **generated `dist/` directory** to any static host (GitHub Pages needs appropriate base-path/SPA routing, so a custom domain or a host supporting clean URLs is recommended).

## Structure

- `src/config/` — navigation, site pages, network links, ecosystem content
- `src/features/poscan/` — interactive educational animations
- `src/features/i18n/` — language selection and in-page translation
- `src/styles/main.css` — base styles; `responsive.css` — mobile overrides
- `src/pages/` — separate homepage, ecosystem, learning, participation, and FAQ/use-case templates
- `src/main.js` — shared rendering, navigation and UI event handlers
- `scripts/build.mjs` — pre-rendering and static production build
- `public/` — static images, whitepaper, and public assets

## Languages

Language selection translates **within the current page**. The default public MyMemory API is free, rate-limited, and cannot guarantee full translation of long pages. For reliable 20-language production translation, deploy your own licensed translation backend and set `window.NUMEN_TRANSLATE_ENDPOINT` before `/assets/app.js` is loaded. Never put a private translation API key in client-side code. English is always available offline. Translation does not alter canonical SEO URLs.

# www.numen-network.org
>>>>>>> origin/master
