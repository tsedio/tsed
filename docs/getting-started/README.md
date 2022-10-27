---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
projects:
  - title: Kit basic
    href: https://github.com/tsedio/tsed-getting-started
    src: /tsed.png
  - title: Kit production-ready template
    href: https://github.com/borjapazr/express-typescript-skeleton
    src: /tsed.png
  - title: Kit React
    href: https://github.com/tsedio/tsed-example-react
    src: /react.png
  - title: Kit Vue.js
    href: https://github.com/tsedio/tsed-example-vuejs
    src: /vuejs.png
  - title: Kit Prisma
    href: https://github.com/tsedio/tsed-example-prisma
    src: /prisma-2.png
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
    content: Start a new REST application with Ts.ED framework. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Introduction

Ts.ED is a framework for building server-side and scalable applications for Node.js environment. It's built with [TypeScript](http://www.typescriptlang.org/) and uses classes (OOP), decorators and Functional programming
to develop your application.

It uses [Express.js](https://expressjs.com/) HTTP server frameworks by default, but it's also possible to use [Koa.js](https://koajs.com) or [Serverless](https://www.serverless.com/) as well.

Ts.ED provides a level of abstraction above these common Node.js frameworks (Express/Koa) with the [Platform API](/docs/platform-api.md)
but also exposes their APIs directly for the developer. It gives developers the freedom to use the myriad of third-party
node modules which are available for the underlying platform.

## Philosophy

Node.js opened the possibility of making server applications with Javascript, allowing to pool front-end and back-end skills.

With this we have seen the birth of extraordinary projects like [React.js](https://reactjs.org/), [Vue.js](https://vuejs.org/), [Angular](https://angular.io).
Each of these projects bring their vision of a web application, but we have the same wish, to make the developer's life easier by providing
all the right tools to developers so that they are quickly productive.

Ts.ED tends towards the same objective which is to achieve better productivity while remaining easy to understand.
To achieve this, Ts.ED provides out-of-the-box an application architecture, highly testable, scalable and maintainable.

## Platform features support

Here are the features list provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                                                                                                                                                                            | Express.js                                            | Koa.js                                                | [Serverless λ](/tutorials/serverless.md)               | [CLI](/docs/command.md)                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| [Controllers](/docs/controllers.md) <br /> <small>([routing](/docs/controllers.md), [nested](/docs/controllers.html#nested-controllers), [inheritance](/docs/controllers.html#inheritance))</small> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Providers](/docs/providers.md)                                                                                                                                                                     | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Model & JsonSchema](/docs/model.md)                                                                                                                                                                | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [JsonMapper](/docs/json-mapper.md)                                                                                                                                                                  | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Middlewares](/docs/middlewares.md)                                                                                                                                                                 | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Pipes](/docs/pipes.md)                                                                                                                                                                             | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Interceptors](/docs/interceptors.md)                                                                                                                                                                  | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Authentication](/docs/authentication.md)                                                                                                                                                         | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Hooks](/docs/hooks.md)                                                                                                                                                                             | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Exceptions](/docs/exceptions.md)                                                                                                                                                                   | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Logger](/docs/logger.md)                                                                                                                                                                           | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Upload files](/docs/upload-files.md)                                                                                                                                                               | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Serve files](/docs/serve-files.md)                                                                                                                                                                 | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Templating](/docs/templating.md)                                                                                                                                                                   | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Validation](/docs/validation.md)                                                                                                                                                                   | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Response Filters](/docs/response-filter.md)                                                                                                                                                        | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Cache](/docs/cache.md)                                                                                                                                                                             | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/> | <center>?</center>                                     | <img src="../assets/invalid.svg" width="15" alt="no"/> |

</div>

## Platform plugins support

Here are the plugins provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                  | Express.js                                            | Koa.js                                                 | [Serverless λ](/tutorials/serverless.md)               | [CLI](/docs/command.md)                                |
| ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| [Passport.js](/tutorials/passport.html)   | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Prisma](/tutorials/prisma.html)          | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [TypeORM](/tutorials/typeorm.html)        | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Mongoose](/tutorials/mongoose.html)      | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [IORedis](/tutorials/ioredis.html)        | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [Objection.js](/tutorials/objection.html) | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/valid.svg" width="15" alt="yes"/>  |
| [GraphQL](/tutorials/graphql.html)        | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="no"/>   | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Socket.io](/tutorials/socket-io.html)    | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Swagger](/tutorials/swagger.html)        | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [OIDC](/tutorials/oidc.html)              | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <img src="../assets/invalid.svg" width="15" alt="no"/> | <img src="../assets/invalid.svg" width="15" alt="no"/> |
| [Stripe](/tutorials/stripe.html)          | <img src="../assets/valid.svg" width="15" alt="yes"/> | <img src="../assets/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                     | <img src="../assets/invalid.svg" width="15" alt="no"/> |

</div>

## Installation

To get started, you can either scaffold the project with the Ts.ED CLI, or clone a starter project.

To scaffold the project with the CLI, run the following commands. This will create a new project directory,
and populate the directory with the initial core Ts.ED files and supporting modules, creating a conventional base structure for your project.
Creating a new project with the CLI is recommended for first-time users.

```shell
npm install -g @tsed/cli@4.0.0-rc.2
tsed init .
```

By using the CLI, you will be able to choose between different options to generate your first application:

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

<figure><img src="/getting-started/cli-selected-features.png" style="max-width: 400px; padding: 0"></figure>

When all options are selected, the CLI will generate all files.
When it's done, run one of this command:

```sh
yarn start
npm start
pnpm start
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

- [I want to migrate my application from Ts.ED v6](/getting-started/migration-from-v6.md)
- [I want to migrate my application from Express.js](/getting-started/migrate-from-express.md)

## What's next?

Now you can follow one of these links to develop your new application:

- [Create your first controller](/getting-started/create-your-first-controller.md)
- [Change server configuration](/docs/configuration.md)
- [Load configuration from files](/docs/configuration.md)
- [What is the Platform API](/docs/platform-api.md)
