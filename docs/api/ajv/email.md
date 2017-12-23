<header class="symbol-info-header">    <h1 id="email">Email</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Email }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/email.ts#L0-L0">                ajv/decorators/email.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Email</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Apply an email validation on property.

## Example

```typescript
class Model {
   @Email()
   property: string;
}
```
