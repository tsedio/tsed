
<header class="symbol-info-header"><h1 id="httpsserver">HttpsServer</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HttpsServer }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/server/decorators/httpsServer.ts#L0-L0">/common/server/decorators/httpsServer.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">type HttpsServer = Https.Server & <a href="#api/common/server/ihttpsfactory"><span class="token">IHttpsFactory</span></a><span class="token punctuation">;</span>
function <span class="token function">HttpsServer</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor<Function> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Inject the Https.Server instance.

### Example

```typescript
import {HttpsServer, Service} from "@tsed/common";

@Service()
export default class OtherService {
   constructor(@HttpsServer httpServer: HttpServer) {}
}
```

> Note: TypeScript transform and store `HttpsServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.

<!-- Members -->

