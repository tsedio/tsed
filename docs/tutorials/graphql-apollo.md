---
meta:
  - name: description
    content: Use Apollo, Nexus or Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
  - name: keywords
    content: ts.ed express koa typescript apollo node.js javascript decorators
---

# Apollo

<Banner src="/apollo-graphql-compact.svg" height="200" />

Unlock microservices potential with Apollo GraphQL. Seamlessly integrate APIs, manage data, and enhance performance. Explore Apollo's innovative solutions.
Ts.ED provides a module to create multiple Apollo server and bind it with Ts.ED server (Express or Koa).

## Feature

- Create [Apollo](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html) Server and bind it with
  Ts.ED,
- Create multiple servers,
- Support [TypeGraphQL](https://typegraphql.com/), [Nexus](https://nexusjs.org/) or standalone Apollo server (or whatever).
- Support subscription with [GraphQL WS](/tutorials/graphql-ws.md)

## Installation

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

## Register plugins

You can register plugins with the `plugins` property. The plugins are executed in the order of declaration.

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/apollo";
import {join} from "path";

@Configuration({
  apollo: {
    server1: {
      plugins: [] // Apollo plugins
    }
  }
})
export class Server {}
```

But if you need to register and access to the injector, you can use the `$alterApolloServerPlugins` hook. For example,
you can register the `graphql-ws` necessary to support the `subscription` feature of GraphQL like this:

```typescript
import {Constant, Inject, InjectorService, Module} from "@tsed/di";
import {useServer} from "graphql-ws/lib/use/ws";
import Http from "http";
import Https from "https";
import {WebSocketServer} from "ws";
import {GraphQLWSOptions} from "./GraphQLWSOptions";

@Module()
export class GraphQLWSModule {
  @Constant("graphqlWs", {})
  private settings: GraphQLWSOptions;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  @Inject()
  private injector: InjectorService;

  async $alterApolloServerPlugins(plugins: any[], settings: GraphQLWSOptions) {
    const wsServer = await this.createWSServer(settings);

    this.injector.logger.info(`Create GraphQL WS server on: ${settings.path}`);

    return plugins.concat({
      serverWillStart() {
        return {
          async drainServer() {
            await wsServer.dispose();
          }
        };
      }
    } as any);
  }

  protected createWSServer(settings: GraphQLWSOptions) {
    const wsServer = new WebSocketServer({
      ...(this.settings.wsServerOptions || {}),
      ...settings.wsServerOptions,
      server: this.httpsServer || this.httpServer!,
      path: settings.path
    });

    return useServer(
      {
        ...(this.settings.wsUseServerOptions || {}),
        ...settings.wsUseServerOptions,
        schema: settings.schema
      },
      wsServer
    );
  }
}
```

::: tip Note
Ts.ED provide a `@tsed/graphql-ws` package to support the `subscription` feature of GraphQL. See [here](https://tsed.io/api/graphql-ws.html) for more details.
:::

## Get Server instance

ApolloService (or TypeGraphQLService) lets you retrieve an instance of ApolloServer.

```ts
import {AfterRoutesInit} from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";
import {ApolloService} from "@tsed/apollo";
import {ApolloServerBase} from "apollo-server-core";

@Injectable()
export class UsersService implements AfterRoutesInit {
  @Inject()
  private ApolloService: ApolloService;
  // or private typeGraphQLService: TypeGraphQLService;

  private server: ApolloServerBase;

  $afterRoutesInit() {
    this.server = this.apolloService.get("server1")!;
  }
}
```

For more information about ApolloServer, look at its
documentation [here](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html);

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
