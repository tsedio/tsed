# @tsed/ajv

> Experimental feature. You can contribute to improve this feature !

A package of Ts.ED framework. See website: https://romakita.github.io/ts-express-decorators/

## Installation

Before using the validation decorators, we need to install the [ajv](https://www.npmjs.com/package/ajv) module.

```bash
npm install --save ajv
npm install --save @tsed/ajv
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

### Decorators

See our API documentation on https://romakita.github.io/ts-express-decorators/#/api/index

## Example

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


## Error configuration

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