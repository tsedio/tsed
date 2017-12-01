# Response view

There is the current implementation of the [ResponseViewMiddleware](api/common/mvc/responseviewmiddleware.md):

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

With [@OverrideMiddleware](api/common/mvc/overridemiddleware.md) it's possible to change the default implementation like
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

And that all!

### Other examples

* [Authentication](docs/middlewares/override/authentication.md)
* [Response view](docs/middlewares/override/response-view.md)
* [Global error handler](docs/middlewares/override/global-error-handler.md)

<div class="guide-links">
<a href="#/docs/converters">Converters</a>
<a href="#/docs/filters">Filters</a>
</div>