# Pipes
<Badge text="5.50.0+"/>

A pipe is a class annotated with the @@Injectable@@ decorator. 
Pipes should implement the @@IPipe@@ interface.

Pipes have two typical use cases:

- **transformation**: transform input data to the desired output
- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception when the data is incorrect

Pipes are called when an Incoming request is handled by the controller route handler and operate on the `Request` object.
Pipe receive the argument where the pipe is placed. This means, each parameters can invoke a list of pipes, and it can be different for each parameters.
Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.
Finally, both of transformation or validation must implement a `transform()` method and return the expected value.

::: tip
Pipes run inside an exception zones. This means that when a Pipe throws an exception, it will be handled by the @@GlobalExceptionHandler@@. Given the above, 
any method controller are called when an exception is thrown inside a Pipe.
:::

## Built-in pipes

Ts.ED comes with the following pipes:

- @@ParseExpressionPipe@@,
- @@ValidationPipe@@,
- @@DeserializerPipe@@

Theses pipes are exported to allow pipes overriding. Theses decorators are commonly used by @@BodyParams@@, @@QueryParams@@, etc...
In this case, the pipes are added by using @@UseParam@@ on a parameters.

For example, the @@BodyParams@@ use on a parameters call the @@UseParams@@ with some options, and @@UseParams@@ call also different decorators
to add Pipes:

<Tabs class="-code">
  <Tab label="BodyParams">

<<< @/docs/docs/snippets/pipes/body-params.ts
  
  </Tab>
  <Tab label="UseParams">
  
<<< @/docs/docs/snippets/pipes/use-params.ts    
  
  </Tab>
</Tabs> 

The **main idea** is, you are able to combine any pipes to reach the expected behavior !

Now let's build a validation pipe from scratch to understand the pipe mechanism.

Initially, we'll have it simply take an input value and immediately return the same value, behaving like an identity function.

<<< @/docs/docs/snippets/pipes/validation-pipe-identity.ts
 
::: tip
`IPipe<T, R>` is a generic interface in which `T` indicates the type of the input value, and `R` indicates the return type of the `transform()` method. 
:::

Every pipe has to provide the transform() method. This method has two parameters:

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

Property | Description
---|---
`target` | The class of the parameter
`propertyKey` | The method of the parameter
`index` | The position of the parameter in the method signature
`required` | Indicates whether the parameter is required
`paramType` | @@ParamTypes@@ represents the starting object used by the first pipe,  
`expression` | Expression used to get the property from the object injected with paramType,
`type` | Class used to deserialize the plain object
`collectionType` | Collection type used to deserialize a collection of plain object
`store` | @@Store@@ contain extra options collected by the decorators used on the parameter.

::: warning
TypeScript interfaces disappear during transpilation. Thus, if a method parameter's `type` is declared as an interface instead of a class, the type value will be `Object`. 
:::

## Validation use case

The goal of validation use case is to ensure that the input parameter is valid before use in a method.

Officially, Ts.ED use @@JsonSchema@@ two ways to declare a JsonSchema:

- With [model](/docs/models.html) decorators,
- With @@UseSchema@@ decorator.

We'll takes the model declaration to explain the Validation pipe use case. Let's focus in on the a `PersonModel`:

```typescript
import {MinLength, Required} from "@tsed/common";

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
  "required": [
    "firstName",
    "lastName"
  ]
}
```

We want to ensure that any incoming request to the create method contains a valid body.
So we have to validate the two members of the `PersonModel` object, used as type parameter: 

<<< @/docs/docs/snippets/pipes/controller-model-validation.ts

By using a pipe, we'll are able to handle the parameter, get his schema and use a validation library (here is AJV)
and throw exception when the payload is not valid.
 
<<< @/docs/docs/snippets/pipes/validation-pipe-with-ajv.ts

The validation pipe is a very specific use case because, Ts.ED use it automatically when a parameter is handled
 by the **routing request**. The previous pipe example, to works, need to be registered with the @@OverrideProvider@@ decorator instead of @@Injectable@@.

See more details on the [validation page](/docs/validation.html).

## Transformation use case

Validation isn't the sole use case for **Pipes**. 
At the beginning of this chapter, we mentioned that a pipe can also **transform** the input data to the desired output. 
This is possible because the value returned from the transform function completely overrides the previous value of the argument.

When is this useful? Consider that sometimes the data passed from the client needs to undergo some change - *for example converting plain object javascript to class* - before it can be properly handled by the route handler method. 
Furthermore, some required data fields may be missing, and we would like to apply default values. 

Transformer pipes can perform these functions by interposing a processing function between the client request and the request handler.

<<< @/docs/docs/snippets/pipes/transformer-pipe.ts

We can simply tie this pipe to the selected param as shown below:

<<< @/docs/docs/snippets/pipes/transformer-pipe-usage.ts

::: tip
On the previous example, we use @@RawPathParams@@ to get the raw value, without transformation or validation from existing Ts.ED Pipe.
:::

## Async transformation use case

Pipe transformation support also `async` and promise as returned value. 
This is useful, when you have to get data from **database** based on an input data like an ID. 

Given this `PersonModel`:

```typescript
import {MinLength, Required} from "@tsed/common"; 
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

<<< @/docs/docs/snippets/pipes/async-transformer-pipe.ts

Then, we can use this pipe on a parameter with @@UsePipe@@:

<<< @/docs/docs/snippets/pipes/async-transformer-pipe-usage.ts

::: tip
The previous example use two pipes decorators which are dependent to each other. We can summarize it by declaring a custom decorator:

<<< @/docs/docs/snippets/pipes/pipes-decorator.ts
:::

## Get options from decorator

Sometime it might be useful to forward option from decorator used on parameters to the registered Pipe.

Let's focus on our previous decorator example, by adding extra parameter options:

<<< @/docs/docs/snippets/pipes/pipes-decorator-with-options.ts

Now, we can retrieve the options by using the `metadata.store`:

<<< @/docs/docs/snippets/pipes/async-transformer-pipe-with-options.ts
