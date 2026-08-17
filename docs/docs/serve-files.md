---
description: "Serve statics files with Ts.ED by using decorators."
head:
  - - meta
    - name: description
      content: Serve statics files with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - - meta
    - name: keywords
      content: ts.ed express typescript statics files node.js javascript decorators
---

# Serve files

To serve static files such as images, CSS files, and JavaScript files, Ts.ED uses `express.static` and `koa-send` for Express and Koa respectively.

## Configuration

Ts.ED allows you to configure several directories to be exposed to your consumer.

So for each endpoint, specify a `root` path to expose files under this root directory:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  statics: {
    "/": [
      {
        root: `./public`,
        // Optional
        hook: "$beforeRoutesInit" // Load statics on the expected hook. Default: $afterRoutesInit
        // ... statics options
      }
    ]
  }
})
export class Server {}
```

Now, you can load the files that are in the `public` directory:

```
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by Ts.ED, specify a mount path for the static directory, as shown below:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  statics: {
    "/statics": [
      {
        root: `./public`,
        // Optional
        hook: "$beforeRoutesInit" // Load statics on the expected hook. Default: $afterRoutesInit
        // ... statics options
      }
    ]
  }
})
export class Server {}
```

Now, you can load the files that are in the public directory from the `/statics` path prefix.

```
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

## Load statics before controllers <Badge text="v6.74.0+" />

Since v6.74.0, it's possible to load statics before controllers instead of loading statics after controllers.

Just use the options `hook` to change the default behavior:

```typescript
import * as process from "process";

@Configuration({
  statics: {
    "/before": [
      {
        root: `${process.cwd()}/public`,
        hook: "$beforeRoutesInit"
        // ... statics options
      }
    ],
    "/after": [
      {
        root: `${process.cwd()}/public`,
        hook: "$afterRoutesInit"
        // ... statics options
      }
    ]
  }
})
```

## Statics options

Statics options depend on which platform you work (Express, Koa, etc...).

::: code-group

```typescript [Express.js]
import Express from "express";

export interface PlatformExpressStaticsOptions {
  /**
   * Enable or disable setting Cache-Control response header, defaults to true.
   * Disabling this will ignore the immutable and maxAge options.
   */
  cacheControl?: boolean;
  /**
   * Set how "dotfiles" are treated when encountered. A dotfile is a file or directory that begins with a dot (".").
   * Note this check is done on the path itself without checking if the path actually exists on the disk.
   * If root is specified, only the dotfiles above the root are checked (i.e. the root itself can be within a dotfile when when set to "deny").
   * The default value is 'ignore'.
   * 'allow' No special treatment for dotfiles
   * 'deny' Send a 403 for any request for a dotfile
   * 'ignore' Pretend like the dotfile does not exist and call next()
   */
  dotfiles?: string;
  /**
   * Enable or disable etag generation, defaults to true.
   */
  etag?: boolean;
  /**
   * Set file extension fallbacks. When set, if a file is not found, the given extensions will be added to the file name and search for.
   * The first that exists will be served. Example: ['html', 'htm'].
   * The default value is false.
   */
  extensions?: string[] | false;
  /**
   * Let client errors fall-through as unhandled requests, otherwise forward a client error.
   * The default value is true.
   */
  fallthrough?: boolean;
  /**
   * Enable or disable the immutable directive in the Cache-Control response header.
   * If enabled, the maxAge option should also be specified to enable caching. The immutable directive will prevent supported clients from making conditional requests during the life of the maxAge option to check if the file has changed.
   */
  immutable?: boolean;
  /**
   * By default this module will send "index.html" files in response to a request on a directory.
   * To disable this set false or to supply a new index pass a string or an array in preferred order.
   */
  index?: boolean | string | string[];
  /**
   * Enable or disable Last-Modified header, defaults to true. Uses the file system's last modified value.
   */
  lastModified?: boolean;
  /**
   * Provide a max-age in milliseconds for http caching, defaults to 0. This can also be a string accepted by the ms module.
   */
  maxAge?: number | string;
  /**
   * Redirect to trailing "/" when the pathname is a dir. Defaults to true.
   */
  redirect?: boolean;
  /**
   * Function to set custom headers on response. Alterations to the headers need to occur synchronously.
   * The function is called as fn(res, path, stat), where the arguments are:
   * res the response object
   * path the file path that is being sent
   * stat the stat object of the file that is being sent
   */
  setHeaders?: (res: Express.Response, path: string, stat: any) => any;
}
```

```typescript [Koa.js]
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

:::

## Expose a webapp

Exposing a webapp (React, Vue.js, Angular) with Ts.ED is quite possible.
The configuration can be a bit complicated because you have to add the right headers and redirection rule so that all queries are redirected to your webapp when the urls are managed by your front-end application.

Here is a small example to configure statics directory with the right headers and redirection rules.

::: code-group

```typescript [Express.js]
import {Configuration} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import send from "send";

function setCustomCacheControl(res: ServerResponse, path: string) {
  if (send.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("expires", "0");
  }
}

@Configuration({
  statics: {
    "/app": [
      {
        root: `./public`,
        maxAge: "1d",
        setHeaders: setCustomCacheControl
      }
    ]
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $afterRoutesInit() {
    this.app.get(`/app/*`, (req: any, res: Res) => {
      res.sendFile(join(directory, "index.html"));
    });
  }
}
```

```typescript [Koa.js]
import {Configuration} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import send from "send";

function setCustomCacheControl(res: ServerResponse, path: string) {
  if (send.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("expires", "0");
  }
}

@Configuration({
  statics: {
    "/app": [
      {
        root: `./public`,
        maxAge: "1d",
        setHeaders: setCustomCacheControl
      }
    ]
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $afterRoutesInit() {
    this.app.get(`/app/*`, (req: any, res: Res) => {
      res.sendFile(join(directory, "index.html"));
    });
  }
}
```

:::
