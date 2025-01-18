---
head:
  - - meta
    - name: description
      content: Use Vike with Ts.ED. A SSR plugin to render page using Vite and your favorite front-end framework (React.js, Vue.js, etc...).
  - - meta
    - name: keywords
      content: ts.ed express typescript vite ssr plugin node.js javascript decorators react vue svelte solid
projects:
  - title: Vike react example
    href: https://github.com/tsedio/tsed-vite-react-movies-demo.git
    src: /vike.svg
  - title: Vite react example
    href: https://github.com/tsedio/tsed-vite-plugin-ssr-example
    src: https://vite-plugin-ssr.com/assets/static/vite-plugin-ssr.5177312a.svg
---

# Vike

<Banner src="/vike.svg" href="https://vite-plugin-ssr.com/" height="200" />

> Like Next.js/Nuxt but as a do-one-thing-do-it-well Vite plugin.

Use **any UI framework** (React, Vue, Svelte, Solid, ...) and **any tool** you want (any frontend library, web
technology, deploy environment, Vite plugin, ...).

With `vike`, you integrate tools manually and keep `architectural control`.

::: tip Note
Vike replaces the `vite-plugin-ssr` package. Ts.ED provides `@tsed/vite-ssr-plugin` and `@tsed/vike` packages.
All new features will only be included in the `@tsed/vike` package.

To migrate `@tsed/vite-ssr-plugin`, simply replace `@tsed/vite-ssr-plugin` by `@tsed/vike` in your code and install `vike` dependency instead of `vite-plugin-ssr`.
:::

::: tip
You can also read this article over Ts.ED + Vite-plugin-ssr on Medium:
[https://romainlenzotti.medium.com/use-vite-and-ts-ed-to-build-your-website-84fb4c0d8079](https://romainlenzotti.medium.com/use-vite-and-ts-ed-to-build-your-website-84fb4c0d8079)
:::

## Features

- Use `@Vite` decorator to generate a page using `vite`
- Render a page using any UI framework (React, Vue, Svelte, Solid, ...)

## Quick start

<Projects type="projects"/>

## Installation

```bash
npm install vike @tsed/vike vite@4 --save
```

Then edit your `Server.ts`:

```ts
import {join} from "node:path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/vike"; // add this
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config";
import * as rest from "./controllers/rest";
import * as pages from "./controllers/pages";

@Configuration({
  vite: {
    root: "../path/to/app/project"
  }
})
export class Server {}
```

We recommend you to start your project with
the [starter project](https://github.com/tsedio/tsed-vike-example).

The starter project is a monorepo (Nx) with 2 projects:

- `packages/server`: the backend project
  - `packages/server/controllers/pages`: the controllers pages directory
  - `packages/server/controllers/rest`: the controllers REST directory
- `packages/app`: the frontend project
  - `packages/app/pages`: the pages directory
  - `packages/app/renderer`: the app shell directory (header, footer, layout, etc...)

<figure><img src="/vike-tsed.png" style="max-height: 300px; background: white" alt="Vike Ts.ED result"></figure>

- `packages/server/controllers/pages`: the controllers pages directory
- `packages/server/controllers/rest`: the controllers REST directory
- `packages/app/pages`: the pages directory
- `packages/app/renderer`: the app shell directory (header, footer, layout, etc...)

```

## Author

<GithubContributors :users="['Romakita']"/>

## Maintainers <Badge text="Help wanted" />

<GithubContributors :users="['Romakita']"/>

<div class="flex items-center justify-center p-5">
<Button href="/contributing.html" class="rounded-medium">
 Become maintainer
</Button>
</div>
```
