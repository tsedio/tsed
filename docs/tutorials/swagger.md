---
meta:
 - name: description
   content: Use Swagger with Express, TypeScript and Ts.ED. Swagger open source and pro tools have helped millions of API developers, teams, and organizations deliver great APIs.
 - name: keywords
   content: ts.ed express typescript swagger node.js javascript decorators
---
# Swagger

<Banner src="https://swagger.io/swagger/media/assets/images/swagger_logo.svg" href="https://swagger.io/" :height="128" />

This tutorials show you, how you can configure Swagger-ui with Ts.ED. Swagger use the OpenApi
to describe a Rest API. Ts.ED operates the existing decorators as well as new decorators to build the
a spec compliant with Swagger.

## Installation

Run this command to install required dependencies by `@tsed/swagger`:

```bash
npm install --save @types/swagger-schema-official @tsed/swagger
```

Then add the following configuration in your [ServerLoader](/api/common/server/components/ServerLoader.md):

<<< @/docs/tutorials/snippets/swagger/configuration.ts

> The path option for swagger will be used to expose the documentation (ex: http://localhost:8000/api-docs).

Normally, Swagger-ui is ready. You can start your server and check if it work fine.

> Note: Ts.ED will print the swagger url in the console.

### Swagger options

Some options is available to configure Swagger-ui, Ts.ED and the default spec information.

Key | Example | Description
---|---|---
path | `/api-doc` |  The url subpath to access to the documentation.
doc | `hidden-doc` |  The documentation key used by `@Docs` decorator to create several swagger documentations.
cssPath | `${rootDir}/spec/style.css` | The path to the CSS file.
jsPath | `${rootDir}/spec/main.js` | The path to the JS file.
showExplorer | `true` | Display the search field in the navbar.
spec | `{swagger: "2.0"}` | The default information spec.
specPath | `${rootDir}/spec/swagger.base.json` | Load the base spec documentation from the specified path.
outFile | `${rootDir}/spec/swagger.json` | Write the `swagger.json` spec documentation on the specified path.
hidden | `true` | Hide the documentation in the dropdown explorer list.
options | Swagger-UI options | SwaggerUI options. See (https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md)
operationIdFormat | `%c.%m` | Format of operationId field (`%c`: class name, `%m`: method name).

### Multi documentations

It also possible to create several swagger documentations with `doc` option:

<<< @/docs/tutorials/snippets/swagger/multi-spec.ts

Then use `@Docs` decorators on your controllers to specify where the controllers should be displayed.

<<< @/docs/tutorials/snippets/swagger/multi-spec-controllers.ts

## Decorators

These decorators already add a documentation on swagger:

<ApiList query="['Header', 'Status'].indexOf(symbolName) > -1 || status.indexOf('jsonschema') > -1" />

In addition, the Ts.ED swagger plugin given some decorators to write documentation:

<ApiList query="module === '@tsed/swagger' && symbolType === 'decorator'" />

## Examples
#### Model documentation

One of the feature of Ts.ED is the model definition to serialize or deserialize a
JSON Object (see [converters section](/docs/converters.md)).

This model can used on a method controller along with [@BodyParams](/api/common/filters/decorators/BodyParams.md) or other decorators.

<<< @/docs/tutorials/snippets/swagger/model.ts

#### Endpoint documentation

<<< @/docs/tutorials/snippets/swagger/endpoint-documentation.ts

::: tip
For endpoint which returns an array you have to use @@ReturnsArray@@ decorator instead of @@Returns@@
:::

::: warning
To update the `swagger.json` you have to reload the server before.
:::

## Import Javascript

It possible to import a Javascript in the Swagger-ui documentation. This script let you customize the swagger-ui instance. 

<<< @/docs/tutorials/snippets/swagger/configuration-with-js.ts

In your JavaScript file, you can handle Swagger-ui configuration and the instance:

```javascript
console.log(SwaggerUIBuilder.config); //Swagger-ui config

document.addEventListener('swagger.init', (evt) => {
    console.log(SwaggerUIBuilder.ui); //Swagger-ui instance
});
```

::: tip Credits
Thanks to [vologab](https://github.com/vologab) for his contribution.
:::
