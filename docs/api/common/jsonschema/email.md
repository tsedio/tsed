<header class="symbol-info-header">    <h1 id="email">Email</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Email }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://github.com/Romakita/ts-express-decorators/blob/v3.3.0/src/jsonschema/decorators/email.ts#L0-L0">                jsonschema/decorators/email.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

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
