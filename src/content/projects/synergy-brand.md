---
title: "Synergy Brand Collective"
description: "A poster-led branding project and digital storefront built for a contemporary arts and design collective."
image: "/projects/synergy-brand.png"
year: "2026"
role: "Fullstack Developer"
tags: ["Ecommerce", "Svelte", "Astro"]
client: "Synergy Collective"
url: "https://synergy.arts"
featured: true
gridClass: "col-span-12 md:col-span-8 md:col-start-3 md:mt-12"
---

## Redefining Creative Synergy

Synergy Brand Collective is an e-commerce platform and poster archive showcasing limited-edition physical prints. The design direction leverages **stark brutalist spacing** and deep high-contrast dark tones.

### Tech Stack Details

1. **Lightweight Cart Logic**: We avoided heavy libraries and built a custom shopping cart state using native Astro script storage combined with Svelte state stores, keeping the client bundle size under 4KB.
2. **Dynamic Route Generation**: Project pages, catalog pages, and dynamic filter routes are fully pre-rendered at build time.
3. **High Fidelity Image Pacing**: Large, uncompressed-looking visual elements are optimized at build time via Astro's `<Image />` component, delivering crisp, compressed webp resources.
---
