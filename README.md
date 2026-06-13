# NILE FOODS — WEBSITE HANDOFF
## Developer: Antigravity
## Project: nilafoods.vercel.app (or chosen domain)

---

## PROJECT OVERVIEW

Static website for Nile Foods — a ghost kitchen fast food delivery business based in Gikondo, Kigali, Rwanda. No backend required. The ordering flow works by building a WhatsApp message on the client side and redirecting the user to open it in WhatsApp.

---

## FILE STRUCTURE

```
nile-foods/
├── index.html          ← Single-page site (all sections)
├── vercel.json         ← Vercel deployment config
├── css/
│   └── style.css       ← All styles
├── js/
│   └── app.js          ← Cart logic + WhatsApp dispatch + UI
└── images/             ← Drop all food photos here (see list below)
```

---

## DEPLOYMENT (VERCEL)

1. Push this folder to a GitHub repo (e.g. `nile-foods-website`)
2. Go to vercel.com → New Project → Import from GitHub
3. No build step needed — it's pure HTML/CSS/JS
4. Vercel will detect it as a static site automatically
5. Set a custom domain if needed (e.g. nilefoods.rw or nilafoods.vercel.app)

---

## WHATSAPP NUMBER

The order is sent to: **+250785177046**

Located in `js/app.js` line 4:
```js
const WHATSAPP_NUMBER = '250785177046';
```
Change this if the number changes.

---

## IMAGE PLACEHOLDERS — REPLACE THESE

All images go inside the `images/` folder. Current placeholder filenames:

| File name | What it shows |
|---|---|
| `images/hero-food.jpg` | Hero section — main food showcase image (shown in a circle) |
| `images/4pc-chicken.jpg` | 4 Pieces Chicken & Chips |
| `images/6pc-chicken.jpg` | 6 Pieces Chicken & Chips |
| `images/8pc-chicken.jpg` | 8 Pieces Chicken & 2 Chips |
| `images/12pc-chicken.jpg` | 12 Pieces Chicken & 3 Chips |
| `images/full-chicken.jpg` | Full Chicken & 2 Chips |
| `images/beef-burger.jpg` | Beef Burger & Chips |
| `images/chicken-burger.jpg` | Chicken Burger & Chips |
| `images/double-burger.jpg` | Double Beef Burger & Chips |
| `images/wrap.jpg` | Wrap & Chips |
| `images/kitchen.jpg` | About section kitchen photo |

**All images have `onerror` fallbacks** — if a file is missing, the slot shows an emoji placeholder instead of breaking. So the site works fine before photos are added.

Recommended image dimensions:
- Menu cards: 800×600px or wider (displayed at 260×180px, retina-ready)
- Hero circle: 800×800px square/circular crop preferred
- Kitchen/about: 1200×800px landscape

---

## LOGO

The site currently uses a **text-based logo** (`NILE FOODS` in Syne font) as a placeholder.

To replace with the actual logo:
1. Add `images/logo.png` (or `.svg` preferred)
2. In `index.html`, find this block in the `<header>`:
   ```html
   <a href="#" class="logo">
     <span class="logo-text">NILE <span class="logo-accent">FOODS</span></span>
   </a>
   ```
3. Replace with:
   ```html
   <a href="#" class="logo">
     <img src="images/logo.png" alt="Nile Foods" style="height:40px; width:auto;" />
   </a>
   ```

---

## BRAND COLORS

```css
--red: #E31E24       ← Primary brand red
--red-dark: #B71C1C  ← Hover states
--red-light: #FFEBEE ← Soft background tint
--white: #FFFFFF
--dark: #1A1A1A
```

All in `css/style.css` under `:root`.

---

## HOW THE ORDER FLOW WORKS

1. Customer browses menu and clicks **"+ Add"** on items
2. Items go into the JS cart object (in memory)
3. A floating cart button appears at the bottom of the screen showing item count + total
4. Customer clicks **"Send Order on WhatsApp"** after filling in their name, phone, and delivery address
5. JS builds a formatted WhatsApp message with full order details
6. Browser opens WhatsApp (`wa.me/250785177046?text=...`) with the message pre-filled
7. Customer sends it — that's the order received

**No server, no database, no payment gateway.** Pure client-side.

---

## DELIVERY ZONE NOTE (SHOWN ON SITE)

Free delivery for most of Kigali.
The following areas are listed on the site as requiring **+1,000 RWF extra**:
- Kabuga, Masaka, Karuruma, Norvege, Zindiro, Bumbogo, Rugende, Giticyinyoni

This is a static notice only — the site does not auto-calculate the surcharge. It's handled via WhatsApp conversation after the order is received.

---

## OPERATING HOURS (SHOWN ON SITE)

**10am – 10pm, every day**

To change: search for `10am` or `10pm` in `index.html` — appears in ~3 places.

---

## CONTACT NUMBERS (SHOWN ON SITE)

- Primary WhatsApp orders: 0785 177 046
- Alternative call line: 0735 564 002

---

## FONTS (LOADED FROM GOOGLE FONTS)

- **Syne** (700, 800) — display / headings
- **Inter** (400, 500, 600) — body text

Both loaded via `<link>` in `<head>` of `index.html`. Works without internet only if you pre-bundle them.

---

## SECTIONS ON THE PAGE

1. **Nav** — sticky, responsive, hamburger on mobile
2. **Hero** — headline, CTA buttons, circular food image
3. **Delivery Banner** — dark strip explaining delivery zones
4. **Menu** — filterable by category tabs (All / Chicken / Burgers & Wraps), card grid with Add buttons
5. **Order / Cart** — cart on left, delivery details form on right
6. **About** — story, stats, kitchen photo
7. **Contact** — 4 cards (WhatsApp, Call ×2, Location) on red background
8. **Footer**
9. **Floating Cart Button** — fixed at bottom, appears after first item is added

---

## THINGS THAT DO NOT NEED A BACKEND

- ✅ Menu browsing
- ✅ Cart management (in-memory JS)
- ✅ WhatsApp order dispatch
- ✅ Delivery zone info display

## THINGS TO ADD IN FUTURE (IF NEEDED)

- Order tracking / confirmation page
- Online payment (MTN MoMo / Airtel Money integration)
- Customer review/rating system
- Admin dashboard for order tracking

---

## NOTES FOR ANTIGRAVITY

- No npm, no build tools, no bundler — this is intentionally zero-dependency static HTML
- Deploy directly to Vercel as a static site (framework: None / Other)
- The `vercel.json` handles clean URLs
- Test on both Android (Chrome) and iOS (Safari) — especially the WhatsApp redirect
- The `wa.me` redirect works on both mobile and desktop WhatsApp
- All form inputs use `id` attributes — easy to target if you want to add validation library later

---

*Handoff prepared for Nile Foods — Gikondo, Kigali, Rwanda*
