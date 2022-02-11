---
meta:
  - name: description
    content: Use Apollo, Nexus or Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
  - name: keywords
    content: ts.ed express typescript mongoose node.js javascript decorators
---

# GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL
provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly
what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Feature

- Create [Apollo](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html) Server and bind it with
  Ts.ED,
- Create multiple servers,
- Support [TypeGraphQL](https://typegraphql.com/), [Nexus](https://nexusjs.org/) or standalone Apollo server.

## Apollo

### Installation

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/apollo graphql apollo-server-express
npm install --save-dev apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/apollo graphql apollo-server-koa
npm install --save-dev apollo-server-testing
```

</Tab>
</Tabs>

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/apollo";
import {join} from "path";

@Configuration({
  apollo: {
    server1: {
      // GraphQL server configuration
      path: "/",
      playground: true, // enable playground GraphQL IDE. Set false to use Apollo Studio
      plugins: [] // Apollo plugins
      // Give custom server instance
      // server?: (config: Config) => ApolloServer;

      // ApolloServer options
      // ...
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
    }
  }
})
export class Server {}
```

## Nexus

### Installation

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/apollo
npm install --save nexus graphql apollo-server-express
npm install --save-dev apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/apollo graphql
npm install --save nexus graphql apollo-server-koa
npm install --save-dev apollo-server-testing
```

</Tab>
</Tabs>

Now, we can configure the Ts.ED server by importing `@tsed/apollo` in your Server:

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/apollo";
import {schema} from "./schema";
import {join} from "path";

@Configuration({
  apollo: {
    server1: {
      // GraphQL server configuration
      path: "/",
      playground: true, // enable playground GraphQL IDE. Set false to use Apollo Studio
      schema,
      plugins: [] // Apollo plugins

      // Give custom server instance
      // server?: (config: Config) => ApolloServer;

      // ApolloServer options
      // ...
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
    }
  }
})
export class Server {}
```

Then create `schema/index.ts`:

```typescript
import {makeSchema} from "nexus";
import {join} from "path";

export const schema = makeSchema({
  types: [], // 1
  outputs: {
    typegen: join(__dirname, "..", "..", "nexus-typegen.ts"), // 2
    schema: join(__dirname, "..", "..", "schema.graphql") // 3
  }
});
```

## TypeGraphQL

### Installation

To begin, install the `@tsed/typegraphql` package:

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/typegraphql graphql apollo-server-express
npm install --save type-graphql apollo-datasource apollo-datasource-rest
npm install --save-dev apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/typegraphql graphql apollo-server-koa
npm install --save type-graphql apollo-datasource apollo-datasource-rest
npm install --save-dev apollo-server-testing
```

</Tab>
</Tabs>

Now, we can configure the Ts.ED server by importing `@tsed/typegraphql` in your Server:

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">

<<< @/tutorials/snippets/graphql/server-configuration.ts

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

### Types

We want to get the equivalent of this type described in SDL:

```
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
in [fields and types docs](https://19majkel94.github.io/type-graphql/docs/types-and-fields.html).

### Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class
that will have injected RecipeService in the constructor:

<<< @/tutorials/snippets/graphql/resolver-service.ts

### Data Source

Data source is one of the Apollo server features which can be used as option for your Resolver or Query. Ts.ED provides
a @@DataSourceService@@ decorator to declare a DataSource which will be injected to the Apollo server context.

<<< @/tutorials/snippets/graphql/datasource-service.ts

Then you can retrieve your data source through the context in your resolver like that:

<<< @/tutorials/snippets/graphql/resolver-data-source.ts

## Get Server instance

ApolloService (or TypeGraphQLService) lets you to retrieve an instance of ApolloServer.

<<< @/tutorials/snippets/graphql/get-server-instance.ts

For more information about ApolloServer, look at its
documentation [here](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html);

## Testing

Here is an example to create a test server based on TypeGraphQL and run a query:

::: tip The unit example is also available to test any Apollo Server!
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
