/* TeknikkTorget — retro.js
   Retro Mode toggle: dense compact layout. Blueprint §5.6. */

(function () {
  'use strict';
  const TT = window.TT;
  const KEY = 'tt_mode';

  function get() { return localStorage.getItem(KEY) || 'modern'; }
  function set(v) {
    localStorage.setItem(KEY, v);
    document.body.dataset.ttMode = v;
    document.querySelectorAll('[data-tt-retro-toggle]').forEach(t => {
      t.setAttribute('aria-pressed', v === 'retro');
      const lbl = t.querySelector('.retro-label');
      if (lbl) lbl.textContent = v === 'retro' ? 'Modern Mode' : 'Retro Mode';
    });
    const marquee = document.getElementById('tt-retro-marquee');
    if (marquee) marquee.style.display = v === 'retro' ? 'block' : 'none';
    TT.announce(v === 'retro' ? 'Retro mode on' : 'Modern mode on');
  }

  document.addEventListener('DOMContentLoaded', () => {
    set(get());
    document.querySelectorAll('[data-tt-retro-toggle]').forEach(btn =>
      btn.addEventListener('click', () => set(get() === 'retro' ? 'modern' : 'retro'))
    );
  });
})();
