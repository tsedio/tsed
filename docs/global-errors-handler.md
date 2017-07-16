[Home](https://github.com/Romakita/ts-express-decorators/wiki) > Global Errors Handler


All errors are intercepted by the [ServerLoader]() class. By default, all 
HTTP Exceptions are automatically sent to the client, and technical error are
sent as Internal Server Error. 

You can override the default method by adding `onError` method your `Server` class.

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {
    // ...

    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public $onError(error: any, request: Express.Request, response: Express.Response, next: Function): void {

        console.error(error);

        return super.onError(error, request, response, next);
    }
}
```