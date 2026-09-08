import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.anehud.com',
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/index': '/',
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
    "label": "Overview",
    "items": [
      {
        "slug": "index"
      },
      {
        "slug": "overview/our-features"
      },
      {
        "slug": "overview/need-assistance"
      },
      {
        "slug": "overview/help-and-support"
      },
      {
        "slug": "getting-started/new-to-ane"
      }
    ]
  },
  {
    "label": "SYSTEM GUIDE",
    "items": [
      {
        "slug": "system-guide/system-overview"
      },
      {
        "slug": "system-guide/accounts-and-profiles"
      },
      {
        "slug": "system-guide/vitality-and-stats"
      },
      {
        "slug": "system-guide/interaction-and-roleplay"
      },
      {
        "slug": "system-guide/reproduction-and-genetics"
      },
      {
        "slug": "system-guide/species-compatibility"
      },
      {
        "slug": "system-guide/creating-a-species"
      },
      {
        "slug": "system-guide/form-shapeshifters"
      },
      {
        "slug": "system-guide/ai-companion"
      },
      {
        "slug": "system-guide/companion-dashboard"
      },
      {
        "slug": "system-guide/search-and-discovery"
      },
      {
        "slug": "system-guide/web-portal"
      },
      {
        "slug": "system-guide/third-party-integrations"
      },
      {
        "slug": "system-guide/attachable-items-and-devices"
      }
    ]
  },
  {
    "label": "〽️ Operation",
    "items": [
      {
        "slug": "getting-started/operation"
      },
      {
        "slug": "getting-started/operation/characters"
      },
      {
        "slug": "getting-started/operation/species"
      },
      {
        "slug": "getting-started/operation/species-overriding"
      },
      {
        "slug": "getting-started/operation/species-compatibility"
      },
      {
        "slug": "getting-started/operation/credit-system"
      },
      {
        "slug": "getting-started/operation/ane-store"
      }
    ]
  },
  {
    "label": "🤰 Conception",
    "items": [
      {
        "slug": "getting-started/conception"
      },
      {
        "slug": "getting-started/breeding"
      },
      {
        "slug": "getting-started/conception/character-compatibility"
      },
      {
        "slug": "getting-started/conception/conception-probability"
      },
      {
        "slug": "getting-started/conception/conception-competition"
      },
      {
        "slug": "getting-started/conception/essence-retention"
      }
    ]
  },
  {
    "label": "Getting Started",
    "items": [
      {
        "slug": "getting-started/knotting-tying"
      },
      {
        "slug": "getting-started/fluids-and-stats"
      },
      {
        "slug": "getting-started/stats-hud"
      },
      {
        "slug": "getting-started/adoptions"
      },
      {
        "slug": "getting-started/packs"
      },
      {
        "slug": "getting-started/command-line"
      },
      {
        "slug": "getting-started/attachments"
      }
    ]
  },
  {
    "label": "OPTIONAL ADD-ONS",
    "items": [
      {
        "slug": "optional-add-ons/rlv-outfits"
      },
      {
        "slug": "optional-add-ons/lovense"
      },
      {
        "slug": "optional-add-ons/breeding-gardens-and-forests"
      },
      {
        "slug": "optional-add-ons/telegram-integration"
      }
    ]
  },
  {
    "label": "PLUGINS",
    "items": [
      {
        "slug": "plugins"
      },
      {
        "slug": "plugins/ovum-exchanger"
      },
      {
        "slug": "plugins/roleplayer-plugin"
      },
      {
        "slug": "plugins/nectar-extractor-plugin"
      },
      {
        "slug": "plugins/oviposition-plugin"
      },
      {
        "slug": "plugins/good-moaning-plugin"
      },
      {
        "slug": "plugins/project-arousal-plugin"
      },
      {
        "slug": "plugins/its-not-mine-plugin"
      }
    ]
  },
  {
    "label": "ITEMS",
    "items": [
      {
        "slug": "items/fluid-container"
      },
      {
        "slug": "items/condoms-pack"
      },
      {
        "slug": "items/aging-potion"
      },
      {
        "slug": "items/paternity-tester"
      },
      {
        "slug": "items/poison-apple"
      }
    ]
  },
  {
    "label": "DEVELOPMENT",
    "items": [
      {
        "slug": "development/release-notes"
      },
      {
        "slug": "development/developers-api"
      },
      {
        "slug": "development/builders-kit"
      },
      {
        "slug": "development/faq"
      }
    ]
  }
],
    }),
  ],
});
