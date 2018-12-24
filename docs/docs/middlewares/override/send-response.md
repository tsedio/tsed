# Override Send response

There is the current implementation of the [SendResponseMiddleware](/api/common/mvc/components/SendResponseMiddleware.md):

```typescript
import * as Express from "express";
import {ConverterService} from "../../converters/services/ConverterService";
import {Response} from "../../filters/decorators/response";
import {ResponseData} from "../../filters/decorators/responseData";

import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";
import {EndpointInfo, EndpointMetadata} from "@tsed/common";

@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  constructor(protected converterService: ConverterService) {
  }

  public use(@ResponseData() data: any, @Response() response: Express.Response, @EndpointInfo() endpoint: EndpointMetadata) {
    const type = typeof data;

    if (endpoint.statusCode === 204) {
      response.send();

      return;
    }

    if (data === undefined) {
      return;
    }

    if (data === null || ["number", "boolean", "string"].indexOf(type) > -1) {
      response.send(data && String(data));

      return;
    }

    response.json(this.converterService.serialize(data));
  }
}
```

But for some reason, this implementation isn't enough to meet your needs.

With [@OverrideMiddleware](/api/common/mvc/decorators/class/OverrideMiddleware.md) it's possible to change the default implementation like
this:


```typescript
@OverrideMiddleware(SendResponseMiddleware)
export class MySendResponseMiddleware extends SendResponseMiddleware {
 
    constructor(protected converterService: ConverterService) {
        super(converterService)
    }
    
    public use(@ResponseData() data: any, @Response() response: Express.Response) {
    
        // ... your instruction
    
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
import "./src/other/directory/MySendResponseMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
  
 
}
```
:::
