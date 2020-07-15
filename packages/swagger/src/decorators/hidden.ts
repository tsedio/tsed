import {StoreSet} from "@tsed/core";
// TODO ADD ignore on @tsed/schema level or implement something in tsed/swagger
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
 * @decorator
 * @swagger
 */
export function Hidden() {
  return StoreSet("hidden", true);
}
