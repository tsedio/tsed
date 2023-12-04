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

The [BullMQ](https://bullmq.io) Module for Ts.ED allows you to decorate a class using the `@JobController` decorator and implement the `JobMethods` interface provided by the module.
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

## Defining a custom job id within a job

The `JobMethods` interface has an optional method `jobId`, which when implemented instructs the dispatcher to use it when defining the id for the job.

The method will accept the payload of the job and because it is defined within the job class will also have access to all injected services.

```ts
import {JobController, JobMethods} from "@tsed/bullmq";

@JobController("example-with-custom-id")
class ExampleJobWithCustomId implements JobMethods {
  public handle(payload: {num: number}) {
    console.info("look at my awesome number: ", payload.num);
  }
  
  public jobId(payload: {num: number}): string {
    return `very realistic job id #${payload.num}`;
  }
}
```

Keep in mind tho, that when defining a job using the dispatcher when dispatching the job, the id defined using the dispatcher will take precedence!

```ts
this.dispatcher(ExampleJobWithCustomId, { num: 1 }); // id: 'very realistic job id #1'
this.dispatcher(ExampleJobWithCustomId, { num: 2 }, { jobId: 'I do my own thing!' }) // id: 'I do my own thing!'
```

## Defining a repeating job

Jobs that should be run regularly on a schedule can also easily defined using the `@JobController` decorator.
Doing so will automatically dispatch it without any data.

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
import {Configuration} from "@tsed/common";
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
import {Configuration} from "@tsed/common";
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

In addition to statically defined job options when declaring the job, custom job options can also be set when dispatching the job.
This allows to for example delay the job from when it has originally been dispatched.

```ts
import {Service} from "@tsed/di";
import {JobDispatcher} from "@tsed/bullmq";
import {ExampleJob} from "./jobs/ExampleJob";

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
import {ExampleJob} from "./jobs/ExampleJob";

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

## Authors

<GithubContributors :users="['abenerd']"/>

## Maintainers

<GithubContributors :users="['abenerd', 'EinfachHans']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
