# JSON Schema

JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. (See http://json-schema.org/).

Ts.ED use JSON schema to create a meta model. This model is used by:

 - [Converters](documents/converters.md) for serialization/deserialization,
 - [Swagger](tutorials/swagger.md) for the documentation,
 - [AJV](tutorials/ajv.md) for the model validation.


## Example

Here is a basic example of a JSON Schema:

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

## Decorators

The previous example can be produced with the Ts.ED decorators:

```typescript
import  {Property, Minimum} from "ts-express-decorators";
import  {Description} from "ts-express-decorators/swagger";

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

Decorators list:

<ul class="api-list" style="display: block;">
<li class="api-item" data-symbol="common/jsonschema;Any;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/any" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Any" title="Any"><span class="symbol decorator"></span>Any</a></li>
<li class="api-item" data-symbol="common/jsonschema;Default;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/default" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Default" title="Default"><span class="symbol decorator"></span>Default</a></li>
<li class="api-item" data-symbol="common/jsonschema;Email;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/email" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Email" title="Email"><span class="symbol decorator"></span>Email</a></li>
<li class="api-item" data-symbol="common/jsonschema;Enum;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/enum" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Enum" title="Enum"><span class="symbol decorator"></span>Enum</a></li>
<li class="api-item" data-symbol="common/jsonschema;ExclusiveMaximum;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/exclusivemaximum" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMaximum" title="ExclusiveMaximum"><span class="symbol decorator"></span>ExclusiveMaximum</a></li>
<li class="api-item" data-symbol="common/jsonschema;ExclusiveMinimum;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/exclusiveminimum" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMinimum" title="ExclusiveMinimum"><span class="symbol decorator"></span>ExclusiveMinimum</a></li>
<li class="api-item" data-symbol="common/jsonschema;Format;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/format" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Format" title="Format"><span class="symbol decorator"></span>Format</a></li>
<li class="api-item" data-symbol="common/jsonschema;JsonProperty;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/jsonproperty" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-JsonProperty" title="JsonProperty"><span class="symbol decorator"></span>JsonProperty</a></li>
<li class="api-item" data-symbol="common/jsonschema;MaxItems;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/maxitems" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MaxItems" title="MaxItems"><span class="symbol decorator"></span>MaxItems</a></li>
<li class="api-item" data-symbol="common/jsonschema;MaxLength;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/maxlength" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MaxLength" title="MaxLength"><span class="symbol decorator"></span>MaxLength</a></li>
<li class="api-item" data-symbol="common/jsonschema;MaxProperties;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/maxproperties" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MaxProperties" title="MaxProperties"><span class="symbol decorator"></span>MaxProperties</a></li>
<li class="api-item" data-symbol="common/jsonschema;Maximum;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/maximum" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Maximum" title="Maximum"><span class="symbol decorator"></span>Maximum</a></li>
<li class="api-item" data-symbol="common/jsonschema;MinItems;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/minitems" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MinItems" title="MinItems"><span class="symbol decorator"></span>MinItems</a></li>
<li class="api-item" data-symbol="common/jsonschema;MinLength;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/minlength" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MinLength" title="MinLength"><span class="symbol decorator"></span>MinLength</a></li>
<li class="api-item" data-symbol="common/jsonschema;MinProperties;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/minproperties" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MinProperties" title="MinProperties"><span class="symbol decorator"></span>MinProperties</a></li>
<li class="api-item" data-symbol="common/jsonschema;Minimum;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/minimum" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Minimum" title="Minimum"><span class="symbol decorator"></span>Minimum</a></li>
<li class="api-item" data-symbol="common/jsonschema;MultipleOf;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/multipleof" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-MultipleOf" title="MultipleOf"><span class="symbol decorator"></span>MultipleOf</a></li>
<li class="api-item" data-symbol="common/jsonschema;Pattern;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/pattern" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-Pattern" title="Pattern"><span class="symbol decorator"></span>Pattern</a></li>
<li class="api-item" data-symbol="common/jsonschema;UniqueItems;decorator;@;false;false;false;false" style="display: inline-block;"><a href="#/api/common/jsonschema/uniqueitems" class="symbol-container deprecated symbol-type-decorator symbol-name-commonjsonschema-UniqueItems" title="UniqueItems"><span class="symbol decorator"></span>UniqueItems</a></li>
</ul>

## Custom validation

This example show you how you can retrieve the json schema of a model with the [JsonSchemesService](api/common/jsonschema/jsonschemesservice.md) and use this with another library like AJV:

```typescript
import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {BadRequest} from "ts-httpexceptions";
import {OverrideService, JsonSchemesService, ValidationService} from "ts-express-decorators";

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

> This class is already implemented with the [AJV](tutorials/ajv.md) package.

<div class="guide-links">
<a href="#/docs/services/overview">Controllers</a>
<a href="#/docs/converters">Converters</a>
</div>