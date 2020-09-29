---
meta:
 - name: description
   content: Use AJV with Express, TypeScript and Ts.ED. AJV allows you to validate your data models from a JsonSchema.
 - name: keywords
   content: ts.ed express typescript ajv node.js javascript decorators jsonschema class models
projects:
 - title: Kit basic
   href: https://github.com/TypedProject/tsed-getting-started
   src: /tsed.png
---

# AJV

<Banner src="https://ajv.js.org/images/ajv_logo.png" href="https://ajv.js.org/" height="100" />

This tutorial shows you how you can validate your data with decorators.

Validation feature uses [Ajv](https://github.com/epoberezkin/ajv)
 and [json-schema](http://json-schema.org/latest/json-schema-validation.html) to perform the model validation.
 
<Projects type="examples"/>

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
    rootDir: __dirname
})
export class Server {
}
```

The AJV module allows a few settings to be added through the ServerSettings (all are optional):

* *options* are AJV specific options passed directly to the AJV constructor,
* *errorFormatter* can be used to alter the output produced by the `@tsed/ajv` package.

The error message could be changed like this:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module

@Configuration({
    rootDir: __dirname,
     ajv: {
       errorFormatter: (error) => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
       verbose: true
    },
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

    @Format("date")  // or date-time, etc...
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

This information can be retrieved in the response headers:

```
 connection: keep-alive
 content-length: 18
 content-type: text/html; charset=utf-8
 date: Wed, 16 May 2018 07:32:23 GMT
 errors: [{"keyword": "minLength","dataPath": ".password", "schemaPath": "#/properties/password/minLength", "params": {"limit": 6}, "message": "should NOT be shorter than 6 characters", "modelName": "User"}]
 etag: W/"12-Bpa0T7/lBA6+IACzRWwBc4S6NUY"
 vary: Accept-Encoding
 x-powered-by: Express
```

## Author 

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>


<div class="container--centered container--padded">
<a href="/contributing.html" class="nav-link button">
 Become maintainer
</a>
</div>