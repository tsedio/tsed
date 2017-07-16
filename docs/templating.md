[Home](https://github.com/Romakita/ts-express-decorators/wiki) > Templating

> This feature is available only for TsExpressDecorators v1.3.x on higher.

TsExpressDecorators v1.3.0 introduce a new decorator `@ResponseView` to separate rendering view from response data.

## Installation

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

    public $onMountingMiddlewares(): void | Promise  {

        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        this.use(morgan('dev'))
            .use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        // EJS Engine Setting
        this.engine('.html', require('ejs').__express)
            .set('views', './webapp')
            .set('view engine', 'html');
    }
}
```

## Use decorator @ResponseView or @Render

```typescript
@Controller("/events")
export class EventCtrl {

    @Get("/:id")
    @ResponseView("eventCard")
    public get(request: Express.Request, response: Express.Response): any {
        return {startDate: new Date(), name: "MyEvent"};
    }
}
```