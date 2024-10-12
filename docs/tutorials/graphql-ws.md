---
meta:
  - name: description
    content: GraphQL Websocket allows you to use the `subscription` feature of GraphQL using the Websocket transport protocol.
  - name: keywords
    content: ts.ed express typescript graphql websocket node.js javascript decorators
---

# GraphQL WS

<Banner src="/graphql-ws-large.png" height="200" />

GraphQL Websocket allows you to use the `subscription` feature of GraphQL using the Websocket transport protocol.
This module is based on the [graphql-ws](https://the-guild.dev/graphql/ws) package. It pre-configures the socket server and GraphQL server to work together.

## Feature

- Support multiple GraphQL server
- Enable subscription feature of GraphQL

### Installation

This module need to be used with `@tsed/apollo` module. So, you must install it before (see [here](/tutorials/graphql-apollo.md)).

<Tabs class="-code">
<Tab label="Npm">

```bash
npm install --save @tsed/graphql-ws graphql-ws
```

</Tab>
<Tab label="Yarn">

```bash
yarn add @tsed/graphql-ws graphql-ws
```

</Tab>
</Tabs>

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/apollo";
import "@tsed/graphql-ws"; // auto import plugin for @tsed/apollo
import {join} from "path";

@Configuration({
  apollo: {
    server1: {
      // GraphQL server configuration
      path: "/",
      playground: true, // enable playground GraphQL IDE. Set false to use Apollo Studio
      plugins: [], // Apollo plugins

      wsServerOptions: {
        // See options descriptions on
      },
      wsUseServerOptions: {
        // See options descriptions on GraphQL WS
      }

      // Give custom server instance
      // server?: (config: Config) => ApolloServer;

      // ApolloServer options
      // ...
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
    }
  },
  graphqlWs: {
    // global options
    wsServerOptions: {
      // See options descriptions on
    },
    wsUseServerOptions: {
      // See options descriptions on
    }
  }
})
export class Server {}
```

## The PubSub class

::: warning
The PubSub class is not recommended for production environments, because it's an in-memory event system that only supports a single server instance. After you get subscriptions working in development, we strongly recommend switching it out for a different subclass of the abstract [PubSubEngine](https://github.com/apollographql/graphql-subscriptions/blob/master/src/pubsub-engine.ts)
class. Recommended subclasses are listed in [Production PubSub libraries](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries).
:::

You can use the publish-subscribe (pub/sub) model to track events that update active subscriptions.
The graphql-subscriptions library provides the PubSub class as a basic in-memory event bus to help you get started:

To use the graphql-subscriptions package, first install it like so:

```shell
npm install graphql-subscriptions
```

A `PubSub` instance enables your server code to both `publish` events to a particular label and listen for events associated with a particular label.
We can create a `PubSub` instance like so:

```typescript
import {PubSub} from "graphql-subscriptions";
import {registerProvider} from "@tsed/di";

export const pubsub = new PubSub();
export const PubSubProvider = Symbol.for("PubSubProvider");
export type PubSubProvider = PubSub;

registerProvider({provide: PubSub, useValue: pubsub});
```

Depending on the schema resolver (nexus, type-graphql, etc.), you can use the `pubsub` instance to publish events and subscribe to them in your resolvers.

::: warning
To use the subscription feature with TypeGraphQL, you have to give pubsub instance to the buildSchemaOptions:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/apollo";
import "@tsed/typegraphql";
import "@tsed/graphql-ws"; // auto import plugin for @tsed/apollo
import {join} from "path";
import {pubsub} from "./pubsub/pubsub";

@Configuration({
  apollo: {
    server1: {
      // GraphQL server configuration
      path: "/",
      playground: true, // enable playground GraphQL IDE. Set false to use Apollo Studio
      plugins: [], // Apollo plugins
      buildSchemaOptions: {
        pubsub
      }
    }
  },
  graphqlWs: {
    // global options
    wsServerOptions: {
      // See options descriptions on
    },
    wsUseServerOptions: {
      // See options descriptions on
    }
  }
})
export class Server {}
```

Here is a simple example of how to use the `pubsub` instance in a resolver using the `type-graphql` library:

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {InjectContext, Inject} from "@tsed/di";
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Mutation, Query, Root, Subscription} from "type-graphql";
import {RecipeService} from "../../services/RecipeService";
import {PubSubProvider} from "../pubsub/pubsub.js";
import {Recipe, RecipeNotification} from "./Recipe";
import {RecipeNotFoundError} from "./RecipeNotFoundError";

@ResolverController((_of) => Recipe)
export class RecipeResolver {
  @InjectContext()
  private $ctx: PlatformContext;

  @Inject()
  private recipeService: RecipeService;

  @Inject(PubSubProvider)
  private pubSub: PubSubProvider;

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);

    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }

    return recipe;
  }

  @Query((returns) => [Recipe], {description: "Get all the recipes from around the world "})
  recipes(): Promise<Recipe[]> {
    this.$ctx.set("test", "test");
    return this.recipeService.findAll({});
  }

  @Mutation((returns) => Recipe)
  async addRecipe(@Arg("title") title: string, @Arg("description") description: string) {
    const payload = await this.recipeService.create({title, description});
    const notification = new RecipeNotification(payload);

    this.pubSub.publish("NOTIFICATIONS", notification);

    return payload;
  }

  @Subscription(() => RecipeNotification, {
    topics: "RECIPE_ADDED"
  })
  newRecipe(@Root() payload: Recipe): RecipeNotification {
    return {...payload, date: new Date()};
  }
}
```

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
