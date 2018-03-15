const lang = 'fr';

$docsify.addLanguages({
  lang,
  code: lang,
  label: 'Français',
  searchNoData: 'Aucun résultat !',
  searchPlaceholder: 'Rechercher',
  navbar: [
    { icon: 'ps-icon ps-icon-arrow-right', url: '#/fr/getting-started', label: 'Commencer' },
    {
      icon: 'ps-icon ps-icon-cookie',
      url: '#/fr/tutorials/overview',
      label: 'Guide',
      childrens: [
        { url: '#/fr/tutorials/passport', label: 'Passport.js' },
        { url: '#/fr/tutorials/mongoose', label: 'Mongoose' },
        { url: '#/fr/tutorials/socket-io', label: 'Socket.io' },
        { url: '#/fr/tutorials/swagger', label: 'Swagger' },
        { url: '#/fr/tutorials/ajv', label: 'Validation avec AJV' },
        { url: '#/fr/tutorials/upload-files-with-multer', label: 'Upload de fichier' },
        { url: '#/fr/tutorials/serve-static-files', label: 'Exposer des fichiers statiques' },
        { url: '#/fr/tutorials/templating', label: 'Templating' },
        { url: '#/fr/tutorials/throw-http-exceptions', label: 'Les erreurs HTTP' },
        { url: '#/fr/tutorials/aws', label: 'Projet sous AWS' }
      ]
    },
    {
      icon: 'ps-icon ps-icon-book-tag',
      url: '#/fr/docs/_sidebar',
      label: 'Documentation',
      childrens: [
        { url: '#/fr/configuration', label: 'Configuration' },
        { url: '#/fr/docs/controllers', label: 'Controlleurs' },
        { url: '#/fr/docs/services/overview', label: 'Services' },
        { url: '#/fr/docs/model', label: 'Modèle' },
        { url: '#/fr/docs/converters', label: 'Converters' },
        { url: '#/fr/docs/middlewares/overview', label: 'Middlewares' },
        { url: '#/fr/docs/scope', label: 'Scope' },
        { url: '#/fr/docs/filters', label: 'Filters' },
        { url: '#/fr/docs/jsonschema', label: 'JSON Schema' },
        { url: '#/fr/docs/server-loader/_sidebar', label: 'ServerLoader' },
        { url: '#/fr/docs/testing', label: 'Testing' }
      ]
    },
    { icon: 'ps-icon ps-icon-code', url: '#/api/index', label: 'API réferences' }
  ],
  footer: {
    caughtMistake: 'Vous avez vue une erreur ou souhaitez contribuer à la documentation ?',
    editPageOnGithub: 'Editer la page sur Github',
    contribute: 'Contribuer',
    helpToContribute: 'Aidez-nous à construire le future de Ts.Ed en rejoignant notre team et/ou en envoyant des vos Pull Request via notre',
    githubRepository: 'GitHub !',
    license: 'Licence',
    releaseUnder: 'Publié sous',
    documentationGeneratedWith: 'Documentation généré avec'
  }
});