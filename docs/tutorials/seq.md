---
meta:
  - name: description
    content: Use Seq logger, TypeScript and Ts.ED. Seq is the centralized structured logs for NodeJS, .NET, Java etc.
  - name: keywords
    content: ts.ed express typescript seq node.js javascript decorators
---

# Seq

<Banner src="https://blog.datalust.co/content/images/2018/09/Seq-380px-1.png" href="https://datalust.co/seq" :height="128" />

This tutorial shows you how you can configure Seq logger with Ts.ED. Seq is centralized structured logs for NodeJS, .NET, Java etc.

## Installation

Run this command to install required dependencies by `@tsed/seq`:

```bash
npm install --save @tsed/seq
```

Then add the following configuration in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/seq"; // import seq Ts.ED module

@Configuration({
  seq: {
    serverUrl: "http://localhost:5341" // url props works also
  }
})
export class Server {}
```

::: tip Note
Seq module uses the [@tsed/logger](https://logger.tsed.io/) as a default system logger
:::

::: tip Note
Seq module uses the log level from the @@LoggerSettings@@ (default level is debug)
:::

## Example

```typescript
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params";
import {$log} from "@tsed/logger";

@Controller("/calendars")
export class Calendar {
  @Get("/:id")
  async getCalendar(@QueryParams("id") id: string): Promise<CalendarModel> {
    $log.info(id);
  }
}
```

Then we should see the log in the Seq panel (by default `localhost:5341`)

## Author

<GithubContributors users="['OskarLebuda']"/>

## Maintainers

<GithubContributors users="['OskarLebuda', 'Romakita']"/>
