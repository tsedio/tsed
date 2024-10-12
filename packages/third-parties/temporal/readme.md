<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
 
   <h1>Temporal</h1>
 
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

[Temporal](https://temporal.io) lets you write complex asynchronous distributed workflows using easy to read linear code. For more information about Temporal take a look at the documentation [here](https://docs.temporal.io/).

The `@tsed/temporal` module allows you to decorate classes with `@Temporal` and
corresponding methods with `@Activity` to write and start asynchronous workflows.

Inject the `TemporalClient` to start/schedule and query workflows or to send signals to them.

Use the `bootstrapWorker` helper to start a queue that executes your workflows and activities.

## Installation

To begin, install the Temporal module for Ts.ED:

```bash
npm install --save @tsed/temporal
npm install --save @temporalio/client @temporalio/worker
```

## Configure your server

Import `@tsed/temporal` in your Server:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/temporal"; // import temporal ts.ed module

@Configuration({
  temporal: {
    enabled: true,
    connection: {
      /* optional: see ConnectionOptions of @temporalio/client */
    },
    client: {
      /* optional: see ClientOptions of @temporalio/client */
    }
  }
})
export class Server {}
```

## Create a new Service

Decorate the class with `@Temporal`.

Use the `@Activity` decorator to define activities.

```typescript
import {Temporal, Activity} from "@tsed/temporal";

@Temporal()
export class UserOnboardingActivities {
  constructor(
    private userService: UserService,
    private emailService: EmailService
  ) {}

  @Activity()
  async sendVerificationEmail(email: string) {
    return this.emailService.sendVerificationEmail(email);
  }

  @Activity()
  async activateUser(email: string) {
    return this.userService.activateUser(email);
  }

  @Activity()
  async sendWelcomeEmail(email: string) {
    return this.emailService.sendWelcomeEmail(email);
  }

  @Activity()
  async sendFollowUpEmail(email: string) {
    return this.emailService.sendFollowUpEmail(email);
  }

  @Activity()
  async deleteUser(email: string) {
    return this.userService.deleteUser(email);
  }
}
```

Optional, create an interface for your activities to use it later for your [workflows](https://docs.temporal.io/workflows).

```ts
interface IUserOnboardingActivities {
  sendVerificationEmail(email: string): Promise<void>;
  activateUser(email: string): Promise<void>;
  sendWelcomeEmail(email: string): Promise<void>;
  sendFollowUpEmail(email: string): Promise<void>;
  deleteUser(email: string): Promise<void>;
}

export type Activities = IGreetingActivity;
```

### Write Workflows

Workflows are regular functions that cannot interact directly with Ts.ED or other packages. Just the earlier created interface is used for type-safety.

::: warning
Do not import any non temporal packages here. The workflows are bundled internally by the worker and won't have access to anything else.
:::

```ts
import {proxyActivities, defineSignal, setHandler, condition, sleep} from "@temporalio/workflow";
import {Activities} from "../activities.js";

export const isVerifiedSignal = defineSignal("verificationSignal");

export async function onboardUser(email: string): Promise<string> {
  const {sendVerificationEmail, activateUser, sendWelcomeEmail, sendFollowUpEmail, deleteUser} = proxyActivities<Activities>({
    startToCloseTimeout: "1 minute"
  });

  let isVerified = false;
  setHandler(isVerifiedSignal, () => {
    isVerified = true;
  });

  // 1. Send verification email
  await sendVerificationEmail(email);

  // 2. Wait for verification ...
  const verifiedInTime = await condition(() => isVerified, "1w" /* or for a timeout */);
  if (!verifiedInTime) {
    // 3a. If not verified in time, delete user
    await deleteUserAndTenant(email);
    return false;
  }

  // 3b. If verified in time, send welcome email
  await sendWelcomeEmail(email);

  // 4. Send follow up email after one day
  await sleep("1d"); // special sleep function by temporal
  await sendFollowUpEmail(email);
}
```

## Inject TemporalClient

Inject the TemporalClient instance to interact with it directly, e.g. to start a workflow.

```typescript
import {Service} from "@tsed/di";
import {TemporalClient} from "@tsed/temporal";
import {onboardUser} from "../workflows.js";

@Service()
export class UsersService {
  @Inject()
  private temporalClient: TemporalClient;

  async create(user: User): Promise<User> {
    // ...
    await this.temporalClient.workflow.start(onboardUser, {
      args: [user.email],
      taskQueue: "onboarding",
      workflowId: `onboarding-${user.id}`
    });
  }
}
```

### Start a worker

The workflows and activities won't get executed until you start a worker. This module provides a helper function to bootstrap a worker based on your Ts.ED server class that is aware of all your activities.

The most tricky part is the `workflowsPath` parameter. This is the path of the file/folder where the workflows are exported. The file is automatically loaded when the worker is started and internally bundled with webpack. The path is highly dependent on your project structure and build process.

Read more about it [here](https://docs.temporal.io/typescript/troubleshooting/#webpack-errors).

```ts
import {bootstrapWorker} from "@tsed/temporal";
import {Server} from "./app/Server.js";

const worker = await bootstrapWorker(Server, {
  worker: {
    taskQueue: "onboarding",
    workflowsPath: require.resolve("./temporal") // other example: path.join(process.cwd(), 'dist/apps/api/temporal/index.ts');
  },
  connection: {
    /* optional: see NativeConnectionOptions of @temporalio/worker */
  },
  platform: {
    /* optional: see PlatformBuilderSettings of @tsed/platform-http */
    componentsScan: false,
    logger: {
      level: "info"
    }
  }
});
await worker.run();
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
