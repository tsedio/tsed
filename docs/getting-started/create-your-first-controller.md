---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
meta:
  - name: description
    content: Create your first controller. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: controller getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Create your first controller

Create a new `CalendarCtrl.ts` in your controllers directory (by default `root/controllers`).
All controllers declared with @@Controller@@ decorators are considered as Platform routers (Express.Router, Koa.Router, ...).
A Platform router requires a path (here, the path is `/calendars`) to expose an url on your server.
More precisely, it's a part of a path, and the entire exposed url depends on the Server configuration (see [Configuration](/docs/configuration.md))
and the [children controllers](/docs/controllers.md).

In this case, we have no dependencies and the root endpoint is set to `/rest`.
So the controller's url will be `http://host/rest/calendars`.

<<< @/docs/snippets/controllers/basic-controller.ts

::: tip
Decorators @@Get@@, @@Post@@, @@Delete@@, @@Put@@, etc., support dynamic pathParams (eg: `/:id`) and `RegExp` like Express API.

See [Controllers](/docs/controllers.md) section for more details
:::

::: warning
You have to configure [engine rendering](/tutorials/templating) if you want to use the decorator @@Render@@.
:::

The `CalendarCtrl` you just added needs to be connected by exporting it. Find a `index.ts` in my case in the `/rest/` folder and add the following line:

```
export * from "./CalendarCtrl";
```

To test your method, just run your `server.ts` and send an HTTP request on `/rest/calendars/`.

### Ready for More?

We’ve briefly introduced the most basic features of Ts.ED - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!
