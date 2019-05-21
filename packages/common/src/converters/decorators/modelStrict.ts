import {StoreSet} from "@tsed/core";

/**
 * Change the default behavior when the converters deserialize/serialize your model.
 *
 * ### validationModelStrict options
 *
 * When `validationModelStrict` is `true`, the converters will check the model consistency. For example, when a property is unknown
 * on the object sent in the request, Converters will throw a `BadRequest` because the property doesn't exists on the defined Model.
 *
 * Example:
 *
 * ```typescript
 * import {InjectorService, ConvertersService, Required, Property} from "@tsed/common";
 *
 * const injector = new InjectorService()
 * injector.load();
 *
 * class TaskModel {
 *    @Required()
 *    subject: string;
 *
 *    @Property()
 *    rate: number;
 * }
 *
 * const convertersService = injector.get(ConvertersService);
 * convertersService.validationModelStrict = true;
 *
 * convertersService.deserialize({unknowProperty: "test"}, TaskModel); // BadRequest
 * ```
 *
 * It's possible to disable this behavior for a specific Model with the `@ModelStrict` decorator.
 *
 * Example:
 *
 * ```typescript
 * import {InjectorService, ConvertersService, ModelStrict, Required, Property} from "@tsed/common";
 *
 * const injector = new InjectorService()
 * injector.load();
 *
 * @ModelStrict(false)
 * class TaskModel {
 *    @Required()
 *    subject: string;
 *
 *    @Property()
 *    rate: number;
 *
 *    [key: string]: any; // recommended
 * }
 *
 * const convertersService = injector.get(ConvertersService);
 * convertersService.validationModelStrict = true;
 *
 * const result = convertersService.deserialize({unknowProperty: "test"}, TaskModel);
 * console.log(result) // TaskModel {unknowProperty: "test"}
 * ```
 *
 * > If the validationModelStrict is false, you can use `@ModelStrict` decorator to enable the strict validation for a specific model.
 *
 * @decorator
 * @endpoint
 * @converters
 */
export function ModelStrict(value: boolean) {
  return StoreSet("modelStrict", value);
}
