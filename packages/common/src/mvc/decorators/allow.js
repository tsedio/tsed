"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const decoratorSchemaFactory_1 = require("../../jsonschema/utils/decoratorSchemaFactory");
const getStorableMetadata_1 = require("./utils/getStorableMetadata");
/**
 * Add allowed values when the property or parameters is required.
 *
 * #### Example on parameter:
 *
 * ```typescript
 * @Post("/")
 * async method(@Required() @Allow("") @BodyParams("field") field: string) {}
 * ```
 * > Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.
 *
 * #### Example on model:
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
 */
function Allow(...allowedRequiredValues) {
    const allowNullInSchema = decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        if (schema && schema.mapper) {
            if (schema.mapper.$ref) {
                schema.mapper.oneOf = [{ type: "null" }, { $ref: schema.mapper.$ref }];
                delete schema.mapper.$ref;
            }
            else {
                schema.mapper.type = [].concat(schema.type, ["null"]);
            }
        }
    });
    return (...decoratorArgs) => {
        const metadata = getStorableMetadata_1.getStorableMetadata(decoratorArgs);
        if (!metadata) {
            throw new core_1.UnsupportedDecoratorType(Allow, decoratorArgs);
        }
        metadata.allowedRequiredValues = allowedRequiredValues;
        if (core_1.getDecoratorType(decoratorArgs, true) === "property" && allowedRequiredValues.some(e => e == null)) {
            allowNullInSchema(decoratorArgs[0], decoratorArgs[1]);
        }
    };
}
exports.Allow = Allow;
//# sourceMappingURL=allow.js.map