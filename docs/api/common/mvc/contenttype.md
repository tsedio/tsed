<header class="symbol-info-header">    <h1 id="contenttype">ContentType</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ContentType }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/decorators/method/contentType.ts#L0-L0">                mvc/decorators/method/contentType.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">ContentType</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
If type contains the “/” character, then it sets the `Content-Type` to type.

```typescript
 @ContentType('.html');              // => 'text/html'
 @ContentType('html');               // => 'text/html'
 @ContentType('json');               // => 'application/json'
 @ContentType('application/json');   // => 'application/json'
 @ContentType('png');                // => image/png
 private myMethod() {}
```
