---
meta:
 - name: description
   content: Use Oidc-provider with Express.js/Koa.js, TypeScript and Ts.ED. oidc-provider is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.
 - name: keywords
   content: ts.ed express koa oidc typescript node.js javascript decorators
projects:   
 - title: Kit OIDC
   href: https://github.com/TypedProject/tsed-example-oidc
   src: https://oauth.net/images/oauth-logo-square.png      
---
# OIDC 

<Badge text="alpha" /> <Badge text="Contributors are welcome" />

<Banner src="https://oauth.net/images/oauth-logo-square.png" height="100" href="https://github.com/panva/node-oidc-provider"></Banner>

[Oidc-provider](https://github.com/panva/node-oidc-provider) is an OAuth 2.0 Authorization Server with OpenID Connect and many additional features and standards implemented.

::: tip Certification
Filip Skokan has [certified](https://openid.net/certification/) that [oidc-provider](https://github.com/panva/node-oidc-provider) conforms to the following profiles of the OpenID Connect™ protocol

- OP Basic, Implicit, Hybrid, Config, Dynamic, Form Post, and 3rd Party-Init
- OP Front-Channel Logout, Back-Channel Logout, RP-Initiated Logout, and Session Management
- OP FAPI R/W MTLS and Private Key
:::

<Projects type="examples"/>

## Features

Ts.ED provides decorators and services to create an Oidc-provider with your Ts.ED application.

- Create interactions policies,
- Create views,
- Use adapters to connect Oidc-provider with redis/mongo/etc...
- Create automatically jwks keys on startup

## Installation

Before using the `@tsed/oidc-provider` package, we need to install the [oidc-provider](https://www.npmjs.com/package/oidc-provider) module.

```bash
npm install --save oidc-provider ajv
npm install --save @tsed/oidc-provider @tsed/ajv @tsed/adapters
```

Then we need to follow these steps:

- Configure the oidc server,
- Create the Interactions controller,
- Create our first Login interaction and views,
- Create the Accounts provider

## Configuration

Create Oidc server with Ts.ED requires some other Ts.ED features to work properly. 

- Adapters to manage database connection,
- Ajv to validate 
- [Views](/docs/templating.md#configuration) to display pages.

```typescript
import {Env} from "@tsed/core";
import {Configuration, Inject, Constant} from "@tsed/di";
import {FileSyncAdapter} from "@tsed/adapter";
import "@tsed/ajv";
import "@tsed/swagger";
import {OidcSecureMiddleware} from "@tsed/oidc-provider";
import {PlatformApplication} from "@tsed/common";
import {Accounts} from "./services/Accounts"; 
import {InteractionsCtrl} from "./controllers/oidc/InteractionsCtrl"; 

export const rootDir = __dirname;

@Configuration({
  httpPort: 8081,
  mount: {
   "/": [InteractionsCtrl]
  },
  adapters: {
    lowdbDir: join(rootDir, "..", '.db'),
    Adapter: FileSyncAdapter
  },
  oidc: {
    issuer: "http://localhost:8081",
    jwksPath: join(__dirname, "..", "keys", "jwks.json"),
    Accounts: Accounts, // Injectable service to manage your accounts
    clients: [ // statics clients
      {
        client_id: "client_id",
        client_secret: "client_secret",
        redirect_uris: [
          "http://localhost:8081"
        ],
        response_types: ["id_token"],
        grant_types: ["implicit"],
        token_endpoint_auth_method: "none"
      }
    ],
    claims: {
      openid: ["sub"],
      email: ["email", "email_verified"]
    },
    formats: {
      AccessToken: "jwt"
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
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  swagger: [
    {
      path: "/v3/doc",
      specVersion: "3.0.1",
      showExplorer: true
    }
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;
 
  @Constant("env")
  env: Env;

  $beforeRoutesInit() {
    if (this.env === "production") {
      this.app.use(OidcSecureMiddleware) // ensure the https protocol
    } 
  }
}
```

### Options

```typescript
import {Type} from "@tsed/core";
import {Configuration} from "oidc-provider";
import {OidcAccountsMethods, OidcClientsMethods} from "@tsed/oidc-provider";

export interface OidcSettings extends Configuration {
  /**
   * Issuer URI. By default Ts.ED creates issuer with http://localhost:${httpPort}
   */
  issuer?: string;
  /**
   * Path to store jwks keys.
   */
  jwksPath?: string;
  /**
   * Secure keys.
   */
  secureKey?: string[];
  /**
   * Enable proxy.
   */
  proxy?: boolean;
  /**
   * Injectable service to manage accounts.
   */
  Accounts?: Type<OidcAccountsMethods>;
}
```

Documentation on other options properties can be found on the [oidc-provider](https://github.com/panva/node-oidc-provider/blob/master/docs/README.md) documentation page.

## Interactions

Interactions is the User flows in Oidc provider. For example the login page is considered by Oidc-provider as an interaction.
We can define many interactions during the authentication flow, for example:

- Login,
- E-mail verification,
- Password recovery,
- Sharing account data consent,
- etc.

To have a working Oidc server with Ts.ED, we need to create at least one interaction.
To begin, we have to create the `Interactions` controller which will be responsible to run all of our future
custom interactions.

In your controllers directory, create the `oidc/InteractionCtrl.ts` file and copy the following code:

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
}
```
::: tip Note
The Interactions controller exposes the routes to display any interaction. Here we expose the route GET `/interation/:uid`

The `uid` is the unique session id used by Oidc-provider to identify the current user flow.
:::

Now that we have our interactions controller, we can create our first interaction.

Create a new directory `interactions`. We will store all custom interactions in this directory.

```typescript
import {BodyParams, Inject, Post, View} from "@tsed/common";
import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {BadRequest, Unauthorized} from "@tsed/exceptions";
import {Interaction, OidcCtx, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {Accounts} from "../services/Accounts";

@Interaction({
  name: "login"
})
export class LoginInteraction {
  @Constant("env")
  env: Env;

  @Inject()
  accounts: Accounts;

  @View("login")
  async $prompt(@OidcCtx() oidcCtx: OidcCtx,
                @Prompt() prompt: Prompt,
                @OidcSession() session: OidcSession,
                @Params() params: Params,
                @Uid() uid: Uid): Promise<any> {
    const client = await oidcCtx.findClient();

    if (!client) {
      throw new Unauthorized(`Unknown client_id ${params.client_id}`);
    }

    return {
      client,
      uid,
      details: prompt.details,
      params,
      title: "Sign-in",
      flash: false,
      ...oidcCtx.debug()
    };
  }

  @Post("/login")
  @View("login")
  async submit(@BodyParams() payload: any,
               @Params() params: Params,
               @Uid() uid: Uid,
               @OidcSession() session: OidcSession,
               @Prompt() prompt: Prompt,
               @OidcCtx() oidcCtx: OidcCtx) {
    if (prompt.name !== "login") {
      throw new BadRequest("Bad interaction name");
    }

    const client = await oidcCtx.findClient();

    const account = await this.accounts.authenticate(payload.email, payload.password);

    if (!account) {
      return {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: payload.email
        },
        title: "Sign-in",
        flash: "Invalid email or password.",
        ...oidcCtx.debug()
      };
    }

    return oidcCtx.interactionFinished({
      login: {
        account: account.accountId
      }
    });
  }
}
```

::: tip 
`$prompt` is a special hook called by your Interactions controller.
:::

::: tip 
To start the server properly, create the Accounts class in `services` directory with the authenticate and findAccount methods:

```typescript
import {Injectable} from "@tsed/di";
import {AccessToken, AuthorizationCode, DeviceCode} from "@tsed/oidc-provider";

@Injectable()
export class Accounts {
  async findAccount(id: string, token: AuthorizationCode | AccessToken | DeviceCode | undefined, ctx: PlatformContext) {
    return undefined;
  }
  
  async authenticate(email: string, password: string) {
    return undefined;
  }
}
```

We will implement these methods later!
:::

At this step, you can start the Oidc server and check the logs server to see if the well-known configuration 
has been correctly exposed:

```sh
[2021-01-04T07:35:31.523] [INFO ] [TSED] - WellKnown is available on http://0.0.0.0:8081/.well-known/openid-configuration
```
Try also to open the link in your browser!

Now, we need to add the Views to display our login page. Create a views directory on root level and create the following files:

<Tabs class="-code">
  <Tab label="login.ejs">

<<< @/../packages/oidc-provider/test/app/views/login.ejs

  </Tab>
  <Tab label="forms/login-form.ejs">

<<< @/../packages/oidc-provider/test/app/views/forms/login-form.ejs
    
  </Tab>
  <Tab label="partials/header.ejs">
   
<<< @/../packages/oidc-provider/test/app/views/partials/header.ejs      
      
  </Tab>
  <Tab label="partials/footer.ejs">

<<< @/../packages/oidc-provider/test/app/views/partials/footer.ejs   
    
  </Tab>
  <Tab label="partials/login-help.ejs">
  
<<< @/../packages/oidc-provider/test/app/views/partials/login-help.ejs   
  
  </Tab>
</Tabs>

The login page is ready to be displayed. To test it, open the following link:

```
http://0.0.0.0:8081/auth?client_id=client_id&response_type=id_token&scope=openid&nonce=foobar&redirect_uri=http://localhost:8081
```

<figure><img alt="Oidc login page" src="./../assets/oidc/signin-page.png" style="max-height: 400px"></figure>

## Accounts

An Accounts provider can be given to the Oidc configuration. It'll be responsible to manage accounts and resolve the user authentication.

Copy the following code in the `Accounts.ts` file:

```typescript
import {Adapter, InjectAdapter} from "@tsed/adapters";
import {PlatformContext} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {AccessToken, AuthorizationCode, DeviceCode} from "@tsed/oidc-provider";
import {Account} from "../models/Account";

@Injectable()
export class Accounts {
  @InjectAdapter("Accounts", Account)
  adapter: Adapter<Account>;

  async $onInit() {
    const accounts = await this.adapter.findAll();

    // We create a default account if the database is empty
    if (!accounts.length) {
      await this.adapter.create(deserialize({
        email: "test@test.com",
        emailVerified: true
      }, {useAlias: false}));
    }
  }

  async findAccount(id: string, token: AuthorizationCode | AccessToken | DeviceCode | undefined, ctx: PlatformContext) {
    return this.adapter.findById(id);
  }

  async authenticate(email: string, password: string) {
    return this.adapter.findOne({email});
  }
}
```

::: tip
We use the `$onInit` hook to create the first account automatically. You can adapt the script to your needs. 
:::

Then, create the Account model:

```typescript
import {Email, Name, Property} from "@tsed/schema";

export class Account {
  @Name("id")
  _id: string;

  @Email()
  email: string;

  @Property()
  @Name("email_verified")
  emailVerified: boolean;

  get accountId() {
    return this._id;
  }

  async claims() {
    return {
      sub: this._id,
      email: this.email,
      email_verified: this.emailVerified
    };
  }
}
```

::: tip
Claims method is used by Oidc to expose this information in the userInfo endpoint.
:::

## Alter Oidc policy

Ts.ED emits a special `$alterOidcPolicy` event when @tsed/oidc-provider links interactions with Oidc policy. You can change the policy configuration
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
   
    return policy
  }
}
```

## Remove consent interaction

Sometimes with your provider you don't need a consent screen. This use-case might occur if your provider has only first-party clients configured. To achieve that, you need to remove consent interaction from provider policy configuration:

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
    policy.remove("consent");
   
    return policy
  }
}
```
::: warning

Additionally, if you do remove consent prompt, you will get an error when your RPs try to request scopes other than `openid` and `offline_access`. In order to accommodate those usecases, you need to provide accepted property in interaction results whenever `interactionFinished` is called.

```typescript
import {BodyParams, Inject, Post, View} from "@tsed/common";
import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {BadRequest, Unauthorized} from "@tsed/exceptions";
import {Interaction, OidcCtx, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {Accounts} from "../services/Accounts";

@Interaction({
  name: "login"
})
export class LoginInteraction {
  @Constant("env")
  env: Env;

  @Inject()
  accounts: Accounts;

  @Post("/login")
  @View("login")
  async submit(@BodyParams() payload: any,
               @Params() params: Params,
               @Uid() uid: Uid,
               @OidcSession() session: OidcSession,
               @Prompt() prompt: Prompt,
               @OidcCtx() oidcCtx: OidcCtx) {
    // rest of your code...
    
    return oidcCtx.interactionFinished({
      login: {
        account: account.accountId
      },
      consent: { 
        rejectedScopes: [], // array of strings representing rejected scopes, see below
        rejectedClaims: [], // array of strings representing rejected claims, see below
      }
    });
  }
}
```

You should also provide `rejectedScopes` and `rejectedClaims` in `consent` object in order to prevent scopes/claims being exposed to clients you don't want to be exposed to.
:::

<!--
## Clients

A Clients provider can be given to the Oidc configuration. It'll be responsible to manage clients.

```typescript
import {Adapter, InjectAdapter} from "@tsed/adapters";
import {PlatformContext} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {AccessToken, AuthorizationCode, DeviceCode} from "@tsed/oidc-provider";
import {ClientMetadata} from "oidc-provider";
import {OidcClient} from "../models/OidcClient";

@Injectable()
export class Clients {
  @InjectAdapter("Clients", OidcClient)
  adapter: Adapter<OidcClient>;

  async find(clientId: string): Promise<ClientMetadata> {
    return serialize(this.adapter.findById(clientId));
  }
}
```

Then, create the Client model:

<Tabs class="-code">
  <Tab label="Client">
  
```typescript
import {
  AdditionalProperties,
  CollectionOf,
  Default,
  Email,
  Enum,
  Groups,
  Integer,
  Name,
  Property,
  Required,
  Uri
} from "@tsed/schema";
import {snakeCase} from "change-case";
import {ApplicationTypes} from "./ApplicationTypes";
import {GrantTypes} from "./GrantTypes";
import {ResponseTypes} from "./ResponseTypes";
import {SubjectTypes} from "./SubjectTypes";

function Snake(target: Object, propertyKey: string) {
  return Name(snakeCase(propertyKey))(target, propertyKey);
}

export class Client {
  @Required()
  @Snake
  @Groups("!creation")
  clientId: string;

  @Required()
  @Snake
  @Groups("!creation")
  clientSecret: string;

  @Uri()
  @Snake
  redirectUris: string[] = [];

  @Enum(ResponseTypes)
  @Snake
  responseTypes: ResponseTypes[] = [];   // types: code / id_token token / code id_token token / token / none

  @Enum(GrantTypes)   // types: authorization_code, implicit, refresh_token, client_credentials
  @Snake
  grantTypes: GrantTypes[] = [];

  @Enum(ApplicationTypes)   // types: web, native, service
  @Snake
  @Default(ApplicationTypes.WEB)
  applicationType: ApplicationTypes;

  @Snake
  clientName: string;

  @Uri()
  @Snake
  clientUri: string;

  @Uri()
  @Snake
  logoUri: string;

  @Snake
  tokenEndpointAuthMethod: string;

  @Snake
  defaultMaxAge: number;

  @Snake
  @CollectionOf(String)
  defaultAcrValues: string[];

  @Uri()
  @CollectionOf(String)
  @Snake
  postLogoutRedirectUris: string[];

  @Property(String)
  scope: string;

  @Uri()
  @Snake
  policyUri: string;

  @Uri()
  @Snake
  initiateLoginUri: string;

  @Uri()
  @Snake
  jwksUri: string;

  @Uri()
  @Snake
  tosUri: string;

  @Email()
  @CollectionOf(String)
  contacts: string[];

  @Integer()
  @Snake
  clientIdIssuedAt: number;

  @Enum(SubjectTypes)
  @Snake
  subjectType: SubjectTypes;

  get _id() {
    return this.clientId;
  }

  set _id(id: string) {
    this.clientId = id;
  }
}
```

  </Tab>
  <Tab label="GrantTypes.ts">

```typescript
export enum GrantTypes {
  AUTHORIZATION_CODE = 'authorization_code',
  IMPLICIT = 'implicit',
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials'
}
```  
  
  </Tab>
  <Tab label="ApplicationTypes.ts">

```typescript
export enum ApplicationTypes {
  WEB = 'web',
  NATIVE = 'native'
}
```  
  
  </Tab>  
  <Tab label="ResponseTypes.ts">

```typescript
export enum ResponseTypes {
  CODE = 'code',
  ID_TOKEN = 'id_token',
  TOKEN = 'token'
}
```  
  
  </Tab>
  <Tab label="SubjectTypes.ts">

```typescript
export enum SubjectTypes {
  PUBLIC = "public",
  PAIRWISE = "pairwise"
}
```  
  
  </Tab>
</Tabs>
-->

## Support Oidc-provider

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
