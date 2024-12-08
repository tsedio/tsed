---
meta:
  - name: description
    content: Use Swagger with Express, TypeScript and Ts.ED. Swagger open source and pro tools have helped millions of API developers, teams, and organizations deliver great APIs.
  - name: keywords
    content: ts.ed express typescript swagger node.js javascript decorators
---

# Scalar

<Banner src="/scalar.svg" href="https://scalar.com" :height="200" />

This page shows you how you can configure Scalar with Ts.ED. Scalar uses the OpenApi
to describe a Rest API. Ts.ED operates the existing decorators to build
a spec compliant with Scalar.

## Installation

Run this command to install required dependencies by `@tsed/scalar`:

```bash
npm install --save @tsed/scalar
```

Then add the following configuration in your Server:

<<< @/tutorials/snippets/scalar/configuration.ts [Configuration]

::: tip
The path option for Scalar will be used to expose the documentation on: `http://localhost:8000/doc`

Ts.ED will print the scalar url in the console.
:::

::: warning
When using helmet, there may be a problem with CSP, to solve this collision, configure the CSP as shown below:

```typescript
@Configuration({
  middlewares: [
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, "data:", "validator.swagger.io"],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
        }
      }
    })
  ]
})
export class Server {}

// If you are not going to use CSP at all, you can use this:
@Configuration({
  middlewares: [
    helmet({
      contentSecurityPolicy: false
    })
  ]
})
export class Server {}
```

:::

### Scalar options

Some options are available to configure Scalar, Ts.ED and the default spec information.

| Key                  | Example                                                       | Description                                                                                           |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| path                 | `/api-doc`                                                    | The url subpath to access to the documentation.                                                       |
| specVersion          | `3.0.1`                                                       | The OpenSpec version.                                                                                 |
| fileName             | `swagger.json`                                                | Swagger file name. By default swagger.json.                                                           |
| doc                  | `hidden-doc`                                                  | The documentation key used by `@Docs` decorator to create several swagger documentations.             |
| viewPath             | `${rootDir}/views/scalar.ejs` or `false`                      | The path to the ejs template. Set false to disabled scalar.                                           |
| cssPath              | `${rootDir}/assets/scalar.css`                                | The path to the CSS file.                                                                             |
| showExplorer         | `true`                                                        | Display the search field in the navbar.                                                               |
| spec                 | `{swagger: "2.0"}`                                            | The default information spec.                                                                         |
| specPath             | `${rootDir}/spec/swagger.base.json`                           | Load the base spec documentation from the specified path.                                             |
| outFile              | `${rootDir}/spec/swagger.json`                                | Write the `swagger.json` spec documentation on the specified path.                                    |
| hidden               | `true`                                                        | Hide the documentation in the dropdown explorer list.                                                 |
| options              | Scalar options                                                | Scalar options. See (https://github.com/scalar/scalar/tree/main/packages/api-reference#props)         |
| operationIdFormatter | `(name: string, propertyKey: string, path: string) => string` | A function to generate the operationId.                                                               |
| operationIdPattern   | `%c_%m`                                                       | A pattern to generate the operationId. Format of operationId field (%c: class name, %m: method name). |
| pathPatterns         | `[]`                                                          | Include only controllers whose paths match the pattern list provided.                                 |
| sortPaths            | `true`                                                        | Sort paths by alphabetical order.                                                                     |

### Multi documentations

#### By decorators

It's also possible to create several swagger documentations with the `doc` option:

<<< @/tutorials/snippets/scalar/multi-spec.ts

Then use `@Docs` decorators on your controllers to specify where the controllers should be displayed.

<<< @/tutorials/snippets/scalar/multi-spec-controllers.ts

#### By Path patterns

You can use the `pathPatterns` options to include only controllers whose paths match the pattern list provided.

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/scalar"; // import swagger Ts.ED module

@Configuration({
  swagger: [
    {
      path: "/api-admin",
      pathPatterns: ["/rest/admin/**"]
    },
    {
      path: "/api-all",
      pathPatterns: ["!/rest/admin/**"]
    }
  ]
})
export class Server {}
```

## Model documentation

One of the feature of Ts.ED is the model definition to serialize or deserialize a
JSON Object based on JsonSchema (See [model documentation](/docs/model.md)).

A model can be used on a method controller along with @@BodyParams@@ or other decorators.

<<< @/tutorials/snippets/scalar/model.ts

## Endpoint documentation

This example shows you how to use the decorators to generate Scalar documentation for an endpoint:

<<< @/tutorials/snippets/scalar/endpoint-documentation.ts

## Extra parameters

Sometimes you want to display extra `in` parameters like `headers` without consuming it in an endpoint.
It's possible describe extra parameters by using the @@In@@ decorator over the method.

<<< @/tutorials/snippets/scalar/endpoint-extra-in-params.ts

## Authors

<GithubContributors :users="['Romakita']"/>

## Maintainers

<GithubContributors :users="['Romakita']"/>
