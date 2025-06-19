# Koa.js

<Banner src="/koa.svg" height="200" href="https://koajs.com/"></Banner>

::: tip Note
To create Ts.ED application based on Koa.js, use [Ts.ED CLI](/introduction/getting-started.md).
:::

To configure the Koa server, you can use the `koa` property in the `@Configuration` decorator.

## koa.bodyParser

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

## koa.router

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

## statics

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

## Use custom Koa app

You can use a custom Koa app using the `app` server options:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-koa";
import {createKoaApp} from "./app.js";
import {Koa} from "koa";

@Configuration({
  koa: {
    app: createKoaApp()
  }
})
export class Server {
  // ...
}
```
