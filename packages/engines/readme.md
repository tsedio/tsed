<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <h1>Ts.ED Engines</h1>

[![Build & Release](https://github.com/tsedio/tsed/actions/workflows/build.yml/badge.svg)](https://github.com/tsedio/tsed/actions/workflows/build.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/docs/templating.html">Templating with Ts.ED</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

> Template engine consolidation library (inspired from consolidate) written in TypeScript.

## Feature

- Support multiple engine library,
- Extendable - You can register your own engine,
- Configurable,
- Agnostic from Express/Koa (but compatible with Express).

## Installation

```sh
npm install @tsed/engines
```

## Supported template engines

Some package has the same key name, @tsed/engines will load them according to the order number.
For example with dust, @tsed/engines will try to use in this order: `dustjs-helpers` and `dustjs-linkedin`.
If `dustjs-helpers` is installed, `dustjs-linkedin` will not be used by consolidate.

| Name                                                      | Package Name / Order                                                                                                                                                      | Website / State                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [atpl](https://github.com/soywiz/atpl.js)                 | [`npm install atpl`](https://www.npmjs.com/package/atpl)                                                                                                                  | -                                                                     |
| [bracket](https://github.com/danlevan/bracket-template)   | [`npm install bracket-template`](https://www.npmjs.com/package/bracket-template)                                                                                          | -                                                                     |
| [dot](https://github.com/olado/doT)                       | [`npm install dot`](https://www.npmjs.com/package/dot)                                                                                                                    | [(website)](http://olado.github.io/doT/)                              |
| [dust](https://github.com/linkedin/dustjs)                | [`npm install dustjs-helpers`](https://www.npmjs.com/package/dustjs-helpers) (2) or<br>[`npm install dustjs-linkedin`](https://www.npmjs.com/package/dustjs-linkedin) (3) | [(website)](http://linkedin.github.io/dustjs/)                        |
| [ect](https://github.com/baryshev/ect)                    | [`npm install ect`](https://www.npmjs.com/package/ect)                                                                                                                    | [(website)](http://ectjs.com/)                                        |
| [ejs](https://github.com/mde/ejs)                         | [`npm install ejs`](https://www.npmjs.com/package/ejs)                                                                                                                    | [(website)](http://ejs.co/)                                           |
| [hamlet](https://github.com/gregwebs/hamlet.js)           | [`npm install hamlet`](https://www.npmjs.com/package/hamlet)                                                                                                              | -                                                                     |
| [hamljs](https://github.com/visionmedia/haml.js)          | [`npm install hamljs`](https://www.npmjs.com/package/hamljs)                                                                                                              | -                                                                     |
| [haml-coffee](https://github.com/netzpirat/haml-coffee)   | [`npm install haml-coffee`](https://www.npmjs.com/package/haml-coffee)                                                                                                    | -                                                                     |
| [handlebars](https://github.com/wycats/handlebars.js/)    | [`npm install handlebars`](https://www.npmjs.com/package/handlebars)                                                                                                      | [(website)](http://handlebarsjs.com/)                                 |
| [hogan](https://github.com/twitter/hogan.js)              | [`npm install hogan.js`](https://www.npmjs.com/package/hogan.js)                                                                                                          | [(website)](http://twitter.github.com/hogan.js/)                      |
| [htmling](https://github.com/codemix/htmling)             | [`npm install htmling`](https://www.npmjs.com/package/htmling)                                                                                                            | -                                                                     |
| [jazz](https://github.com/shinetech/jazz)                 | [`npm install jazz`](https://www.npmjs.com/package/jazz)                                                                                                                  | -                                                                     |
| [just](https://github.com/baryshev/just)                  | [`npm install just`](https://www.npmjs.com/package/just)                                                                                                                  | -                                                                     |
| [liquor](https://github.com/chjj/liquor)                  | [`npm install liquor`](https://www.npmjs.com/package/liquor)                                                                                                              | -                                                                     |
| [lodash](https://github.com/bestiejs/lodash)              | [`npm install lodash`](https://www.npmjs.com/package/lodash)                                                                                                              | [(website)](http://lodash.com/)                                       |
| [marko](https://github.com/marko-js/marko)                | [`npm install marko`](https://www.npmjs.com/package/marko)                                                                                                                | [(website)](http://markojs.com)                                       |
| [mote](https://github.com/satchmorun/mote)                | [`npm install mote`](https://www.npmjs.com/package/mote)                                                                                                                  | [(website)](http://satchmorun.github.io/mote/)                        |
| [mustache](https://github.com/janl/mustache.js)           | [`npm install mustache`](https://www.npmjs.com/package/mustache)                                                                                                          | -                                                                     |
| [nunjucks](https://github.com/mozilla/nunjucks)           | [`npm install nunjucks`](https://www.npmjs.com/package/nunjucks)                                                                                                          | [(website)](https://mozilla.github.io/nunjucks)                       |
| [plates](https://github.com/flatiron/plates)              | [`npm install plates`](https://www.npmjs.com/package/plates)                                                                                                              | -                                                                     |
| [pug](https://github.com/pugjs/pug)                       | [`npm install pug`](https://www.npmjs.com/package/pug)                                                                                                                    | [(website)](http://jade-lang.com/) / **(formerly jade)**              |
| [ractive](https://github.com/ractivejs/ractive)           | [`npm install ractive`](https://www.npmjs.com/package/ractive)                                                                                                            | -                                                                     |
| [react](https://github.com/facebook/react)                | [`npm install react`](https://www.npmjs.com/package/react)                                                                                                                | -                                                                     |
| [slm](https://github.com/slm-lang/slm)                    | [`npm install slm`](https://www.npmjs.com/package/slm)                                                                                                                    | -                                                                     |
| [squirrelly](https://github.com/squirrellyjs/squirrelly)  | [`npm install squirrelly`](https://www.npmjs.com/package/squirrelly)                                                                                                      | [(website)](https://squirrelly.js.org)                                |
| [swig](https://github.com/node-swig/swig-templates)       | [`npm install swig-templates`](https://www.npmjs.com/package/swig-templates) (2)                                                                                          | -                                                                     |
| [teacup](https://github.com/goodeggs/teacup)              | [`npm install teacup`](https://www.npmjs.com/package/teacup)                                                                                                              | -                                                                     |
| [templayed](https://github.com/archan937/templayed.js/)   | [`npm install templayed`](https://www.npmjs.com/package/templayed)                                                                                                        | [(website)](http://archan937.github.com/templayed.js/)                |
| [twig](https://github.com/justjohn/twig.js)               | [`npm install twig`](https://www.npmjs.com/package/twig)                                                                                                                  | [(wiki)](https://github.com/twigjs/twig.js/wiki/Implementation-Notes) |
| [twing](https://github.com/NightlyCommit/twing)           | [`npm install twing`](https://www.npmjs.com/package/twing)                                                                                                                | [(website)](https://nightlycommit.github.io/twing/)                   |
| [underscore](https://github.com/documentcloud/underscore) | [`npm install underscore`](https://www.npmjs.com/package/underscore)                                                                                                      | [(website)](http://underscorejs.org/#template)                        |
| [vash](https://github.com/kirbysayshi/vash)               | [`npm install vash`](https://www.npmjs.com/package/vash)                                                                                                                  | -                                                                     |
| [velocityjs](https://github.com/julianshapiro/velocity)   | [BETA](https://www.npmjs.com/package/velocity-animate)                                                                                                                    | [(website)](http://velocityjs.org/)                                   |
| [walrus](https://github.com/jeremyruppel/walrus)          | [`npm install walrus`](https://www.npmjs.com/package/walrus)                                                                                                              | [(website)](http://documentup.com/jeremyruppel/walrus/)               |
| [whiskers](https://github.com/gsf/whiskers.js)            | [`npm install whiskers`](https://www.npmjs.com/package/whiskers)                                                                                                          | -                                                                     |

> **NOTE**: you must still install the engines you wish to use, add them to your package.json dependencies.

## API

You can get an engine by using `engines`:

```typescript
import {getEngine} from "@tsed/engines";

getEngine("swig")
  .renderFile({user: "tobi"})
  .then((html) => {
    console.log(html);
  });
```

Or render directly a template:

```typescript
import {getEngine} from "@tsed/engines";

getEngine("ejs")
  .render("<p><%= user.name %></p>")
  .then((html) => {
    console.log(html);
  });
```

## Caching

To enable caching simply pass `{ cache: true }`. EnginesContainer _may_ use this option to cache things reading the file contents, compiled `Function`s etc.
EnginesContainer which do _not_ support this may simply ignore it. All engines that consolidate.js implements I/O for will cache the file contents, ideal for production environments.
When using @tsed/engines directly: `getEngine('swig').renderFile('views/page.html', { user: 'tobi', cache: true });`

Using supported Express versions: `app.locals.cache = true` or set NODE_ENV to 'production' and Express will do this for you.

## Express example

`@tsed/engines` can be used with Express as following:

```typescript
import express from "express";
import {getEngine} from "@tsed/engines";

// assign the swig engine to .html files
app.engine("html", getEngine("swig"));

// set .html as the default extension
app.set("view engine", "html");
app.set("views", __dirname + "/views");

var users = [];
users.push({name: "tobi"});
users.push({name: "loki"});
users.push({name: "jane"});

app.get("/", function (req, res) {
  res.render("index", {
    title: "Ts.ED EnginesContainer"
  });
});

app.get("/users", function (req, res) {
  res.render("users", {
    title: "Users",
    users: users
  });
});

app.listen(3000);
console.log("Express server listening on port 3000");
```

## Koa

`@tsed/engines` can be used with Koa as following:

```typescript
import {getEngines} from "./getEngines.js";

var views = require("koa-views");

const render = views(__dirname + "/views", {
  engineSource: getEngines(),
  map: {
    html: "underscore"
  }
});

// Must be used before any router is used
app.use(render);
// OR Expand by app.context
// No order restrictions
// app.context.render = render()

app.use(async function (ctx) {
  ctx.state = {
    session: this.session,
    title: "app"
  };

  await ctx.render("user", {
    user: "John"
  });
});
```

## Template Engine Instances

Template engines are exposed via the `requires` object, but they are not instantiated until you've called the `getEngine(engine).render()` method.
You can instantiate them manually beforehand if you want to add filters, globals, mixins, or other engine features.

```typescript
import {requires} from "consolidate";
import nunjucks from "nunjucks";

// add nunjucks to requires so filters can be
// added and the same instance will be used inside the render method
requires.set("nunjucks", nunjucks.configure());

requires.get("nunjucks").addFilter("foo", () => {
  return "bar";
});
```

## Implement your own engine

`@tsed/engines` let you register your own engine by using the `@ViewEngine` decorator. Here an is example of
pug engine implementation:

```typescript
import {Engine, ViewEngine} from "@tsed/engines";

@ViewEngine("pug", {
  requires: ["pug", "then-pug"] // multiple require is possible. Ts.ED will use the first module resolved from node_modules
})
export class PugEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.compile(template, options);
  }

  protected async $compileFile(file: string, options: any) {
    return this.engine.compileFile(file, options);
  }
}
```

See more examples in `packages/engines/src/components` directory.

## Override engine

```typescript
import {PugEngine} from "@tsed/engines";

@ViewEngine("pug", {
  requires: ["pug", "then-pug"] // multiple require is possible. Ts.ED will use the first module resolved from node_modules
})
export class CustomePugEngine extends PugEngine {
  protected $compile(template: string, options: any) {
    return super.$compile(template, options);
  }

  protected async $compileFile(file: string, options: any) {
    return super.$compileFile(file, options);
  }
}
```

## Notes

- If you're using Nunjucks, please take a look at the `exports.nunjucks.render` function in `packages/engines/src/components/NunjuncksEngine.ts`. You can pass your own engine/environment via `options.nunjucksEnv`, or if you want to support Express you can pass `options.settings.views`, or if you have another use case, pass `options.nunjucks` (see the code for more insight).
- You can pass **partials** with `options.partials`
- For using **template inheritance** with nunjucks, you can pass a loader
  with `options.loader`.
- `React` To render content into a html base template (eg. `index.html` of your React app), pass the path of the template with `options.base`.

## Contributors

Please read [contributing guidelines here](https://tsed.dev/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2021 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
