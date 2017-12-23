<header class="symbol-info-header">    <h1 id="maxlength">MaxLength</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MaxLength }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/maxLength.ts#L0-L0">                ajv/decorators/maxLength.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MaxLength</span><span class="token punctuation">(</span>maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.

The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).

!> The value of `maxLength` MUST be a non-negative integer.

## Example

```typescript
class Model {
   @MaxLength(10)
   property: string;
}
```
