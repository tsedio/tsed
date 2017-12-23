<header class="symbol-info-header">    <h1 id="minitems">MinItems</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MinItems }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/minItems.ts#L0-L0">                ajv/decorators/minItems.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MinItems</span><span class="token punctuation">(</span>minItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.

!> The value `minItems` MUST be a non-negative integer.

?> Omitting this keyword has the same behavior as a value of 0.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MinItems(10)
   property: string[];
}
```
