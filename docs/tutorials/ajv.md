# AJV Validation
> Experimental feature. You can contribute to improve this feature !

This tutorials show you, how you can validation decorators with Ts.ED. Validation feature use [Ajv](https://github.com/epoberezkin/ajv)
 and [json-schema](http://json-schema.org/latest/json-schema-validation.html) to perform the model validation.

## Installation

Before using the validation decorators, we need to install the [ajv](https://www.npmjs.com/package/ajv) module.

```bash
npm install --save ajv
```

Then import `@tsed/ajv` in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module

@ServerSettings({
    rootDir: __dirname
})
export class Server extends ServerLoader {

}
```

The AJV module allows a few settings to be added through the ServerSettings (all are optional):

* *options*, are AJV specific options passed directly to the AJV constructor,
* *errorFormat*, can be used to alter the output produced by the AjvService.

The error message could be changed like:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module

@ServerSettings({
    rootDir: __dirname,
     ajv: {
       errorFormat: (error) => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
       options: {verbose: true}
    },
})
export class Server extends ServerLoader {

}
```

### Decorators

Ts.ED given some decorators to write your validation model:

<ul class="api-list"><li class="api-item" data-symbol="common/jsonschema;AllowTypes;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/allowtypes"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-AllowTypes"title="AllowTypes"><span class="symbol decorator"></span>AllowTypes</a></li><li class="api-item" data-symbol="common/jsonschema;Default;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/default"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Default"title="Default"><span class="symbol decorator"></span>Default</a></li><li class="api-item" data-symbol="common/jsonschema;Email;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/email"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Email"title="Email"><span class="symbol decorator"></span>Email</a></li><li class="api-item" data-symbol="common/jsonschema;Enum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/enum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Enum"title="Enum"><span class="symbol decorator"></span>Enum</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMaximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusivemaximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMaximum"title="ExclusiveMaximum"><span class="symbol decorator"></span>ExclusiveMaximum</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMinimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusiveminimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMinimum"title="ExclusiveMinimum"><span class="symbol decorator"></span>ExclusiveMinimum</a></li><li class="api-item" data-symbol="common/jsonschema;Format;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/format"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Format"title="Format"><span class="symbol decorator"></span>Format</a></li><li class="api-item" data-symbol="common/jsonschema;MaxItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxItems"title="MaxItems"><span class="symbol decorator"></span>MaxItems</a></li><li class="api-item" data-symbol="common/jsonschema;MaxLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxLength"title="MaxLength"><span class="symbol decorator"></span>MaxLength</a></li><li class="api-item" data-symbol="common/jsonschema;MaxProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxProperties"title="MaxProperties"><span class="symbol decorator"></span>MaxProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Maximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Maximum"title="Maximum"><span class="symbol decorator"></span>Maximum</a></li><li class="api-item" data-symbol="common/jsonschema;MinItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinItems"title="MinItems"><span class="symbol decorator"></span>MinItems</a></li><li class="api-item" data-symbol="common/jsonschema;MinLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinLength"title="MinLength"><span class="symbol decorator"></span>MinLength</a></li><li class="api-item" data-symbol="common/jsonschema;MinProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinProperties"title="MinProperties"><span class="symbol decorator"></span>MinProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Minimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Minimum"title="Minimum"><span class="symbol decorator"></span>Minimum</a></li><li class="api-item" data-symbol="common/jsonschema;MultipleOf;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/multipleof"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MultipleOf"title="MultipleOf"><span class="symbol decorator"></span>MultipleOf</a></li><li class="api-item" data-symbol="common/jsonschema;Pattern;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/pattern"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Pattern"title="Pattern"><span class="symbol decorator"></span>Pattern</a></li><li class="api-item" data-symbol="common/jsonschema;Schema;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/schema"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Schema"title="Schema"><span class="symbol decorator"></span>Schema</a></li><li class="api-item" data-symbol="common/jsonschema;Title;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/title"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Title"title="Title"><span class="symbol decorator"></span>Title</a></li><li class="api-item" data-symbol="common/jsonschema;UniqueItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/uniqueitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-UniqueItems"title="UniqueItems"><span class="symbol decorator"></span>UniqueItems</a></li></ul>

## Examples

#### Model validation

A model can used on a method controller along with [@BodyParams](api/common/filters/bodyparams.md) or other decorators, and will
be validated by Ajv.

```typescript
import {Required, MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email} from "@tsed/common";

export class CalendarModel {
    
    @MaxLength(20)
    @MinLength(3)
    @Required()
    title: string;

    @Minimum(0)
    @Maximum(10)
    rating: number;

    @Email()
    email: string;

    @Format("date")  // or date-time, etc...
    createDate: Date;
    
    @Pattern(/hello/)
    customInput: string;
    
    @Enum("value1", "value2")
    customInput: "value1" | "value2";
}
```

> All validation decorators are compatible with the Swagger documentation.

## Validation error

When a validation error occur, AJV generate an errors list with a full description like this:

```json
[
  {
    "keyword": "minLength",
    "dataPath": ".password",
    "schemaPath": "#/properties/password/minLength",
    "params": {"limit": 6},
    "message": "should NOT be shorter than 6 characters",
    "modelName": "User"
  }
]
```

This information can be retrieved in the response headers:

```
 connection: keep-alive
 content-length: 18
 content-type: text/html; charset=utf-8
 date: Wed, 16 May 2018 07:32:23 GMT
 errors: [{"keyword": "minLength","dataPath": ".password", "schemaPath": "#/properties/password/minLength", "params": {"limit": 6}, "message": "should NOT be shorter than 6 characters", "modelName": "User"}]
 etag: W/"12-Bpa0T7/lBA6+IACzRWwBc4S6NUY"
 vary: Accept-Encoding
 x-powered-by: Express
```

<div class="guide-links">
<a href="#/tutorials/swagger">Swagger</a>
<a href="#/tutorials/custom-validator">Custom validator</a>
</div>