/* TeknikkTorget — main.js
   Global init: shared state, navbar search, cart store, mini-cart, welcome guide, page-agnostic helpers.
   Blueprint §4.1 (predictability), §5.1 (sticky nav), §5.5 (welcome guide), §6.1 (feedback). */

(function () {
  'use strict';

  // ---------- Shared store -----------------------------------------------
  const TT = (window.TT = window.TT || {});
  const LS_KEYS = {
    cart:     'tt_cart',
    welcome:  'tt_welcome_dismissed',
    a11y:     'tt_a11y',
    mode:     'tt_mode'
  };

  TT.formatPrice = (n) => 'kr ' + Number(n).toLocaleString('nb-NO');
  TT.priceOf = (p) => p.salePrice ? p.salePrice : p.price;

  TT.getCart = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.cart) || '[]'); }
    catch { return []; }
  };
  TT.saveCart = (cart) => {
    localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart));
    TT.updateCartBadge();
    document.dispatchEvent(new CustomEvent('tt:cart-changed'));
  };
  TT.cartCount = () => TT.getCart().reduce((s, i) => s + i.qty, 0);
  TT.cartSubtotal = () => TT.getCart().reduce((s, i) => {
    const p = TT_PRODUCTS.find(x => x.id === i.id);
    return p ? s + TT.priceOf(p) * i.qty : s;
  }, 0);

  TT.addToCart = (id, qty = 1) => {
    const product = TT_PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const cart = TT.getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    TT.saveCart(cart);
    TT.toast(`Added “${product.name}” to cart`, 'success');
    TT.announce(`${product.name} added to cart. Cart total ${TT.cartCount()} items.`);
  };
  TT.updateCartItem = (id, qty) => {
    let cart = TT.getCart();
    if (qty <= 0) cart = cart.filter(i => i.id !== id);
    else { const it = cart.find(i => i.id === id); if (it) it.qty = qty; }
    TT.saveCart(cart);
  };
  TT.removeFromCart = (id) => {
    const cart = TT.getCart().filter(i => i.id !== id);
    TT.saveCart(cart);
    TT.announce('Item removed from cart');
  };

  TT.updateCartBadge = () => {
    const total = TT.cartCount();
    document.querySelectorAll('[data-tt-cart-badge]').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  };

  // ---------- ARIA live announcements ------------------------------------
  TT.announce = (msg) => {
    let lr = document.getElementById('tt-live-region');
    if (!lr) {
      lr = document.createElement('div');
      lr.id = 'tt-live-region';
      lr.setAttribute('role', 'status');
      lr.setAttribute('aria-live', 'polite');
      document.body.appendChild(lr);
    }
    lr.textContent = '';
    setTimeout(() => { lr.textContent = msg; }, 30);
  };

  // ---------- Search autocomplete (debounced) ----------------------------
  function setupSearch() {
    const input = document.getElementById('tt-search-input');
    const dropdown = document.getElementById('tt-search-dropdown');
    if (!input || !dropdown) return;

    let activeIdx = -1;
    let matches = [];
    let timer = null;

    function highlight(text, q) {
      const i = text.toLowerCase().indexOf(q.toLowerCase());
      if (i < 0) return text;
      return text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
    }

    function render() {
      if (!matches.length) {
        dropdown.innerHTML = '<div class="p-3 text-muted small">No products match.</div>';
        return;
      }
      dropdown.innerHTML = matches.map((p, i) => `
        <a class="item ${i === activeIdx ? 'is-active' : ''}" href="catalog.html?q=${encodeURIComponent(input.value)}&open=${p.id}" role="option">
          <div class="thumb">
            ${p.img ? `<img src="${p.img}" alt="">` : `<span class="material-symbols-outlined" aria-hidden="true">${p.icon || 'box'}</span>`}
          </div>
          <div class="flex-grow-1 small">
            <div class="fw-semibold text-truncate">${highlight(p.name, input.value)}</div>
            <div class="text-muted" style="font-size:.75rem">${p.category}</div>
          </div>
          <div class="fw-bold small">${TT.formatPrice(TT.priceOf(p))}</div>
        </a>
      `).join('');
    }

    function runQuery() {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.style.display = 'none'; return; }
      matches = TT_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      ).slice(0, 5);
      activeIdx = -1;
      dropdown.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
      render();
    }

    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(runQuery, 180);
    });
    input.addEventListener('focus', () => { if (input.value) runQuery(); });
    input.addEventListener('keydown', (e) => {
      if (!matches.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % matches.length; render(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = (activeIdx - 1 + matches.length) % matches.length; render(); }
      if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); window.location.href = `catalog.html?q=${encodeURIComponent(input.value)}&open=${matches[activeIdx].id}`; }
      if (e.key === 'Escape') { dropdown.style.display = 'none'; input.setAttribute('aria-expanded','false'); }
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
        input.setAttribute('aria-expanded','false');
      }
    });
  }

  // ---------- Mini-cart drawer -------------------------------------------
  TT.openMiniCart = () => {
    renderMiniCart();
    document.querySelector('.tt-minicart')?.classList.add('is-open');
    document.querySelector('.tt-minicart-backdrop')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  TT.closeMiniCart = () => {
    document.querySelector('.tt-minicart')?.classList.remove('is-open');
    document.querySelector('.tt-minicart-backdrop')?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  function renderMiniCart() {
    const body = document.getElementById('tt-minicart-body');
    const sub  = document.getElementById('tt-minicart-subtotal');
    const cnt  = document.getElementById('tt-minicart-count');
    if (!body) return;
    const cart = TT.getCart();
    cnt.textContent = `(${TT.cartCount()})`;
    if (!cart.length) {
      body.innerHTML = `<div class="text-center text-muted py-5">
        <span class="material-symbols-outlined" style="font-size:3rem;opacity:.4">shopping_cart</span>
        <p class="mb-0 mt-2 fw-semibold">Cart is empty</p>
        <small>Browse the catalog to find your next build.</small>
      </div>`;
      sub.textContent = TT.formatPrice(0);
      return;
    }
    body.innerHTML = cart.map(it => {
      const p = TT_PRODUCTS.find(pr => pr.id === it.id);
      if (!p) return '';
      return `<div class="item">
        <div class="thumb">
          ${p.img ? `<img src="${p.img}" alt="">` : `<span class="material-symbols-outlined">${p.icon||'box'}</span>`}
        </div>
        <div class="flex-grow-1">
          <div class="fw-semibold small text-truncate">${p.name}</div>
          <div class="text-muted small">Qty ${it.qty} × ${TT.formatPrice(TT.priceOf(p))}</div>
          <div class="fw-bold small">${TT.formatPrice(TT.priceOf(p)*it.qty)}</div>
        </div>
        <button type="button" class="btn btn-sm btn-link text-danger p-1" onclick="TT.removeFromCart(${p.id})" aria-label="Remove ${p.name}">
          <span class="material-symbols-outlined" style="font-size:18px">delete</span>
        </button>
      </div>`;
    }).join('');
    sub.textContent = TT.formatPrice(TT.cartSubtotal());
  }
  document.addEventListener('tt:cart-changed', () => {
    if (document.querySelector('.tt-minicart.is-open')) renderMiniCart();
  });

  // ---------- Welcome guide ----------------------------------------------
  function setupWelcome() {
    const overlay = document.getElementById('tt-welcome');
    if (!overlay) return;
    if (localStorage.getItem(LS_KEYS.welcome) === '1') return;
    let step = 0;
    const steps = [
      { title: 'Welcome to TeknikkTorget', body: 'Curated electronics, robotics and tools for serious enthusiasts. Search by spec, not by guess.', icon: 'storefront' },
      { title: 'Find what you need', body: 'Use the search bar (Ctrl + K) for direct lookup, or browse categories with sidebar filters.', icon: 'search' },
      { title: 'Pay with confidence', body: 'Free shipping over kr 1.000. Secure SSL checkout, 30-day returns, expert support.', icon: 'verified_user' }
    ];
    function render() {
      const s = steps[step];
      overlay.querySelector('.tt-welcome').innerHTML = `
        <div class="text-center mb-3">
          <span class="material-symbols-outlined step-illu" aria-hidden="true">${s.icon}</span>
        </div>
        <h2 class="h5 fw-bold text-center">${s.title}</h2>
        <p class="text-muted text-center small">${s.body}</p>
        <div class="d-flex align-items-center justify-content-between mt-4">
          <div class="step-dots" aria-hidden="true">
            ${steps.map((_, i) => `<span class="d ${i === step ? 'is-active' : ''}"></span>`).join('')}
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-link text-muted btn-sm" data-tt-welcome-skip>Skip</button>
            <button type="button" class="btn btn-primary btn-sm" data-tt-welcome-next>${step === steps.length - 1 ? 'Start shopping' : 'Next'}</button>
          </div>
        </div>`;
    }
    overlay.classList.add('is-open');
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','tt-welcome-title');
    render();
    overlay.addEventListener('click', (e) => {
      if (e.target.matches('[data-tt-welcome-skip]')) close();
      if (e.target.matches('[data-tt-welcome-next]')) {
        if (step === steps.length - 1) close();
        else { step++; render(); }
      }
    });
    function close() {
      overlay.classList.remove('is-open');
      localStorage.setItem(LS_KEYS.welcome, '1');
      TT.announce('Welcome guide dismissed');
    }
  }

  // ---------- Keyboard shortcuts -----------------------------------------
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('tt-search-input')?.focus();
    }
    if (e.key === 'Escape') {
      TT.closeMiniCart();
      document.querySelectorAll('.tt-toast').forEach(t => t.classList.add('is-out'));
    }
  });

  // ---------- Active nav link --------------------------------------------
  function highlightNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-tt-nav]').forEach(a => {
      if (a.dataset.ttNav === path) a.classList.add('active');
    });
  }

  // ---------- Init -------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupWelcome();
    highlightNav();
    TT.updateCartBadge();
    TT.LS_KEYS = LS_KEYS;
  });
})();
