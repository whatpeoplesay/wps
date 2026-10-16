// WPS hero carousel — auto-rotates the hero through the day's top stories.
//
// Every 5 seconds the hero shows the next same-day story (fade out / fade in),
// cycling through a cross-category pool: featured story of each section first,
// then the next story of each section, and so on (max 10). Prev / next arrows
// let the reader move manually. Auto-rotation pauses while the mouse is over
// the hero, while a control has focus, or while the tab is hidden. If the user
// prefers reduced motion, stories swap instantly with no fade.
// Runs after shuffle.js (script order), so it reads the post-shuffle DOM.
// No data is collected, no network calls.
(function () {
  var INTERVAL = 5000;
  var FADE_MS = 500;
  var MAX_POOL = 10;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function todayStr() {
    var d = new Date();
    var m = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
  }

  function fmt(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function dateFromHref(href) {
    var m = (href || '').match(/articles\/(\d{4}-\d{2}-\d{2})-/);
    return m ? m[1] : null;
  }

  function read(card) {
    var img = card.querySelector('img');
    var titleEl = card.querySelector('h1, h2, h3, .side-title');
    var sumEl = card.querySelector('p');
    var section = '';
    var time = card.querySelector('time');
    if (time) {
      var sib = time.parentNode.querySelectorAll('span');
      section = sib.length ? sib[sib.length - 1].textContent : '';
    } else {
      var spans = card.querySelectorAll('.meta span');
      section = spans.length ? spans[spans.length - 1].textContent : '';
    }
    return {
      href: card.getAttribute('href'),
      imgSrc: img ? img.getAttribute('src') : null,
      imgAlt: img ? img.getAttribute('alt') : null,
      title: titleEl ? titleEl.textContent : '',
      summary: sumEl ? sumEl.textContent : '',
      date: dateFromHref(card.getAttribute('href')),
      section: section
    };
  }

  function writeHero(link, d) {
    link.setAttribute('href', d.href);
    var img = link.querySelector('img');
    if (img && d.imgSrc) {
      img.setAttribute('src', d.imgSrc);
      if (d.imgAlt !== null) img.setAttribute('alt', d.imgAlt);
    }
    var h1 = link.querySelector('h1');
    if (h1) h1.textContent = d.title;
    var p = link.querySelector('p');
    if (p) {
      p.textContent = d.summary;
      p.style.display = d.summary ? '' : 'none';
    }
    var time = link.querySelector('time');
    if (time) {
      time.setAttribute('datetime', d.date);
      time.textContent = fmt(d.date);
      var sib = time.parentNode.querySelectorAll('span');
      if (sib.length) sib[sib.length - 1].textContent = d.section;
    }
  }

  function init() {
    var heroSection = document.querySelector('.hero-layout .hero');
    if (!heroSection) return;
    var link = heroSection.querySelector('a');
    if (!link) return;
    var today = todayStr();

    // Build a cross-category pool: round-robin across groups so every
    // section's top story gets in before any section's second story.
    var groups = [];
    groups.push(document.querySelectorAll('.hero-layout a'));
    groups.push(document.querySelectorAll('.text-only-list a'));
    groups.push(document.querySelectorAll('.most-read ol a'));
    var grids = document.querySelectorAll('.section-grid');
    for (var g = 0; g < grids.length; g++) groups.push(grids[g].querySelectorAll('a'));

    var seen = {};
    var lists = [];
    for (var gi = 0; gi < groups.length; gi++) {
      var list = [];
      var cards = groups[gi];
      for (var ci = 0; ci < cards.length; ci++) {
        var d = read(cards[ci]);
        if (d.date === today && !seen[d.href]) {
          seen[d.href] = true;
          list.push(d);
        }
      }
      lists.push(list);
    }
    var pool = [];
    var round = 0;
    var added = true;
    while (pool.length < MAX_POOL && added) {
      added = false;
      for (var li = 0; li < lists.length; li++) {
        if (round < lists[li].length && pool.length < MAX_POOL) {
          pool.push(lists[li][round]);
          added = true;
        }
      }
      round++;
    }
    if (pool.length < 2) return;

    var current = 0;
    var heroHref = link.getAttribute('href');
    for (var h = 0; h < pool.length; h++) {
      if (pool[h].href === heroHref) { current = h; break; }
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) link.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    var timer = null;
    var fading = false;
    var paused = false;

    function show(idx) {
      if (fading) return;
      current = (idx + pool.length) % pool.length;
      if (reduceMotion) {
        writeHero(link, pool[current]);
        return;
      }
      fading = true;
      link.style.opacity = '0';
      setTimeout(function () {
        writeHero(link, pool[current]);
        link.style.opacity = '';
        fading = false;
      }, FADE_MS);
    }
    function next() { show(current + 1); }
    function prev() { show(current - 1); }
    function stop() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }
    function start() {
      if (timer === null) {
        timer = setInterval(function () {
          if (!paused && !document.hidden) next();
        }, INTERVAL);
      }
    }
    function restart() {
      stop();
      start();
    }

    function makeBtn(label, side, glyph) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.textContent = glyph;
      var s = b.style;
      s.position = 'absolute';
      s.top = '50%';
      s.transform = 'translateY(-50%)';
      if (side === 'prev') s.left = '10px'; else s.right = '10px';
      s.background = 'rgba(0,0,0,0.55)';
      s.color = '#fff';
      s.border = 'none';
      s.fontSize = '28px';
      s.lineHeight = '1';
      s.padding = '6px 12px';
      s.cursor = 'pointer';
      s.zIndex = '2';
      return b;
    }

    heroSection.style.position = 'relative';
    var prevBtn = makeBtn('Previous story', 'prev', '\u2039');
    var nextBtn = makeBtn('Next story', 'next', '\u203A');
    prevBtn.addEventListener('click', function () { prev(); restart(); });
    nextBtn.addEventListener('click', function () { next(); restart(); });
    heroSection.appendChild(prevBtn);
    heroSection.appendChild(nextBtn);
    heroSection.addEventListener('mouseenter', function () { paused = true; });
    heroSection.addEventListener('mouseleave', function () { paused = false; });
    heroSection.addEventListener('focusin', function () { paused = true; });
    heroSection.addEventListener('focusout', function () { paused = false; });
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
