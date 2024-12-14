---
head:
  - - meta
    - name: description
      content: Ts.ED provides two decorators to get Session and Cookies values in your controller. Learn how to use them in your Ts.ED application.
  - - meta
    - name: keywords
      content: ts.ed express typescript session cookies node.js javascript decorators
---

# Session & cookies

Ts.ED provides two decorators to get @@Session@@ and @@Cookies@@ values in your controller.

## Installation

Before using the Session and Cookies, we need to install a module like [express-session](https://www.npmjs.com/package/express-session) but
you can use another module which follows the same convention.

::: code-group

```bash [Express.js]
npm install --save express-session
yarn add express-session
pnpm add express-session
bun add express-session
```

```bash [Koa.js]
npm install --save koa-session
yarn add koa-session
pnpm add koa-session
bun add koa-session
```

:::

::: warning
The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

For a list of stores, see [compatible session stores](https://www.npmjs.com/package/express-session#compatible-session-stores).
:::

## Configuration

Edit your Server and add these lines:

<<< @/docs/snippets/session/configuration.ts

## Usage

### Session

#### Get value

<<< @/docs/snippets/session/example-session.ts

#### Set value

```typescript
import {Controller} from "@tsed/di";
import {BodyParams, Session} from "@tsed/platform-params";
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

<<< @/docs/snippets/session/example-cookies.ts

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

<<< @/docs/snippets/session/example-create-session.ts

Then, add this middleware on the server:

<<< @/docs/snippets/session/configuration-middleware.ts

Finally, you can read and write values in your controller:

<<< @/docs/snippets/session/example-session.ts

In addition, you can add integration tests with SuperTest and `@tsed/testing` package.
Here is an example of Rest API test:

::: code-group

<<< @/docs/snippets/session/example-test.jest.ts [Jest]
<<< @/docs/snippets/session/example-test.vitest.ts [Vitest]
<<< @/docs/snippets/session/example-test.mocha.ts [Mocha]

:::

::: tip
You can find a working example on [Express Session here](https://github.com/tsedio/tsed-example-session).
:::
