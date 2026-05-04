/* TeknikkTorget — validation.js
   Inline checkout validation. Blueprint §5.4: SSL banner, masked card, CVV tooltip. */

(function () {
  'use strict';
  const TT = window.TT;

  const RULES = {
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email (e.g. you@domain.com)',
    name:    v => v.trim().length >= 2 || 'Please enter your full name',
    address: v => v.trim().length >= 4 || 'Please enter a street address',
    city:    v => v.trim().length >= 2 || 'Please enter a city',
    zip:     v => /^[0-9]{4}$/.test(v) || 'Postal code must be 4 digits',
    country: v => !!v || 'Please choose a country',
    card:    v => /^[0-9]{13,19}$/.test(v.replace(/\s/g,'')) || 'Card number must be 13–19 digits',
    expiry:  v => /^(0[1-9]|1[0-2])\s*\/\s*[0-9]{2}$/.test(v) || 'Expiry format MM/YY',
    cvv:     v => /^[0-9]{3,4}$/.test(v) || 'CVV is 3 or 4 digits',
    terms:   v => !!v || 'You must accept the terms to continue'
  };

  function showError(input, msg) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    let fb = input.parentElement.querySelector('.invalid-feedback');
    if (!fb) {
      fb = document.createElement('div');
      fb.className = 'invalid-feedback';
      input.parentElement.appendChild(fb);
    }
    fb.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  }

  function validateField(input) {
    const rule = RULES[input.dataset.rule];
    if (!rule) return true;
    const result = rule(input.type === 'checkbox' ? input.checked : input.value);
    if (result === true) { clearError(input); return true; }
    showError(input, result); return false;
  }

  function setupForm(form) {
    // Card masking: groups of 4
    const card = form.querySelector('[data-rule="card"]');
    if (card) card.addEventListener('input', () => {
      const digits = card.value.replace(/\D/g,'').slice(0,19);
      card.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
    const exp = form.querySelector('[data-rule="expiry"]');
    if (exp) exp.addEventListener('input', () => {
      let v = exp.value.replace(/\D/g,'').slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
      exp.value = v;
    });

    form.querySelectorAll('[data-rule]').forEach(inp => {
      inp.addEventListener('blur', () => validateField(inp));
      inp.addEventListener('input', () => {
        if (inp.classList.contains('is-invalid')) validateField(inp);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('[data-rule]');
      let firstInvalid = null;
      fields.forEach(f => {
        if (!validateField(f) && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        TT.toast('Please fix the highlighted fields', 'error');
        TT.announce('Form contains errors. Please review highlighted fields.');
        return;
      }
      // Successful submission — show confirmation
      const cart = TT.getCart();
      if (!cart.length) {
        TT.toast('Cart is empty', 'error');
        return;
      }
      const orderId = 'TT-' + Date.now().toString().slice(-7);
      localStorage.setItem('tt_last_order', JSON.stringify({ id: orderId, when: new Date().toISOString(), items: cart }));
      TT.saveCart([]);
      const summary = document.getElementById('tt-checkout-page');
      summary.innerHTML = `<div class="text-center py-5">
        <span class="material-symbols-outlined text-success" style="font-size:5rem" aria-hidden="true">check_circle</span>
        <h1 class="h3 fw-bold mt-3">Order confirmed</h1>
        <p class="text-muted">Order number <strong>${orderId}</strong> · A confirmation email has been sent.</p>
        <a href="index.html" class="btn btn-primary mt-2">Back to home</a>
        <a href="catalog.html" class="btn btn-outline-secondary mt-2 ms-2">Keep shopping</a>
      </div>`;
      TT.announce('Order confirmed. Order number ' + orderId);
      window.scrollTo({ top: 0 });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tt-checkout-form');
    if (form) setupForm(form);
  });
})();
