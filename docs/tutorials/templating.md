# Templating

`@ResponseView()` or `@Render()` is a decorator that can be used on a controller method (endpoint).
This decorator will use the response return by the method and will use the view to create the output.

![templating-engine](_media/templating-engine.png)

## Installation
This example use EJS as engine rendering. To use other engine, see the documentation of the concerned project. 
```typescript
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`
   ]
})
class Server extends ServerLoader {

    async $onMountingMiddlewares()  {

        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        this.use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        // EJS Engine Setting
        this.engine('.html', require('ejs').__express)
            .set('views', './views')
            .set('view engine', 'html');
    }
}
```

> The configuration engine is exactly the same as Express configuration engine. 

## Use decorator

```typescript
@Controller("/events")
export class EventCtrl {

    @Get("/:id")
    @Render("eventCard")
    public get(request: Express.Request, response: Express.Response): any {
        return {startDate: new Date(), name: "MyEvent"};
    }
}
```
> @Render() is an alias of @ResponseView().

## Create your template

`views/eventCard.html`
```html
<h1><%- name %></h1>
<div>
    Start: <%- startDate %>
</div>
```

<div class="guide-links">
<a href="#/tutorials/serve-static-files">Serve static files</a>
<a href="#/tutorials/throw-http-exceptions">Throw HTTP exceptions</a>
</div>