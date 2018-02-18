import {ParamRegistry} from "../registries/ParamRegistry";
/**
 * @module common/filters
 */
/** */
import {HeaderParamsFilter} from "../components/HeaderParamsFilter";

/**
 * HeaderParams return the value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@Header() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Get('/')
 *    get(@Header('x-token') token: string) {
 *       console.log('token', id);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @decorator
 * @returns {Function}
 */
export function HeaderParams(expression: string): Function {
    return ParamRegistry.decorate(HeaderParamsFilter, {expression});
}