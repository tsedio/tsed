---
meta:
 - name: description
   content: Use Oidc-provider with Express.js/Koa.js, TypeScript and Ts.ED. oidc-provider is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.
 - name: keywords
   content: ts.ed express koa oidc typescript node.js javascript decorators
---
# OIDC 

<Banner src="https://oauth.net/images/oauth-logo-square.png" height="200" href="https://github.com/panva/node-oidc-provider"></Banner>

[Oidc-provider](https://github.com/panva/node-oidc-provider) is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.

::: tip Certification
Filip Skokan has [certified](https://openid.net/certification/) that [oidc-provider](https://github.com/panva/node-oidc-provider) conforms to the following profiles of the OpenID Connect™ protocol

- OP Basic, Implicit, Hybrid, Config, Dynamic, Form Post, and 3rd Party-Init
- OP Front-Channel Logout, Back-Channel Logout, RP-Initiated Logout, and Session Management
- OP FAPI R/W MTLS and Private Key
:::

## Features

Ts.ED provides decorators and services to create an Oidc-provider with your Ts.ED application.

- Create interactions policies,
- Create view,
- Use adapters to connect Oidc-provider with redis/mongo/etc...
- Create automatically jwks keys on startup

## Installation

Before using the `@tsed/oidc-provider` package, we need to install the [oidc-provider](https://www.npmjs.com/package/oidc-provider) module.

```bash
npm install --save oidc-provider
npm install --save @tsed/oidc-provider
```

## Configuration

```typescript
import {Configuration, Inject} from "@tsed/di";
import {FileSyncAdapter} from "@tsed/adapter";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/oidc-provider";
import {Accounts} from "./services/Accounts"; 
// import {Clients} from "./services/Clients"; 

export const rootDir = __dirname;

@Configuration({
  adapters: {
    lowdbDir: join(rootDir, "..", '.db'),
    Adapter: FileSyncAdapter
  },
  oidc: {
    jwksPath: join(__dirname, "..", "keys", "jwks.json"),
    Accounts: Accounts, // Injectable service to manage your accounts
    // Clients: Clients // Injectable serice to manage oidc clients,

    options: {
      
    }
  }
})
export class Server {
}
```

## Support Oidc-provider

If you or your business use [oidc-provider](https://github.com/panva/node-oidc-provider), please consider becoming a sponsor, so he can continue maintaining it and adding new features carefree.

