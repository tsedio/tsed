<header class="symbol-info-header">    <h1 id="allowtypes">AllowTypes</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { AllowTypes }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://github.com/Romakita/ts-express-decorators/blob/v3.3.0/src/jsonschema/decorators/allowTypes.ts#L0-L0">                jsonschema/decorators/allowTypes.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">AllowTypes</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">,</span> ...types<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Set the type of the array items.

```typescript
class Model {
   @AllowTypes("string", "integer", "boolean", "array")
   property: string[];
}
```
