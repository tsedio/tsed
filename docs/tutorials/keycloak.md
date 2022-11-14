---
meta:
  - name: description
    content: Use Keycloak with Express, TypeScript and Ts.ED to secure your application.
  - name: keywords
    content: ts.ed express typescript keycloak node.js javascript decorators
---

# Keycloak

<Banner src="/keycloak.svg" height="200" href="https://www.keycloak.org"></Banner>

This tutorial shows you how you can secure your Ts.ED application with an existing Keycloak instance.

## Installation

Before securing the application with Keycloak, we need to install the [Keycloak Node.js Adapter](https://www.npmjs.com/package/keycloak-connect) and [Express-Session](https://www.npmjs.com/package/express-session) modules.

::: tip Note
The version of the `keycloak-connect` module should be the same version as your Keycloak instance.
:::

```bash
npm install --save keycloak-connect
npm install --save express-session
npm install --save-dev @types/express-session
```

## Download keycloak.json

Put the keycloak.json file for your Keycloak client to `src/config/keycloak`.

How exactly the file is downloaded can be found in the official [Keycloak documentation](https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter).

## KeycloakService

Create a KeycloakService in `src/services` that handles the memory store, the Keycloak instance and the token.

```typescript
import {Service} from "@tsed/di";
import {MemoryStore} from "express-session";
import {$log} from "@tsed/common";
import {Token} from "keycloak-connect";
import KeycloakConnect = require("keycloak-connect");

@Service()
export class KeycloakService {
  private keycloak: KeycloakConnect.Keycloak;
  private memoryStore: MemoryStore;
  private token: Token;

  constructor() {
    this.initKeycloak();
  }

  public initKeycloak(): KeycloakConnect.Keycloak {
    if (this.keycloak) {
      $log.warn("Trying to init Keycloak again!");
      return this.keycloak;
    } else {
      $log.info("Initializing Keycloak...");
      this.memoryStore = new MemoryStore();
      this.keycloak = new KeycloakConnect({store: this.memoryStore}, "src/config/keycloak/keycloak.json");
      return this.keycloak;
    }
  }

  public getKeycloakInstance(): KeycloakConnect.Keycloak {
    return this.keycloak;
  }

  public getMemoryStore(): MemoryStore {
    return this.memoryStore;
  }

  public getToken(): Token {
    return this.token;
  }

  public setToken(token: Token): void {
    this.token = token;
  }
}
```

### Add KeycloakService to Server

Make sure that the KeycloakService is part of the componentsScan array of the global configuration.

The `KeycloakService` can then be injected in the Server class and the middleware of `express-session` and `keycloak-connect` can be called.

```typescript
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import session from "express-session";

@Configuration({
  middlewares: ["cors", "compression", "cookie-parser", "method-override", "json-parser", "urlencoded-parser"]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Inject()
  protected keycloakService: KeycloakService;

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit(): void {
    this.app.use(
      session({
        secret: "thisShouldBeLongAndSecret",
        resave: false,
        saveUninitialized: true,
        store: this.keycloakService.getMemoryStore()
      })
    );
    this.app.use(this.keycloakService.getKeycloakInstance().middleware());
  }
}
```

## KeycloakMiddleware

To secure your routes add a KeycloakMiddleware class to `src/middlewares`.

With each request the token is set to the request property `kauth`.

In order to be able to use the token we set this in the KeycloakService.

```typescript
import {Context, MiddlewareMethods, Inject, Middleware} from "@tsed/common";
import {KeycloakAuthOptions} from "../decorators/KeycloakAuthDecorator";
import {KeycloakService} from "../services/KeycloakService";

@Middleware()
export class KeycloakMiddleware implements MiddlewareMethods {
  @Inject()
  protected keycloakService: KeycloakService;

  public use(@Context() ctx: Context) {
    const options: KeycloakAuthOptions = ctx.endpoint.store.get(KeycloakMiddleware);
    const keycloak = this.keycloakService.getKeycloakInstance();

    if (ctx.getRequest().kauth.grant) {
      this.keycloakService.setToken(ctx.getRequest().kauth.grant.access_token);
    }

    return keycloak.protect(options.role);
  }
}
```

## KeycloakAuthDecorator

To protect certain routes create a KeycloakAuthDecorator at `src/decorators`.

```typescript
import {Returns} from "@tsed/schema";
import {UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Security} from "@tsed/schema";
import {KeycloakMiddleware} from "../middlewares/KeycloakMiddleware";

export interface KeycloakAuthOptions extends Record<string, any> {
  role?: string;
  scopes?: string[];
}

export function KeycloakAuth(options: KeycloakAuthOptions = {}): Function {
  return useDecorators(UseAuth(KeycloakMiddleware, options), Security("oauth2", ...(options.scopes || [])), Returns(403));
}
```

## Protecting routes role-based in a controller

Now we can protect routes with our custom KeycloakAuth decorator.

```typescript
import {Controller, Get} from "@tsed/common";
import {KeycloakAuth} from "../decorators/KeycloakAuthDecorator";

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/")
  @KeycloakAuth({role: "realm:example-role"})
  get() {
    return "hello";
  }
}
```

## Swagger integration

If you would like to log in directly from your Swagger UI add the following code to your Swagger config.

Don't forget to replace `authorizationUrl`, `tokenUrl` and `refreshUrl` with your custom keycloak URLs.

```typescript
swagger: [
  {
    path: `/v3/docs`,
    specVersion: "3.0.1",
    spec: {
      components: {
        securitySchemes: {
          oauth2: {
            type: "oauth2",
            flows: {
              authorizationCode: {
                authorizationUrl: "https://<keycloak-url>/auth/realms/<my-realm>/protocol/openid-connect/auth",
                tokenUrl: "https://<keycloak-url>/auth/realms/<my-realm>/protocol/openid-connect/token",
                refreshUrl: "https://<keycloak-url>/auth/realms/<my-realm>/protocol/openid-connect/token",
                scopes: {openid: "openid", profile: "profile"}
              }
            }
          }
        }
      }
    }
  }
];
```

## Author

<GithubContributors users="['xCryzed']"/>
