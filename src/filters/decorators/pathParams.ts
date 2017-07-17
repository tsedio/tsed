/**
 * @module common/filters
 */ /** */

import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {PathParamsFilter} from "../components/PathParamsFilter";
/**
 * PathParams return the value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@PathParams() params: any) {
 *       console.log('Entire params', params);
 *    }
 *
 *    @Get('/')
 *    get(@PathParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @returns {Function}
 */
export function PathParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(PathParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}