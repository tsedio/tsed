
<header class="symbol-info-header"><h1 id="format">Format</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label><label class="api-type-label auto-map" title="The data will be stored on the right place according to the type and collectionType (primitive or collection).">auto-map</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Format }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/format.ts#L0-L0">/common/jsonschema/decorators/format.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Format</span><span class="token punctuation">(</span>format<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

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

<!-- Members -->

