# WPS Security

## What this site is

WPS - What People Say is a static website: HTML + CSS only.
No backend, no database, no login, no forms, no JavaScript, no user input,
no cookies, no trackers, no external fonts, no external scripts.

Live site: https://whatpeoplesay.github.io/wps/
Repo: https://github.com/whatpeoplesay/wps

## What is protected

- No data to steal: there are no passwords, API keys, user accounts, or
  private data in the repo or on the site. Secrets scan must stay clean.
- No hackable backend: there is no server code, no database, no SQL,
  no login flow, so SQL injection, server takeover, and credential theft
  have no target here.
- No user input: there are no forms, inputs, comments boxes, or search
  endpoints, so stored/reflected XSS via input has no entry point.
- Transport: GitHub Pages serves the site over HTTPS. Do not link
  `http://` resources. Mixed content must stay at zero.
- Content Security Policy: every HTML page carries a CSP meta tag:
  `default-src 'self'`, `img-src 'self' data:`,
  `style-src 'self' 'unsafe-inline'`, `script-src 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`,
  `frame-ancestors 'none'`. No script can run, the site cannot be
  framed by another site, and no form can submit anywhere.
- Referrer: `no-referrer` meta on every page, so page URLs are not
  leaked to other sites via referrer headers.
- Infrastructure: GitHub Pages provides HTTPS, TLS, and DDoS
  protection at the platform level. WPS does not run its own server.
- Copyright: every page footer states
  "© 2026 WPS - What People Say. All rights reserved."

## Honest limits: what cannot be made uncopyable

Frontend HTML and CSS cannot be made uncopyable. Any website's HTML/CSS
can be viewed with View Source or DevTools in any browser, including BBC
and every other news site. Making the repo private does not change this:
the browser still receives the same HTML/CSS to render the page.

What a private repo would hide is the repo history and the convenience
of cloning the whole project at once. The WPS repo stays public because
free GitHub Pages requires a public repo. If the repo is ever moved to
a host that serves Pages from a private repo (for example Cloudflare
Pages or Netlify), the repo can go private without changing this
limit: the rendered HTML/CSS will still be visible in the browser.

Brand, domain, content, and reputation cannot be copied by copying
HTML/CSS. The code is a layout; the value is the news selection,
the rewrite, the verified comments, and the WPS name.

## What is NOT claimed

- WPS is not claimed to be "100% unhackable". No site can claim that.
- The code is not claimed to be uncopyable. See the limits above.
- GitHub, the browser, and the reader's device are outside WPS control.
  WPS controls only its own files: no secrets, no backend, no scripts,
  no external resources, HTTPS-only links.

## Manual recommendations (not applied by API)

- Keep two-factor authentication on for the GitHub account.
- Keep the GitHub token scoped to only what it needs (Contents
  read/write on this repo) and rotate it if it is ever exposed.
- Do not enable branch protection that blocks the publishing flow
  without first testing it. If branch protection is wanted, enable
  it manually in repo Settings and verify a push still works.
- Never paste passwords, tokens, or keys into chat, files, or issues.

## Daily security checklist

- [ ] No secrets in any changed file (scan before push).
- [ ] No `<script>`, no event handlers, no `javascript:` URLs.
- [ ] No `http://` links, no external `https://` resources.
- [ ] No forms, inputs, iframes.
- [ ] CSP meta present on every changed HTML page.
- [ ] Live homepage + 1 article return 200 over HTTPS.
