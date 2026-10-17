(function () {
  function labelFor(pub, now) {
    var diff = now - pub;
    if (isNaN(diff) || diff < 0) return null;
    var minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
    return null;
  }
  document.querySelectorAll("time.wps-pubdate").forEach(function (el) {
    var pub = new Date(el.getAttribute("datetime"));
    var label = labelFor(pub, new Date());
    if (label) el.textContent = label;
  });
})();
