# Global error handler

All errors are intercepted by the [GlobalErrorHandlerMiddleware](docs/api/common/mvc/globalerrorhandlermiddleware.md). 
By default, all HTTP Exceptions are automatically sent to the client, and technical error are
sent as Internal Server Error. 

You can override this middleware with the decorator [@OverrideMiddleware](docs/api/common/mvc/globalerrorhandlermiddleware.md).

```typescript
import * as Express from "express";
import {OverrideMiddleware, GlobalErrorHandlerMiddleware, Err, Req, Res} from "ts-express-decorators";

@OverrideMiddleware(GlobalErrorHandlerMiddleware)
export class MyGEHMiddleware {
 
   use(@Err() error: any,
           @Req() request: Express.Request,
           @Res() response: Express.Response): any {
   
           const toHTML = (message = "") => message.replace(/\n/gi, "<br />");
   
           if (error instanceof Exception || error.status) {
               request.log.error({
                   error: {
                       message: error.message,
                       stack: error.stack,
                       status: error.status
                   }
               });
               response.status(error.status).send(toHTML(error.message));
               return;
           }
   
           if (typeof error === "string") {
               response.status(404).send(toHTML(error));
               return;
           }
   
           request.log.error({
               error: {
                   status: 500,
                   message: error.message,
                   stack: error.stack
               }
           });
           response.status(error.status || 500).send("Internal Error");
   
           return;
       }
}
```

### Other examples

* [Send response](docs/middlewares/override/send-response.md)
* [Authentication](docs/middlewares/override/authentication.md)
* [Response view](docs/middlewares/override/response-view.md)

<div class="guide-links">
<a href="#/docs/converters">Converters</a>
<a href="#/docs/filters">Filters</a>
</div>