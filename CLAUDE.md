# CLAUDE.md — petepearsonlaw.com

Rules for anyone (including Claude) editing **petepearsonlaw.com**, Pete Pearson's law-firm site. Read before editing.
Its sister site is the **Kidinjury Law Blog** (kidinjurylaw.com), repo `foreignmotion/kidinjurylaw`, usually cloned
next to this one (`../kidinjurylaw`).

## Deploy model — every edit goes live immediately

- **`main` is the live site.** Cloudflare redeploys petepearsonlaw.com automatically on every push to `main`
  (about a minute).
- **Edits are made directly on `main` and pushed right away. No branches, no pull requests, no preview step.**
  This is the owner's standing instruction for both Pete Pearson sites, from any computer. Do not ask "should I
  publish?" after a requested change — finishing the change *includes* publishing it (use `/publish`).
- The same sites are edited from **several computers**. To keep them from overwriting each other:
  - Every Claude session starts with an automatic `git pull` (SessionStart hook → `scripts/sync-on-start.sh`).
    Read its `[petepearsonlaw sync]` line and tell the user if it pulled changes or reported a problem.
  - Always `git pull --rebase` immediately before pushing (the `/publish` procedure does this).
  - **Never force-push** and never `git reset --hard` to a remote — that can erase another computer's edits.
    (Both are blocked in `.claude/settings.json`.)
  - Never end a session with unpushed or uncommitted work; it isn't live and the other computers can't see it.
- If a pull or rebase hits a **conflict** (two computers edited the same lines), stop, show the user both versions
  in plain language, and ask which to keep. Don't guess.

## Procedures

- **`/publish`** — sync, check, commit, push, confirm on the live site. Use after every change.
- **`/setup-computer`** — check/fix this computer's setup (Git, GitHub sign-in, Node, both repos cloned).
- New computer from scratch: see `SETUP-NEW-COMPUTER.md` (the user pastes one sentence into Claude).

## What this repo is

Static HTML + one stylesheet, no framework, **no build step**. Everything served is in `public/`:

```
public/index.html            homepage
public/about/index.html      About the Attorney (/about/)
public/assets/css/site.css   the only stylesheet; design tokens at the top
public/assets/js/site.js     mobile menu, show-on-scroll action bar, mobile hero fade-in
public/assets/img/           generated images (npm run images, from source-assets/)
source-assets/               originals (not deployed)
wrangler.jsonc               Cloudflare config (serves public/)
```

Preview locally: `npm run serve` → http://localhost:4322 (or the "petepearsonlaw" preview in Claude's browser pane).

## Site rules

- **Copy is the client's.** Change wording only when asked, and change exactly what was asked. Phone number
  everywhere: 678.358.2564 (`tel:+16783582564` / `sms:+16783582564`).
- **Attorney-advertising rules (Georgia):** keep the footer's "No fee until you win" disclaimer on every page.
  The office address is still to be added (required before relying on the site for advertising).
- **Shared with the blog:** the header, footer, closing call-to-action band and the base CSS (tokens, buttons,
  header, footer, closing band, action bar) are duplicated in `kidinjurylaw`. When you change one of those here,
  make the same change in `../kidinjurylaw` (`src/layouts/Base.astro`, `public/assets/css/site.css`) and publish
  both, unless the user says it's for one site only.
- Accessibility: keep visible focus rings, 44px tap targets, `aria-*` on icon buttons, alt text. Don't lighten
  text colors on slate.
- Keep `public/sitemap.xml` in sync if pages are added or removed.
