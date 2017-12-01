# AJV Validation
> Experimental feature. You can contribute to improve this feature !

This tutorials show you, how you can validation decorators with Ts.ED. Validation feature use [Ajv](https://github.com/epoberezkin/ajv)
 and [json-schema](http://json-schema.org/latest/json-schema-validation.html) to perform the model validation.

## Installation

Before using the validation decorators, we need to install the [ajv](https://www.npmjs.com/package/ajv) module.

```bash
npm install --save ajv
```

Then import `ts-express-decorators/ajv` in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/ajv"; // import ajv ts.ed module

@ServerSettings({
    rootDir: __dirname
})
export class Server extends ServerLoader {

}
```

### Decorators

The Ts.ED ajv plugin given some decorators to write validate a model:

- [Email](api/ajv/email.md),
- [Enum](api/ajv/enum.md),
- [ExclusiveMaximum](api/ajv/exclusivemaximum.md),
- [ExclusiveMinimum](api/ajv/exclusiveminimum.md),
- [Format](api/ajv/format.md),
- [Maximum](api/ajv/maximum.md),
- [MaxItems](api/ajv/maxitems.md),
- [MaxLength](api/ajv/maxlength.md),
- [MaxProperties](api/ajv/maxproperties.md),
- [MultipleOf](api/ajv/multipleof.md),
- [Pattern](api/ajv/pattern.md),
- [UniqueItems](api/ajv/uniqueitems.md).
 
## Examples

#### Model validation

A model can used on a method controller along with [@BodyParams](api/common/filters/bodyparams.md) or other decorators, and will
be validated by Ajv.

```typescript
import {Required} from "ts-express-decorators";
import {MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email} from "ts-express-decorators/ajv";

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

<div class="guide-links">
<a href="#/tutorials/swagger">Swagger</a>
<a href="#/tutorials/upload-files-with-multer">Upload files</a>
</div>