# Rainy Days – JavaScript 1 Course Assignment

E-commerce front-end for **Rainy Days** (outdoor clothing), built with HTML, CSS and vanilla JavaScript.
Product data will be fetched from the [Noroff Rainy Days API](https://docs.noroff.dev/docs/v2/e-commerce/rainy-days).

This project continues my Rainy Days site from the HTML & CSS course, rebuilt with a new structure,
design tokens (CSS variables), BEM naming and a Figma style guide.

## Status

- [x] Design in Figma – style guide, components, desktop + mobile screens
- [x] HTML + CSS for all pages (static example content)
- [ ] JavaScript – products from the API, product page by `?id=`, filters, loader + error messages
- [ ] JavaScript – cart in localStorage, checkout → confirmation
- [ ] QA (W3C, WAVE, Lighthouse, keyboard, browsers) + report

> Product cards, the product page and the cart currently show **static example content** so the layout
> can be built and tested. In the JS stage it is replaced by data from the API / localStorage
> (the CA does not allow hard-coded products). Places to replace are marked with HTML comments.

## Structure

```
index.html                         home page + product list (bestsellers)
category/womens.html               women's jackets (filters + grid)
category/mens.html                 men's jackets
product/index.html                 product details (?id= in the JS stage)
checkout/index.html                cart summary + checkout form
checkout/confirmation/index.html   order confirmation
terms.html, privacy.html           legal pages (placeholder text, see AI_LOG.md)
css/
  main.css                         only @imports
  variables.css                    design tokens – same names as the Figma variables
  base.css                         reset, typography, utilities
  components.css                   btn, icon, product-card, fields, chips, cart-item, loader, alert…
  layout.css                       container, header + nav, page hero, footer
  pages/                           home, products, product, checkout, legal
js/                                ES modules (JS stage)
assets/icons/icon-*.svg            one icon set (Lucide + X logo), used as CSS masks
assets/images/*.webp               kebab-case names, alt texts in alt-texts.csv
```

## Conventions

- **BEM** class names (`product-card__title`, `btn--accent`), the same names as the layers/components in Figma.
- **CSS variables for everything** – colours, font sizes, spacing, radius, shadows. Mobile overrides the
  variables in one `@media (max-width: 768px)` block, component fixes sit at the end of each file.
- Desktop-first, one breakpoint (768px). No inline styles, no `!important` (except the standard
  `prefers-reduced-motion` override).
- Every page: one unique `<h1>`, title, meta description, canonical, favicon, Open Graph.
- Accessibility: skip link, visible `:focus-visible`, labels on every field, `aria-hidden` on decorative
  icons, text alternatives for icon-only buttons. Contrast checked (axe: 0 issues).
- Prettier: 2 spaces, double quotes, `printWidth: 100`.

## Links

- Live: https://kacperkijno.github.io/js1-ca-rainy-days/
- Figma: https://www.figma.com/design/LJ90kmcmhlgTC90y0gjLWQ

## Tech

- HTML, CSS (no frameworks), vanilla JavaScript (ES modules, async/await)
- Noroff API v2 – `https://v2.api.noroff.dev/rainy-days`
- Fonts: Bebas Neue + Barlow (Google Fonts)
- Deployed with GitHub Pages

## AI usage

See [AI_LOG.md](AI_LOG.md).
