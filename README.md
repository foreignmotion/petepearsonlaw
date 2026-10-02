# Pete Pearson Law — website

Static two-page marketing site for Pete Pearson Law (Georgia personal injury attorney): `/` and `/about/`.
Plain HTML + one stylesheet, no framework and no build step required to deploy.

## Structure

```
index.html              homepage
about/index.html        About the Attorney (served at /about/)
assets/css/site.css     the only stylesheet; design tokens from the handoff are at the top
assets/js/menu.js       mobile menu toggle (the only script)
assets/img/             optimized images (generated, see below)
favicon-32.png, icon-192.png, apple-touch-icon.png
robots.txt, sitemap.xml
source-assets/          original handoff images + tokens.css (not referenced by the pages)
scripts/build-images.mjs  regenerates assets/img from source-assets
```

Deploy the repo root as-is to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3…).
Asset paths are root-relative (`/assets/...`), so the site must be served from the domain root.
`source-assets/`, `scripts/` and `package*.json` don't need to be public but are harmless if they are.

## Local preview

```bash
npm run serve
```

Then open http://localhost:4321. (Opening the HTML files directly with `file://` won't load assets.)

## Images

The portrait ships as AVIF and WebP at 360–1200px wide with a palette-PNG fallback, chosen per breakpoint by `srcset`/`sizes`
(about 8–36 KB as AVIF vs. the 2.5 MB original). The Open Graph card (`assets/img/og-image.jpg`) and favicons are generated too.
After replacing anything in `source-assets/`:

```bash
npm install
npm run images
```

## Implementation notes

- Layout follows the 1440 and 390 comps; between them, type and spacing scale fluidly (`clamp()`), and grids collapse per
  `DESIGN.md`: header switches to the compact icon header below 1200px, the hero/about opener stack below 1000px, other
  two- and three-column sections stack below 1100px. The sticky Text/Call bar shows below 768px.
- Mobile hero buttons read "Text Pete" / "Call Pete" as in the mobile comp; from 768px up they read
  "Text Attorney Pete >>" / "Call Attorney Pete >>".
- The About page opener deck is shown on mobile too (the mobile comp omits it; COPY.md lists it).
- Fonts load from Google Fonts without blocking render (`display=swap`).
- Checked: axe-core — no violations on either page at 390 and 1440. Lighthouse (local) — 99–100 in all four categories,
  mobile and desktop, on both pages.

## Before launch — needs the client

- Footer small print: attorney-advertising disclaimer, privacy policy link, office address (placeholder text is in both pages' footers).
- Avvo badge and LinkedIn icon artwork (mono text links stand in for them now).
- A second photo of Pete for the homepage "about" panel (currently reuses the portrait).
- Once there's an office address, add it to the `Attorney` JSON-LD in `index.html`.
- Confirm the production domain is `https://petepearsonlaw.com` (used in canonical URLs, Open Graph tags, JSON-LD and the sitemap).
