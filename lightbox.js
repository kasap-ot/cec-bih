(() => {
  const $ = (id) => document.getElementById(id);

  let index = 0, count = 0, controlsBound = false;

  function ensureDom() {
    const need = ['lightbox','lbStrip','lbPrev','lbNext','lbClose'];
    const miss = need.filter(id => !$(id));
    if (miss.length) {
      console.warn('Lightbox missing:', miss.join(', '));
      return false;
    }
    return true;
  }

  function bindControlsOnce() {
    if (controlsBound || !ensureDom()) return;
    $('lbPrev').addEventListener('click', () => step(-1));
    $('lbNext').addEventListener('click', () => step(1));
    $('lbClose').addEventListener('click', close);
    $('lightbox').addEventListener('click', (e) => { if (e.target === $('lightbox')) close(); });
    window.addEventListener('keydown', (e) => {
      if (!$('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
    // basic swipe
    let sx=null, sy=null; const TH=50;
    $('lightbox').addEventListener('touchstart', e => { sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
    $('lightbox').addEventListener('touchend', e => {
      if (sx==null) return;
      const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
      if (Math.abs(dx)>Math.abs(dy) && Math.abs(dx)>TH) step(dx<0?1:-1);
      sx=sy=null;
    }, {passive:true});
    controlsBound = true;
  }

  function render() { $('lbStrip').style.transform = `translateX(${-index * 100}vw)`; }
  function step(dir) { index = (index + dir + count) % count; render(); }

  function openWithTrack(trackEl, startIndex) {
    if (!ensureDom()) return;

    const imgs = trackEl.querySelectorAll('img');
    if (!imgs.length) return;

    const strip = $('lbStrip');
    strip.innerHTML = '';
    Array.from(imgs).forEach(img => {
      const el = document.createElement('img');
      el.src = img.currentSrc || img.src;
      el.alt = img.alt || '';
      el.decoding = 'async';
      el.loading = 'eager';
      strip.appendChild(el);
    });

    count = imgs.length;
    index = Math.max(0, Math.min(startIndex, count - 1));

    $('lightbox').classList.add('open');
    $('lightbox').setAttribute('aria-hidden','false');
    document.body.classList.add('lb-no-scroll');
    render();
  }

  function close() {
    $('lightbox').classList.remove('open');
    $('lightbox').setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-no-scroll');
  }

  // -------- PUBLIC API --------
  // 1) Call once after lightbox.html is injected -> sets up click wiring
  window.setupLightboxOnDemand = function setupLightboxOnDemand(carouselSelector = '.carousel-track') {
    bindControlsOnce();

    // Add a click handler to each carousel track; when an <img> is clicked:
    document.querySelectorAll(carouselSelector).forEach(track => {
      // Avoid double-binding
      if (track.dataset.lbBound) return;
      track.dataset.lbBound = '1';

      track.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (!img || !track.contains(img)) return;
        const all = Array.from(track.querySelectorAll('img'));
        const startIdx = all.indexOf(img);
        openWithTrack(track, startIdx);
      });
    });
  };

  // 2) Optional: direct open from your own code
  window.openLightboxFrom = function openLightboxFrom(trackIdOrEl, startIndex = 0) {
    const el = typeof trackIdOrEl === 'string'
      ? document.getElementById(trackIdOrEl) || document.querySelector(trackIdOrEl)
      : trackIdOrEl;
    bindControlsOnce();
    if (el) openWithTrack(el, startIndex);
  };
})()
