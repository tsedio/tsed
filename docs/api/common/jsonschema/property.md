
<header class="symbol-info-header"><h1 id="property">Property</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Property }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/jsonProperty.ts#L0-L0">/common/jsonschema/decorators/jsonProperty.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Property</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <a href="#api/common/converters/ipropertyoptions"><span class="token">IPropertyOptions</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

`@Property()` let you decorate an attribute that can be serialized or deserialized. By default, no parameters are required to use it.
But in some cases, we need to configure explicitly the JSON attribute name mapped to the provide attribute.

Here an example of different use cases with `@Property()`:

```typescript
class EventModel {

   @Property()
   name: string;

   @Property()
   @Format('date-time')
   startDate: Date;

   @Property({name: 'end-date'})
   @Format('date-time')
   endDate: Date;

   @PropertyType(Task) // eq. @Property({use: Task})
   tasks: TaskModel[];
}

class TaskModel {
    @Property()
    subject: string;

    @Minimum(0)  // Property or JsonProperty is not required when a JsonSchema decorator is used
    @Maximum(100)
    rate: number;
}

> Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
By default Date, Array, Map and Set have a default custom Converter already embed. But you can override theses (see next part).

For the Array, you must use the `@PropertyType` decorator.
`TypeClass` will be used to deserialize each item in the collection stored on the attribute source.

According to the previous example, the JsonSchema generated will be as follow:

```typescript
{
   "type": "object",
   "properties": {
      "name": {
         "type": "string"
      },
      "startDate": {
         "type": "string",
         "format": "date-time"
      },
      "endDate": {
         "type": "string",
         "format": "date-time"
      },
      "tasks": {
         "type": "array",
         "items": {
            "$ref": "#/definitions/Task"
         }
      }
   },
   "definitions": {
     "Task": {
       "type": "object",
       "properties": {
         "subject": {
            "type": "string",
         },
         "rate": {
            "type": "number"
            "minimum": 0,
            "maximum: 100
         }
       }
     }
   }
}
```

@returns {Function}
@decorator
@param options

<!-- Members -->

