/**
 * @module common/filters
 */
/** */

import {CookiesFilter} from "../components/CookiesFilter";
import {ParamRegistry} from "../registries/ParamRegistry";

/**
 * Cookies o CookiesParams return the value from [request.cookies](http://expressjs.com/en/4x/api.html#req.cookies) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Cookies() cookies: any) {
 *       console.log('Entire cookies', cookies);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('users', User) users: User[]) { // with deserialization
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
export function CookiesParams(expression?: string | any, useType?: any): Function {
    return ParamRegistry.decorate(CookiesFilter, {expression, useType});
}

/**
 * Cookies o CookiesParams return the value from [request.cookies](http://expressjs.com/en/4x/api.html#req.cookies) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Post('/')
 *    create(@Cookies() body: any) {
 *       console.log('Entire body', body);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('id') id: string) {
 *       console.log('ID', id);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('user') user: User) { // with deserialization
 *       console.log('user', user);
 *    }
 *
 *    @Post('/')
 *    create(@Cookies('users', User) users: User[]) { // with deserialization
 *       console.log('users', users);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the class that to be used to deserialize the data.
 * @decorator
 * @aliasof CookiesParams
 * @returns {Function}
 */
export function Cookies(expression?: string | any, useType?: any): Function {
    return CookiesParams(expression, useType);
}

