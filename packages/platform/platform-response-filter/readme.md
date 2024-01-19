<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/platform-response-filter</h1>

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

# Features

Transform data returned by a method to a formatted response based on the stored metadata.

# Installation

```bash
npm install --save @tsed/di @tsed/platform-views @tsed/schema @tsed/json-schema @tsed/platform-response-filter
```

## Usage

Define a class that return data:

```typescript
import {Injectable} from "@tsed/di";
import {Returns} from "@tsed/schema";
import {MyModel} from "../models/MyModel";

@Injectable()
class MyService {
  @Returns(200, MyModel)
  async getData() {
    return new MyModel({id: "id", test: "test"});
  }

  @Returns(200, MyModel)
  @View("myview.ejs")
  async getDataView() {
    return new MyModel({id: "id", test: "test"});
  }
}
```

Add a response filter for a specific content-type:

```typescript
import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";

@ResponseFilter("application/json")
export class WrapperResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    return {data, errors: [], links: {}};
  }
}
```

Then call the service in you module:

```typescript
import {Module, DIContext} from "@tsed/di";
import {ResponseFilter} from "@tsed/platform-response-filter";
import "./filters/WrapperResponseFilter";

@Module()
class MyModule {
  @Inject()
  injector: InjectorService;

  @Inject()
  responseFilter: ResponseFilter;

  async onRequest(req: any, res: any) {
    const context = new DIContext({
      id: uuid.v4(),
      injector: this.injector,
      logger: this.injector.logger
    });

    // must implement these methods
    context.request = {
      accepts(...args: any[]) {
        return req.accepts(...args);
      },
      get(key: string) {
        return req.get(key);
      }
    };
    context.response = {
      contentType(contentType: string) {
        res.contentType(contentType);
      }
    };

    const service = this.injector.get<MyService>(MyService);
    let data = await service.getData();

    // serialize data (map Model to Plain object)
    data = await this.responseFilter.serialize(data, context);

    // call filter based on the right content type
    data = await this.responseFilter.transform(data, context);

    if (isObject(data)) {
      res.json(data);
    } else {
      res.send(data);
    }
  }
}
```

This example will call the getData() method, serialize the instance MyModel to a plain object then call the WrapperResponseFilter,
to produce the following response:

```
{
  "data": {
    "id": "id",
    "test": "test"
  },
  "error": [],
  "links": {}
}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html).

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
