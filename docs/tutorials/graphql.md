---
meta:
  - name: description
    content: Use Apollo, Nexus or Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
  - name: keywords
    content: ts.ed express typescript nexus typegraphql apollo graphql-ws node.js javascript decorators
---

# GraphQL

<Banner src="/graphql.svg" height="200" />

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL
provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly
what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Feature

- Create [Apollo](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html) Server and bind it with
  Ts.ED,
- Create multiple servers,
- Support [TypeGraphQL](https://typegraphql.com/), [Nexus](https://nexusjs.org/) or standalone Apollo server.

## Apollo

<Banner src="/apollo-graphql-compact.svg" height="100" />

Unlock microservices potential with Apollo GraphQL. Seamlessly integrate APIs, manage data, and enhance performance. Explore Apollo's innovative solutions.
Ts.ED provides a module to create multiple Apollo server and bind it with Ts.ED server (Express or Koa).

See [here](/tutorials/graphql-apollo.md) for more details.

## Nexus

<Banner src="/graphql-nexus.png" height="100" />

GraphQL Nexus' APIs were designed with type-safety in mind. We auto-generate type-definitions as you develop, and infer them in your code, giving you IDE completion and type error catching out of the box!

See [here](/tutorials/graphql-nexus.md) for more details.

## TypeGraphQL

<Banner src="/typegraphql.png" height="100" />

Although TypeGraphQL is data-layer library agnostic, it integrates well with other decorator-based libraries, like TypeORM, sequelize-typescript or Typegoose.

See [here](/tutorials/graphql-typegraphql.md) for more details.

## GraphQL WS (subscription)

<Banner src="/graphql-ws.png" height="100" />

GraphQL Websocket allows you to use the `subscription` feature of GraphQL using the Websocket transport protocol.

See [here](/tutorials/graphql-ws.md) for more details.

## ApolloService

ApolloService let you retrieve an instance of ApolloServer:

```typescript
import {AfterRoutesInit} from "@tsed/platform-http";
import {Injectable} from "@tsed/di";
import {graphQLService} from "@tsed/apollo";
import {ApolloServer} from "@apollo/server";

@Injectable()
export class UsersService implements AfterRoutesInit {
  @Injec()
  apolloService: ApolloService;

  private server: ApolloServer;

  $afterRoutesInit() {
    this.server = this.apolloService.get("server1");
  }
}
```

## DataSources

Apollo Server provides a mechanism to fetch data from a REST API or a database. This mechanism is called DataSources.
Ts.ED allow you to register your DataSources using the @@DataSource@@ decorator.

```typescript

```

## Testing

Here is an example to create a test server based on TypeGraphQL and run a query:

::: tip

The unit example is also available to test any Apollo Server!
:::

<Tabs class="-code">
  <Tab label="Jest">

<<< @/tutorials/snippets/graphql/testing.jest.ts

  </Tab>
  <Tab label="Mocha">

<<< @/tutorials/snippets/graphql/testing.mocha.ts

  </Tab>  
  <Tab label="RecipeResolver.ts">

<<< @/tutorials/snippets/graphql/resolver-service.ts

  </Tab>   
  <Tab label="RecipesService.ts">

<<< @/tutorials/snippets/graphql/recipes-service.ts

  </Tab>
  <Tab label="Recipe.ts">

<<< @/tutorials/snippets/graphql/recipe-type.ts

  </Tab>  
  <Tab label="RecipeArgs.ts">

<<< @/tutorials/snippets/graphql/recipe-args.ts

  </Tab>      
</Tabs>

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
