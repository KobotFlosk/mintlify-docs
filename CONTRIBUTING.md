> **Customize this file**: Tailor this template to your project by noting specific contribution types you're looking for, adding a Code of Conduct, or adjusting the writing guidelines to match your style.

# Contribute to the documentation

Thank you for your interest in contributing to our documentation! This guide will help you get started.

## How to contribute

### Option 1: Edit directly on GitHub

1. Navigate to the page you want to edit
2. Click the "Edit this file" button (the pencil icon)
3. Make your changes and submit a pull request

### Option 2: Local development

1. Fork and clone this repository
2. Install Node.js 22.12 or later and run `npm ci`
3. Create a branch for your changes
4. Make changes
5. Edit pages in `src/content/docs/` and run `npm run dev` from the repository root
6. Preview your changes at `http://localhost:4321` and run `npm run validate`
7. Run `npm run preview` to test production search, then commit your changes and submit a pull request

For more details on local development, see the [README](README.md).

Every page needs `title` and `description` frontmatter. Add navigation entries in
`astro.config.mjs`, and use `sidebar.label` in frontmatter for a shorter nav title.
Import components such as `Aside`, `CardGrid`, and `LinkCard` from
`@astrojs/starlight/components`. Store static assets in `public/` and reference them
with root-relative URLs such as `/images/example.png`.

## Writing guidelines

- **Use active voice**: "Run the command" not "The command should be run"
- **Address the reader directly**: Use "you" instead of "the user"
- **Keep sentences concise**: Aim for one idea per sentence
- **Lead with the goal**: Start instructions with what the user wants to accomplish
- **Use consistent terminology**: Don't alternate between synonyms for the same concept
- **Include examples**: Show, don't just tell
