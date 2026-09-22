<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>Pulse</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.dev

> [!WARNING]
> `@tsed/pulse` is deprecated and will be removed in a future major release.
> This package won't receive any future updates. Do not start new projects on `@tsed/pulse`.
>
> For new projects, use [`@tsed/agenda`](https://tsed.dev/tutorials/agenda.html) with Agenda v6.
> Existing `@tsed/pulse` users should plan a migration to `@tsed/agenda` + `agenda` + `@agendajs/mongo-backend`
> by following the [migration guide](#migrate-to-tsedagenda) below.
>
> The legacy Pulse examples at the end of this page are kept only to help existing consumers maintain or migrate old code.

## Feature

`@pulsecron/pulse` is a fork of Agenda. `@tsed/pulse` allowed you to decorate classes with `@Pulse` and
corresponding methods to have them picked up by the `@pulsecron/pulse` library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the PulseService.

The same features are available in `@tsed/agenda` on top of Agenda v6, which is the recommended and maintained
scheduling integration for Ts.ED. See the [Agenda documentation](https://tsed.dev/tutorials/agenda.html).

## Installation

Do not install `@tsed/pulse` for new projects. Install the recommended Agenda v6 stack instead:

```bash
npm install --save @tsed/agenda agenda @agendajs/mongo-backend
```

Then follow the [Agenda documentation](https://tsed.dev/tutorials/agenda.html) to configure your server.

> [!NOTE]
> Only if you maintain an existing project that cannot migrate yet:
> `npm install --save @tsed/pulse @pulsecron/pulse`.

## Migrate to `@tsed/agenda`

The target stack is `@tsed/agenda` + `agenda` (v6) + `@agendajs/mongo-backend`.

### 1. Replace dependencies

| Remove             | Add                       |
| ------------------ | ------------------------- |
| `@tsed/pulse`      | `@tsed/agenda`            |
| `@pulsecron/pulse` | `agenda`                  |
|                    | `@agendajs/mongo-backend` |

```bash
npm uninstall @tsed/pulse @pulsecron/pulse
npm install --save @tsed/agenda agenda @agendajs/mongo-backend
```

### 2. Update the server configuration

The `pulse` configuration key becomes `agenda`, and the legacy `db` options move into a `MongoBackend` instance.

```diff
 import {Configuration} from "@tsed/di";
-import "@tsed/pulse";
+import "@tsed/agenda";
+import {MongoBackend} from "@agendajs/mongo-backend";

 @Configuration({
-  pulse: {
+  agenda: {
     enabled: true,
-    db: {
-      address: mongoConnectionString
-    }
+    backend: new MongoBackend({
+      address: mongoConnectionString
+    })
   }
 })
 export class Server {}
```

The Ts.ED specific flags (`enabled`, `disableJobProcessing`, `drainJobsBeforeClose`) keep the same names and
behavior in `@tsed/agenda`.

### 3. Update decorators, injection and lifecycle hooks

`@tsed/agenda` exposes the same `@Every` and `@Define` decorators. The class decorator is `@JobsController`
and the scheduler instance is the `Agenda` class from `agenda` (there is no `AgendaModule`).

```diff
-import {Pulse, Every, Define, PulseModule} from "@tsed/pulse";
-import {Job} from "@pulsecron/pulse";
+import {JobsController, Every, Define} from "@tsed/agenda";
+import {Agenda, Job} from "agenda";

-@Pulse({namespace: "email"})
+@JobsController({namespace: "email"})
 export class EmailJobService {
   @Inject()
-  pulse: PulseModule;
+  agenda: Agenda;

   @Every("60 minutes", {name: "maintenanceJob"})
   async sendAdminStatistics(job: Job) {}

   @Define({name: "sendWelcomeEmail"})
   async sendWelcomeEmail(job: Job) {}

-  async $beforePulseStart() {}
-  async $afterPulseStart() {}
+  async $beforeAgendaStart() {}
+  async $afterAgendaStart() {}
 }
```

Scheduling APIs keep the same shape (`now()`, `schedule()`, `every()`, `create()`), so call sites only need the
injected instance to be renamed:

```diff
 @Service()
 export class UsersService {
   @Inject()
-  private pulse: PulseModule;
+  private agenda: Agenda;

   async create(user: User) {
-    await this.pulse.now("email.sendWelcomeEmail", {user});
-    await this.pulse.schedule("in 2 hours", "email.sendFollowUpEmail", {user});
+    await this.agenda.now("email.sendWelcomeEmail", {user});
+    await this.agenda.schedule("in 2 hours", "email.sendFollowUpEmail", {user});
   }
 }
```

### AI migration note

Apply these deterministic rewrites when migrating a codebase with a coding agent:

```text
Migrate from @tsed/pulse to @tsed/agenda (Agenda v6):

Dependencies
- remove `@tsed/pulse` → add `@tsed/agenda`
- remove `@pulsecron/pulse` → add `agenda` + `@agendajs/mongo-backend`

Imports
- `import "@tsed/pulse"` → `import "@tsed/agenda"`
- `import {Pulse, JobsController, Every, Define, PulseModule, PulseService} from "@tsed/pulse"` → `import {JobsController, Every, Define} from "@tsed/agenda"`
- `import {Job} from "@pulsecron/pulse"` → `import {Job} from "agenda"`
- add `import {Agenda} from "agenda"` where `PulseModule` / `PulseService` was injected
- add `import {MongoBackend} from "@agendajs/mongo-backend"` in the server configuration file

Configuration (@Configuration / TsED.Configuration)
- `pulse: {...}` config key → `agenda: {...}`
- `pulse.db.address` → `agenda.backend: new MongoBackend({address})`
- `pulse.db.collection` / `pulse.db.options` → `agenda.backend: new MongoBackend({collection, options})`
- `pulse.mongo` → `agenda.backend: new MongoBackend({mongo})`
- `pulse.ensureIndex` / `pulse.sort` → move inside `new MongoBackend({ensureIndex, sort})`, sort directions use `"asc"` / `"desc"`
- `pulse.enabled`, `pulse.disableJobProcessing`, `pulse.drainJobsBeforeClose` → keep the same names under `agenda`
- `PulseSettings` type → `AgendaSettings`

Decorators and injection
- `@Pulse(...)` → `@JobsController(...)`
- `@JobsController(...)` (from `@tsed/pulse`) → `@JobsController(...)` (from `@tsed/agenda`)
- `@Every(...)` / `@Define(...)` → unchanged (import them from `@tsed/agenda`)
- `PulseModule` / `PulseService` injected type → `Agenda` (from `agenda`)
- `pulse.now(...)`, `pulse.schedule(...)`, `pulse.every(...)`, `pulse.create(...)`, `pulse.define(...)` → same methods on the injected `Agenda`
- `pulse.jobs(...)` → `agenda.queryJobs(...)`

Lifecycle hooks
- `$beforePulseStart()` → `$beforeAgendaStart()`
- `$afterPulseStart()` → `$afterAgendaStart()`
```

For more details about `@tsed/agenda`, see [Agenda for Ts.ED](https://tsed.dev/tutorials/agenda.html)
(LLM-friendly version: https://tsed.dev/tutorials/agenda.md).

## Legacy usage (existing projects only)

> [!WARNING]
> The following sections document the deprecated `@tsed/pulse` API. They are kept for reference only.
> Do not use them for new code.

### Configure your server

Import `@tsed/pulse` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/pulse"; // import pulse ts.ed module

const mongoConnectionString = "mongodb://127.0.0.1/pulse";

@Configuration({
  pulse: {
    enabled: true, // Enable Pulse jobs for this instance.
    // drainJobsBeforeClose: true, // Wait for jobs to finish before stopping the pulse process.
    // disableJobProcessing: true, // Prevents jobs from being processed.
    // pass any options that you would normally pass to new Pulse(), e.g.
    db: {
      address: mongoConnectionString
    }
  }
})
export class Server {}
```

### Create a new Service

Decorate the class with `@Pulse`. The `namespace` option is optional and will
prefix the job name with `namespace.`

Use the `@Every` decorator to define a cron-like job that gets automatically
scheduled based on the given interval. The name is optional and by default the
method name is used as job name.

Use the `@Define` decorator on methods that you would like to schedule
programmatically via the PulseService and Pulse instance access.

```ts
import {Pulse, Every, Define} from "@tsed/pulse";
import {Job} from "@pulsecron/pulse";

@Pulse({namespace: "email"})
export class EmailJobService {
  @Every("60 minutes", {
    name: "maintenanceJob"
    /* ... and any option you would normally pass to pulse.every/define */
  })
  async sendAdminStatistics(job: Job) {
    // implement something here
  }

  @Define({
    name: "sendWelcomeEmail"
    /*  ... and any option you would normally pass to pulse.define(...) */
  })
  async sendWelcomeEmail(job: Job) {
    // implement something here
  }

  @Define({name: "sendFollowUpEmail"})
  async sendFollowUpEmail(job: Job) {
    // implement something here
  }
}
```

### Define a job processor manually

PulseModule exposes methods to manually define a job processor. It can be useful to define a job processor when you need to fetch data beforehand and dynamically build job name / options.

```typescript
import {Pulse, PulseModule, Define} from "@tsed/pulse";

@Pulse({namespace: "email"})
export class EmailJobService {
  @Inject()
  pulse: PulseModule;

  @Inject()
  httpClient: HttpClient;

  cache: Map<string, Job[]> = new Map();

  @Define({
    name: "sendWelcomeEmail",
    concurrency: 3
    /*  ... and any option you would normally pass to pulse.define(...) */
  })
  async sendWelcomeEmail(job: Job) {
    // implement something here
    console.log(job.attrs.data.locale);
  }

  async $beforePulseStart() {
    const locales = await this.httpClient.get("/locales");

    this.cache.set(
      "sendWelcomeEmail",
      locales.map((locale) => {
        return this.pulse.create("sendWelcomeEmail", {locale});
      })
    );
  }

  async $afterPulseStart() {
    const jobs = this.cache.get("sendWelcomeEmail");

    await Promise.all(jobs.map((job) => job.repeatEvery("1 week").save()));
  }
}
```

### Inject Pulse

Inject the PulseService instance to interact with it directly, e.g. to schedule
a job manually.

```typescript
import {Service, Inject} from "@tsed/di";
import {PulseModule} from "@tsed/pulse";

@Service()
export class UsersService {
  @Inject()
  private pulse: PulseModule;

  async create(user: User): Promise<User> {
    // do something
    // ...
    // then schedule some jobs
    await this.pulse.now("email.sendWelcomeEmail", {user});
    await this.pulse.schedule("in 2 hours", "email.sendFollowUpEmail", {user});

    return user;
  }
}
```

## Contributors

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - Today Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
