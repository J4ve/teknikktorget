# TeknikkTorget — Implementation Report

> Course: HCI · Final Project
> Submission target: 3-page comparison report, screenshots, video, source bundle.
> Brand note: "Arngren.net" appears in this document only as a contrast reference for the redesign. The implemented platform is **TeknikkTorget**.

---

## 1. Project Overview

TeknikkTorget is a Bootstrap 5.3 e-commerce platform that operationalises the HCI blueprint compiled across the six learning tasks. It is locally runnable, accessibility-aware, and demonstrates three flagship pages — Homepage, Catalog and Cart/Checkout — designed to resolve the structural usability failures of arngren.net.

Stack
- Bootstrap 5.3 (CSS + JS) + custom CSS theme tokens (StitchShi palette)
- Vanilla ES6+ JavaScript (no React/Vue/jQuery)
- Material Symbols Outlined + Work Sans (Google Fonts CDN)
- Cart in JS session object; localStorage only for non-critical prefs (welcome guide dismissal, accessibility, retro mode)

---

## 2. Page-by-Page Comparison

### 2.1 Homepage (`index.html`)

`[INSERT MIDTERM MOCKUP: Homepage]` &nbsp; `[IMPLEMENTED SCREENSHOT: Homepage]`

**Visual / structural comparison**

| Element | Midterm mockup | Implemented (TeknikkTorget) |
|---|---|---|
| Header | Full-width sticky nav, brand left, search centre, cart right | Same; Bootstrap navbar with 64 px height, blurred translucency, sticky on scroll |
| Hero | Full-bleed image with eyebrow tag, headline, lead, primary CTA | CSS-gradient hero with two radial-glow layers; CTA `Explore catalog` and secondary `View new drones` |
| Sidebar | Persistent left rail with category icons | Implemented as `<aside>` using `tt-sidebar` styles, hidden under 992 px and re-mounted into a Bootstrap offcanvas |
| Featured categories | 3-card bento (1 large + 2 small) | `display:grid` bento with `grid-column: span 2` for the lead card |
| Featured products | 4-column responsive grid, badge + chips + price + CTA | `tt-product-card` component reused everywhere |
| Footer | Five-column linked groups, payment icons, accessibility shortcut | Implemented; Retro Mode + a11y settings reachable from footer |

**What happens on the page**
- First-time visitors see a 3-step Welcome Guide modal (storefront → search → secure pay). Skipped or completed → state stored in `localStorage.tt_welcome_dismissed`.
- Search bar (with Ctrl + K shortcut) opens a debounced autocomplete dropdown listing up to five matches; `↑/↓/Enter` navigate, `Esc` closes.
- Featured-product pills filter the showcase grid in place; All / Drones / Vehicles / On Sale.
- Add-to-cart buttons trigger a toast, update the cart badge, and announce via the ARIA live region.

**HCI principles demonstrated**
- **Predictability / Familiarity** (Dix): top search, cart icon top-right, sidebar categories — Amazon/Shopee mental models reused.
- **Synthesisability**: every product card follows the same schema (badge → image → chips → name → stars → price → add-to-cart), so a user learns one and reads any.
- **Recognition over recall** (Nielsen): category labels paired with Material Symbols icons.
- **Cognitive load reduction** (Sweller): hero/categories/featured limited to one visual focus per row; advanced specs hidden behind Quick View.
- **Closure** (Shneiderman): every interaction emits a feedback signal — toast, badge count, ARIA announcement.

---

### 2.2 Catalog (`catalog.html`)

`[INSERT MIDTERM MOCKUP: Catalog]` &nbsp; `[IMPLEMENTED SCREENSHOT: Catalog]`

**Visual / structural comparison**

| Element | Midterm mockup | Implemented |
|---|---|---|
| Breadcrumb | Home › Catalog › … | Implemented above results, with `aria-current="page"` |
| Sidebar filters | Categories, brand, price range, motor, battery | Implemented; selects + numeric inputs, removable chips above grid |
| Active filters | Chip row with `×` to remove each | `tt-filter-chip` component, `Clear all` link |
| Sort + view toggle | Top-right of results | Sort `<select>` (5 options) + grid/list toggle group |
| Grid | 12 cards/page, 4-col → 2-col → 1-col | Bootstrap `row g-3` + responsive `col-6 col-md-4 col-lg-3`; pagination buttons |
| Empty state | Friendly text + clear-filters CTA | Implemented |

**What happens on the page**
- URL params `?cat=…`, `?q=…`, `?open=<id>` deep-link from the homepage and search dropdown. `?open=<id>` auto-opens the Quick View modal.
- Filter changes update the chip row and the result count instantly; the grid is re-rendered (no full page navigation), and the count is announced for screen readers.
- Quick View modal exposes the full spec sheet without leaving the grid; `Esc` closes.
- Pagination paginates server-style — 12 per page, Prev/Next buttons disabled at extremes.

**HCI principles demonstrated**
- **Multi-threading & substitutivity** (Dix): users can compare specs in Quick View without losing scroll position.
- **Permit easy reversal** (Shneiderman): each chip × removes only that filter; `Clear all` resets state.
- **Informative feedback**: the result summary updates ("Showing 1–12 of 16 products") on every state change.
- **Consistency**: identical card component as homepage; identical sort/filter idioms across pages.
- **Mapping**: chip colour = primary brand colour, signalling "this filter is active".

---

### 2.3 Cart & Checkout (`cart.html` + `checkout.html`)

`[INSERT MIDTERM MOCKUP: Cart]` &nbsp; `[IMPLEMENTED SCREENSHOT: Cart]`
`[INSERT MIDTERM MOCKUP: Checkout]` &nbsp; `[IMPLEMENTED SCREENSHOT: Checkout]`

**Visual / structural comparison**

| Element | Midterm mockup | Implemented |
|---|---|---|
| Item rows | Image, name, qty stepper, line total, remove | Implemented; qty stepper uses Bootstrap input-group |
| Free shipping bar | Progress bar with remaining-amount caption | `tt-shipbar`; `progress` ARIA role + `aria-valuenow`; success state once unlocked |
| Shipping estimator | 4-digit zip → cost + ETA | Mocked via `calcShipping()`; results inserted into a polite live region |
| Promo code | Code field + apply button | `TT10` (10%) and `STUDENT` (15%) accepted; toast + colour feedback |
| Checkout form | Single page, 3 cards: contact / address / payment | Implemented; inline validation on blur, masked card number, MM/YY auto-format, CVV tooltip via Bootstrap |
| Trust badges | SSL banner near pay button | `tt-trust` callout above and inside the form |
| Order confirmation | Order ID, success icon, follow-up CTAs | Renders in-place after submit, `tt_last_order` saved |

**What happens on the page**
- Every state change recomputes subtotal → discount → shipping → VAT → total, and re-renders the side panel.
- Form validation runs per-field on blur, then again on submit; first invalid field is focused and an error toast is announced.
- Successful submit clears the cart, generates `TT-XXXXXXX` order id, and shows a confirmation block — replacing the entire page region rather than navigating, so back-button never re-submits.

**HCI principles demonstrated**
- **Observability**: free-shipping bar shows progress toward a goal; the totals card updates on each interaction.
- **Recoverability**: per-line remove + qty stepper, no "are you sure" dialogs needed; promo errors are reversible.
- **Closure** (Shneiderman): the confirmation screen is unambiguous — large green icon, order number, two next-step CTAs.
- **Error prevention** (Nielsen): masking + auto-formatting of card / expiry; numeric-only zip; checkbox-gated terms.
- **Trust & familiarity**: SSL/PCI/return badges visible near the pay button — directly tackling Arngren's lack of payment trust.

---

## 3. Cross-Cutting HCI Features

| Feature | Where | Mapped principle |
|---|---|---|
| Toast notifications | Every cart/wishlist action | Shneiderman: informative feedback |
| ARIA live region | Cart updates, validation errors, mode changes | Robustness · Universal design |
| Keyboard nav | Tab/Enter/Space/Esc/Arrows everywhere; Ctrl+K focus search | Flexibility · accelerators |
| Skip-to-content link | Top of every page | WCAG 2.1 SC 2.4.1 |
| Accessibility toolbar | Floating settings: text size 16/18/20/22, contrast, motion, audio | Universal design (Mace) |
| Retro Mode | Dense vintage layout while preserving cart/search/a11y | Customizability — honours the legacy fan persona |
| Welcome guide | First-visit only | Recognition over recall — orient the cold-start user |
| Floating help (FAB) | All pages, lower-right | Help and documentation (Nielsen #10) |

---

## 4. Flaw → Solution Map (vs. the Arngren reference)

| Original failure | TeknikkTorget response |
|---|---|
| No structured navigation | Sticky header + persistent sidebar + categorical URLs |
| Visual overload (1000+ items on one page) | 12 cards/page, identical card schema, advanced specs hidden in Quick View |
| Missing alt text & landmarks | `<main>`/`<nav>`/`<aside>` semantic landmarks; alt text on all images; `aria-label` on icon buttons |
| No contrast / size control | Built-in accessibility toolbar with persistent prefs |
| Non-responsive fixed-width table | Bootstrap grid, breakpoints 480/768/1024/1200 px |
| Insecure-feeling checkout | SSL banner, masked card, PCI/SSL/return badges, secure-locked button |
| No user guidance | First-visit welcome guide, floating help FAB, contextual tooltips (CVV) |
| Manual order workflow | Full session-cart, free-shipping bar, zip estimator, promo code, single-page checkout |
| Legacy nostalgia not honoured | Retro Mode preserves density without breaking usability |

---

## 5. Validation Mapping

The implementation directly satisfies the Prompt 1–5 checklists from `PromptList.md`:

- ✅ Bootstrap 5 CSS/JS linked in every page
- ✅ Responsive viewport + Bootstrap grid
- ✅ `custom.css` loads after Bootstrap (overrides win)
- ✅ Each JS file is wrapped in an IIFE — no global leaks beyond the explicit `TT` namespace
- ✅ All paths relative; project runs over `file://` or any static server
- ✅ Brand strictly "TeknikkTorget" in all UI copy / titles / metadata
- ✅ Welcome guide shows once, dismisses, persists in `localStorage`
- ✅ Filters update grid instantly, removable chips reflect state
- ✅ Pagination limits to 12 items; ARIA-announced
- ✅ Cart updates instantly across mini-cart and full cart
- ✅ Free shipping progress bar recalculates on quantity change
- ✅ Inline form validation; submit blocked on errors
- ✅ Trust badges visible near pay button
- ✅ Screen reader announcements via `#tt-live-region`
- ✅ Full keyboard navigation; `Esc` closes overlays
- ✅ A11y toolbar persists via localStorage
- ✅ Retro Mode toggles density without breaking functionality
- ✅ No horizontal scroll at any breakpoint
