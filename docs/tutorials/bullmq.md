---
meta:
  - name: description
    content: Easy to use BullMQ integration for Ts.ED
  - name: keywords
    content: ts.ed typescript node.js javascript decorators bullmq
---

# BullMQ

<Banner src="/bullmq.png" href="https://github.com/taskforcesh/bullmq" height="200" />

## Feature

The [BullMQ](https://bullmq.io) Module for Ts.ED allows you to decorate a class using the `@AsJob` decorator and implement the `Job` interface provided by the module.
Repeatable Jobs can also be defined using this decorator.

For more information about BullMQ look at the documentation [here](https://docs.bullmq.io/);

## Installation

To begin, install the BullMQ module for Ts.ED:

```bash
npm install @tsed/bullmq bullmq
```

## Configure the Server

Import the `@tsed/bullmq` module in your server

```ts
import {Configuration} from "@tsed/common";
import "@tsed/bullmq"; // import bullmq ts.ed module

@Configuration({
  bullmq: {
    queues: ["default", "special"];
    connection: {
      // redisio connection options
    };
    // optional default job options
    defaultJobOptions: {};
    disableWorker: false;
    // optionally specify for which queues to start a worker for
    // in case not all queues should be worked on
    workerQueues: ["default"];
  }
})
export class Server {}
```

## Define a Job

A job is defined as a class decorated with the `@AsJob` decorator and implementing the `Job` interface of the `@tsed/bullmq` package

```ts
import {AsJob, Job} from "@tsed/bullmq";

@AsJob("example")
class ExampleJob implements Job {
  public handle(payload: {msg: string}) {
    console.info("New message incoming", payload.msg);
  }
}
```

You can also specify a non default queue as the second argument in the decorator and add any other job specific options as a third argument

```ts
import {AsJob, Job} from "@tsed/bullmq";

@AsJob("other-example", "other-queue", {
  attempts: 42
})
class OtherExampleJob implements Job {
  public handle(payload: {num: number}) {
    console.info("look at my awesome number: ", payload.num);
  }
}
```

## Defining a repeating job

Jobs that should be run regularly on a schedule can also easily defined using the `@AsJob` decorator

```ts
import {AsJob, Job} from "@tsed/bullmq";

@AsJob("my-cron-job", "default", {
  repeat: {
    pattern: "* * * * *"
  }
})
class MyCronJob implements Job {
  public handle() {
    console.info("I run every minute!");
  }
}
```

To register the job you now have to import it in the server so they can be detected.

```ts
import {Configuration} from "@tsed/common";
import "@tsed/bullmq"; // import bullmq ts.ed module

import "./jobs/MyCronJob";

@Configuration()
// server configuration
export class Server {}
```

## Dispatching jobs

Dispatching jobs is done via the `JobDispatcher` service that takes the job to be dispatched and its payload.

```ts
import {Service} from "@tsed/di";
import {JobDispatcher} from "@tsed/bullmq";
import {ExampleJob} from "./jobs/ExampleJob";

@Service()
class MyService {
  constructor(private readonly dispatcher: JobDispatcher) {}

  public async doingSomething() {
    await this.dispatcher.dispatch(ExampleJob, {msg: "this message is part of the payload for the job"});

    console.info("I just dispatched a job!");
  }
}
```

## Authors

<GithubContributors :users="['abenerd']"/>

## Maintainers

<GithubContributors :users="['abenerd']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
