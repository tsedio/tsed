---
meta:
  - name: description
    content: Use Objection.js with Express, TypeScript and Ts.ED.
  - name: keywords
    content: ts.ed express typescript objection.js node.js javascript decorators
---

# Objection.js

<Badge text="alpha" /> <Badge text="Contributors are welcome" />

This tutorial show yous how you can use [Objection.js](https://vincit.github.io/objection.js/) package with Ts.ED.

## Installation

Before using the `@tsed/objection` package, we need to install the [Obection.js](https://www.npmjs.com/package/objection) and [Knex](https://www.npmjs.com/package/knex) modules.

Install the dependencies:

```bash
npm install --save @tsed/objection objection knex
```

We also need to install one of the following depending on the database you want to use:

```bash
npm install pg
npm install sqlite3
npm install mysql
npm install mysql2
```

## Configuration

Add a `knex` configuration to your Ts.ED configuration (see: http://knexjs.org/#Installation-client for options):

```typescript
import {Server} from "@tsed/common";
import "@tsed/objection"; // don't forget to add this line!

@Configuration({
  // ...
  knex: {
    client: "sqlite3",
    connection: ":memory:"
  }
})
class Server {}
```

## Usage

You can use the @@Entity@@ decorator to create your models and make them work with Objection.js. `Entity` expects the table name as its argument.

```typescript
import {Required, MinLength, MaxLength, Inject} from "@tsed/common";
import {Entity, IdColumn} from "@tsed/objection";
import {Model} from "objection";

@Entity("users")
export class User extends Model {
  @IdColumn()
  id: number;

  @Property()
  @MaxLength(200)
  name: string;

  @Property()
  age: number;

  @Decimal({scale: 1, precision: 12})
  score: number;

  @Property()
  active: boolean;
}
```

## Get connection

```typescript
import {OBJECTION_CONNECTION} from "@tsed/objection";

@Injectable()
class MyService {
  @Inject(OBJECTION_CONNECTION)
  connection: OBJECTION_CONNECTION;

  $onInit() {
    console.log(this.connection);
  }
}
```

## Migration

Ts.ED can create columns based on the declared Model. Using @@createColumns@@, you can implement
a migration file as following:

```typescript
import {createColumns} from "@tsed/objection";
import {User} from "../domain/User";
import Knex from "objection";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable(User.tableName, async (table: Knex.TableBuilder) => {
    // createColumns for the given model
    createColumns(table, User);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
}
```

## Decorators

Ts.ED gives some decorators and services to write your code:

<ApiList query="status.includes('decorator') && status.includes('objection')" />

You can also use the common decorators to describe model (See [models](/docs/model.html) documentation):

<ApiList query="status.includes('decorator') && status.includes('schema')" />

## Author

<GithubContributors :users="['stefanvanherwijnen']"/>

## Maintainers

<GithubContributors :users="['stefanvanherwijnen']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
