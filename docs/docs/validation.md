# Validation

Ts.ED provide by default a [AJV](/tutorials/ajv.md) package `@tsed/ajv` to perform a validation on a [Model](/docs/models.md).

This package must be installed to run automatic validation on input data. Any model used on parameter and annotated with one of JsonSchema decorator will be
validated with AJV.

```
npm install --save @tsed/ajv
```

But, you can choose another library as model validator.

## Data input validation

Ts.ED support the data input validation with the decorators provided by `@tsed/schema`.

Example:

<<< @/docs/snippets/controllers/request-input-validation.ts

## Custom Validation

Ts.ED allows you to change the default @@ValidationPipe@@ by your own library. The principle is simple.
Create a CustomValidationPipe and use @@OverrideProvider@@ to change the default @@ValidationPipe@@.

<<< @/docs/snippets/validation/validator-pipe.ts

::: warning
Don't forgot to import the new `CustomValidatorPipe` in your `server.ts` !
:::

### Use Joi

There are several approaches available for object validation. One common approach is to use schema-based validation.
The [Joi](https://github.com/hapijs/joi) library allows you to create schemas in a pretty straightforward way, with a readable API.

Let's look at a pipe that makes use of Joi-based schemas.

Start by installing the required package:

```
npm install --save @hapi/joi
npm install --save-dev @types/hapi__joi
```

In the code sample below, we create a simple class that takes a schema as a constructor argument.
We then apply the `schema.validate()` method, which validates our incoming argument against the provided schema.

In the next section, you'll see how we supply the appropriate schema for a given controller method using the @@UsePipe@@ decorator.

<<< @/docs/snippets/validation/joi-pipe.ts

Now, we have to create a custom decorator to store the Joi schema along with a parameter:

<<< @/docs/snippets/validation/joi-pipe-decorator.ts

And finally, we are able to add Joi schema with our new decorator:

<<< @/docs/snippets/validation/joi-pipe-usage.ts

### Use Class validator

Let's look at an alternate implementation of our validation technique.

Ts.ED works also with the [class-validator](https://github.com/typestack/class-validator) library.
This library allows you to use **decorator-based** validation (like Ts.ED with his [JsonSchema](/docs/models) decorators).
Decorator-based validation combined with Ts.ED [Pipe](/docs/pipes.html) capabilities since we have access to the medata.type of the processed parameter.

Before we start, we need to install the required packages:

```
npm i --save class-validator class-transformer
```

Once these are installed, we can add a few decorators to the `PersonModel`:

```typescript
import {IsString, IsInt} from "class-validator";

export class CreateCatDto {
  @IsString()
  firstName: string;

  @IsInt()
  age: number;
}
```

::: tip
Read more about the class-validator decorators [here](https://github.com/typestack/class-validator#usage).
:::

Now we can create a [ClassValidationPipe] class:

<<< @/docs/snippets/validation/class-validator-pipe.ts

::: warning Notice
Above, we have used the [class-transformer](https://github.com/typestack/class-transformer) library.
It's made by the same author as the **class-validator** library, and as a result, they play very well together.
:::

Note that we get the type from @@ParamMetadata@@ and give it to plainToObject function. The method `shouldValidate`
bypass the validation process for the basic types and when the `metadata.type` or `metadata.collectionType` are not available.

Next, we use the **class-transformer** function `plainToClass()` to transform our plain JavaScript argument object into a typed object
so that we can apply validation. The incoming body, when deserialized from the network request, does not have any type information.
Class-validator needs to use the validation decorators we defined for our **PersonModel** earlier,
so we need to perform this transformation.

Finally, we return the value when we haven't errors or throws a `ValidationError`.

::: tip
If you use **class-validator**, it also be logical to use [class-transformer](https://github.com/typestack/class-transformer) as Deserializer.
So we recommend to override also the @@DeserializerPipe@@.

<<< @/docs/snippets/validation/class-transformer-pipe.ts
:::

We just have to import the pipe on our `server.ts` and use model as type on a parameter.
