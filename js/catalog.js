/* TeknikkTorget — catalog.js
   Catalog page: filters, pagination, view toggle, autocomplete-deep-link.
   Blueprint §5.2/§5.3: 12 items/page, removable filter chips, lazy images. */

(function () {
  'use strict';
  const TT = window.TT;
  const PER_PAGE = 12;

  const state = {
    q: '',
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 25000,
    motorPower: 'all',
    batteryType: 'all',
    sort: 'featured',
    view: 'grid',
    page: 1
  };

  function readUrl() {
    const u = new URLSearchParams(location.search);
    if (u.get('q'))   state.q = u.get('q');
    if (u.get('cat')) state.category = u.get('cat');
    if (u.get('open')) {
      const id = +u.get('open');
      if (TT_PRODUCTS.find(p => p.id === id)) {
        setTimeout(() => TT.openQuickView(id), 200);
      }
    }
  }

  function filtered() {
    return TT_PRODUCTS.filter(p => {
      if (state.q) {
        const q = state.q.toLowerCase();
        if (!(p.name.toLowerCase().includes(q) ||
              p.desc.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q))) return false;
      }
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.brand !== 'all'    && p.brand    !== state.brand)    return false;
      const price = TT.priceOf(p);
      if (price < state.minPrice || price > state.maxPrice) return false;
      if (state.motorPower !== 'all' && p.motorPower !== state.motorPower) return false;
      if (state.batteryType !== 'all' && p.batteryType !== state.batteryType) return false;
      return true;
    });
  }

  function sorted(list) {
    const arr = [...list];
    if (state.sort === 'price-asc')  arr.sort((a,b) => TT.priceOf(a) - TT.priceOf(b));
    if (state.sort === 'price-desc') arr.sort((a,b) => TT.priceOf(b) - TT.priceOf(a));
    if (state.sort === 'rating')     arr.sort((a,b) => b.rating - a.rating);
    if (state.sort === 'name')       arr.sort((a,b) => a.name.localeCompare(b.name));
    return arr;
  }

  function renderChips() {
    const wrap = document.getElementById('tt-active-chips');
    if (!wrap) return;
    const chips = [];
    if (state.q)                 chips.push({ k: 'q',           label: `“${state.q}”` });
    if (state.category !== 'all') chips.push({ k: 'category',    label: 'Category: ' + state.category });
    if (state.brand !== 'all')    chips.push({ k: 'brand',       label: 'Brand: ' + state.brand });
    if (state.motorPower !== 'all') chips.push({ k: 'motorPower', label: 'Motor: ' + state.motorPower });
    if (state.batteryType !== 'all') chips.push({ k: 'batteryType', label: 'Battery: ' + state.batteryType });
    if (state.minPrice > 0 || state.maxPrice < 25000) chips.push({ k: 'price', label: `${TT.formatPrice(state.minPrice)}–${TT.formatPrice(state.maxPrice)}` });
    wrap.innerHTML = chips.length
      ? chips.map(c => `<button class="tt-filter-chip" type="button" data-clear="${c.k}">${c.label} <span class="x" aria-hidden="true">×</span><span class="visually-hidden">Remove</span></button>`).join('')
        + '<button class="btn btn-sm btn-link" type="button" id="tt-clear-all">Clear all</button>'
      : '<span class="text-muted small">No active filters</span>';
  }

  function renderResults() {
    const grid = document.getElementById('tt-grid');
    const summary = document.getElementById('tt-summary');
    const pagWrap = document.getElementById('tt-pagination');
    const list = sorted(filtered());
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page-1) * PER_PAGE, state.page * PER_PAGE);

    summary.textContent = total === 0
      ? 'No products match your filters.'
      : `Showing ${(state.page-1)*PER_PAGE + 1}–${Math.min(state.page*PER_PAGE, total)} of ${total} products`;

    if (state.view === 'list') {
      grid.className = 'd-flex flex-column gap-3 tt-grid-products';
      grid.innerHTML = slice.length
        ? slice.map(p => listRowHtml(p)).join('')
        : emptyState();
    } else {
      grid.className = 'row g-3 tt-grid-products';
      grid.innerHTML = slice.length
        ? slice.map(p => `<div class="col-6 col-md-4 col-lg-3">${TT.productCardHtml(p)}</div>`).join('')
        : `<div class="col-12">${emptyState()}</div>`;
    }

    // Pagination
    let pag = '';
    for (let i = 1; i <= pages; i++) {
      pag += `<button type="button" class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-outline-secondary'}" data-page="${i}" aria-label="Go to page ${i}" ${i === state.page ? 'aria-current="page"' : ''}>${i}</button>`;
    }
    pagWrap.innerHTML = pages > 1 ? pag : '';

    TT.announce(`${total} products. Page ${state.page} of ${pages}.`);
  }

  function listRowHtml(p) {
    const onSale = !!p.salePrice;
    return `<div class="card flex-row p-2 align-items-center" style="border-color:var(--tt-border-subtle)">
      <div style="width:120px;height:120px;flex-shrink:0;background:var(--tt-surface-low);border-radius:.25rem;display:flex;align-items:center;justify-content:center;overflow:hidden">
        ${p.img ? `<img loading="lazy" src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`
                : `<span class="material-symbols-outlined" style="font-size:3rem;color:var(--tt-outline-variant)" aria-hidden="true">${p.icon || 'box'}</span>`}
      </div>
      <div class="ps-3 flex-grow-1">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <a href="catalog.html?open=${p.id}" class="fw-semibold text-decoration-none">${p.name}</a>
          <div class="text-end">
            <div class="fw-bold">${TT.formatPrice(TT.priceOf(p))}</div>
            ${onSale ? `<small class="text-muted text-decoration-line-through">${TT.formatPrice(p.price)}</small>` : ''}
          </div>
        </div>
        <div class="small text-muted">${p.desc}</div>
        <div class="d-flex gap-2 mt-2">
          ${(p.chips||[]).map(c => `<span class="chip" style="background:var(--tt-surface-variant);font-size:.65rem;font-weight:700;padding:.15rem .4rem;border-radius:.2rem">${c}</span>`).join('')}
        </div>
        <div class="d-flex gap-2 mt-2">
          <button type="button" class="btn btn-sm btn-primary" onclick="TT.addToCart(${p.id})">Add to cart</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="TT.openQuickView(${p.id})">Quick view</button>
        </div>
      </div>
    </div>`;
  }

  function emptyState() {
    return `<div class="text-center py-5 text-muted">
      <span class="material-symbols-outlined" style="font-size:3rem;opacity:.4" aria-hidden="true">search_off</span>
      <p class="fw-semibold mb-1 mt-2">No matching products</p>
      <button type="button" class="btn btn-sm btn-outline-primary" id="tt-empty-clear">Clear filters</button>
    </div>`;
  }

  function setupBrandList() {
    const sel = document.getElementById('tt-brand-filter');
    if (!sel) return;
    const brands = [...new Set(TT_PRODUCTS.map(p => p.brand))].sort();
    sel.innerHTML = '<option value="all">All brands</option>' + brands.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  function setupSpecLists() {
    const motors = [...new Set(TT_PRODUCTS.map(p => p.motorPower).filter(Boolean))].sort();
    const batts  = [...new Set(TT_PRODUCTS.map(p => p.batteryType).filter(Boolean))].sort();
    const m = document.getElementById('tt-motor-filter');
    const b = document.getElementById('tt-battery-filter');
    if (m) m.innerHTML = '<option value="all">Any motor</option>' + motors.map(x => `<option value="${x}">${x}</option>`).join('');
    if (b) b.innerHTML = '<option value="all">Any battery</option>' + batts.map(x => `<option value="${x}">${x}</option>`).join('');
  }
  function setupCategoryList() {
    const wrap = document.getElementById('tt-cat-list');
    if (!wrap) return;
    wrap.innerHTML = `<button class="cat-link ${state.category==='all'?'is-active':''}" data-cat="all" type="button">
        <span class="material-symbols-outlined" aria-hidden="true">apps</span> All
      </button>` +
      TT_CATEGORIES.map(c => `<button class="cat-link ${state.category===c.id?'is-active':''}" data-cat="${c.id}" type="button">
          <span class="material-symbols-outlined" aria-hidden="true">${c.icon}</span> ${c.label}
        </button>`).join('');
  }

  function bind() {
    // Sidebar categories
    document.getElementById('tt-cat-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.category = btn.dataset.cat;
      state.page = 1;
      setupCategoryList(); renderChips(); renderResults();
    });
    // Filters
    document.getElementById('tt-brand-filter')?.addEventListener('change', (e) => {
      state.brand = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-motor-filter')?.addEventListener('change', (e) => {
      state.motorPower = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-battery-filter')?.addEventListener('change', (e) => {
      state.batteryType = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-min-price')?.addEventListener('input', (e) => {
      state.minPrice = +e.target.value || 0; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-max-price')?.addEventListener('input', (e) => {
      state.maxPrice = +e.target.value || 25000; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-sort')?.addEventListener('change', (e) => {
      state.sort = e.target.value; renderResults();
    });
    document.querySelectorAll('[data-view]').forEach(b =>
      b.addEventListener('click', () => {
        state.view = b.dataset.view;
        document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('btn-primary', x === b));
        document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('btn-outline-secondary', x !== b));
        renderResults();
      })
    );
    document.getElementById('tt-active-chips')?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-clear]');
      if (chip) {
        const k = chip.dataset.clear;
        if (k === 'price') { state.minPrice = 0; state.maxPrice = 25000;
          document.getElementById('tt-min-price').value = 0;
          document.getElementById('tt-max-price').value = 25000;
        }
        else if (k === 'q')        { state.q = ''; }
        else if (k === 'category') { state.category = 'all'; setupCategoryList(); }
        else if (k === 'brand')    { state.brand = 'all'; document.getElementById('tt-brand-filter').value = 'all'; }
        else if (k === 'motorPower'){ state.motorPower = 'all'; document.getElementById('tt-motor-filter').value = 'all'; }
        else if (k === 'batteryType'){ state.batteryType = 'all'; document.getElementById('tt-battery-filter').value = 'all'; }
        state.page = 1; renderChips(); renderResults();
      }
      if (e.target.id === 'tt-clear-all') {
        state.q = ''; state.category = 'all'; state.brand = 'all'; state.motorPower = 'all'; state.batteryType = 'all';
        state.minPrice = 0; state.maxPrice = 25000; state.page = 1;
        document.getElementById('tt-brand-filter').value = 'all';
        document.getElementById('tt-motor-filter').value = 'all';
        document.getElementById('tt-battery-filter').value = 'all';
        document.getElementById('tt-min-price').value = 0;
        document.getElementById('tt-max-price').value = 25000;
        setupCategoryList(); renderChips(); renderResults();
      }
    });
    document.getElementById('tt-pagination')?.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (b) { state.page = +b.dataset.page; renderResults(); window.scrollTo({ top: document.getElementById('tt-grid').offsetTop - 80, behavior: 'smooth' }); }
    });
    document.getElementById('tt-grid')?.addEventListener('click', (e) => {
      if (e.target.id === 'tt-empty-clear') document.getElementById('tt-clear-all')?.click();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-grid')) return;
    readUrl();
    setupBrandList();
    setupSpecLists();
    setupCategoryList();
    bind();
    renderChips();
    renderResults();
  });
})();
