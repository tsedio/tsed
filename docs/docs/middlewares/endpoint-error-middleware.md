# Endpoint error middleware

`@MiddlewareError()` lets you handle all error when you add your middleware on an Endpoint.

Create your middleware error:
```typescript
import {IMiddleware, MiddlewareError, Request, Response, Next, Err} from "ts-express-decorators";
import {$log} from "ts-log-debug";

@MiddlewareError()
export default class ErrorMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): any {

        if (response.headersSent) {
            return next(error);
        }
        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
          
    }
}
```

Then, add your middleware on your endpoint controller's:

```typescript
import {Controller, Get} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @UseAfter(ErrorMiddleware)
   getContent() {
      throw NotFound('Content not found');
   }
}     
```

<div class="guide-links">
<a href="#/docs/middlewares/endpoint-middleware">Endpoint middleware</a>
<a href="#/docs/middlewares/override-middleware">Override middleware</a>
</div>
