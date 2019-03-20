# Templating

`@ResponseView()` or `@Render()` is a decorator which can be used on a controller method (endpoint).
This decorator will use the response return by the method and will use the view to create the output.

<figure><img src="./../assets/templating-engine.png" style="max-height: 300px; padding:20px"></figure>

## Installation

This example use EJS as engine rendering. To use other engine, see the documentation of the concerned project. 
```typescript
import {ServerSettings, ServerLoader} from "@tsed/common"
const cons = require("consolidate");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const rootDir = __dirname;

@ServerSettings({
   rootDir,
   viewsDir: `${rootDir}/views`,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`
   ]
})
class Server extends ServerLoader {

    $onInit(){
        this.set("views", this.settings.get('viewsDir')); // le repertoire des vues
        this.engine("ejs", cons.ejs);
    }

    async $onMountingMiddlewares()  {
        this.use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());
    }
}
```

> The configuration engine is exactly the same as Express configuration engine. 

## Usage

Template feature depending on the engine rendering use by your application. Ts.ED provide decorator `@Render` to define a view which will be used
by the Endpoint to generate the response.

Here an example of a controller which use the `@Render` decorator:

<<< @/docs/docs/snippets/controllers/response-templating.ts

And his view:
```html
<h1><%- name %></h1>
<div>
    Start: <%- startDate %>
</div>
```

::: tip
@Render() is an alias of @ResponseView().
:::

