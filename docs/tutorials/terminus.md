---
meta:
  - name: description
    content: Use Terminus with Express, TypeScript and Ts.ED. Adds graceful shutdown and Kubernetes readiness / liveness checks for any HTTP applications.
  - name: keywords
    content: ts.ed express typescript terminus node.js javascript decorators
---

# Terminus

Terminus is a package to adds graceful shutdown and Kubernetes readiness / liveness checks for any HTTP applications. This tutorial
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
const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  terminus: {
    // ... see configuration
  }
})
export class Server {}
```

  </Tab>
</Tabs>

### Options

`terminus` configuration options waiting the same option description in the official Terminus documentation [here](https://github.com/godaddy/terminus).
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

### Readiness / liveness checks

To create a readiness / liveness checks use the `@Health` decorator.

```ts
import {Health} from "@tsed/terminus";

@Controller("/mongo")
class MongoCtrl {
  @Health("/health")
  health() {
    // Here check the mongo health
    return Promise.resolve();
  }
}
```

You can also create an `HealthCheckError` when an error appear during your check.

```ts
import {Health} from "@tsed/terminus";
import {HealthCheckError} from "@godaddy/terminus";

@Controller("/redis")
class Redis {
  @Health("/health")
  health() {
    // Here check the redis health
    return Promise.reject(
      new HealthCheckError("failed", {
        redis: "down"
      })
    );
  }
}
```

### Graceful shutdown

`@tsed/terminus` package give some decorators to handle Terminus hooks. These hooks allow you to adds graceful shutdown.
Here is the list of decorators:

- @@BeforeShutdown@@: Use this hook if you deploy your application with Kubernetes (see more details [here](https://github.com/godaddy/terminus#how-to-set-terminus-up-with-kubernetes)),
- @@OnSignal@@: cleanup hook, returning a promise (used to be onSigterm),
- @@OnShutdown@@: called right before exiting,
- @@OnSendFailureDuringShutdown@@: called before sending each 503 during shutdowns.

**Example:**

```typescript
import {BeforeShutdown, OnSendFailureDuringShutdown, OnShutdown, OnSignal} from "@tsed/terminus";

@Controller("/redis")
class RedisCtrl {
  @BeforeShutdown()
  beforeShutdow() {
    console.log("called before shutdown");
  }

  @OnSignal()
  OnSignal() {
    console.log("called on signal");
  }

  @OnShutdown()
  OnShutdown() {
    console.log("called on shutdown");
  }

  @OnSendFailureDuringShutdown()
  OnSendFailureDuringShutdown() {
    console.log("on send failure during shutdown");
  }
}
```

## Author

<GithubContributors users="['EmilienLeroy']"/>

## Maintainers

<GithubContributors users="['EmilienLeroy']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
