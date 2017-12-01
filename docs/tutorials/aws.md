# AWS

Amazon Web Services is one possible way host your Node.js application.

This tutorial show you how to configure the Express application written with Ts.ED, to be executed as aAWS Lambda Function.

More information here: [Official AWS Docs](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html)

#### Installation

First, install the `aws-serverless-express` module:

```bash
npm install --save aws-serverless-express
```

#### Configuration

You need to create three files:

 - One for the `ServerLoader` configuration
 - One for aws, named lambda.js (the entry point on AWS Lambda, that contains the function handler)
 - One for the local development, for example "local.js" (that you can use to run the app locally with `node local.js`)
 
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
// optional: Ts.ED creates two servers that listen for HTTP and HTTPS requests respectively.
// You can enable/disable each one independently with these flags
server.settings.httpPort = false;
server.settings.httpsPort = false;

const lambdaServer = awsServerlessExpress.createServer(server.expressApp);

server.start();

// The function handler to setup on AWS Lambda console -- the name of this function must match the one configured on AWS
export const handler = (event, context, callback) => awsServerlessExpress.proxy(lambdaServer, event, context);
```

```typescript
// local.js
import {Server} from "./server.js";

new Server().start();
```
> You can see an example provided by the AWS Team on this: [github repository](https://github.com/awslabs/aws-serverless-express/tree/master/example).


> Credits : Thanks to [vetras](https://github.com/vetras) for his contribution.

<div class="guide-links">
<a href="#/tutorials/throw-http-exceptions">Throw HTTP exceptions</a>
<a href="#/tutorials/passport">Passport.js</a>
</div>