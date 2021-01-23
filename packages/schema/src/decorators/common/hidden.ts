import {StoreSet} from "@tsed/core";

/**
 * Disable documentation for the class and his endpoint.
 *
 * ````typescript
 * @Controller('/')
 * export class Ctrl {
 *
 *   @Get('/')
 *   @Hidden()
 *   hiddenRoute(){
 *
 *   }
 * }
 *
 * @Controller('/')
 * @Hidden()
 * export class Ctrl {
 *   @Get('/')
 *   hiddenRoute() {
 *
 *   }
 *   @Get('/2')
 *   hiddenRoute2() {
 *
 *   }
 * }
 * ```
 *
 * @decorator
 * @ignore
 */
export function Hidden() {
  return StoreSet("hidden", true);
}
