# @tsed/seq

> Pre release, your feedback are welcome. Do not use this package in production

<div align="center">
<a href="http://www.passportjs.org/">
<img src="https://blog.datalust.co/content/images/2018/09/Seq-380px-1.png" height="128">
</a>
</div>

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/seq

## Installation

Run npm command (or yarn):
```bash
npm install --save @tsed/seq bunyan bunyan-seq @types/bunyan @types/bunyan-seq
```

Then add the following configuration in your [ServerLoader](https://tsed.io/api/common/server/components/ServerLoader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/seq"; // import seq Ts.ED module

@ServerSettings({
  rootDir: __dirname,
  seq: {
    url: "http://localhost:5341"
  }
})
export class Server extends ServerLoader {

}
```
> Note: Seq module use the [ts-log-debug](https://github.com/TypedProject/ts-log-debug) as a default system logger

> Note: Seq module use the log level from the [LoggerSettings](https://tsed.io/api/common/config/interfaces/ILoggerSettings.md) (default level is debug)

## Example

```typescript
import {Controller, Get, Post} from "@tsed/common";
import {$log} from "ts-log-debug";

@Controller('/calendars')
export class Calendar {
    
    @Get('/:id')
    async getCalendar(@QueryParam() id: string): Promise<CalendarModel> {
      $log.info(id);
    }
   
}
```

Then we should see the log in the Seq panel (by default `localhost:80`)

## Maintainer

Thanks to [OskarLebuda](https://github.com/OskarLebuda) to his contribution.

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti - OskarLebuda

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
