---
sidebar: auto
prev: /configuration.html
next: /docs/controllers.html
otherTopics: true
projects:
 - title: Kit basic
   href: https://github.com/TypedProject/tsed-getting-started
   src: /tsed.png
 - title: Kit React
   href: https://github.com/TypedProject/tsed-example-react
   src: /react.png
 - title: Kit Vue.js
   href: https://github.com/TypedProject/tsed-example-vuejs
   src: /vuejs.png    
 - title: Kit TypeORM
   href: https://github.com/TypedProject/tsed-example-typeorm
   src: /typeorm.png
 - title: Kit Mongoose
   href: https://github.com/TypedProject/tsed-example-mongoose
   src: /mongoose.png
 - title: Kit Socket.io
   href: https://github.com/TypedProject/tsed-example-socketio
   src: /socketio.png 
 - title: Kit Passport.js
   href: https://github.com/TypedProject/tsed-example-passportjs
   src: /passportjs.png
 - title: Kit AWS
   href: https://github.com/TypedProject/tsed-example-aws
   src: /aws.png
 - title: Kit Azure AD
   href: https://github.com/TypedProject/tsed-example-passport-azure-ad
   src: /azure.png
meta:
 - name: description
   content: Start a new REST application with Ts.ED framework. Ts.ED is built on top of Express and uses TypeScript language.
 - name: keywords
   content: getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Getting started

Save your time by starting your project with our Cli:

```
npm install -g @tsed/cli
tsed init .
```

See our [CLI website](https://cli.tsed.io) for more details.
 
Or by using on one of these kits:

<Projects type="getting-started" />

## Installation from scratch

You can get the latest version of Ts.ED using the following npm command:

<Tabs class="-code">
  <Tab label="Yarn">
  
```bash
$ yarn add -D typescript @types/express
$ yarn add express@4 @tsed/core @tsed/di @tsed/common
```

  </Tab>
  <Tab label="Npm">
  
```bash
$ npm install --save-dev typescript @types/express
$ npm install --save express@4 @tsed/core @tsed/di @tsed/common
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
Ts.ED requires Node >= 10, Express >= 4, TypeScript >= 3.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.
:::

<<< @/examples/getting-started/tsconfig.json

::: tip
You can copy this example of `package.json` to develop your application:

<<< @/examples/getting-started/package.json

Then use the command `npm install && npm start` to start your server.
:::


## Quick start
### Create your express server

Ts.ED use now, the Platform API to create an application. Platform API give an abstraction layer 
between your code written with Ts.ED and the Express code. It means, a large part of your code
isn't coupled with Express itself and can be used with another Platform like Koa in future (Ts.ED v6).

To facilitate, the v6 migration, the Platform API is already available in v5, but only for Express support with @@PlatformExpress@@.

<Tabs>
  <Tab label="v5.56.0+">

Ts.ED provides a @@Configuration@@ decorator to declare a new application. 
Just create a `server.ts` in your root project :

<<< @/docs/snippets/getting-started/server.ts

  </Tab>
  <Tab label="Legacy"> 

Ts.ED provides a @@ServerLoader@@ class to configure your 
Express application quickly. Just create a `server.ts` in your root project, declare 
a new `Server` class that extends ServerLoader.

<<< @/docs/snippets/getting-started/server-legacy.ts
  
::: tip
By default, ServerLoader loads controllers in `${rootDir}/controllers` and mounts it to `/rest` endpoint.
:::

  </Tab>
</Tabs>

To customize the server settings see [Configuration](configuration.md) page.

Finally, create an `index.ts` file to bootstrap your server, on the same level of the `Server.ts`:

<Tabs class="-code">
  <Tab label="v5.56.0+">
  
<<< @/docs/snippets/configuration/bootstrap.ts
  
  </Tab>
  <Tab label="Legacy">
  
<<< @/docs/snippets/configuration/bootstrap-legacy.ts
  
  </Tab>  
</Tabs>    

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
This behavior can be changed by editing the [componentsScan configuration](/configuration.md).
:::

## Load configuration from file

It is also possible to use [node-config](https://www.npmjs.com/package/config) or [dotenv](https://www.npmjs.com/package/dotenv) to load your configuration from file:

<Tabs class="-code">
  <Tab label="node-config">

<<< @/docs/snippets/configuration/bootstrap-with-node-config.ts

  </Tab>
  <Tab label="dotenv">

<<< @/docs/snippets/configuration/bootstrap-with-dotenv.ts

  </Tab>  
</Tabs>

## Create your first controller

Create a new `CalendarCtrl.ts` in your controllers directory (by default `root/controllers`).
All controllers declared with @@Controller@@ decorators are considered as Express routers. 
An Express router requires a path (here, the path is `/calendars`) to expose an url on your server. 
More precisely, it's a part of path, and the entire exposed url depends on the Server configuration (see [Configuration](configuration.md)) 
and the [children controllers](/docs/controllers.md).

In this case, we haven't dependencies and the root endpoint is set to `/rest`. 
So the controller's url will be `http://host/rest/calendars`.

<<< @/docs/docs/snippets/controllers/basic-controller.ts

::: tip
Decorators @@Get@@, @@Post@@, @@Delete@@, @@Put@@, etc..., support dynamic pathParams (eg: `/:id`) and `RegExp` like Express API.

See [Controllers](/docs/controllers.md) section for more details
:::

::: warning
You have to configure [engine rendering](/tutorials/templating) if you want to use the decorator @@Render@@.
:::

To test your method, just run your `server.ts` and send an HTTP request on `/rest/calendars/1`.

### Ready for More?

We’ve briefly introduced the most basic features of Ts.ED - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!
