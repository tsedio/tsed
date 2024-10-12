---
prev: /docs/configuration.md
next: /getting-started/create-your-first-controller.html
otherTopics: true
meta:
  - name: description
    content: Start an application from scratch. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: file configuration getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Create application from scratch

## Installation

You can get the latest version of Ts.ED using the following npm command:

<Tabs class="-code">
  <Tab label="Yarn">
  
```bash
$ yarn add -D typescript @types/express
$ yarn add express@4 @tsed/core @tsed/di @tsed/platform-http @tsed/schema @tsed/json-mapper @tsed/exceptions @tsed/platform-express @types/node @types/multer
```

  </Tab>
  <Tab label="Npm">
  
```bash
$ npm install --save-dev typescript @types/express
$ npm install --save express@4 @tsed/core @tsed/di @tsed/platform-http @tsed/schema @tsed/json-mapper @tsed/exceptions @tsed/platform-express @types/node @types/multer
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
It is really important to keep the same version for all `@tsed/*` (excepted @tsed/logger) packages.
To prevent errors, fix the version for each Ts.ED packages:

```json
{
  "dependencies": {
    "@tsed/di": "8.0.0",
    "@tsed/core": "8.0.0",
    "@tsed/exceptions": "8.0.0",
    "@tsed/platform-http": "8.0.0",
    "@tsed/platform-express": "8.0.0",
    "@tsed/swagger": "8.0.0"
  }
}
```

:::

::: warning
Ts.ED requires Node >= 10, Express >= 4, TypeScript >= 4.0.2 and
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation
options in your `tsconfig.json` file.
:::

<<< @/getting-started/snippets/base/tsconfig.json

::: tip
You can copy this example of `package.json` to develop your application:

<<< @/getting-started/snippets/base/package.json

Then use the command `npm install && npm start` to start your server.
:::

## Create server

To use Ts.ED now, use the [Platform API](/docs/platform-api.html) to create an application. Platform API gives an abstraction layer
between your code written with Ts.ED and the Express code. It means a large part of your code
isn't coupled with Express itself, and can be used with another Platform like Koa.

Ts.ED provides a @@Configuration@@ decorator to declare a new application.
Just create a `server.ts` in your root project :

<<< @/snippets/getting-started/server.ts

To customize the server settings see [Configuration](configuration.md) page.

Finally, create an `index.ts` file to bootstrap your server, on the same level of the `Server.ts`:

<<< @/docs/snippets/configuration/bootstrap.ts

You should have this directory tree:

```
.
├── src
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
