<header class="symbol-info-header">    <h1 id="jsonproperty">JsonProperty</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { JsonProperty }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.3.8/src/converters/decorators/jsonProperty.ts#L0-L0">                converters/decorators/jsonProperty.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><a href="#api/common/mvc/"><span class="token"></span></a>function<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>JsonProperty<a href="#api/common/mvc/"><span class="token"></span></a><<a href="#api/common/mvc/"><span class="token"></span></a>T<a href="#api/common/mvc/"><span class="token"></span></a>><<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>punctuation<a href="#api/common/mvc/"><span class="token"></span></a>">(</<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>><a href="#api/common/mvc/"><span class="token"></span></a>options<a href="#api/common/mvc/"><span class="token"></span></a>?<<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>punctuation<a href="#api/common/mvc/"><span class="token"></span></a>">:</<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>> <a href="#api/common/converters/ipropertyoptions"><span class="token">IPropertyOptions</span></a><a href="#api/common/mvc/"><span class="token"></span></a> | <<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>keyword<a href="#api/common/mvc/"><span class="token"></span></a>"><a href="#api/common/mvc/"><span class="token"></span></a>string<a href="#api/common/mvc/"><span class="token"></span></a></<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>><<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>punctuation<a href="#api/common/mvc/"><span class="token"></span></a>">)</<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>><<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>punctuation<a href="#api/common/mvc/"><span class="token"></span></a>">:</<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>> <a href="#api/common/mvc/"><span class="token"></span></a>Function<a href="#api/common/mvc/"><span class="token"></span></a><<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>class<a href="#api/common/mvc/"><span class="token"></span></a>="<a href="#api/common/mvc/"><span class="token"></span></a>token<a href="#api/common/mvc/"><span class="token"></span></a> <a href="#api/common/mvc/"><span class="token"></span></a>punctuation<a href="#api/common/mvc/"><span class="token"></span></a>">;</<a href="#api/common/mvc/"><span class="token"></span></a>span<a href="#api/common/mvc/"><span class="token"></span></a>></code></pre>

### Description

`@JsonProperty()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
But in some cases, we need to configure explicitly the JSON attribut name mapped to the provide attribut.
Here an example of different use cases with `@JsonProperty()`:

```typescript
provide EventModel {

   \@JsonProperty()
   name: string;

   \@JsonProperty('startDate')
   startDate: Date;

   \@JsonProperty({name: 'end-date'})
   endDate: Date;

   \@JsonProperty({use: Task})
   tasks: TaskModel[];
}

provide TaskModel {
    subject: string;
    rate: number;
}

> Theses ES6 collections can be used : Map and Set. Map will be serialized as an object and Set as an array.
By default Date, Array, Map and Set have a default custom Converter allready embded. But you can override theses (see next part).

For the Array, you must add the `{use: type}` option to the decorators.
`TypeClass` will be used to deserialize each item in the collection stored on the attribut source.

@returns {Function}
@decorator
@param options
