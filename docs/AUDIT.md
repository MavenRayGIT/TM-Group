# HubSpot Theme Audit: TM-Group (Read-Only)

## Executive Summary
- The theme relies on HubSpot’s compiled asset pipeline; CSS/JS changes can lag on live due to CDN caching. Cache-busted `require_css` is the current preferred pattern.
- Global CSS includes in `templates/layouts/base.html` are duplicated (both `<link>` and `require_css` for `main.css`), and several files contain broad selectors and heavy `!important` usage, increasing override conflicts.
- JS is globally loaded via `js/main.js`, which inlines Slick (`_slick-min.js`). This loads slider code on every page even though only a subset of modules require it.
- Blog listing uses a separate CSS file (`tmg_blog2.css`) while blog post uses `tmg_blog.css`—largely duplicated styles. This adds maintenance overhead and risk of drift.

---

## 1) Theme Map (Templates, Layouts, Partials, Modules)

### Layouts
- `templates/layouts/base.html`: Primary base layout used by nearly all templates. Includes global CSS/JS and standard header/footer includes.

### Partials (Global)
- `templates/partials/header.html`: Global header (uses `TMG - Header` + `menu` modules).
- `templates/partials/TMG - Light-header.html`: Light header variant (uses `TMG - Header` + `menu`).
- `templates/partials/footer.html`: Global footer (uses `TMG - Footer` + `social-follow`).
- `templates/partials/header-no-navigation.html`: Header without nav (used by `templates/landing-page.html`).

### Templates (by type)
**Blog listing**
- `templates/TMG-blog-index.html` (label: “TMG - Blog listing”): Custom blog listing/tag page, uses `require_css` with cache-bust.
- `templates/blog-index.html` (label: “Boilerplate - blog listing”): Default boilerplate listing.

**Blog post**
- `templates/TMG-blog-post.html` (label: “TMG - blog post”): Uses modules `TMG - Social-sharing`, `TMG - Blog Post image and wistia`, `Download Controller blog`.
- `templates/blog-post.html` (label: “Boilerplate - blog post”).

**System**
- `templates/system/*`: System templates (404/500/login/reset/etc.) use `system.css`.

**Page templates**
- `templates/TM-Group-homepage.html`: Homepage (Hero Slider, Our Story, We Serve, FAQs, Testimonial, Insights).
- `templates/TMG-365-business-central*.html`: Business Central page variants (Banner, 3‑Column, Two‑Column, Industries, Solutions, Testimonial, Insights).
- `templates/TMG-Solutions.html`: Solutions page (Banner + Two Column + FAQs).
- `templates/TMG-family-offices.html`, `templates/TMG-Dark-Nav.html`, `templates/TMG-Light-Nav.html`: Page variants with Banner + sliders + Insights/Testimonial.
- `templates/TMG-Our-Clients.html`: Banner + multiple Two Column blocks.
- `templates/TMG-team.html`: Team module.
- `templates/Addons.html`, `templates/Addons backup.html`: Large templates with inline require_css/require_js blocks.
- `templates/training_management.html`, `templates/hubdb.html`, `templates/contact.html`, `templates/about.html`, `templates/pricing.html`, `templates/home.html`.

### Modules (custom)
Modules live under `modules/*`. Commonly used global modules:
- `TMG - Header.module`, `menu.module`, `TMG - Footer.module`, `social-follow.module` (global partials).

Slider/interactive modules (Slick-based):
- `TMG - Hero Slider`, `TMG - Testimonial`, `TMG - Insights`, `TMG - We serve`, `TMG - Two Column slider`, `TMG - We serve-bk`, `TMG - Two Column` (each contains inline Slick init and styling).

Other content modules:
- `TMG - Banner`, `TMG - Our story`, `TMG - Industries`, `TMG - Solutions`, `TMG - Team`, `TMG - Blog Post image and wistia`, `FAQs non database`, `TMG - Add On Features`, `TMG - ContactModalForPage`, etc.

---

## 2) Asset Loading Matrix

### Global (via `templates/layouts/base.html`)
**CSS**
- `css/main.css` (included twice: `<link>` and `require_css` → duplicate include)
- `css/custom-style.css`
- `css/theme-overrides.css`
- `css/typography.css`
- `css/tools/aos.css`
- Font Awesome CDN

**JS**
- `js/aos.js` (global)
- `js/main.js` (global)
- `standard_header_includes` / `standard_footer_includes`

### Blog Listing / Tag Pages
**Template:** `templates/TMG-blog-index.html`
- CSS: `require_css(get_asset_url("/TM-Group/css/templates/tmg_blog2.css") ~ "?v=...")`
- NOTE: `template_css` is intentionally blank to avoid duplicate loads.

### Blog Post Pages
**Template:** `templates/TMG-blog-post.html`
- CSS: `template_css = "../../css/templates/tmg_blog.css"` (compiled via base layout).
- Modules: Social sharing + Wistia image module + Download Controller.

### System Pages
**Templates:** `templates/system/*`
- CSS: `template_css = "../../css/templates/system.css"`

### Other Templates
**Templates with inline require blocks**
- `templates/Addons.html`, `templates/Addons backup.html`, `templates/training_management.html`: large inline `{% require_css %}` / `{% require_js %}` blocks (non-modular, hard to de-dup).

### Duplicate Includes Observed
- `templates/layouts/base.html`: `css/main.css` is included twice (once via `<link rel="stylesheet">` and once via `require_css`).
- Blog listing: previously had both `template_css` and `require_css` for the same file; now corrected in `TMG-blog-index.html`.

---

## 3) CSS Audit

### `!important` Usage (Top Offenders)
- `css/templates/tmg_blog2.css`: **71**
- `css/templates/tmg_blog.css`: **54**
- `css/typography.css`: **37**
- `css/utilities/_helper.css`: **16**
- `css/templates/system.css`: **12**
- `css/components/header-shared.css`: **8**
- `css/custom-style.css`: **6**
- `css/theme-overrides.css`: **5**

### Global Leak Selectors (High Conflict Risk)
Examples of broad selectors that can leak into module/component scopes:
- `css/theme-overrides.css`: `p { ... }`, `a { ... }` (global tag selectors).
- `css/templates/tmg_blog2.css`: `.blog-tag-nav ul { ... }` (affected nested dropdown `<ul>`).
- `css/typography.css`: `.main_navigation a { ... !important }`, `.social_media a { ... !important }`.

### Repeated Patterns / Duplication
- **Blog CSS duplication**: `css/templates/tmg_blog.css` and `css/templates/tmg_blog2.css` are largely duplicated; changes must be mirrored between blog post and blog listing styles.
- **Slider styles** are repeated across multiple module CSS blocks (testimonial, insights, we-serve, two-column slider).

### Potentially Unused Assets (verify)
These exist but no direct references found in templates (may be included via main.css or unused):
- `js/third_party/_swiper-min.js` (no usage found in templates/modules).
- `css/third-party/_swiper-min.css` (no usage found).

---

## 4) JS Audit

### Global JS (runs on every page)
- `js/main.js` loads globally via base layout.
  - Handles header menu toggles, language switcher, search toggle, email subscription form logic.
  - Initializes AOS (`AOS.init(...)`).
  - Inlines Slick (`{% include './third_party/_slick-min.js' %}`).

### Potential Issues
- **Slick library** is loaded globally via `main.js` even though only certain modules need it (testimonials, insights, sliders). This increases page weight site-wide.
- **AOS** is loaded site-wide but used only on modules with `data-aos` attributes.
- **Swiper** library exists but no evidence of use in templates/modules.

### Duplicated Interaction Patterns
Multiple modules initialize Slick individually with similar logic:
- `TMG - Testimonial`, `TMG - Insights`, `TMG - We serve`, `TMG - Two Column slider`, `TMG - We serve-bk`.
This indicates duplication and potential divergence in behavior/settings.

---

## 5) Optimization Recommendations (No Code Changes Yet)

### Low Risk, High Return
- **Remove duplicate `main.css` include** in `templates/layouts/base.html` (keep `require_css` only).
  - Files: `templates/layouts/base.html`
  - Why: avoid duplicate CSS load and potential re-order issues.
  - Verify: view source to ensure only one `template_main.min.css` reference.

- **Stop loading both `template_css` and `require_css` for the same file** (already fixed for blog listing).
  - Files: `templates/TMG-blog-index.html` (current pattern is correct).
  - Verify: page source shows only one `template_tmg_blog2.min.css` URL.

- **Remove or isolate unused Swiper** if confirmed unused.
  - Files: `js/third_party/_swiper-min.js`, `css/third-party/_swiper-min.css`
  - Verify: `rg -n "swiper" templates modules js` returns only the library itself.

### Medium Risk
- **Load Slick only where needed** (module-scoped load instead of global in `main.js`).
  - Files: `js/main.js`, slider modules (`TMG - Testimonial`, `TMG - Insights`, `TMG - We serve`, `TMG - Two Column slider`)
  - Why: reduce global payload and JS parsing time.
  - Verify: pages without sliders still function; slider pages still initialize correctly.

- **Consolidate blog CSS** (`tmg_blog.css` vs `tmg_blog2.css`) to avoid duplication.
  - Files: `css/templates/tmg_blog.css`, `css/templates/tmg_blog2.css`, `templates/TMG-blog-post.html`, `templates/TMG-blog-index.html`
  - Why: reduce divergence between blog listing and blog post styles.
  - Verify: blog post and blog listing render consistently after consolidation.

### High Blast Radius
- **Refactor global selectors (`p`, `a`, `ul`, etc.)** into scoped classes to reduce !important usage.
  - Files: `css/theme-overrides.css`, `css/typography.css`, `css/templates/tmg_blog2.css`
  - Why: global selectors cause conflicts and drive escalating specificity.
  - Verify: regression test across all main templates and modules.

---

## Notes on HubSpot Bundling & Cache
- HubSpot compiles `template_css` and `require_css` into minified bundles served via CDN.
- Live pages may lag behind preview. Cache-busted `?v=` on `require_css` is preferred for forcing updates.
- Always verify via **View Source** and check compiled bundle content for your selector.
