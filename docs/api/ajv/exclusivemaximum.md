<header class="symbol-info-header">    <h1 id="exclusivemaximum">ExclusiveMaximum</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ExclusiveMaximum }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/exclusiveMaximum.ts#L0-L0">                ajv/decorators/exclusiveMaximum.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">ExclusiveMaximum</span><span class="token punctuation">(</span>maximum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> exclusiveMaximum?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The value of `exclusiveMaximum` MUST be number, representing an exclusive upper limit for a numeric instance.

If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) `exclusiveMaximum`.

## Example

```typescript
class Model {
   @ExclusiveMaximum(10)
   property: number;
}
```
