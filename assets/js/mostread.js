// WPS Most Read — ranked by the reader's own article clicks (first-party only).
//
// Every click on a story link counts as one read for that article, stored in
// the reader's own browser (localStorage). Nothing is sent anywhere, no
// account, no tracking across sites. On each homepage load, the Most Read
// rail is rebuilt from the day's stories ranked by those counts, so the most
// read stories come forward. With no reads yet, the seeded HTML order stays.
// Runs after shuffle.js / carousel.js (script order).
(function () {
  var KEY = 'wps_read_counts';
  var MAX_SLOTS = 4;

  function todayStr() {
    var d = new Date();
    var m = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
  }

  function dateFromHref(href) {
    var m = (href || '').match(/articles\/(\d{4}-\d{2}-\d{2})-/);
    return m ? m[1] : null;
  }

  function loadCounts() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCounts(c) {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch (e) {
      // Storage unavailable (private mode) — rail keeps seeded order.
    }
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

  function writeMostRead(slot, d) {
    slot.setAttribute('href', d.href);
    var img = slot.querySelector('img');
    if (img && d.imgSrc) {
      img.setAttribute('src', d.imgSrc);
      if (d.imgAlt !== null) img.setAttribute('alt', d.imgAlt);
    }
    var h3 = slot.querySelector('h3');
    if (h3) h3.textContent = d.title;
    var span = slot.querySelector('.meta span');
    if (span) span.textContent = d.section;
  }

  function init() {
    var slots = document.querySelectorAll('.most-read ol a');
    if (!slots.length) return;

    // Count a click on any story link as one read for that article.
    document.addEventListener('click', function (e) {
      var t = e.target;
      var a = t && t.closest ? t.closest('a[href^="articles/"]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!dateFromHref(href)) return;
      var counts = loadCounts();
      counts[href] = (counts[href] || 0) + 1;
      saveCounts(counts);
    });

    // Rank the day's stories by reads; rebuild the rail.
    var today = todayStr();
    var seen = {};
    var pool = [];
    var cards = document.querySelectorAll('.hero-layout a, .section-grid a, .text-only-list a, .most-read ol a');
    for (var i = 0; i < cards.length; i++) {
      var d = read(cards[i]);
      if (d.date === today && !seen[d.href]) {
        seen[d.href] = true;
        d._order = pool.length;
        pool.push(d);
      }
    }
    var counts = loadCounts();
    var any = false;
    for (var k in counts) {
      if (counts[k] > 0) { any = true; break; }
    }
    if (!any) return; // No reads yet — keep the seeded HTML order.
    pool.sort(function (a, b) {
      var ca = counts[a.href] || 0;
      var cb = counts[b.href] || 0;
      if (cb !== ca) return cb - ca;
      return a._order - b._order;
    });
    for (var s = 0; s < slots.length && s < pool.length && s < MAX_SLOTS; s++) {
      writeMostRead(slots[s], pool[s]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
