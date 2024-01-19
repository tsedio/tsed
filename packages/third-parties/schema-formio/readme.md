<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/schema-formio</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.io/

Package to transform a Schema declared with `@tsed/schema` to a valid Formio schema.

## Documentation

Documentation is available on [https://tsed.io](https://tsed.io/docs/model.html)

## Installation

You can get the latest release and the type definitions using npm:

```bash
npm install --save @tsed/schema-formio
```

## Basic example

Given the following model

```typescript
import {getFormioSchema, Form} from "@tsed/schema-formio";

@Form()
export class Model {
  @Property()
  id: string;
}

console.log(await getFormioSchema(Model));
```

Generates the following formio schema:

```json
{
  "components": [
    {
      "disabled": false,
      "input": true,
      "key": "test",
      "label": "Test",
      "type": "textfield",
      "validate": {
        "required": false
      }
    }
  ],
  "display": "form",
  "machineName": "model",
  "name": "model",
  "title": "Model",
  "type": "form"
}
```

## Decorators

This package support a large part of the JsonSchema decorators provided by `@tsed/schema`.
So you can use `Property`, `Required`, `CollectionOf`, etc... decorator to generate a valid Formio
schema.

Some extra decorators have been added to customize the component generated for a class property.
Here the list:

- Component: Create a custom component,
- Currency: Change the property to a Currency component,
- DataSourceJson: Add custom data source for a Select component,
- DataSourceUrl: Fetch data source from an endpoint,
- Hidden: Change the property to a Hidden component,
- InputTags: Change the property to an InputTags component,
- Multiple: Set the multiple flag on a property,
- Password: Change the property to an input Password component,
- Select: Change the property to a Select component,
- TableView: Display or not the property in a Table,
- Tabs: Group property using the Formio tab component,
- Textarea: Change a component to a Textarea component.

### Component

Component decorator let you to define any extra formio metadata on a decorated property:

```typescript
import {Form, Component} from "@tsed/schema-formio";

@Form()
export class Model {
  @Component({
    tooltip: "MyTooltip"
  })
  tags: string;
}
```

So with this decorator, you can define any metadata and define your own decorator to
wrap a complete component schema.

### InputTags

```typescript
import {getFormioSchema} from "@tsed/schema-formio";

export class Model {
  @InputTags()
  @Title("Tags for my model")
  @CollectionOf(String)
  tags: string[];
}

console.log(await getFormioSchema(Model));
```

Generates the following formio schema:

```json
{
  "components": [
    {
      "key": "test",
      "type": "tags",
      "input": true,
      "label": "Test",
      "storeas": "array",
      "tableView": false,
      "disabled": false,
      "validate": {
        "required": false
      }
    }
  ],
  "display": "form",
  "machineName": "model",
  "name": "model",
  "title": "Model",
  "type": "form"
}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
