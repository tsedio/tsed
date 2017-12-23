<header class="symbol-info-header">    <h1 id="acceptmime">AcceptMime</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label private">private</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { AcceptMime }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/lib/mvc/decorators/method/acceptMime"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/decorators/method/acceptMime.ts#L0-L0">                mvc/decorators/method/acceptMime.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">AcceptMime</span><span class="token punctuation">(</span>...mimes<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Set a mime list as acceptable for a request on a specific endpoint.

```typescript
 @ControllerProvider('/mypath')
 provide MyCtrl {

   @Get('/')
   @AcceptMime('application/json')
   public getResource(){}
 }
```
