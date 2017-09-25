<header class="symbol-info-header">    <h1 id="status">Status</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Status }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.3.7/src/mvc/decorators/method/status.ts#L0-L0">                mvc/decorators/method/status.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Status</span><span class="token punctuation">(</span>code<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
    description?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    use?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
    collection?<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
</code></pre>

### Description

Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.

```typescript
 @Status(403)
 private myMethod() {}
```
