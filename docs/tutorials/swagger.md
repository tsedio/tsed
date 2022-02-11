---
meta:
  - name: description
    content: Use Swagger with Express, TypeScript and Ts.ED. Swagger open source and pro tools have helped millions of API developers, teams, and organizations deliver great APIs.
  - name: keywords
    content: ts.ed express typescript swagger node.js javascript decorators
---

# Swagger

<Banner src="https://swagger.io/swagger/media/assets/images/swagger_logo.svg" href="https://swagger.io/" :height="200" />

This page shows you how you can configure Swagger-ui with Ts.ED. Swagger uses the OpenApi
to describe a Rest API. Ts.ED operates the existing decorators as well as new decorators to build
a spec compliant with Swagger.

## Installation

Run this command to install required dependencies by `@tsed/swagger`:

```bash
npm install --save @tsed/swagger
```

Then add the following configuration in your Server:

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">
   
<<< @/tutorials/snippets/swagger/configuration.ts

  </Tab>
  <Tab label="CodeSandbox" icon="bxl-codepen">
  
<iframe src="https://codesandbox.io/embed/tsed-swagger-example-ripfl?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="tsed-swagger-example"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
       
  </Tab>
</Tabs>

::: tip
The path option for Swagger will be used to expose the documentation:

- OAS2: [http://localhost:8000/v2/doc](http://localhost:8000/v2/doc)
- OAS3: [http://localhost:8000/v3/doc](http://localhost:8000/v3/doc)

Ts.ED will print the swagger-ui url in the console.
:::

::: warning
OpenSpec 2 support will be removed in v7.
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

### Swagger options

Some options are available to configure Swagger-ui, Ts.ED and the default spec information.

| Key                  | Example                                                       | Description                                                                                                   |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| path                 | `/api-doc`                                                    | The url subpath to access to the documentation.                                                               |
| specVersion          | `2.0`, `3.0.1`                                                | The OpenSpec version.                                                                                         |
| fileName             | `swagger.json`                                                | Swagger file name. By default swagger.json.                                                                   |
| doc                  | `hidden-doc`                                                  | The documentation key used by `@Docs` decorator to create several swagger documentations.                     |
| viewPath             | `${rootDir}/../views/swagger.ejs` or `false`                  | The path to the ejs template. Set false to disabled swagger-ui.                                               |
| cssPath              | `${rootDir}/spec/style.css`                                   | The path to the CSS file.                                                                                     |
| jsPath               | `${rootDir}/spec/main.js`                                     | The path to the JS file.                                                                                      |
| viewPath             | `${rootDir}/views/swagger.ejs`                                | The path to the ejs file to create html page.                                                                 |
| showExplorer         | `true`                                                        | Display the search field in the navbar.                                                                       |
| spec                 | `{swagger: "2.0"}`                                            | The default information spec.                                                                                 |
| specPath             | `${rootDir}/spec/swagger.base.json`                           | Load the base spec documentation from the specified path.                                                     |
| outFile              | `${rootDir}/spec/swagger.json`                                | Write the `swagger.json` spec documentation on the specified path.                                            |
| hidden               | `true`                                                        | Hide the documentation in the dropdown explorer list.                                                         |
| options              | Swagger-UI options                                            | SwaggerUI options. See (https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/docs/configuration.md) |
| operationIdFormatter | `(name: string, propertyKey: string, path: string) => string` | A function to generate the operationId.                                                                       |
| operationIdPattern   | `%c_%m`                                                       | A pattern to generate the operationId. Format of operationId field (%c: class name, %m: method name).         |
| pathPatterns         | `[]`                                                          | Include only controllers whose paths match the pattern list provided.                                         |

### Multi documentations

#### By decorators

It's also possible to create several swagger documentations with the `doc` option:

<<< @/tutorials/snippets/swagger/multi-spec.ts

Then use `@Docs` decorators on your controllers to specify where the controllers should be displayed.

<<< @/tutorials/snippets/swagger/multi-spec-controllers.ts

#### By Path patterns <Badge text="v6.66.0+" />

You can use the `pathPatterns` options to include only controllers whose paths match the pattern list provided.

```typescript
import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  rootDir: __dirname,
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

A model can be used on a method controller along with [@BodyParams](/api/common/filters/decorators/BodyParams.md) or other decorators.

<<< @/tutorials/snippets/swagger/model.ts

## Endpoint documentation

This example shows you how to use the decorators to generate swagger documentation for an endpoint:

<<< @/tutorials/snippets/swagger/endpoint-documentation.ts

## Extra parameters

Sometimes you want to display extra `in` parameters like `headers` without consuming it in an endpoint.
It's possible describe extra parameters by using the @@In@@ decorator over the method.

<<< @/tutorials/snippets/swagger/endpoint-extra-in-params.ts

## Import Javascript

It is possible to import a Javascript in the Swagger-ui documentation. This script lets you customize the swagger-ui instance.

<<< @/tutorials/snippets/swagger/configuration-with-js.ts

In your JavaScript file, you can handle Swagger-ui configuration and the instance:

```javascript
console.log(SwaggerUIBuilder.config); //Swagger-ui config

document.addEventListener("swagger.init", (evt) => {
  console.log(SwaggerUIBuilder.ui); //Swagger-ui instance
});
```

## Decorators

These decorators already add a documentation on Swagger:

<ApiList query="((symbolName: Header OR Status) OR (tags: schema)) AND tags: decorator" />

In addition, the Ts.ED Swagger plugin gives some decorators to manage documentation:

<ApiList query="(symbolName: Docs OR Hidden) AND symbolType: decorator" />

## Authors

<GithubContributors :users="['vologab', 'Romakita']"/>

## Maintainers

<GithubContributors :users="['Romakita']"/>
