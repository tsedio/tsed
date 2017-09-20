<header class="symbol-info-header">    <h1 id="header">Header</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Header }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.3.4/src/mvc/decorators/header.ts#L0-L0">                mvc/decorators/header.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Header</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token punctuation">{</span>
    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> expressionValue?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> <span class="token keyword">number</span> | TypedPropertyDescriptor<T><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span>
</code></pre>

### Description

Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.

```typescript
 @Header('Content-Type', 'text/plain');
 private myMethod() {}
 @Header({
   'Content-Type': 'text/plain',
   'Content-Length': '123',
   'ETag': '12345'
 })
 private myMethod() {}
```
