The annotation `@Authentification` use a [`ServerLoader.$onAuth()`](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonauthrequest-response-next-void) method to check the authentification strategy.
You can configure this method by adding an `isAuthenticated()` method on your `Server` class.

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
    public isAuthenticated(request: Express.Request, response: Express.Response): boolean {

        return true;
    }
}
```

If your strategy is asynchrone use next function like this:

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
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        setTimeout(() => {
            next(true);
        });
    }
}
```
