# OpenAPI configuration reference

Source of truth: `OpenApiSettingsBase` in `@tsed/openapi-utils`, extended by `SwaggerSettings` (`@tsed/swagger`) and `ScalarSettings` (`@tsed/scalar`). Both configuration keys are arrays; each entry is one document served on its own `path`.

## Options shared by `swagger` and `scalar`

| Option                 | Type                                                | Default                                           | Effect                                                                                  |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `path`                 | `string`                                            | `"/"`                                             | URL of the UI. Also the cache key of the generated spec.                                |
| `specVersion`          | `"2.0" \| "3.0.1" \| "3.0.2" \| "3.0.3" \| "3.1.0"` | `"2.0"` unless `spec.openapi` is set              | Output format.                                                                          |
| `fileName`             | `string`                                            | `swagger.json` (Swagger), `openapi.json` (Scalar) | JSON route, served on `<path>/<fileName>`.                                              |
| `spec`                 | `Partial<OpenSpec2 \| OpenSpec3>`                   | `{}`                                              | Static part of the document: `info`, `servers`, `components.securitySchemes`, `tags`... |
| `specPath`             | `string`                                            | -                                                 | JSON file merged into the document as a base. A missing or invalid file is ignored.     |
| `outFile`              | `string`                                            | -                                                 | Write the generated JSON to this path at `$onReady`.                                    |
| `doc`                  | `string`                                            | -                                                 | Include only controllers decorated with `@Docs(doc)`.                                   |
| `pathPatterns`         | `string[]`                                          | -                                                 | Include only controllers whose mounted route matches (micromatch).                      |
| `operationIdFormatter` | `(name, propertyKey, path) => string`               | built-in                                          | Custom `operationId` generator.                                                         |
| `operationIdPattern`   | `string`                                            | `"%c.%m"` then camelCased                         | `%c` class name, `%m` method name. A custom pattern is not camelCased.                  |
| `sortPaths`            | `boolean`                                           | `false`                                           | Sort `paths` alphabetically.                                                            |
| `disableSpec`          | `boolean`                                           | `false`                                           | Do not serve the JSON route.                                                            |
| `viewPath`             | `string \| false`                                   | bundled EJS view                                  | Custom EJS template; `false` disables the UI and keeps the JSON route.                  |
| `cssPath`              | `string`                                            | bundled CSS                                       | Extra stylesheet served next to the UI.                                                 |
| `jsPath`               | `string`                                            | -                                                 | Extra script served next to the UI.                                                     |
| `hidden`               | `boolean`                                           | `false`                                           | Swagger only: hide this document from the UI dropdown. The routes stay served.          |

`doc` and `pathPatterns` combine with OR: a controller is included when it matches either one.

## `@tsed/swagger` only

| Option         | Effect                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `showExplorer` | Display the search field in the top bar.                                                                     |
| `options`      | Swagger UI options (`validatorUrl`, `oauth`, `layout`, ...). See the swagger-ui configuration documentation. |

`jsPath` scripts can read `SwaggerUIBuilder.config` and listen to the `swagger.init` DOM event to reach the UI instance.

## `@tsed/scalar` only

| Option    | Effect                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `cdn`     | URL of the Scalar bundle. Default `https://cdn.jsdelivr.net/npm/@scalar/api-reference`. Pin a version or self-host for production. |
| `options` | Scalar `ReferenceConfiguration` passed to the UI (theme, layout, ...).                                                             |

## Related configuration keys

- `version` (root): fallback for `info.version`.
- `acceptMimes` (root): added to the document-level `consumes` of a Swagger `2.0` document.
- `logger.disableRoutesSummary`: also silences the "JSON is available on ..." startup lines.

## Alter the generated document

```typescript
import {Configuration} from "@tsed/di";
import type {OpenSpec3} from "@tsed/openspec";
import type {SwaggerSettings} from "@tsed/swagger";

@Configuration({})
export class Server {
  $alterOpenSpec(spec: OpenSpec3, conf: SwaggerSettings) {
    spec.servers = [{url: process.env.PUBLIC_URL ?? "http://localhost:8083"}];
    return spec;
  }
}
```

The hook runs once per document, before the result is cached.

## Export the spec

### `outFile`

```typescript
swagger: [{path: "/doc", specVersion: "3.0.3", outFile: `${import.meta.dirname}/../spec/openapi.json`}];
```

Written when the server reaches `$onReady`. Good for local development; commit the file or regenerate it in CI with one of the options below.

### Script without `listen()`

`bootstrap()` loads the injector and mounts controllers but does not open a port.

```typescript
// scripts/generate-spec.ts
import {mkdir, writeFile} from "node:fs/promises";
import {dirname, join} from "node:path";
import {PlatformExpress} from "@tsed/platform-express";
import {SwaggerService} from "@tsed/swagger";
import {Server} from "../src/Server.js";

const platform = await PlatformExpress.bootstrap(Server, {logger: {level: "off"}});
const service = platform.injector.get<SwaggerService>(SwaggerService)!;

for (const conf of platform.injector.settings.get("swagger", [])) {
  const spec = await service.getOpenAPISpec(conf);
  const file = join("spec", conf.path, "openapi.json");

  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, JSON.stringify(spec, null, 2));
}

await platform.stop();
```

- With `@tsed/scalar` only, import `OpenAPIService` from `@tsed/openapi-utils` (add it as a direct dependency) and read the `scalar` key.
- `bootstrap()` still runs `$onInit` hooks: database or broker connections declared by the application are opened. Provide test doubles or environment flags when the CI job has no infrastructure.

### Ts.ED CLI plugin

`@tsed/cli-generate-swagger` registers a `generate-swagger` command that does the same and writes `swagger.json` and `swagger.yaml` per document into `--output`. Register `GenerateSwaggerCmd` in the project's `src/bin/index.ts` commands, then run `tsed run generate-swagger --output ./spec`. It requires `@tsed/swagger`. See the sibling skill `tsed-cli`.

### DI-free generation

```typescript
import {generateSpec, getSpec} from "@tsed/schema";
import {OrdersController} from "../src/controllers/OrdersController.js";

const partial = getSpec(OrdersController); // paths, tags and components of one controller
const full = generateSpec({
  tokens: [{token: OrdersController, rootPath: "/rest"}],
  specVersion: "3.0.3",
  spec: {info: {title: "Orders API", version: "1.0.0"}}
});
```

Use it in unit tests to assert the contract of one controller. It does not apply `doc` / `pathPatterns` filtering or the `$alterOpenSpec` hook.
