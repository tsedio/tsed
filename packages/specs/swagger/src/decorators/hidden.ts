import {Hidden as H} from "@tsed/schema";

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
 * @swagger
 */
export function Hidden() {
  return H();
}
