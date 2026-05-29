---
head:
  - - meta
    - name: description
      content: Use @tsed/adapters to build persistence adapters in Ts.ED.
  - - meta
    - name: keywords
      content: tsed adapters persistence oidc redis
---

# Adapters

`@tsed/adapters` provides a generic persistence abstraction used by Ts.ED modules (for example OIDC provider stores).

## Installation

::: code-group

```sh [npm]
npm install --save @tsed/adapters
```

```sh [yarn]
yarn add @tsed/adapters
```

```sh [pnpm]
pnpm add @tsed/adapters
```

```sh [bun]
bun add @tsed/adapters
```

:::

## How It Works

`@tsed/adapters` separates **domain logic** from **storage implementation**:

- Your feature code targets the `Adapter` contract (`create`, `findOne`, `update`, `delete`, ...)
- Ts.ED resolves an adapter implementation at runtime via `Adapters.invokeAdapter(...)`
- The same domain flow can switch from memory to file to Redis without changing business logic

## Basic Usage

```typescript
import {Adapter, AdapterModel, InjectAdapter} from "@tsed/adapters";
import {Injectable} from "@tsed/di";
import {Property} from "@tsed/schema";

class UserModel implements AdapterModel {
  @Property()
  _id: string;

  @Property()
  name: string;
}

@Injectable()
export class MyService {
  @InjectAdapter({
    collectionName: "users",
    model: UserModel
  })
  protected adapter: Adapter<UserModel>;

  async getItems() {
    return this.adapter.findAll();
  }

  async getItemById(id: string) {
    return this.adapter.findById(id);
  }
}
```

## Available Adapters

| Adapter              | Package (import from)    | Backend                            | Typical use                  |
| -------------------- | ------------------------ | ---------------------------------- | ---------------------------- |
| `MemoryAdapter`      | `@tsed/adapters`         | In-memory Map                      | Unit tests, local dev        |
| `LowDbAdapter`       | `@tsed/adapters`         | lowdb JSON database                | Simple local persistence     |
| `FileSyncAdapter`    | `@tsed/adapters`         | File sync storage                  | Deterministic local storage  |
| `RedisAdapter`       | `@tsed/adapters-redis`   | Redis (`@tsed/redis` / node-redis) | Production Redis persistence |
| `OIDCRedisAdapter`   | `@tsed/adapters-redis`   | Redis (`@tsed/redis` / node-redis) | OIDC Redis persistence       |
| `OIRedisAdapter`     | `@tsed/adapters-ioredis` | Redis (`@tsed/ioredis` / ioredis)  | Production Redis persistence |
| `OIDCIORedisAdapter` | `@tsed/adapters-ioredis` | Redis (`@tsed/ioredis` / ioredis)  | OIDC Redis persistence       |

## Implement Your Own Adapter

Create a class extending `Adapter<TModel>` and implement all required CRUD methods:

```typescript
import {Adapter, AdapterConstructorOptions, AdapterModel} from "@tsed/adapters";
import {Opts} from "@tsed/di";

export interface MyAdapterOptions extends AdapterConstructorOptions {
  connectionName?: string;
}

export class MyAdapter<Model extends AdapterModel> extends Adapter<Model> {
  constructor(@Opts options: MyAdapterOptions) {
    super(options);
  }

  async create(value: Partial<Omit<Model, "_id">>, expiresAt?: Date): Promise<Model> {
    // persist and return created entity
    throw new Error("Not implemented");
  }

  async upsert(id: string, value: Model, expiresAt?: Date): Promise<Model> {
    throw new Error("Not implemented");
  }

  async update(id: string, value: Model, expiresAt?: Date): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }

  async updateOne(predicate: Partial<Model>, value: Partial<Model>, expiresAt?: Date): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }

  async findOne(predicate: Partial<Model>): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }

  async findAll(predicate: Partial<Model> = {}): Promise<Model[]> {
    throw new Error("Not implemented");
  }

  async deleteOne(predicate: Partial<Model>): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }

  async deleteMany(predicate: Partial<Model>): Promise<Model[]> {
    throw new Error("Not implemented");
  }

  async deleteById(id: string): Promise<Model | undefined> {
    throw new Error("Not implemented");
  }
}
```

## Use a Custom Adapter

```typescript
import {Adapter, Adapters, AdapterModel} from "@tsed/adapters";
import {Injectable} from "@tsed/di";
import {Property} from "@tsed/schema";

class User implements AdapterModel {
  @Property()
  _id: string;

  @Property()
  email: string;

  @Property()
  displayName: string;
}

@Injectable()
export class UsersRepository {
  private usersStore: Adapter<User>;

  constructor(private adapters: Adapters) {
    this.usersStore = this.adapters.invokeAdapter<User>({
      adapter: MyAdapter,
      collectionName: "users",
      model: User
    });
  }

  async createUser(input: Pick<User, "email" | "displayName">) {
    return this.usersStore.create(input);
  }

  async getUsers() {
    return this.usersStore.findAll();
  }

  async getUserById(id: string) {
    return this.usersStore.findById(id);
  }

  async updateUser(id: string, patch: Partial<User>) {
    const current = await this.usersStore.findById(id);
    if (!current) {
      return undefined;
    }

    return this.usersStore.update(id, {...current, ...patch});
  }

  async deleteUser(id: string) {
    return this.usersStore.deleteById(id);
  }
}
```

You can also use `@InjectAdapter(...)` when injection is preferable to manual invocation.
