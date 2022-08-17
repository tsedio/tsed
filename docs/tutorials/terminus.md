---
meta:

- name: description
  content: Use Terminus with Express, TypeScript and Ts.ED. Adds graceful shutdown and Kubernetes readiness / liveliness
  checks for any HTTP applications.
- name: keywords
  content: ts.ed express typescript terminus node.js javascript decorators

---

# Terminus

Terminus is a package to adds graceful shutdown and Kubernetes readiness / liveliness checks for any HTTP applications.
This tutorial
will show you how to install and use Terminus with Ts.ED.

## Installation

Before using terminus, we need to install the [terminus](https://www.npmjs.com/package/@godaddy/terminus) module.

```bash
npm install --save @godaddy/terminus @tsed/terminus
```

Then import `@tsed/terminus` and add the following configuration in your `Server.ts`:

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/terminus"; // import terminus Ts.ED module
import {resolve} from "path";

@Configuration({
  terminus: {
    path: "/health"
    // ... see configuration
  }
})
export class Server {}
```

  </Tab>
</Tabs>

### Options

`terminus` configuration options waiting the same option description in the official Terminus
documentation [here](https://github.com/godaddy/terminus).
The following the options are managed by the `@tsed/terminus` package:

- healthChecks
- onSignal
- onSendFailureDuringShutdown
- onShutdown
- beforeShutdown
- onSigterm

```typescript
export type TerminusSettings = Omit<
  TerminusOptions,
  "healthChecks" | "onSignal" | "onSendFailureDuringShutdown" | "onShutdown" | "beforeShutdown" | "onSigterm"
>;
```

## Usage

### Readiness / liveliness checks

To create a readiness / liveliness checks use the `@Health` decorator.

```ts
import {Health} from "@tsed/terminus";
import {Injectable, Inject} from "@tsed/di";

@Injectable()
class MongoCtrl {
  @Health("mongo")
  async check() {
    // Here check the mongo health
    return "ok";
  }
}
```

You can also create an `HealthCheckError` when an error appear during your check.

```ts
import {Health} from "@tsed/terminus";
import {Injectable, Inject} from "@tsed/di";
import {HealthCheckError} from "@godaddy/terminus";
import {REDIS_CONNECTION} from "./RedisConnection";

@Injectable()
class RedisClient {
  @Inject(REDIS_CONNECTION)
  protected redisConnection: REDIS_CONNECTION;

  @Health("redis")
  async check() {
    if (this.redisConnection.status === "ready") {
      return "ok";
    }

    // Here check the redis health
    throw new HealthCheckError("failed", {
      redis: this.redisConnection.status
    });
  }
}
```

Expected result when calling the "/health":

```json
{
  "status": "ok",
  "info": [
    {
      "mongo": "ok"
    },
    {
      "redis": "ok"
    }
  ],
  "details": [
    {
      "mongo": "ok"
    },
    {
      "redis": "ok"
    }
  ]
}
```

### Graceful shutdown

`@tsed/terminus` package give some decorators to handle Terminus hooks. These hooks allow you to adds graceful shutdown.
Here is the list of decorators:

- `$beforeShutdown`: Use this hook if you deploy your application with Kubernetes (see more
  details [here](https://github.com/godaddy/terminus#how-to-set-terminus-up-with-kubernetes)),
- `$onSignal`: cleanup hook, returning a promise (used to be onSigterm),
- `$onShutdown`: called right before exiting,
- `$onSendFailureDuringShutdown`: called before sending each 503 during shutdowns.

**Example:**

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
class RedisCtrl {
  $beforeShutdown() {
    console.log("called before shutdown");
  }

  $onSignal() {
    console.log("called on signal");
  }

  $onShutdown() {
    console.log("called on shutdown");
  }

  $onSendFailureDuringShutdown() {
    console.log("on send failure during shutdown");
  }
}
```

## Author

<GithubContributors users="['EmilienLeroy']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
