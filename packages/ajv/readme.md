# @tsed/ajv

[![Build & Release](https://github.com/TypedProject/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/TypedProject/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/TypedProject/tsed/badge.svg?branch=production)](https://coveralls.io/github/TypedProject/tsed?branch=production)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![Known Vulnerabilities](https://snyk.io/test/github/TypedProject/tsed/badge.svg)](https://snyk.io/test/github/TypedProject/tsed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/ajv

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

### Decorators

See our API documentation on https://tsed.io/#/api/index

## Example

A model can used on a method controller along with [@BodyParams](http://tsed.io/api/common/filters/decorators/BodyParams.html) or other decorators, and will
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
* *errorFormatter*, can be used to alter the output produced by the @tsed/ajv package.

The error message could be changed like:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module

@Configuration({
    rootDir: __dirname,
     ajv: {
       errorFormatter: (error) => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
       options: {verbose: true}
    },
})
export class Server {

}
```


## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
