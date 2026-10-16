# WPS - What People Say

US news first, then big international news, with top public reactions.
BBC-style layout, professional simple minimal, pure black / white only.
Static HTML + CSS only. No JavaScript, no external fonts, no trackers,
no forms, no data collection.

## Structure
- `index.html` - homepage (header, hero 2-column on desktop, hero-side stack,
  text-only cards, US / World / Politics / Business / Technology / Culture
  sections each 1 large + 2-3 small, Most Read side rail on desktop,
  Recommended Audio, footer)
- `articles/` - one HTML file per story, e.g. `articles/2026-10-16-slug.html`.
  Template: `articles/sample.html`
- `images/` - article images, compressed. Naming: `YYYY-MM-DD-slug-01.jpg`
- `assets/css/style.css` - all styles, mobile-first responsive.
  Mobile: single-column vertical. Desktop (>= 760px): hero 2-column,
  sections 1 large + small stack, Most Read side rail.
- `wps-preview.html` - single-file copy of the homepage with CSS inlined,
  for previewing/sharing. Regenerate after any homepage/CSS change:
  see "Regenerate preview" below.

## Article pattern
Headline, image, date/source, body in own words (facts only, no copy,
no personal commentary), then a `What People Say` box with the top 4-5
real most-engaged comments (platform + name + likes + source link).
No invented comments. No hateful/abusive comments.

## How to add a new article
1. Copy `articles/sample.html` to `articles/YYYY-MM-DD-slug.html`.
2. Replace: headline, `<time datetime>`, section, byline, source line,
   image placeholder with a real compressed image from `images/`,
   body paragraphs (own words), and the 4 comments with real comments
   (platform + name + likes + source link). Keep the Related links
   pointing at real articles, or at `sample.html` while drafting.
3. On `index.html`, add a card linking to the new file: hero, hero-side,
   a section card, or Most Read. Every homepage card must link to a
   real article file. Update the section "See more" links as needed.
4. Regenerate `wps-preview.html` (below) and commit.

## Regenerate preview
From `~/workspace/wps/`:
`python3 -c "import pathlib; h=pathlib.Path('index.html').read_text(); c=pathlib.Path('assets/css/style.css').read_text(); pathlib.Path('wps-preview.html').write_text(h.replace('<link rel=\"stylesheet\" href=\"assets/css/style.css\">','<style>'+c+'</style>'))"`

## Mapping (every card opens its article)
Logo -> homepage. Nav / footer nav -> homepage sections.
Hero, hero-side, text-only, section, Most Read, Audio, Related cards
-> their article page. Section headers / "See more" -> a real article
page in this skeleton (section index pages later).

## Branding
Logo: 3 black squares W P S + "What People Say" tagline.
Colors: Black #000000, White #FFFFFF, grey for meta only (#555, #e5e5e5, #f5f5f5).
Fonts: Headlines/UI bold sans-serif (Arial/Helvetica), article body serif (Georgia).

## Hosting
Free: GitHub Pages (repo + Pages setup pending - token scope blocked
2026-10-16, see project notes).
Local: open `index.html` in a browser, or serve with `python3 -m http.server`.
