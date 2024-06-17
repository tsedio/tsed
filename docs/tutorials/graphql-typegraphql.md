---
meta:
  - name: description
    content: Use Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
  - name: keywords
    content: ts.ed express typescript typegraphql node.js javascript decorators
---

# TypeGraphQL

<Banner src="/typegraphql.png" height="200" />

Although TypeGraphQL is data-layer library agnostic, it integrates well with other decorator-based libraries, like TypeORM, sequelize-typescript or Typegoose.

## Installation

To begin, install the `@tsed/typegraphql` package:

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/apollo graphql type-graphql @apollo/server @apollo/datasource-rest
npm install --save-dev apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/apollo graphql type-graphql @apollo/server @as-integration/koa @apollo/datasource-rest
npm install --save-dev apollo-server-testing
```

</Tab>
</Tabs>

Now, we can configure the Ts.ED server by importing `@tsed/typegraphql` in your Server:

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">

```ts
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/typegraphql";
import "./resolvers/index"; // barrel file with all resolvers

@Configuration({
  apollo: {
    server1: {
      // GraphQL server configuration
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
      path: "/",
      playground: true // enable playground GraphQL IDE. Set false to use Apollo Studio

      // resolvers?: (Function | string)[];
      // dataSources?: Function;
      // server?: (config: Config) => ApolloServer;

      // plugins: []
      // middlewareOptions?: ServerRegistration;

      // type-graphql
      // See options descriptions on https://19majkel94.github.io/type-graphql/
      // buildSchemaOptions?: Partial<BuildSchemaOptions>;
    }
  }
})
export class Server {}
```

  </Tab>
  <Tab label="CodeSandbox" icon="bxl-codepen">

<iframe src="https://codesandbox.io/embed/tsed-graphql-pgvfz?fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="TsED Graphql"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi;
payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

   </Tab>
</Tabs>

## Types

We want to get the equivalent of this type described in SDL:

```graphql
type Recipe {
  id: ID!
  title: String!
  description: String
  creationDate: Date!
  ingredients: [String!]!
}
```

So we create the Recipe class with all properties and types:

```typescript
class Recipe {
  id: string;
  title: string;
  description?: string;
  creationDate: Date;
  ingredients: string[];
}
```

Then we decorate the class and its properties with decorators:

<<< @/tutorials/snippets/graphql/recipe-type.ts

The detailed rules for when to use nullable, array and others are described
in [fields and types docs](https://typegraphql.com/docs/types-and-fields.html).

## Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class
that will have injected RecipeService in the constructor:

```ts
import {Inject} from "@tsed/di";
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Args, Query} from "type-graphql";
import {RecipeNotFoundError} from "../errors/RecipeNotFoundError";
import {RecipesService} from "../services/RecipesService";
import {Recipe} from "../types/Recipe";
import {RecipesArgs} from "../types/RecipesArgs";

@ResolverController(Recipe)
export class RecipeResolver {
  @Inject()
  private recipesService: RecipesService;

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipesService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }

    return recipe;
  }

  @Query((returns) => [Recipe])
  recipes(@Args() {skip, take}: RecipesArgs) {
    return this.recipesService.findAll({skip, take});
  }
}
```

### Inject Ts.ED Context

There are two ways to inject the Ts.ED context in your resolver.
The first one is to use the `@InjectContext()` decorator:

```ts
import {Inject, InjectContext} from "@tsed/di";
import {PLatformContext} from "@tsed/common";
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Args, Query} from "type-graphql";
import {Recipe} from "../types/Recipe";

@ResolverController(Recipe)
export class RecipeResolver {
  @InjectContext()
  private $ctx: PLatformContext;

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    this.$ctx.logger.info("Hello world");
    console.log(this.$ctx.request.headers);
  }
}
```

The second one is to use the `@Ctx()` decorator provided by TypeGraphQL:

```ts
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Ctx, Query} from "type-graphql";
import {Recipe} from "../types/Recipe";

@ResolverController(Recipe)
export class RecipeResolver {
  @InjectContext()
  private $ctx: Context;

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string, @Ctx("req.$ctx") $ctx: PlatformContext) {
    $ctx.logger.info("Hello world");
    console.log($ctx.request.headers);
  }
}
```

## Data Source

Data source is one of the Apollo server features which can be used as option for your Resolver or Query. Ts.ED provides
a @@DataSourceService@@ decorator to declare a DataSource which will be injected to the Apollo server context.

```typescript
import {DataSource} from "@tsed/typegraphql";
import {RESTDataSource} from "@apollo/datasource-rest";
import {User} from "../models/User";
import {DataSource, InjectApolloContext, ApolloContext, InjectApolloContext} from "@tsed/apollo";
import {Constant, Opts} from "@tsed/di";
import {RESTDataSource} from "@apollo/datasource-rest";

@DataSource()
export class UserDataSource extends RESTDataSource {
  @InjectContext()
  protected $ctx: PlatformContext;

  @Constant("envs.USERS_URL", "https://myapi.com/api/users")
  protected baseURL: string;

  @InjectApolloContext()
  protected context: CustomApolloContext;

  constructor(server: ApolloServer, logger: Logger) {
    super({
      logger,
      cache: server.cache
    });
  }

  willSendRequest(path, request) {
    request.headers["authorization"] = this.context.token;
  }

  getUserById(id: string) {
    return this.get(`/${id}`);
  }
}
```

Then you can retrieve your data source through the context in your resolver like that:

```typescript
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Authorized, Ctx, Query} from "type-graphql";
import {UserDataSource} from "../datasources/UserDataSource";
import {User} from "../models/User";

@ResolverController(User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  public async user(@Arg("userId") userId: string, @Ctx("dataSources") dataSources: any): Promise<User> {
    const userDataSource: UserDataSource = dataSources.userDataSource;

    return userDataSource.getUserById(userId);
  }
}
```

## Multiple GraphQL server

If you register multiple GraphQL servers, you must specify the server id in the `@ResolverController` decorator.

```typescript
@ResolverController(Recipe, {id: "server1"})
```

Another solution is to not use `@ResolverController` (use `@Resolver` from TypeGraphQL), and declare explicitly the resolver in the server configuration:

```typescript
@Configuration({
  graphql: {
    server1: {
      resolvers: {
        RecipeResolver
      }
    },
    server2: {
      resolvers: {
        OtherResolver
      }
    }
  }
})
```

## Subscriptions

Ts.ED provides a `@tsed/graphql-ws` package to support the `subscription` feature of GraphQL. See [here](/tutorials/graphql-ws.md) for more details.

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
