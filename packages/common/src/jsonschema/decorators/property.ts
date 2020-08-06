import {DecoratorParameters, isEmpty, Type} from "@tsed/core";
import * as util from "util";
import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";

/**
 * `@Property()` let you decorate an attribute that can be serialized or deserialized. By default, no parameters are required to use it.
 * But in some cases, we need to configure explicitly the JSON attribute name mapped to the provide attribute.
 *
 * Here an example of different use cases with `@Property()`:
 *
 * ```typescript
 * class EventModel {
 *    @Property()
 *    name: string;
 *
 *    @Format('date-time')
 *    startDate: Date;
 *
 *    @Name('end-date')
 *    @Format('date-time')
 *    endDate: Date;
 *
 *    @CollectionOf(Task)
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
 * For the Array, you must use the @@CollectionOf@@ decorator.
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
 * @validation
 * @swagger
 * @schema
 * @deprecated Use Property decorator instead
 */
// istanbul ignore next
export function JsonProperty(options?: IPropertyOptions | string): Function {
  return util.deprecate(Property(options), "Use property decorator instead");
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
 *    @Name('end-date')
 *    @Format('date-time')
 *    endDate: Date;
 *
 *    @CollectionOf(Task)
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
 * For the Array, you must use the @@CollectionOf@@ decorator.
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
 * @validation
 * @swagger
 * @schema
 */
export function Property(options?: IPropertyOptions | string): Function {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    /* istanbul ignore next */
    if (typeof options === "string") {
      util.deprecate(() => {
      }, "@Property(name: string) are deprecated. Use @Property(options:  IPropertyOptions) instead")();
      propertyMetadata.name = options as string;
    } else if (typeof options === "object") {
      propertyMetadata.name = options.name as string;

      if (!isEmpty((options as IPropertyOptions).use)) {
        propertyMetadata.type = (options as IPropertyOptions).use as Type<any>;
      }
    }
  });
}

/**
 * Decorator builder. Call your function with `propertyMetadata` and `DecoratorParameters` a input parameters
 * @decorator
 * @schema
 */
export function PropertyFn(fn: (propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void): Function {
  return (...parameters: any[]): any => {
    const propertyMetadata = PropertyMetadata.get(parameters[0], parameters[1]);
    const result: any = fn(propertyMetadata, parameters as DecoratorParameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
