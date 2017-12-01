# Configuration

`@ServerSettings` let you to configure quickly your server via decorator. This decorator take your configuration and merge it with the default server configuration.

The default configuration is as follow:
```json
{
  "rootDir": "path/to/root/project",
  "env": "development",
  "port": 8080,
  "debug": false,
  "httpsPort": 8000,
  "uploadDir": "${rootDir}/uploads",
  "mount": {
    "/rest": "${rootDir}/controllers/**/*.ts" // support ts with ts-node then fallback to js
  },
  "componentsScan": [
    "${rootDir}/middlewares/**/*.js",
    "${rootDir}/services/**/*.js",
    "${rootDir}/converters/**/*.js"
  ],
  "routers": {
    "mergeParams": false,
    "strict": false,
    "caseSensitive": false
  }
}
```

You can customize your configuration as follow:

```typescript
// server.ts
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
   rootDir: Path.resolve(__dirname), //optional. By default it's equal to process.cwd()
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": [
        "${rootDir}/controllers/v1/users/*.js", 
        "${rootDir}/controllers/v1/groups/*.ts", // support ts entry
        MyController // support manual import
     ]
   }
})
export class Server extends ServerLoader {

}

// app.ts
import * as Server from "./server";
new Server.start();
```
> Ts.ED support [ts-node](https://github.com/TypeStrong/ts-node). Ts extension will be replaced by a Js extension if 
ts-node isn't the runtime.

## Options

* `rootDir` &lt;string&gt;: The root directory where you build run project. By default, it's equal to `process.cwd().
* `env` &lt;Env&gt;: The environment profile. By default the environment profile is equals to `NODE_ENV`.
* `port` &lt;string | number&gt;: Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
* `httpsPort` &lt;string | number&gt;: Port number for the [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server).
* `httpsOptions` &lt;[Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener))&gt;:
  * `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
  * `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
  * `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
  * `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
* `uploadDir` &lt;string&gt: The temporary directory to upload the documents. See more on [Upload file with Multer](tutorials/upload-files-with-multer.md).
* `mount` &lt;[IServerMountDirectories](api/common/config/iservermountdirectories.md)&gt;: Mount all controllers under a directories to an endpoint.
* `componentsScan` &lt;string[]&gt;: List of directories to scan [Services](docs/services/overview.md), [Middlewares](docs/middlewares/overview.md) or [Converters](docs/converters.md).
* `serveStatic` &lt;[IServerMountDirectories](api/common/config/iservermountdirectories.md)&gt;: Object to mount all directories under to his endpoints. See more on [Serve Static](tutorials/serve-static-files.md).
* `swagger` &lt;Object&gt;: Object configure swagger. See more on [Swagger](tutorials/swagger.md).
* `debug` &lt;boolean&gt;: Enable debug mode. By default debug is false.
* `routers` &lt;object&gt;: Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
* `validationModelStrict` &lt;boolean&gt;: Use a strict validation when a model is used by the converter. When a property is unknow, it throw a BadRequest. By default true.
* `logger`  &lt;[ILoggerSettings](api/common/config/iloggersettings.md)&gt;: Logger configuration.

## Logger
### Default logger

Default logger use by Ts.ED is [ts-log-debug](https://romakita.github.io/ts-log-debug/). 

 - [Configuration](https://romakita.github.io/ts-log-debug#/getting-started?id=installation),
 - [Customize appender (chanel)](https://romakita.github.io/ts-log-debug#/appenders/custom),
 - [Customize layout](https://romakita.github.io/ts-log-debug#/layouts/custom)

### Configuration

Some options is provided:

- `logger.debug` (or `debug`): Enable debug mode. By default debug is false.
- `logger.logRequest`: Log all incoming request. By default is true and print the configured `logger.requestFields`.
- `logger.requestFields`: Fields displayed when a request is logged. Possible values: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`.
- `logger.reqIdBuilder`: A function called for each incoming request to create a request id.

> It's recommended to disable logRequest in production. Logger have a cost on the performance.

### Request logger

For each Express.Request, a logger will be attached and can be used like here:

```typescript
request.log.info({customData: "test"}) // parameter is optional
request.log.debug({customData: "test"})
request.log.warn({customData: "test"})
request.log.error({customData: "test"})
request.log.trace({customData: "test"})
```

A call with once of this method will generate a log according to the `logger.requestFields` configuration:

```bash
[2017-09-01 11:12:46.994] [INFO ] [TSED] - {
  "status": 200,
  "reqId": 1,
  "method": "GET",
  "url": "/api-doc/swagger.json",
  "duration": 92,
  "headers": {
    "host": "0.0.0.0:8001",
    "connection": "keep-alive",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate",
    "accept-language": "fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4"
  },
  "body": {},
  "query": {},
  "customData": "test"
}
```

You can configure this output from configuration:

```typescript
@ServerSettings({
   logger: {
       requestFields: ["reqId", "method", "url", "headers", "body", "query","params", "duration"]
   }
})
export class Server extends ServerLoader {

}
```

or you can override the middleware with `@OverrideMiddleware`.

Example: 

```typescript
@OverrideMiddleware(LogIncomingRequestMiddleware)
export class CustomLogIncomingRequestMiddleware extends LogIncomingRequestMiddleware {
 
    public use(@Req() request: any, @Res() response: any) {
    
        // you can set a custom ID with another lib
        request.id = require('uuid').v4()
        
        return super.use(request, response); // required 
    }
    
    protected requestToObject(request) {
        return {
           reqId: request.id,
           method: request.method,
           url: request.originalUrl || request.url,
           duration: new Date().getTime() - request.tsedReqStart.getTime(),
           headers: request.headers,
           body: request.body,
           query: request.query,
           params: request.params
        }
    }
}
```

### Shutdown logger

Shutdown return a Promise that will be resolved when ts-log-debug has closed all appenders and finished writing log events. 
Use this when your program exits to make sure all your logs are written to files, sockets are closed, etc.

```typescript
import {$log} from "ts-log-debug";

$log
  .shutdown()
  .then(() => {
     console.log("Complete")
  }); 
```

## Disable strict model validation

Since v2.6, [ConverterService](docs/converters.md) check the consistency between the model and the Json object given to the endpoint.

!> When a property is unknown on the model, Ts.Ed throw a BadRequest.

You disable this behavior like here:

```typescript
@ServerSettings({
   validationModelStrict: false
})
export class Server extends ServerLoader {

}
```

## Get configuration

The configuration can be reused throughout your application in different ways. 

- With dependency injection in [Service](docs/services/overview.md), [Controller](docs/controllers.md), [Middleware](docs/middlewares/overview.md), [Filter](docs/filters.md) or [Converter](docs/converters.md).
- With the decorators [@Constant](api/common/config/constant.md) and [@Value](api/common/config/value.md).

### From service (DI)

```typescript
import {ServerSettingsService} from "ts-express-decorators";
@Service() // or Controller or Middleware
export class MyService {
    constructor(ServerSettingsService: ServerSettingsService) {
        
    }
}
```

### From decorators

Decorators [@Constant](api/common/config/constant.md) and [@Value](api/common/config/value.md) can be used in all classes
including: [Service](docs/overview/services.md), [Controller](docs/controllers.md), [Middleware](docs/middlewares/overview.md), [Filter](docs/filters.md) and [Converter](docs/converters.md).

[@Constant](api/common/config/constant.md) and [@Value](api/common/config/value.md) accept an expression as parameters to 
inspect the configuration object and return the value.

```typescript
import {Env} from "ts-express-decorators";

export class MyClass {
    
    @Constant("env")
    env: Env;
    
    @Value("swagger.path")
    swaggerPath: string;
    
}
```

> Constant return an Object.freeze() value. 


<div class="guide-links">
<a href="#/docs/controllers">Controllers</a>
<a href="#/docs/services/overview">Services</a>
</div>