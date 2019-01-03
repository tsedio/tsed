# Templating

`@ResponseView()` or `@Render()` is a decorator that can be used on a controller method (endpoint).
This decorator will use the response return by the method and will use the view to create the output.

![templating-engine](./../assets/templating-engine.png)

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

## Use decorator

```typescript
@Controller("/events")
export class EventCtrl {

    @Get("/:id")
    @Render("eventCard.ejs")
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
