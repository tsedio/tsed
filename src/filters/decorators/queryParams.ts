/**
 * @module common/filters
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {QueryParamsFilter} from "../components/QueryParamsFilter";
/**
 * QueryParams return the value from [request.query](http://expressjs.com/en/4x/api.html#req.query) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@QueryParams() query: any) {
 *       console.log('Entire query', query);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Get('/')
 *    get(@QueryParams('users', User) users: User[]) { // with deserialization
 *       console.log('users', users);
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
export function QueryParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(QueryParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
