---
meta:
 - name: description
   content: Use template engine with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and use TypeScript language.
 - name: keywords
   content: template engine consolidate ts.ed express typescript node.js javascript decorators
---
# Templating

@@View@@ is a decorator which can be used on a controller method (endpoint).
This decorator will use the data returned by the method, and the configured view to create the response.

<figure><img src="./../assets/templating-engine.png" style="max-height: 300px; padding:20px"></figure>

## Configuration

Ts.ED is using [consolidate](https://github.com/tj/consolidate.js) under the hood.
The default, template engine installed with Ts.ED is [EJS](https://ejs.co/).
If you want to use another engine, please refer to the engine documentation and [consolidate](https://github.com/tj/consolidate.js) to install the engine correctly.

<<< @/docs/docs/snippets/templating/configuration.ts

::: tip
See [supported engines is available here](https://github.com/tj/consolidate.js#supported-template-engines).
:::

## Options

```typescript
export interface PlatformViewsSettings {
 /**
  * Views directory.
  */
  root?: string;
  /**
   * Enable cache. Ts.ED enable cache in PRODUCTION profile by default.
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
### With decorator

Here is an example of a controller using the @@View@@ decorator:

<Tabs class="-code">
  <Tab label="EventCtrl.ts">
  
<<< @/docs/docs/snippets/templating/response-templating.ts

  </Tab>
  <Tab label="event.ejs">
  
```html
<h1><%- name %></h1>
<div>
  Start: <%- startDate %>
</div>
```

  </Tab>
</Tabs>

::: tip

Like Express.js or Koa.js, @@View@@ decorator use `express.response.locals` or `koa.context.state` to populate data before 
rendering the template. See [Locals](/docs/controllers.html#locals) decorator usage for more information.

:::

### With render method

It's also possible to render a views by injecting and using @@PlatformResponse@@ instance.

<Tabs class="-code">
  <Tab label="EventCtrl.ts">
  
<<< @/docs/docs/snippets/templating/template-platform-api.ts

  </Tab>
  <Tab label="event.ejs">
  
```html
<h1><%- name %></h1>
<div>
  Start: <%- startDate %>
</div>
```

  </Tab>
</Tabs>

### With PlatformViews

Ts.ED provides the @@PlatformViews@@ service to render views. In fact, @@View@@ decorator use `PlatformResponse.render()` method which itself uses the `PlatformViews.render()` method.
It useful, if you want render a template from a service.

<<< @/docs/docs/snippets/templating/template-platform-views.ts

## Caching

To enable caching simply pass `{ cache: true }` to the @@View@@ decorator.
All engines that consolidate.js implements I/O for will cache the file contents, ideal for production environments.

<<< @/docs/docs/snippets/templating/template-cache.ts

::: tip
Ts.ED enable cache by default in `PRODUCTION` profile.
:::