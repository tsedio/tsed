import {Type} from "../../core/interfaces";
import {isEmpty} from "../../core/utils/index";
/**
 * @module common/converters
 */
/** */
import {InjectorService} from "../../di/services/InjectorService";
import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {PropertyRegistry} from "../registries/PropertyRegistry";
import {ConverterService} from "../../converters/services/ConverterService";

/**
 * `@JsonProperty()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribut name mapped to the provide attribut.
 * Here an example of different use cases with `@JsonProperty()`:
 *
 * ```typescript
 * provide EventModel {
 *
 *    \@JsonProperty()
 *    name: string;
 *
 *    \@JsonProperty('startDate')
 *    startDate: Date;
 *
 *    \@JsonProperty({name: 'end-date'})
 *    endDate: Date;
 *
 *    \@JsonProperty({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * provide TaskModel {
 *     subject: string;
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used : Map and Set. Map will be serialized as an object and Set as an array.
 * By default Date, Array, Map and Set have a default custom Converter allready embded. But you can override theses (see next part).
 *
 * For the Array, you must add the `{use: type}` option to the decorators.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribut source.
 *
 * @returns {Function}
 * @decorator
 * @param options
 */
export function JsonProperty<T>(options?: IPropertyOptions | string): Function {

    return (target: any, propertyKey: string) => {

        /* istanbul ignore else */
        if (propertyKey) {

            const property = PropertyRegistry.get(target, propertyKey);

            if (typeof options === "string") {
                property.name = options as string;
            }
            else if (typeof options === "object") {
                property.name = options.name as string;

                if (!isEmpty((<IPropertyOptions>options).use)) {
                    property.type = (options as IPropertyOptions).use as Type<any>;
                }
            }

            if (!target.constructor.prototype.toJSON) {

                target.constructor.prototype.toJSON = function () {
                    return InjectorService
                        .invoke<ConverterService>(ConverterService)
                        .serialize(this);
                };
                target.constructor.prototype.toJSON.$ignore = true;

            }
        }

    };

}

