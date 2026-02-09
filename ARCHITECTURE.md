# TM Group HubSpot Theme – Architecture & Impact Map

This document describes how the TM Group HubSpot CMS theme is structured, what files do what, and the blast radius of changes.
This site is live. Changes must be scoped carefully.

---

## 1. High-level structure

TM-Group/
- templates/
  - layouts/        # Base layouts (highest blast radius)
  - partials/       # Header / footer / shared chrome
  - system/         # 404, auth, system pages
  - *.html          # Page templates
- modules/          # Custom HubSpot modules (primary unit of change)
- sections/         # Reusable section templates (used by some generic pages)
- css/              # Global styles
- js/               # Global scripts
- images/, fonts/   # Assets

---

## 2. Entry points (highest blast radius)

### Base layout
- `templates/layouts/base.html`
  - Extended by ~34 templates
  - Controls global structure, CSS/JS inclusion, header/footer placement

### Global partials
- `templates/partials/header.html`
- `templates/partials/TMG - Light-header.html`
- `templates/partials/header-no-navigation.html`
- `templates/partials/footer.html`

Changes here affect many or all pages.

---

## 3. Global assets

### Global CSS (loaded in base.html)
- `css/main.css`
- `css/custom-style.css`
- `css/theme-overrides.css`
- `css/typography.css`
- External: Font Awesome, AOS CSS

### Global JS (loaded in base.html)
- `js/main.js`
- `js/aos.js`

Treat these as **Tier 0** files. Changes require explicit approval.

---

## 4. Page systems

### A) Custom TM Group DnD templates
Examples:
- `TM-Group-homepage.html`
- `TMG-365-business-central.html`
- `TMG-365-business-central-drak-header.html`
- `TMG-Light-Nav.html`
- `TMG-Dark-Nav.html`
- `TMG-family-offices.html`

These templates directly compose **custom TMG modules**.

### B) Section-based templates
Examples:
- `home.html`
- `contact.html`
- `pricing.html`
- `qa-test.html`

These assemble pages from `sections/*.html`, which then embed small atomic modules.

The two systems are mostly isolated from each other.

---

## 5. Homepage composition

`templates/TM-Group-homepage.html` includes, in order:
- `TMG - Hero Slider`
- `TMG - Our story`
- `TMG - We serve`
- `FAQs non database`
- `TMG - Testimonial`
- `TMG - Insights`

Homepage changes are usually safest when confined to these modules.

---

## 6. Module usage tiers

### Tier 0 (global reach, extreme caution)
- `TMG - Header`
- `TMG - Footer`
- `menu`
- `social-follow`

Used by header/footer partials and affect site-wide navigation or chrome.

### Tier 1 (shared modules)
Used across multiple templates:
- `TMG - Banner`
- `TMG - Insights`
- `TMG - Testimonial`
- `TMG - Two Column`
- `TMG - Two Column Video`
- `TMG - Two Column slider`
- `FAQs non database`

Changes should be module-scoped and minimal.

### Tier 2 (page-specific, safest)
- `TMG - Hero Slider`
- `TMG - Our story`
- `TMG - We serve`
- `TMG - Team`
- Blog-only modules

Best place to start for visual or content changes.

---

## 7. Sections usage

Only these templates use `sections/*.html`:
- `home.html`
- `contact.html`
- `pricing.html`
- `qa-test.html`

Changes to sections do NOT affect TM Group custom DnD templates.

---

## 8. Change impact rules (operational)

- Changes to `base.html`, global CSS, or global JS affect most or all pages.
- Changes to shared modules affect all templates that reference them.
- Changes inside a single module folder affect only pages using that module.
- Manual `hs upload` = live production deploy.
- Watcher is OFF by default.

## 10. Editor Preview CSS Note

- Editor preview may not load `css/main.css` (or the full global bundle), which causes DnD grid rules (`.row-fluid`, `.span*`) to be missing and columns to stack in the editor only.
- Live pages can still be correct even if the editor stacks.
- Temporary mitigation is an editor-only stylesheet that restores minimal grid rules without affecting live output.

---

## 9. Working discipline

- Prefer module-level changes over template changes.
- Upload the smallest possible unit (single file or single module folder).
- Treat this document as the authoritative map when planning changes.
