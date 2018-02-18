# @tsed/swagger
> Experimental feature. You can contribute to improve this feature !

A package of Ts.ED framework. See website: https://romakita.github.io/ts-express-decorators/

## Installation

Before using the Swagger, we need to install the [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) module.

```bash
npm install --save-dev @types/swagger-schema-official 
npm install --save swagger-ui-express @tsed/swagger
```

Then add the following configuration in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module
import Path = require("path");
const rootDir = Path.resolve(__dirname)

@ServerSettings({
  rootDir,
  swagger: {
      path: "/api-docs"
  }
})
export class Server extends ServerLoader {

}
```
> The path option for swagger will be used to expose the documentation (ex: http://localhost:8000/api-docs).

Normally, Swagger-ui is ready. You can start your server and check if it work fine.

> Note: Ts.ED will print the swagger url in the console.

### Swagger options

Some options is available to configure Swagger-ui, Ts.ED and the default spec information.

Key | Example | Description
---|---|---
path | `/api-doc` |  The url subpath to access to the documentation.
cssPath | `${rootDir}/spec/style.css` | The path to the CSS file.
showExplorer | `true` | Display the search field in the navbar.
spec | `{swagger: "2.0"}` | The default information spec.
specPath | `${rootDir}/spec/swagger.json` | The path to the swagger.json. This file will be written at the first server starting if it doesn't exist. The data will me merge with the collected data via annotation.



## Examples
#### Model documentation

One of the feature of Ts.ED is the model definition to serialize or deserialize a
JSON Object (see [converters section](docs/converters.md)).

This model can used on a method controller along with [@BodyParams](api/common/filters/bodyparams.md) or other decorators.

```typescript
import {JsonProperty} from "@tsed/common";
import {Title, Description, Example} from "@tsed/swagger";

export class CalendarModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("example1", "Description example")
  @JsonProperty()
  public id: string;

  @JsonProperty()
  public name: string;
}
```

#### Endpoint documentation

```typescript
import {Controller, Get, Post} from "@tsed/common";
import {Summary, Description, Responses,Deprecated, Security} from "@tsed/swagger";
@Controller('/calendars')
export class Calendar {
    
    @Get('/:id')
    @Summary("Summary of this route")
    @Description("Description of this route")
    @Returns("404", {description: "Not found"})
    async getCalendar(@QueryParam() id: string): Promise<CalendarModel> {
      //...
    }
    
    @Get('/v0/:id')
    @Deprecated()
    @Description("Deprecated route, use /rest/calendars/:id instead of.")
    @Returns("404", {description: "Not found"})
    getCalendarDeprecated(@QueryParam() id: string): Promise<CalendarModel> {
      //...
    }

    @Post('/')
    @Security("calendar_auth", "write:calendar", "read:calendar")
    async createCalendar(): Promise<CalendarModel> {
        //...
    }
}
```
!> To update the swagger.json you need to reload the server before.


## Documentation

See our documentation https://romakita.github.io/ts-express-decorators/#/api/index