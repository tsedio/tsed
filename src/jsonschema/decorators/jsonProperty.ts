import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {ConverterService} from "../../converters/services/ConverterService";
import {Type} from "../../core/interfaces";
import {isEmpty} from "../../core/utils/index";
import {InjectorService} from "../../di/services/InjectorService";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * `@JsonProperty()` let you decorate an attribute that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribute name mapped to the provide attribute.
 *
 * Here an example of different use cases with `@JsonProperty()`:
 *
 * ```typescript
 * class EventModel {
 *
 *    @JsonProperty()
 *    name: string;
 *
 *    @JsonProperty()
 *    @Format('date-time')
 *    startDate: Date;
 *
 *    @JsonProperty({name: 'end-date'}) // alias nam doesn't work with JsonSchema
 *    @Format('date-time')
 *    endDate: Date;
 *
 *    @PropertyType(Task) // eq. @Property({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * class TaskModel {
 *     @Property()
 *     subject: string;
 *
 *     @Minimum(0)  // Property or JsonProperty is not required when a JsonSchema decorator is used
 *     @Maximum(100)
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
 * By default Date, Array, Map and Set have a default custom Converter already embed. But you can override theses (see next part).
 *
 * For the Array, you must use the `@PropertyType` decorator.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribute source.
 *
 * According to the previous example, the JsonSchema generated will be as follow:
 *
 * ```typescript
 * {
 *    "type": "object",
 *    "properties": {
 *       "name": {
 *          "type": "string"
 *       },
 *       "startDate": {
 *          "type": "string",
 *          "format": "date-time"
 *       },
 *       "endDate": {
 *          "type": "string",
 *          "format": "date-time"
 *       },
 *       "tasks": {
 *          "type": "array",
 *          "items": {
 *             "$ref": "#/definitions/Task"
 *          }
 *       }
 *    },
 *    "definitions": {
 *      "Task": {
 *        "type": "object",
 *        "properties": {
 *          "subject": {
 *             "type": "string",
 *          },
 *          "rate": {
 *             "type": "number"
 *             "minimum": 0,
 *             "maximum: 100
 *          }
 *        }
 *      }
 *    }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @param options
 * @decorator
 * @converters
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
 * `@Property()` let you decorate an attribute that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribute name mapped to the provide attribute.
 *
 * Here an example of different use cases with `@Property()`:
 *
 * ```typescript
 * class EventModel {
 *
 *    @Property()
 *    name: string;
 *
 *    @Property()
 *    @Format('date-time')
 *    startDate: Date;
 *
 *    @Property({name: 'end-date'})
 *    @Format('date-time')
 *    endDate: Date;
 *
 *    @PropertyType(Task) // eq. @Property({use: Task})
 *    tasks: TaskModel[];
 * }
 *
 * class TaskModel {
 *     @Property()
 *     subject: string;
 *
 *     @Minimum(0)  // Property or JsonProperty is not required when a JsonSchema decorator is used
 *     @Maximum(100)
 *     rate: number;
 * }
 *
 * > Theses ES6 collections can be used: Map and Set. Map will be serialized as an object and Set as an array.
 * By default Date, Array, Map and Set have a default custom Converter already embed. But you can override theses (see next part).
 *
 * For the Array, you must use the `@PropertyType` decorator.
 * `TypeClass` will be used to deserialize each item in the collection stored on the attribute source.
 *
 * According to the previous example, the JsonSchema generated will be as follow:
 *
 * ```typescript
 * {
 *    "type": "object",
 *    "properties": {
 *       "name": {
 *          "type": "string"
 *       },
 *       "startDate": {
 *          "type": "string",
 *          "format": "date-time"
 *       },
 *       "endDate": {
 *          "type": "string",
 *          "format": "date-time"
 *       },
 *       "tasks": {
 *          "type": "array",
 *          "items": {
 *             "$ref": "#/definitions/Task"
 *          }
 *       }
 *    },
 *    "definitions": {
 *      "Task": {
 *        "type": "object",
 *        "properties": {
 *          "subject": {
 *             "type": "string",
 *          },
 *          "rate": {
 *             "type": "number"
 *             "minimum": 0,
 *             "maximum: 100
 *          }
 *        }
 *      }
 *    }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @param options
 */
export function Property(options?: IPropertyOptions | string) {
    return JsonProperty(options);
}