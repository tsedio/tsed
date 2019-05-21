# Override Authentication <Badge text="deprecated" type="warn" />

The annotation @@Authenticated@@ use the @@AuthenticatedMiddleware@@
to check the authentication strategy. 

To customise this behavior, the right way is to override the default `AuthenticatedMiddleware` then implement directly 
your authentication strategy (with [passport.js for example](/tutorials/passport.md)).

## Use case

```typescript
import {Controller, Get, Authenticated} from "@tsed/common";

@Controller("/mypath")
class MyCtrl {
  @Get("/")
  @Authenticated({role: "admin"})
  public getResource(){}
}
```

## Example

```typescript
import {Unauthorized} from "ts-httpexceptions";
import {IMiddleware, EndpointInfo, Req, Middleware} from "@tsed/common";

@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {
  public use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    const options = endpoint.get(AuthenticatedMiddleware) || {};
    // @ts-ignore
    if (!request.isAuthenticated(options)) {
      throw new Unauthorized("Unauthorized");
    }
  }
}
```

::: tip
By default, the server import automatically your middlewares matching with this rules `${rootDir}/middlewares/**/*.ts` (See [componentScan configuration](/configuration.md)).

```
.
├── src
│   ├── controllers
│   ├── services
│   ├── middlewares
│   └── Server.ts
└── package.json
```

If not, just import your middleware in your server or edit the [componentScan configuration](/configuration.md).

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "./src/other/directory/MyAuthMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
  
 
}
```
:::
