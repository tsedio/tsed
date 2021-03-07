---
meta:
 - name: description
   content: Use GraphQL, Apollo and Type-graphql with Ts.ED framework. GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
 - name: keywords
   content: ts.ed express typescript mongoose node.js javascript decorators
---
# GraphQL <Badge text="Contributors are welcome" /> <Badge text="Help wanted" />

<Banner src="https://graphql.org/img/logo.svg" href="https://graphql.org/" height="128" />

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

## Feature

Currently, `@tsed/graphql` allows you to configure one or more GraphQL server in your project.
This package uses [`apollo-server-express`](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html) to create GraphQL server and [`type-graphql`](https://typegraphql.com/)
as decorator library.

## Installation

To begin, install the GraphQL module for TS.ED, graphql and apollo-server-testing:

<Tabs class="-code">
<Tab label="Express.js">

```bash
npm install --save @tsed/graphql type-graphql graphql@14.7.0
npm install --save apollo-datasource apollo-datasource-rest apollo-server-express
npm install --save-dev  apollo-server-testing
```

</Tab>
<Tab label="Koa.js">

```bash
npm install --save @tsed/graphql type-graphql graphql@14.7.0
npm install --save apollo-datasource apollo-datasource-rest apollo-server-koa
npm install --save-dev  apollo-server-testing
```

</Tab>
</Tabs>


[Type-graphql](https://19majkel94.github.io/type-graphql/) requires to update your `tsconfig.json` by adding extra options as following:

```json
{
  "target": "es2018",
  "lib": ["es2018", "esnext.asynciterable"],
  "allowSyntheticDefaultImports": true
}
```

Now, we can configure the Ts.ED server by importing `@tsed/graphql` in your Server:

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">

<<< @/tutorials/snippets/graphql/server-configuration.ts

  </Tab>
  <Tab label="CodeSandbox" icon="bxl-codepen">
  
<iframe src="https://codesandbox.io/embed/tsed-graphql-pgvfz?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="TsED Graphql"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

   </Tab>
</Tabs>

## GraphQlService

GraphQlService lets you to retrieve an instance of ApolloServer.

<<< @/tutorials/snippets/graphql/get-server-instance.ts

For more information about ApolloServer, look at its documentation [here](https://www.apollographql.com/docs/apollo-server/api/apollo-server.html);

## Type-graphql
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

The detailed rules for when to use nullable, array and others are described in [fields and types docs](https://19majkel94.github.io/type-graphql/docs/types-and-fields.html).

###  Resolvers

After that we want to create typical crud queries and mutation. To do that we create the resolver (controller) class that will have injected RecipeService in the constructor:

<<< @/tutorials/snippets/graphql/resolver-service.ts

### Data Source

Data source is one of the Apollo server features which can be used as option for your Resolver or Query.
Ts.ED provides a @@DataSourceService@@ decorator to declare a DataSource which will be injected to the Apollo server context.

<<< @/tutorials/snippets/graphql/datasource-service.ts

Then you can retrieve your data source through the context in your resolver like that:

<<< @/tutorials/snippets/graphql/resolver-data-source.ts

### Testing

Now we want to test the recipe by sending a graphQL query.
Here is an example to create a test server and run a query:

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