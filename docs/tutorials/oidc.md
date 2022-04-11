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

[oidc-provider](https://github.com/panva/node-oidc-provider) is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.

::: tip Certification
Filip Skokan has [certified](https://openid.net/certification/) that [oidc-provider](https://github.com/panva/node-oidc-provider) conforms to the following profiles of the OpenID Connect™ protocol

- OP Basic, Implicit, Hybrid, Config, Dynamic, Form Post, and 3rd Party-Init
- OP Front-Channel Logout, Back-Channel Logout, RP-Initiated Logout, and Session Management
- OP FAPI R/W MTLS and Private Key
  :::

<Projects type="projects"/>

## Features

Ts.ED provides decorators and services to create an OIDC provider with your Ts.ED application.

- Create interactions policies,
- Create views,
- Use adapters to connect oidc-provider with redis/mongo/etc...
- Automatically create jwks keys on startup

## Installation

Before using the `@tsed/oidc-provider` package, we need to install the [oidc-provider](https://www.npmjs.com/package/oidc-provider) module.

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
Select "OpenID Connect provider" upon initialization with the Ts.ED CLI and the following will be automatically generated.
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

Documentation on other options properties can be found on the [oidc-provider](https://github.com/panva/node-oidc-provider/blob/master/docs/README.md) documentation page.

::: warning
It is advised to set `path` to `/oidc` to prevent oidc-provider becoming the default exception handler on all routes. In future versions of Ts.ED this will be the default value.
:::

## TLS proxy

The OpenID Connect specification does not allow unsecured HTTP requests and oidc-provider blocks them by default. While there is a [workaround](https://github.com/panva/node-oidc-provider/blob/main/recipes/implicit_http_localhost.md), the proper way is to use a TLS offloading proxy in front of your app.
When developing, the easiest way is to use [Caddy](https://caddyserver.com/). To use it, set `proxy: true` in your [options](#Options) and then run:

```
caddy reverse-proxy --from localhost:8443 --to localhost:8083
```

## Accounts

oidc-provider requires an Account model to find an account during an interaction. The model can be used in conjunction with the adapter to fetch an account.

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

Interactions are the user flows in oidc-provider. For example, the login page is considered by oidc-provider as an interaction.
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
The controller Interactions exposes the routes to display any interaction. Here we expose the route GET `/interation/:uid`

The `uid` is the unique session id used by oidc-provider to identify the current user flow.
:::

Now that we have our interactions controller, we can create our first interaction.

Create a new directory `interactions`. We will store all custom interactions in this directory.

<Tabs class="-code">
  <Tab label="LoginInteraction.ts">

<<< @/../packages/security/oidc-provider/test/app/interactions/LoginInteraction.ts

  </Tab>
  <Tab label="ConsentInteraction.ts">

<<< @/../packages/security/oidc-provider/test/app/interactions/ConsentInteraction.ts

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

Now, we need to add the Views to display our login page. Create a views directory on root level and create the following files:

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

## Alter OIDC policy

Ts.ED emits a special `$alterOidcPolicy` event when @tsed/oidc-provider links interactions with OIDC policy. You can change the policy configuration
by adding `$alterOidcPolicy` on InteractionsCtrl:

```typescript
import {Get} from "@tsed/common";
import {Interactions, OidcCtx, DefaultPolicy} from "@tsed/oidc-provider";
import {LoginInteraction} from "../../interactions/LoginInteraction";

@Interactions({
  path: "/interaction/:uid",
  children: [
    LoginInteraction // register its children interations
  ]
})
export class InteractionsCtrl {
  @Get("/")
  async promptInteraction(@OidcCtx() oidcCtx: OidcCtx) {
    return oidcCtx.runInteraction();
  }

  $alterOidcPolicy(policy: DefaultPolicy) {
    // do something

    return policy;
  }
}
```

## Debug

Use `DEBUG=oidc-provider:*` for debugging oidc-provider.

## Support oidc-provider

If you or your business uses [oidc-provider](https://github.com/panva/node-oidc-provider), please consider becoming a sponsor, so we can continue maintaining it and adding new features carefree.

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
