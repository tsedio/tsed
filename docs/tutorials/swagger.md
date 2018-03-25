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
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

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
spec | `{swagger: "2.0"}` | The default information spec.
specPath | `${rootDir}/spec/swagger.json` | The path to the swagger.json. This file will be written at the first server starting if it doesn't exist. The data will me merge with the collected data via annotation.

## Decorators

These decorators already add a documentation on swagger:

<ul class="api-list"><li class="api-item" data-symbol="common/mvc;Header;decorator;@;false;false;false;false"><a href="#/api/common/mvc/header"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Header"title="Header"><span class="symbol decorator"></span>Header</a></li><li class="api-item" data-symbol="common/mvc;Status;decorator;@;false;false;false;false"><a href="#/api/common/mvc/status"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Status"title="Status"><span class="symbol decorator"></span>Status</a></li></ul>

In addition, the Ts.ED swagger plugin given some decorators to write documentation:

<ul class="api-list"><li class="api-item" data-symbol="common/jsonschema;AllowTypes;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/allowtypes"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-AllowTypes"title="AllowTypes"><span class="symbol decorator"></span>AllowTypes</a></li><li class="api-item" data-symbol="swagger;BaseParameter;decorator;@;false;false;false;false"><a href="#/api/swagger/baseparameter"class="symbol-container symbol-type-decorator symbol-name-swagger-BaseParameter"title="BaseParameter"><span class="symbol decorator"></span>BaseParameter</a></li><li class="api-item" data-symbol="common/jsonschema;Default;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/default"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Default"title="Default"><span class="symbol decorator"></span>Default</a></li><li class="api-item" data-symbol="swagger;Description;decorator;@;false;false;false;false"><a href="#/api/swagger/description"class="symbol-container symbol-type-decorator symbol-name-swagger-Description"title="Description"><span class="symbol decorator"></span>Description</a></li><li class="api-item" data-symbol="common/jsonschema;Email;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/email"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Email"title="Email"><span class="symbol decorator"></span>Email</a></li><li class="api-item" data-symbol="common/jsonschema;Enum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/enum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Enum"title="Enum"><span class="symbol decorator"></span>Enum</a></li><li class="api-item" data-symbol="swagger;Example;decorator;@;false;false;false;false"><a href="#/api/swagger/example"class="symbol-container symbol-type-decorator symbol-name-swagger-Example"title="Example"><span class="symbol decorator"></span>Example</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMaximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusivemaximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMaximum"title="ExclusiveMaximum"><span class="symbol decorator"></span>ExclusiveMaximum</a></li><li class="api-item" data-symbol="common/jsonschema;ExclusiveMinimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/exclusiveminimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-ExclusiveMinimum"title="ExclusiveMinimum"><span class="symbol decorator"></span>ExclusiveMinimum</a></li><li class="api-item" data-symbol="common/jsonschema;Format;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/format"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Format"title="Format"><span class="symbol decorator"></span>Format</a></li><li class="api-item" data-symbol="swagger;Hidden;decorator;@;false;false;false;false"><a href="#/api/swagger/hidden"class="symbol-container symbol-type-decorator symbol-name-swagger-Hidden"title="Hidden"><span class="symbol decorator"></span>Hidden</a></li><li class="api-item" data-symbol="common/jsonschema;MaxItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxItems"title="MaxItems"><span class="symbol decorator"></span>MaxItems</a></li><li class="api-item" data-symbol="common/jsonschema;MaxLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxLength"title="MaxLength"><span class="symbol decorator"></span>MaxLength</a></li><li class="api-item" data-symbol="common/jsonschema;MaxProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maxproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MaxProperties"title="MaxProperties"><span class="symbol decorator"></span>MaxProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Maximum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/maximum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Maximum"title="Maximum"><span class="symbol decorator"></span>Maximum</a></li><li class="api-item" data-symbol="common/jsonschema;MinItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinItems"title="MinItems"><span class="symbol decorator"></span>MinItems</a></li><li class="api-item" data-symbol="common/jsonschema;MinLength;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minlength"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinLength"title="MinLength"><span class="symbol decorator"></span>MinLength</a></li><li class="api-item" data-symbol="common/jsonschema;MinProperties;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minproperties"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MinProperties"title="MinProperties"><span class="symbol decorator"></span>MinProperties</a></li><li class="api-item" data-symbol="common/jsonschema;Minimum;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/minimum"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Minimum"title="Minimum"><span class="symbol decorator"></span>Minimum</a></li><li class="api-item" data-symbol="common/jsonschema;MultipleOf;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/multipleof"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-MultipleOf"title="MultipleOf"><span class="symbol decorator"></span>MultipleOf</a></li><li class="api-item" data-symbol="swagger;Name;decorator;@;false;false;false;false"><a href="#/api/swagger/name"class="symbol-container symbol-type-decorator symbol-name-swagger-Name"title="Name"><span class="symbol decorator"></span>Name</a></li><li class="api-item" data-symbol="swagger;Operation;decorator;@;false;false;false;false"><a href="#/api/swagger/operation"class="symbol-container symbol-type-decorator symbol-name-swagger-Operation"title="Operation"><span class="symbol decorator"></span>Operation</a></li><li class="api-item" data-symbol="common/jsonschema;Pattern;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/pattern"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Pattern"title="Pattern"><span class="symbol decorator"></span>Pattern</a></li><li class="api-item" data-symbol="swagger;Responses;decorator;@;false;false;false;false"><a href="#/api/swagger/responses"class="symbol-container symbol-type-decorator symbol-name-swagger-Responses"title="Responses"><span class="symbol decorator"></span>Responses</a></li><li class="api-item" data-symbol="swagger;Returns;decorator;@;false;false;false;false"><a href="#/api/swagger/returns"class="symbol-container symbol-type-decorator symbol-name-swagger-Returns"title="Returns"><span class="symbol decorator"></span>Returns</a></li><li class="api-item" data-symbol="swagger;ReturnsArray;decorator;@;false;false;false;false"><a href="#/api/swagger/returnsarray"class="symbol-container symbol-type-decorator symbol-name-swagger-ReturnsArray"title="ReturnsArray"><span class="symbol decorator"></span>ReturnsArray</a></li><li class="api-item" data-symbol="common/jsonschema;Schema;function;F;false;false;false;false"><a href="#/api/common/jsonschema/schema"class="symbol-container symbol-type-function symbol-name-commonjsonschema-Schema"title="Schema"><span class="symbol function"></span>Schema</a></li><li class="api-item" data-symbol="swagger;Security;decorator;@;false;false;false;false"><a href="#/api/swagger/security"class="symbol-container symbol-type-decorator symbol-name-swagger-Security"title="Security"><span class="symbol decorator"></span>Security</a></li><li class="api-item" data-symbol="swagger;Summary;decorator;@;false;false;false;false"><a href="#/api/swagger/summary"class="symbol-container symbol-type-decorator symbol-name-swagger-Summary"title="Summary"><span class="symbol decorator"></span>Summary</a></li><li class="api-item" data-symbol="common/jsonschema;Title;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/title"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-Title"title="Title"><span class="symbol decorator"></span>Title</a></li><li class="api-item" data-symbol="common/jsonschema;UniqueItems;decorator;@;false;false;false;false"><a href="#/api/common/jsonschema/uniqueitems"class="symbol-container symbol-type-decorator symbol-name-commonjsonschema-UniqueItems"title="UniqueItems"><span class="symbol decorator"></span>UniqueItems</a></li></ul>

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

> Credits: Thanks to [vologab](https://github.com/vologab) to his contribution.

<div class="guide-links">
<a href="#/tutorials/mongoose">Mongoose</a>
<a href="#/tutorials/ajv">Validation with AJV</a>
</div>