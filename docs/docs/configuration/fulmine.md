---
description: "Configure a Ts.ED application to run on fulmine.js, the Express 5 API on uWebSockets.js."
---

# fulmine.js

<Banner src="/fulmine.svg" height="200" href="https://fulmine.sndesign.it/"></Banner>

`@tsed/platform-fulmine` runs Ts.ED on [fulmine.js](https://github.com/nigrosimone/fulmine.js), an Express 5 compatible
framework on uWebSockets.js. The routing is the one of the Express platform, so Express middlewares work as they are. What
changes is the server: the app listens on uWebSockets.js instead of a Node.js `http.Server`.

## Installation

```sh
npm install @tsed/platform-fulmine @tsed/platform-express fulmine.js express
```

## Bootstrap

```typescript
import { PlatformFulmine } from "@tsed/platform-fulmine";

import { Server } from "./Server.js";

const platform = await PlatformFulmine.bootstrap(Server, {
  httpPort: 8083,
});

await platform.listen();
```

## fulmine.bodyParser

The options of the fulmine body parsers, or a function that replaces one of them:

```typescript
@Configuration({
  fulmine: {
    bodyParser: {
      json: { limit: "2mb" },
      urlencoded: { extended: true },
    },
  },
})
class Server {}
```

## TLS and custom fulmine app

uWebSockets.js owns the socket, so `httpsPort` is not supported. TLS is set on the fulmine app, given with the `app` option:

```typescript
import { Configuration } from "@tsed/di";
import fulmine from "fulmine.js";

@Configuration({
  fulmine: {
    app: fulmine({
      uwsOptions: { key_file_name: "key.pem", cert_file_name: "cert.pem" },
    }),
  },
})
class Server {}
```

## statics

- type: @@PlatformStaticsOptions@@

Object to mount all directories under an endpoint, served by `fulmine.static`.
