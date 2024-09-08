---
meta:
  - name: description
    content: Nexus
  - name: keywords
    content: ts.ed express typescript graphql websocket node.js javascript decorators
---

# GraphQL Nexus

<Banner src="/graphql-nexus.png" height="200" />

GraphQL Nexus' APIs were designed with type-safety in mind. We auto-generate type-definitions as you develop, and infer
them in your code, giving you IDE completion and type error catching out of the box!

## Installation

This example need to be used with `@tsed/apollo` module. So, you must install it before (see [here](/tutorials/graphql-apollo.md)).

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/apollo nexus graphql @apollo/server
npm install --save-dev apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/apollo nexus graphql @apollo/server @as-integration/koa
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
    typegen: join(process.cwd(), "..", "..", "nexus-typegen.ts"), // 2
    schema: join(process.cwd(), "..", "..", "schema.graphql") // 3
  }
});
```

### Data Source

Data source is one of the Apollo server features which can be used as option for your Resolver or Query. Ts.ED provides
a @@DataSourceService@@ decorator to declare a DataSource which will be injected to the Apollo server context.

```typescript
import {DataSource} from "@tsed/typegraphql";
import {RESTDataSource} from "@apollo/datasource-rest";
import {User} from "../models/User";
@DataSource()
export class UserDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://myapi.com/api/users";
  }

  getUserById(id: string): Promise<User> {
    return this.get(`/${id}`);
  }
}
```

## Need help

This documentation isn't complete. You can find more documentation on the [official website](https://nexusjs.org/).
But code example with Ts.ED + Nexus are welcome.

## Author

<GithubContributors users="['Romakita']"/>

## Maintainers

<GithubContributors users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
