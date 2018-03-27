
<header class="symbol-info-header"><h1 id="serverloader">ServerLoader</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ServerLoader }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/server/components/ServerLoader.ts#L0-L0">/common/server/components/ServerLoader.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> ServerLoader <span class="token keyword">implements</span> <a href="#api/common/server/iserverlifecycle"><span class="token">IServerLifecycle</span></a> <span class="token punctuation">{</span>
    version<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">createHttpServer</span><span class="token punctuation">(</span>port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">createHttpsServer</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="#api/common/server/ihttpsserveroptions"><span class="token">IHTTPSServerOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> val<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn<span class="token punctuation">:</span> Function<span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">getSettingsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">;</span>
    <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">startServer</span><span class="token punctuation">(</span>http<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        https<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
        address<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
        port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">void</span>><span class="token punctuation">;</span>
    <span class="token function">scan</span><span class="token punctuation">(</span>patterns<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> endpoint?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">addComponents</span><span class="token punctuation">(</span>classes<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial<<a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a>><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">addControllers</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> controllers<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token function">mount</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> list<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span> | <span class="token punctuation">(</span><span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ServerLoader<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">loadMiddlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">setSettings</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> settings<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsprovider"><span class="token">ServerSettingsProvider</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> expressApp<span class="token punctuation">:</span> Express.Application<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> injectorService<span class="token punctuation">:</span> <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> httpServer<span class="token punctuation">:</span> Http.Server<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> httpsServer<span class="token punctuation">:</span> Https.Server<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">cleanGlobPatterns</span><span class="token punctuation">(</span>files<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> excludes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">version<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">createHttpServer</span><span class="token punctuation">(</span>port<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Create a new HTTP server with the provided `port`.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">createHttpsServer</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="#api/common/server/ihttpsserveroptions"><span class="token">IHTTPSServerOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Param | Type | Description
---|---|---
 options|<code><a href="#api/common/server/ihttpsserveroptions"><span class="token">IHTTPSServerOptions</span></a></code>|Options to create new HTTPS server.





Create a new HTTPs server.

`options` <IHTTPSServerOptions>:

- `port` &lt;number&gt;: Port number,
- `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
- `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
- `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
- `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.

See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">use</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.

```typescript
@ServerSettings({
   rootDir,
   acceptMimes: ['application/json'] // optional
})
export class Server extends ServerLoader {
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
}
```



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>setting<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> val<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Proxy to express set



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">engine</span><span class="token punctuation">(</span>ext<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> fn<span class="token punctuation">:</span> Function<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Proxy to express engine



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">loadSettingsAndInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">getSettingsService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>


Start the express server.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">startServer</span><span class="token punctuation">(</span>http<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> settings<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     https<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
     address<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">;</span>
     port<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">void</span>><span class="token punctuation">;</span></code></pre>
</div>


Create a new server from settings parameters.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">scan</span><span class="token punctuation">(</span>patterns<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> endpoint?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
pattern for more information.

#### Example

```typescript
import {ServerLoader} from "@tsed/common";
import Path = require("path");

export class Server extends ServerLoader {

   constructor() {
       super();

       let appPath = Path.resolve(__dirname);

       this.scan(appPath + "/controllers/**/**.js")
  }
}
```

Theses pattern scan all files in the directories controllers, services recursively.

!> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.

```typescript
const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">addComponents</span><span class="token punctuation">(</span>classes<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial<<a href="#api/common/server/icomponentscanned"><span class="token">IComponentScanned</span></a>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Add classes to the components list



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">addControllers</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> controllers<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Add classes decorated by `@Controller()` to components container.

### Example

```typescript
@Controller('/ctrl')
class MyController{
}

new ServerLoader().addControllers('/rest', [MyController])
```
?> If the MyController class isn't decorated, the class will be ignored.




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">mount</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> list<span class="token punctuation">:</span> <span class="token keyword">any</span> | <span class="token keyword">string</span> | <span class="token punctuation">(</span><span class="token keyword">any</span> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/server/serverloader"><span class="token">ServerLoader</span></a></code></pre>
</div>


Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
under the endpoint. See [Versioning Rest API](docs/server-loader/versioning.md) for more informations.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">loadMiddlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>


Initialize configuration of the express app.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">setSettings</span><span class="token punctuation">(</span>settings<span class="token punctuation">:</span> <a href="#api/common/config/iserversettings"><span class="token">IServerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> settings<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsprovider"><span class="token">ServerSettingsProvider</span></a></code></pre>
</div>


Return the settings configured by the decorator [@ServerSettings](api/common/server/decorators/serversettings.md).

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

@returns {ServerSettingsProvider}



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> expressApp<span class="token punctuation">:</span> Express.Application</code></pre>
</div>


Return Express Application instance.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> injectorService<span class="token punctuation">:</span> <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a></code></pre>
</div>


Return the injectorService initialized by the server.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> httpServer<span class="token punctuation">:</span> Http.Server</code></pre>
</div>


Return Http.Server instance.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> httpsServer<span class="token punctuation">:</span> Https.Server</code></pre>
</div>


Return Https.Server instance.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">cleanGlobPatterns</span><span class="token punctuation">(</span>files<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> excludes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>








