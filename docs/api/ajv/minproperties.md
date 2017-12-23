<header class="symbol-info-header">    <h1 id="minproperties">MinProperties</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MinProperties }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/minProperties.ts#L0-L0">                ajv/decorators/minProperties.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MinProperties</span><span class="token punctuation">(</span>minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

An object instance is valid against `minProperties` if its number of properties is greater than, or equal to, the value of this keyword.

!> The value of this keyword MUST be a non-negative integer.

?> Omitting this keyword has the same behavior as a value of 0.

```typescript
class Model {
   @PropertyType(String)
   @MinProperty(10)
   property: string[];
}
```
