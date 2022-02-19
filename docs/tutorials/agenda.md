---
meta:
  - name: description
    content: Use Agenda with Express/Koa, TypeScript and Ts.ED. Agenda, a light-weight job scheduling library for Node.js
  - name: keywords
    content: ts.ed express typescript agenda node.js javascript decorators
---

# Agenda

<Banner src="/agenda.svg" href="https://github.com/agenda/agenda" height="200" />

## Feature

Currently, `@tsed/agenda` allows you to decorate classes with `@Agenda` and
corresponding methods to have them picked up by the Agenda library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the AgendaService.

For more information about Agenda look at the documentation [here](https://github.com/agenda/agenda);

## Installation

To begin, install the Agenda module for Ts.ED:

```bash
npm install --save @tsed/agenda
npm install --save agenda
```

## Configure your server

Import `@tsed/agenda` in your Server:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/agenda"; // import agenda ts.ed module

const mongoConnectionString = "mongodb://127.0.0.1/agenda";

@Configuration({
  agenda: {
    enabled: true, // Enable Agenda jobs for this instance.
    // pass any options that you would normally pass to new Agenda(), e.g.
    db: {
      address: mongoConnectionString
    }
  }
})
export class Server {}
```

## Create a new Service

Decorate the class with `@Agenda`. The `namespace` option is optional and will
prefix the job name with `namespace.`

Use the `@Every` decorator to define a cron-like job that gets automatically
scheduled based on the given interval. The name is optional and by default the
method name is used as job name.

Use the `@Define` decorator on methods that you would like to schedule
programmatically via the AgendaService and Agenda instance access.

```typescript
import {Agenda, Every, Define} from "@tsed/agenda";
import {Job} from "agenda";

@Agenda({ namespace: "email" })
export class EmailJobService {
  @Every("60 minutes", {
    name: "maintenanceJob",
    /* ... and any option you would normally pass to agenda.every/define */ }
  })
  async sendAdminStatistics(job: Job) {
    // implement something here
  }

  @Define({
    name: "sendWelcomeEmail",
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

## Inject Agenda

Inject the AgendaService instance to interact with it directly, e.g. to schedule
a job manually.

```typescript
import {Service, AfterRoutesInit} from "@tsed/common";
import {AgendaService} from "@tsed/agenda";

@Service()
export class UsersService implements AfterRoutesInit {
  @Inject()
  private agenda: AgendaService;

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
npm install --save agendash
```

Afterwards create the module `agendash.module.ts` in src/modules so that the dashboard can be exposed using middleware.

```typescript
import {AfterRoutesInit, Inject, PlatformApplication} from "@tsed/common";
import {Configuration, Module} from "@tsed/di";
import {Agenda} from "agenda";

const Agendash = require("agendash");

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
      this.app.use("/agendash", Agendash(this.agenda));
    }
  }
}
```

## Authors

<GithubContributors :users="['ochrstn', 'xCryzed']"/>

## Maintainers

<GithubContributors :users="['ochrstn']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
