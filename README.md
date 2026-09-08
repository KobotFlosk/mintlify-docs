# AnE documentation

The AnE Fertility and Roleplay System documentation uses Astro Starlight. It builds
to static HTML with local Pagefind search, mobile navigation, and light/dark themes.

## Local development

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. Edit published pages in `src/content/docs/`.
Keep a page's relative path when editing it so existing links continue to work.
The engineering source references in `docs/` remain separate from published pages.

## Validate changes

```sh
npm run validate
```

This checks Astro types and content, builds the site, and checks rendered internal
links, anchors, local assets, and all 70 migrated page routes. External links are
not crawled. Pagefind search is generated during the production build.

```sh
npm run preview
```

Open `http://localhost:4321` to test the production build, including search.

## Project structure

- `src/content/docs/`: published MDX pages.
- `src/content.config.ts`: Starlight content schema and loader.
- `astro.config.mjs`: site URL, sidebar, logo, and compatibility redirects.
- `src/styles/custom.css`: AnE colors and responsive media styling.
- `public/`: images, logo, favicon, and other files copied directly to the build.
- `docs/`: engineering references used to maintain player-facing documentation.
- `migration/`: original Mintlify configuration and migration notes, outside the build.

## Hosting

### Netlify

Import this repository in Netlify. The root `netlify.toml` sets Node.js 22,
the build command `npm run validate`, and the publish directory `dist`.
Leave the base directory at the repository root. Commit `package-lock.json`
along with all migrated source files and assets; do not commit `dist/` or
`node_modules/`. This static site does not need the Netlify Astro adapter.

Test the generated `netlify.app` URL before adding `docs.anehud.com` and changing
DNS. See [the Netlify cutover steps](migration/README.md#deploy-on-netlify).

### Other static hosts

Run `npm ci` and `npm run build`, then serve `dist/` with a static web server.
The build requires no running Node.js server, Mintlify account, or database.
Configure the host to resolve extensionless paths such as
`/system-guide/attachable-items-and-devices` to the corresponding `index.html`.
Serve `404.html` for unknown paths; do not use an SPA fallback to the homepage.

The canonical site URL is `https://docs.anehud.com`. Astro emits static redirect
pages for the compatibility routes in `astro.config.mjs`; configure equivalent
HTTP 301 redirects on your host when possible.

Before moving the live domain, deploy a preview and test it on Verizon cellular
as well as Comcast. Then provision HTTPS on the chosen host and update the `docs`
DNS record using that host's instructions. Keep the Mintlify deployment available
until the new site has been verified. Changing the framework alone does not
establish or fix the cause of the Verizon connectivity problem.

See [the migration notes](migration/README.md) for scope and deployment details.
