# Stack Details

Technical specifications and constraints for the portfolio workspace to maintain maximum performance and minimal JS bundle bloat.

## Technologies

* **Base Framework**: Astro 6.x (SSG mode). All pages are fully pre-rendered to static HTML.
* **Styling**: Tailwind CSS v4 using `@import "tailwindcss"` in global CSS. No external CSS frameworks or Tailwind utility bloat.
* **Interactivity**: Native JavaScript/CSS by default. React is included in `package.json` but is strictly reserved for complex, dynamic interactive states (e.g., interactive filters or contact forms) and must be loaded using Astro's `client:visible` or `client:idle` directives.

## Typography Configuration

- **Headers & Display**: `Bricolage Grotesque` (Google Fonts)
  - Features expressive ink-traps and premium editorial qualities.
  - Used for large headers (`text-4xl` and above).
- **Body Text**: `Plus Jakarta Sans` (Google Fonts)
  - A highly legible, geometric sans-serif that balances the custom expressiveness of Bricolage Grotesque.
  - Used for paragraph copy and general text.
- **Data, Numbers, Accents**: `Geist Mono` (or default system monospace)
  - Clean, narrow developer monospace for metadata, tags, dates, and subtle accents.

## Performance Budgets

* **Page Size Budget**: Target under **50KB** of total JS loaded on the home page.
* **Lighthouse Score**: Maintain a score of **95+** on Mobile/Desktop performance, accessibility, SEO, and best practices.
