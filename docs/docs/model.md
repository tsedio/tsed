# Model

The classes can be used as a model in your application.
Ts.ED use this models to convert JSON objects to theirs class equivalents.

The classes models can be used in the following cases:

- Serialization and deserialisation of data ([Converters](documents/converters.md)),
- Data validation with [AJV](tutorials/ajv.md),
- Generating documentation with [Swagger](tutorials/swagger.md).

To create a model, Ts.ED provides decorators who will store and generate a 
standard [JsonSchema](http://json-schema.org/) model.

## Example

The example below uses decorators to describe a property of the class and store metadata
such as the description of the field.

```typescript
import  {Property, Minimum} from "@tsed/common";
import  {Description} from "@tsed/swagger";

class Person {
    
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @Description("Age in years")
    @Minimum(0)
    age: number;
}
```

The previous example will generate the following JsonSchema:

```json
{
    "title": "Person",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "age": {
            "description": "Age in years",
            "type": "number",
            "minimum": 0
        }
    },
    "required": ["firstName", "lastName"]
}
```

> This JsonSchema can be used by all modules supporting the JsonSchema spec.

!> Some of you will notice that the `_id` property doesn't appear in the JsonSchema. It's very important to understand that
**TypeScript** only generates metadata on properties with at least one decorator.
In the case of our model, it will always be necessary that there is at least one of the decorators of the list hereafter.

## Decorators

<ul class="api-list"><li class="api-item" data-symbol="common/jsonschema;AllowTypes;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/allowtypes"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-AllowTypes"title="AllowTypes"><span class="symbol decorator"></span>AllowTypes</a></li><li class="api-item" data-symbol="common/jsonschema;Any;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/any"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Any"title="Any"><span class="symbol decorator"></span>Any</a></li><li class="api-item" data-symbol="common/jsonschema;Default;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/default"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Default"title="Default"><span class="symbol decorator"></span>Default</a></li><li class="api-item" data-symbol="common/jsonschema;Email;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/email"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Email"title="Email"><span class="symbol decorator"></span>Email</a></li><li class="api-item" data-symbol="common/jsonschema;Enum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/enum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Enum"title="Enum"><span class="symbol decorator"></span>Enum</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMaximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusivemaximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMaximum"title="ExclusiveMaximum"><span class="symbol decorator"></span>ExclusiveMaximum</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMinimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusiveminimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMinimum"title="ExclusiveMinimum"><span class="symbol decorator"></span>ExclusiveMinimum</a></li><li class="api-item" data-symbol="common/jsonschema;Format;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/format"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Format"title="Format"><span class="symbol decorator"></span>Format</a></li><li class="api-item" data-symbol="common/jsonschema;IgnoreProperty;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/ignoreproperty"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-IgnoreProperty"title="IgnoreProperty"><span class="symbol decorator"></span>IgnoreProperty</a></li><li class="api-item" data-symbol="common/jsonschema;JsonProperty;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/jsonproperty"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-JsonProperty"title="JsonProperty"><span class="symbol decorator"></span>JsonProperty</a></li><li class="api-item" data-symbol="common/jsonschema;MaxItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxItems"title="MaxItems"><span class="symbol decorator"></span>MaxItems</a></li><li class="api-item" data-symbol="common/jsonschema;MaxLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxLength"title="MaxLength"><span class="symbol decorator"></span>MaxLength</a></li><li class="api-item" data-symbol="common/jsonschema;MaxProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxProperties"title="MaxProperties"><span class="symbol decorator"></span>MaxProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Maximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Maximum"title="Maximum"><span class="symbol decorator"></span>Maximum</a></li><li class="api-item" data-symbol="common/jsonschema;MinItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinItems"title="MinItems"><span class="symbol decorator"></span>MinItems</a></li><li class="api-item" data-symbol="common/jsonschema;MinLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinLength"title="MinLength"><span class="symbol decorator"></span>MinLength</a></li><li class="api-item" data-symbol="common/jsonschema;MinProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinProperties"title="MinProperties"><span class="symbol decorator"></span>MinProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Minimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Minimum"title="Minimum"><span class="symbol decorator"></span>Minimum</a></li><li class="api-item" data-symbol="common/jsonschema;MultipleOf;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/multipleof"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MultipleOf"title="MultipleOf"><span class="symbol decorator"></span>MultipleOf</a></li><li class="api-item" data-symbol="common/jsonschema;Pattern;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/pattern"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Pattern"title="Pattern"><span class="symbol decorator"></span>Pattern</a></li><li class="api-item" data-symbol="common/jsonschema;Property;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/property"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Property"title="Property"><span class="symbol decorator"></span>Property</a></li><li class="api-item" data-symbol="common/jsonschema;PropertyName;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/propertyname"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-PropertyName"title="PropertyName"><span class="symbol decorator"></span>PropertyName</a></li><li class="api-item" data-symbol="common/jsonschema;PropertyType;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/propertytype"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-PropertyType"title="PropertyType"><span class="symbol decorator"></span>PropertyType</a></li><li class="api-item" data-symbol="common/jsonschema;Schema;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/schema"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Schema"title="Schema"><span class="symbol decorator"></span>Schema</a></li><li class="api-item" data-symbol="common/jsonschema;Title;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/title"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Title"title="Title"><span class="symbol decorator"></span>Title</a></li><li class="api-item" data-symbol="common/jsonschema;UniqueItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/uniqueitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-UniqueItems"title="UniqueItems"><span class="symbol decorator"></span>UniqueItems</a></li></ul>

## Usage

Models can be uses with the Controllers.

Here our model:

```typescript
import  {Property, Minimum} from "@tsed/common";
import  {Description} from "@tsed/swagger";

class Person {
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @Description("Age in years")
    @Minimum(0)
    age: number;
}
```

And its use in a controller:

```typescript
import {Post, Controller, BodyParams} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

     @Post("/")
     save(@BodyParams() person: Person): Person {
          console.log(person instanceof Person); // true
          return person; // will be serialized according to your annotation on Person class.
     } 

     //OR
     @Post("/")
     save(@BodyParams('person') person: Person): Person {
          console.log(person instanceof Person); // true
          return person; // will be serialized according to your annotation on Person class.
     }
}
```
> In this example, Person model is used both as input and output types.

## JsonSchema

In some cases, it may be useful to retrieve the JSON Schema from a Model for use with another library.

Here is an example of use with the AJV library:

```typescript
import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {BadRequest} from "ts-httpexceptions";
import {OverrideService, JsonSchemesService, ValidationService} from "@tsed/common";

@OverrideService(ValidationService)
export class AjvService extends ValidationService {
    constructor(private jsonSchemaService: JsonSchemesService) {
        super();
    }

    public validate(obj: any, targetType: any, baseType?: any): void {
        const schema = this.jsonSchemaService.getSchemaDefinition(targetType);

        if (schema) {
            const ajv = new Ajv();
            const valid = ajv.validate(schema, obj);

            if (!valid) {
                throw(this.buildErrors(ajv.errors!));
            }
        }
    }

    private buildErrors(errors: ErrorObject[]) {

        const message = errors.map(error => {
            return `{{name}}${error.dataPath} ${error.message} (${error.keyword})`;
        }).join("\n");

        return new BadRequest(message);
    }
}
```


<div class="guide-links">
<a href="#/docs/services/overview">Controllers</a>
<a href="#/docs/converters">Converters</a>
</div>