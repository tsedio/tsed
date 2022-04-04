---
meta:
  - name: description
    content: Use AJV with Express, TypeScript and Ts.ED. AJV allows you to validate your data models from a JsonSchema.
  - name: keywords
    content: ts.ed express typescript ajv node.js javascript decorators jsonschema class models
projects:
  - title: Kit basic
    href: https://github.com/tsedio/tsed-getting-started
    src: /tsed.png
---

# AJV

<Banner src="../.vuepress/public/ajv_logo.png" href="https://ajv.js.org/" height="100" />

This tutorial shows you how you can validate your data with decorators.

Validation feature uses [Ajv](https://github.com/epoberezkin/ajv)
and [json-schema](http://json-schema.org/latest/json-schema-validation.html) to perform the model validation.

<Projects type="projects"/>

## Installation

Before using the validation decorators, we need to install the [ajv](https://www.npmjs.com/package/ajv) module.

```bash
npm install --save ajv
npm install --save @tsed/ajv
```

Then import `@tsed/ajv` in your Server:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module

@Configuration({
  ajv: {}
})
export class Server {}
```

The AJV module allows a few settings to be added through the ServerSettings (all are optional):

- _options_ are AJV specific options passed directly to the AJV constructor,
- _errorFormatter_ can be used to alter the output produced by the `@tsed/ajv` package.

The error message could be changed like this:

```typescript
import {Configuration} from "@tsed/common";
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

Ts.ED gives some decorators to write your validation model:

<ApiList query="status.includes('decorator') && status.includes('validation')" />

## Examples

#### Model validation

A model can be used on a method controller along with [@BodyParams](/api/common/filters/decorators/BodyParams.md) or other decorators, and will
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

  @Format("date") // or date-time, etc...
  createDate: Date;

  @Pattern(/hello/)
  customInput: string;

  @Enum("value1", "value2")
  customInput: "value1" | "value2";
}
```

## Validation error

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

## User defined keywords

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

<Tabs class="-code">
  <Tab label="Product.ts">
  
```typescript
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

````
  </Tab>
  <Tab label="Range.ts">

```typescript
import {CustomKey} from "@tsed/schema";

export function Range(min: number, max: number) {
  return CustomKey("range", [min, max]);
}

export function ExclusiveRange(bool: boolean) {
  return CustomKey("exclusiveRange", bool);
}
````

  </Tab>
</Tabs>

Finally, we can create a unit test to verify if our example works properly:

```typescript
import "@tsed/ajv";
import {PlatformTest} from "@tsed/common";
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

### With "code" function

Starting from v7 Ajv uses [CodeGen module](https://ajv.js.org/lib/compile/codegen/index.ts) for all pre-defined keywords - see [codegen.md](https://ajv.js.org/codegen.html) for details.

Example `even` keyword:

<Tabs class="-code">
  <Tab label="Event.ts">
  
```typescript
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

````

  </Tab>
  <Tab label="Ajv example">

```typescript
import ajv, {_, KeywordCxt} from "ajv";

ajv.addKeyword({
  keyword: "even",
  type: "number",
  schemaType: "boolean",
  // $data: true // to support [$data reference](./validation.html#data-reference), ...
  code(cxt: KeywordCxt) {
    const {data, schema} = cxt
    const op = schema ? _`!==` : _`===`
    cxt.fail(_`${data} %2 ${op} 0`) // ... the only code change needed is to use `cxt.fail$data` here
  },
})

const schema = {even: true}
const validate = ajv.compile(schema)
console.log(validate(2)) // true
console.log(validate(3)) // false
````

  </Tab>
</Tabs>

## Formats <Badge text="v6.36.0+" />

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
import {Configuration} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module
import "./formats/UriFormat"; // just import the class, then Ts.ED will mount automatically the new format

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
import {PlatformTest} from "@tsed/common";
import {AjvService} from "@tsed/ajv";
import "./UriFormat";

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

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
