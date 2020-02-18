"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
/**
 * @module common/mvc
 */
/** */
const useAfter_1 = require("./useAfter");
/**
 * Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
 * If type contains the “/” character, then it sets the `Content-Type` to type.
 *
 * ```typescript
 *  @ContentType('.html');              // => 'text/html'
 *  @ContentType('html');               // => 'text/html'
 *  @ContentType('json');               // => 'application/json'
 *  @ContentType('application/json');   // => 'application/json'
 *  @ContentType('png');                // => image/png
 *  private myMethod() {}
 * ```
 *
 * @param type
 * @returns {Function}
 * @decorator
 * @endpoint
 */
function ContentType(type) {
    return core_1.applyDecorators(core_1.StoreMerge("produces", [type]), useAfter_1.UseAfter((request, response, next) => {
        response.type(type);
        next();
    }));
}
exports.ContentType = ContentType;
//# sourceMappingURL=contentType.js.map