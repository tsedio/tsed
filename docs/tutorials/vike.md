---
meta:
  - name: description
    content: Use Vike with Ts.ED. A SSR plugin to render page using Vite and your favorite front-end framework (React.js, Vue.js, etc...).
  - name: keywords
    content: ts.ed express typescript vite ssr plugin node.js javascript decorators
projects:
  - title: Vike react example
    href: https://github.com/tsedio/tsed-vite-plugin-ssr-example
    src: https://vite-plugin-ssr.com/assets/static/vite-plugin-ssr.5177312a.svg
---

# Vike

<Banner src="https://vite-plugin-ssr.com/assets/static/vite-plugin-ssr.5177312a.svg" href="https://vite-plugin-ssr.com/" height="200" />

> Like Next.js/Nuxt but as do-one-thing-do-it-well Vike.

Use **any UI framework** (React, Vue, Svelte, Solid, ...) and **any tool** you want (any frontend library, web
technology, deploy environment, Vite plugin, ...).

With `vike`, you integrate tools manually and keep `architectural control`.

::: tip
You can read also this article over Ts.ED + Vite-plugin-ssr on Medium:
https://romainlenzotti.medium.com/use-vite-and-ts-ed-to-build-your-website-84fb4c0d8079
:::

## Features

- Use `@Vike` decorator to generate a page using `vike`
- Render a page using any UI framework (React, Vue, Svelte, Solid, ...)

## Quick start

<Projects type="projects"/>

## Installation

```bash
npm install vike @tsed/vite-ssr-plugin vite@4 --save
```

Then edit your `Server.ts`:

```ts
import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/vite-ssr-plugin"; // add this
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

The start project is a monorepo (Nx) with 2 projects:

- `packages/server`: the backend project
  - `packages/server/controllers/pages`: the controllers pages directory
  - `packages/server/controllers/rest`: the controllers Rest directory
- `packages/app`: the frontend project
  - `packages/app/pages`: the pages directory
  - `packages/app/renderer`: the app shell directory (header, footer, layout, etc...)

## Usage

```ts
import {Constant, Controller} from "@tsed/di";
import {HeaderParams} from "@tsed/platform-params";
import {Vite} from "@tsed/vite-ssr-plugin";
import {SwaggerSettings} from "@tsed/swagger";
import {Get, Hidden, Returns} from "@tsed/schema";

@Hidden()
@Controller("/")
export class IndexController {
  @Constant("swagger")
  private swagger: SwaggerSettings[];

  @Get("/")
  @Vite()
  @Returns(200, String).ContentType("text/html")
  get(@HeaderParams("x-forwarded-proto") protocol: string, @HeaderParams("host") host: string) {
    const hostUrl = `${protocol || "http"}://${host}`;

    return {
      docs: this.swagger.map((conf) => {
        return {
          url: hostUrl + conf.path,
          ...conf
        };
      })
    };
  }
}
```

And his React component:

```ts
import React from "react";
import {PageContext} from "../../renderer/types";
import type {SwaggerSettings} from "@tsed/swagger"; // ! keep type import

export interface HomePageProps {
  docs: ({url: string} & SwaggerSettings)[];
}

export function Page({docs}: PageContext & HomePageProps) {
  return (
    <>
      <h1>Welcome,</h1>

      <p>This page is built with Ts.ED and vike.</p>

      <br />
      <br />

      <ul>
        {docs.map((doc) => {
          return (
            <li>
              <a href={doc.path}>
                <span>OpenSpec {doc.specVersion}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
```

Result:

<figure><img src="/vike-tsed.png" style="max-height: 300px; background: white"></figure>

## Add a controlled page

By default, vike does Filesystem Routing:

```
FILESYSTEM                        URL
pages/index.page.js               /
pages/about.page.js               /about
pages/faq/index.page.js           /faq
pages/movies/@id/index.page.js    /movies/1, /movies/2, /movies/3, ...
```

So if you want to expose a movies page with the following url `/movies` url, create a new
file `packages/app/pages/movies/index.page.tsx`:

```tsx
import React from "react";
import {PageContext} from "../../renderer/types";

interface Movie {
  id: string;
  title: string;
}

export interface MoviesPageProps {
  movies: Movie[];
}

export function Page({movies}: PageContext & MoviesPageProps) {
  return (
    <>
      <h1>Movies,</h1>

      <ul>
        {movies.map((doc) => {
          return (
            <li>
              <a href={"/movies/" + movies.id}>
                <span>{movies.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
```

::: tip
You can also define so-called "Route Strings" and "Route Functions".

```tsx
// /pages/movies.page.route.js

// This file defines the route of `/pages/movies.page.js`

// Route String
export default "/movies/@movieId";
```

:::

Then create a new Ts.ED controller `MoviesController` under `packages/server/src/controllers/pages` to handle all
request that match the "/movies" route:

```ts
import {Controller, Get} from "@tsed/common";

class Movie {
  @Property()
  id: string;

  @Property()
  title: string;
}

@Controller("/movies")
export class MoviesController {
  @Get("/")
  @Returns(200, Array).Of(Movie)
  @Vite()
  get() {
    return [
      {id: "1", title: "Movie 1"},
      {id: "2", title: "Movie 2"},
      {id: "3", title: "Movie 3"}
    ];
  }
}
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
