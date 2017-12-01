# Global middleware 

Global middlewares and Endpoint middlewares are almost similar but Global middleware cannot use the [`@EndpointInfo`](api/common/mvc/endpointinfo.md) decorator.
Global middlewares lets you manage request and response on [`ServerLoader`](api/common/server/serverloader.md).

Create your middleware:
```typescript
import {IMiddleware, Middleware, Request, ServerSettingsService} from "ts-express-decorators";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class GlobalAcceptMimesMiddleware implements IMiddleware {
   
   constructor(private serverSettingsService: ServerSettingsService) {

   }

   use(@Request() request) {

        this.serverSettingsService.acceptMimes
            .forEach((mime) => {
                if (!request.accepts(mime)) {
                    throw new NotAcceptable(mime);
                }
            });
   }
}
```

Then, add your middleware in [`ServerLoader`](api/common/server/serverloader.md):

```typescript
@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/middlewares/**/**.js`
   ],
   acceptMimes: ['application/json']  // add your custom configuration here
})
export class Server extends ServerLoader {
   $onMountingMiddlewares() {
       this.use(GlobalAcceptMimeMiddleware);
   }
}       
```

<div class="guide-links">
<a href="#/docs/middlewares/call-sequence">call-sequence</a>
<a href="#/docs/middlewares/global-error-middleware">Global error middleware</a>
</div>

