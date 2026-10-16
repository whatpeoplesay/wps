// WPS homepage random swap — same-day cards only.
//
// On every page load, the story data (link, image, title, summary, date,
// section) of SAME-DAY cards is shuffled among the same-day slots inside each
// group: hero + hero-side, each section grid (featured + small), text-only
// list, Most Read. Old / placeholder cards never move. Each refresh reloads
// the original HTML from the server, so every load starts from canonical
// order and shuffles again. No data is collected, no network calls.
(function () {
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

  // Read a card's story data. Slot markup (classes) is never changed.
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

  // Write story data back into a slot, keeping the slot's own markup.
  function write(card, d) {
    card.setAttribute('href', d.href);
    var img = card.querySelector('img');
    if (img && d.imgSrc) {
      img.setAttribute('src', d.imgSrc);
      if (d.imgAlt !== null) img.setAttribute('alt', d.imgAlt);
    }
    var titleEl = card.querySelector('h1, h2, h3, .side-title');
    if (titleEl) titleEl.textContent = d.title;
    var sumEl = card.querySelector('p');
    if (sumEl) {
      sumEl.textContent = d.summary;
      sumEl.style.display = d.summary ? '' : 'none';
    }
    var time = card.querySelector('time');
    if (time) {
      time.setAttribute('datetime', d.date);
      time.textContent = fmt(d.date);
      var sib = time.parentNode.querySelectorAll('span');
      if (sib.length) sib[sib.length - 1].textContent = d.section;
    } else {
      var spans = card.querySelectorAll('.meta span');
      if (spans.length > 1) {
        spans[0].textContent = fmt(d.date);
        spans[spans.length - 1].textContent = d.section;
      }
    }
  }

  function shuffleGroup(cards) {
    var today = todayStr();
    var slots = [];
    var data = [];
    var orig = [];
    for (var i = 0; i < cards.length; i++) {
      var d = read(cards[i]);
      if (d.date === today) {
        slots.push(cards[i]);
        data.push(d);
        orig.push(d.href);
      }
    }
    if (data.length < 2) return;
    // Fisher-Yates.
    for (var j = data.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = data[j];
      data[j] = data[k];
      data[k] = tmp;
    }
    // Guarantee a visible change: never leave the order identical.
    var same = true;
    for (var s = 0; s < data.length; s++) {
      if (data[s].href !== orig[s]) { same = false; break; }
    }
    if (same) {
      var t = data[0];
      data[0] = data[1];
      data[1] = t;
    }
    for (var w = 0; w < slots.length; w++) write(slots[w], data[w]);
  }

  function run() {
    // Hero: hero card + side cards = one group.
    shuffleGroup(document.querySelectorAll('.hero-layout .hero > a, .hero-layout .hero-side .side-card'));
    // Each section grid: featured + small cards = one group.
    var grids = document.querySelectorAll('.section-grid');
    for (var g = 0; g < grids.length; g++) {
      shuffleGroup(grids[g].querySelectorAll('a.featured-card, a.small-card'));
    }
    // Text-only list.
    shuffleGroup(document.querySelectorAll('.text-only-list a.text-only'));
    // Most Read.
    shuffleGroup(document.querySelectorAll('.most-read ol a'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
