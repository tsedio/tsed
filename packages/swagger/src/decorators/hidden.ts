import {StoreSet} from "@tsed/core";

/**
 * Hide a route or all route under in the decorated controller from the documentation.
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
 *
 * @Controller('/')
 * export class Ctrl {
 *   @Get('/')
 *   hiddenRoute(@Hidden() @QueryParams() param: string){
 *
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Hidden() {
  return StoreSet("hidden", true);
}
