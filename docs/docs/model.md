# Model

The classes can be used as a model in your application.
Ts.ED use this models to convert JSON objects to theirs class equivalents.

The classes models can be used in the following cases:

- Serialization and deserialisation of data ([Converters](/docs/converters.md)),
- Data validation with [AJV](/tutorials/ajv.md),
- Generating documentation with [Swagger](/tutorials/swagger.md).

To create a model, Ts.ED provides decorators who will store and generate a 
standard [JsonSchema](http://json-schema.org/) model.

## Example

The example below uses decorators to describe a property of the class and store metadata
such as the description of the field.

<<< @/docs/docs/snippets/model/person.ts


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

::: warning
Some of you will notice that the `_id` property doesn't appear in the JsonSchema. It's very important to understand that
**TypeScript** only generates metadata on properties with at least one decorator (see our decorators list).
:::

Our model is now described, we can use it inside a @@Controller@@ as input type parameter for our methods. 
Ts.ED will use the model to convert the raw data to an instance of your model.

<<< @/docs/docs/snippets/model/controller.ts

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

## Decorators

<ApiList query="module == '@tsed/common' && symbolType === 'decorator' && path.indexOf('common/jsonschema') > -1" />
