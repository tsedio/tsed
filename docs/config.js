window.$docsify = {
  name: 'Ts.ED',
  repo: 'https://github.com/romakita/ts-express-decorators',
  auto2top: true,
  homepage: '_home.html',
  alias: {},
  coverpage: {
    '/': '_coverpage.md'
  },
  onlyCover: false,
  executeScript: true,
  loadSidebar: true,
  loadNavbar: false,
  maxLevel: 4,
  subMaxLevel: 2,
  ga: 'UA-35240348-1',
  search: {
    noData: {
      '/': 'No results!'
    },
    paths: 'auto',
    placeholder: {
      '/': 'Search'
    }
  },
  formatUpdated: '{MM}/{DD} {HH}:{mm}',
  plugins: [],
  languages: [
    { label: 'English', code: 'uk', lang: 'en', default: true }
  ],
  fallbackLanguages: ['en'],
  footer: {
    'en': {
      caughtMistake: 'Caught a mistake or want to contribute to the documentation?',
      editPageOnGithub: 'Edit on Github',
      contribute: 'Contribute',
      helpToContribute: 'Help shape the future of Ts.Ed by joining our team and send us pull requests via our',
      githubRepository: 'GitHub repository!',
      license: 'License',
      releaseUnder: 'Released under the',
      documentationGeneratedWith: 'Documentation generated with'
    }
  },
  notFoundPage: {
    '/': '_404.md'
  },

  navbar: {
    'en': [
      { icon: 'ps-icon ps-icon-arrow-right', url: '#/getting-started', label: 'Getting started' },
      {
        icon: 'ps-icon ps-icon-cookie',
        url: '#/tutorials/overview',
        label: 'Guide',
        childrens: [

          { url: '#/tutorials/passport', label: 'Passport.js' },
          { url: '#/tutorials/mongoose', label: 'Mongoose' },
          { url: '#/tutorials/socket-io', label: 'Socket.io' },
          { url: '#/tutorials/swagger', label: 'Swagger' },
          { url: '#/tutorials/ajv', label: 'Validation with AJV' },
          { url: '#/tutorials/upload-files-with-multer', label: 'Upload files' },
          { url: '#/tutorials/serve-static-files', label: 'Serve static files' },
          { url: '#/tutorials/templating', label: 'Templating' },
          { url: '#/tutorials/throw-http-exceptions', label: 'Throw HTTP exceptions' },
          { url: '#/tutorials/aws', label: 'AWS project' }
        ]
      },
      {
        icon: 'ps-icon ps-icon-book-tag',
        url: '#/docs/overview',
        label: 'Documentation',
        childrens: [
          { url: '#/configuration', label: 'Configuration' },
          { url: '#/docs/controllers', label: 'Controllers' },
          { url: '#/docs/services/overview', label: 'Services' },
          { url: '#/docs/model', label: 'Models' },
          { url: '#/docs/converters', label: 'Converters' },
          { url: '#/docs/middlewares/overview', label: 'Middlewares' },
          { url: '#/docs/scope', label: 'Scope' },
          { url: '#/docs/filters', label: 'Filters' },
          { url: '#/docs/jsonschema', label: 'JSON Schema' },
          { url: '#/docs/server-loader/_sidebar', label: 'ServerLoader' },
          { url: '#/docs/testing', label: 'Testing' }
        ]
      },
      { icon: 'ps-icon ps-icon-code', url: '#/api/index', label: 'API references' }
    ]
  }
};

$docsify.addLanguages = (options) => {
  const { code, label, lang, searchNoData, searchPlaceholder, navbar, footer } = options;
  /**
   *
   */
  window.$docsify.alias[`/${lang}/`] = `/${lang}/_home.html`;
  /**
   *
   * @type {string}
   */
  window.$docsify.coverpage[`/${lang}/`] = '_coverpage.md';
  /**
   *
   * @type {string}
   */
  window.$docsify.search.noData[`/${lang}/`] = searchNoData;
  /**
   *
   * @type {string}
   */
  window.$docsify.search.placeholder[`/${lang}/`] = searchPlaceholder;
  /**
   *
   */
  window.$docsify.fallbackLanguages.push(lang);
  /**
   *
   */
  window.$docsify.navbar[lang] = navbar;
  /**
   *
   */
  window.$docsify.footer[lang] = footer;
  /**
   *
   * @type {string}
   */
  window.$docsify.notFoundPage[`/${lang}/`] = '/fr/_404.md';

  window.$docsify.languages.push({
    code,
    label,
    lang
  });
};