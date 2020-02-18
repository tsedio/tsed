"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const util = require("util");
const PropertyRegistry_1 = require("../registries/PropertyRegistry");
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
 *    @Property({name: 'end-date'}) // alias nam doesn't work with JsonSchema
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
 *     @Minimum(0)  // Property or Property is not required when a JsonSchema decorator is used
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
 * @jsonschema
 * @property
 * @deprecated Use Property decorator instead
 */
// istanbul ignore next
function JsonProperty(options) {
    return util.deprecate(Property(options), "Use property decorator instead");
}
exports.JsonProperty = JsonProperty;
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
 *     @Minimum(0)  // Property or Property is not required when a JsonSchema decorator is used
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
 * @param options
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
function Property(options) {
    return PropertyFn((propertyMetadata) => {
        if (typeof options === "string") {
            util.deprecate(() => { }, "@Property(name: string) are deprecated. Use @Property(options:  IPropertyOptions) instead")();
            propertyMetadata.name = options;
        }
        else if (typeof options === "object") {
            propertyMetadata.name = options.name;
            if (!core_1.isEmpty(options.use)) {
                propertyMetadata.type = options.use;
            }
        }
    });
}
exports.Property = Property;
/**
 * Decorator builder. Call your function with `propertyMetadata` and `DecoratorParameters` a input parameters
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
function PropertyFn(fn) {
    return (...parameters) => {
        const propertyMetadata = PropertyRegistry_1.PropertyRegistry.get(parameters[0], parameters[1]);
        const result = fn(propertyMetadata, parameters);
        if (typeof result === "function") {
            result(...parameters);
        }
    };
}
exports.PropertyFn = PropertyFn;
//# sourceMappingURL=property.js.map