# Authentication

The annotation [`@Authenticated()`](api/common/mvc/authenticated.md) use a [`ServerLoader.$onAuth()`](api/common/server/serverloader.md) 
method to check the authentication strategy. You can configure this method by adding the `$onAuth()` 
hook on your `Server` class.

## Example with hook

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {
    //...
    /**
     * Set here your authentification strategy.
     * @param request
     * @param response
     * @returns {boolean}
     */
    public $onAuth(request: Express.Request, response: Express.Response, next, options?: any): boolean {

        next(true);
    }
}
```

## Example with @OverrideMiddleware

```typescript

@OverrideMiddleware(AuthenticatedMiddleware)


```


