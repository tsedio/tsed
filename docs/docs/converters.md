# Converters

The @@ConverterService@@ service is responsible for serializing and deserializing objects.

It has two operation's modes:

- The first case use the [class models](/docs/model.md) to convert an object into a class (and vice versa).
- The second case is based on the JSON object itself to provide an object with the right types. For example the deserialization of dates.


The ConverterService is used by the following decorators:

<ApiList query="['BodyParams', 'Cookies', 'CookiesParams', 'PathParams', 'QueryParams', 'Session'].indexOf(symbolName) > -1" />

## Usage

Models can be used at the controller level.
Here is our model:

```typescript
import  {Property, Minimum, PropertyType} from "@tsed/common";
import  {Description} from "@tsed/swagger";

class Person {
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @Description("Age in years")
    @Minimum(0)
    age: number;
    
    @PropertyType(String)
    skills: Array<string>;
}
```

> Note: @@PropertyType@@ allow to specify the type of a collection.

And its uses on a controller:

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
        return 
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

You can also explicitly tell the Converters service that the field should not be serialized with the decorator `@IgnoreProperty`.

```typescript
import {NotSerialize, Property,IgnoreProperty} from "@tsed/common"

class User {
    @NotSerialize()
    _id: string;
    
    @Property()
    firstName: string;
    
    @Property()
    lastName: string;
    
    @IgnoreProperty()
    password: string;
}
```

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
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   componentsScan: [
       `${rootDir}/converters/**/**.js`
   ]
})
export class Server extends ServerLoader {
   
}       
```

Then you will need to declare your class with the @@Converter@@ annotation:

<<< @/packages/common/src/converters/components/ArrayConverter.ts

::: tip Note
This example will replace the default Ts.ED converter.
:::

It is therefore quite possible to replace all converters with your own classes (especially the Date).

## Validation

The Converter service provides some of the validation of a class model.
It will check the consistency of the JSON object with the data model. For example :

- If the JSON object contains one more field than expected in the model (`validationModelStrict` or `@ModelStrict`).
- If the field is mandatory @@Required@@,
- If the field is mandatory but can be `null` (`@Allow(null)`).

Here is a complete example of a model:

```typescript
import  {Required, PropertyName, Property, PropertyType, Allow} from "@tsed/common";

class EventModel {
    @Required()
    name: string;
     
    @PropertyName('startDate')
    startDate: Date;

    @Property({name: 'end-date'})
    endDate: Date;

    @PropertyType(TaskModel)
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

### validationModelStrict

The `strict` validation of an object can be modified either globally or for a specific model.

Here is an example of `strict` validation:


```typescript
import {InjectorService, ConvertersService, Required, Property} from "@tsed/common";

InjectorService.load();

class TaskModel {
    @Required()
    subject: string;
    
    @Property()
    rate: number;
}

const convertersService = InjectorService.get(ConvertersService);
convertersService.validationModelStrict = true;

convertersService.deserialize({unknowProperty: "test"}, TaskModel); // BadRequest
```

#### Global

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
   validationModelStrict: true | false
})
export class Server extends ServerLoader {
   
}      
```
> By default, the Converters service is configured on the `strict` mode.

#### ModelStrict

```typescript
import {ModelStrict, Required, Property} from "@tsed/common";

@ModelStrict(false)
class TaskModel {
   @Required()
   subject: string;
   
   @Property()
   rate: number;
   [key: string]: any; // recommended
}
````

In this case, the service will not raise more exception:

```typescript
import {InjectorService, ConvertersService} from "@tsed/common";

InjectorService.load();

const convertersService = InjectorService.get(ConvertersService);
convertersService.validationModelStrict = true;

const result = convertersService.deserialize({unknowProperty: "test"}, TaskModel);
console.log(result) // TaskModel {unknowProperty: "test"}
```

::: tip
If you have disabled `strict` validation at the global level, you can use the `@ModelStrict(true)` decorator
to enable validation for a specific model.
:::
