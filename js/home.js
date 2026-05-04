/* TeknikkTorget — home.js
   Featured products + filter pills on homepage. */

(function () {
  'use strict';
  const TT = window.TT;
  let activePill = 'all';

  function render() {
    const grid = document.getElementById('tt-featured');
    if (!grid) return;
    let list = TT_PRODUCTS.slice();
    if (activePill === 'drones')   list = list.filter(p => p.category === 'drones');
    if (activePill === 'vehicles') list = list.filter(p => p.category === 'vehicles');
    if (activePill === 'sale')     list = list.filter(p => !!p.salePrice);
    list = list.slice(0, 8);
    grid.innerHTML = list.map(p => `<div class="col-6 col-md-4 col-lg-3">${TT.productCardHtml(p)}</div>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-featured')) return;
    document.querySelectorAll('[data-pill]').forEach(b =>
      b.addEventListener('click', () => {
        activePill = b.dataset.pill;
        document.querySelectorAll('[data-pill]').forEach(x => x.classList.toggle('is-active', x === b));
        render();
      })
    );
    render();
  });
})();
