---
head:
  - - meta
    - name: description
      content: Discover the capabilities of Ts.ED, a Node.js and TypeScript framework on top of Express/Koa.js. Ts.ED provides different platform adapters to build your awesome server-side application. Depending on the platform you choose, Ts.ED provides a level of abstraction above these common Node.js frameworks (Express/Koa) with the Platform API but some features are not available on all platforms.
  - - meta
    - name: keywords
      content: capabilities platform express koa serverless cli controllers providers model jsonschema jsonmapper middlewares pipes interceptors authentication hooks exceptions logger upload-files serve-files templating validation response-filters cache passport prisma typeorm mongoose
---

# Capabilities

Ts.ED is a Node.js and TypeScript framework on top of [Express.js](/docs/configuration/express.html), [Koa.js](/docs/configuration/koa.html), [Fastify.js](/docs/configuration/fastify.html), and [Elysia](/docs/configuration/elysia.html). It provides different platform adapters
to build your awesome server-side application.

Depending on the platform you choose, Ts.ED provides a level of abstraction above these common Node.js frameworks with the [Platform API](/docs/platform-api.md)
but some features are not available on all platforms.

You can find below the list of features and plugins provided by Ts.ED and the compatibility with the different platforms.

## Runtime support

Here are the runtime support provided by Ts.ED:

<div class="table-features">

| Runtime           |                                                    |
| ----------------- | -------------------------------------------------- |
| Node.js           | <img src="/icons/valid.svg" width="15" alt="yes"/> |
| Node.js + Babel   | <img src="/icons/valid.svg" width="15" alt="yes"/> |
| Node.js + Webpack | <img src="/icons/valid.svg" width="15" alt="yes"/> |
| Node.js + SWC     | <img src="/icons/valid.svg" width="15" alt="yes"/> |
| Bun.js            | <img src="/icons/valid.svg" width="15" alt="yes"/> |

</div>

## Platform features support

Here is the feature list provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                                                                                                                                                                            | Express.js                                         | Koa.js                                             | Fastify.js (\*)                                    | [Serverless AWS](/docs/platform-serverless.md)      | [CLI](/docs/command.md)                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| [Controllers](/docs/controllers.md) <br /> <small>([routing](/docs/controllers.md), [nested](/docs/controllers.html#nested-controllers), [inheritance](/docs/controllers.html#inheritance))</small> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Providers](/docs/providers.md)                                                                                                                                                                     | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Model & JsonSchema](/docs/model.md)                                                                                                                                                                | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [JsonMapper](/docs/json-mapper.md)                                                                                                                                                                  | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Middlewares](/docs/middlewares.md)                                                                                                                                                                 | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Pipes](/docs/pipes.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Interceptors](/docs/interceptors.md)                                                                                                                                                               | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Authentication](/docs/authentication.md)                                                                                                                                                           | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | Using interceptors                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Hooks](/docs/hooks.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Exceptions](/docs/exceptions.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Logger](/docs/logger.md)                                                                                                                                                                           | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Upload files](/docs/upload-files.md)                                                                                                                                                               | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Serve files](/docs/serve-files.md)                                                                                                                                                                 | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Templating](/docs/templating.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Validation](/docs/validation.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Response Filters](/docs/response-filter.md)                                                                                                                                                        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Cache](/docs/cache.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |

</div>

(\*) The platform-fastify has some limitations over the platform-express:

- Deep Query Params aren't supported.
- Session has a small issue over serialization (for hidden field), but it works.

## Elysia platform support

Elysia uses a Fetch-native response model. Its executable `PlatformTestSdk` matrix supports controllers, nested and inherited routes, middleware, scoped DI, headers, query and body parameters, cookies, location, errors, routing, locals, authentication, and modules.

| Feature or plugin                                                                                  | Elysia                                              |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Controllers, DI, routing, middleware, headers, cookies, body parameters                            | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| Native multipart `FormData` / `File` body parameters                                               | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| Node `Readable` streams, manually finalized responses, redirects, response filters, response cache | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| Deep query parameters and custom 404 response                                                      | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| Sessions                                                                                           | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| Static files and views                                                                             | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| Multer decorators and storage engines                                                              | <img src="/icons/invalid.svg" width="15" alt="no"/> |

Static assets can still be installed directly on a custom Elysia application with `@elysia/static` before bootstrapping Ts.ED. Use Elysia-native `FormData` and `File` rather than Multer.

## Platform plugins support

Here are the plugins provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                | Express.js                                         | Koa.js                                              | Fastify.js                                          | [Serverless AWS](/docs/platform-serverless.md)      | [CLI](/docs/command.md)                             |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| [Passport.js](/tutorials/passport.md)   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Prisma](/tutorials/prisma.md)          | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [TypeORM](/tutorials/typeorm.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Mongoose](/tutorials/mongoose.md)      | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [IORedis](/tutorials/ioredis.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Objection.js](/tutorials/objection.md) | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [GraphQL](/tutorials/graphql.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Socket.io](/tutorials/socket-io.md)    | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [OIDC](/tutorials/oidc.md)              | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Stripe](/tutorials/stripe.md)          | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                  | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [MCP](/docs/mcp.md)                     | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |

</div>
