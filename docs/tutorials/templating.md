# Templating

@@ResponseView@@ or @@Render@@ is a decorator which can be used on a controller method (endpoint).
This decorator will use the response return by the method and will use the view to create the output.

<figure><img src="./../assets/templating-engine.png" style="max-height: 300px; padding:20px"></figure>

## Installation

This example use [EJS](https://ejs.co/) as engine rendering. To use other engine, see the documentation of the concerned project. 

<<< @/docs/tutorials/snippets/templating/configuration.ts

> The configuration engine is exactly the same as Express configuration engine. 

## Usage

A template engine like [EJS](https://ejs.co/) or [Handlebars](https://handlebarsjs.com/) can be used to change the response returned by your endpoint.
Like Express.js, you need to configure the templating engine so that you can use it later with the @@Render@@ decorator.

Here is an example of a controller which uses the @@Render@@ decorator:

<<< @/docs/docs/snippets/controllers/response-templating.ts

And his view:
```html
<h1><%- name %></h1>
<div>
    Start: <%- startDate %>
</div>
```

::: tip
@@Render@@ is an alias of @@ResponseView@@.
:::

