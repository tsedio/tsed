<header class="symbol-info-header">    <h1 id="minimum">Minimum</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Minimum }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/minimum.ts#L0-L0">                ajv/decorators/minimum.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Minimum</span><span class="token punctuation">(</span>minimum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> exclusive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The value of `minimum` MUST be a number, representing an inclusive upper limit for a numeric instance.

If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to `minimum`.

## Example

```typescript
class Model {
   @Minimum(10)
   property: number;
}
```
