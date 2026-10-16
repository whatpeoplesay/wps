// WPS category pagination — 15 stories per page, newest first.
//
// Cards are sorted by <time datetime> (newest first), then sliced into pages
// of 15. Page buttons are real links (?page=N) so pages are shareable and
// work with a plain static host. With 15 or fewer stories, no page buttons
// are shown. Runs on category pages only (script order: last).
(function () {
  var PER_PAGE = 15;

  function init() {
    var list = document.querySelector('.category-list');
    if (!list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll('.category-card'));
    if (!cards.length) return;

    // Newest first by <time datetime>; stable sort keeps file order on ties.
    cards.sort(function (a, b) {
      var ta = a.querySelector('time');
      var tb = b.querySelector('time');
      var da = ta ? ta.getAttribute('datetime') || '' : '';
      var db = tb ? tb.getAttribute('datetime') || '' : '';
      if (db !== da) return db < da ? -1 : 1;
      return 0;
    });
    cards.forEach(function (c) { list.appendChild(c); });

    var params = new URLSearchParams(window.location.search);
    var page = parseInt(params.get('page') || '1', 10);
    var total = Math.ceil(cards.length / PER_PAGE);
    if (isNaN(page) || page < 1) page = 1;
    if (page > total) page = total;

    cards.forEach(function (c, i) {
      c.style.display = (i >= (page - 1) * PER_PAGE && i < page * PER_PAGE) ? '' : 'none';
    });

    var nav = document.querySelector('.pagination');
    if (nav && total > 1) {
      var html = '';
      if (page > 1) html += '<a href="?page=' + (page - 1) + '">&lt; Prev</a>';
      for (var p = 1; p <= total; p++) {
        if (p === page) html += '<span aria-current="page">' + p + '</span>';
        else html += '<a href="?page=' + p + '">' + p + '</a>';
      }
      if (page < total) html += '<a href="?page=' + (page + 1) + '">Next &gt;</a>';
      nav.innerHTML = html;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
