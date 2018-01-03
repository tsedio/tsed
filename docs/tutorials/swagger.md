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
import "ts-express-decorators/swagger"; // import swagger Ts.ED module

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

## Decorators

These decorators already add a documentation on swagger:

<ul class="api-list">
<li class="api-item" data-symbol="common/mvc;Header;decorator;@;false;false;false;true"><a href="#/api/common/mvc/header" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Header" title="Header"><span class="symbol decorator"></span>Header</a></li>
<li class="api-item" data-symbol="common/mvc;Status;decorator;@;false;false;false;true"><a href="#/api/common/mvc/status" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Status" title="Status"><span class="symbol decorator"></span>Status</a></li>
</ul>

In addition, the Ts.ED swagger plugin given some decorators to write documentation:

<ul class="api-list">
<li class="api-item" data-symbol="swagger;BaseParameter;decorator;@;false;false;false;true"><a href="#/api/swagger/baseparameter" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-BaseParameter" title="BaseParameter"><span class="symbol decorator"></span>BaseParameter</a></li>
<li class="api-item" data-symbol="swagger;Deprecated;decorator;@;false;false;false;false"><a href="#/api/swagger/deprecated" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Description" title="Deprecated"><span class="symbol decorator"></span>Deprecated</a></li>
<li class="api-item" data-symbol="swagger;Description;decorator;@;false;false;false;false"><a href="#/api/swagger/description" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Description" title="Description"><span class="symbol decorator"></span>Description</a></li>
<li class="api-item" data-symbol="swagger;Example;decorator;@;false;false;false;false"><a href="#/api/swagger/example" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Example" title="Example"><span class="symbol decorator"></span>Example</a></li>
<li class="api-item" data-symbol="swagger;Name;decorator;@;false;false;false;false"><a href="#/api/swagger/name" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Name" title="Name"><span class="symbol decorator"></span>Name</a></li>
<li class="api-item" data-symbol="swagger;Operation;decorator;@;false;false;false;true"><a href="#/api/swagger/operation" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Operation" title="Operation"><span class="symbol decorator"></span>Operation</a></li>
<li class="api-item" data-symbol="swagger;Responses;decorator;@;false;false;false;false"><a href="#/api/swagger/responses" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Responses" title="Responses"><span class="symbol decorator"></span>Responses</a></li>
<li class="api-item" data-symbol="swagger;Returns;decorator;@;false;false;false;false"><a href="#/api/swagger/returns" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Returns" title="Returns"><span class="symbol decorator"></span>Returns</a></li>
<li class="api-item" data-symbol="swagger;ReturnsArray;decorator;@;false;false;false;false"><a href="#/api/swagger/returnsarray" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-ReturnsArray" title="ReturnsArray"><span class="symbol decorator"></span>ReturnsArray</a></li>
<li class="api-item" data-symbol="swagger;Schema;decorator;@;false;false;false;false"><a href="#/api/swagger/schema" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Schema" title="Schema"><span class="symbol decorator"></span>Schema</a></li>
<li class="api-item" data-symbol="swagger;Security;decorator;@;false;false;false;false"><a href="#/api/swagger/security" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Security" title="Security"><span class="symbol decorator"></span>Security</a></li>
<li class="api-item" data-symbol="swagger;Summary;decorator;@;false;false;false;false"><a href="#/api/swagger/summary" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Summary" title="Summary"><span class="symbol decorator"></span>Summary</a></li>
<li class="api-item" data-symbol="swagger;Title;decorator;@;false;false;false;false"><a href="#/api/swagger/title" class="symbol-container deprecated symbol-type-decorator symbol-name-swagger-Title" title="Title"><span class="symbol decorator"></span>Title</a></li>
</ul>
 
## Examples
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

```typescript
import {Controller, Get, Post} from "ts-express-decorators";
import {Summary, Description, Responses,Deprecated, Security} from "ts-express-decorators/swagger";
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
    }}
    
    @Post('/')
    @Security("calendar_auth", "write:calendar", "read:calendar")
    async createCalendar(): Promise<CalendarModel> {
       //...
    }
```
!> To update the swagger.json you need to reload the server before.

> Credits: Thanks to [vologab](https://github.com/vologab) to his contribution.

<div class="guide-links">
<a href="#/tutorials/socket-io">Socket.io</a>
<a href="#/tutorials/ajv">Validation with AJV</a>
</div>