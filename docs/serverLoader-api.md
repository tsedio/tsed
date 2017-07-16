[Home](https://github.com/Romakita/ts-express-decorators/wiki) > [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) > API

### new ServerLoader()

Create a new instance of [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader). 

Since v1.4.0 you can use the [@ServerSettings()](https://github.com/Romakita/ts-express-decorators/wiki/Configure-server-with-decorator) decorator to configure your server. Here the configuration with the decorator:

```typescript
// In server.ts
import * as Express from "express";
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
   rootDir: Path.resolve(__dirname),
   port: 8000,
   httpsPort: 8080,
   mount: {
     "/rest": "${rootDir}/controllers/**/*.js"
   }
})
export class Server extends ServerLoader {
    
    $onReady(){
        console.log('Server started...');
    }
    
    $onServerInitError(err){
        console.error(err);
    }
}

// In app.ts
import Server from "./server";
new Server()
   .start()
   .then(() => console.log('started'))
   .catch(er => console.error(er));
```

For other version under v1.4.0, you must configure configure all folders that you want import in your `Server` with [`ServerLoader.scan()`](#serverloaderscanglobpattern-serverloader) method.

Example:
```typescript
import {ServerLoader, Server, IServerLifecycle} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader implements IServerLifecycle {

    constructor() {
        super();

        let appPath = Path.resolve(__dirname);
        
        this.mount('/rest', appPath + "/controllers/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }  

    $onReady(){
        console.log('Server started...');
    }
    
    $onServerInitError(err){
        console.error(err);
    }

    static Initialize = (): Promise<any> => new Server().start();
}
```
> `IServerLifecycle` provide interface to implement quickly the right methods to hook [lifecycle's phase](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks). 

In v1.3.0 or under, [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) patch the [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) to add the method `$tryAuth`. For this reason, online one instance of [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) can be constructed.

***

#### `ServerLoader.createHttpServer(port): ServerLoader`

Create a new HTTP server with the provided `port`.

**Parameters**

Param | Type | Details
---|---|---
port | `string|number` | The HTTP port server.

***

#### `ServerLoader.createHttpsServer(httpsOptions): ServerLoader`

Create a new HTTPs server.

**Parameters**

Param | Type | Details
---|---|---
httpsOptions | `IHTTPSServerOptions` | Options to create new HTTPS server.

`httpsOptions` <IHTTPSServerOptions>:

* `port` &lt;number&gt;: Port number,
* `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
* `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
* `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
* `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.

See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).

***

#### `get ServerLoader.expressApp: Express.Application`

Return the current instance of [Express.Application](http://expressjs.com/fr/4x/api.html#app).

***

#### `get ServerLoader.httpServer: Http.Server`

Return the current instance of [Http.Server](https://nodejs.org/api/http.html#http_class_http_server).

***

#### `get ServerLoader.httpsServer: Https.Server`

Return the current instance of [Https.Server](https://nodejs.org/api/https.html#https_class_https_server).

***
#### `ServerLoader.mount(endpoint, globPattern): ServerLoader`

Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob)) under the `endpoint`. See  [Versioning Rest API](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader-Versioning-Rest-API) for more informations.

**Parameters**

Param | Type | Details
---|---|---
endpoint | `string` | endpoint url.
globPattern | `string` | Glob pattern to list the controllers.

***

#### `ServerLoader.setEndpoint(endpoint): ServerLoader`
**endpoint**: `string`

Configure the default endpoint path for all collected controllers.

**Parameters**

Param | Type | Details
---|---|---
endpoint | `string` | endpoint url.

***

#### `ServerLoader.scan(globPattern): ServerLoader`

Scan and imports all files matching the pattern. See the document on the [Glob pattern](https://www.npmjs.com/package/glob) for more information.

**Parameters**

Param | Type | Details
---|---|---
globPattern | `string` | Glob pattern to list the components (services, controllers, converters or middlewares).

**Example**
```typescript
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {

    constructor() {
        super();

        let appPath = Path.resolve(__dirname);
        
        this.scan(appPath + "/controllers/**/**.js")
            .scan(appPath + "/services/**/**.js")

    }
}
```
Theses pattern scan all files in the directories `controllers`, `services` recursively.

***

#### `ServerLoader.start(): Promise`

Start the express server.