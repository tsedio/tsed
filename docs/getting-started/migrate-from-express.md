---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
meta:
  - name: description
    content: Migrate an existing Express.js application to Ts.ED. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: migration expressjs getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Migrate from Express.js

## Installation

You can get the latest version of Ts.ED using the following npm command:

<Tabs class="-code">
  <Tab label="Yarn">
  
```bash
$ yarn add -D typescript @types/express
$ yarn add -D express@4 @tsed/core @tsed/di @tsed/common @tsed/schema @tsed/json-mapper @tsed/exceptions @tsed/platform-express
```

  </Tab>
  <Tab label="Npm">
  
```bash
$ npm install --save-dev typescript @types/express
$ npm install --save express@4 @tsed/core @tsed/di @tsed/common @tsed/schema @tsed/json-mapper @tsed/exceptions @tsed/platform-express
```
     
  </Tab>
</Tabs>

::: tip
The following modules also are recommended:

<Tabs class="-code">
  <Tab label="Yarn">
  
```bash
$ yarn add body-parser compression cookie-parser method-override
$ yarn add -D ts-node nodemon
```

  </Tab>
  <Tab label="Npm">
    
```bash
$ npm install --save body-parser compression cookie-parser method-override
$ npm install --save-dev ts-node nodemon
```
  
  </Tab>
</Tabs>
:::

::: warning
It is really important to keep the same version for all `@tsed/*` packages.
To prevent errors, fix the version for each Ts.ED packages:

```json
{
  "dependencies": {
    "@tsed/common": "5.56.0",
    "@tsed/di": "5.56.0",
    "@tsed/core": "5.56.0",
    "@tsed/exceptions": "5.56.0",
    "@tsed/plaftorm-express": "5.56.0",
    "@tsed/swagger": "5.56.0"
  }
}
```

:::

::: warning
Ts.ED requires Node >= 10, Express >= 4, TypeScript >= 4.0.2 and
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation
options in your `tsconfig.json` file.
:::

<<< @/getting-started/snippets/migrate-from-express/tsconfig.json

::: tip
You can use this example of `package.json` to add npm tasks and dependencies:

<<< @/getting-started/snippets/base/package.json
:::

## Create server

To use Ts.ED now, use the [Platform API](/docs/platform-api.html) to create an application. Platform API gives an abstraction layer
between your code written with Ts.ED and the Express code. It means a large part of your code
isn't coupled with Express itself, and can be used with another Platform like Koa.

Ts.ED provides a @@Configuration@@ decorator to declare a new application.
Just create a `server.ts` in your root project :

<<< @/getting-started/snippets/migrate-from-express/server.ts

To customize the server settings see [Configuration](configuration.md) page.

Finally, create an `index.ts` file to bootstrap your server with the legacy express application, on the same level of the `Server.ts`:

<Tabs class="-code">
  <Tab label="Bootstrap">
  
<<< @/getting-started/snippets/migrate-from-express/bootstrap.ts

  </Tab>
  <Tab label="server.js">
  
<<< @/getting-started/snippets/migrate-from-express/server.js
  
  </Tab>
</Tabs>

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

::: tip
By default Ts.ED loads automatically Services, Controllers and Middlewares in specific directories.
This behavior can be changed by editing the [componentsScan configuration](/docs/configuration.md).
:::
