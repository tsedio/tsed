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
  "lib": ["es2016", "esnext.asynciterable"]
}
```

Now, we can configure the Ts.ED server by importing `@tsed/graphql` in your [ServerLoader](/api/common/server/components/ServerLoader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import {IGraphQLSettings} from "@tsed/graphql"; 

@ServerSettings({
   graphql: {
    'server1': {
      resolvers:[]
    }
  } as IGraphQLSettings
})
export class Server extends ServerLoader {

}
```

## GraphQlService

GraphQlService let you to retrieve an instance of ApolloServer.

```typescript
import {Service, AfterRoutesInit} from "@tsed/common";
import {graphQLService} from "@tsed/graphql";
import {ApolloServer} from "apollo-server-express";

@Service()
export class UsersService implements AfterRoutesInit {
    private server: ApolloServer;
    constructor(private graphQLService: graphQLService) {

    }

    $afterRoutesInit() {
        this.server = this.graphQLService.get("server1");
    }
}
```

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

```typescript
import {ObjectType, ID, Field} from "type-graphql"

@ObjectType()
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field(type => [String])
  ingredients: string[];
}
```
The detailed rules when to use nullable, array and others are described in [fields and types docs](https://19majkel94.github.io/type-graphql/docs/types-and-fields.html).

###  Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected RecipeService in constructor:

```typescript
import {Resolver, Query, Arg, Args, Mutation, Authorized, Ctx} from "type-graphql";
import {ResolverService} from "@tsed/graphql"
import {Recipe} from "../types/Recipe";  
import {RecipeService} from "../services/RecipeService";  
import {RecipeNotFoundError} from "../errors/RecipeNotFoundError";  

@ResolverService(Recipe)
export class RecipeResolver { 
  constructor(private recipeService: RecipeService) {}

  @Query(returns => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }
    return recipe;
  }

  @Query(returns => [Recipe])
  recipes(@Args() { skip, take }: RecipesArgs) {
    return this.recipeService.findAll({ skip, take });
  }
}
```

