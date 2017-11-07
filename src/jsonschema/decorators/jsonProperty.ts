import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {ConverterService} from "../../converters/services/ConverterService";
import {Type} from "../../core/interfaces";
import {isEmpty} from "../../core/utils/index";
import {InjectorService} from "../../di/services/InjectorService";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * `@JsonProperty()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribut name mapped to the provide attribut.
 * Here an example of different use cases with `@JsonProperty()`:
 *
 * ```typescript
 * class EventModel {
 *
 *    @JsonProperty()
 *    name: string;
 *
 *    @JsonProperty('startDate')
 *    startDate: Date;
 *
 *    @JsonProperty({name: 'end-date'})
 *    endDate: Date;
 *
 *    @JsonProperty({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * class TaskModel {
 *     @Property()
 *     subject: string;
 *
 *     @Property()
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
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
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        if (typeof options === "string") {
            propertyMetadata.name = options as string;
        }
        else if (typeof options === "object") {
            propertyMetadata.name = options.name as string;

            if (!isEmpty((<IPropertyOptions>options).use)) {
                propertyMetadata.type = (options as IPropertyOptions).use as Type<any>;
            }
        }

        return (target: any) => {
            if (!target.constructor.prototype.toJSON) {

                target.constructor.prototype.toJSON = function () {
                    return InjectorService
                        .invoke<ConverterService>(ConverterService)
                        .serialize(this);
                };
                target.constructor.prototype.toJSON.$ignore = true;
            }
        };
    });
}

/**
 * `@Property()` let you decorate an attribut that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribut name mapped to the provide attribut.
 * Here an example of different use cases with `@JsonProperty()`:
 *
 * ```typescript
 * class EventModel {
 *
 *    @Property()
 *    name: string;
 *
 *    @Property('startDate')
 *    startDate: Date;
 *
 *    @Property({name: 'end-date'})
 *    endDate: Date;
 *
 *    @Property({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * class TaskModel {
 *     @Property()
 *     subject: string;
 *
 *     @Property()
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
 * By default Date, Array, Map and Set have a default custom Converter allready embded. But you can override theses (see next part).
 *
 * For the Array, you must add the `{use: type}` option to the decorators.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribut source.
 *
 * @returns {Function}
 * @decorator
 * @param options
 */
export function Property(options?: IPropertyOptions | string) {
    return JsonProperty(options);
}