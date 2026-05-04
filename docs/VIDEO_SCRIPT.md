# TeknikkTorget — Video Presentation Script
**Target runtime: ≤ 15:00 · YouTube · Public · Comments open**

Recording suggestion: OBS Studio at 1080p 30fps. Two scenes — `Scene 1: Editor (VS Code)`, `Scene 2: Browser (Chrome)`. Use a webcam overlay for the introduction segment if your faculty allows.

---

## 0:00 – 0:30 · Source code proof

**Scene:** VS Code with the `teknikktorget/` folder open in the file tree.
**Narration:**
> "This is TeknikkTorget — a Bootstrap 5 e-commerce site built for the HCI final project. Before we look at the running site, here is the source. The brand is TeknikkTorget; arngren.net is referenced only as a contrast example."

**Action cues**
- Slowly expand `teknikktorget/` folder.
- Open `index.html`; scroll once top-to-bottom.
- Briefly open `js/main.js` and `css/custom.css` to show the IIFE / theme tokens.

---

## 0:30 – 3:00 · Homepage walkthrough

**Scene:** Browser on `index.html`, fresh profile so the welcome guide fires.
**Narration:**
> "On first visit, a 3-step guide orients the user — what we sell, how to find things, how to pay. This addresses Arngren's cold-start problem."

**Action cues**
- 0:30 — show welcome guide step 1 → step 2 → step 3 → "Start shopping"
- 1:00 — hover over the sticky navbar; press Ctrl+K to focus search.
- 1:15 — type "drone"; show the dropdown with two matches and `↑/↓` keyboard nav.
- 1:35 — press Esc, close the dropdown.
- 1:45 — scroll to the bento grid; click "Robotics"; bounce back.
- 2:10 — scroll to Featured Products, click filter pill "On Sale"; the grid re-renders.
- 2:30 — click `add_shopping_cart` on a product → toast appears, cart badge updates.
- 2:50 — open the mini-cart drawer briefly and close it.

**HCI callouts to narrate**
- *Familiarity*: search top-centre, cart top-right.
- *Synthesisability*: every product card has the same schema.
- *Feedback*: toast + badge + ARIA announcement on every add.

---

## 3:00 – 7:30 · Catalog: search, filters, Quick View, pagination

**Scene:** Click "Catalog" in nav.
**Narration:**
> "The catalog page implements the blueprint's filtering surface — categories on the left, brand/price/motor/battery filters, and a 12-per-page grid."

**Action cues**
- 3:00 — pick "Drones" from the sidebar; the result count animates.
- 3:30 — change Sort to "Price: low to high"; the grid reorders.
- 4:00 — set "Min" price; an active-filter chip appears. Click the chip's `×` to remove it.
- 4:30 — change view from grid to list; show that the same card data renders compactly.
- 5:00 — click "Quick View" on a card; modal shows full specs without leaving the grid.
- 5:30 — close the modal with `Esc` (announce that keyboard works everywhere).
- 6:00 — clear all filters; demonstrate pagination by clicking page 2.
- 6:30 — type a query in the navbar search and pick a result with the keyboard — it deep-links to `catalog.html?open=<id>` with the Quick View pre-opened.

**HCI callouts**
- *Recoverability*: every chip is one click to remove; nothing is destructive.
- *Multi-threading*: Quick View doesn't lose scroll position.
- *Accelerators*: keyboard arrow keys + Enter in the autocomplete.

---

## 7:30 – 11:00 · Cart, shipping estimator, checkout

**Scene:** Click the cart icon.
**Narration:**
> "The cart computes a free-shipping bar in real time, accepts a postal code for shipping estimates, and gates checkout behind validated input."

**Action cues**
- 7:30 — increment quantity using the stepper; watch the line total + free-shipping bar move.
- 8:00 — type a 4-digit postal code, click Estimate; the estimate appears in a polite live region.
- 8:30 — apply promo code `TT10`; success toast + 10% discount in the totals.
- 9:00 — click "Proceed to checkout".
- 9:15 — fill in contact + address.
- 9:45 — type a card number; observe automatic 4-4-4-4 masking. Type "12/26" in expiry; observe auto-slash.
- 10:10 — hover the CVV `?` icon; the Bootstrap tooltip appears.
- 10:25 — try to submit without ticking Terms; the field is highlighted and focus moves there.
- 10:40 — tick Terms, submit; the page replaces itself with the confirmation block.

**HCI callouts**
- *Closure*: the order confirmation page is unambiguous.
- *Error prevention*: masking + auto-format prevent typos before they happen.
- *Trust*: SSL banner above the form, padlock on the pay button, badges below.

---

## 11:00 – 13:30 · HCI highlights: feedback, mapping, accessibility, retro

**Scene:** Back on the homepage.
**Narration:**
> "The blueprint requires universal access. Here's the accessibility toolbar."

**Action cues**
- 11:00 — open the a11y toolbar (icon in header). Increase text size to A++. Toggle "High contrast"; observe the inverted scheme. Toggle "Reduce motion"; the marquee animation stops.
- 11:40 — narrate that all settings persist via `localStorage.tt_a11y`.
- 12:00 — click "Retro Mode". The site flips to dense layout, Comic Sans-style brand, scrolling marquee — *but* the cart, search, accessibility settings, and responsive grid all still work.
- 12:40 — toggle Retro Mode off again; layout returns to modern.
- 13:00 — quick-show the floating help button → modal with FAQ / contact / chat links.

**HCI callouts**
- *Mace's universal design*: one product, multiple modalities.
- *Customizability*: Retro Mode satisfies the nostalgia persona without sacrificing usability.

---

## 13:30 – 14:30 · Conclusion + submission compliance

**Narration:**
> "TeknikkTorget directly answers the six HCI learning tasks: it critiques Arngren by replacing every flaw with a measurable solution, it embeds Dix's principles of learnability/flexibility/robustness, it applies Shneiderman's golden rules and Nielsen's heuristics, and it includes a universal-design accessibility toolbar plus a Retro Mode for the legacy persona. The video, source bundle, run instructions and three-page comparison are all included in the submission folder."

**Action cues**
- Brief slide / overlay listing: code, docs, video, screenshots.

---

## 14:30 – 15:00 · YouTube upload checklist

Speak as text-on-screen or narration:
- Upload video as **Public**.
- Comments enabled.
- Description includes Google Drive folder link + GitHub (if used).
- Add chapters matching the timestamps above.
- Tag: *HCI*, *e-commerce*, *Bootstrap 5*, *accessibility*, *TeknikkTorget*.

End card: "TeknikkTorget — Final Project · HCI · 2026".
