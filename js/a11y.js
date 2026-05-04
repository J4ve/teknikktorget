/* TeknikkTorget — a11y.js
   Toolbar wiring + persisted prefs (font scale, contrast, motion, audio).
   Blueprint §6.2. */

(function () {
  'use strict';
  const TT = window.TT;
  const KEY = 'tt_a11y';

  const defaults = { font: 16, contrast: 'normal', motion: 'normal', audio: 'on' };
  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return { ...defaults }; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  function apply(s) {
    document.body.dataset.ttFont     = s.font;
    document.body.dataset.ttContrast = s.contrast;
    document.body.dataset.ttMotion   = s.motion;
    document.body.dataset.ttAudio    = s.audio;
  }

  function chime(type) {
    if (load().audio !== 'on') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = type === 'error' ? 220 : 660;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  function bind() {
    const tb = document.getElementById('tt-a11y-toolbar');
    if (!tb) return;
    const s = load();
    apply(s);

    tb.querySelectorAll('.size').forEach(b => {
      b.classList.toggle('is-active', +b.dataset.font === +s.font);
      b.addEventListener('click', () => {
        const nx = load();
        nx.font = +b.dataset.font;
        apply(nx); save(nx);
        tb.querySelectorAll('.size').forEach(x => x.classList.toggle('is-active', x === b));
        TT.announce('Text size set to ' + b.textContent);
      });
    });
    const cb = id => tb.querySelector('#' + id);
    cb('tt-cb-contrast').checked = s.contrast === 'high';
    cb('tt-cb-motion').checked   = s.motion === 'reduced';
    cb('tt-cb-audio').checked    = s.audio === 'on';

    cb('tt-cb-contrast').addEventListener('change', e => {
      const nx = load(); nx.contrast = e.target.checked ? 'high' : 'normal'; apply(nx); save(nx);
      TT.announce('High contrast ' + (e.target.checked ? 'on' : 'off'));
    });
    cb('tt-cb-motion').addEventListener('change', e => {
      const nx = load(); nx.motion = e.target.checked ? 'reduced' : 'normal'; apply(nx); save(nx);
      TT.announce('Reduced motion ' + (e.target.checked ? 'on' : 'off'));
    });
    cb('tt-cb-audio').addEventListener('change', e => {
      const nx = load(); nx.audio = e.target.checked ? 'on' : 'off'; save(nx);
      TT.announce('Audio cues ' + (e.target.checked ? 'on' : 'off'));
    });

    document.querySelectorAll('[data-tt-a11y-toggle]').forEach(btn =>
      btn.addEventListener('click', () => tb.classList.toggle('is-open'))
    );
    document.addEventListener('click', (e) => {
      if (!tb.classList.contains('is-open')) return;
      if (tb.contains(e.target)) return;
      if (e.target.closest('[data-tt-a11y-toggle]')) return;
      tb.classList.remove('is-open');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    apply(load());                    // apply early
    if (TT?.mountA11yToolbar) TT.mountA11yToolbar();
    bind();
    document.addEventListener('tt:cart-changed', () => chime('success'));
  });
})();
