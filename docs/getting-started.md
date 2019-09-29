---
sidebar: auto
prev: /configuration.html
next: /docs/controllers.html
otherTopics: true
meta:
 - name: description
   content: Start a new REST application with Ts.ED framework. Ts.ED is built on top of Express and use TypeScript language.
 - name: keywords
   content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Getting started

You can start your project from the [getting started project boilerplate](https://github.com/TypedProject/tsed-getting-started).

## Installation from scratch

You can get the latest version of Ts.ED using the following npm command:

```bash
$ npm install --save-dev typescript @types/express
$ npm install --save express@4 @tsed/core @tsed/di @tsed/common
```

::: tip
The following modules are also recommended:

```bash
$ npm install --save body-parser compression cookie-parser method-override
$ npm install --save-dev ts-node nodemon
```
:::

::: warning
It's really important to keep the same version for all `@tsed/*` packages.
To prevent errors, fix the version for each Ts.ED packages:
```json
{
  "dependencies": {
    "@tsed/common": "5.0.7",
    "@tsed/di": "5.0.7",
    "@tsed/core": "5.0.7",
    "@tsed/swagger": "5.0.7",
    "@tsed/testing": "5.0.7"
  }
} 
```
:::

::: warning
Ts.ED requires Node >= 8, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.
:::

```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["es2016"],
    "typeRoots": [
      "./node_modules/@types"
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

### Optional

You can copy this example of `package.json` to develop your application:

```json
{
  "name": "test-ts-express-decorator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npm run tsc",
    "coverage": "npm run test-cov && npm run test-remap",
    "postinstall": "npm run build",
    "tslint": "tslint ./*.ts ./lib/*.ts",
    "test": "mocha --reporter spec --check-leaks --bail test/",
    "tsc": "tsc --project tsconfig.json",
    "tsc:w": "tsc -w",
    "start": "nodemon --watch '**/*.ts' --ignore 'node_modules/**/*' --exec ts-node src/index.ts"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@tsed/core": "4.0.0",
    "@tsed/common": "4.0.0",
    "body-parser": "^1.15.2",
    "compression": "^1.6.2",
    "cookie-parser": "^1.4.3",
    "express": "^4.14.0",
    "method-override": "^2.3.6"
  },
  "devDependencies": {
    "@types/express": "^4.0.37",
    "ts-node": "^3.3.0",
    "nodemon": "^1.11.0",
    "typescript": "^2.4.3"
  }
}
```

> Then use the command `npm install && npm start` to start your server.

## Quick start
### Create your express server

Ts.ED provide a @@ServerLoader@@ class to configure your 
Express application quickly. Just create a `server.ts` in your root project, declare 
a new `Server` class that extends [`ServerLoader`](/docs/server-loader.md).

<<< @/docs/snippets/getting-started/server.ts

> By default ServerLoader load controllers in `${rootDir}/controllers` and mount it to `/rest` endpoint.

To customize the server settings see [Configuration](configuration.md) page.

Finally create an `index.ts` file to bootstrap your server, on the same level of the `Server.ts`:

<<< @/docs/snippets/configuration/bootstrap.ts

You should have this tree directories: 

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
By default ServerLoader load automatically Services, Controllers and Middlewares in a specific directories.
This behavior can be change by editing the [componentScan configuration](/configuration.md).
:::

::: tip
In addiction, it also possible to use [node-config](https://www.npmjs.com/package/config) or [dotenv](https://www.npmjs.com/package/dotenv) to load your configuration from file:

<<< @/docs/snippets/configuration/bootstrap-with-node-config.ts

You should have this tree directories: 

```
.
├── config
│   └── default.json (or .yaml)
├── src
│   ├── controllers
│   ├── services
│   ├── middlewares
│   ├── index.ts
│   └── Server.ts
└── package.json
```

With [dotenv](https://www.npmjs.com/package/dotenv):

<<< @/docs/snippets/configuration/bootstrap-with-dotenv.ts

:::

## Create your first controller

Create a new `CalendarCtrl.ts` in your controllers directory (by default `root/controllers`).
All controllers declared with @@Controller@@ decorators is considered as an Express router. 
An Express router require a path (here, the path is `/calendars`) to expose an url on your server. 
More precisely, it's a part of path, and entire exposed url depend on the Server configuration (see [Configuration](configuration.md)) 
and the [children controllers](/docs/controllers.md).

In this case, we haven't a dependencies and the root endpoint is set to `/rest`. 
So the controller's url will be `http://host/rest/calendars`.

<<< @/docs/docs/snippets/controllers/basic-controller.ts

::: tip
Decorators @@Get@@, @@Post@@, @@Delete@@, @@Put@@, etc..., supports dynamic pathParams (eg: `/:id`) and `RegExp` like Express API.

See [Controllers](/docs/controllers.md) section for more details
:::

::: warning
You have to configure [engine rendering](/tutorials/templating) if you want to use the decorator @@Render@@.
:::

To test your method, just run your `server.ts` and send a HTTP request on `/rest/calendars/1`.

### Ready for More?

We’ve briefly introduced the most basic features of Ts.ED - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!
