/* TeknikkTorget - product.js
   Detail page: hero gallery + qty stepper + add-to-cart, full specs, recommendations. */

(function () {
  'use strict';
  const TT = window.TT;

  function readId() {
    const id = +new URLSearchParams(location.search).get('id');
    return id || null;
  }

  function gallery(p) {
    const list = (p.gallery && p.gallery.length) ? p.gallery : (p.img ? [p.img] : []);
    if (!list.length) return `<div class="main"><span class="material-symbols-outlined" style="font-size:5rem;color:var(--tt-outline-variant)" aria-hidden="true">${p.icon||'box'}</span></div>`;
    return `<div class="main">
        <img id="tt-pd-main-img" src="${list[0]}" alt="${p.name}" onerror="${TT.imgFallback}">
      </div>
      <div class="thumbs" role="tablist" aria-label="${TT.t('product.gallery')}">
        ${list.map((src, i) => `<button type="button" data-idx="${i}" class="${i===0?'is-active':''}" role="tab" aria-selected="${i===0}">
          <img src="${src}" alt="" onerror="${TT.imgFallback}">
        </button>`).join('')}
      </div>`;
  }

  function specsTable(p) {
    return `<table class="tt-pd-specs"><tbody>
      ${Object.entries(p.specs).map(([k,v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}
    </tbody></table>`;
  }

  function recommend(p) {
    const others = TT_PRODUCTS.filter(x => x.id !== p.id);
    const sameCat = others.filter(x => x.category === p.category);
    const sameBrand = others.filter(x => x.brand === p.brand && x.category !== p.category);
    const filler = others.filter(x => !sameCat.includes(x) && !sameBrand.includes(x)).sort((a,b) => b.rating - a.rating);
    const out = [...sameCat, ...sameBrand, ...filler].slice(0, 4);
    return out.map(x => TT.productCardHtml(x)).join('');
  }

  function render() {
    const id = readId();
    const root = document.getElementById('tt-pd-root');
    if (!root) return;
    const raw = TT_PRODUCTS.find(p => p.id === id);
    if (!raw) {
      root.innerHTML = `<div class="text-center py-5"><h1 class="h4">Product not found</h1>
        <a href="catalog.html" class="btn btn-primary mt-2">${TT.t('cart.empty.browse')}</a></div>`;
      return;
    }
    const p = TT.localizedProduct ? TT.localizedProduct(raw) : raw;
    const onSale = !!raw.salePrice;
    const cat = TT_CATEGORIES.find(c => c.id === raw.category);
    const catLabel = TT.localizedCategory ? TT.localizedCategory(cat || { label: raw.category }) : raw.category;

    document.title = p.name + ' - TeknikkTorget';

    root.innerHTML = `
      <nav class="tt-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">${TT.t('breadcrumb.home')}</a> <span aria-hidden="true">›</span>
        <a href="catalog.html">${TT.t('breadcrumb.catalog')}</a> <span aria-hidden="true">›</span>
        <a href="catalog.html?cat=${raw.category}">${catLabel}</a> <span aria-hidden="true">›</span>
        <span aria-current="page">${p.name}</span>
      </nav>

      <div class="tt-pd-grid mt-3">
        <section class="tt-pd-gallery" aria-label="${TT.t('product.gallery')}">
          ${gallery(p)}
        </section>

        <section class="tt-pd-info">
          <span class="text-uppercase small text-secondary fw-semibold" style="letter-spacing:.06em">${catLabel}</span>
          <h1 class="mt-1 mb-2">${p.name}</h1>
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="stars" style="color:var(--tt-retro-accent)" aria-label="${raw.rating} / 5">${TT.starsHtml(raw.rating)}</span>
            <span class="text-muted small">(${raw.reviews} ${TT.t('product.reviews')})</span>
          </div>
          <div class="d-flex flex-wrap gap-1 mb-3">
            ${(p.chips||[]).map(c => `<span class="chip" style="background:var(--tt-surface-variant);font-size:.7rem;font-weight:700;padding:.2rem .5rem;border-radius:.2rem">${c}</span>`).join('')}
          </div>
          <p class="text-muted">${p.desc}</p>

          <div class="d-flex align-items-baseline mb-3">
            <span class="tt-pd-price">${TT.formatPrice(TT.priceOf(raw))}</span>
            ${onSale ? `<span class="tt-pd-price-old">${TT.formatPrice(raw.price)}</span>` : ''}
          </div>

          <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <label class="small fw-semibold mb-0" for="tt-pd-qty">${TT.t('product.qty')}</label>
            <div class="input-group input-group-sm" style="width:130px">
              <button type="button" class="btn btn-outline-secondary" id="tt-pd-dec" aria-label="−">−</button>
              <input id="tt-pd-qty" type="number" min="1" max="99" class="form-control text-center" value="1" aria-label="${TT.t('product.qty')}">
              <button type="button" class="btn btn-outline-secondary" id="tt-pd-inc" aria-label="+">+</button>
            </div>
            <span class="small text-success"><span class="material-symbols-outlined align-middle" aria-hidden="true">check_circle</span> ${TT.t('product.inStock')}</span>
          </div>

          <div class="d-flex gap-2 mb-4 flex-wrap">
            <button type="button" class="btn btn-primary" id="tt-pd-add">
              <span class="material-symbols-outlined align-middle me-1" aria-hidden="true">add_shopping_cart</span>
              ${TT.t('card.addToCart')}
            </button>
            <button type="button" class="btn btn-outline-secondary" onclick="TT.openMiniCart()">
              <span class="material-symbols-outlined align-middle me-1" aria-hidden="true">shopping_cart</span>
              ${TT.t('minicart.title')}
            </button>
          </div>

          <div class="small text-muted">
            <div>${TT.t('product.brand')}: <strong>${raw.brand}</strong></div>
            <div>${TT.t('product.sku')}: <strong>TT-${String(raw.id).padStart(4,'0')}</strong></div>
          </div>
        </section>
      </div>

      <section class="mt-5" aria-labelledby="tt-pd-specs-title">
        <h2 id="tt-pd-specs-title" class="h4 fw-bold mb-3">${TT.t('product.specsTitle')}</h2>
        ${specsTable(p)}
      </section>

      <section class="mt-5" aria-labelledby="tt-pd-rec-title">
        <h2 id="tt-pd-rec-title" class="h4 fw-bold mb-3">${TT.t('product.relatedTitle')}</h2>
        <div class="tt-grid-products" id="tt-pd-rec">${recommend(raw)}</div>
      </section>
    `;

    // Gallery click
    root.querySelectorAll('.thumbs button').forEach(b =>
      b.addEventListener('click', () => {
        const list = (raw.gallery && raw.gallery.length) ? raw.gallery : [raw.img];
        document.getElementById('tt-pd-main-img').src = list[+b.dataset.idx];
        root.querySelectorAll('.thumbs button').forEach(x => {
          x.classList.toggle('is-active', x === b);
          x.setAttribute('aria-selected', x === b);
        });
      })
    );

    // Qty stepper
    const qtyEl = document.getElementById('tt-pd-qty');
    document.getElementById('tt-pd-dec').addEventListener('click', () => { qtyEl.value = Math.max(1, (+qtyEl.value || 1) - 1); });
    document.getElementById('tt-pd-inc').addEventListener('click', () => { qtyEl.value = Math.min(99, (+qtyEl.value || 1) + 1); });

    document.getElementById('tt-pd-add').addEventListener('click', () => {
      const q = Math.max(1, +qtyEl.value || 1);
      TT.addToCart(raw.id, q);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-pd-root')) return;
    render();
    document.addEventListener('tt:lang-changed', render);
  });
})();
