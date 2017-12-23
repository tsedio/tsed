<header class="symbol-info-header">    <h1 id="maxproperties">MaxProperties</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MaxProperties }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/maxProperties.ts#L0-L0">                ajv/decorators/maxProperties.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MaxProperties</span><span class="token punctuation">(</span>maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.

!> The value of this keyword MUST be a non-negative integer.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MaxProperty(10)
   property: string[];
}
```
