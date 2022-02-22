<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/terminus</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![Coverage Status](https://coveralls.io/repos/github/tsedio/tsed/badge.svg?branch=production)](https://coveralls.io/github/tsedio/tsed?branch=production)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/badge.svg)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started.html">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

Adds graceful shutdown and Kubernetes readiness / liveness checks for any HTTP applications.

## Installation

Before using terminus, we need to install the [terminus](https://www.npmjs.com/package/@godaddy/terminus) module.

```bash
npm install --save @godaddy/terminus @tsed/terminus
```

Then import `@tsed/terminus` and add the following configuration in your `Server.ts`:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/terminus"; // import terminus Ts.ED module
import {resolve} from "path";

@Configuration({
  terminus: {
    // ... see Terminus configuration options on https://github.com/godaddy/terminus
  }
})
export class Server {}
```

### Options

`terminus` configuration options waiting the same option description in the official Terminus documentation [here](https://github.com/godaddy/terminus).
The following the options are managed by the `@tsed/terminus` package:

- healthChecks
- onSignal
- onSendFailureDuringShutdown
- onShutdown
- beforeShutdown
- onSigterm

```typescript
export type TerminusSettings = Omit<
  TerminusOptions,
  "healthChecks" | "onSignal" | "onSendFailureDuringShutdown" | "onShutdown" | "beforeShutdown" | "onSigterm"
>;
```

## Usage

### Readiness / liveness checks

To create a readiness / liveness checks use the `@Health` decorator.

```ts
import {Health} from "@tsed/terminus";

@Controller("/mongo")
class MongoCtrl {
  @Health("/health")
  health() {
    // Here check the mongo health
    return Promise.resolve();
  }
}
```

You can also create an `HealthCheckError` when an error appear during your check.

```ts
import {Health} from "@tsed/terminus";
import {HealthCheckError} from "@godaddy/terminus";

@Controller("/redis")
class Redis {
  @Health("/health")
  health() {
    // Here check the redis health
    return Promise.reject(
      new HealthCheckError("failed", {
        redis: "down"
      })
    );
  }
}
```

### Graceful shutdown

`@tsed/terminus` package give some decorators to handle Terminus hooks. These hooks allow you to adds graceful shutdown.
Here is the list of decorators:

- `BeforeShutdown`: Use this hook if you deploy your application with Kubernetes (see more details [here](https://github.com/godaddy/terminus#how-to-set-terminus-up-with-kubernetes)),
- `OnSignal`: cleanup hook, returning a promise (used to be onSigterm),
- `OnShutdown`: called right before exiting,
- `OnSendFailureDuringShutdown`: called before sending each 503 during shutdowns.

**Example:**

```typescript
import {BeforeShutdown, OnSendFailureDuringShutdown, OnShutdown, OnSignal} from "@tsed/terminus";

@Controller("/redis")
class RedisCtrl {
  @BeforeShutdown()
  beforeShutdow() {
    console.log("called before shutdown");
  }

  @OnSignal()
  OnSignal() {
    console.log("called on signal");
  }

  @OnShutdown()
  OnShutdown() {
    console.log("called on shutdown");
  }

  @OnSendFailureDuringShutdown()
  OnSendFailureDuringShutdown() {
    console.log("on send failure during shutdown");
  }
}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html).

<a href="https://github.com/tsedio/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

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
