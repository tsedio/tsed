---
meta:
  - name: description
    content: Migrate Ts.ED application from Express.js. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: migration getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Migrate from Express.js

## Installation

You can generate a Ts.ED project over an existing project using the Ts.ED CLI.
The CLI will keep your existing package.json and install the required dependencies.

::: warning
Make sure your don't have an `src/index.ts` or `src/index.js` file in your project.
Also, Ts.ED will create scripts commands in your `package.json` file. Make sure you don't have any conflict with existing scripts.
Rename your scripts name if necessary.
:::

::: tip
A good solution, is to generate to move legacy code into a `src/legacy` directory and generate the Ts.ED project.

You should have this directory tree:

```
.
├── src
│   ├── legacy/server.js
│   ├── controllers
│   ├── services
│   ├── middlewares
│   ├── index.ts
│   └── Server.ts
└── package.json
```

:::

Start by initializing a new Ts.ED project using the following command:

::: code-group

```sh [npm]
npx -p @tsed/cli tsed init .
```

```sh [yarn]
yarn set version berry
yarn dlx -p @tsed/cli tsed init .
```

```sh [pnpm]
pnpx -p @tsed/cli tsed init .
```

```sh [bun]
bnx -p @tsed/cli tsed init .
```

:::

::: info
Select Express.js and your preferred option depending on your needs and your project.
:::

## Configure the server

Once the project is generated, you can start to migrate your existing Express.js application to Ts.ED.

If you use the `Express.router`, the migration will be very simple, because we can get the `Express.router` instance and add it to Ts.ED.
For example here is the legacy `server.js` file:

<<< @/introduction/snippets/migrate-from-express/server-legacy.js

And here is the new `Server.ts` file:

<<< @/introduction/snippets/migrate-from-express/server-migrate-router.ts

We just need to add the `Express.router` instance on the middlewares configuration.

## Get Ts.ED injector in legacy context

If you want to use Ts.ED services in your legacy code, you can get the injector instance by using `getContext()` if you are in a request context.

Here is an example:

```ts
import {MyService} from "./services/MyService";
import {Router} from "express";

const router = Router({mergeParams: true});

router.get("/:id", (req, res) => {
  const $ctx = getContext();
  const service = $ctx.injector.get(MyService);

  service.doSomething();

  res.send("Hello");
});
```
