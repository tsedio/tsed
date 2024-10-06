<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/platform-log-request</h1>

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

# Installation

```bash
npm install --save @tsed/platform-log-request
```

## Configuration

```ts
import {Configuration} from "@tsed/di";
import "@tsed/platform-log-request";
import {levels} from "@tsed/logger";

@Configuration({
  /**
   * Log all incoming request. By default, is true and print the configured `logger.requestFields`.
   * @optional
   */
  // logRequest: true,
  /**
   * A function to alter the log object before it's logged.
   * @optional
   */
  // alterLog: (level, data, $ctx) => {
  //   /// see example above
  // },
  /**
   * A function to alter the log object before it's logged.
   * @optional
   */
  // onLogEnd? : ($ctx: BaseContext) => void;
})
class Server {}
```

## Alter log request

By default, Ts.ED provide a default log object. You can alter this object by providing a function to the `alterLog` property.

Here his the default implementation:

```typescript
export function defaultAlterLog(level: string, obj: Record<string, unknown>, ctx: BaseContext) {
  const minimalLog = {
    method: ctx.request.method,
    url: ctx.request.url,
    route: ctx.request.route || ctx.request.url,
    ...obj
  };

  if (level === "info") {
    return minimalLog;
  }

  return {
    ...minimalLog,
    headers: ctx.request.headers,
    body: ctx.request.body,
    query: ctx.request.query,
    params: ctx.request.params
  };
}
```

Just give your own implementation to the `alterLog` property.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-log-request";
import {customAlterLog} from "./utils/customAlterLog.js";

@Configuration({
  alterLog: customAlterLog
})
class Server {}
```

## Customize log response

By default, Ts.ED provide a default log response implementation.

Here his the default implementation:

```typescript
export function defaultLogResponse($ctx: BaseContext) {
  if ($ctx.response.statusCode >= 400) {
    const error = $ctx.error as any | undefined;

    $ctx.logger.error({
      event: "request.end",
      status: $ctx.response.statusCode,
      status_code: String($ctx.response.statusCode),
      state: "KO",
      ...cleanObject({
        error_name: error?.name || error?.code,
        error_message: error?.message,
        error_errors: error?.errors,
        error_stack: error?.stack,
        error_body: error?.body,
        error_headers: error?.headers
      })
    });
  } else {
    $ctx.logger.info({
      event: "request.end",
      status: $ctx.response.statusCode,
      status_code: String($ctx.response.statusCode),
      state: "OK"
    });
  }
}
```

Just give your own implementation to the `onLogResponse` property.

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-log-request";
import {customOnLogResponse} from "./utils/customOnLogResponse.js";

@Configuration({
  onLogResponse: customOnLogResponse
})
class Server {}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html).

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
