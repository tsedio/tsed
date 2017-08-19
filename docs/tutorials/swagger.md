# Swagger
> Experimental feature. You can contribute to improve this feature !

This tutorials show you, how you can configure Swagger-ui with Ts.ED. Swagger use the OpenApi
to describe a Rest API. Ts.ED operates the existing decorators as well as new decorators to build the
a spec compliant with Swagger.

## Installation

Before using the Swagger, we need to install the [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) module.

```bash
npm install --save swagger-ui-express
```

Then add the following configuration in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/swagger"; // import swagger ts.ed module

@ServerSettings({
    rootDir: __dirname,
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
spec |  `{swagger: "2.0"}` | The default information spec. 
specPath | `${rootDir}/spec/swagger.json` | The path to the swagger.json. This file will be written at the first server starting if it doesn't exist. The data will me merge with the collected data via annotation. 

 
## Example

#### Model documentation

One of the feature of Ts.ED is the model definition to serialize or deserialize a 
JSON Object (see [converters section](docs/converters.md)).

This model can used on a method controller along with [@BodyParams](api/common/filters/bodyparams.md) or other decorators.

```typescript
import {JsonProperty} from "ts-express-decorators";
import {Title, Description, Example} from "ts-express-decorators/swagger";

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

All routes can be documented with swagger decorators. Theses decorators can be used on:

- [Summary](api/swagger/summary.md), to set a quick summary on top of the route in Swagger-ui.
- [Description](api/swagger/description.md), to set a long text to describe the route.
- [Deprecated](api/swagger/deprecated.md).
- [Responses](api/swagger/responses.md) or [Returns](api/swagger/returns.md) to describe all HTTP codes that method can answer. By default, all routes are configure on status code 200.
- [Security](api/swagger/security.md). See security section to more information.


```typescript
import {Controller, Get, Post} from "ts-express-decorators";
import {Summary, Description, Responses,Deprecated, Security} from "ts-express-decorators/swagger";
@Controller('/calendars')
export class Calendar {
    
    @Get('/:id')
    @Summary("Summary of this route")
    @Description("Description of this route")
    @Responses("404", {description: "Not found"})
    async getCalendar(@QueryParam() id: string): Promise<CalendarModel> {
      //...
    }
    
    @Get('/v0/:id')
    @Deprecated()
    @Description("Deprecated route, use /rest/calendars/:id instead of.")
    @Responses("404", {description: "Not found"})
    getCalendarDeprecated(@QueryParam() id: string): Promise<CalendarModel> {
      //...
    }}
    
    @Post('/')
    @Security("calendar_auth", "write:calendar", "read:calendar")
    async createCalendar(): Promise<CalendarModel> {
       //...
    }
```
!> To update the swagger.json you need to reload the server before.

## Security

...work in progress

## Global information

...work in progress


> Credits: Thanks to [vologab](https://github.com/vologab) to his contribution.

