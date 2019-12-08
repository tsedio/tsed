# Throw HTTP Exceptions

You can use [ts-httpexceptions](https://github.com/TypedProject/ts-httpexceptions) or similar module to throw an http exception.
All exception will be intercepted by the [Global error handler](/docs/middlewares/override/global-error-handler.md)
and are sent to the client.

Here an example:

<<< @/docs/docs/snippets/controllers/response-throw-exceptions.ts

::: tip
This example will produce a response with status code 400 and "Not a number" message. 
`GlobalErrorHandlerMiddleware` will catch and format the error before sending it to the client.
:::

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
import {User} from "./models/User";

@Controller("/calendars")
export class CalendarCtrl {

    @Post()
    async create(
        @BodyParams() user: User
    ): any {

        if (!user.name) {
            throw(new RequiredUserName());
        }

       return user;
    }
}
```
