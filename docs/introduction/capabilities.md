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

Ts.ED is a Node.js and TypeScript framework on top of Express/Koa.js. It provides different platform adapters
to build your awesome server-side application.

Depending on the platform you choose, Ts.ED provides a level of abstraction above these common Node.js frameworks (Express/Koa) with the [Platform API](/docs/platform-api.md)
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

Here are the features list provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                                                                                                                                                                            | Express.js                                         | Koa.js                                             | [Serverless λ](/tutorials/serverless.md)            | [CLI](/docs/command.md)                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| [Controllers](/docs/controllers.md) <br /> <small>([routing](/docs/controllers.md), [nested](/docs/controllers.html#nested-controllers), [inheritance](/docs/controllers.html#inheritance))</small> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Providers](/docs/providers.md)                                                                                                                                                                     | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Model & JsonSchema](/docs/model.md)                                                                                                                                                                | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [JsonMapper](/docs/json-mapper.md)                                                                                                                                                                  | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Middlewares](/docs/middlewares.md)                                                                                                                                                                 | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Pipes](/docs/pipes.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Interceptors](/docs/interceptors.md)                                                                                                                                                               | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Authentication](/docs/authentication.md)                                                                                                                                                           | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Hooks](/docs/hooks.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Exceptions](/docs/exceptions.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Logger](/docs/logger.md)                                                                                                                                                                           | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Upload files](/docs/upload-files.md)                                                                                                                                                               | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Serve files](/docs/serve-files.md)                                                                                                                                                                 | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Templating](/docs/templating.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Validation](/docs/validation.md)                                                                                                                                                                   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Response Filters](/docs/response-filter.md)                                                                                                                                                        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Cache](/docs/cache.md)                                                                                                                                                                             | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/> | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> |

</div>

## Platform plugins support

Here are the plugins provided by Ts.ED and the compatibility with the different platforms:

<div class="table-features">

| Features                                | Express.js                                         | Koa.js                                              | [Serverless λ](/tutorials/serverless.md)            | [CLI](/docs/command.md)                             |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| [Passport.js](/tutorials/passport.md)   | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Prisma](/tutorials/prisma.md)          | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [TypeORM](/tutorials/typeorm.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Mongoose](/tutorials/mongoose.md)      | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [IORedis](/tutorials/ioredis.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [Objection.js](/tutorials/objection.md) | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/valid.svg" width="15" alt="yes"/>  |
| [GraphQL](/tutorials/graphql.md)        | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="no"/>   | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Socket.io](/tutorials/socket-io.md)    | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [OIDC](/tutorials/oidc.md)              | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <img src="/icons/invalid.svg" width="15" alt="no"/> | <img src="/icons/invalid.svg" width="15" alt="no"/> |
| [Stripe](/tutorials/stripe.md)          | <img src="/icons/valid.svg" width="15" alt="yes"/> | <img src="/icons/valid.svg" width="15" alt="yes"/>  | <center>?</center>                                  | <img src="/icons/invalid.svg" width="15" alt="no"/> |

</div>
