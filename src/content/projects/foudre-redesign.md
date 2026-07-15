---
title: "Agence Foudre Redesign"
description: "Re-imagining a premium, cinematic web interface using performant static Astro islands and customized easing shaders."
image: "/projects/foudre-redesign.png"
year: "2026"
role: "Lead Front-end & Shader Dev"
tags: ["Astro", "WebGL", "Tailwind CSS v4"]
client: "Foudre Studio"
url: "https://foudre.co"
featured: true
gridClass: "col-span-12 md:col-span-7"
---

## Reimagining the Digital Avant-Garde

Agence Foudre represents the intersection between modern premium fashion editorials and highly performant creative web spaces. Our main challenge was building a cinematic, fluid scroll architecture that feels organic but maintains a **zero-JS performance profile** for standard copy readers.

### Architectural Decisions

1. **Static Pre-Rendering**: Using Astro, we pre-rendered 98% of the layout. Only the shader-based interactive canvas is loaded client-side via a React island when it enters the viewport (`client:visible`).
2. **GPU-Accelerated Smooth Reveals**: We designed custom cubic-bezier transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) for element reveals, resulting in rendering speeds exceeding 60 FPS even on lower-end mobile devices.
3. **Structured Typography Grid**: The layout shifts dynamically, utilizing Bricolage Grotesque's heavy display characteristics to frame thin vertical grid borders.
