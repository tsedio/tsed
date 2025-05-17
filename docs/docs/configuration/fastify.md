# Fastify.js

<Banner src="/fastify.svg" height="200" href="https://fastify.dev/"></Banner>

::: tip Note
To create Ts.ED application based on Fastify.js, use [Ts.ED CLI](/introduction/getting-started.md).
:::

To configure the Fastify server, you can use the `fastify` property in the `@Configuration` decorator.
This option allows you to configure the default Fastify settings:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-fastify";

@Configuration({
  fastify: {
    // see fastify options
  },
  plugins: []
})
export class Server {}
```

## Register Fastify plugins

You can register Fastify plugins using the `plugins` server options:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-fastify";
import {FastifyPluginCallback} from "fastify";
import {ThePlugin} from "fastify-plugin";

@Configuration({
  fastify: {
    plugins: [
      "fastify-plugin-1",
      {
        // register a plugin
        use: ThePlugin,
        options: {
          // plugin options
        }
      }
    ]
  }
})
```

## Use custom Fastify app

You can use a custom Fastify app using the `app` server options:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-fastify";
import {FastifyPluginCallback} from "fastify";
import {createFastifyApp} from "./app";

@Configuration({
  fastify: {
    app: createFastifyApp()
  }
})
class Server {}
```
