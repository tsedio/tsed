---
head:
  - - meta
    - name: description
      content: Use Pulse cron with Express/Koa, TypeScript and Ts.ED. Pulse is a maintained for of Agenda, a light-weight job scheduling library for Node.js
  - - meta
    - name: keywords
      content: ts.ed express typescript agenda node.js javascript decorators pulse pulse-cron pulsecron job-scheduling cron background-jobs
---

# Pulse

> [!WARNING] > `@tsed/pulse` is deprecated.
> For new projects, use `@tsed/agenda` with Agenda v6.
> Existing consumers should migrate to `@tsed/agenda` + `agenda` + `@agendajs/mongo-backend`.
>
> The legacy Pulse examples below are kept only to help existing consumers migrate old code.

<Banner src="/pulse.png" href="https://github.com/pulsecron/pulse" height="200" />

## Feature

`@pulsecron/pulse` is maintained fork of the Agenda.

Currently, `@tsed/pulse` allows you to decorate classes with `@Pulse` and
corresponding methods to have them picked up by the @pulsecron/pulse library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the PulseService.

For more information about Pulse look at the documentation [here](https://github.com/pulsecron/pulse);

## Installation

To begin, install the Pulse module for Ts.ED:

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

## Migration note

Migrate from `@tsed/pulse` to `@tsed/agenda` on top of Agenda v6.

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

### AI migration note

Apply these deterministic rewrites:

- `import "@tsed/pulse"` → `import "@tsed/agenda"`
- `@Pulse(...)` → `@JobsController(...)`
- `PulseModule` → `AgendaModule`
- `pulse` config key → `agenda`
- `@pulsecron/pulse` dependency → `agenda` + `@agendajs/mongo-backend`

## Configure your server

Import `@tsed/pulse` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/pulse"; // import pulse ts.ed module

const mongoConnectionString = "mongodb://127.0.0.1/pulse";

@Configuration({
  pulse: {
    enabled: true, // Enable Pulse jobs for this instance.
    // drainJobsBeforeStop: true, // Wait for jobs to finish before stopping the pulse process.
    // disableJobProcessing: true, // Prevents jobs from being processed.
    // pass any options that you would normally pass to new Pulse(), e.g.
    db: {
      address: mongoConnectionString
    }
  }
})
export class Server {}
```

## Create a new Service

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

## Define a job processor manually

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

## Inject Pulse

Inject the PulseService instance to interact with it directly, e.g. to schedule
a job manually.

```typescript
import {Service} from "@tsed/di";
import {AfterRoutesInit} from "@tsed/platform-params";
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
