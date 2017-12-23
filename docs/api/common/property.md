<header class="symbol-info-header">    <h1 id="property">Property</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Property }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/jsonschema"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/jsonschema/decorators/jsonProperty.ts#L0-L0">                jsonschema/decorators/jsonProperty.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Property</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <a href="#api/common/converters/ipropertyoptions"><span class="token">IPropertyOptions</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

`@Property()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
But in some cases, we need to configure explicitly the JSON attribut name mapped to the provide attribut.
Here an example of different use cases with `@JsonProperty()`:

```typescript
class EventModel {

   @Property()
   name: string;

   @Property('startDate')
   startDate: Date;

   @Property({name: 'end-date'})
   endDate: Date;

   @Property({use: Task})
   tasks: TaskModel[];
}

class TaskModel {
    @Property()
    subject: string;

    @Property()
    rate: number;
}

> Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
By default Date, Array, Map and Set have a default custom Converter allready embded. But you can override theses (see next part).

For the Array, you must add the `{use: type}` option to the decorators.
`TypeClass` will be used to deserialize each item in the collection stored on the attribut source.

@returns {Function}
@decorator
@param options
