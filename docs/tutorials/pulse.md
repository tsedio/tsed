---
description: "@tsed/pulse is deprecated. Migrate from Pulse to @tsed/agenda with Agenda v6 in your Express/Koa TypeScript Ts.ED application."
head:
  - - meta
    - name: description
      content: "@tsed/pulse is deprecated. Migrate from Pulse to @tsed/agenda with Agenda v6 in your Express/Koa TypeScript Ts.ED application. Pulse is a fork of Agenda, a light-weight job scheduling library for Node.js"
  - - meta
    - name: keywords
      content: ts.ed express typescript agenda node.js javascript decorators pulse pulse-cron pulsecron job-scheduling cron background-jobs deprecated migration
---

# Pulse

<Banner src="/pulse.png" href="https://github.com/pulsecron/pulse" height="200" />

::: danger Deprecated
`@tsed/pulse` is deprecated and will be removed in a future major release. This package won't receive any future updates.
**Do not start new projects on `@tsed/pulse`.**

For new projects, use [`@tsed/agenda`](/tutorials/agenda) with Agenda v6.
Existing `@tsed/pulse` users should plan a migration to `@tsed/agenda` + `agenda` + `@agendajs/mongo-backend`
by following the [migration guide](#migrate-to-tsed-agenda) below.

The legacy Pulse examples at the end of this page are kept only to help existing consumers maintain or migrate old code.
:::

## Feature

`@pulsecron/pulse` is a fork of Agenda. `@tsed/pulse` allowed you to decorate classes with `@Pulse` and
corresponding methods to have them picked up by the `@pulsecron/pulse` library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the PulseService.

The same features are available in `@tsed/agenda` on top of Agenda v6, which is the recommended and maintained
scheduling integration for Ts.ED. See the [Agenda documentation](/tutorials/agenda).

## Installation

Do not install `@tsed/pulse` for new projects. Install the recommended Agenda v6 stack instead:

::: code-group

```sh [npm]
npm install --save @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [yarn]
yarn add @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [pnpm]
pnpm add @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [bun]
bun add @tsed/agenda agenda @agendajs/mongo-backend
```

:::

Then follow the [Agenda documentation](/tutorials/agenda) to configure your server.

:::: details Legacy installation (existing projects that cannot migrate yet)

::: code-group

```sh [npm]
npm install --save @tsed/pulse @pulsecron/pulse
```

```sh [yarn]
yarn add @tsed/pulse @pulsecron/pulse
```

```sh [pnpm]
pnpm add @tsed/pulse @pulsecron/pulse
```

```sh [bun]
bun add @tsed/pulse @pulsecron/pulse
```

:::

::::

## Migrate to `@tsed/agenda`

The target stack is `@tsed/agenda` + `agenda` (v6) + `@agendajs/mongo-backend`.

### 1. Replace dependencies

| Remove             | Add                       |
| ------------------ | ------------------------- |
| `@tsed/pulse`      | `@tsed/agenda`            |
| `@pulsecron/pulse` | `agenda`                  |
|                    | `@agendajs/mongo-backend` |

::: code-group

```sh [npm]
npm uninstall @tsed/pulse @pulsecron/pulse
npm install --save @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [yarn]
yarn remove @tsed/pulse @pulsecron/pulse
yarn add @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [pnpm]
pnpm remove @tsed/pulse @pulsecron/pulse
pnpm add @tsed/agenda agenda @agendajs/mongo-backend
```

```sh [bun]
bun remove @tsed/pulse @pulsecron/pulse
bun add @tsed/agenda agenda @agendajs/mongo-backend
```

:::

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

For more details about `@tsed/agenda`, see [Agenda for Ts.ED](/tutorials/agenda)
(LLM-friendly version: [tsed.dev/tutorials/agenda.md](https://tsed.dev/tutorials/agenda.md)).

## Legacy usage (existing projects only)

::: warning
The following sections document the deprecated `@tsed/pulse` API. They are kept for reference only.
Do not use them for new code.
:::

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

## Authors

<GithubContributors :users="['ochrstn', 'xCryzed', 'IvaDey']"/>

## Maintainers

<GithubContributors :users="['ochrstn', 'Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
