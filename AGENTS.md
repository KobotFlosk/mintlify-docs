# Documentation agent instructions

## Astro Starlight basics

- Configuration lives in `astro.config.mjs` - check it before making structural changes
- Published pages live in `src/content/docs/`; `docs/` holds engineering source references
- Use MDX format for documentation pages
- Run `npm run dev` locally to preview changes before committing
- Run `npm run validate` to check types, build the site, and check rendered links and assets
- Run `npm run preview` to verify production search
- Preserve page paths and explicit anchor IDs so existing bookmarks keep working

## Starlight components

Import built-in components from `@astrojs/starlight/components` for consistent formatting.
Use `Aside` for callouts and `CardGrid` with `LinkCard` for linked cards.
See https://starlight.astro.build/components/using-components/ for available components.

## Style and formatting

- Use active voice and second person ("you")
- Keep sentences concise - one idea per sentence
- Use sentence case for headings
- Write "and" instead of an ampersand in page titles, headings, sidebar labels, and linked document names
- When referencing UI elements, use bold: Click **Settings**
- Use code formatting for: file names, commands, paths, and code references

## Code examples

- Include language identifiers in fenced code blocks
- Add titles to code blocks when relevant: ```javascript title="filename.js"
- Show realistic parameter values, not placeholders like `foo` or `bar`
- Include error handling for API examples

## Content structure

- Add frontmatter (title, description) to every page
- Use `sidebar.label` in frontmatter if the nav title should differ from the page title
- Include introductory context before diving into steps or details
- Add "Next steps" or related links where helpful

## What to avoid

- Don't edit the sidebar in `astro.config.mjs` without understanding the navigation structure
- Don't remove existing pages without checking for inbound links
- Don't use HTML when an MDX component exists for the same purpose
- Don't add pages to navigation that don't exist yet
