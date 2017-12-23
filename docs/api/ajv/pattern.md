<header class="symbol-info-header">    <h1 id="pattern">Pattern</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Pattern }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/pattern.ts#L0-L0">                ajv/decorators/pattern.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Pattern</span><span class="token punctuation">(</span>pattern<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The pattern and Pattern Properties keywords use regular expressions to express constraints. The regular expression syntax used is from JavaScript (ECMA 262, specifically). However, that complete syntax is not widely supported, therefore it is recommended that you stick to the subset of that syntax described below.

A single unicode character (other than the special characters below) matches itself.

* `^`: Matches only at the beginning of the string.
* `$`: Matches only at the end of the string.
* `(...)`: Group a series of regular expressions into a single regular expression.
* `|`: Matches either the regular expression preceding or following the | symbol.
* `[abc]`: Matches any of the characters inside the square brackets.
* `[a-z]`: Matches the range of characters.
* `[^abc]`: Matches any character not listed.
* `[^a-z]`: Matches any character outside of the range.
* `+`: Matches one or more repetitions of the preceding regular expression.
* `*`: Matches zero or more repetitions of the preceding regular expression.
* `?`: Matches zero or one repetitions of the preceding regular expression.
* `+?`, *?`, ??`: The `*`, `+`, and `?` qualifiers are all greedy; they match as much text as possible. Sometimes this behavior isn’t desired and you want to match as few characters as possible.
* `{x}`: Match exactly x occurrences of the preceding regular expression.
* `{x,y}`: Match at least x and at most y occurrences of the preceding regular expression.
* `{x,}`: Match x occurrences or more of the preceding regular expression.
* `{x}?`, {x,y}?, {x,}?`: Lazy versions of the above expressions.

## Example

```typescript
class Model {
   @Pattern("^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$")
   @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
   property: string;
}
```
