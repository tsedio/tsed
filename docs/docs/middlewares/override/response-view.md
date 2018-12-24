# Override Response view

There is the current implementation of the [ResponseViewMiddleware](/api/common/mvc/components/ResponseViewMiddleware.md):

```typescript
@Middleware()
export class ResponseViewMiddleware implements IMiddleware {

    public use(
           @ResponseData() data: any,
           @EndpointInfo() endpoint: EndpointMetadata,
           @Response() response: Express.Response
    ) {

        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.store.get(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err: any, html) => {

                    /* istanbul ignore next */
                    if (err) {

                        reject(new TemplateRenderingError(
                            endpoint.target,
                            endpoint.methodClassName,
                            err
                        ));

                    } else {
                        resolve(html);
                    }

                });
            } else {
                resolve();
            }
        });

    }
}

```

But for some reason, this implementation isn't enough to meet your needs.

With [@OverrideMiddleware](/api/common/mvc/decorators/class/OverrideMiddleware.md) it's possible to change the default implementation like
this:


```typescript
@OverrideMiddleware(ResponseViewMiddleware)
export class MyResponseViewMiddleware extends ResponseViewMiddleware {
    public use(
           @ResponseData() data: any,
           @EndpointInfo() endpoint: EndpointMetadata,
           @Response() response: Express.Response
    ) {
        
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
import "./src/other/directory/MyResponseViewMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
  
 
}
```
:::

