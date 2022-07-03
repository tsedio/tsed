---
meta:
  - name: description
    content: Use template engine with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and uses TypeScript language.
  - name: keywords
    content: template engine tsed-engines ts.ed express typescript node.js javascript decorators
---

# Templating

@@View@@ is a decorator which can be used on a controller method (endpoint).
This decorator will use the data returned by the method, and the configured view to create the response.

<figure><img src="./../assets/templating-engine.png" style="max-height: 500px; padding:20px; background: white"></figure>

## Configuration

Install the Ts.ED engines:

<Tabs class="-code">
  <Tab label="Yarn">

```bash
$ yarn add @tsed/engines
```

  </Tab>
  <Tab label="Npm">

```bash
$ npm install --save @tsed/engines
```

  </Tab>
</Tabs>

The default template engine installed with Ts.ED is [EJS](https://ejs.co/).

<<< @/docs/snippets/templating/configuration.ts

::: tip
Supported engines is available [here](https://github.com/tsedio/tsed-engines/blob/production/packages/engines/readme.md#supported-template-engines).
:::

## Use consolidate (deprecated)

Ts.ED is using by default [consolidate](https://github.com/tj/consolidate.js) under the hood, but the usage of this module is now deprecated.

You can use it by uninstalling `@tsed/engines` module. Ts.ED will fallback automatically to consolidate.

::: warning
Ts.ED v7 will switch on [`@tsed/engines`](https://github.com/tsedio/tsed-engines) implementation. Consolidate will be removed from dependencies.
:::

## Options

```typescript
export interface PlatformViewsSettings {
  /**
   * Views directory.
   */
  root?: string;
  /**
   * Enable cache. Ts.ED enables cache in PRODUCTION profile by default.
   */
  cache?: boolean;
  /**
   * Provide extensions mapping to match the expected engines.
   */
  extensions?: Partial<PlatformViewsExtensionsTypes>;
  /**
   * Default view engine extension.
   * Allow omitting extension when using View decorator or render method.
   */
  viewEngine?: string;
  /**
   * Options mapping for each engine.
   */
  options?: Partial<PlatformViewsEngineOptions>;
}
```

## Usage

### With @tsed/engines

Template engines are exposed via the `requires` Map, but they are not instantiated until you've called the `getEngine(engine).render()` method.
You can instantiate them manually beforehand if you want to add filters, globals, mixins, or other engine features.

::: tip Reference
[Template Engine Instances](https://github.com/tsedio/tsed-engines/blob/production/packages/engines/readme.md#template-engine-instances).
:::

### With Consolidate (deprecated)

Template engines are exposed via the `consolidate.requires` object, but they are not instantiated until you've called the `consolidate[engine].render()` method.
You can instantiate them manually beforehand if you want to add filters, globals, mixins, or other engine features.

::: tip Reference
[Template Engine Instances](https://github.com/tj/consolidate.js#template-engine-instances).
:::

### Nunjucks

```typescript
import {Configuration} from "@tsed/common";
import nunjucks from "nunjucks";

const nunjucksInstances = nunjucks.configure("./views");
nunjucksInstances.addFilter("foo", function () {
  return "bar";
});

@Configuration({
  views: {
    root: `${rootDir}/views`,
    viewEngine: "nunjucks",
    extensions: {
      njk: "nunjucks"
    },
    options: {
      nunjucks: {
        requires: nunjucksInstances
      }
    }
  }
})
export default class ShopApp {}
```

### With decorator

Here is an example of a controller using the @@View@@ decorator:

<Tabs class="-code">
  <Tab label="EventCtrl.ts">

<<< @/docs/snippets/templating/response-templating.ts

  </Tab>
  <Tab label="event.ejs">

```html
<h1><%- name %></h1>
<div>Start: <%- startDate %></div>
```

  </Tab>
</Tabs>

::: tip

Like Express.js or Koa.js, @@View@@ decorator uses `express.response.locals` or `koa.context.state` to populate data before
rendering the template. See [Locals](/docs/controllers.html#locals) decorator usage for more information.

:::

### With render method

It's also possible to render a view by injecting and using @@PlatformResponse@@ instance.

<Tabs class="-code">
  <Tab label="EventCtrl.ts">

<<< @/docs/snippets/templating/template-platform-api.ts

  </Tab>
  <Tab label="event.ejs">

```html
<h1><%- name %></h1>
<div>Start: <%- startDate %></div>
```

  </Tab>
</Tabs>

### With PlatformViews

Ts.ED provides the @@PlatformViews@@ service to render views. In fact, @@View@@ decorator uses `PlatformResponse.render()` method which itself uses the `PlatformViews.render()` method.
It is useful if you want to render a template from a service.

<<< @/docs/snippets/templating/template-platform-views.ts

## Caching

To enable caching, simply pass `{ cache: true }` to the @@View@@ decorator.
All engines that `consolidate.js` / [`@tsed/engines`](https://github.com/tsedio/tsed-engines) implements I/O for, will cache the file contents, ideal for production environments.

<<< @/docs/snippets/templating/template-cache.ts

::: tip
Ts.ED enables cache by default in `PRODUCTION` profile.
:::
