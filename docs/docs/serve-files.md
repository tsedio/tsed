---
meta:
  - name: description
    content: Serve statics files with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - name: keywords
    content: ts.ed express typescript statics files node.js javascript decorators
---

# Serve files

To serve static files such as images, CSS files, and JavaScript files, Ts.ED uses `express.static` and `koa-send` for Express and Koa respectively.

## Configuration

Ts.ED allows you to configure several directories to be exposed to your consumer.

So for each endpoint, specify a `root` path to expose files under this root directory:

```typescript
import {Configuration} from "@tsed/common";

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
import {Configuration} from "@tsed/common";

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

<Tabs class="-code">
  <Tab label="Express.js">

<<< @/../packages/platform/platform-express/src/interfaces/PlatformExpressStaticsOptions.ts

  </Tab>
  <Tab label="Koa.js">
 
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

## Expose a webapp

Exposing a webapp (React, Vue.js, Angular) with Ts.ED is quite possible.
The configuration can be a bit complicated because you have to add the right headers and redirection rule so that all queries are redirected to your webapp when the urls are managed by your front-end application.

Here is a small example to configure statics directory with the right headers and redirection rules.

<Tabs class="-code">
  <Tab label="Express.js">

```typescript
import {Configuration, PlatformApplication} from "@tsed/common";
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

  </Tab>
  <Tab label="Koa.js">

```typescript
import {Configuration, PlatformApplication} from "@tsed/common";
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

  </Tab>
</Tabs>
````
