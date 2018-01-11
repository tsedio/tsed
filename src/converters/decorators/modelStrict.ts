import {Store} from "../../core";

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
 * const {InjectorService, ConvertersService, Required, Property} = "ts-express-decorators";
 *
 * InjectorService.load();
 *
 * class TaskModel {
 *    @Required()
 *    subject: string;
 *
 *    @Property()
 *    rate: number;
 * }
 *
 * const convertersService = InjectorService.get(ConvertersService);
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
 * const {InjectorService, ConvertersService, ModelStrict, Required, Property} = "ts-express-decorators";
 *
 * InjectorService.load();
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
 * const convertersService = InjectorService.get(ConvertersService);
 * convertersService.validationModelStrict = true;
 *
 * const result = convertersService.deserialize({unknowProperty: "test"}, TaskModel);
 * console.log(result) // TaskModel {unknowProperty: "test"}
 * ```
 *
 * > If the validationModelStrict is false, you can use `@ModelStrict` decorator to enable the strict validation for a specific model.
 *
 * @decorator
 * @conveters
 */
export function ModelStrict(value: boolean) {
    return Store.decorate((store) => {
        store.set("modelStrict", value);
    });
}