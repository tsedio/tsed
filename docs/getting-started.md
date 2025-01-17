---
head:
  - - meta
    - name: description
      content: Start your first Ts.ED project with the CLI or clone a starter project. Ts.ED provides a conventional base structure for your project, making it easy to get started. Choose from a variety of starter projects to find the one that best suits your needs.
  - - meta
    - name: keywords
      content: installation ts.ed framework express koa aws cli di rest graphql typescript node.js bun.js javascript native ESM decorators jsonschema class models providers pipes middlewares testing developer

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
---

# Getting Started

## Try it online

You can try Ts.ED directly in your browser on [CodeSandbox](https://codesandbox.io/p/devbox/tsed-mongoose-example-omkbm).

## Installation

To get started, you can either scaffold the project with the Ts.ED CLI, or clone a starter project.

To scaffold the project with the CLI, run the following commands. This will create a new project directory,
and populate the directory with the initial core Ts.ED files and supporting modules, creating a conventional base structure for your project.
Creating a new project with the CLI is recommended for first-time users.

::: code-group

```sh [npm]
npx -p @tsed/cli tsed init .
```

```sh [yarn]
yarn set version berry
yarn dlx -p @tsed/cli tsed init .
```

```sh [pnpm]
pnpm --package=@tsed/cli dlx tsed init .
```

```sh [bun]
bnx -p @tsed/cli tsed init .
```

:::

You will be greeted with a few simple questions:

<<< @/introduction/snippets/init.ansi

::: tip
By default, it's recommended to select the following options: Express, Ts.ED (convention), Swagger, Jest and Eslint + prettier.
:::

When all options are selected, the CLI will generate all files.
When it's done, run one of this command:

::: code-group

```sh [npm]
npm start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm start
```

```sh [bun]
bun start
```

:::

<<< @/introduction/snippets/start.ansi

## Update dependencies

::: warning
If you have to upgrade Ts.ED dependencies, keep in mind this point:

It's really important to keep the same version for all `@tsed/*` (excepted @tsed/logger) packages.
To prevent errors, fix the version for each Ts.ED packages:

```json
{
  "dependencies": {
    "@tsed/common": "7.53.0",
    "@tsed/di": "7.53.0",
    "@tsed/core": "7.53.0",
    "@tsed/exceptions": "7.53.0",
    "@tsed/platform-express": "7.53.0",
    "@tsed/swagger": "7.53.0"
  }
}
```

:::

## Project examples

Alternatively, you can check out one of these projects:

<Projects type="projects" />

If none of previous solutions are satisfying maybe you are in these cases:

- [I want to migrate my application from Ts.ED v6](/introduction/migrate-from-v6)
- [I want to migrate my application from Express.js](/introduction/migrate-from-express)

## What's next?

Now you can follow one of these links to develop your new application:

- [Create your first controller](/introduction/create-your-first-controller.md)
- [Change server configuration](/docs/configuration/index.md)
- [Load configuration from files](/docs/configuration/index.md)
- [What is the Platform API](/docs/platform-api.md)
