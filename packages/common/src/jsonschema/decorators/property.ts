import {Type} from "@tsed/core";
import {Property as P} from "@tsed/schema";

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
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Since v6. Use @Property() from @tsed/schema
 */
export function Property(type?: Type<any>): PropertyDecorator;
/**
 * @ignore
 * @deprecated Since v6. Use @Property() from @tsed/schema
 */
export function Property(generic: string): PropertyDecorator;
/**
 * @ignore
 * @deprecated Since v6. Use @Property() from @tsed/schema
 */
export function Property(type?: string | Type<any>): Function {
  return P(type);
}

export * from "./propertyFn";
