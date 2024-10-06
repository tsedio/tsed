<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>TypeGraphQL</h1>

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
  <a href="https://tsed.io/tutorials/graphql.html">TypeGraphQL</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Feature

Currently, `@tsed/typegraphql` allows you to configure a graphql server in your project.
This package use [`@apollo/server`](https://www.apollographql.com/) to create GraphQL server and [`type-graphql`](https://19majkel94.github.io/type-graphql/)
for the decorators.

## Installation

To begin, install the TypeGraphQL module for TS.ED:

Express.js:

```bash
npm install --save @tsed/apollo graphql type-graphql @apollo/server @apollo/datasource-rest graphql-scalars
npm install --save-dev apollo-server-testing
```

Koa.js

```bash
npm install --save @tsed/apollo graphql type-graphql @apollo/server @as-integration/koa @apollo/datasource-rest graphql-scalars
npm install --save-dev apollo-server-testing
```

Now, we can configure the Ts.ED server by importing `@tsed/typegraphql` in your Server:

```typescript
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
import {ObjectType, ID, Field} from "type-graphql";

@ObjectType()
export class Recipe {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({nullable: true})
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];
}
```

The detailed rules when to use nullable, array and others are described in [fields and types docs](https://19majkel94.github.io/type-graphql/docs/types-and-fields.html).

### Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected RecipeService in constructor:

```typescript
import {Resolver, Query, Arg, Args, Mutation, Authorized, Ctx} from "type-graphql";
import {ResolverController} from "@tsed/typegraphql";
import {Recipe} from "../types/Recipe.js";
import {RecipeService} from "../services/RecipeService.js";
import {RecipeNotFoundError} from "../errors/RecipeNotFoundError.js";

@ResolverController(Recipe)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }
    return recipe;
  }

  @Query((returns) => [Recipe])
  recipes(@Args() {skip, take}: RecipesArgs) {
    return this.recipeService.findAll({skip, take});
  }
}
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
