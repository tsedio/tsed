import {Allow} from "./allow";
import {applyDecorators, DecoratorParameters, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";
import {getStorableMetadata} from "./utils/getStorableMetadata";

/**
 * Add required annotation for a function argument.
 *
 * The @Required decorator can be used on two cases.
 *
 * To decorate a parameters:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @BodyParams("field") field: string) {}
 * ```
 *
 * To decorate a model:
 *
 * ```typescript
 * class Model {
 *   @Property()
 *   @Required()
 *   field: string;
 * }
 * ```
 *
 * > Required will throw a BadRequest when the given value is `null`, an empty string or `undefined`.
 *
 * ### Allow a values
 *
 * In some case, you didn't want trigger a BadRequest when the value is an empty string for example.
 * The decorator `@Allow()`, allow you to configure a value list for which there will be no exception.
 *
 * ```typescript
 * class Model {
 *   @Property()
 *   @Required()
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @converters
 */
export function Required(...allowedRequiredValues: any[]): any {
  return applyDecorators(
    (...decoratorArgs: DecoratorParameters) => {
      const metadata = getStorableMetadata(decoratorArgs);

      if (!metadata) {
        throw new UnsupportedDecoratorType(Required, decoratorArgs);
      }

      metadata.required = true;

      if (allowedRequiredValues.length) {
        Allow(...allowedRequiredValues)(...decoratorArgs);
      }
    },
    StoreMerge("responses", {
      "400": {
        description: "BadRequest"
      }
    })
  );
}
