# Server configuration

`@ServerSettings` let you to configure quickly your server via decorator. This decorator take your configuration and merge it with the default server configuration.

The default configuration is as follow:
```json
{
  "rootDir": "path/to/root/project",
  "env": "development",
  "port": 8080,
  "debug": false,
  "httpsPort": 8000,
  "endpointUrl": "/rest",
  "uploadDir": "${rootDir}/uploads",
  "mount": {
    "/rest": "${rootDir}/controllers/**/*.js"
  },
  "componentsScan": [
    "${rootDir}/middlewares/**/*.js",
    "${rootDir}/services/**/*.js",
    "${rootDir}/converters/**/*.js"
  ],
  routers: {
    mergeParams: false,
    strict: false,
    caseSensitive: false
  }
}
```

You can customize your configuration as follow:
```typescript
// server.ts
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
   rootDir: Path.resolve(__dirname),
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": "${rootDir}/controllers/v1/**/*.js"
   }
})
export class Server extends ServerLoader {

}

// app.ts
import * as Server from "./server";
new Server.start();
```
### Options

* `rootDir` &lt;string&gt;: The root directory where you build run project.
* `env` &lt;Env&gt;: The environment profile. By default the environment profile is equals to `NODE_ENV`.
* `port` &lt;string | number&gt;: Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
* `httpsPort` &lt;string | number&gt;: Port number for the [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server).
* `httpsOptions` &lt;[Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener))&gt;:
  * `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
  * `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
  * `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
  * `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
* `uploadDir` &lt;string&gt: The temporary directory to upload the documents. See more on [Upload file with Multer](tutorials/upload-files-with-multer.md).
* `mount` &lt;IServerMountDirectories&gt;: Mount all controllers under a directories to an endpoint.
* `componentsScan` &lt;string[]&gt;: List of directories to scan [Services](docs/services/overview.md), [Middlewares](docs/middlewares/overview.md) or [Converters](docs/converters.md).
* `serveStatic` &lt;IServerMountDirectories&gt;: Object to mount all directories under to his endpoints. See more on [Serve Static](tutorials/serve-static-files.md).
* `swagger` &lt;Object&gt;: Object configure swagger. See more on [Swagger](tutorials/swagger.md).
* `debug` &lt;boolean&gt;: Enable debug mode. By default debug is false.
* `routers` &lt;object&gt;: Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).

