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

## Relationships

Ts.ED enables you to define relationships between models on properties directly, using decorators such as @@BelongsToOne@@, @@HasMany@@, @@HasOne@@, @@HasOneThroughRelation@@, @@ManyToMany@@ or @@RelatesTo@@.

You can supply a configuration object via (@@RelationshipOpts@@) into the decorator factor to override the default join keys and configure a relationship like you normally would via `relationMappings`. For collection-type relationships, you must also specify the model you wish to use and we will also apply the @@CollectionOf@@ decorator for you automatically.

This expressive usage ensures that your domain models are correctly typed for usage alongside [Objection.js's Graph API](https://vincit.github.io/objection.js/api/query-builder/eager-methods.html).

```typescript
/**
 * All work in a similar manner:
 * - @HasMany, @HasOne, @HasOneThroughRelation, @ManyToMany, @RelatesTo
 */
import {Entity, BelongsToOne} from "@tsed/objection";

@Entity("user")
class User extends Model {
  @IdColumn()
  id!: string;
}

@Entity("movie")
class Movie extends Model {
  @IdColumn()
  id!: string;

  ownerId!: string;

  @BelongsToOne()
  owner?: User;
}

// Retrieve the related user
const owner = await Movie.relatedQuery("owner").for(1);

// Retrieve the movie with their owner
const movie = await Movie.query().for(1).withGraphFetched("owner");
```

### Default joining keys

When used in conjunction with @@Entity@@ and @@IdColumn@@, Ts.ED attempts to provide you with a sensible default for your join keys out of the box, reducing the amount of boilerplate you need to write.

In the instance of @@BelongsToOne@@, the default join keys will be:

```json
{
  "from": "<sourceModelTable>.<foreignModelProperty>Id",
  "to": "<foreignModelTable>.<foreignModelIdColumn>"
}
```

::: tip
An example of the keys outputted above could be `movie.ownerId` and `user.id` respectively.
:::

In the instances of @@HasMany@@ and @@HasOne@@, the default join keys will be:

```json
{
  "from": "<sourceModelTable>.<sourceModelIdColumn>",
  "to": "<foreignModelTable>.<sourceModelTable>Id"
}
```

::: tip
An example of the keys outputted above could be `user.id` and `authentication.userId` respectively.
:::

In the instances of @@ManyToMany@@ and @@HasOneThroughRelation@@, the default join key will be:

```json
{
  "from": "<sourceModelTable>.<sourceModelIdColumn>",
  "through": {
    "from": "<sourceModelTable>_<foreignModelTable>.<sourceModelTable>Id",
    "to": "<sourceModelTable>_<foreignModelTable>.<foreignModelTable>Id"
  },
  "to": "<foreignModelTable>.<foreignModelIdColumn>"
}
```

::: tip
An example of the keys outputted above could be `user.id`, `user_authentication.userId`, `user_authentication.authenticationId` and `authentication.id` respectively.
:::

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
