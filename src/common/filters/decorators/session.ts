import {ParamRegistry} from "../registries/ParamRegistry";
import {SessionFilter} from "../components/SessionFilter";

/**
 * Session return the value from [request.session](http://expressjs.com/en/4x/api.html#req.session) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Session() session: any) {
 *       console.log('Entire session', session);
 *    }
 *
 *    @Post('/')
 *    create(@Session('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@Session() session: Session) { // with deserialization
 *       console.log('session', session);
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
export function Session(expression?: string | any, useType?: any): Function {
    return ParamRegistry.decorate(SessionFilter, {expression, useType});
}
