---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
projects:
  - title: Kit basic
    href: https://github.com/tsedio/tsed-getting-started
    src: /tsed.png
  - title: Kit React
    href: https://github.com/tsedio/tsed-example-react
    src: /react.png
  - title: Kit Vue.js
    href: https://github.com/tsedio/tsed-example-vuejs
    src: /vuejs.png
  - title: Kit TypeORM
    href: https://github.com/tsedio/tsed-example-typeorm
    src: /typeorm.png
  - title: Kit Mongoose
    href: https://github.com/tsedio/tsed-example-mongoose
    src: /mongoose.png
  - title: Kit Socket.io
    href: https://github.com/tsedio/tsed-example-socketio
    src: /socketio.png
  - title: Kit Passport.js
    href: https://github.com/tsedio/tsed-example-passportjs
    src: /passportjs.png
  - title: Kit AWS
    href: https://github.com/tsedio/tsed-example-aws
    src: /aws.png
  - title: Kit Azure AD
    href: https://github.com/tsedio/tsed-example-passport-azure-ad
    src: /azure.png
meta:
  - name: description
    content: Start a new REST application with Ts.ED CLI. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Create a new project

To scaffold the project with the CLI, run the following commands. This will create a new project directory,
and populate the directory with the initial core Ts.ED files and supporting modules, creating a conventional base structure for your project.
Creating a new project with the CLI is recommended for first-time users.

```bash
npm install -g @tsed/cli
tsed init .
```

::: tip
See our [CLI website](https://cli.tsed.io) for more details on the CLI commands.
:::

You can select different options to generate your first application:

- The web framework: Express.js / Koa.js
- The convention project architecture: Ts.ED or Feature
- The convention file styling: Ts.ED or Angular
- The features:
  - Graphql,
  - Database,
  - Passport.js,
  - Socket.io,
  - Swagger,
  - OIDC,
  - Testing (Jest/Mocha),
  - Linter (Eslint, prettier),
  - Bundler (Babel/Webpack),
- The Package manager: NPM, Yarn or PNPM

::: tip
By default, it's recommended to select the following options: Express, Ts.ED (convention), Swagger, Jest and Eslint + prettier.
:::

<figure><img src="/getting-started/cli-selected-features.png" style="max-height: 400px; padding: 0"></figure>

When all options are selected, the CLI will generate all files.
When it's done, run one of this command:

```sh
yarn start
npm start
pnm start
```

<figure><img src="/getting-started/server-start.png" style="max-height: 400px; padding: 0"></figure>

## Update dependencies

::: warning
If you have to upgrade Ts.ED dependencies, keep in mind this point:

It's really important to keep the same version for all `@tsed/*` (excepted @tsed/logger) packages.
To prevent errors, fix the version for each Ts.ED packages:

```json
{
  "dependencies": {
    "@tsed/common": "6.10.0",
    "@tsed/di": "6.10.0",
    "@tsed/core": "6.10.0",
    "@tsed/exceptions": "6.10.0",
    "@tsed/plaftorm-express": "6.10.0",
    "@tsed/swagger": "6.10.0"
  }
}
```

:::

## Project examples

Alternatively, you can check out one of these projects:

<Projects type="projects" />

If none of previous solutions are satisfying maybe you are in these cases:

- [I want to migrate my application from Ts.ED v5](/getting-started/migration-from-v5.md)
- [I want to migrate my application from Express.js](/getting-started/migrate-from-express.md)

## What's next?

Now you can follow one of these links to develop your new application:

- [Create your first controller](/getting-started/create-your-first-controller.md)
- [Change server configuration](/docs/configuration.md)
- [Load configuration from files](/getting-started/configuration.md#load-configuration-from-file)
- [What is the Platform API](/docs/platform-api.md)
