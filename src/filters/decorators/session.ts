import {Type} from "../../core/interfaces";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
/**
 * @module common/filters
 */
/** */
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

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(SessionFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
