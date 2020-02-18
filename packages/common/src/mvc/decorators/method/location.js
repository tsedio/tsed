"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useAfter_1 = require("./useAfter");
/**
 * Sets the response Location HTTP header to the specified path parameter.
 *
 * ```typescript
 *  @Location('/foo/bar')
 *  @Location('http://example.com')
 *  @Location('back')
 *  private myMethod() {
 *
 *  }
 * ```
 *
 * A path value of “back” has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the `Referer` header was not specified, it refers to “/”.
 *
 * @param location
 * @returns {Function}
 * @decorator
 * @endpoint
 */
function Location(location) {
    return useAfter_1.UseAfter((request, response, next) => {
        response.location(location);
        next();
    });
}
exports.Location = Location;
//# sourceMappingURL=location.js.map