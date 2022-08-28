---
meta:
  - name: description
    content: Use IORedis with Express, TypeScript and Ts.ED.
  - name: keywords
    content: ts.ed express typescript ioredis node.js javascript decorators
    projects:
---

# IORedis

<Banner src="/ioredis.svg" height="200" href="https://github.com/luin/ioredis"></Banner>

## Features

Currently, `@tsed/ioredis` allows you:

- Configure one or more Redis database connections via the `@Configuration` configuration.
- Share redis connection with `@tsed/platform-cache`.
- Support classic Redis connection and Cluster connection.
- Inject connection to another service.
- Mock connection for unit/integration test.

## Installation

```shell
npm install --save @tsed/ioredis ioredis
npm install --save-dev ioredis-mock
```

::: tip Note

Minimal supported ioredis version is v5+

:::

## Create connection

Create a new `RedisConnection.ts` file in your project:

```typescript
import Redis from "ioredis";
import {registerConnectionProvider} from "@tsed/ioredis";

export const REDIS_CONNECTION = Symbol.for("REDIS_CONNECTION");
export type REDIS_CONNECTION = Redis;

registerConnectionProvider({
  provide: REDIS_CONNECTION,
  name: "default"
});
```

::: tip Note

`registerConnectionProvider` create automatically an injectable `RedisConnection`.

:::

Then, edit your `Server.ts`:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-cache"; // add this module if you want to use cache
import "@tsed/ioredis";

@Configuration({
  ioredis: [
    {
      name: "default",
      // share the redis connection with @tsed/platform-cache
      cache: true

      // redis options
      // host: "localhost",
      // port: 6379,
      // username: "...",
      // password: "...",
      // tls: false,
      // db: 0
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
import {Injectable} from "@tsed/di";

@Injectable()
export class ClientRepository {
  @Inject(REDIS_CONNECTION)
  protected connection: REDIS_CONNECTION; // ioredis instance

  async keys() {
    return this.connection.keys("clients:*");
  }
}
```

> See [ioredis documentation](https://github.com/luin/ioredis) for more details.

## Cluster configuration

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-cache"; // add this module if you want to use cache
import "@tsed/ioredis";

@Configuration({
  ioredis: [
    {
      name: "default",
      // share the redis connection with @tsed/platform-cache
      cache: true,
      // cluster options
      nodes: ["..."],
      // other cluster options
      scaleReads: "all",
      maxRedirections: 16,
      retryDelayOnTryAgain: 100,
      retryDelayOnFailover: 200,
      retryDelayOnClusterDown: 1000,
      slotsRefreshTimeout: 15000,
      slotsRefreshInterval: 20000,
      enableOfflineQueue: true,
      enableReadyCheck: true,
      redisOptions: {
        noDelay: true,
        connectTimeout: 15000,
        autoResendUnfulfilledCommands: true,
        maxRetriesPerRequest: 5,
        enableAutoPipelining: true,
        autoPipeliningIgnoredCommands: ["scan"]
      }
      //
    }
  ],
  // cache options
  cache: {
    ttl: 300
  }
})
class MyModule {}
```

## Testing

Ts.ED provides a utility that allows you to test a service that consumes a Redis connection.
This use relies on the awesome [ioredis-mock](https://www.npmjs.com/package/ioredis-mock) module.

Here is a class that consume a redis connection:

```typescript
import {v4} from "uuid";
import {Injectable} from "@tsed/di";
import {serialize, deserialize} from "@tsed/json-mapper";
import {REDIS_CONNECTION} from "./RedisConnection";
import {ClientModel} from "./ClientModel";

@Injectable()
export class ClientRepository {
  @Inject(REDIS_CONNECTION)
  protected connection: REDIS_CONNECTION; // ioredis instance

  async get(id: string) {
    const raw = await this.connection.get("clients:" + id);

    if (!raw) {
      return undefined;
    }

    return deserialize(JSON.parse(raw), {type: ClientModel});
  }

  async save(client: ClientModel) {
    client.id = client.id || v4();

    this.connection.set("clients:" + client.id, JSON.stringify(serialize(client)));

    return client;
  }
}
```

The ClientModel:

```typescript
import {Schema} from "@tsed/schema";

export class ClientModel {
  @Property()
  id: string;

  @Property()
  name: string;
}
```

And his test:

```typescript
import {ClientRepository} from "./ClientRepository";
import {REDIS_CONNECTION} from "./RedisConnection";
import {ClientModel} from "./ClientModel";

describe("IORedisTest", () => {
  beforeEach(() => IORedisTest.create()); // create a new sandbox with ioredis-mock connection
  afterEach(() => IORedisTest.reset());

  it("should return nothing", async () => {
    const service = IORedisTest.get<MyRepository>(MyRepository);

    const client = await service.get("uid");

    expect(client).toEqual(undefined);
  });

  it("should return all keys", async () => {
    const service = IORedisTest.get<MyRepository>(MyRepository);
    const client = new ClientModel();
    client.name = "name";

    const newClient = await service.save(client);

    expect(newClient.id).toBeInstanceOf(String);
    expect(newClient.name).toEqual("name");

    const clientFound = await service.get(newClient.id);

    expect(clientFound).toBeInstanceOf(ClientModel);
    expect(clientFound.id).toEqual(newClient.id);
    expect(clientFound.name).toEqual("name");
  });
});
```

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers

<GithubContributors :users="['Romakita']"/>
