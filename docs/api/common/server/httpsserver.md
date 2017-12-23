<header class="symbol-info-header">    <h1 id="httpsserver">HttpsServer</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { HttpsServer }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/server/decorators/httpsServer.ts#L0-L0">                server/decorators/httpsServer.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">type HttpsServer = Https.Server & <a href="#api/common/server/ihttpsfactory"><span class="token">IHttpsFactory</span></a><span class="token punctuation">;</span>
function <span class="token function">HttpsServer</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor<Function> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>

### Description

Inject the Https.Server instance.

### Example

```typescript
import {HttpsServer, Service} from "ts-express-decorators";

@Service()
export default class OtherService {
   constructor(@HttpsServer httpServer: HttpServer) {}
}
```

> Note: TypeScript transform and store `ExpressApplication` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
