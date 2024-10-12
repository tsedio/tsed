<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
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
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.io

## Feature

`@pulsecron/pulse` is maintained fork of the Agenda.

Currently, `@tsed/pulse` allows you to decorate classes with `@Pulse` and
corresponding methods to have them picked up by the @pulsecron/pulse library to be
scheduled automatically (`@Every`) or programmatically (`@Define`) via the PulseService.

For more information about Pulse look at the documentation [here](https://github.com/pulsecron/pulse);

## Installation

To begin, install the Pulse module for Ts.ED:

```bash
npm install --save @tsed/pulse
npm install --save @pulsecron/pulse
```

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

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2021 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
