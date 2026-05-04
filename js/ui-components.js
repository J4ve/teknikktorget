/* TeknikkTorget — ui-components.js
   Shared visual primitives: product card renderer, toast, Quick View modal, star ratings.
   Blueprint §4.1 (synthesisability — one card schema), §6.1 (toast feedback). */

(function () {
  'use strict';
  const TT = window.TT;

  // ---------- Stars -------------------------------------------------------
  TT.starsHtml = (rating) => {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)         html += '<span class="material-symbols-outlined" aria-hidden="true">star</span>';
      else if (rating >= i-0.5) html += '<span class="material-symbols-outlined" aria-hidden="true">star_half</span>';
      else                      html += '<span class="material-symbols-outlined" aria-hidden="true" style="font-variation-settings:\'FILL\' 0">star</span>';
    }
    return html;
  };

  // ---------- Product card -----------------------------------------------
  TT.productCardHtml = (p) => {
    const onSale = !!p.salePrice;
    const badge = p.badge === 'Sale' || onSale
      ? `<span class="badge-corner badge-sale">Sale</span>`
      : (p.badge === 'New' ? `<span class="badge-corner badge-new">New</span>` : '');
    return `<article class="tt-product-card" data-id="${p.id}" aria-label="${p.name}">
      ${badge}
      <div class="media">
        ${p.img
          ? `<img loading="lazy" src="${p.img}" alt="${p.name}">`
          : `<span class="material-symbols-outlined" aria-hidden="true">${p.icon || 'box'}</span>`}
        <div class="quick-view">
          <button type="button" class="btn" onclick="TT.openQuickView(${p.id})" aria-label="Quick view of ${p.name}">Quick View</button>
        </div>
      </div>
      <div class="body">
        <div class="chips" aria-hidden="true">
          ${(p.chips || []).map(c => `<span class="chip">${c}</span>`).join('')}
        </div>
        <a class="name text-decoration-none" href="catalog.html?open=${p.id}">${p.name}</a>
        <div class="d-flex align-items-center mt-2">
          <span class="stars" aria-label="${p.rating} out of 5 stars">${TT.starsHtml(p.rating)}</span>
          <span class="reviews">(${p.reviews})</span>
        </div>
        <div class="d-flex align-items-end justify-content-between mt-auto pt-2">
          <div>
            <span class="price">${TT.formatPrice(TT.priceOf(p))}</span>
            ${onSale ? `<span class="price-old">${TT.formatPrice(p.price)}</span>` : ''}
          </div>
          <button type="button" class="add-btn" onclick="TT.addToCart(${p.id})" aria-label="Add ${p.name} to cart">
            <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </article>`;
  };

  // ---------- Toast -------------------------------------------------------
  TT.toast = (msg, type = 'success') => {
    let stack = document.querySelector('.tt-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'tt-toast-stack';
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    el.className = 'tt-toast ' + (type === 'error' ? 'error' : type === 'info' ? 'info' : '');
    el.setAttribute('role', 'status');
    const icon = type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle';
    el.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
                    <span class="flex-grow-1">${msg}</span>
                    <button type="button" class="btn-close btn-close-white" aria-label="Dismiss"></button>`;
    el.querySelector('.btn-close').addEventListener('click', () => el.remove());
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  };

  // ---------- Quick View --------------------------------------------------
  TT.openQuickView = (id) => {
    const p = TT_PRODUCTS.find(x => x.id === id);
    if (!p) return;
    let modal = document.getElementById('tt-qv-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'tt-qv-modal';
      modal.className = 'modal fade tt-qv';
      modal.tabIndex = -1;
      modal.setAttribute('aria-labelledby','tt-qv-title');
      modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content"></div>
      </div>`;
      document.body.appendChild(modal);
    }
    const onSale = !!p.salePrice;
    modal.querySelector('.modal-content').innerHTML = `
      <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
      <div class="modal-body">
        <div class="qv-grid">
          <div class="qv-img">
            ${p.img ? `<img src="${p.img}" alt="${p.name}">`
                    : `<span class="material-symbols-outlined" aria-hidden="true">${p.icon || 'box'}</span>`}
          </div>
          <div class="qv-info">
            <span class="text-uppercase small text-secondary fw-semibold" style="letter-spacing:.06em">${p.category}</span>
            <h2 id="tt-qv-title" class="h4 fw-bold mt-1">${p.name}</h2>
            <p class="text-muted small">${p.desc}</p>
            <div class="d-flex align-items-baseline gap-2 mb-3">
              <span class="h3 fw-bold mb-0">${TT.formatPrice(TT.priceOf(p))}</span>
              ${onSale ? `<span class="text-muted text-decoration-line-through">${TT.formatPrice(p.price)}</span>` : ''}
            </div>
            <div class="specs mb-3">
              ${Object.entries(p.specs).map(([k,v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-primary flex-grow-1" data-tt-qv-add>
                <span class="material-symbols-outlined align-middle me-1" aria-hidden="true">add_shopping_cart</span>
                Add to cart
              </button>
              <a href="catalog.html?open=${p.id}" class="btn btn-outline-secondary">Full details</a>
            </div>
          </div>
        </div>
      </div>`;
    modal.querySelector('[data-tt-qv-add]').addEventListener('click', () => {
      TT.addToCart(p.id);
      bootstrap.Modal.getInstance(modal).hide();
    });
    bootstrap.Modal.getOrCreateInstance(modal).show();
  };

  // ---------- A11y toolbar mount (on every page) -------------------------
  TT.mountA11yToolbar = () => {
    if (document.getElementById('tt-a11y-toolbar')) return;
    const wrap = document.createElement('div');
    wrap.id = 'tt-a11y-toolbar';
    wrap.className = 'tt-a11y-toolbar';
    wrap.setAttribute('role','region');
    wrap.setAttribute('aria-label','Accessibility settings');
    wrap.innerHTML = `
      <h3>Accessibility</h3>
      <div class="row">
        <span>Text size</span>
        <div class="d-flex gap-1">
          <button type="button" class="size" data-font="16" aria-label="Default text">A</button>
          <button type="button" class="size" data-font="18" aria-label="Large text">A+</button>
          <button type="button" class="size" data-font="20" aria-label="Larger text">A++</button>
          <button type="button" class="size" data-font="22" aria-label="Largest text">A+++</button>
        </div>
      </div>
      <div class="row"><label for="tt-cb-contrast">High contrast</label>
        <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-contrast"></div>
      </div>
      <div class="row"><label for="tt-cb-motion">Reduce motion</label>
        <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-motion"></div>
      </div>
      <div class="row"><label for="tt-cb-audio">Audio cues</label>
        <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-audio"></div>
      </div>`;
    document.body.appendChild(wrap);
  };
})();
