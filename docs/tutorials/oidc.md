---
meta:
  - name: description
    content: Use oidc-provider with Express.js/Koa.js, TypeScript and Ts.ED. oidc-provider is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.
  - name: keywords
    content: ts.ed express koa oidc typescript node.js javascript decorators
projects:
  - title: Kit OIDC
    href: https://github.com/tsedio/tsed-example-oidc
    src: https://oauth.net/images/oauth-logo-square.png
---

# OIDC

<Badge text="beta" /> <Badge text="Contributors are welcome" />

<Banner src="https://oauth.net/images/oauth-logo-square.png" height="100" href="https://github.com/panva/node-oidc-provider"></Banner>

[oidc-provider](https://github.com/panva/node-oidc-provider) is an OAuth 2.0 Authorization Server with OpenID Connect
and many additional features and standards implemented.

::: tip Certification
Filip Skokan has [certified](https://openid.net/certification/)
that [oidc-provider](https://github.com/panva/node-oidc-provider) conforms to the following profiles of the OpenID
Connect™ protocol

- OP Basic, Implicit, Hybrid, Config, Dynamic, Form Post, and 3rd Party-Init
- OP Front-Channel Logout, Back-Channel Logout, RP-Initiated Logout, and Session Management
- OP FAPI R/W MTLS and Private Key
  :::

<Projects type="projects"/>

## OIDC compatibility

- For OIDC v7, use `@tsed/oidc-provider` v7.19 and under
- For OIDC v8, use `@tsed/oidc-provider` v7.21 and higher

Since the v8, have changed the exported Provider (named by default) and the entire is under ESM convention, Ts.ED isn't
able to maintain the v7 and v8 at the same time.

## Features

Ts.ED provides decorators and services to create an OIDC provider with your Ts.ED application.

- Create interactions policies,
- Create views,
- Use adapters to connect oidc-provider with redis/mongo/etc...
- Automatically create jwks keys on startup

## Installation

Before using the `@tsed/oidc-provider` package, we need to install
the [oidc-provider](https://www.npmjs.com/package/oidc-provider) module.

```bash
npm install --save oidc-provider
npm install --save @tsed/oidc-provider @tsed/jwks @tsed/adapters
```

Then we need to follow these steps:

- Configure the oidc server,
- Create the Accounts provider
- Create the Interactions controller,
- Create our first Login interaction and views,

::: tip
Select "OpenID Connect provider" upon initialization with the Ts.ED CLI and the following will be automatically
generated.
:::

## Configuration

To use oidc-provider with Ts.ED it requires some other Ts.ED features to work properly.

- Adapters to manage database connection,
- [Views](/docs/templating.md#configuration) to display pages.

Use `tsed init yourApp` to create a TSed application and adjust `Server.ts`:

```typescript
import {Configuration} from "@tsed/di";
import {Accounts} from "./services/Accounts";
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl";

@Configuration({
  httpPort: 8083,
  mount: {
    "/": [InteractionsCtrl]
  },
  adapters: {
    lowdbDir: join(process.cwd(), "..", ".db"),
    Adapter: FileSyncAdapter
  },
  oidc: {
    // path: "/oidc",
    Accounts: Accounts,
    jwksPath: join(process.cwd(), "..", "..", "keys", "jwks.json"),
    // allowHttpLocalhost: false, // by default. true in dev mode and false in production
    clients: [
      {
        client_id: "client_id",
        client_secret: "client_secret",
        redirect_uris: ["http://localhost:3000"],
        response_types: ["id_token"],
        grant_types: ["implicit"],
        token_endpoint_auth_method: "none"
      }
    ],
    claims: {
      openid: ["sub"],
      email: ["email", "email_verified"]
    },
    features: {
      // disable the packaged interactions
      devInteractions: {enabled: false},
      encryption: {enabled: true},
      introspection: {enabled: true},
      revocation: {enabled: true}
    }
  },
  views: {
    root: `./views`,
    extensions: {
      ejs: "ejs"
    }
  }
})
class Server {}
```

### Options

<<< @/../packages/security/oidc-provider/src/domain/OidcSettings.ts

Documentation on other options properties can be found on
the [oidc-provider](https://github.com/panva/node-oidc-provider/blob/master/docs/README.md) documentation page.

::: warning
It is advised to set `path` to `/oidc` to prevent oidc-provider becoming the default exception handler on all routes. In
future versions of Ts.ED this will be the default value.
:::

## Use Redis <Badge text="6.129.0+"/>

Ts.ED provide a Redis adapter for OIDC provider. You just have to install `@tsed/adapters-redis` and configure a redis
connection to store
all OIDC provider data in Redis.

```shell
npm i --save @tsed/redis-adapters @tsed/ioredis ioredis
npm i --save-dev ioredis-mock
```

Then create a new `RedisConnection.ts` for your new redis connection:

```typescript
import Redis from "ioredis";
import {registerConnectionProvider} from "@tsed/ioredis";

export const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
export type REDIS_CONNECTION = Redis;

registerConnectionProvider({
  provide: REDIS_CONNECTION,
  name: "default" // you can change this name at your conveniance
});
```

::: tip Note

You can find more details on [@tsed/ioredis documentation](/tutorials/ioredis.md).

:::

Then edit the Server settings:

```typescript
import {OIDCRedisAdapter, RedisAdapter} from "@tsed/adapters-redis";
import {Configuration} from "@tsed/di";
import {Accounts} from "./services/Accounts";
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl";

@Configuration({
  httpPort: 8083,
  mount: {
    "/": [InteractionsCtrl]
  },
  redis: [
    {
      name: "default"
      // add redis configuration
    }
  ],
  adapters: {
    Adapter: RedisAdapter,
    connectionName: "default"
  },
  oidc: {
    Adapter: OIDCRedisAdapter,
    connectionName: "default"
    /// other options
  }
})
export class Server {}
```

That all!

## Allow HTTP & localhost

By default, Ts.ED enable HTTP and localhost domain as a valid redirect uri for your OIDC project. But, sometimes you
want to allow also HTTP and localhost domain in your `integration` or `QA`
environment.

```typescript
@Configuration({
  oidc: {
    allowHttpLocalhost: true
  }
})
```

## Secure cookies

By default, Ts.ED disable the secureCookies options in `development` mode and enable it in `production` mode. But,
sometimes this options in `integration` environment because your server isn't under a Https protocol.

```typescript
@Configuration({
  oidc: {
    secureCookies: false
  }
})
```

## TLS proxy

The OpenID Connect specification does not allow unsecured HTTP requests and oidc-provider blocks them by default. While
there is a [workaround](https://github.com/panva/node-oidc-provider/blob/main/recipes/implicit_http_localhost.md), the
proper way is to use a TLS offloading proxy in front of your app.
When developing, the easiest way is to use [Caddy](https://caddyserver.com/). To use it, set `proxy: true` in
your [options](#Options) and then run:

```
caddy reverse-proxy --from localhost:8443 --to localhost:8083
```

## Accounts

oidc-provider requires an Account model to find an account during an interaction. The model can be used in conjunction
with the adapter to fetch an account.

<Tabs class="-code">
  <Tab label="models/Account.ts">

<<< @/../packages/security/oidc-provider/test/app/models/Account.ts

  </Tab>
  <Tab label="services/Accounts.ts">

<<< @/../packages/security/oidc-provider/test/app/services/Accounts.ts

  </Tab>
</Tabs>

::: tip
Claims method is used by oidc-provider to expose this information in the userInfo endpoint.
:::

::: tip
We use the `$onInit` hook to create the first account automatically. You can adapt the script to your needs.
:::

## Interactions

Interactions are the user flows in oidc-provider. For example, the login page is considered by oidc-provider as an
interaction.
We can define many interactions during the authentication flow, for example:

- Login,
- E-mail verification,
- Password recovery,
- Sharing account data consent,
- etc.

To have a working OIDC server with Ts.ED, we need to create at least a login and a consent interaction.
To start, we have to create the `Interactions` controller which will be responsible to run all of our future
custom interactions.

In your controller's directory, create the `oidc/InteractionsCtrl.ts` file and copy the following code:

<<< @/../packages/security/oidc-provider/test/app/controllers/oidc/InteractionsCtrl.ts

::: tip Note
The controller Interactions exposes the routes to display any interaction. Here we expose the route
GET `/interation/:uid`

The `uid` is the unique session id used by oidc-provider to identify the current user flow.
:::

::: tip Note

`children` option define the priority order of each interaction. In our example, LoginInteraction have a priority over
ContentInteraction, CustomInteraction and AbortInteraction.
Changing order her may affect the interaction behavior when the `/authorize` endpoint is called by the consumer.

Another possibility is to define `priority` option on @@Interaction@@ decorator. In this case, the `children` order
won't be
had an effect on the interaction priority.
:::

Now that we have our interaction controller, we can create our first interaction.

Create a new directory `interactions`. We will store all custom interactions in this directory.

<Tabs class="-code">
  <Tab label="LoginInteraction.ts">

<<< @/../packages/security/oidc-provider/test/app/interactions/LoginInteraction.ts

  </Tab>
  <Tab label="ConsentInteraction.ts">

<<< @/../packages/security/oidc-provider/test/app/interactions/ConsentInteraction.ts

  </Tab>
  <Tab label="AbortInteraction.ts">

<<< @/../packages/security/oidc-provider/test/app/interactions/AbortInteraction.ts

  </Tab>
</Tabs>

::: tip
`$prompt` is a special hook called by your Interactions controller.
:::

At this step, you can start the OIDC server and check the logs server to see if the well-known configuration
has been correctly exposed:

```sh
[2021-01-04T07:35:31.523] [INFO ] [TSED] - WellKnown is available on http://0.0.0.0:8083/.well-known/openid-configuration
```

Try also to open the link in your browser!

Now, we need to add the Views to display our login page. Create a views directory on root level and create the following
files:

<Tabs class="-code">
  <Tab label="login.ejs">

<<< @/../packages/security/oidc-provider/test/app/views/login.ejs

  </Tab>
  <Tab label="forms/login-form.ejs">

<<< @/../packages/security/oidc-provider/test/app/views/forms/login-form.ejs

  </Tab>
  <Tab label="partials/header.ejs">

<<< @/../packages/security/oidc-provider/test/app/views/partials/header.ejs

  </Tab>
  <Tab label="partials/footer.ejs">

<<< @/../packages/security/oidc-provider/test/app/views/partials/footer.ejs

  </Tab>
  <Tab label="partials/login-help.ejs">

<<< @/../packages/security/oidc-provider/test/app/views/partials/login-help.ejs

  </Tab>
</Tabs>

The login page is ready to be displayed. To test it, open the following link:

```
http://localhost:8083/auth?client_id=client_id&response_type=id_token&scope=openid&nonce=foobar&redirect_uri=http://localhost:3000

```

<figure><img alt="Oidc login page" src="./../assets/oidc/signin-page.png" style="max-height: 400px"></figure>

## Create custom interaction

Here a custom interaction with extra methods to configure checks precondition and details information:

<<< @/../packages/security/oidc-provider/test/app/interactions/CustomInteraction.ts

See more details on: https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#interactionspolicy

## Alter configuration

Some part of the OIDC provider configuration needs function to work. And ideally these functions should have access to
our Ts.ED Services.

It's possible to do that by listening the `$alterOidcConfiguration` hook and inject the expected functions in the
configuration:

```typescript
import {PlatformContext} from "@tsed/common";
import {InjectContext, Module} from "@tsed/di";
import {AuthorizationCode, BackchannelAuthenticationRequest, DeviceCode, RefreshToken, Client, OidcSettings} from "@tsed/oidc-provider";
import {KoaContextWithOIDC, Provider, ResourceServer} from "oidc-provider";

@Module()
class OidcResourceIndicatorsModule {
  @InjectContext()
  protected $ctx: PlatformContext; // retrieve the Ts.ED context

  async $alterOidcConfiguration(config: OidcSettings): Promise<OidcSettings> {
    // example with the
    config.features!.resourceIndicators = {
      enabled: true,
      defaultResource: this.defaultResource.bind(this),
      getResourceServerInfo: this.getResourceServerInfo.bind(this),
      useGrantedResource: this.useGrantedResource.bind(this)
    };

    return config;
  }

  protected async defaultResource(ctx: KoaContextWithOIDC): Promise<string | string[]> {
    ///
    return "https://mydomain.com";
  }

  protected async getResourceServerInfo(ctx: KoaContextWithOIDC, resourceIndicator: string, client: Client): Promise<ResourceServer> {
    ///
    return {};
  }

  protected async useGrantedResource(
    ctx: KoaContextWithOIDC,
    model: AuthorizationCode | RefreshToken | DeviceCode | BackchannelAuthenticationRequest
  ): Promise<boolean> {
    return true;
  }
}
```

## Alter OIDC policy

Ts.ED emits a special `$alterOidcPolicy` event when @tsed/oidc-provider links interactions with OIDC policy. You can
change the policy configuration
by adding `$alterOidcPolicy` on InteractionsCtrl:

```typescript
import {Get, PathParams} from "@tsed/common";
import {Interactions, OidcCtx, DefaultPolicy} from "@tsed/oidc-provider";
import {LoginInteraction} from "../../interactions/LoginInteraction";

@Interactions({
  path: "/interaction/:uid",
  children: [
    LoginInteraction // register its children interations
  ]
})
export class InteractionsCtrl {
  @Get("/:name?")
  async promptInteraction(@PathParams("name") name: string | undefined, @OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.runInteraction(name);
  }

  $alterOidcPolicy(policy: DefaultPolicy) {
    // do something

    return policy;
  }
}
```

## Implement your own adapter

```typescript
import {OidcAdapterMethods} from "@tsed/oidc-provider";
import {Adapter} from "@tsed/adapters";

export class CustomAdapter<Model extends AdapterModel> extends Adapter<Model> implements OidcAdapterMethods {
  //
  // implement all required methods
  //
  create(value: Partial<Omit<Model, "_id">>, expiresAt?: Date): Promise<Model> {}

  update(id: string, value: Model, expiresAt?: Date): Promise<Model | undefined> {}

  updateOne(predicate: Partial<Model>, value: Partial<Model>, expiresAt?: Date): Promise<Model | undefined> {}

  upsert(id: string, value: Model, expiresAt?: Date): Promise<Model> {}

  findOne(predicate: Partial<Model>): Promise<Model | undefined> {}

  findById(id: string): Promise<Model | undefined> {}

  findAll(predicate?: Partial<Model>): Promise<Model[]> {}

  deleteOne(predicate: Partial<Model>): Promise<Model | undefined> {}

  deleteMany(predicate: Partial<Model>): Promise<Model[]> {}

  deleteById(id: string): Promise<Model | undefined> {}

  //
  // if you use redis implement also the following methods
  //
  async findByUserCode(userCode: string) {}

  async findByUid(uid: string) {}

  async destroy(id: string) {}

  async revokeByGrantId(grantId: string) {}

  async consume(grantId: string) {}
}
```

::: tip
You can find original adapters from oidc-provider project
here: https://github.com/panva/node-oidc-provider/blob/main/example/adapters
:::

## Debug

Use `DEBUG=oidc-provider:*` for debugging oidc-provider.

## Support oidc-provider

If you or your business uses [oidc-provider](https://github.com/panva/node-oidc-provider), please consider becoming a
sponsor, so we can continue maintaining it and adding new features carefree.

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
