<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>BullMQ</h1>

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

The `@tsed/bullmq` package allows you to define jobs using the `@JobController` decorator and the `JobMethods` interface and have them picked up by the `BullMQ` worker.

## Installation

To begin, install the `BullMQ` module and `BullMQ` itself.

```bash
npm install @tsed/bullmq bullmq
```

## Configure the Server

Import the `@tsed/bullmq` module in your server

```ts
import {Configuration} from "@tsed/di";
import "@tsed/bullmq"; // import bullmq ts.ed module

@Configuration({
  bullmq: {
    // Specify queue name's to create
    queues: ["default", "special"],
    connection: {
      // redisio connection options
    },
    defaultQueueOptions: {
      // Default queue options which are applied to every queue
      // Can be extended/overridden by `queueOptions`
    },
    queueOptions: {
      special: {
        // Specify additional queue options by queue name
      }
    },
    // Disable the creation of any worker.
    // All other worker configuration will be ignored
    disableWorker: true,
    // Specify for which queues to start a worker for.
    // When undefined falls back to all queues specified.
    workerQueues: ["default"],
    defaultWorkerOptions: {
      // Default worker options which are applied to every worker
      // Can be extended/overridden by `workerOptions`
    },
    workerOptions: {
      special: {
        // Specify additional worker options by queue name
      }
    }
  }
})
export class Server {}
```

## Define a Job

A job is defined as a class decorated with the `@JobController` decorator and implementing the `JobMethods` interface of the `@tsed/bullmq` package

```ts
import {JobController, JobMethods} from "@tsed/bullmq";

@JobController("example")
class ExampleJob implements JobMethods {
  public handle(payload: {msg: string}) {
    console.info("New message incoming", payload.msg);
  }
}
```

You can also specify a non default queue as the second argument in the decorator and add any other job specific options as a third argument

```ts
import {JobController, JobMethods} from "@tsed/bullmq";

@JobController("other-example", "other-queue", {
  attempts: 42
})
class OtherExampleJob implements JobMethods {
  public handle(payload: {num: number}) {
    console.info("look at my awesome number: ", payload.num);
  }
}
```

## Defining a repeating job

Jobs that should be run regularly on a schedule can also easily defined using the `@JobController` decorator.
Doing so will automatically dispatch it without any data

```ts
import {JobController, JobMethods} from "@tsed/bullmq";

@JobController("my-cron-job", "default", {
  repeat: {
    pattern: "* * * * *"
  }
})
class MyCronJob implements JobMethods {
  public handle() {
    console.info("I run every minute!");
  }
}
```

To register the job you now have to import it in the server so they can be detected.

```ts
import {Configuration} from "@tsed/di";
import "@tsed/bullmq"; // import bullmq ts.ed module

import "./jobs/MyCronJob";

@Configuration()
// server configuration
export class Server {}
```

## Defining a fallback job

Because the `@JobController` requires a name, you can not use it in case you have dynamic job names.
For this use case there is a `@FallbackJobController`, which allows you to define a fallback method globally or per queue:

```ts
import {FallbackJobController, JobMethods} from "@tsed/bullmq";

@FallbackJobController("foo")
class FooFallbackController implements JobMethods {
  public handle() {
    console.info(`I run for every job within the "foo" queue, which doesn't has it's own JobController`);
  }
}

@FallbackJobController()
class GlobalFallbackController implements JobMethods {
  public handle() {
    console.info(`I run for every job in every other queue, which doesn't has it's own JobController`);
  }
}
```

You also have to register the fallback job in the server:

```ts
import {Configuration} from "@tsed/di";
import "@tsed/bullmq"; // import bullmq ts.ed module

import "./jobs/MyFallbackJobs";

@Configuration()
// server configuration
export class Server {}
```

## Dispatching jobs

Dispatching jobs is done via the `JobDispatcher` service that takes the job to be dispatched and its payload.

```ts
import {Service} from "@tsed/di";
import {JobDispatcher} from "@tsed/bullmq";
import {ExampleJob} from "./jobs/ExampleJob.js";

@Service()
class MyService {
  constructor(private readonly dispatcher: JobDispatcher) {}

  public async doingSomething() {
    await this.dispatcher.dispatch(ExampleJob, {msg: "this message is part of the payload for the job"});

    console.info("I just dispatched a job!");
  }
}
```

In addition to statically defined job options when declaring the job, custom job options can also be set when dispatching the job.
This allows to for example delay the job from when it has originally been dispatched.

```ts
import {Service} from "@tsed/di";
import {JobDispatcher} from "@tsed/bullmq";
import {ExampleJob} from "./jobs/ExampleJob.js";

@Service()
class MyService {
  constructor(private readonly dispatcher: JobDispatcher) {}

  public async doingSomething() {
    await this.dispatcher.dispatch(
      ExampleJob,
      {msg: "this message is part of the payload for the job"},
      {
        delay: 600_000 // 10 minutes in milliseconds
      }
    );

    console.info("I just dispatched a job!");
  }
}
```

In case you want to be more flexible, you can also dispatch a job via a name or a queue/name combination.

**Note**: This normally only make sense when you have a [Fallback Job](#defining-a-fallback-job) configured.

```ts
import {Service} from "@tsed/di";
import {JobDispatcher} from "@tsed/bullmq";
import {ExampleJob} from "./jobs/ExampleJob.js";

@Service()
class MyService {
  constructor(private readonly dispatcher: JobDispatcher) {}

  public async doingSomething() {
    // When passing only a name, the job will be dispatched in a queue named "default"
    await this.dispatcher.dispatch("some-name", {msg: "this message is part of the payload for the job"});

    // You can also specifiy which queue to use
    await this.dispatcher.dispatch({queue: "some-queue", name: "some-name"}, {msg: "this message is part of the payload for the job"});
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
