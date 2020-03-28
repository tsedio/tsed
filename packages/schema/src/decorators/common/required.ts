import {applyDecorators, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn, Property} from "@tsed/schema";
import {Allow} from "./allow";

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
 *   @Allow("") // add automatically required flag
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @schema
 */
export function Required(required: boolean = true, ...allowedRequiredValues: any[]) {
  return applyDecorators(
    Property(),
    required && Allow(allowedRequiredValues),
    JsonSchemaStoreFn((store, args) => {
      switch (store.decoratorType) {
        case DecoratorTypes.PARAM:
          store.parameter!.required(required);
          break;
        case DecoratorTypes.PROP:
          required ? store.parentSchema.addRequired(store.propertyName) : store.parentSchema.removeRequired(store.propertyName);
          break;
        default:
          throw new UnsupportedDecoratorType(Required, args);
      }
    })
  );
}
