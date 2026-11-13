// Light/dark switch
(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#16110a' : '#fffcf3');
  }

  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });

  sync();
})();

// intro
(function () {
  var boot = document.getElementById('boot');
  if (!boot) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; } catch (e) {}

  if (seen || reduceMotion) { boot.remove(); return; }

  boot.classList.add('show');
  boot.removeAttribute('aria-hidden');
  try { sessionStorage.setItem('booted', '1'); } catch (e) {}

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    boot.classList.add('hide');
    setTimeout(function () { boot.remove(); }, 320);
  }

  document.getElementById('boot-skip').addEventListener('click', finish);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter') { finish(); document.removeEventListener('keydown', onKey); }
  });
  setTimeout(finish, 3200);
})();

// Slides popup
(function () {
  var dialog = document.getElementById('slides');
  var openBtn = document.getElementById('open-slides');
  if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;

  var TOTAL = 13;
  var index = 1;
  var img = document.getElementById('slide-img');
  var count = document.getElementById('slide-count');

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function show(n) {
    index = ((n - 1 + TOTAL) % TOTAL) + 1;
    img.src = 'assets/slides/slide-' + pad(index) + '.jpg';
    img.alt = 'Slide ' + index + ' of ' + TOTAL;
    count.textContent = index + ' / ' + TOTAL;
  }

  openBtn.addEventListener('click', function () { show(1); dialog.showModal(); });
  document.getElementById('close-slides').addEventListener('click', function () { dialog.close(); });
  document.getElementById('prev-slide').addEventListener('click', function () { show(index - 1); });
  document.getElementById('next-slide').addEventListener('click', function () { show(index + 1); });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  // Clicking the dark backdrop closes it
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
})();

// Email copy
(function () {
  var button = document.getElementById('copy-email');
  var email = document.getElementById('contact-email');
  if (!button || !email) return;

  button.addEventListener('click', function () {
    var address = email.textContent.trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).then(function () {
        button.textContent = 'Copied';
        setTimeout(function () { button.textContent = 'Copy'; }, 2000);
      });
    } else {
      window.location.href = 'mailto:' + address;
    }
  });
})();

// Goatcounter view count (probably faulty)
window.addEventListener('load', function () {
  var label = document.querySelector('.view-text');
  if (!label) return;
  fetch('https://cadunlea.goatcounter.com/counter/.json')
    .then(function (r) { if (!r.ok) throw new Error('no counter'); return r.json(); })
    .then(function (data) {
      var count = data.count || data.count_unique || 0;
      label.textContent = '· ' + Number(String(count).replace(/\D/g, '')).toLocaleString() + ' views';
    })
    .catch(function () { label.textContent = ''; });
});
