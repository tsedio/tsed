"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
/**
 * Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
 * This routing listing will be built with the `express.Router` object.
 *
 * ::: tip
 * See [Controllers](/docs/controllers.md) section for more details
 * :::
 *
 * ```typescript
 *  @Controller("/calendars")
 *  export provide CalendarCtrl {
 *
 *    @Get("/:id")
 *    public get(
 *      @Request() request: Express.Request,
 *      @Response() response: Express.Response,
 *      @Next() next: Express.NextFunction
 *    ): void {
 *
 *    }
 *  }
 * ```
 *
 * @param options
 * @param children
 * @returns {Function}
 * @decorator
 */
function Controller(options, ...children) {
    return (target) => {
        if (typeof options === "string" || options instanceof RegExp || core_1.isArrayOrArrayClass(options)) {
            di_1.registerController({
                provide: target,
                path: options,
                children
            });
        }
        else {
            di_1.registerController(Object.assign({ provide: target, children: options.dependencies || options.children }, options));
        }
    };
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map