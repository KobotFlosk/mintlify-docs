import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.anehud.com',
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/index': '/',
    '/development/source-diagrams': '/development',
    '/development/f.a.q': '/development/faq',
    '/getting-started/operation.md': '/getting-started/operation',
  },
  integrations: [
    starlight({
      title: 'AnE Documentation',
      description: 'Guides for the AnE Fertility and Roleplay System.',
      logo: { src: './public/logo/ane-logo.png', alt: 'AnE Documentation', replacesTitle: true },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start here',
          collapsed: false,
          items: [
            { slug: 'index', label: 'Welcome' },
            { slug: 'getting-started/new-to-ane', label: 'New to AnE' },
            { slug: 'system-guide/system-overview', label: 'System overview' },
            { slug: 'getting-started/operation', label: 'HUD controls' },
            { slug: 'system-guide/companion-dashboard', label: 'Web dashboard' },
            { slug: 'overview/our-features', label: 'Features' },
          ],
        },
        {
          label: 'Characters and stats',
          collapsed: false,
          items: [
            { slug: 'system-guide/accounts-and-profiles', label: 'Accounts and profiles' },
            { slug: 'getting-started/operation/characters', label: 'Character management' },
            { slug: 'getting-started/character/classes-and-forms', label: 'Classes and forms' },
            { slug: 'system-guide/abilities', label: 'Abilities' },
            { slug: 'system-guide/form-shapeshifters', label: 'Shapeshifting' },
            {
              label: 'Stats and fluids',
              collapsed: true,
              items: [
                { slug: 'system-guide/vitality-and-stats', label: 'Vitality and stats' },
                { slug: 'getting-started/stats-hud', label: 'Stats HUD' },
                { slug: 'getting-started/fluids-and-stats', label: 'Fluids and their effects' },
              ],
            },
          ],
        },
        {
          label: 'Species and ancestry',
          collapsed: false,
          items: [
            { slug: 'system-guide/creating-a-species', label: 'Create a species' },
            { slug: 'system-guide/species-compatibility', label: 'Species compatibility' },
            { slug: 'system-guide/ancestry-and-taxonomy', label: 'Ancestry and taxonomy' },
            { slug: 'getting-started/operation/species', label: 'Species settings' },
            { slug: 'getting-started/operation/species-overriding', label: 'Character overrides' },
          ],
        },
        {
          label: 'Roleplay and discovery',
          collapsed: false,
          items: [
            { slug: 'system-guide/search-and-discovery', label: 'Find characters and gardens' },
            { slug: 'system-guide/interaction-and-roleplay', label: 'Scenes and interactions' },
            { slug: 'system-guide/ai-companion', label: 'AI companion' },
          ],
        },
        {
          label: 'Breeding and family',
          collapsed: false,
          items: [
            { slug: 'system-guide/reproduction-and-genetics', label: 'Reproduction and genetics' },
            { slug: 'getting-started/breeding', label: 'Breeding' },
            { slug: 'system-guide/oviposit-rules', label: 'Oviposit rules' },
            { slug: 'getting-started/adoptions', label: 'Adoption' },
            { slug: 'getting-started/knotting-tying', label: 'Knotting and tying' },
            {
              label: 'Conception details',
              collapsed: true,
              items: [
                { slug: 'getting-started/conception', label: 'How conception works' },
                { slug: 'getting-started/conception/character-compatibility', label: 'Character compatibility' },
                { slug: 'getting-started/conception/conception-probability', label: 'Conception probability' },
                { slug: 'getting-started/conception/conception-competition', label: 'Conception competition' },
                { slug: 'getting-started/conception/essence-retention', label: 'Essence retention' },
              ],
            },
          ],
        },
        {
          label: 'Add-ons and items',
          collapsed: false,
          items: [
            { slug: 'system-guide/attachable-items-and-devices', label: 'Items and devices overview' },
            { slug: 'getting-started/attachments', label: 'Manage attachments' },
            { slug: 'system-guide/third-party-integrations', label: 'Product compatibility' },
            {
              label: 'Connections and outfits',
              collapsed: true,
              items: [
                { slug: 'optional-add-ons/rlv-outfits', label: 'RLV outfits' },
                { slug: 'optional-add-ons/lovense', label: 'Lovense' },
                { slug: 'optional-add-ons/telegram-integration', label: 'Telegram' },
                { slug: 'system-guide/web-portal', label: 'Link a service' },
              ],
            },
            {
              label: 'Plugins',
              collapsed: true,
              items: [
                { slug: 'plugins', label: 'All plugins' },
                { slug: 'plugins/ovum-exchanger', label: 'Ovum Exchanger' },
                { slug: 'plugins/oviposition-plugin', label: 'Oviposition' },
                { slug: 'plugins/nectar-extractor-plugin', label: 'Nectar Extractor' },
                { slug: 'plugins/roleplayer-plugin', label: 'RolePlayer' },
                { slug: 'plugins/good-moaning-plugin', label: 'Good Moaning' },
                { slug: 'plugins/project-arousal-plugin', label: 'Project Arousal' },
                { slug: 'plugins/its-not-mine-plugin', label: "It's NOT Mine" },
              ],
            },
            {
              label: 'Items',
              collapsed: true,
              items: [
                { slug: 'items/fluid-container', label: 'Fluid container' },
                { slug: 'items/condoms-pack', label: 'Condoms' },
                { slug: 'items/aging-potion', label: 'Aging potion' },
                { slug: 'items/paternity-tester', label: 'Paternity tester' },
                { slug: 'items/poison-apple', label: 'Poison apple' },
              ],
            },
          ],
        },
        {
          label: 'Credits and store',
          collapsed: false,
          items: [
            { slug: 'getting-started/operation/credit-system', label: 'Earn and use Credits' },
            { slug: 'getting-started/operation/ane-store', label: 'Store and rewards' },
          ],
        },
        {
          label: 'Help and development',
          collapsed: false,
          items: [
            { slug: 'overview/help-and-support', label: 'Help and updates' },
            { slug: 'overview/need-assistance', label: 'Contact support' },
            { slug: 'getting-started/command-line', label: 'Chat commands' },
            { slug: 'development/release-notes', label: 'Release notes' },
            {
              label: 'Developer resources',
              collapsed: true,
              items: [
                { slug: 'development/developers-api', label: 'Developer API' },
                { slug: 'development/builders-kit', label: 'Builders kit' },
                { slug: 'development/faq', label: 'Developer FAQ' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
