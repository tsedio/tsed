# Converters

The @@ConverterService@@ service is responsible for serializing and deserializing objects.

It has two operation's modes:

- The first case uses the [class models](/docs/model.md) to convert an object into a class (and vice versa).
- The second case is based on the JSON object itself to provide an object with the right types. For example the deserialization of dates.


The ConverterService is used by the following decorators:

<ApiList query="['BodyParams', 'Cookies', 'CookiesParams', 'PathParams', 'QueryParams', 'Session'].indexOf(symbolName) > -1" />

## Usage

Models can be used at the controller level.
Here is our model:

<<< @/docs/docs/snippets/converters/model-usage.ts

::: tip
@@CollectionOf@@ allows to specify the type of a collection.
:::

And its use on a controller:

<<< @/docs/docs/snippets/converters/controller-usage.ts

In this example, Person model is used both as input and output types.

::: tip
Because in most cases we use asynchronous calls (with async or promise), we have to use @@Returns@@ or @@ReturnsArray@@ decorators to 
tell swagger what is the model returned by your endpoint. If you don't use swagger, you can also use @@ReturnType@@ decorator instead to 
force converter serialization.

<<< @/docs/docs/snippets/converters/controller-usage-with-return-type.ts

:::

## Serialisation

When you use a class model as a return parameter, the Converters service will use the JSON Schema
of the class to serialize the JSON object.

Here is an example of a model whose fields are not voluntarily annotated:

```typescript
import {Property} from "tsed/common";

class User {
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    password: string;
}
```

And our controller:

```typescript
import {Get, Controller} from "@tsed/common";
import {User} from "../models/User";

@Controller("/")
export class UsersCtrl {

    @Get("/")
    get(): User {
        const user = new User();
        user._id = "12345";
        user.firstName = "John";
        user.lastName = "Doe";
        user.password = "secretpassword";
        return user
    }
}
```

Our serialized `User` object will be:

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```
> Non-annotated fields will not be copied into the final object.

You can also explicitly tell the Converters service that the field should not be serialized with the decorator @@Ignore@@.

<<< @/docs/docs/snippets/converters/model-ignore-props.ts

## Type converters

The Converters service relies on a subservice set to convert the following types:

- Basics: [String, Number et Boolean](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/PrimitiveConverter.ts),
- Objects: [Date](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/DateConverter.ts) et [Symbol](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/SymbolConverter.ts),
- Collections: [Array](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/ArrayConverter.ts), [Map](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/MapConverter.ts) et [Set](https://github.com/TypedProject/ts-express-decorators/blob/master/packages/common/src/converters/components/SetConverter.ts).

> Set and Map types will be converted into an JSON object (instead of Array).


Any of theses converters can be overrided with @@OverrideProvider@@ decorators:

<ApiList query="symbolType === 'class' && status.indexOf('converters') > -1" />

### Example

Here an example of a type converter:

<<< @/packages/common/src/converters/components/PrimitiveConverter.ts

### Create a custom converter

Ts.ED creates its own converter in the same way as the previous example.

To begin, you must add to your configuration the directory where are stored
your classes dedicated to converting types.

 
```typescript
import {Configuration} from "@tsed/common";
import {resolve} from "path";
const rootDir = resolve(__dirname);

@Configuration({
   componentsScan: [
       `${rootDir}/converters/**/**.js`
   ]
})
export class Server {
   
}       
```

Then you will need to declare your class with the @@Converter@@ annotation:

<<< @/packages/common/src/converters/components/ArrayConverter.ts

::: tip Note
This example will replace the default Ts.ED converter.
:::

It is therefore quite possible to replace all converters with your own classes (especially the Date).

## Validation

The Converters service provides some validation of a class model.
It will check the consistency of the JSON object with the data model. For example :

- If the JSON object contains one more field than expected in the model (`validationModelStrict` or @@AdditionalProperties@@).
- If the field is mandatory @@Required@@,
- If the field is mandatory but can be `null` (`@Allow(null)`).

Here is a complete example of a model:

```typescript
import  {Required, Name, Property, CollectionOf, Allow} from "@tsed/common";

class EventModel {
    @Required()
    name: string;
     
    @Name('startDate')
    startDate: Date;

    @Name('end-date')
    endDate: Date;

    @CollectionOf(TaskModel)
    @Required()
    @Allow(null)
    tasks: TaskModel[];
}

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}
```

### Additional properties Policy

<<< @/docs/docs/snippets/converters/server-usage.ts

`additionalProperties` define the policy to adopt if the JSON object contains one more field than expected in the model.

You are able to change the @@ConverterService@@ behavior about any additional properties when it try to deserialize a Plain JavaScript Object
to a Ts.ED Model.

#### Emit error

By setting `error` on `converter.additionalProperties`, the deserializer will throw an @@UnknownPropertyError@@.

If the model is the following:

```typescript
import {Property} from "@tsed/common";

export class Person {
  @Property()
  firstName: string;
}
```

Sending this object will throw an error:

```json
{
  "firstName": "John",
  "unknownProp": "Doe"
}
```

::: tip Note
The legacy `validationModelStrict: true` has the same behavior has  `converter.additionalProperties: true`.
:::

#### Merge additional property

By setting `accept` on `converter.additionalProperties`, the deserializer will merge Plain Object JavaScript
with the given Model.

Here is the model:

<<< @/docs/docs/snippets/converters/additional-property-accept-model-usage.ts

And his controller:

<<< @/docs/docs/snippets/converters/additional-property-accept-controller-usage.ts

So sending this object won't throw an error:

```json
{
  "firstName": "John",
  "unknownProp": "Doe"
}
```

::: tip Note
The legacy `validationModelStrict: true` has the same behavior has  `converter.additionalProperties: true`.
:::

#### Ignore additional property

By setting `ignore` on `converter.additionalProperties`, the deserializer will ignore additional properties
when a Model is used on a Controller.

```typescript
import {Property} from "@tsed/common";

export class Person {
  @Property()
  firstName: string;
}
```

<<< @/docs/docs/snippets/converters/additional-property-ignore-controller-usage.ts

#### AdditionalProperties decorator 
<Badge text="v5.55.0+" /> 

It also possible to change the @@ConverterService@@ behavior by using the @@AdditionalProperties@@ decorator directly on a model.

This example will accept additional properties regardless of the value configured on `converter.additionalProperties`:

```typescript
import {Property, AdditionalProperties} from "@tsed/common"; 

@AdditionalProperties(true) // is equivalent to converter.additionalProperties: 'accept'
export class Person {
  @Property()
  firstName: string;
 
  [key: string]: any;
}
```

Also with falsy value, the converter will emit an error:
```typescript
import {Property, AdditionalProperties} from "@tsed/common"; 

@AdditionalProperties(false) // is equivalent to converter.additionalProperty: 'error'
export class Person {
  @Property()
  firstName: string;
 
  [key: string]: any;
}
```

