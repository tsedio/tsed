import {DecoratorParameters, Metadata, useDecorators, useMethodDecorators} from "@tsed/core";

import {JsonParameterTypes} from "../../domain/JsonParameterTypes.js";
import {Name} from "../common/name.js";
import {Consumes} from "./consumes.js";
import {In} from "./in.js";
import {Returns} from "./returns.js";

/**
 * Add a input file parameter.
 *
 * ::: warning
 * Don't use decorator with Ts.ED application to decorate parameters. Use @@BodyParams@@, @@PathParams@@, etc... instead.
 * But you can use this decorator on Method, to add extra in parameters like Authorization header.
 *
 * ```typescript
 * @Controller("/")
 * class MyController {
 *    @Post("/")
 *    method(@InFile("file1") file: any) {
 *    }
 *  }
 * ```
 * :::
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @operation
 * @param name
 */
export function InFile(name: string): ParameterDecorator {
  return (...args: DecoratorParameters): void => {
    const [target, propertyKey, index] = args;
    const multiple = Metadata.getParamTypes(target, propertyKey)[index as number] === Array;

    name = (typeof name === "object" ? undefined : name)!;

    const expression = [name, !multiple && "0"].filter(Boolean).join(".");

    const decorators = useDecorators(
      In(JsonParameterTypes.FILES),
      Name(expression),
      useMethodDecorators(
        Returns(400).Description(
          `<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1`
        ),
        Consumes("multipart/form-data")
      )
    );

    decorators(...args);
  };
}
