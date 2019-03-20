---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Format decorator
---
# Format <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Format }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/format.ts#L0-L0">/packages/common/src/jsonschema/decorators/format.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Format</span><span class="token punctuation">(</span>format<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

The following formats are supported for string validation with `format` keyword:

- **date**: full-date according to RFC3339.
- **time**: time with optional time-zone.
- **date-time**: date-time from the same source (time-zone is mandatory). date, time and date-time validate ranges in full mode and only regexp in fast mode (see options).
- **uri**: full uri with optional protocol.
- **url**: URL record.
- **uri-template**: URI template according to RFC6570
- **email**: email address.
- **hostname**: host name according to RFC1034.
- **ipv4**: IP address v4.
- **ipv6**: IP address v6.
- **regex**: tests whether a string is a valid regular expression by passing it to RegExp constructor.
- **uuid**: Universally Unique IDentifier according to RFC4122.
- **json-pointer**: JSON-pointer according to RFC6901.
- **relative-json-pointer**: relative JSON-pointer according to this draft.

## Example
### With primitive type

```typescript
class Model {
   @Format("email")
   property: string;
}
```

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "format": "email"
    }
  }
}
```

### With array type

```typescript
class Model {
   @Format("email")
   @PropertyType(String)
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
         "format": "email"
      }
    }
  }
}
```


:::