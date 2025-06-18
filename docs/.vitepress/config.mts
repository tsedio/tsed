// @ts-ignore
import {apiAnchor} from "@tsed/vitepress-theme/markdown/api-anchor/api-anchor.js";
import {defineConfig} from "vitepress";
import pkg from "../../package.json";
import referenceSidebar from "../public/reference-sidebar.json";
import team from "../team.json";

const sort = (items: { text: string; link: string }[]) => items.sort((a, b) => a.text.localeCompare(b.text))

const Introduction = [
  {
    text: "Introduction",
    items: [
      {text: "What is Ts.ED?", link: "/introduction/what-is-tsed"},
      {text: "What's new in v8?", link: "/introduction/what-is-news-v8"},
      {text: "Capabilities", link: "/introduction/capabilities"},
      {text: "Installation", link: "/introduction/getting-started"},
      {text: "Create your first controller", link: "/introduction/create-your-first-controller"},
      {
        text: "Cheat sheet",
        link: "/introduction/cheat-sheet"
      }
    ]
  },
  {
    text: "Migration",
    items: [
      {text: "Migrate from v7", link: "/introduction/migrate-from-v7"},
      {text: "Migrate v6 to v7", link: "/introduction/migrate-from-v6"},
      {text: "Migrate from Express", link: "/introduction/migrate-from-express"}
    ]
  }
];

const Docs = [
  {
    text: "Configuration",
    items: [
      {text: "Introduction", link: "/docs/configuration/"},
      {text: "Configuration sources", link: "/docs/configuration/configuration-sources"},
      {text: "Server options", link: "/docs/configuration/server-options"},
      {text: "Express.js", link: "/docs/configuration/express"},
      {text: "Koa.js", link: "/docs/configuration/koa"},
      {text: "Fastify.js", link: "/docs/configuration/fastify"}
    ]
  },
  {
    text: "Fundamentals",
    items: [
      {
        text: "Introduction",
        link: `/docs/controllers`
      },
      {
        text: "DI & Providers",
        link: `/docs/providers`
      },
      {
        text: "Models",
        link: `/docs/model`
      },
      {
        text: "Json Mapper",
        link: `/docs/json-mapper`
      },
      {
        text: "Middlewares",
        link: `/docs/middlewares`
      },
      {
        text: "Pipes",
        link: `/docs/pipes`
      },
      {
        text: "Interceptors",
        link: `/docs/interceptors`
      },
      {
        text: "Validation",
        link: `/docs/validation`
      },
      {
        text: "Authentication",
        link: `/docs/authentication`
      },
      {
        text: "Hooks",
        link: `/docs/hooks`
      },
      {
        text: "Response filter",
        link: `/docs/response-filter`
      },
      {
        text: "Exceptions",
        link: `/docs/exceptions`
      },
      {
        text: "Logger",
        link: `/docs/logger`
      },
      {
        text: "Context",
        link: `/docs/request-context`
      },
      {
        text: "Testing",
        link: `/docs/testing`
      }
    ]
  },
  {
    text: "Advanced",
    items: [
      {
        text: "Cache",
        link: `/docs/cache`
      },
      {
        text: "Platform API",
        link: `/docs/platform-api`
      },
      {
        text: "Platform Adapter",
        link: `/docs/platform-adapter`
      },
      {
        text: "Platform AWS",
        link: `/docs/platform-serverless`
      },
      {
        text: "Platform Serverless HTTP",
        link: `/docs/platform-serverless-http`
      },
      {
        text: "Command",
        link: `/docs/command`
      },
      {
        text: "Custom decorators",
        link: "/docs/custom-endpoint-decorators"
      },
      {
        text: "Custom providers",
        link: "/docs/custom-providers"
      },
      {
        text: "Templating",
        link: `/docs/templating`
      },

      {
        text: "Session & Cookies",
        link: `/docs/session`
      },
      {text: "Upload files", link: "/docs/upload-files"},
      {text: "Customize 404", link: "/docs/not-found-page"},
      {text: "Api references", link: "/api"}
    ]
  }
];

const Plugins = [
  {
    text: "Links",
    items: [
      {
        text: "Marketplace",
        link: "/plugins/index"
      },
      {
        text: "Install premium plugins",
        link: "/plugins/premium/install-premium-plugins"
      },
      {
        text: "Create your own plugins",
        link: "/plugins/create-your-own-plugins"
      }
    ]
  },
  {
    text: "Premium ConfigSource",
    items: [
      {
        text: "AWS Secrets Manager",
        link: "/plugins/premium/config-source/aws-secrets"
      },
      {
        text: "IORedis ",
        link: "/plugins/premium/config-source/ioredis"
      },
      {
        text: "Mongo",
        link: "/plugins/premium/config-source/mongo"
      },
      {
        text: "Postgres",
        link: "/plugins/premium/config-source/postgres"
      },
      {
        text: "Vault",
        link: "/plugins/premium/config-source/vault"
      }
    ]
  },
  {
    text: "Premium TestContainers",
    items: [
      {
        text: "Redis",
        link: "/plugins/premium/testcontainers/redis"
      },
      {
        text: "LocalStack",
        link: "/plugins/premium/testcontainers/localstack"
      },
      {
        text: "Mongo",
        link: "/plugins/premium/testcontainers/mongo"
      },
      {
        text: "Postgres",
        link: "/plugins/premium/testcontainers/postgres"
      },
      {
        text: "Vault",
        link: "/plugins/premium/testcontainers/vault"
      }
    ]
  }
];

const Tutorials = [
  {
    text: "Authentication & Security",
    items: sort([
      {text: "Passport.js", link: "/tutorials/passport"},
      {text: "Keycloak", link: "/tutorials/keycloak"},
      {text: "OIDC", link: "/tutorials/oidc"}
    ])
  },
  {
    text: "API & Documentation",
    items: sort([
      {text: "Swagger", link: "/tutorials/swagger"},
      {text: "GraphQL", link: "/tutorials/graphql"},
      {
        text: "Scalar",
        link: `/tutorials/scalar`
      },
      {
        text: "Schema Formio",
        link: `/tutorials/schema-formio`
      },
    ])
  },
  {
    text: "ORM",
    items: sort([
      {
        text: "Prisma",
        link: `/tutorials/prisma`
      },
      {
        text: "MikroORM",
        link: `/tutorials/mikroorm`
      },
      {
        text: "TypeORM",
        link: `/tutorials/typeorm`
      },
      {
        text: "Mongoose",
        link: `/tutorials/mongoose`
      },
      {
        text: "Objection.js",
        link: `/tutorials/objection`
      },
      {
        text: "IORedis",
        link: `/tutorials/ioredis`
      }
    ])
  },
  {
    text: "Orchestration & Workflow",
    items: sort([

      {
        text: "Agenda",
        link: `/tutorials/agenda`
      },
      {
        text: "Pulse",
        link: `/tutorials/pulse`
      },
      {
        text: "BullMQ",
        link: `/tutorials/bullmq`
      },
      {
        text: "Temporal",
        link: `/tutorials/temporal`
      },
    ])
  },
  {
    text: "Testing",
    items: sort([
      {
        text: "Jest",
        link: `/tutorials/jest`
      },
      {
        text: "Vitest",
        link: `/tutorials/vitest`
      },
    ])
  },
  {
    text: "Third-parties",
    items: sort([
      {
        text: "Socket.io",
        link: `/tutorials/socket-io`
      },
      {
        text: "Stripe",
        link: `/tutorials/stripe`
      },
      {
        text: "Serverless",
        link: `/tutorials/serverless`
      },
      {
        text: "Terminus",
        link: `/tutorials/terminus`
      },
      {
        text: "Vike",
        link: `/tutorials/vike`
      },
      {
        text: "Server-sent events",
        link: `/tutorials/server-sent-events`
      }
    ])
  }
];

const Releases = [
  {
    text: "Releases",
    link: "https://github.com/tsedio/tsed/releases"
  },
  {
    text: "v7 (maintenance)",
    link: "https://v7.tsed.dev"
  },
  {
    text: "v6 (obsolete)",
    link: "https://v6.tsed.dev"
  },
  {
    text: "v5 (obsolete)",
    link: "https://v5.tsed.dev"
  },
  {
    text: "Contributing",
    link: "https://github.com/tsedio/tsed/blob/production/CONTRIBUTING.md"
  },
  {
    text: "Team",
    link: "/more/team"
  }
];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ts.ED a modern Node.js/Bun.js framework built with TypeScript on top of Express.js/Koa.js/Fastify.js/CLI/AWS",
  lastUpdated: true,
  description: "Ts.ED offers a flexible and easy-to-learn structure designed to enhance the developer experience. It provides decorators, guidelines, and supports Node.js, Bun.js, Express.js, Koa.js, Fastify.js, CLI, and serverless architectures (e.g., AWS).",
  sitemap: {
    hostname: "https://tsed.dev"
  },

  head: [
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/tsed.svg' }],
    ["link", {rel: "icon", type: "image/png", href: "/tsed-og.png"}],
    ["link", {rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon"}],
    ["link", {rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32"}],
    ["link", {rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16"}],
    ["link", {rel: "icon", href: "/apple-touch-icon.png", type: "image/x-icon", sizes: "180x180"}],
    ["meta", {name: "theme-color", content: "#5f67ee"}],
    ["meta", {property: "og:type", content: "website"}],
    ["meta", {property: "og:locale", content: "en"}],
    ["meta", {
      property: "og:title",
      content: "Ts.ED a modern Node.js/Bun.js framework built with TypeScript on top of Express.js/Koa.js/Fastify.js/CLI/AWS"
    }],
    ["meta", {property: "og:site_name", content: "Ts.ED"}],
    ["meta", {property: "og:image", content: "https://tsed.dev/tsed-og.png"}],
    ["meta", {property: "og:url", content: "https://tsed.dev/"}],
    [
      "script",
      {async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-3M3Q4QME6H&cx=c&_slc=1"}
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3M3Q4QME6H');`
    ]
  ],

  themeConfig: {
    logo: "/tsed.svg",
    siteTitle: false,
    apiUrl: "/api.json",
    team,
    apiRedirectUrl: "",
    repo: "tsedio/tsed",
    githubProxyUrl: "https://api.tsed.io/rest/github/tsedio/tsed",
    editLink: {
      pattern: "https://github.com/tsedio/tsed/edit/production/docs/:path"
    },
    search: {
      provider: "algolia",
      options: {
        appId: "DH8VVM2E1E",
        apiKey: "9a1620e0f36bc5dc3b0982fdcbdd6f5f",
        indexName: "ts_ed"
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // {text: "Home", link: "/"},
      {
        text: "Getting started",
        items: Introduction
      },
      {
        text: "Documentation",
        items: Docs
      },
      {
        text: "Tutorials",
        items: Tutorials
      },
      {
        text: "Plugins",
        items: Plugins
      },
      {
        text: pkg.version,
        items: [{text: "", items: Releases}]
      }
    ],
    sidebar: {
      "/introduction/": Introduction,
      "/docs/": Docs,
      "/plugins/": Plugins,
      "/tutorials/": Tutorials,
      "/api/": referenceSidebar
    },
    socialLinks: [
      {icon: "github", link: "https://github.com/tsedio/tsed"},
      {icon: "slack", link: "https://slack.tsed.io"},
      {icon: "twitter", link: "https://x.com/TsED_io"}
      // { icon: '', link: 'https://stackoverflow.com/search?q=tsed' },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Romain Lenzotti"
    }
  },
  markdown: {
    image: {
      lazyLoading: true
    },
    config: (md) => {
      md.use(apiAnchor);
    }
  },
  transformPageData(pageData) {
    const canonicalUrl = `https://tsed.dev/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, ".html");

    pageData.frontmatter.head ??= [];

    const has = pageData.frontmatter.head.find(([, meta]) => {
      return meta?.rel === "canonical" && meta?.href === canonicalUrl;
    });

    if (!has) {
      pageData.frontmatter.head.push([
        "link",
        {rel: "canonical", href: canonicalUrl}
      ]);
    }
  }
});
