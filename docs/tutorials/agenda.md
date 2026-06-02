---
head:
  - - meta
    - name: description
      content: Use Agenda with Express/Koa, TypeScript and Ts.ED. Agenda, a light-weight job scheduling library for Node.js
  - - meta
    - name: keywords
      content: ts.ed express typescript agenda node.js javascript decorators
---

# Agenda

<Banner src="/agenda.svg" href="https://github.com/agenda/agenda" height="200" />

## Feature

Currently, `@tsed/agenda` allows you to decorate classes with `@JobsController` and
corresponding methods to have them picked up by the Agenda library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the AgendaService.

For more information about Agenda look at the documentation [here](https://github.com/agenda/agenda);

## Installation

To begin, install the Agenda module for Ts.ED:

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

`@tsed/agenda` now uses Agenda v6.

- `agenda.backend` is required
- legacy top-level `db`, `mongo`, and `repository` config are no longer supported
- `ensureIndex` and `sort` belong to `MongoBackend`
- sort directions use `"asc"` / `"desc"`
- `@Agenda()` has been removed in favor of `@JobsController()`
- `AgendaModule` has been removed; inject `Agenda` from `agenda`

```diff
 import {Configuration} from "@tsed/di";
 import "@tsed/agenda";
+import {MongoBackend} from "@agendajs/mongo-backend";

 @Configuration({
   agenda: {
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

Apply these deterministic rewrites when migrating code:

- `import "@tsed/agenda"` stays unchanged
- add `import {MongoBackend} from "@agendajs/mongo-backend"`
- `agenda.db` → `agenda.backend: new MongoBackend(...)`
- top-level `agenda.mongo` → `agenda.backend: new MongoBackend({mongo: ...})`
- top-level `agenda.ensureIndex` / `agenda.sort` → move inside `new MongoBackend(...)`
- `agenda.jobs(...)` → `agenda.queryJobs(...)`
- `agenda.define(name, options, processor)` → `agenda.define(name, processor, options)`
- `@Agenda(...)` → `@JobsController(...)`
- `AgendaModule` → `Agenda` from `agenda`

## Configure your server

Import `@tsed/agenda` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/agenda"; // import agenda ts.ed module
import {MongoBackend} from "@agendajs/mongo-backend";

const mongoConnectionString = "mongodb://127.0.0.1/agenda";

@Configuration({
  agenda: {
    enabled: true, // Enable Agenda jobs for this instance.
    // drainJobsBeforeClose: true, // Wait for jobs to finish before stopping the agenda process.
    // disableJobProcessing: true, // Prevents jobs from being processed.
    backend: new MongoBackend({
      address: mongoConnectionString,
      ensureIndex: true,
      sort: {
        nextRunAt: "asc",
        priority: "desc"
      }
    })
  }
})
export class Server {}
```

## Create a new Service

Decorate the class with `@JobsController`. The `namespace` option is optional and will
prefix the job name with `namespace.`

Use the `@Every` decorator to define a cron-like job that gets automatically
scheduled based on the given interval. The name is optional and by default the
method name is used as job name.

Use the `@Define` decorator on methods that you would like to schedule
programmatically via the AgendaService and Agenda instance access.

```ts
import {JobsController, Every, Define} from "@tsed/agenda";
import {Job} from "agenda";

@JobsController({namespace: "email"})
export class EmailJobService {
  @Every("60 minutes", {
    name: "maintenanceJob"
    /* ... and any option you would normally pass to agenda.every/define */
  })
  async sendAdminStatistics(job: Job) {
    // implement something here
  }

  @Define({
    name: "sendWelcomeEmail"
    /*  ... and any option you would normally pass to agenda.define(...) */
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

Inject `Agenda` from `agenda` to manually define a job processor. It can be useful when you need to fetch data beforehand and dynamically build job name / options.

```typescript
import {Define, JobsController} from "@tsed/agenda";
import {Agenda} from "agenda";

@JobsController({namespace: "email"})
export class EmailJobService {
  @Inject()
  agenda: Agenda;

  @Inject()
  httpClient: HttpClient;

  cache: Map<string, Job[]> = new Map();

  @Define({
    name: "sendWelcomeEmail",
    concurrency: 3
    /*  ... and any option you would normally pass to agenda.define(...) */
  })
  async sendWelcomeEmail(job: Job) {
    // implement something here
    console.log(job.attrs.data.locale);
  }

  async $beforeAgendaStart() {
    const locales = await this.httpClient.get("/locales");

    this.cache.set(
      "sendWelcomeEmail",
      locales.map((locale) => {
        return this.agenda.create("email.sendWelcomeEmail", {locale});
      })
    );
  }

  async $afterAgendaStart() {
    const jobs = this.cache.get("sendWelcomeEmail");

    await Promise.all(jobs.map((job) => job.repeatEvery("1 week").save()));
  }
}
```

## Inject Agenda

Inject the AgendaService instance to interact with it directly, e.g. to schedule
a job manually.

```typescript
import {Service} from "@tsed/di";
import {Agenda} from "agenda";

@Service()
export class UsersService {
  @Inject()
  private agenda: Agenda;

  async create(user: User): Promise<User> {
    // do something
    // ...
    // then schedule some jobs
    await this.agenda.now("email.sendWelcomeEmail", {user});
    await this.agenda.schedule("in 2 hours", "email.sendFollowUpEmail", {user});

    return user;
  }
}
```

## Using Agendash

[Agendash](https://github.com/agenda/agendash) provides a job overview dashboard that makes it easy to manage, create and
schedule your jobs.

::: tip Note
This is an optional feature and is not required to use agenda.
:::

Install the additional dependency.

```shell
npm install --save agendash agenda @agendajs/mongo-backend
```

Afterward create the module `agendash.module.ts` in src/modules so that the dashboard can be exposed using middleware.

```typescript
import {AfterRoutesInit, PlatformApplication} from "@tsed/platform-http";
import {Inject, Configuration, Module} from "@tsed/di";
import {Agenda} from "agenda";
import {expressMiddleware} from "agendash";

@Module()
export class AgendashModule implements AfterRoutesInit {
  @Configuration()
  config: Configuration;

  @Inject()
  agenda: Agenda;

  @Inject()
  app: PlatformApplication;

  $afterRoutesInit() {
    if (this.config.agenda?.enabled) {
      this.app.use("/agendash", expressMiddleware(this.agenda));
    }
  }
}
```

## Authors

<GithubContributors :users="['ochrstn', 'xCryzed']"/>

## Maintainers

<GithubContributors :users="['ochrstn', 'Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
