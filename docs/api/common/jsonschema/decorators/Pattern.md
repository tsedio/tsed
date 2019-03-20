---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Pattern decorator
---
# Pattern <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Pattern }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/pattern.ts#L0-L0">/packages/common/src/jsonschema/decorators/pattern.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Pattern</span><span class="token punctuation">(</span>pattern<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

The pattern and Pattern Properties keywords use regular expressions to express constraints.
The regular expression syntax used is from JavaScript (ECMA 262, specifically). However, that complete syntax is not widely supported, therefore it is recommended that you stick to the subset of that syntax described below.

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

### With primitive type

```typescript
class Model {
   @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
   property: string;
}
```

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
    }
  }
}
```

### With array type

```typescript
class Model {
   @PropertyType(string)
   @Pattern(/^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/)
   property: string[];
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
      }
    }
  }
}
```


:::