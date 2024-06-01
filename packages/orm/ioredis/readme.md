<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/ioredis</h1>

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

A package of Ts.ED framework. See website: https://tsed.io/tutorials/redis.html

## Features

Currently, `@tsed/ioredis` allows you:

- Configure one or more Redis database connections via the `@Configuration` configuration.
- Share redis connection with `@tsed/platform-cache`.
- Support classic Redis connection and Cluster connection.
- Inject connection to another service.
- Mock connection for unit/integration test.

## Installation

```shell
npm install --save @tsed/ioredis ioredis ioredis-mock
```

> Minimal supported ioredis version is v5+

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

> registerConnectionProvider create automatically an injectable RedisConnection

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
import {REDIS_CONNECTION} from "./RedisConnection.js";
import {ClientModel} from "./ClientModel.js";

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
import {ClientRepository} from "./ClientRepository.js";
import {REDIS_CONNECTION} from "./RedisConnection.js";
import {ClientModel} from "./ClientModel.js";

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

## Contributors

Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/tsedio/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
