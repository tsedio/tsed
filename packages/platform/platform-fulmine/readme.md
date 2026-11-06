<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Platform fulmine.js</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.dev/getting-started/

## Installation

Run npm command (or yarn):

```bash
npm install --save @tsed/platform-fulmine @tsed/platform-express fulmine.js express
```

[fulmine.js](https://github.com/nigrosimone/fulmine.js) is an Express 5 compatible framework on
uWebSockets.js. The platform uses the Express adapter for the routing, so the Express middlewares of a Ts.ED
app stay the same, and the app listens on uWebSockets.js instead of the http server of node. `express` is
still needed, as a peer of `@tsed/platform-express`.

About the install:

- fulmine.js depends on `uWebSockets.js` from GitHub (`github:uNetworking/uWebSockets.js#v20.71.0`), not from the npm
  registry, so the install needs access to github.com. Behind a registry mirror or a proxy that only allows npm, it fails.
- uWebSockets.js is a native addon with prebuilt binaries: Node 22, 24 or 26 on Linux or macOS (x64 or arm64) or
  Windows (x64). Not Alpine (glibc 2.38+ is needed).
- On Bun and Deno fulmine.js does not load uWebSockets.js and listens with their own `node:http`, plain HTTP only.

## Usage

```typescript
import {PlatformFulmine} from "@tsed/platform-fulmine";
import {Server} from "./Server.js";

const platform = await PlatformFulmine.bootstrap(Server, {httpPort: 8083});
await platform.listen();
```

To pass options to fulmine, such as TLS with `uwsOptions`, give your own app:

```typescript
import fulmine from "fulmine.js";

const platform = await PlatformFulmine.bootstrap(Server, {
  httpPort: 8443,
  fulmine: {
    app: fulmine({uwsOptions: {key_file_name: "key.pem", cert_file_name: "cert.pem"}})
  }
});
```

`httpsPort` is not supported: TLS belongs to uWebSockets.js, set it on the fulmine app.

See [Ts.ED capabilities](https://tsed.dev/introduction/capabilities.html) for more information.

## Contributors

Please read [contributing guidelines here](https://tsed.dev/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
