# Pipes

A pipe is a class annotated with the @@Injectable@@ decorator.
Pipes should implement the @@IPipe@@ interface.

Pipes have two typical use cases:

- **transformation**: transform input data to the desired output
- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception when the data is incorrect

Pipes are called when an Incoming request is handled by the controller route handler and operate on **the method's parameters**. It takes **Request** or **Response** object and transform theses object to the expected value.

Pipe receives the argument where it is placed. This means that each parameter can invoke a list of pipes, which can be different for each parameter.

```typescript
@Get("/")
getMethod(@UsePipe(MyPipe) value: string, @UsePipe(MyPipe2) @UsePipe(MyPipe3) value2: string) {}
```

Finally, both transformation and validation must implement a `transform()` method and return the expected value.

::: tip
Pipes run inside an exception zone. It means that when a Pipe throws an exception, it will be handled by the @@GlobalExceptionHandler@@. Given the above, it should be clear that when an exception is thrown in a Pipe, no controller method is subsequently executed.
:::

## Built-in pipes

Ts.ED comes with the following pipes:

- @@ParseExpressionPipe@@,
- @@ValidationPipe@@,
- @@DeserializerPipe@@

These pipes are exported to allow pipes overriding. These decorators are commonly used by @@BodyParams@@, @@QueryParams@@, etc.
In this case, the pipes are added by using @@UseParam@@ on a parameter.

For example, the use of @@BodyParams@@ on a parameter calls the @@UseParams@@ with some options, and @@UseParams@@ calls also different decorators
to add Pipes:

<Tabs class="-code">
  <Tab label="BodyParams">

<<< @/docs/snippets/pipes/body-params.ts

  </Tab>
  <Tab label="UseParams">
  
<<< @/docs/snippets/pipes/use-params.ts    
  
  </Tab>
</Tabs>

The **main idea** is, you are able to combine any pipes to reach the expected behavior !

Now let's build a validation pipe from scratch to understand the pipe mechanism.

Initially, we'll have it simply take an input value and immediately return the same value, behaving like an identity function.

<<< @/docs/snippets/pipes/validation-pipe-identity.ts

::: tip
`IPipe<T, R>` is a generic interface in which `T` indicates the type of the input value, and `R` indicates the return type of the `transform()` method.
:::

Every pipe has to provide the `transform()` method. This method has two parameters:

- `value`
- `metadata`

The `value` is the currently processed argument (before it is received by the route handling method), while metadata is its `metadata`.
The metadata object has these properties (see also @@ParamMetadata@@):

```typescript
class ParamMetadata {
  target: Type<any>;
  propertyKey: string | symbol;
  index: number;
  required: boolean;
  paramType: string | ParamTypes;
  expression: string;
  type: Type<any>;
  collectionType: Type<any>;
  pipes: Type<IPipe>[];
  store: Store;
}
```

These properties describe the current processed argument.

| Property         | Description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| `target`         | The parameter's class                                                               |
| `propertyKey`    | The parameter's method                                                              |
| `index`          | The position of the parameter in the method signature                               |
| `required`       | Indicates whether the parameter is required or not                                  |
| `paramType`      | @@ParamTypes@@ represents the starting object used by the first pipe                |
| `expression`     | Expression used to get the property from the object injected with paramType         |
| `type`           | Class used to deserialize the plain object                                          |
| `collectionType` | Collection type used to deserialize a collection of plain object                    |
| `store`          | @@Store@@ contains extra options collected by the decorators used on the parameter. |

::: warning
TypeScript interfaces disappear during transpilation. Thus, if a method parameter's `type` is declared as an interface instead of a class, the type value will be `Object`.
:::

## Validation use case

The goal of validation use case is to ensure that the input parameter is valid before using it in a method.

Officially, Ts.ED has two way to declare a @@JsonShema@@ validation:

- With [model](/docs/model.html) decorators,
- With @@UseSchema@@ decorator, it's a decorator Pipe provided by @tsed/ajv package.

We'll take the model declaration to explain the Validation pipe use case. Let's focus on the `PersonModel`:

```typescript
import {MinLength, Required} from "@tsed/schema";

class PersonModel {
  @MinLength(3)
  @Required()
  firstName: string;

  @MinLength(3)
  @Required()
  lastName: string;
}
```

`PersonModel` will generate the following JsonSchema:

```json
{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "minLength": 3
    },
    "lastName": {
      "type": "string",
      "minLength": 3
    }
  },
  "required": ["firstName", "lastName"]
}
```

We want to ensure that any incoming request to the create method contains a valid body.
So we have to validate the two members of the `PersonModel` object, used as type parameter:

<<< @/docs/snippets/pipes/controller-model-validation.ts

By using a pipe, we are able to handle the parameter, get its schema and use a validation library (here AJV)
and throw an exception when the payload is not valid.

<<< @/docs/snippets/pipes/validation-pipe-with-ajv.ts

The validation pipe is a very specific use case because Ts.ED uses it automatically when a parameter is handled
by the **routing request**. The previous pipe example, in order to work, needs to be registered with the @@OverrideProvider@@ decorator instead of @@Injectable@@.

See more details on the [validation page](/docs/validation.html).

## Transformation use case

Validation isn't the sole use case for **Pipes**.
At the beginning of this chapter, we mentioned that a pipe can also **transform** the input data to the desired output.
This is possible because the value returned from the transform function completely overrides the previous value of the argument.

When is this useful? Consider that sometimes the data passed from the client needs to undergo some changes - _for example converting plain object javascript to class_ - before it can be properly handled by the route handler method.
Furthermore, some required data fields may be missing, and we would like to apply default values.

Transformer pipes can perform these functions by interposing a processing function between the client request and the request handler.

<<< @/docs/snippets/pipes/transformer-pipe.ts

We can simply tie this pipe to the selected param as shown below:

<<< @/docs/snippets/pipes/transformer-pipe-usage.ts

::: tip
On the previous example, we use @@RawPathParams@@ to get the raw value, without transformation or validation from existing Ts.ED Pipe.
:::

## Async transformation use case

Pipe transformation also supports `async` and promise as a returned value.
This is useful when you have to get data from **database** based on an input data like an ID.

Given this `PersonModel`:

```typescript
import {MinLength, Required} from "@tsed/schema";
import {Property} from "./property";

class PersonModel {
  @Property()
  id: string;

  @MinLength(3)
  @Required()
  firstName: string;

  @MinLength(3)
  @Required()
  lastName: string;
}
```

We can implement the following pipe to get Person data from database:

<<< @/docs/snippets/pipes/async-transformer-pipe.ts

Then, we can use this pipe on a parameter with @@UsePipe@@:

<<< @/docs/snippets/pipes/async-transformer-pipe-usage.ts

## Custom pipe decorator

In the previous section, we show you how to use a Pipe on a parameter:

<<< @/docs/snippets/pipes/async-transformer-pipe-usage.ts

In this example, our pipe need to be called with @@RawPathParams@@ two work properly, because our pipe return an instance of `PersonModel`. @@PathParams@@ call automatically the @@DeserializerPipe@@ and it's not what we want. This is why we using @@RawPathParams@@.

To avoid future mistakes, it could be a good idea to summarize these two decorators in one as following:

<<< @/docs/snippets/pipes/pipes-decorator.ts

Now, we can use our custom decorator on parameter:

```typescript
import {Controller} from "@tsed/di";
import {RawPathParams, UsePipe} from "@tsed/platform-params";
import {Put} from "@tsed/schema";
import {PersonModel} from "../models/PersonModel";
import {PersonPipe} from "../services/PersonPipe";

@Controller("/persons")
export class PersonsController {
  @Put("/:id")
  async update(@UsePersonParam("id") person: PersonModel) {
    // do something

    return person;
  }
}
```

## Get options from decorator

Sometimes it might be useful to forward options from a decorator used on parameters to the registered Pipe.

Let's focus on our previous decorator example, by adding extra parameter options:

<<< @/docs/snippets/pipes/pipes-decorator-with-options.ts

Now, we can retrieve the options by using the `metadata.store`:

<<< @/docs/snippets/pipes/async-transformer-pipe-with-options.ts

And finally, we can use our new decorator on a parameter:

```typescript
import {Put} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {RawPathParams, UsePipe} from "@tsed/plaform-params";
import {PersonModel} from "../models/PersonModel";
import {PersonPipe} from "../services/PersonPipe";

@Controller("/persons")
export class PersonsController {
  @Put("/:id")
  async update(@UsePersonParam("id", {optional: true}) person: PersonModel) {
    // do something

    return person;
  }
}
```
