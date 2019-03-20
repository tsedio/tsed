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

::: warning
Some of you will notice that the `_id` property doesn't appear in the JsonSchema. It's very important to understand that
**TypeScript** only generates metadata on properties with at least one decorator.
In the case of our model, it will always be necessary that there is at least one of the decorators of the list hereafter.
:::

## Decorators

<ApiList query="module == '@tsed/common' && symbolType === 'decorator' && path.indexOf('common/jsonschema') > -1" />

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
