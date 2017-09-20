# ServerLoader API
### constructor

Create a new instance of [ServerLoader](api/common/server/serverloader.md). 

```typescript
// In server.ts
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

***

#### ServerLoader.createHttpServer(port): ServerLoader

Create a new HTTP server with the provided `port`.

**Parameters**

Param | Type | Details
---|---|---
port | `string|number` | The HTTP port server.

***

#### ServerLoader.createHttpsServer(httpsOptions): ServerLoader

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

#### get ServerLoader.expressApp: Express.Application

Return the current instance of [Express.Application](http://expressjs.com/fr/4x/api.html#app).

#### ServerLoader.engine(ext: string, fn: Function): ServerLoader

Proxy to the method [Express.Application.engine()](http://expressjs.com/fr/4x/api.html#app)

***

#### get ServerLoader.httpServer: Http.Server

Return the current instance of [Http.Server](https://nodejs.org/api/http.html#http_class_http_server).

***

#### get ServerLoader.httpsServer: Https.Server

Return the current instance of [Https.Server](https://nodejs.org/api/https.html#https_class_https_server).

***

#### get ServerLoader.injectorService: InjectorService

Return the instance of [InjectorService](api/common/core/di/injectorservice.md).

***

#### ServerLoader.mount(endpoint, globPattern): ServerLoader

Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob)) under the `endpoint`. See  [Versioning Rest API](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader-Versioning-Rest-API) for more informations.

**Parameters**

Param | Type | Details
---|---|---
endpoint | `string` | endpoint url.
globPattern | `string` | Glob pattern to list the controllers.

***

#### ServerLoader.set(setting: string, val: any): ServerLoader

Proxy to the method [Express.Application.set()](http://expressjs.com/fr/4x/api.html#app)

***

#### ServerLoader.scan(globPattern): ServerLoader

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

!> On windows on can have an issue with the Glob pattern and the `/`. To solve it, build your path pattern with the module Path.

```typescript
const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
```

***
#### get ServerLoader.settings: ServerSettingsProvider

Return the settings configured by the decorator `@ServerSettings`.

```typescript
@ServerSettings({
   rootDir: Path.resolve(__dirname),
   port: 8000,
   httpsPort: 8080,
   mount: {
     "/rest": "${rootDir}/controllers/**/*.js"
   }
})
export class Server extends ServerLoader {
    
    $onInit(){
        console.log(this.settings); // {rootDir, port, httpsPort,...}
    }
}
```

***

#### ServerLoader.start(): Promise

Start the express server.

***

#### ServerLoader.use(...args): ServerLoader

This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.

```typescript
@ServerSettings({
   rootDir,
   acceptMimes: ['application/json'] // optional
})
export class Server extends ServerLoader {
    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void|Promise<any> {
    
        const methodOverride = require('method-override');

        this.use(GlobalAcceptMimesMiddleware)
            .use(methodOverride());
        
        // similar to 
        this.expressApp.use(methodOverride());
        
        // but not similar to
        this.expressApp.use(GlobalAcceptMimesMiddleware); // in this case, this middleware will not be added correctly to express.

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }
   
    public $onServerInitError(err){
        console.error(err);
    }

}
```
!> Ts.ED middleware decorated with `@Middleware` must added with this `ServerLoader.use()` method.
