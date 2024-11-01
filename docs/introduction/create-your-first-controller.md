---
next:
  text: Controllers
  link: /docs/controllers
meta:
  - name: description
    content: Create your first controller. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: controller getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Create your first controller

Controllers are responsible for handling incoming **requests** and returning **responses** to the client.

![Controllers](./assets/client-controllers.png)

For this step, we'll create a new `CalendarController.ts` in our project. We can do that using Ts.ED cli:

```sh
# npm -g @tsed/cli
tsed g controller Calendars
```

```ansi
? Which route? /calendars
? Which directory? rest
✔ Generate controller file to 'controllers/rest/CalendarsController.ts'
↓ Update bin/index
```

The content generated file should be something like that:

```ts {4,6}
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/calendars")
export class CalendarsController {
  @Get("/")
  get() {
    return "hello";
  }
}
```

All controllers decorated with @@Controller@@ create a new Platform router under the hood (Platform Router is an abstraction layer to generate the routes for the targeted platform like Express.js or Koa.js)

A Platform router requires a path (here, the path is `/calendars`) to expose an url on our server.

::: info
More precisely, it's a chunk of a path, and the entire exposed url depends on the Server configuration (see [Configuration](/docs/configuration/index))
and the [children controllers](/docs/controllers).
:::

In this case, we have no nested controller and the root endpoint is set to `/rest` in our `Server.ts`.

```ts {6,12,13,14}
import {Configuration} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config/index";
import * as rest from "./controllers/rest/index"; // [!code focus]
import * as pages from "./controllers/pages/index";

@Configuration({
  ...config,
  mount: {
    "/rest": [
      // [!code focus]
      ...Object.values(rest) // [!code focus]
    ], // [!code focus]
    "/": [...Object.values(pages)]
  }
})
export class Server {}
```

So the controller's url will be `http://localhost:8083/rest/calendars`.

The last step is to regenerate the barrels files using the following command:

::: code-group

```sh [npm]
npm run barrels (test)
```

```sh [yarn]
yarn run barrels
```

```sh [pnpm]
pnpm run barrels
```

```sh [bun]
bun run barrels
```

:::

Now we can start our server and test our new exposed endpoint:

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn run start
```

```sh [pnpm]
pnpm run start
```

```sh [bun]
bun run start
```

:::

The terminal should display our new endpoint:

<<< @/introduction/snippets/guide/start-first-controller.ansi

::: tip
Ts.ED will always display the exposed endpoints in the terminal. It's a good way to check if everything is working as expected.
You can disable this feature by setting the `logger.disableRoutesSummary` configuration to `false`.
:::

We can now test our new endpoint using a tool like [Postman](https://www.postman.com/), or using a simple curl:

```sh
curl --location 'http://localhost:8083/rest/calendars'

# Output
hello%
```

## Create a model

Before we continue, let's create a simple [model](/docs/model.md) to use in our controller.

Run the following command to create a new `Calendar` model:

```sh
# npm -g @tsed/cli
tsed g model Calendar
```

It will generate a new file in the `models` directory:

```ts
import {Property} from "@tsed/schema";

export class CalendarModel {
  @Property()
  id: string;
}
```

::: tip
Model feature provided by Ts.ED is a simple way to define a data structure.
It's based on the `@tsed/schema` package and can be used to validate incoming data, serialize outgoing data, and generate OpenAPI documentation.
:::

Let's add some properties to our `CalendarModel`. For our example, we'll add a `name` and a `description`:

::: code-group

<<< @/introduction/snippets/guide/CalendarModel.ts

<<< @/introduction/snippets/guide/CalendarModel.spec.ts

:::

Our `CalendarModel` now has three properties: `id`, `name`, and `description`. We also added some validation rules to our properties like:

- `@Required()` to make sure the property is present in the payload,
- `@MinLength(3)` to make sure the `name` property has at least 3 characters,
- `@MaxLength(100)` to make sure the `description` property has at most 100 characters.
- `@Groups("!creation")` to exclude the `id` property from the serialization when the `creation` group is used.

::: tip
This model will produce a JSON schema that can be tested using the [Swagger UI](/tutorials/swagger.md) or
in a unit test using the `@tsed/schema` package. See the `CalendarModel.spec.ts` tab for an example.
:::

We can now use our `CalendarModel` in our `CalendarsController`:

```ts
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {CalendarModel} from "../models/CalendarModel";

@Controller("/calendars")
export class CalendarsController {
  @Get("/")
  getAll() {
    const model = new CalendarModel();
    model.id = "1";
    model.name = "My calendar";
    model.description = "My calendar description";

    return [model];
  }
}
```

Now, if we run our server and test our endpoint, we should see the following output:

```sh
curl --location 'http://localhost:8083/rest/calendars'

# Output
[{"id":"1","name":"My calendar","description":"My calendar description"}]%
```

## Create a CRUD

Now that we have a basic understanding of how to create a controller, let's create a CRUD (Create, Read, Update, Delete) for our `Calendar` model.

We'll start by adding a `Post` method to create a new `Calendar`:

<<< @/introduction/snippets/guide/CalendarsController.ts

As we can see on our `CalendarsController`, we added a new method `create` decorated with `@Post("/")`.
This method will be called when a `POST` request is sent to the `/rest/calendars` endpoint.

We also added a `@BodyParams` decorator to the `create` method. This decorator is used to inject the request body into the method.
`Groups` is used to specify which group should be used to validate the incoming payload.
Here we need to exclude the `id` property from the validation. This is why we use `@Groups("creation")`.

```sh
curl --location 'http://localhost:8083/rest/calendars' \
--header 'Content-Type: application/json' \
--data '{
    "name": "My calendar",
    "description": "My calendar description"
}'

# Output
{"id":"50de4b10-792e-44d5-9f61-56b3898ebf34","name":"My calendar","description":"My calendar description"}%

curl --location 'http://localhost:8083/rest/calendars'

# Output
[{"id":"50de4b10-792e-44d5-9f61-56b3898ebf34","name":"My calendar","description":"My calendar description"}]%
```

To complete our CRUD, we need to add a `Get` method to retrieve a `Calendar` by its `id`,
a `Put` method to update a `Calendar` by its `id`, and a `Delete` method to remove a `Calendar` by its `id`.

Here is the complete `CalendarsController`:

::: code-group

<<< @/introduction/snippets/guide/CalendarsController.complete.ts [CalendarsController.ts]

<<< @/introduction/snippets/guide/CalendarsController.complete.spec.ts [CalendarsController.spec.ts]

:::

Our CRUD is ready to use. But the logic is entirely implemented in our controller. Ts.ED provide a way to separate the business logic from the controller logic using [Services](/docs/providers.md).
So, the next step is to use DI to create and inject a service in our controller.
