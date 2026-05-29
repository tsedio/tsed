---
head:
  - - meta
    - name: description
      content: Use Redis (node-redis) with Express, TypeScript and Ts.ED.
  - - meta
    - name: keywords
      content: ts.ed express typescript redis node.js javascript decorators
---

# Redis

## Features

Currently, `@tsed/redis` allows you to:

- Configure one or more Redis database connections via the `@Configuration` configuration.
- Share Redis connection with `@tsed/platform-cache`.
- Support classic Redis connection and Cluster connection.
- Inject connection into another service.
- Mock connection for unit/integration test.

## Installation

::: code-group

```sh [npm]
npm install --save @tsed/redis redis
npm install --save-dev redis-mock
```

```sh [yarn]
yarn add @tsed/redis redis
yarn add -D redis-mock
```

```sh [pnpm]
pnpm add @tsed/redis redis
pnpm add -D redis-mock
```

```sh [bun]
bun add @tsed/redis redis
bun add -D redis-mock
```

:::

::: tip Note

Minimal supported redis version is v5+

:::

## Create connection

Create a new `RedisConnection.ts` file in your project:

```typescript
import type {RedisClientType, RedisClusterType} from "redis";
import {registerConnectionProvider} from "@tsed/redis";

export const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
export type REDIS_CONNECTION = RedisClientType | RedisClusterType<any, any>;

registerConnectionProvider({
  token: REDIS_CONNECTION,
  name: "default"
});
```

::: tip Note

`registerConnectionProvider` creates automatically an injectable Redis connection.

:::

Then, edit your `Server.ts`:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-cache"; // add this module if you want to use cache
import "@tsed/redis";

@Configuration({
  redis: [
    {
      name: "default",
      // share the Redis connection with @tsed/platform-cache
      cache: true

      // node-redis options
      // url: "redis://localhost:6379"
      // socket: {
      //   host: "localhost",
      //   port: 6379
      // }
    }
  ],
  // cache options
  cache: {
    ttl: 300
  }
})
class MyModule {}
```

And finally, use the connection in your services:

```typescript
import {Inject, Injectable} from "@tsed/di";
import {REDIS_CONNECTION} from "./RedisConnection";

@Injectable()
export class ClientRepository {
  @Inject(REDIS_CONNECTION)
  protected connection: REDIS_CONNECTION;

  async keys() {
    return this.connection.keys("clients:*");
  }
}
```

> See [redis documentation](https://github.com/redis/node-redis) for more details.

## Cluster configuration

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-cache";
import "@tsed/redis";

@Configuration({
  redis: [
    {
      name: "default",
      cache: true,
      nodes: [{url: "redis://localhost:7000"}, {url: "redis://localhost:7001"}, {url: "redis://localhost:7002"}]
    }
  ],
  cache: {
    ttl: 300
  }
})
class MyModule {}
```

::: tip Note

With `nodes`, `@tsed/redis` creates a Redis cluster connection (`createCluster` with `rootNodes`).
Without `nodes`, it creates a standard Redis client (`createClient`).

:::

## Testing

Ts.ED provides a utility that allows you to test a service that consumes a Redis connection.
This utility relies on [redis-mock](https://www.npmjs.com/package/redis-mock).

Here is a class that consumes a Redis connection:

```typescript
import {v4} from "uuid";
import {Inject, Injectable} from "@tsed/di";
import {serialize, deserialize} from "@tsed/json-mapper";
import {REDIS_CONNECTION} from "./RedisConnection";
import {ClientModel} from "./ClientModel";

@Injectable()
export class ClientRepository {
  @Inject(REDIS_CONNECTION)
  protected connection: REDIS_CONNECTION;

  async get(id: string) {
    const raw = await this.connection.get("clients:" + id);

    if (!raw) {
      return undefined;
    }

    return deserialize(JSON.parse(raw), {type: ClientModel});
  }

  async save(client: ClientModel) {
    client.id = client.id || v4();

    await this.connection.set("clients:" + client.id, JSON.stringify(serialize(client)));

    return client;
  }
}
```

And its test:

```typescript
import {RedisTest} from "@tsed/redis/cache";
import {ClientRepository} from "./ClientRepository";
import {ClientModel} from "./ClientModel";

describe("RedisTest", () => {
  beforeEach(() => RedisTest.create());
  afterEach(() => RedisTest.reset());

  it("should return nothing", async () => {
    const service = RedisTest.get(ClientRepository);
    const client = await service.get("uid");

    expect(client).toEqual(undefined);
  });

  it("should return a stored client", async () => {
    const service = RedisTest.get(ClientRepository);
    const client = new ClientModel();
    client.name = "name";

    const newClient = await service.save(client);
    const clientFound = await service.get(newClient.id);

    expect(clientFound).toBeInstanceOf(ClientModel);
    expect(clientFound?.name).toEqual("name");
  });
});
```

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers

<GithubContributors :users="['Romakita']"/>
