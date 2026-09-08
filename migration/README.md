# Migration from Mintlify to Astro Starlight

## Scope

The migration initially moved all 70 original MDX pages into `src/content/docs/`, including older pages
outside the main sidebar. Retained pages preserve their extensionless paths. The homepage
remains `/`. `scripts/migrated-routes.json` records the original routes and the
rendered-link checker verifies that each still builds.

The sidebar follows the original `docs.json` order. The original Mintlify
configurations are retained in this folder for reference and are not loaded by
Astro. No published content or assets depend on the Mintlify runtime.

The `docs/` directory contains engineering source references used to produce
player-facing documentation. Those files remain in the repository and are not
published by the Starlight content collection.

## Changes

- Converted Mintlify callouts to Starlight `Aside` components.
- Converted homepage cards to `CardGrid` and `LinkCard` components.
- Moved images, logo, and favicon to `public/`, preserving asset URLs.
- Added title/description frontmatter where missing and migrated `sidebarTitle`.
- Fixed MDX syntax in older pages and preserved explicit section anchor IDs.
- Fixed the FAQ link, the legacy operation link, and a misplaced legacy image reference.
- Added compatibility redirect pages for `/index`, `/development/f.a.q`, and
  `/getting-started/operation.md`.
- Added Pagefind search, a sitemap, responsive media styles, and AnE green accents.
- Removed the Mintlify starter footer's links to Mintlify's social accounts.

## Validation and limitations

The migration passed `npm run validate`: Astro reported no type errors or
warnings, all 70 original routes were present in 74 generated HTML files, and
5,590 local links/assets passed the rendered-site check. All 74 original static
assets were compared byte-for-byte with Git and preserved. The homepage and
Pagefind search were also verified in desktop Chrome; searching for `attachable`
returned the attachable items page and its section links.

Run `npm run validate`, then `npm run preview` for a production preview.
The link checker checks rendered page links, fragment IDs, and local asset URLs.
External websites, wiki-hosted screenshots, and YouTube embeds remain external
and are not guaranteed by the local link check.

The Starlight build replaces the documentation UI and hosting runtime. It does
not reproduce Mintlify account services such as its dashboard, analytics, or AI
assistant. No custom integration for those services was present in `docs.json`.

## Deployment and domain cutover

### Deploy on Netlify

The root `netlify.toml` configures the build and the three HTTP 301 compatibility
redirects. It uses Node.js 22, runs `npm run validate` (including the production
build), and publishes only `dist/`. No Astro server adapter or functions are needed.

1. Commit the entire migration, including new files in `src/`, `public/`,
   `scripts/`, and `migration/`, plus `package.json`, `package-lock.json`,
   `astro.config.mjs`, `tsconfig.json`, `.gitignore`, and `netlify.toml`.
   Include the corresponding removals at the old paths; Git can recognize these
   as moves. Do not use `git commit -am` alone, because it omits new files.
2. If Mintlify still automatically deploys this branch, pause that integration
   before pushing the new layout. Preserve its last working deployment for rollback.
3. Import the repository in Netlify and select your deployment branch. Leave the
   base directory at the repository root and use the committed build settings.
4. Deploy and test the assigned `netlify.app` URL: homepage, a deep page, search,
   images, the legacy FAQ redirect, and an unknown path returning 404.
5. Test the same URL on Verizon cellular and Comcast.
6. Add `docs.anehud.com` under Netlify's domain management. Follow the displayed
   external DNS instructions and replace the existing Mintlify `docs` CNAME with
   the Netlify target. You can keep the existing DNS provider; no nameserver move
   is required for this subdomain.
7. Wait for DNS verification and the HTTPS certificate, then retest the custom
   domain. Keep the Mintlify deployment until the new domain works reliably.

Do not add a catch-all SPA rewrite. Netlify serves the generated HTML pages and
the generated `404.html`. External screenshots and video embeds still depend on
their original hosts. The local build cannot verify Netlify's live TLS or routing.

References: [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
and [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

### Generic static-host checklist

1. Choose a static host with HTTPS and custom-domain support.
2. Use Node.js 22.12 or later, install with `npm ci`, and build with `npm run build`.
3. Publish only `dist/`, not the repository root.
4. Test the preview URL, search, images, deep links, and a nonexistent page.
5. Test on Verizon cellular as well as Comcast before moving the live domain.
6. Add `docs.anehud.com` to the new host and complete its domain/TLS verification.
7. Update the `docs` DNS record to the target provided by the new host.
8. Keep the old Mintlify deployment during DNS propagation and verify the live domain.

For a generic static server, resolve extensionless paths to their `index.html`
files and return `404.html` with a 404 status for unknown paths. Avoid an SPA
fallback: this is a site of individually generated HTML pages. Static redirects
work through generated HTML; configure equivalent HTTP 301 redirects on the
chosen host when available.

DNS and production hosting have not been changed by this repository migration.
If a cutover fails, restore the previous DNS target (`cname.mintlify.builders`)
while investigating. The prior Mintlify source layout is available in Git history.

## Retired pages

The obsolete `optional-add-ons/breeding-gardens-and-forests` implementation guide
was removed at the project owner's request. Its sidebar entry and inbound links
were removed, and it is no longer required by the migrated-route check (69
original routes remain). The current garden directory is documented under
[Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx).
The original Mintlify configuration snapshots above remain historical references.
