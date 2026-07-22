# Eleventy setup for quanzhen.sg — full conversion

This is a **delta package** — only new or changed files. Your `css/interactions.css`,
`js/`, `assets/`, `admin/config.yml`, `admin/index.html`, `privacy.html`, and
`terms.html` are untouched and don't need to be replaced.

## 1. Files to add/replace in your repo root

```
package.json            → new (Eleventy + luxon)
.eleventy.js             → new (build config)
_includes/layout.njk     → new (shared nav + footer)

index.njk                → new — DELETE index.html
events.njk                → new — DELETE events.html
about.njk                 → new — DELETE about.html
tradition.njk              → new — DELETE tradition.html
services.njk               → new — DELETE services.html
join.njk                    → new — DELETE join.html
contact.njk                  → new — DELETE contact.html
learn.njk                     → new — DELETE learn.html
gallery.njk                    → new — DELETE gallery.html

content/events/*.md      → new (3 sample events, migrated from your old hardcoded ones)
content/articles/         → new, empty folder (ready for the CMS to populate)
content/gallery/           → new, empty folder (ready for the CMS to populate)

css/style.css             → replace (2 small additive rules at the bottom only —
                             diff it if you want to confirm nothing else changed)
```

**privacy.html and terms.html were not converted** — their content wasn't in
what you shared with me, so I left them as plain static files. They'll
continue to work exactly as before; nothing to do here unless you want them
converted too later.

## 2. Install and test locally (optional but recommended)

```bash
npm install
npm run serve
```
Opens a local dev server (usually http://localhost:8080) that rebuilds on save.

## 3. Cloudflare Pages build settings

- **Build command:** `npm run build`
- **Build output directory:** `_site`
- **Root directory:** `/`
- Environment variable `NODE_VERSION` = `20`

Push to `main` — Cloudflare rebuilds automatically on every commit, including
every commit Decap CMS makes when someone saves an entry through `/admin`.

## 4. What's now dynamic vs. what's still static

| Page | Status |
|---|---|
| `index.html` | Dynamic — homepage event teaser pulls from `content/events/` |
| `events.html` | Dynamic — "Next Occurrences" panel pulls from `content/events/`; the recurring-schedule descriptions (Lidou, Sunday classes, Zhong Yuan, Taisui) are left as static reference text since they don't change often |
| `learn.html` | Dynamic — Articles section pulls from `content/articles/`, with the original "coming soon" preview shown as a fallback while that folder is empty. Scripture Introductions section is static reference content (no CMS collection for it) |
| `gallery.html` | Dynamic — album grid pulls from `content/gallery/`, same fallback pattern. Filter tabs and the lightbox work identically whether albums are real or placeholder |
| `about.html`, `tradition.html`, `services.html`, `join.html`, `contact.html` | Converted to the shared layout (nav/footer no longer duplicated 9 times), but their content is still static — no CMS collections exist for committee members, lineage info, or service listings today |
| `privacy.html`, `terms.html` | Untouched, plain static files |

## 5. Using it day-to-day

- **New event / changed date:** `/admin` → Events → add/edit entry. Shows up on the homepage teaser and the events "Next Occurrences" panel.
- **New article:** `/admin` → Articles → add entry. As soon as the first one is published, the Learn page automatically switches from the "coming soon" preview to showing real articles (no template changes needed).
- **New photo album:** `/admin` → Gallery Albums → add entry with a cover photo and a list of photos. Same auto-switch behaviour on the Gallery page.

No codespace required for any of this going forward.

## 6. Known gaps / fast-follow items

- **Articles link to `#`.** There's no individual article detail page yet — clicking an article card doesn't currently go anywhere new. Building that out (one `article.njk` template + a permalink per article) is a natural next step once you're ready to publish real articles.
- **`contact.html`'s general enquiry form button was already broken before this conversion** — its `href` was still the placeholder text `YOUR_CONTACT_FORM_URL`, not a real Google Form link. I left it as-is (with a `TODO` comment) since I don't have the real form URL; swap it in the same way you already did for the two forms on `join.html`.
- **Bilingual event/article descriptions.** Your CMS collections don't currently capture a Chinese-language description field (only `title_cn`), so dynamically generated event, article, and gallery cards show English descriptions even on pages with a full EN/中文 toggle (currently just `index.html` and `services.html` — the other pages never had a working language toggle to begin with, just a static "EN / 中文" label). Adding `description_cn` fields to `admin/config.yml` and referencing them in the templates would close this gap if you want full bilingual parity.
- **`about.html`/`tradition.html`/`services.html`/`join.html`/`contact.html` still have hardcoded content** (committee list, lineage text, service descriptions). They now share the layout, but there's no CMS collection backing them — updating the committee roster, for example, still means editing `about.njk` directly. If that content changes often enough to be worth it, the same collection pattern used for events/articles/gallery could be extended to cover it.
