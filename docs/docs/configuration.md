---
prev: /getting-started/
next: /docs/controllers.html
meta:
  - name: description
    content: Documentation over the server configuration. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - name: keywords
    content: configuration ts.ed express typescript node.js javascript decorators mvc class models
---

# Configuration

@@Configuration@@ lets you quickly configure your server via decorator. This decorator takes your configuration and
merges it with the default server configuration.

The default configuration is as follows:

```json
{
  "env": "development",
  "port": 8080,
  "debug": false,
  "httpsPort": 8000,
  "uploadDir": "./uploads"
}
```

You can customize your configuration as follows on `Server.ts`level:

<<< @/docs/snippets/configuration/server.ts

or when you bootstrap your Server (e.g. `index.ts`):

<<< @/docs/snippets/configuration/bootstrap.ts

::: tip Note
Ts.ED supports [ts-node](https://github.com/TypeStrong/ts-node). Ts extension will be replaced by a Js extension if
ts-node isn't the runtime.
:::

## Load configuration from file

Ts.ED doesn't provide solution to load configuration from files. Because, there is many solution to achieve this,
we consider this part as the developer responsibility.

By using [node-config](https://www.npmjs.com/package/config) or [dotenv](https://www.npmjs.com/package/dotenv), it's
possible to load your configuration from file
as following:

<Tabs class="-code">
  <Tab label="node-config">

<<< @/docs/snippets/configuration/bootstrap-with-node-config.ts

  </Tab>
  <Tab label="dotenv">

<<< @/docs/snippets/configuration/bootstrap-with-dotenv.ts

  </Tab>  
</Tabs>

## Options

### rootDir

- type: `string`

The root directory where you build run project. By default, it is equal to `process.cwd()`.

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  rootDir: process.cwd()
})
export class Server {}
```

### env

- type: @@Env@@

The environment profiles. By default the environment profile is equal to `NODE_ENV`.

```typescript
import {Env} from "@tsed/core";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  env: Env.PROD
})
export class Server {
  @Constant("env")
  env: Env;

  $beforeRoutesInit() {
    if (this.env === Env.PROD) {
      // do something
    }
  }
}
```

### httpPort

- type: `string` | `number` | `false`

Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
Set `false` to disable the http port.

### httpsPort

- type: `string` | `number` | `false`

Port number for the [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server).

### httpsOptions

- type: [Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
  - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different
    algorithms, an array can be provided either as a plain array of key strings or an array of objects in the
    format `{pem: key, passphrase: passphrase}`. This option is required for ciphers making use of private keys.
  - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
  - `cert` &lt;string&gt; | &lt;string[]&gt;
    | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings,
    or array of Buffers containing the certificate key of the server in PEM format. (Required)
  - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings,
    or array of Buffers of trusted certificates in PEM format. If this is omitted, several well known "root" CAs (like
    VeriSign) will be used. These are used to authorize connections.

See the [HTTPs project example](https://github.com/tsedio/example-ts-express-decorator/tree/2.0.0/example-https)

### mount

- type: @@EndpointDirectoriesSettings@@

Mount all given controllers and map controllers to the corresponding endpoints.

Ts.ED provides the possibility to mount multiple Rest paths instead of the default path `/rest`.
This option will allow you to define a version for an endpoint and select which controllers you want to associate with
the given path.

<<< @/docs/snippets/configuration/server-endpoint-versionning.ts

It is also possible to split the configuration by using the @@Module@@:

<Tabs class="-code">
  <Tab label="Server.ts">

<<< @/docs/snippets/configuration/server-endpoint-versionning-with-module.ts

  </Tab>
  <Tab label="ModuleV1.ts">

<<< @/docs/snippets/configuration/modulev1-endpoint-versionning.ts

  </Tab>  
  <Tab label="ModuleV0.ts">

<<< @/docs/snippets/configuration/modulev0-endpoint-versionning.ts

  </Tab>    
</Tabs>

### appendChildrenRoutesFirst

- type: `boolean`

Append children routes before the controller routes itself. Defaults to `false`, but will be deprecated and set to `true` in next major version.

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  appendChildrenRoutesFirst: true
})
export class Server {}
```

### ~~componentsScan~~ (deprecated)

- type: `string[]`

List of glob pattern to scan directories which contains [Services](/docs/services.md)
or [Middlewares](/docs/middlewares.md).

### middlewares

- type: `PlatformMiddlewareSettings[]`

A middleware list (Express.js, Ts.ED, Koa, etc...) must be loaded on the `$beforeRoutesInit` hook or on the specified
hook.
In addition, it's also possible to configure the environment for which the middleware should be loaded.

Since v7.4, the middlewares options accepts multiple format to register a native middleware (Express, Koa) and/or a
Ts.ED middleware:

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";

@Configuration({
  middlewares: [
    {use: "helmet", hook: "$afterInit", options: {contentSecurityPolicy: false}},
    {use: EnsureHttpsMiddleware, env: Env.PROD},
    "cors",
    cookieParser(),
    "json-parser", // you can add also the text-parser
    {use: "encodedurl-parser", options: {extended: true}},
    "compression",
    "method-override",
    AuthTokenMiddleware
  ]
})
export class Server {}
```

::: warning Order priority
The middlewares added through `middlewares` options will always be registered after the middlewares registered through
the hook methods!
:::

Here is an equivalent example to load middlewares with the hooks:

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";
import {Env} from "@tsed/core";
import bodyParser from "body-parser";

@Configuration({})
export class Server {
  $afterInit() {
    this.app.use(helmet({contentSecurityPolicy: false}));
  }

  $beforeRoutesInit() {
    if (this.env === Env.PROD) {
      this.app.use(EnsureHttpsMiddleware);
    }

    this.app
      .use(cors())
      .use(cookieParser())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use(compress({}))
      .use(methodOverride())
      .use(AuthTokenMiddleware);

    return null;
  }
}
```

::: tip

Prefer the 1st example if you use @@RawBodyParams@@ in your application. Ts.ED will automatically configure the json-parser and urlencoded parser with the rawBody parser.

:::

### rawBody <Badge text="v7.4.0+" />

This option force the rawBody parser if Ts.ED doesn't detect the @@RawBodyParams@@ usage in your code.

```diff
@Configuration({
+  rawBody: true,
+  middlewares: [
+     {use: 'json-parser'},
+     {use: 'urlencoded-parser', options: {extended: true})
+  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  $beforeRoutesInit() {
-    this.app
-      .use(bodyParser.json())
-      .use(bodyParser.urlencoded({extended: true}));
  }
}
```

### imports

- type: `Type<any>[]`

Add providers or modules here. These modules or provider will be built before the server itself.

<Tabs class="-code">
  <Tab label="Server.ts">

<<< @/docs/snippets/configuration/server-options-imports.ts

  </Tab>
  <Tab label="MyModule.ts">

<<< @/docs/snippets/configuration/module-options-imports.ts

  </Tab>
</Tabs>

### ~~exclude~~ (deprecated)

- type: `string[]`

List of glob patterns. Exclude all files that match with this list when the Server scans all components with the `mount`
or `scanComponents` options.

### scopes

- type: `{[key: string]: ProviderScope}`

Change the default scope for a given provider. See [injection scopes](/docs/injection-scopes.md) for more details.

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";

@Configuration({
  scopes: {
    [ProviderType.CONTROLLER]: ProviderScope.REQUEST
  }
})
export class Server {}
```

### logger

- type: @@PlatformLoggerSettings@@

Logger configuration. See [logger section for more detail](/docs/logger.md).

### resolvers - External DI

- type: @@DIResolver@@

Ts.ED has its own DI container, but sometimes you have to work with other DI like Inversify or TypeDI. The version
5.39.0+
now allows you to configure multiple external DI by using the `resolvers` options.

The resolvers options can be configured as following:

<<< @/docs/snippets/configuration/server-resolvers.ts

It's also possible to register resolvers with the @@Module@@ decorator:

<<< @/docs/snippets/configuration/module-resolvers.ts

### views

Object to configure Views engines with Ts.ED engines or Consolidate (deprecated). See more
on [View engine](/docs/templating.md).

### acceptMimes

Configure the mimes accepted by default for each request by the server.

### responseFilters

A list of response filters must be called before returning a response to the consumer. See more
on [Response filters](/docs/response-filter.md).

### multer

Object configure Multer. See more on [Upload file](/tutorials/serve-static-files.md).

## jsonMapper

```typescript
@Configuration({
  jsonMapper: {
    additionalProperties: false,
    disableUnsecureConstructor: true
  }
})
```

### jsonMapper.additionalProperties

Enable additional properties on model. By default, `false`. Enable this option is dangerous and may be a potential
security issue.

### jsonMapper.disableUnsecureConstructor

Pass the plain object to the model constructor. By default, `true`.

It may be a potential security issue if you have as constructor with this followings code:

```typescript
class MyModel {
  constructor(obj: any = {}) {
    Object.assign(this, obj); // potential prototype pollution
  }
}
```

::: tip Note
Recommended: Set this options to `true` in your new project.

In v7 this option will be set to true by default.
:::

## Platform Options

These options are specific for each framework (Express.js, Koa.js, etc...):

<Tabs>
  <Tab label="Express.js">

### express.bodyParser <Badge text="6.111.0+"/>

This option let you configure the default bodyParser used by Ts.ED to parse the body request:

```typescript
@Configuration({
  express: {
    bodyParser: {
      text: {},
      json: {},
      urlencoded: {
        extended: true // required
      }
    }
  }
})
```

### express.router

The global configuration for the `Express.Router`. See
express [documentation](http://expressjs.com/en/api.html#express.router).

### statics

- type: @@PlatformStaticsOptions@@

Object to mount all directories under an endpoint.

<<< @/../packages/platform/platform-express/src/interfaces/PlatformExpressStaticsOptions.ts

  </Tab>
  <Tab label="Koa.js">

### koa.bodyParser <Badge text="6.111.0+"/>

This option let you configure the default bodyParser used by Ts.ED to parse the body request:

```typescript
@Configuration({
  koa: {
    bodyParser: {
      // See koa-bodyparser options
    }
  }
})
```

### koa.router

The global configuration for the Koa.Router.

```typescript
interface KoaRouterOptions {
  /**
   * Prefix for all routes.
   */
  prefix?: string;
  /**
   * Methods which should be supported by the router.
   */
  methods?: string[];
  routerPath?: string;
  /**
   * Whether or not routing should be case-sensitive.
   */
  sensitive?: boolean;
  /**
   * Whether or not routes should matched strictly.
   *
   * If strict matching is enabled, the trailing slash is taken into
   * account when matching routes.
   */
  strict?: boolean;
}
```

### statics

- type: @@PlatformStaticsOptions@@

Object to mount all directories under an endpoint.

```typescript
interface KoaStaticsOptions {
  /** Browser cache max-age in milliseconds. (defaults to 0) */
  maxage?: number;
  maxAge?: SendOptions["maxage"];
  /** Tell the browser the resource is immutable and can be cached indefinitely. (defaults to false) */
  immutable?: boolean;
  /** Allow transfer of hidden files. (defaults to false) */
  hidden?: boolean;
  /** Root directory to restrict file access. (defaults to '') */
  root?: string;
  /** Name of the index file to serve automatically when visiting the root location. (defaults to none) */
  index?: string | false;
  /** Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. (defaults to true). */
  gzip?: boolean;
  /** Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br extension exists. (defaults to true). */
  brotli?: boolean;
  /** If not false (defaults to true), format the path to serve static file servers and not require a trailing slash for directories, so that you can do both /directory and /directory/. */
  format?: boolean;
  /** Function to set custom headers on response. */
  setHeaders?: SetHeaders;
  /** Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to false) */
  extensions?: string[] | false;
}
```

  </Tab>
</Tabs>

## HTTP & HTTPs server

### Change address

It's possible to change the HTTP and HTTPS server address as follows:

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  httpPort: "127.0.0.1:8081",
  httpsPort: "127.0.0.2:8082"
})
export class Server {}
```

### Random port

Random port assignment can be enabled with the value `0`. The port assignment will be delegated to the OS.

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  httpPort: "127.0.0.1:0",
  httpsPort: "127.0.0.2:0"
})
export class Server {}
```

Or:

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  httpPort: 0,
  httpsPort: 0
})
export class Server {}
```

### Disable HTTP

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  httpPort: false
})
export class Server {}
```

### Disable HTTPS

```typescript
import {Configuration} from "@tsed/common";

@Configuration({
  httpsPort: false
})
export class Server {}
```

## Get configuration

The configuration can be reused throughout your application in different ways.

- With dependency injection in [Controller](/docs/controllers.md), [Middleware](/docs/middlewares.md)
  , [Pipe](/docs/pipes.md) or any [Injectable](/docs/services.md) services.
- With the decorators @@Constant@@ and @@Value@@.

### From service (DI)

```typescript
import {Configuration, Injectable} from "@tsed/di";

@Injectable() // or Controller or Middleware
export class MyService {
  constructor(@Configuration() configuration: Configuration) {}
}
```

### From decorators

Decorators @@Constant@@ and @@Value@@ can be used in all classes including:

- [Provider](/docs/providers.md),
- [Interceptor](/docs/interceptors.md),
- [Service](/docs/services.md),
- [Controller](/docs/controllers.md),
- [Middleware](/docs/middlewares.md).

@@Constant@@ and @@Value@@ accepts an expression as parameters to inspect the configuration object and return the value.

<<< @/docs/snippets/providers/binding-configuration.ts

::: warning
@@Constant@@ returns an Object.freeze() value.
:::

::: tip NOTE
The values for the decorated properties aren't available on constructor. Use \$onInit() hook to use the value.
:::
