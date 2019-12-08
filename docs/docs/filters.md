# Filters

Filters feature lets you create a custom decorators that will be 
used on the methods parameters like @@BodyParams@@ or @@Locals@@.

### Example

This example show you, how you can implement a filter and decorator to use these, on a method Controller.
In this case, we need to retrieve the body content from an Express.Request.

So to do that, you must create a class and annotate it with the @@Filter@@
decorator and in option, implement the @@IFilter@@ interface:

<<< @/docs/docs/snippets/filters/basic-filter.ts

Then create the decorator. This decorator will be used on a controller method.

<<< @/docs/docs/snippets/filters/filter-decorator.ts

And finally you can use your custom filter on your controller/middleware:

<<< @/docs/docs/snippets/filters/filter-usage.ts

### UseFilter Options

@@UseFilter@@ allow you to register your custom decorator with few options as following:

- `paramType` (ParamTypes): Parameter type like BODY, QUERY, PARAMS, etc...,
- `required` (boolean, optional): Throw an error when if the value is undefined,
- `expression` (string, optional): An expression to parse,
- `useConverter` (boolean): Enable converterService to deserialize value,
- `useValidation` (boolean): Enable ValidationService,
- `useType` (boolean): Set explicitly the class/model used by the parameters.
