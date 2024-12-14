---
head:
  - - meta
    - name: description
      content: Use Ts.ED validation system to validate your data. Ts.ED provides a set of decorators to validate your data.
  - - meta
    - name: keywords
      content: validation ajv ts.ed express typescript node.js javascript decorators jsonschema class models
---

# Validation

<Banner src="/ajv_logo.png" href="https://ajv.js.org/" height="100" />

Ts.ED provide by default an [AJV](/tutorials/ajv.md) package `@tsed/ajv` to perform a validation on a [Model](/docs/model).
The CLI install `@tsed/ajv` module by default. But if you start your project without Ts.ED CLI, you have to install it manually.

This package must be installed to run automatic validation on input data. Any model used on parameter and annotated with one of JsonSchema decorator will be
validated with AJV.

::: code-group

```sh [npm]
npm install --save ajv @tsed/ajv
```

```sh [yarn]
yarn add ajv @tsed/ajv
```

```sh [pnpm]
pnpm add ajv @tsed/ajv
```

```sh [bun]
bun add ajv @tsed/ajv
```

:::

Then import `@tsed/ajv` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/ajv"; // import ajv ts.ed module

@Configuration({
  ajv: {
    returnsCoercedValues: true // returns coerced value to the next pipe instead of returns original value (See #2355)
  }
})
export class Server {}
```

The AJV module allows a few settings to be added through the ServerSettings (all are optional):

- **options** are AJV specific options passed directly to the AJV constructor,
- **errorFormatter** can be used to alter the output produced by the `@tsed/ajv` package.

The error message could be changed like this:

```typescript
import {Configuration} from "@tsed/diu";
import "@tsed/ajv"; // import ajv ts.ed module

@Configuration({
  ajv: {
    errorFormatter: (error) => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
    verbose: true
  }
})
export class Server {}
```

## Decorators

Ts.ED gives some decorators to write your validation [model](/docs/model):

<ApiList query="status.includes('decorator') && status.includes('validation')" />

You can find more information about the decorators in the [Model documentation](/docs/model).

## Usage examples

### Model validation

A model can be used on a method controller along with @@BodyParams@@
or other decorators, and will
be validated by Ajv.

```typescript
import {Required, MaxLength, MinLength, Minimum, Maximum, Format, Enum, Pattern, Email} from "@tsed/schema";

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

  @Format("date") // or date-time, etc...
  createDate: Date;

  @Pattern(/hello/)
  customInput: string;

  @Enum("value1", "value2")
  customInput: "value1" | "value2";
}
```

### Validation error

When a validation error occurs, AJV generates a list of errors with a full description like this:

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

## Custom validators

### User-defined keywords

Ajv allows you to define custom keywords to validate a property.

You can find more details on the different ways to declare a custom validator on this page: https://ajv.js.org/docs/keywords.html

Ts.ED introduces the @@Keyword@@ decorator to declare a new custom validator for Ajv. Combined with the @@CustomKey@@ decorator to add keywords to a property of your class, you can use more complex scenarios than what basic JsonSchema allows.

For example, we can create a custom validator to support the `range` validation over a number. To do that, we have to define
the custom validator by using @@Keyword@@ decorator:

```typescript
import {Keyword, KeywordMethods} from "@tsed/ajv";
import {array, number} from "@tsed/schema";

@Keyword({
  keyword: "range",
  type: "number",
  schemaType: "array",
  implements: ["exclusiveRange"],
  metaSchema: array().items([number(), number()]).minItems(2).additionalItems(false)
})
class RangeKeyword implements KeywordMethods {
  compile([min, max]: number[], parentSchema: any) {
    return parentSchema.exclusiveRange === true ? (data: any) => data > min && data < max : (data: any) => data >= min && data <= max;
  }
}
```

Then we can declare a model using the standard decorators from `@tsed/schema`:

::: code-group

```typescript [Product.ts]
import {CustomKey} from "@tsed/schema";
import {Range, ExclusiveRange} from "../decorators/Range"; // custom decorator

export class Product {
  @CustomKey("range", [10, 100])
  @CustomKey("exclusiveRange", true)
  price: number;

  // OR

  @Range(10, 100)
  @ExclusiveRange(true)
  price2: number;
}
```

```ts [Range.ts]
import {CustomKey} from "@tsed/schema";

export function Range(min: number, max: number) {
  return CustomKey("range", [min, max]);
}

export function ExclusiveRange(bool: boolean) {
  return CustomKey("exclusiveRange", bool);
}
```

:::

Finally, we can create a unit test to verify if our example works properly:

```typescript
import "@tsed/ajv";
import {PlatformTest} from "@tsed/platform-http/testing";
import {getJsonSchema} from "@tsed/schema";
import {Product} from "./Product";
import "../keywords/RangeKeyword";

describe("Product", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should call custom keyword validation (compile)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = getJsonSchema(Product, {customKeys: true});
    const validate = ajv.compile(schema);

    expect(schema).to.deep.equal({
      properties: {
        price: {
          exclusiveRange: true,
          range: [10, 100],
          type: "number"
        }
      },
      type: "object"
    });

    expect(validate({price: 10.01})).toEqual(true);
    expect(validate({price: 99.99})).toEqual(true);
    expect(validate({price: 10})).toEqual(false);
    expect(validate({price: 100})).toEqual(false);
  });
});
```

::: warning
If you planed to create keyword that transform the data, you have to set `returnsCoercedValues` to `true` in your configuration.
:::

### With "code" function

Starting from v7, Ajv uses [CodeGen module](https://github.com/ajv-validator/ajv/blob/master/lib/compile/codegen/index.ts) for all pre-defined keywords - see [codegen.md](https://ajv.js.org/codegen.html) for details.

Example `even` keyword:

::: code-group

```typescript [Event.ts]
import {Keyword, KeywordMethods} from "@tsed/ajv";
import {array, number} from "@tsed/schema";
import {_, KeywordCxt} from "ajv";

@Keyword({
keyword: "even",
type: "number",
schemaType: "boolean"
})
class EvenKeyword implements KeywordMethods {
  code(cxt: KeywordCxt) {
    const {data, schema} = cxt;
    const op = schema ? _`!==` : _`===`;
    cxt.fail(\_`${data} %2 ${op} 0`);
  }
}
```

```typescript [Ajv example]
import ajv, {_, KeywordCxt} from "ajv";

ajv.addKeyword({
  keyword: "even",
  type: "number",
  schemaType: "boolean",
  // $data: true // to support [$data reference](./validation.html#data-reference), ...
  code(cxt: KeywordCxt) {
    const {data, schema} = cxt;
    const op = schema ? _`!==` : _`===`;
    cxt.fail(_`${data} %2 ${op} 0`); // ... the only code change needed is to use `cxt.fail$data` here
  }
});

const schema = {even: true};
const validate = ajv.compile(schema);
console.log(validate(2)); // true
console.log(validate(3)); // false
```

:::

## Custom Formats

You can add and replace any format using @@Formats@@ decorator. For example, the current format validator for `uri` doesn't allow
empty string. So, with this decorator you can create or override an existing [ajv-formats](https://github.com/ajv-validator/ajv-formats) validator.

```typescript
import {Formats, FormatsMethods} from "@tsed/ajv";

const NOT_URI_FRAGMENT = /\/|:/;
const URI =
  /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;

@Formats("uri", {type: "string"})
export class UriFormat implements FormatsMethods<string> {
  validate(str: string): boolean {
    // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
    return str === "" ? true : NOT_URI_FRAGMENT.test(str) && URI.test(str);
  }
}
```

Then, we can import this class to our server as follows:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/ajv"; // import ajv ts.ed module
import "./formats/UriFormat.js"; // just import the class, then Ts.ED will mount automatically the new format

@Configuration({
  ajv: {
    // ajv options
  }
})
export class Server {}
```

Now, this example will be valid:

```typescript
import {Uri, getJsonSchema} from "@tsed/schema";
import {PlatformTest} from "@tsed/platform-http/testing";
import {AjvService} from "@tsed/ajv";
import "./UriFormat.js";

describe("UriFormat", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should validate empty string when we load the our custom Formats for AJV", async () => {
    class MyModel {
      @Uri() // or @Format("uri")
      uri: string;
    }

    const service = PlatformTest.get<AjvService>(AjvService);
    const jsonSchema = getJsonSchema(MyModel);

    expect(jsonSchema).to.deep.equal({
      properties: {
        uri: {
          format: "uri",
          type: "string"
        }
      },
      type: "object"
    });

    const result = await service.validate({uri: ""}, {type: MyModel});

    expect(result).to.deep.eq({uri: ""});
  });
});
```

## Override default validation pipe

Ts.ED allows you to change the default @@ValidationPipe@@ by your own library. The principle is simple.
Create a CustomValidationPipe and use @@OverrideProvider@@ to change the default @@ValidationPipe@@.

::: warning
Replace the default JsonSchema validation provided by Ts.ED isn't recommended. You lose the ability to generate the swagger documentation and the json-mapper feature.
:::

<<< @/docs/snippets/validation/validator-pipe.ts

::: warning
Don't forgot to import the new `CustomValidatorPipe` in your `server.ts` !
:::

### Use Joi

There are several approaches available for object validation. One common approach is to use schema-based validation.
The [Joi](https://github.com/hapijs/joi) library allows you to create schemas in a pretty straightforward way, with a readable API.

Let's look at a pipe that makes use of Joi-based schemas.

Start by installing the required package:

::: code-group

```sh [npm]
npm install --save joi
```

```sh [yarn]
yarn add joi
```

```sh [pnpm]
pnpm add joi
```

```sh [bun]
bun add joi
```

:::

In the code sample below, we create a simple class that takes a schema as a constructor argument.
We then apply the `schema.validate()` method, which validates our incoming argument against the provided schema.

In the next section, you'll see how we supply the appropriate schema for a given controller method using the @@UsePipe@@ decorator.

<<< @/docs/snippets/validation/joi-pipe.ts

Now, we have to create a custom decorator to store the Joi schema along with a parameter:

<<< @/docs/snippets/validation/joi-pipe-decorator.ts

And finally, we are able to add Joi schema with our new decorator:

<<< @/docs/snippets/validation/joi-pipe-usage.ts

### Use Class validator

Let's look at an alternate implementation of our validation technique.

Ts.ED works also with the [class-validator](https://github.com/typestack/class-validator) library.
This library allows you to use **decorator-based** validation (like Ts.ED with his [JsonSchema](/docs/model) decorators).
Decorator-based validation combined with Ts.ED [Pipe](/docs/pipes.html) capabilities since we have access to the medata.type of the processed parameter.

Before we start, we need to install the required packages:

::: code-group

```sh [npm]
npm i --save class-validator class-transformer
```

```sh [yarn]
yarn add class-validator class-transformer
```

```sh [pnpm]
pnpm add class-validator class-transformer
```

```sh [bun]
bun add class-validator class-transformer
```

:::

Once these are installed, we can add a few decorators to the `PersonModel`:

```typescript
import {IsString, IsInt} from "class-validator";

export class CreateCatDto {
  @IsString()
  firstName: string;

  @IsInt()
  age: number;
}
```

::: tip
Read more about the class-validator decorators [here](https://github.com/typestack/class-validator#usage).
:::

Now we can create a [ClassValidationPipe] class:

<<< @/docs/snippets/validation/class-validator-pipe.ts

::: warning Notice
Above, we have used the [class-transformer](https://github.com/typestack/class-transformer) library.
It's made by the same author as the **class-validator** library, and as a result, they play very well together.
:::

Note that we get the type from @@ParamMetadata@@ and give it to plainToObject function. The method `shouldValidate`
bypass the validation process for the basic types and when the `metadata.type` or `metadata.collectionType` are not available.

Next, we use the **class-transformer** function `plainToClass()` to transform our plain JavaScript argument object into a typed object
so that we can apply validation. The incoming body, when deserialized from the network request, does not have any type information.
Class-validator needs to use the validation decorators we defined for our **PersonModel** earlier,
so we need to perform this transformation.

Finally, we return the value when we haven't errors or throws a `ValidationError`.

::: tip
If you use **class-validator**, it also be logical to use [class-transformer](https://github.com/typestack/class-transformer) as Deserializer.
So we recommend to override also the @@DeserializerPipe@@.

<<< @/docs/snippets/validation/class-transformer-pipe.ts
:::

We just have to import the pipe on our `server.ts` and use model as type on a parameter.
