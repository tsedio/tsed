# AWS

Amazon Web Services is one a the service to hosting your Node.js application.

This tutorial show you how we can configure the Express application written with Ts.ED.

#### Installation

Before starting, install the `aws-serverless-express` module.

```bash
npm install --save aws-serverless-express
```

#### Configuration

You need to create three files:

 - One for the serverLoader configuration,
 - One for aws, named lambda.ts (or .js),
 - One for the development, named local.ts (or other name).
 
```typescript
// server.js
import {ServerSettings, ServerLoader} from "ts-express-decorators";

@ServerSettings({ 
   port: 3000,
   rootDir: __dirname
})
export class Server extends ServerLoader {

  $onMountingMiddlewares() {
      
      const cookieParser = require('cookie-parser'),
                  bodyParser = require('body-parser'),
                  compress = require('compression'),
                  methodOverride = require('method-override'),
                  cors = require('cors'),
                  compression = require('compression'),
                  awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

              this
                  .use(compression())
                  .use(cors())
                  .use(cookieParser())
                  .use(compress({}))
                  .use(methodOverride())
                  .use(bodyParser.json())
                  .use(bodyParser.urlencoded({
                      extended: true
                  }));
              
      this.use(awsServerlessExpressMiddleware.eventContext())
  }
}
```

```typescript
// lambda.js
import {Server} from "./server.js";
const awsServerlessExpress = require("aws-serverless-express");

const server = new Server();
server.settings.httpPort = false;
server.settings.httpsPort = false;

const lambdaServer = awsServerlessExpress.createServer(server.expressApp);

server.start();

export const handler = (event, context, callback) => awsServerlessExpress.proxy(lambdaServer, event, context);
```

```typescript
// local.js
import {Server} from "./server.js";

new Server().start();
```
> You can see an pure example provided by AWS Team on this [github repository](https://github.com/awslabs/aws-serverless-express/tree/master/example).re


> Credits : Thanks to [vetras](https://github.com/vetras) for his contribution.

