---
meta:
 - name: description
   content: Authentication configuration 
 - name: keywords
   content: ts.ed express typescript auth node.js javascript decorators
---
# Authentication

Ts.ED provide a decorator [`@Authenticated()`](/api/common/mvc/decorators/method/Authenticated.md) to implementation authentication strategy on your routes.

```typescript
@ControllerProvider("/mypath")
class MyCtrl {
  @Get("/")
  @Authenticated({role: "admin"})
  public getResource(){}
}
```

::: tip
If you planed to use Passport.js, it's recommended to follow the [Passport.js guide here](/tutorials/passport.md).
:::

To configure the authentication you have to override the default provided [`AuthenticatedMiddleware`](/api/common/mvc/components/AuthenticatedMiddleware.md)
by creating a new file under the `middleware` directory. 

Here an example, to override the AuthenticatedMiddleware:
```typescript
import {OverrideMiddleware, AuthenticatedMiddleware} from "@tsed/common";
import {Forbidden} from "ts-httpexceptions";

@OverrideMiddleware(AuthenticatedMiddleware)
export class MyAuthMiddleware implements IMiddleware {
    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: Express.Request,
               @Next() next: Express.NextFunction) { // next is optional here
        
        // options given to the @Authenticated decorator
        const options = endpoint.get(AuthenticatedMiddleware) || {};
        // options => {role: 'admin'}
        
        if (!request.isAuthenticated()) { // passport.js
          throw new Forbidden("Forbidden")  
        }
        
        next();
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
