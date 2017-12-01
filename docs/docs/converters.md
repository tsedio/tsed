# Converters

The decorator `@JsonProperty` or `@Property` lets you customize serialization and deserialization property when Ts.ED send or receive data as JSON.

All following decorators use `@Property` metadata to deserialize a Plain Object JavaScript to his Model:

- `@PathParams(expression?: string)`, 
- `@BodyParams(expression?: string)`, 
- `@CookiesParams(expression?: string)`, 
- `@QueryParams(expression?: string)`,
- `@Session(expression?: string)`.

## Installation

In first place, you must adding the `converters` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/converters/**/**.js`
   ]
})
export class Server extends ServerLoader {
   
}       
```

In second place, create a new file in your `converters` folder. Create a new class and add the `@Converter()` annotation on your class.

## Define a model

`@JsonProperty()` lets you decorate an attribute. By default, no parameters are required to use it. But in some cases, we need to configure explicitly the JSON attribute name mapped to the class attribut. Here an example of different use cases with `@JsonProperty()`:

```typescript
class EventModel {
    
    @Required()
    name: string;
     
    @PropertyName('startDate')
    startDate: Date;

    @Property({name: 'end-date'})
    endDate: Date;

    @PropertyType(Task)
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
> Theses ES6 collections can be used : Map and Set.
> Map will be serialized as an object and Set as an array.
> By default `Date`, `Array`, `Map` and `Set` have a default custom `Converter` allready embded. But you can override theses (see next part).

For the `Array`, you must  add the `{use: baseType}` option to the decorator. TypeClass will be used to deserialize each item in the collection stored on the attribut source.

## Use your model in a Controller

```typescript
@Controller("/")
export class EventCtrl {

     @Post("/")
     save(@BodyParams() event: EventModel){
          console.log(event instanceof EventModel); // true
          return event; // event will be serialized according to your annotation on EventModel class.
     } 

     //OR
     @Post("/")
     save(@BodyParams('event') event: EventModel) {
          console.log(event instanceof EventModel); // true
          return event; // event will be serialized according to your annotation on EventModel class.
     }
}
```

## Create a custom converter

`@Converter(...targetTypes)` lets you define some converters for a certain type/Class. It useful for a generic conversion.

### Simple type
Here an example to create a custom converter for the Date type:

```typescript
import {IConverter, Converter} from "ts-express-decorators";

@Converter(Date)
export class DateConverter implements IConverter {

    // Called when a date string will be deserialized from POJ
    deserialize(data: string): Date {
        return new Date(data);
    }
 
    // Called when a Date object will be serialized to POJ
    serialize(object: Date): any {
        return object.toISOString();
    }
}
```

### Collection (Array, Map, Set)
 
For a collection, the converter is a little more complex because we need to know the base type to use when we deserialize an `Array`, `Map` or `Set` from Plain Object JavaScript. To do that, the deserialize method have two more parameters:

* `target` parameter is equal to Array, the type given to the `@Converter(Array)`. `target` parameter isn't necessary if we have only one `targetType` for a class Converter (example: `@Converter(Array, Set, Map)`). 
* `baseType` is the type given to `@JsonProperty({use: baseType})`. It's this type that will be used.

#### `Array` converter

```typescript
import {ConverterService, Converter, IConverter} from "ts-express-decorators";

@Converter(Array)
export class ArrayConverter implements IConverter {

    constructor(private converterService: ConverterService) {}

    deserialize<T>(data: any[], target: any, baseType?: T): T[] {
         
        if (isArrayOrArrayClass(data)) {
            return (data as Array<any>).map(item =>
                this.converterService.deserialize(item, baseType)
            );
        }

        return [data];
    }

    serialize(data: any[]) {
        return (data as Array<any>).map(item =>
            this.converterService.serialize(item)
        );
    }
}
```

> In this example, we use the `ConverterService` to delegate the deserialization for each item. But you can implement your own deserialization/serialization strategy.

#### `Map` converter
```typescript
import {ConverterService, Converter, IConverter} from "ts-express-decorators";

@Converter(Map)
export class MapConverter implements IConverter {
    constructor(private converterService: ConverterService) {}

    deserialize<T>(data: any, target: any, baseType: T): Map<string, T> {

        const obj = new Map<string, T>();

        Object.keys(data).forEach(key  => {

            obj.set(key, <T>this.converterService.deserialize(data[key], baseType));

        });

        return obj;
    }

    serialize<T>(data: Map<string, T>): any {
        const obj = {};

        data.forEach((value, key) =>
            obj[key] = this.converterService.serialize(value)
        );

        return obj;
    }
}
```

> In this example, we use the `ConverterService` to delegate the deserialization for each item. But you can implement your own deserialization/serialization strategy.

#### `Set` converter

```typescript
import {ConverterService, Converter, IConverter} from "ts-express-decorators";

@Converter(Set)
export class SetConverter implements IConverter {
    constructor(private converterService: ConverterService) {}

    deserialize<T>(data: any, target: any, baseType: T): Set<T> {
        const obj = new Set<T>();

        Object.keys(data).forEach(key => {

            obj.add(<T>this.converterService.deserialize(data[key], baseType));

        });

        return obj;

    }

    serialize<T>(data: Set<T>): any[] {
        const array = [];

        data.forEach((value) =>
            array.push(this.converterService.serialize(value))
        );

        return array;
    }
}
```

> In this example, we use the `ConverterService` to delegate the deserialization for each item. But you can implement your own deserialization/serialization strategy.

## Implement serialization/deserialization methods

You can implement the `deserialize` and `serialize` method on your class to customize conversion for a Plain Object JavaScript or from a POJ.

Example:
```typescript

class Foo implements IConverter {
    
    private attr1: string;

    deserialize(data: Object): void {
         this.attr1 = data.ATTR1 || "";
    }
 
    // Called when a Date object will be serialized to POJ
    serialize(): any {

        return {ATTR1: this.attr1};
    }
}
```

## Built-in converters

See in [Built-in converters](api/index.md?query=keywords_Converter|type_class) in our API references.

<div class="guide-links">
<a href="#/docs/services/overview">Controllers</a>
<a href="#/docs/middlewares/overview">Middlewares</a>
</div>