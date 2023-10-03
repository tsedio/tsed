---
meta:
  - name: description
    content: Use Temporal.io with Express/Koa, TypeScript and Ts.ED. Temporal is an open source durable execution system. Write code that’s fault tolerant, durable, and simple.
  - name: keywords
    content: ts.ed express typescript temporal temporal.io node.js javascript decorators
---

# Temporal

<Banner src="/temporal.svg" href="https://temporal.io/" height="38" />

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
import {Configuration} from "@tsed/common";
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
import {Temporal, Activity} from "@tsed/agenda";

@Temporal()
export class UserOnboardingActivities {
  constructor(private userService: UserService, private emailService: EmailService) {}

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
import {Activities} from "../activities";

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
import {Service, AfterRoutesInit} from "@tsed/common";
import {TemporalClient} from "@tsed/temporal";
import {onboardUser} from "../workflows";

@Service()
export class UsersService implements AfterRoutesInit {
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
import {Server} from "./app/Server";

const worker = await bootstrapWorker(Server, {
  worker: {
    taskQueue: "onboarding",
    workflowsPath: require.resolve("./temporal") // other example: path.join(process.cwd(), 'dist/apps/api/temporal/index.ts');
  },
  connection: {
    /* optional: see NativeConnectionOptions of @temporalio/worker */
  },
  platform: {
    /* optional: see PlatformBuilderSettings of @tsed/common */
    componentsScan: false,
    logger: {
      level: "info"
    }
  }
});
await worker.run();
```

## Authors

<GithubContributors :users="['ochrstn']"/>

## Maintainers

<GithubContributors :users="['ochrstn']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
