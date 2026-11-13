---
description: "Configure a Ts.ED application to run on fulmine.js, the Express 5 API on uWebSockets.js."
---

# fulmine.js

<Banner src="/fulmine.svg" height="200" href="https://fulmine.sndesign.it/"></Banner>

`@tsed/platform-fulmine` runs Ts.ED on [fulmine.js](https://github.com/nigrosimone/fulmine.js), an Express 5 compatible
framework on uWebSockets.js. The routing is the one of the Express platform, so Express middlewares work as they are.
What changes is the server: the app listens on uWebSockets.js instead of a Node.js `http.Server`. The features of the
Express platform are available, `@tsed/socketio` included: Socket.IO is attached to the uWebSockets.js app with
`io.attachApp()`, so it needs Socket.IO 4.4 or later and Node.js (on Bun and Deno there is no uWebSockets.js).
The GraphQL subscriptions of `@tsed/graphql-ws` are served on the uWebSockets.js app too.

## Requirements

fulmine.js loads the native uWebSockets.js binary: Node.js 22, 24 or 26 on x64 or arm64 (x64 only on Windows) and, on
Linux, glibc 2.38 or newer, so no Alpine and no Debian bookworm images. On Bun and Deno it serves through `node:http`,
without uWebSockets.js and its TLS options. See the [deployment guide](https://fulmine.sndesign.it/deployment) and the
[differences from Express](https://fulmine.sndesign.it/differences): for example a `DELETE` body is read only when the
`body methods` setting includes `DELETE`.

## Installation

```sh
npm install @tsed/platform-fulmine @tsed/platform-express fulmine.js express
```

## Bootstrap

```typescript
import {PlatformFulmine} from "@tsed/platform-fulmine";

import {Server} from "./Server.js";

const platform = await PlatformFulmine.bootstrap(Server, {
  httpPort: 8083
});

await platform.listen();
```

## fulmine.bodyParser

The options of the fulmine body parsers, or a function that replaces one of them. They are used by the `json-parser`,
`text-parser` and `urlencoded-parser` middlewares that Ts.ED mounts; a parser you mount yourself keeps its own options.

```typescript
@Configuration({
  fulmine: {
    bodyParser: {
      json: {limit: "2mb"},
      urlencoded: {extended: true}
    }
  }
})
class Server {}
```

## TLS and custom fulmine app

uWebSockets.js owns the socket, so `httpsPort` is not supported. TLS is set on the fulmine app, given with the `app`
option, and the TLS listener uses `httpPort`. A `httpPort` given to `bootstrap()` overrides the one of `@Configuration`:

```typescript
import {Configuration} from "@tsed/di";
import fulmine from "fulmine.js";

@Configuration({
  httpPort: 8443,
  fulmine: {
    app: fulmine({
      uwsOptions: {key_file_name: "key.pem", cert_file_name: "cert.pem"}
    })
  }
})
class Server {}
```

## statics

- type: @@PlatformStaticsOptions@@

Object to mount all directories under an endpoint, served by `fulmine.static`.
