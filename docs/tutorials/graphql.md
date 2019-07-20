---
meta:
 - name: description
   content: Use GraphQL, Apollo and Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
---
# GraphQL <Badge text="beta" type="warn"/> <Badge text="Contributors are welcome" />

<Banner src="https://graphql.org/img/logo.svg" href="https://graphql.org/" height="128" />

> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Feature

Currently, `@tsed/graphql` allows you to configure a graphql server in your project.
This package use [`apollo-server-express`](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html) to create GraphQL server and [`type-graphql`](https://19majkel94.github.io/type-graphql/)
for the decorators.

## Installation

To begin, install the GraphQL module for TS.ED:
```bash
npm install --save @tsed/graphql
```

[Type-graphql](https://19majkel94.github.io/type-graphql/) require to update your `tsconfig.json` by adding extra options as following:

```json
{
  "target": "es2016",
  "lib": ["es2016", "esnext.asynciterable"],
  "allowSyntheticDefaultImports": true
}
```

Now, we can configure the Ts.ED server by importing `@tsed/graphql` in your [ServerLoader](/api/common/server/components/ServerLoader.md):

<<< @/docs/tutorials/snippets/graphql/server-configuration.ts

## GraphQlService

GraphQlService let you to retrieve an instance of ApolloServer.

<<< @/docs/tutorials/snippets/graphql/get-server-instance.ts

For more information about ApolloServer look his documentation [here](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html);

## Type-graphql
### Types

We want to get equivalent of this type described in SDL:

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

Then we decorate the class and it properties with decorators:

<<< @/docs/tutorials/snippets/graphql/recipe-type-graphql.ts

The detailed rules when to use nullable, array and others are described in [fields and types docs](https://19majkel94.github.io/type-graphql/docs/types-and-fields.html).

###  Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected RecipeService in constructor:

<<< @/docs/tutorials/snippets/graphql/resolver-service.ts

### Data Source

Data sources is one of the Apollo server feature which can be used as option for your Resolver or Query.
Ts.ED provide a @@DataSourceService@@ decorator to declare a DataSource which will be injected to the apollo server context.

<<< @/docs/tutorials/snippets/graphql/datasource-service.ts

Then you can retrieve your data source through the context in your resolver like that:

<<< @/docs/tutorials/snippets/graphql/resolver-data-source.ts

