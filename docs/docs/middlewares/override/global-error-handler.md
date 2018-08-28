# Override Global error handler

All errors are intercepted by the [GlobalErrorHandlerMiddleware](/api/common/mvc/components/GlobalErrorHandlerMiddleware.md).
By default, all HTTP Exceptions are automatically sent to the client, and technical error are
sent as Internal Server Error. 

You can override this middleware with the decorator [@OverrideMiddleware](/api/common/mvc/components/GlobalErrorHandlerMiddleware.md).

```typescript
import * as Express from "express";
import {OverrideMiddleware, GlobalErrorHandlerMiddleware, Err, Req, Res} from "@tsed/common";

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

Then, add your middleware in [`ServerLoader`](/api/common/server/components/ServerLoader.md):

```typescript
import {ServerSettings, ServerLoader} from "@tsed/common";
// Just import the middleware
import './MyGEHMiddleware';


@ServerSettings({...})
export class ServerLoader {
}
```
