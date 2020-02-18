"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allow_1 = require("./allow");
const core_1 = require("@tsed/core");
const getStorableMetadata_1 = require("./utils/getStorableMetadata");
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
 *   @Property()
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
 *   @Property()
 *   @Required()
 *   @Allow("")
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @converters
 */
function Required(...allowedRequiredValues) {
    return core_1.applyDecorators((...decoratorArgs) => {
        const metadata = getStorableMetadata_1.getStorableMetadata(decoratorArgs);
        if (!metadata) {
            throw new core_1.UnsupportedDecoratorType(Required, decoratorArgs);
        }
        metadata.required = true;
        if (allowedRequiredValues.length) {
            allow_1.Allow(...allowedRequiredValues)(...decoratorArgs);
        }
    }, core_1.StoreMerge("responses", {
        "400": {
            description: "BadRequest"
        }
    }));
}
exports.Required = Required;
//# sourceMappingURL=required.js.map