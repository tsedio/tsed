
<header class="symbol-info-header"><h1 id="serversettings">ServerSettings</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServerSettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/server/decorators/serverSettings.ts#L0-L0">/common/server/decorators/serverSettings.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">ServerSettings</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

`@ServerSettings` let you to configure quickly your server via decorator. This decorator take your configuration and merge it with the default server configuration.

The default configuration is as follow:
 ```json
 {
   "rootDir": "path/to/root/project",
   "env": "development",
   "port": 8080,
   "httpsPort": 8000,
   "uploadDir": "${rootDir}/uploads",
   "mount": {
     "/rest": "${rootDir}/controllers/**/*.js"
},
"componentsScan": [
    "${rootDir}/middlewares/**/*.js",
    "${rootDir}/services/**/*.js",
    "${rootDir}/converters/**/*.js"
  ]
}
```

You can customize your configuration as follow:
```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    mount: {
        "/rest": "${rootDir}/controllers/current/**/*.js",
        "/rest/v1": [
          "${rootDir}/controllers/v1/users/*.js",
          "${rootDir}/controllers/v1/groups/*.js"
        ]
    }
})
export class Server extends ServerLoader {
    static Initialize = (): Promise<any> => new Server().start();
}

Server.Initialize();
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
* `mount` &lt;[IServerMountDirectories](api/common/server/iservermountdirectories.md)&gt;: Mount all controllers under a directories to an endpoint.
* `componentsScan` &lt;string[]&gt;: List of directories to scan [Services](docs/services/ovierview.md), [Middlewares](docs/middlewares/ovierview.md) or [Converters](docs/converters.md).
* `serveStatic` &lt;[IServerMountDirectories](api/common/server/iservermountdirectories.md)&gt;: Objet to mount all directories under to his endpoints. See more on [Serve Static](tutorials/serve-static-files.md).
* `routers` &lt;object&gt;: Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
* `validationModelStrict` &lt;boolean&gt;: Use a strict validation when a model is used by the converter. When a property is unknow, it throw a BadRequest. By default true.

<!-- Members -->

