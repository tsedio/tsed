---
meta:
  - name: description
    content: Session configuration
  - name: keywords
    content: ts.ed express typescript auth node.js javascript decorators
---

# Session & cookies

Ts.ED provides two decorators to get @@Session@@ and @@Cookies@@ values in your controller.

## Installation

Before using the Session and Cookies, we need to install a module like [express-session](https://www.npmjs.com/package/express-session) but
you can use another module which follows the same convention.

```bash
npm install --save express-session
```

::: warning
The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

For a list of stores, see [compatible session stores](https://www.npmjs.com/package/express-session#compatible-session-stores).
:::

## Configuration

Edit your Server and add these lines:

<<< @/tutorials/snippets/session/configuration.ts

## Usage

### Session

#### Get value

<<< @/tutorials/snippets/session/example-session.ts

#### Set value

```typescript
import {BodyParams, Session} from "@tsed/platform-params";
import {Controller} from "@tsed/di";
import {Post, Returns} from "@tsed/schema";

@Controller("/")
export class MyCtrl {
  @Post("/")
  updateSession(@Session() session: any) {
    session.count = (session.count || 0) + 1;
    return "OK - " + session.count;
  }
}
```

### Cookies

#### Get value

<<< @/tutorials/snippets/session/example-cookies.ts

#### Set value

```typescript
import {Controller} from "@tsed/di";
import {BodyParams, Cookies} from "@tsed/platform-params";
import {Post, Returns} from "@tsed/schema";

@Controller("/")
export class MyCtrl {
  @Post("/")
  updateSession(@Cookies() cookies: any) {
    cookies.count = (cookies.count || 0) + 1;
    return "OK - " + cookies.count;
  }
}
```

## Initialize session

Sometimes we want to be sure that the session is correctly initialized with the right values.

Let's start by creating a middleware CreateRequestSessionMiddleware in `middlewares` directory:

<<< @/tutorials/snippets/session/example-create-session.ts

Then, add this middleware on the server:

<<< @/tutorials/snippets/session/configuration-middleware.ts

Finally, you can read and write values in your controller:

<<< @/tutorials/snippets/session/example-session.ts

In addition, you can add integration tests with SuperTest and `@tsed/testing` package.
Here is an example of Rest API test:

<Tabs class="-code">
<Tab label="Jest">

<<< @/tutorials/snippets/session/example-test.jest.ts

</Tab>
<Tab label="Vitest">

<<< @/tutorials/snippets/session/example-test.vitest.ts

</Tab>
<Tab label="Mocha">

<<< @/tutorials/snippets/session/example-test.mocha.ts

</Tab>
</Tabs>

::: tip
You can find a working example on [Express Session here](https://github.com/tsedio/tsed-example-session).
:::
