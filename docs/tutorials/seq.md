---
meta:
 - name: description
   content: Use Seq logger, TypeScript and Ts.ED. Seq is the centralized structured logs for NodeJS, .NET, Java etc.
 - name: keywords
   content: ts.ed express typescript seq node.js javascript decorators
---
# Seq

<Banner src="https://blog.datalust.co/content/images/2018/09/Seq-380px-1.png" href="https://datalust.co/seq" :height="128" />

This tutorials show you, how you can configure Seq logger with Ts.ED. Seq is centralized structured logs for NodeJS, .NET, Java etc.

## Installation

Run this command to install required dependencies by `@tsed/seq`:

```bash
npm install --save @tsed/seq bunyan bunyan-seq @types/bunyan @types/bunyan-seq
```

Then add the following configuration in your @@ServerLoader@@:

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

> Note: Seq module use the log level from the @@LoggerSettings@@ (default level is debug)

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

Then we should see the log in the Seq panel (by default `localhost:5341`)

::: tip Credits
Thanks to [OskarLebuda](https://github.com/OskarLebuda) to his contribution.
:::
