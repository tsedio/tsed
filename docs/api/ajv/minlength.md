<header class="symbol-info-header">    <h1 id="minlength">MinLength</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MinLength }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/minLength.ts#L0-L0">                ajv/decorators/minLength.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MinLength</span><span class="token punctuation">(</span>minLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.

The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).

!> The value of minLength MUST be a non-negative integer.

?> Omitting this keyword has the same behavior as a value of 0.

## Example

```typescript
class Model {
   @MinLength(10)
   property: string;
}
```
