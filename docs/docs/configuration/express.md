# Express.js

## express.bodyParser

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
class Server {}
```

## express.router

The global configuration for the `Express.Router`. See
express [documentation](http://expressjs.com/en/api.html#express.router).

## statics

- type: @@PlatformStaticsOptions@@

Object to mount all directories under an endpoint.

## Use custom Express app

You can use a custom Express app using the `app` server options:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import {createExpressApp} from "./app.js";

@Configuration({
  express: {
    app: createExpressApp()
  }
})
export class Server {}
```
