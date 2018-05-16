# Throw HTTP Exceptions

You can use [ts-httpexceptions](https://github.com/Romakita/ts-httpexceptions) or similar module to throw an http exception.
All exception will be intercepted by the [Global error handler](docs/middlewares/override/global-error-handler.md)
and are sent to the client.

Here an example:

```typescript
import {Controller, Get, PathParams} from "@tsed/common";
import {BadRequest} from "ts-httpexceptions";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    async get(
        @PathParams("id") id: number
    ): any {
    
        if (isNaN(+id)) {
            throw(new BadRequest("Not a number"));
        }
       
       return {id: id};
    }
}
```

> If `id` parameter is not an number, the method throw a Bad Request.
This will produce a response with status code 400 and "Not a number" message.

## Create custom exception

It also possible to create your own exception from any Exception of `ts-httpexceptions` and customize the response headers.

```typescript
import {BadRequest} from "ts-httpexceptions";
import {IResponseError} from "@tsed/common";

export class RequiredUserName extends BadRequest implements IResponseError {
    headers = {};
    errors = [];

    constructor() {
        super("The name is required");
        this.headers["my-custom-header"] = "value";

        // you can also specify errors field for functional errors (like AJV validation).
        this.errors.push({
             dataPath: "",
             keyword: "required",
             message: "should have required property 'name'",
             modelName: "User",
             params: {
               missingProperty: "name"
             },
             schemaPath: "#/required"
        });
    }
}
```

Then in your controller:

```typescript
import {Controller, Post, BodyParams} from "@tsed/common";
import {RequiredUserName} from "./RequiredUserName";

@Controller("/calendars")
export class CalendarCtrl {

    @Post("/")
    async get(
        @BodyParams() user: User
    ): any {

        if (!user.name) {
            throw(new RequiredUserName());
        }

       return {id: id};
    }
}
```

<div class="guide-links">
<a href="#/tutorials/templating">Templating</a>
<a href="#/tutorials/aws">AWS project</a>
</div>