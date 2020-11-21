# @tsed/swagger

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

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/swagger

## Installation

Before using the Swagger, we have to install the [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) module.

```bash
npm install --save @tsed/swagger
```

Then add the following configuration in your Server:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module
import {resolve} from "path";
const rootDir = resolve(__dirname)

@Configuration({
  rootDir,
  swagger: [
    {
     path: "/v2/docs",
     specVersion: "2.0"
    },
    {
     path: "/v3/docs",
     specVersion: "3.0.1"
    }
  ]
})
export class Server {

}
```
> The path option for swagger will be used to expose the documentation (ex: http://localhost:8000/api-docs).

Normally, Swagger-ui is ready. You can start your server and check if it work fine.

> Note: Ts.ED will print the swagger url in the console.

### Swagger options

Some options is available to configure Swagger-ui, Ts.ED and the default spec information.

Key | Example | Description
---|---|---
path | `/api-doc` |  The url subpath to access to the documentation.
specVersion | `2.0`, `3.0.1`  | The spec version.
doc | `hidden-doc` |  The documentation key used by `@Docs` decorator to create several swagger documentations.
cssPath | `${rootDir}/spec/style.css` | The path to the CSS file.
jsPath | `${rootDir}/spec/main.js` | The path to the JS file.
showExplorer | `true` | Display the search field in the navbar.
spec | `{swagger: "2.0"}` | The default information spec.
specPath | `${rootDir}/spec/swagger.base.json` | Load the base spec documentation from the specified path.
outFile | `${rootDir}/spec/swagger.json` | Write the `swagger.json` spec documentation on the specified path.
hidden | `true` | Hide the documentation in the dropdown explorer list.
options | Swagger-UI options | SwaggerUI options. See (https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md)
operationIdFormatter | `(name: string, propertyKey: string, path: string) => string` | A function to generate the operationId.
operationIdPattern | `%c_%m` | A pattern to generate the operationId. Format of operationId field (%c: class name, %m: method name).

### Multi documentations

It also possible to create several swagger documentations with `doc` option:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs-v1",
      doc: 'api-v1'
    },
    {
      path: "/api-docs-v2",
      doc: 'api-v2'
    }
  ]
})
export class Server {

}
```

Then use `@Docs` decorators on your controllers to specify where the controllers should be displayed.

```typescript
import {Controller} from "@tsed/common";
import {Docs} from "@tsed/swagger";

@Controller('/calendars')
@Docs('api-v2') // display this controllers only for api-docs-v2
export class CalendarCtrlV2 {
}
// OR 
@Controller('/calendars')
@Docs('api-v2', 'api-v1')  // display this controllers for api-docs-v2 and api-docs-v1
export class CalendarCtrl {

}
``` 

## Examples
#### Model documentation

One of the feature of Ts.ED is the model definition to serialize or deserialize a
JSON Object (see [converters section](https://tsed.io/docs/components/converters.html)).

This model can used on a method controller along with [@BodyParams](https://tsed.io/api/common/filters/decorators/BodyParams.html) or other decorators.

```typescript
import {JsonProperty, Title, Description, Example} from "@tsed/common";

export class CalendarModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("Example value")
  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;
}
```

#### Endpoint documentation

```typescript
import {BodyParams, Controller, Get, Post, QueryParams, Returns, ReturnsArray, Description} from "@tsed/common";
import {Summary, Deprecated, Security} from "@tsed/swagger";
import {CalendarModel} from "../models/CalendarModel";

@Controller('/calendars')
export class Calendar {
    @Get('/:id')
    @Summary("Summary of this route")
    @Description("Description of this route")
    @Returns(CalendarModel)
    @Returns(404, {description: "Not found"})
    async getCalendar(@QueryParams('id') id: string): Promise<CalendarModel> {
      //...
    }
    
    @Get('/v0/:id')
    @Deprecated()
    @Description("Deprecated route, use /rest/calendars/:id instead of.")
    @Returns(CalendarModel)
    @Returns(404, {description: "Not found"})
    getCalendarDeprecated(@QueryParams('id') id: string): Promise<CalendarModel> {
      //...
    }

    @Get('/')
    @Description("Description of this route")
    @ReturnsArray(CalendarModel)
    getCalendars(): Promise<CalendarModel[]> {
      // ...
    }

    @Post('/')
    @Security("calendar_auth", "write:calendar", "read:calendar")
    @Returns(CalendarModel)
    async createCalendar(@BodyParams() body: any): Promise<CalendarModel> {
        //...
    }
}
```
::: warninig
To update the swagger.json you need to reload the server before.
:::


## Import Javascript

It possible to import a Javascript in the Swagger-ui documentation. This script let you customize the swagger-ui instance. 


```typescript
import {Configuration} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs",
      jsPath: "/spec/main.js"
    }
  ]
})
export class Server {

}
```

In your JavaScript file, you can handle Swagger-ui configuration and the instance:

```javascript
console.log(SwaggerUIBuilder.config); //Swagger-ui config

document.addEventListener('swagger.init', (evt) => {
    console.log(SwaggerUIBuilder.ui); //Swagger-ui instance
});
```

## Documentation

See our documentation https://tsed.io/#/api/index


## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html).

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
