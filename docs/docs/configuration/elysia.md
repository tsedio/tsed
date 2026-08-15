---
head:
  - - meta
    - name: description
      content: Configure Ts.ED with Elysia.
---

# Elysia

`@tsed/platform-elysia` runs Ts.ED controllers on [Elysia](https://elysiajs.com/), using Elysia's Fetch-native request and response model. Bun is the supported runtime for the initial release.

## Installation

```bash
yarn add @tsed/platform-elysia elysia
```

## Bootstrap

```typescript
import {PlatformElysia} from "@tsed/platform-elysia";

await PlatformElysia.bootstrap(Server, {
  mount: {"/rest": ["./controllers/**/*.ts"]}
});
```

## Custom Elysia application

Provide an application through the `elysia.app` configuration setting when you need to install Elysia plugins before Ts.ED mounts routes.

```typescript
import {Elysia} from "elysia";
import {staticPlugin} from "@elysia/static";

await PlatformElysia.bootstrap(Server, {
  elysia: {app: new Elysia().use(staticPlugin({assets: "public", prefix: "/"}))}
});
```

Static assets require `@elysia/static`. Elysia parses `multipart/form-data` natively as `FormData` and `File` values, which are available through Ts.ED body parameters. Multer decorators and storage engines are not supported. Views, sessions, Node `Readable` streams, manually finalized responses, redirects, response filters, response caching, WebSockets, and serverless callback support are not part of this adapter's supported surface yet.
