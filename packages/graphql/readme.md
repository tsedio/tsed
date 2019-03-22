# @tsed/graphql

> Experimental feature. You can contribute to improve this feature !

<div align="center">
<a href="https://typeorm.io/">
<img src="https://graphql.org/img/logo.svg" height="128">
</a>
</div>

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/graphql

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

Now, we can configure the Ts.ED server by importing `@tsed/graphql` in your [ServerLoader](https://tsed.io/api/common/server/components/ServerLoader.html):

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

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
